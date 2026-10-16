import { NextResponse } from "next/server";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentAdminUser } from "@/lib/auth";
import {
  readPageContentCache,
  writePageContentCache,
} from "@/lib/cms-service";
import type { PageContent, PageContentType } from "@/types/cms";

const CONTENT_TYPES: PageContentType[] = ["text", "image", "video"];

function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status },
  );
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
  if (!CONTENT_TYPES.includes(contentType as PageContentType)) {
    throw new Error("content_type must be one of: text, image, video.");
  }
  if (typeof value !== "string") throw new Error("value must be a string.");
  if (mediaUrl !== null && mediaUrl !== undefined && typeof mediaUrl !== "string") {
    throw new Error("media_url must be a string or null.");
  }
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("sort_order must be a non-negative integer.");
  }
  if (typeof isActive !== "boolean") throw new Error("is_active must be a boolean.");

  const now = new Date().toISOString();
  return {
    id: typeof input.id === "string" && input.id ? input.id : existing?.id || crypto.randomUUID(),
    page_slug: pageSlug.trim(),
    content_key: contentKey.trim(),
    label: label.trim(),
    content_type: contentType as PageContentType,
    value,
    media_url: mediaUrl || null,
    alt_text: altText || null,
    sort_order: sortOrder,
    is_active: isActive,
    created_at: existing?.created_at || input.created_at || now,
    updated_at: now,
  };
}

function upsertLocalRows(current: PageContent[], inputs: PageContentInput[]): PageContent[] {
  const next = [...current];
  for (const input of inputs) {
    const inputPage = input.page_slug ?? input.pageSlug;
    const inputKey = input.content_key ?? input.contentKey ?? input.key;
    const index = next.findIndex((row) =>
      (typeof input.id === "string" && input.id && row.id === input.id) ||
      (typeof inputPage === "string" && typeof inputKey === "string" &&
        row.page_slug === inputPage && row.content_key === inputKey),
    );
    const row = normalizeRow(input, index >= 0 ? next[index] : undefined);
    if (index >= 0) next[index] = row;
    else next.push(row);
  }
  return next.sort((a, b) => a.page_slug.localeCompare(b.page_slug) || a.sort_order - b.sort_order);
}

export async function GET(req: Request) {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) {
    return errorResponse("Unauthorized. Sign in with an active admin account to manage page content.", 401);
  }

  const pageSlug = new URL(req.url).searchParams.get("page_slug") || new URL(req.url).searchParams.get("page") || new URL(req.url).searchParams.get("slug");
  const localRows = readPageContentCache();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    let query = supabase.from("cms_page_content").select("*").order("page_slug").order("sort_order");
    if (pageSlug) query = query.eq("page_slug", pageSlug);
    const { data, error } = await query;
    if (!error) {
      const pageContent = data || [];
      return NextResponse.json({ success: true, data: pageContent, page_content: pageContent, source: "supabase" });
    }
    return NextResponse.json({
      success: true,
      data: filterRows(localRows, pageSlug),
      page_content: filterRows(localRows, pageSlug),
      source: "local",
      warning: "Supabase page content could not be read; showing the local cache.",
      supabase_error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    data: filterRows(localRows, pageSlug),
    page_content: filterRows(localRows, pageSlug),
    source: "local",
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
  try {
    rows = upsertLocalRows(readPageContentCache(), inputs as PageContentInput[]);
    writePageContentCache(rows);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid page-content payload.", 400);
  }

  const changedKeys = new Set(
    (inputs as PageContentInput[]).map((input) => {
      const pageSlug = input.page_slug ?? input.pageSlug;
      const contentKey = input.content_key ?? input.contentKey ?? input.key;
      return `${pageSlug}:${contentKey}`;
    }),
  );
  const changedIds = new Set(
    (inputs as PageContentInput[])
      .map((input) => input.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0),
  );
  const changedRows = rows.filter((row) =>
    changedIds.has(row.id) || changedKeys.has(`${row.page_slug}:${row.content_key}`),
  );
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const supabaseRows = changedRows.map((row) => (isUuid(row.id) ? row : { ...row, id: undefined }));
  const { data, error } = await supabase
    .from("cms_page_content")
    .upsert(supabaseRows, { onConflict: "page_slug,content_key" })
    .select("*");
  if (error) {
    return errorResponse(
      "Saved to the local cache, but Supabase rejected the page-content update.",
      502,
      { supabase_error: error.message, local_cache_persisted: true },
    );
  }

  const persistedRows = (data || changedRows) as PageContent[];
  const persistedKeys = new Set(persistedRows.map((row) => `${row.page_slug}:${row.content_key}`));
  writePageContentCache([
    ...rows.filter((row) => !persistedKeys.has(`${row.page_slug}:${row.content_key}`)),
    ...persistedRows,
  ]);
  return NextResponse.json({ success: true, data: persistedRows, page_content: persistedRows, local_cache_persisted: true, supabase_persisted: true });
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

  const currentRows = readPageContentCache();
  const remainingRows = currentRows.filter((row) =>
    id ? row.id !== id : !(row.page_slug === pageSlug && row.content_key === contentKey),
  );
  try {
    writePageContentCache(remainingRows);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to update the local cache.", 500);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      success: true,
      local_cache_persisted: true,
      supabase_persisted: false,
      warning: isSupabaseConfigured()
        ? "Removed from the local cache, but Supabase admin credentials are unavailable."
        : "Removed from the local cache; Supabase is not configured.",
    });
  }

  let query = supabase.from("cms_page_content").delete();
  query = id ? query.eq("id", id) : query.eq("page_slug", pageSlug!).eq("content_key", contentKey!);
  const { error } = await query;
  if (error) {
    return errorResponse(
      "Removed from the local cache, but Supabase rejected the deletion.",
      502,
      { supabase_error: error.message, local_cache_persisted: true },
    );
  }

  return NextResponse.json({ success: true, local_cache_persisted: true, supabase_persisted: true });
}
