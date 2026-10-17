import { NextResponse } from "next/server";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentAdminUser } from "@/lib/auth";
import {
  readPageContentCache,
  writePageContentCache,
} from "@/lib/cms-service";
import type { PageContent, PageContentType } from "@/types/cms";

const CONTENT_TYPES: PageContentType[] = ["text", "image", "video"];
const PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTENT_KEY_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const SAFE_ID_PATTERN = /^[a-zA-Z0-9._-]{1,128}$/;
const MAX_VALUE_LENGTH = 200_000;
const MAX_LABEL_LENGTH = 200;
const MAX_ALT_TEXT_LENGTH = 500;

function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status },
  );
}

function databaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function filterRows(rows: PageContent[], pageSlug: string | null): PageContent[] {
  return pageSlug ? rows.filter((row) => row.page_slug === pageSlug) : rows;
}

function isSafeUrl(value: string): boolean {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validatePageSlug(value: string, field = "page_slug"): string {
  const normalized = value.trim();
  if (!PAGE_SLUG_PATTERN.test(normalized) || normalized.length > 80) {
    throw new Error(`${field} must contain only lowercase letters, numbers, and single hyphens.`);
  }
  return normalized;
}

function validateContentKey(value: string): string {
  const normalized = value.trim();
  if (!CONTENT_KEY_PATTERN.test(normalized) || normalized.length > 120) {
    throw new Error("content_key must contain only lowercase letters, numbers, dots, underscores, and hyphens.");
  }
  return normalized;
}

function validateRequestIdentifier(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !SAFE_ID_PATTERN.test(value)) {
    throw new Error("id must be a safe identifier.");
  }
  return value;
}

type PageContentInput = Partial<PageContent> & {
  pageSlug?: string;
  contentKey?: string;
  key?: string;
  mediaUrl?: string | null;
  active?: boolean;
};

function normalizeRow(input: PageContentInput, existing?: PageContent): PageContent {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Each page-content item must be a JSON object.");
  }
  const pageSlug = input.page_slug ?? input.pageSlug ?? existing?.page_slug;
  const contentKey = input.content_key ?? input.contentKey ?? input.key ?? existing?.content_key;
  const label = input.label ?? existing?.label;
  const contentType = input.content_type ?? existing?.content_type;
  const value = input.value ?? existing?.value ?? "";
  const mediaUrl = input.media_url ?? input.mediaUrl ?? existing?.media_url ?? null;
  const altText = input.alt_text ?? existing?.alt_text ?? null;
  const sortOrder = input.sort_order ?? existing?.sort_order ?? 0;
  const isActive = input.is_active ?? input.active ?? existing?.is_active ?? true;

  if (typeof pageSlug !== "string" || !pageSlug.trim()) throw new Error("page_slug is required.");
  if (typeof contentKey !== "string" || !contentKey.trim()) throw new Error("content_key is required.");
  if (typeof label !== "string" || !label.trim()) throw new Error("label is required.");
  if (label.trim().length > MAX_LABEL_LENGTH) throw new Error("label is too long.");
  if (!CONTENT_TYPES.includes(contentType as PageContentType)) {
    throw new Error("content_type must be one of: text, image, video.");
  }
  if (typeof value !== "string") throw new Error("value must be a string.");
  if (value.length > MAX_VALUE_LENGTH) throw new Error("value is too large.");
  if (mediaUrl !== null && mediaUrl !== undefined && typeof mediaUrl !== "string") {
    throw new Error("media_url must be a string or null.");
  }
  if (typeof altText !== "string" && altText !== null && altText !== undefined) {
    throw new Error("alt_text must be a string or null.");
  }
  if (typeof altText === "string" && altText.length > MAX_ALT_TEXT_LENGTH) {
    throw new Error("alt_text is too long.");
  }
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("sort_order must be a non-negative integer.");
  }
  if (typeof isActive !== "boolean") throw new Error("is_active must be a boolean.");

  const normalizedMediaUrl = typeof mediaUrl === "string" ? mediaUrl.trim() : null;
  const normalizedValue = contentType === "text" ? value : value.trim();
  if (contentType === "text" && normalizedMediaUrl) {
    throw new Error("Text content cannot include media_url.");
  }
  if (normalizedMediaUrl && !isSafeUrl(normalizedMediaUrl)) {
    throw new Error("media_url must be an http(s) URL or a root-relative path.");
  }
  if (contentType !== "text" && normalizedValue.trim() && !isSafeUrl(normalizedValue.trim())) {
    throw new Error("Image and video content must use an http(s) URL or a root-relative media path.");
  }

  const now = new Date().toISOString();
  return {
    id: validateRequestIdentifier(input.id) || existing?.id || crypto.randomUUID(),
    page_slug: validatePageSlug(pageSlug),
    content_key: validateContentKey(contentKey),
    label: label.trim(),
    content_type: contentType as PageContentType,
    value: normalizedValue,
    media_url: normalizedMediaUrl || null,
    alt_text: typeof altText === "string" ? altText.trim() || null : null,
    sort_order: sortOrder,
    is_active: isActive,
    created_at: existing?.created_at || input.created_at || now,
    updated_at: now,
  };
}

function upsertLocalRows(current: PageContent[], inputs: PageContentInput[]): { rows: PageContent[]; changedRows: PageContent[] } {
  const next = [...current];
  const changedRows: PageContent[] = [];
  const requestKeys = new Set<string>();
  const requestIds = new Set<string>();
  for (const input of inputs) {
    const inputPage = input.page_slug ?? input.pageSlug;
    const inputKey = input.content_key ?? input.contentKey ?? input.key;
    const normalizedPage = typeof inputPage === "string" ? validatePageSlug(inputPage) : undefined;
    const normalizedKey = typeof inputKey === "string" ? validateContentKey(inputKey) : undefined;
    const requestKey = normalizedPage && normalizedKey ? `${normalizedPage}:${normalizedKey}` : undefined;
    const requestId = validateRequestIdentifier(input.id);
    if (requestKey && requestKeys.has(requestKey)) {
      throw new Error(`Duplicate page-content key in request: ${requestKey}`);
    }
    if (requestId && requestIds.has(requestId)) {
      throw new Error(`Duplicate page-content id in request: ${requestId}`);
    }
    if (requestKey) requestKeys.add(requestKey);
    if (requestId) requestIds.add(requestId);
    const index = next.findIndex((row) =>
      (requestId && row.id === requestId) ||
      (normalizedPage && normalizedKey && row.page_slug === normalizedPage && row.content_key === normalizedKey),
    );
    const row = normalizeRow(input, index >= 0 ? next[index] : undefined);
    if (index >= 0) next[index] = row;
    else next.push(row);
    changedRows.push(row);
  }
  const seenKeys = new Set<string>();
  for (const row of next) {
    const key = `${row.page_slug}:${row.content_key}`;
    if (seenKeys.has(key)) throw new Error(`Duplicate page-content key: ${key}`);
    seenKeys.add(key);
  }
  return {
    rows: next.sort((a, b) => a.page_slug.localeCompare(b.page_slug) || a.sort_order - b.sort_order),
    changedRows,
  };
}

function responseMetadata(source: "supabase" | "local", rows: PageContent[], pageSlug: string | null, remoteAvailable: boolean) {
  return {
    source,
    count: rows.length,
    page_slug: pageSlug,
    supabase_configured: isSupabaseConfigured(),
    remote_available: remoteAvailable,
  };
}

async function writeAuditLog(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  currentUser: Awaited<ReturnType<typeof getCurrentAdminUser>>,
  action: "CREATE_PAGE_CONTENT" | "UPDATE_PAGE_CONTENT" | "DELETE_PAGE_CONTENT",
  resourceId: string | undefined,
  details: Record<string, unknown>,
): Promise<string | null> {
  if (!currentUser) return "Unable to identify the admin actor for the audit log.";
  try {
    const { error } = await supabase.from("audit_logs").insert({
      user_id: isUuid(currentUser.id) ? currentUser.id : null,
      user_email: currentUser.email,
      action,
      resource_type: "PAGE_CONTENT",
      resource_id: resourceId && isUuid(resourceId) ? resourceId : null,
      details,
    });
    return error ? error.message : null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export async function GET(req: Request) {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) {
    return errorResponse("Unauthorized. Sign in with an active admin account to manage page content.", 401);
  }

  const searchParams = new URL(req.url).searchParams;
  const pageSlugParam = searchParams.get("page_slug") || searchParams.get("page") || searchParams.get("slug");
  let pageSlug: string | null = null;
  try {
    pageSlug = pageSlugParam ? validatePageSlug(pageSlugParam) : null;
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid page slug.", 400);
  }
  const localRows = readPageContentCache();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    let query = supabase.from("cms_page_content").select("*").order("page_slug").order("sort_order");
    if (pageSlug) query = query.eq("page_slug", pageSlug);
    let data: PageContent[] | null = null;
    let supabaseError: string | null = null;
    try {
      const result = await query;
      data = result.data as PageContent[] | null;
      if (result.error) supabaseError = databaseErrorMessage(result.error);
    } catch (error) {
      supabaseError = databaseErrorMessage(error);
    }
    if (!supabaseError) {
      const pageContent = data || [];
      return NextResponse.json({ success: true, data: pageContent, page_content: pageContent, ...responseMetadata("supabase", pageContent, pageSlug, true) });
    }
    const fallbackRows = filterRows(localRows, pageSlug);
    return NextResponse.json({
      success: true,
      data: fallbackRows,
      page_content: fallbackRows,
       ...responseMetadata("local", fallbackRows, pageSlug, false),
      warning: "Supabase page content could not be read; showing the local cache.",
      supabase_error: supabaseError,
    });
  }

  const fallbackRows = filterRows(localRows, pageSlug);
  return NextResponse.json({
    success: true,
    data: fallbackRows,
    page_content: fallbackRows,
    ...responseMetadata("local", fallbackRows, pageSlug, false),
    warning: isSupabaseConfigured()
      ? "Supabase admin credentials are unavailable; showing the local cache."
      : "Supabase is not configured; showing the local cache.",
  });
}

export async function POST(req: Request) {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) {
    return errorResponse("Unauthorized. Sign in with an active admin account to manage page content.", 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const inputs = Array.isArray(body)
    ? body
    : body && typeof body === "object" && Array.isArray((body as { items?: unknown[] }).items)
      ? (body as { items: unknown[] }).items
      : body && typeof body === "object" && Array.isArray((body as { page_content?: unknown[] }).page_content)
        ? (body as { page_content: unknown[] }).page_content
      : [body];
  if (inputs.length === 0) return errorResponse("Provide one page-content object or a non-empty array.", 400);

  let rows: PageContent[];
  let changedRows: PageContent[];
  const currentRows = readPageContentCache();
  try {
    ({ rows, changedRows } = upsertLocalRows(currentRows, inputs as PageContentInput[]));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid page-content payload.", 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    try {
      writePageContentCache(rows);
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : "Unable to persist the local page-content cache.", 500);
    }
    return NextResponse.json({
      success: true,
      data: changedRows,
      page_content: changedRows,
      local_cache_persisted: true,
      supabase_persisted: false,
      warning: isSupabaseConfigured()
        ? "Saved to the local cache, but Supabase admin credentials are unavailable."
        : "Saved to the local cache; Supabase is not configured.",
    });
  }

  const supabaseRows = changedRows.map((row) => {
    if (isUuid(row.id)) return row;
    const withoutLocalId = Object.fromEntries(
      Object.entries(row).filter(([key]) => key !== "id"),
    );
    return withoutLocalId;
  });
  let data: PageContent[] | null = null;
  let supabaseError: string | null = null;
  try {
    const result = await supabase
      .from("cms_page_content")
      .upsert(supabaseRows, { onConflict: "page_slug,content_key" })
      .select("*");
    data = result.data as PageContent[] | null;
    if (result.error) supabaseError = databaseErrorMessage(result.error);
  } catch (error) {
    supabaseError = databaseErrorMessage(error);
  }
  if (supabaseError) {
    return errorResponse(
      "Supabase rejected the page-content update; the local cache was not changed.",
      502,
      { supabase_error: supabaseError, local_cache_persisted: false, supabase_persisted: false },
    );
  }
  if (!data || data.length !== changedRows.length) {
    return errorResponse(
      "Supabase did not return all persisted page-content rows; the local cache was not changed.",
      502,
      { local_cache_persisted: false, supabase_persisted: false, expected_rows: changedRows.length, returned_rows: data?.length || 0 },
    );
  }

  const persistedRows = data;
  const persistedKeys = new Set(persistedRows.map((row) => `${row.page_slug}:${row.content_key}`));
  const nextCacheRows = [
    ...currentRows.filter((row) => !persistedKeys.has(`${row.page_slug}:${row.content_key}`)),
    ...persistedRows,
  ];
  const auditErrors = await Promise.all(
    persistedRows.map((row) => writeAuditLog(
      supabase,
      currentUser,
      currentRows.some((existing) => existing.id === row.id || (existing.page_slug === row.page_slug && existing.content_key === row.content_key))
        ? "UPDATE_PAGE_CONTENT"
        : "CREATE_PAGE_CONTENT",
      row.id,
      { page_slug: row.page_slug, content_key: row.content_key, message: "Page content saved." },
    )),
  );
  try {
    writePageContentCache(nextCacheRows);
  } catch (error) {
    return errorResponse(
      "Page content was saved to Supabase, but the local cache could not be updated.",
      500,
      { supabase_persisted: true, local_cache_persisted: false, cache_error: error instanceof Error ? error.message : "Unknown cache error." },
    );
  }
  const auditWarning = auditErrors.find(Boolean) || undefined;
  return NextResponse.json({ success: true, data: persistedRows, page_content: persistedRows, local_cache_persisted: true, supabase_persisted: true, ...(auditWarning ? { audit_warning: auditWarning } : {}) });
}

export async function DELETE(req: Request) {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) {
    return errorResponse("Unauthorized. Sign in with an active admin account to manage page content.", 401);
  }

  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  const pageSlug = params.get("page_slug") || params.get("page") || params.get("slug");
  const contentKey = params.get("content_key") || params.get("key");
  if (!id && (!pageSlug || !contentKey)) {
    return errorResponse("Provide id, or both page_slug and content_key, to remove page content.", 400);
  }

  let validatedId: string | undefined;
  try {
    validatedId = validateRequestIdentifier(id || undefined);
    if (pageSlug) validatePageSlug(pageSlug);
    if (contentKey) validateContentKey(contentKey);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid page-content identifier.", 400);
  }

  const currentRows = readPageContentCache();
  const remainingRows = currentRows.filter((row) =>
    validatedId ? row.id !== validatedId : !(row.page_slug === pageSlug && row.content_key === contentKey),
  );

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    try {
      writePageContentCache(remainingRows);
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : "Unable to update the local cache.", 500);
    }
    return NextResponse.json({
      success: true,
      local_cache_persisted: true,
      supabase_persisted: false,
      warning: isSupabaseConfigured()
        ? "Removed from the local cache, but Supabase admin credentials are unavailable."
        : "Removed from the local cache; Supabase is not configured.",
    });
  }

  const cachedTarget = validatedId ? currentRows.find((row) => row.id === validatedId) : undefined;
  let query = supabase.from("cms_page_content").delete();
  if (validatedId && isUuid(validatedId)) {
    query = query.eq("id", validatedId);
  } else {
    const targetPageSlug = pageSlug || cachedTarget?.page_slug;
    const targetContentKey = contentKey || cachedTarget?.content_key;
    if (!targetPageSlug || !targetContentKey) {
      return errorResponse("A page slug and content key are required to remove a local-only item from Supabase.", 400);
    }
    query = query.eq("page_slug", targetPageSlug).eq("content_key", targetContentKey);
  }
  let supabaseError: string | null = null;
  try {
    const result = await query;
    if (result.error) supabaseError = databaseErrorMessage(result.error);
  } catch (error) {
    supabaseError = databaseErrorMessage(error);
  }
  if (supabaseError) {
    return errorResponse(
      "Supabase rejected the deletion; the local cache was not changed.",
      502,
      { supabase_error: supabaseError, local_cache_persisted: false, supabase_persisted: false },
    );
  }

  const auditError = await writeAuditLog(
    supabase,
    currentUser,
    "DELETE_PAGE_CONTENT",
    validatedId,
    { page_slug: pageSlug, content_key: contentKey, identifier: validatedId, message: "Page content deleted." },
  );
  try {
    writePageContentCache(remainingRows);
  } catch (error) {
    return errorResponse(
      "Page content was deleted from Supabase, but the local cache could not be updated.",
      500,
      { supabase_persisted: true, local_cache_persisted: false, cache_error: error instanceof Error ? error.message : "Unknown cache error." },
    );
  }

  return NextResponse.json({ success: true, local_cache_persisted: true, supabase_persisted: true, ...(auditError ? { audit_warning: auditError } : {}) });
}
