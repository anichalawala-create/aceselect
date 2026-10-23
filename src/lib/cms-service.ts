/**
 * CMS Service Layer
 * 
 * All public website data is fetched through this service layer.
 * When Supabase is connected, it reads from the database.
 * Until then, it falls back to the static data files.
 * 
 * This allows the public site to work NOW and migrate seamlessly.
 */

import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import type {
  HeroContent,
  HomeStat,
  HomeAboutSection,
  HomeProcessStep,
  PanIndiaStat,
  CMSProject,
  CMSProduct,
  ProductCategory,
  CMSClient,
  CMSTestimonial,
  CMSCertification,
  SiteSettings,
  PageSEO,
  TeamMemberCMS,
  CMSEnquiry,
  CompanyPage,
  PageContent,
  PageContentMap,
} from "@/types/cms";

// ================================================================
// Helper: Read local CMS cache JSON file (written by Admin panel)
// ================================================================
function readCacheSection<T>(section: string, fallback: T): T {
  try {
    const cachePath = path.resolve(process.cwd(), "src/data/cms-content-cache.json");
    if (fs.existsSync(cachePath)) {
      const raw = fs.readFileSync(cachePath, "utf-8");
      const data = JSON.parse(raw);
      if (data && data[section] !== undefined && data[section] !== null) {
        return data[section] as T;
      }
    }
  } catch (err) {
    console.warn(`[CMS] Error reading cache for ${section}:`, err);
  }
  return fallback;
}

const CMS_CACHE_PATH = path.resolve(process.cwd(), "src/data/cms-content-cache.json");

/** Read all page-content rows from the local cache, including inactive admin rows. */
export function readPageContentCache(): PageContent[] {
  const cached = readCacheSection<unknown>("page_content", []);
  if (Array.isArray(cached)) return cached as PageContent[];

  // Accept a page-slug keyed cache as well, which makes hand-editing the fallback
  // file convenient without changing the public service contract.
  if (cached && typeof cached === "object") {
    return Object.values(cached as Record<string, unknown>)
      .flatMap((rows) => (Array.isArray(rows) ? rows : [rows])) as PageContent[];
  }

  return [];
}

/** Persist page-content rows while preserving the other CMS cache sections. */
export function writePageContentCache(rows: PageContent[]): void {
  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        cache = parsed as Record<string, unknown>;
      }
    }
    cache.page_content = rows;
    fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");
  } catch (err) {
    console.warn("[CMS] Error writing page-content cache:", err);
    throw new Error("Unable to persist the local page-content cache.");
  }
}

const HOME_HERO_BACKGROUND_KEY = "hero.background";
const HOME_HERO_POSTER_KEY = "hero.poster";

/**
 * Keep the legacy Homepage > Hero media save path in sync with the page-content
 * cache used by public pages. The page-content row remains the public override,
 * so the Page Content editor keeps its existing precedence.
 */
export function syncHomeHeroVideoCache(videoUrl: unknown, posterUrl?: unknown): void {
  if (typeof videoUrl !== "string" && typeof posterUrl !== "string") return;

  const normalizedVideoUrl = typeof videoUrl === "string" ? videoUrl.trim() : null;
  const normalizedPosterUrl = typeof posterUrl === "string" ? posterUrl.trim() : null;
  const rows = readPageContentCache();
  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        cache = parsed as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.warn("[CMS] Error reading hero cache:", error);
  }
  const cachedHero = cache.hero && typeof cache.hero === "object" && !Array.isArray(cache.hero)
    ? (cache.hero as Record<string, unknown>)
    : {};
  const now = new Date().toISOString();

  if (normalizedVideoUrl) {
    const existingIndex = rows.findIndex(
      (row) => row.page_slug === "home" && row.content_key === HOME_HERO_BACKGROUND_KEY,
    );
    if (existingIndex >= 0) {
      rows[existingIndex] = {
        ...rows[existingIndex],
        content_type: "video",
        value: normalizedVideoUrl,
        media_url: normalizedVideoUrl || null,
        updated_at: now,
      };
    } else {
      rows.push({
        id: "local-home-hero-background",
        page_slug: "home",
        content_key: HOME_HERO_BACKGROUND_KEY,
        label: "Hero background video",
        content_type: "video",
        value: normalizedVideoUrl,
        media_url: normalizedVideoUrl || null,
        alt_text: "ACE SELECT hero video",
        sort_order: 30,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
    cachedHero.background_video_url = normalizedVideoUrl;
  }

  if (normalizedPosterUrl) {
    const posterIndex = rows.findIndex(
      (row) => row.page_slug === "home" && row.content_key === HOME_HERO_POSTER_KEY,
    );
    if (posterIndex >= 0) {
      rows[posterIndex] = {
        ...rows[posterIndex],
        content_type: "image",
        value: normalizedPosterUrl,
        media_url: normalizedPosterUrl || null,
        updated_at: now,
      };
    } else {
      rows.push({
        id: "local-home-hero-poster",
        page_slug: "home",
        content_key: HOME_HERO_POSTER_KEY,
        label: "Hero poster image",
        content_type: "image",
        value: normalizedPosterUrl,
        media_url: normalizedPosterUrl || null,
        alt_text: "ACE SELECT homepage hero poster",
        sort_order: 31,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
    cachedHero.poster_url = normalizedPosterUrl;
  }

  cache.page_content = rows;
  cache.hero = cachedHero;
  fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");
}

/**
 * Keep the Who We Are page hero video in sync with the company section cache.
 * When admin saves a video via the Company admin panel, this mirrors it to the
 * who-we-are page-content row so the public page picks it up immediately.
 */
export function syncCompanyVideoCache(videoUrl: unknown): void {
  if (typeof videoUrl !== "string") return;

  const normalizedUrl = videoUrl.trim();
  const rows = readPageContentCache();
  const now = new Date().toISOString();
  const existingIndex = rows.findIndex(
    (row) => row.page_slug === "who-we-are" && row.content_key === "hero.video",
  );

  if (existingIndex >= 0) {
    rows[existingIndex] = {
      ...rows[existingIndex],
      content_type: "video",
      value: normalizedUrl,
      media_url: normalizedUrl || null,
      updated_at: now,
    };
  } else {
    rows.push({
      id: "local-who-we-are-hero-video",
      page_slug: "who-we-are",
      content_key: "hero.video",
      label: "Who We Are hero background video",
      content_type: "video",
      value: normalizedUrl,
      media_url: normalizedUrl || null,
      alt_text: "ACE SELECT company hero video",
      sort_order: 10,
      is_active: true,
      created_at: now,
      updated_at: now,
    });
  }

  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        cache = parsed as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.warn("[CMS] Error reading company video cache:", error);
  }
  cache.page_content = rows;
  fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");
}

/**
 * Mirror a legacy hero video save into the remote page-content row. Existing
 * editor metadata is preserved; only the media fields are synchronized.
 */
export async function syncHomeHeroVideoPageContent(
  supabase: SupabaseClient,
  videoUrl: unknown,
  posterUrl?: unknown,
): Promise<void> {
  const normalizedVideoUrl = typeof videoUrl === "string" ? videoUrl.trim() : null;
  const normalizedPosterUrl = typeof posterUrl === "string" ? posterUrl.trim() : null;

  if (normalizedVideoUrl) {
    const { data: existing, error: lookupError } = await supabase
      .from("cms_page_content")
      .select("id")
      .eq("page_slug", "home")
      .eq("content_key", HOME_HERO_BACKGROUND_KEY)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const mediaFields = {
      content_type: "video",
      value: normalizedVideoUrl,
      media_url: normalizedVideoUrl || null,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("cms_page_content")
        .update(mediaFields)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("cms_page_content").insert({
        page_slug: "home",
        content_key: HOME_HERO_BACKGROUND_KEY,
        label: "Hero background video",
        ...mediaFields,
        alt_text: "ACE SELECT hero video",
        sort_order: 30,
        is_active: true,
      });
      if (error) throw error;
    }
  }

  if (normalizedPosterUrl) {
    const { data: existingPoster, error: posterLookupError } = await supabase
      .from("cms_page_content")
      .select("id")
      .eq("page_slug", "home")
      .eq("content_key", HOME_HERO_POSTER_KEY)
      .maybeSingle();

    if (posterLookupError) throw posterLookupError;

    const posterFields = {
      content_type: "image",
      value: normalizedPosterUrl,
      media_url: normalizedPosterUrl || null,
    };

    if (existingPoster?.id) {
      const { error } = await supabase
        .from("cms_page_content")
        .update(posterFields)
        .eq("id", existingPoster.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("cms_page_content").insert({
        page_slug: "home",
        content_key: HOME_HERO_POSTER_KEY,
        label: "Hero poster image",
        ...posterFields,
        alt_text: "ACE SELECT homepage hero poster",
        sort_order: 31,
        is_active: true,
      });
      if (error) throw error;
    }
  }
}

/** Mirror a Page Content editor save into the legacy hero_content row. */
export async function syncHomeHeroVideoHeroContent(
  supabase: SupabaseClient,
  videoUrl: unknown,
): Promise<void> {
  if (typeof videoUrl !== "string") return;

  const { data: existingRows, error: lookupError } = await supabase
    .from("hero_content")
    .select("id")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (lookupError) throw lookupError;

  const mediaFields = { background_video_url: videoUrl.trim() || null };
  const existing = existingRows?.[0];
  if (existing?.id) {
    const { error } = await supabase
      .from("hero_content")
      .update(mediaFields)
      .eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("hero_content").insert(mediaFields);
  if (error) throw error;
}

/**
 * Synchronize full Homepage > Hero content (text, CTAs, vertical labels, media)
 * into both the local page_content cache and the cms_page_content remote table.
 */
export async function syncHomeHeroContent(
  supabase: SupabaseClient | null,
  data: Record<string, unknown>,
): Promise<void> {
  const textFields = [
    { key: "hero.eyebrow", label: "Hero eyebrow", value: data.eyebrow_text, sort_order: 10 },
    { key: "hero.headline_line1", label: "Hero headline line 1", value: data.headline_line1, sort_order: 11 },
    { key: "hero.headline_line2", label: "Hero headline line 2", value: data.headline_line2, sort_order: 12 },
    { key: "hero.headline", label: "Hero headline", value: [data.headline_line1, data.headline_line2].filter(Boolean).join("\n"), sort_order: 13 },
    { key: "hero.subheadline", label: "Hero subheadline", value: data.subheadline, sort_order: 14 },
    { key: "hero.bottom_tagline", label: "Hero bottom tagline", value: data.bottom_tagline, sort_order: 15 },
    { key: "hero.cta_primary_label", label: "Hero primary CTA label", value: data.cta_primary_label, sort_order: 16 },
    { key: "hero.cta_primary_href", label: "Hero primary CTA target", value: data.cta_primary_href, sort_order: 17 },
    { key: "hero.cta_secondary_label", label: "Hero secondary CTA label", value: data.cta_secondary_label, sort_order: 18 },
    { key: "hero.cta_secondary_href", label: "Hero secondary CTA target", value: data.cta_secondary_href, sort_order: 19 },
    { key: "hero.vertical_labels", label: "Hero vertical labels", value: Array.isArray(data.vertical_labels) ? data.vertical_labels.join("\n") : (typeof data.vertical_labels === "string" ? data.vertical_labels : ""), sort_order: 20 },
  ];

  const now = new Date().toISOString();
  const rows = readPageContentCache();
  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        cache = parsed as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.warn("[CMS] Error reading hero cache:", error);
  }

  const cachedHero = cache.hero && typeof cache.hero === "object" && !Array.isArray(cache.hero)
    ? (cache.hero as Record<string, unknown>)
    : {};

  for (const field of textFields) {
    if (field.value === undefined || field.value === null) continue;
    const stringVal = String(field.value);
    const existingIndex = rows.findIndex(
      (r) => r.page_slug === "home" && r.content_key === field.key,
    );
    if (existingIndex >= 0) {
      rows[existingIndex] = {
        ...rows[existingIndex],
        content_type: "text",
        value: stringVal,
        updated_at: now,
      };
    } else {
      rows.push({
        id: `local-home-${field.key.replace(/\./g, "-")}`,
        page_slug: "home",
        content_key: field.key,
        label: field.label,
        content_type: "text",
        value: stringVal,
        media_url: null,
        alt_text: null,
        sort_order: field.sort_order,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
  }

  if (typeof data.background_video_url === "string") {
    const videoVal = data.background_video_url.trim();
    cachedHero.background_video_url = videoVal;
    const bgIndex = rows.findIndex((r) => r.page_slug === "home" && r.content_key === HOME_HERO_BACKGROUND_KEY);
    if (bgIndex >= 0) {
      rows[bgIndex] = { ...rows[bgIndex], value: videoVal, media_url: videoVal || null, updated_at: now };
    } else {
      rows.push({
        id: "local-home-hero-background",
        page_slug: "home",
        content_key: HOME_HERO_BACKGROUND_KEY,
        label: "Hero background video",
        content_type: "video",
        value: videoVal,
        media_url: videoVal || null,
        alt_text: "ACE SELECT hero video",
        sort_order: 30,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
  }

  if (typeof data.poster_url === "string") {
    const posterVal = data.poster_url.trim();
    cachedHero.poster_url = posterVal;
    const pIndex = rows.findIndex((r) => r.page_slug === "home" && r.content_key === HOME_HERO_POSTER_KEY);
    if (pIndex >= 0) {
      rows[pIndex] = { ...rows[pIndex], value: posterVal, media_url: posterVal || null, updated_at: now };
    } else {
      rows.push({
        id: "local-home-hero-poster",
        page_slug: "home",
        content_key: HOME_HERO_POSTER_KEY,
        label: "Hero poster image",
        content_type: "image",
        value: posterVal,
        media_url: posterVal || null,
        alt_text: "ACE SELECT homepage hero poster",
        sort_order: 31,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
  }

  cache.page_content = rows;
  cache.hero = { ...cachedHero, ...data };
  fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");

  if (supabase) {
    for (const field of textFields) {
      if (field.value === undefined || field.value === null) continue;
      const stringVal = String(field.value);
      try {
        const { data: matched } = await supabase
          .from("cms_page_content")
          .select("id")
          .eq("page_slug", "home")
          .eq("content_key", field.key)
          .maybeSingle();

        if (matched?.id) {
          await supabase.from("cms_page_content").update({ value: stringVal, updated_at: now }).eq("id", matched.id);
        } else {
          await supabase.from("cms_page_content").insert({
            page_slug: "home",
            content_key: field.key,
            label: field.label,
            content_type: "text",
            value: stringVal,
            sort_order: field.sort_order,
            is_active: true,
          });
        }
      } catch (e) {
        console.warn(`[CMS] Error updating cms_page_content for ${field.key}:`, e);
      }
    }
  }
}

/**
 * Synchronize full Homepage > About content into both the local page_content cache
 * and the cms_page_content remote table.
 */
export async function syncHomeAboutContent(
  supabase: SupabaseClient | null,
  data: Record<string, unknown>,
): Promise<void> {
  const textFields = [
    { key: "about.eyebrow", label: "About eyebrow", value: data.eyebrow, sort_order: 40 },
    { key: "about.headline", label: "About headline", value: data.headline, sort_order: 41 },
    { key: "about.body1", label: "About body paragraph 1", value: data.body1 || data.body_paragraph1 || "", sort_order: 42 },
    { key: "about.body2", label: "About body paragraph 2", value: data.body2 || data.body_paragraph2 || "", sort_order: 43 },
    ...(data.image_url ? [{ key: "about.image", label: "About image", value: data.image_url, sort_order: 44 }] : []),
  ];

  const now = new Date().toISOString();
  const rows = readPageContentCache();
  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        cache = parsed as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.warn("[CMS] Error reading about cache:", error);
  }

  for (const field of textFields) {
    if (field.value === undefined || field.value === null) continue;
    const stringVal = String(field.value);
    const existingIndex = rows.findIndex(
      (r) => r.page_slug === "home" && r.content_key === field.key,
    );
    if (existingIndex >= 0) {
      rows[existingIndex] = {
        ...rows[existingIndex],
        content_type: field.key === "about.image" ? "image" : "text",
        value: stringVal,
        ...(field.key === "about.image" ? { media_url: stringVal } : {}),
        updated_at: now,
      };
    } else {
      rows.push({
        id: `local-home-${field.key.replace(/\./g, "-")}`,
        page_slug: "home",
        content_key: field.key,
        label: field.label,
        content_type: field.key === "about.image" ? "image" : "text",
        value: stringVal,
        media_url: field.key === "about.image" ? stringVal : null,
        alt_text: null,
        sort_order: field.sort_order,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    }
  }

  cache.page_content = rows;
  cache.about = { ...(cache.about as Record<string, unknown> || {}), ...data };
  fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");

  if (supabase) {
    for (const field of textFields) {
      if (field.value === undefined || field.value === null) continue;
      const stringVal = String(field.value);
      try {
        const { data: matched } = await supabase
          .from("cms_page_content")
          .select("id")
          .eq("page_slug", "home")
          .eq("content_key", field.key)
          .maybeSingle();

        if (matched?.id) {
          await supabase.from("cms_page_content").update({ value: stringVal, updated_at: now }).eq("id", matched.id);
        } else {
          await supabase.from("cms_page_content").insert({
            page_slug: "home",
            content_key: field.key,
            label: field.label,
            content_type: field.key === "about.image" ? "image" : "text",
            value: stringVal,
            sort_order: field.sort_order,
            is_active: true,
          });
        }
      } catch (e) {
        console.warn(`[CMS] Error updating cms_page_content for ${field.key}:`, e);
      }
    }
  }
}

/**
 * Mirror Page Content editor saves (from /admin/content) back into the
 * dedicated hero_content and home_about tables and cache sections.
 */
export async function syncPageContentToHeroAndAbout(
  supabase: SupabaseClient | null,
  rows: PageContent[],
): Promise<void> {
  const homeRows = rows.filter((r) => r.page_slug === "home");
  if (homeRows.length === 0) return;

  const heroUpdates: Record<string, unknown> = {};
  const aboutUpdates: Record<string, unknown> = {};

  for (const r of homeRows) {
    if (r.content_key === "hero.eyebrow") heroUpdates.eyebrow_text = r.value;
    else if (r.content_key === "hero.headline_line1") heroUpdates.headline_line1 = r.value;
    else if (r.content_key === "hero.headline_line2") heroUpdates.headline_line2 = r.value;
    else if (r.content_key === "hero.subheadline") heroUpdates.subheadline = r.value;
    else if (r.content_key === "hero.bottom_tagline") heroUpdates.bottom_tagline = r.value;
    else if (r.content_key === "hero.cta_primary_label") heroUpdates.cta_primary_label = r.value;
    else if (r.content_key === "hero.cta_primary_href") heroUpdates.cta_primary_href = r.value;
    else if (r.content_key === "hero.cta_secondary_label") heroUpdates.cta_secondary_label = r.value;
    else if (r.content_key === "hero.cta_secondary_href") heroUpdates.cta_secondary_href = r.value;
    else if (r.content_key === "hero.background") heroUpdates.background_video_url = r.media_url || r.value;
    else if (r.content_key === "hero.poster") heroUpdates.poster_url = r.media_url || r.value;
    else if (r.content_key === "hero.vertical_labels") {
      heroUpdates.vertical_labels = r.value.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    else if (r.content_key === "about.eyebrow") aboutUpdates.eyebrow = r.value;
    else if (r.content_key === "about.headline") aboutUpdates.headline = r.value;
    else if (r.content_key === "about.body1") aboutUpdates.body_paragraph1 = r.value;
    else if (r.content_key === "about.body2") aboutUpdates.body_paragraph2 = r.value;
    else if (r.content_key === "about.image") aboutUpdates.image_url = r.media_url || r.value;
  }

  let cache: Record<string, unknown> = {};
  try {
    if (fs.existsSync(CMS_CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CMS_CACHE_PATH, "utf-8"));
    }
  } catch {}

  if (Object.keys(heroUpdates).length > 0) {
    cache.hero = { ...(cache.hero as Record<string, unknown> || {}), ...heroUpdates };
    if (supabase) {
      try {
        const { data: existing } = await supabase
          .from("hero_content")
          .select("id")
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(1);
        if (existing?.[0]?.id) {
          await supabase.from("hero_content").update(heroUpdates).eq("id", existing[0].id);
        } else {
          await supabase.from("hero_content").insert({ ...heroUpdates, is_active: true });
        }
      } catch (err) {
        console.warn("[CMS] Error mirroring to hero_content:", err);
      }
    }
  }

  if (Object.keys(aboutUpdates).length > 0) {
    cache.about = { ...(cache.about as Record<string, unknown> || {}), ...aboutUpdates };
    if (supabase) {
      try {
        const { data: existing } = await supabase.from("home_about").select("id").limit(1);
        if (existing?.[0]?.id) {
          await supabase.from("home_about").update(aboutUpdates).eq("id", existing[0].id);
        } else {
          await supabase.from("home_about").insert(aboutUpdates);
        }
      } catch (err) {
        console.warn("[CMS] Error mirroring to home_about:", err);
      }
    }
  }

  try {
    fs.writeFileSync(CMS_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf-8");
  } catch {}
}

// ================================================================
// Helper: fetch from Supabase OR return null (triggers fallback)
// ================================================================
async function fetchFromDB<T>(
  tableName: string,
  query: (supabase: SupabaseClient) => Promise<{ data: T | null; error: unknown }>
): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;
  
  try {
    let supabase;
    try {
      supabase = createSupabaseAdminClient();
    } catch {
      supabase = createSupabaseServerClient();
    }
    const { data, error } = await query(supabase);
    if (error) {
      const message = error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : String(error);
      console.warn(`[CMS] Supabase read failed for ${tableName}: ${message}`);
      return null;
    }
    if (!data) {
      return null;
    }
    if (Array.isArray(data) && data.length === 0) {
      return null;
    }
    return data;
  } catch (error) {
    console.warn(
      `[CMS] Supabase read failed for ${tableName}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

/**
 * Page content needs to distinguish a successful empty remote result from a
 * failed remote read. An empty result is meaningful: an administrator may
 * intentionally hide every override for a page.
 */
async function fetchPageContentFromDB(pageSlug: string): Promise<{ rows: PageContent[] | null; remoteAvailable: boolean }> {
  if (!isSupabaseConfigured()) return { rows: null, remoteAvailable: false };

  try {
    let supabase;
    try {
      supabase = createSupabaseAdminClient();
    } catch {
      supabase = createSupabaseServerClient();
    }
    const { data, error } = await supabase
      .from("cms_page_content")
      .select("*")
      .eq("page_slug", pageSlug)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn(`[CMS] Supabase read failed for cms_page_content: ${error.message}`);
      return { rows: null, remoteAvailable: false };
    }
    return { rows: (data || []) as PageContent[], remoteAvailable: true };
  } catch (error) {
    console.warn(
      "[CMS] Supabase read failed for cms_page_content:",
      error instanceof Error ? error.message : String(error),
    );
    return { rows: null, remoteAvailable: false };
  }
}

// ================================================================
// PAGE CONTENT OVERRIDES
// ================================================================
/**
 * Return active page-content overrides keyed by their stable content key.
 * Supabase is preferred; an empty/error response falls back to the local cache.
 */
export async function getPageContent(pageSlug: string): Promise<PageContentMap> {
  const remote = await fetchPageContentFromDB(pageSlug);
  const rows = remote.rows ?? readPageContentCache().filter((row) => row.page_slug === pageSlug && row.is_active !== false);

  return rows.reduce<PageContentMap>((map, row) => {
    if (row?.content_key) map[row.content_key] = row;
    return map;
  }, {});
}

// Explicit alias for callers that prefer the return shape in the function name.
export const getPageContentMap = getPageContent;

/** Resolve a text override without making public pages know about database rows. */
export function getPageContentValue(content: PageContentMap, key: string, fallback: string): string {
  const value = content[key]?.value?.trim();
  return value || fallback;
}

/** Resolve an uploaded asset override, falling back to the row value for hand-entered URLs. */
export function getPageContentMedia(content: PageContentMap, key: string, fallback: string): string {
  const row = content[key];
  return row?.media_url?.trim() || row?.value?.trim() || fallback;
}

// ================================================================
// SITE SETTINGS
// ================================================================
const FALLBACK_SETTINGS: SiteSettings = {
  id: "static",
  site_name: "ACE SELECT",
  tagline: "Engineered for India. Designed for Every Application.",
  company_description: "ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems.",
  phone: "(+91) 22 25182233",
  email: "info@aceselect.in",
  address: "C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai - 400079",
  whatsapp_number: "+912225182233",
  facebook_url: "https://www.facebook.com/AceSelect",
  twitter_url: "https://twitter.com/ace_select",
  instagram_url: "https://www.instagram.com/ace_select/",
  linkedin_url: "https://www.linkedin.com/company/aceselectsocial/",
  footer_description: "Trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India. Design-to-Build excellence under one roof.",
  copyright_text: "© {year} ACE SELECT. All rights reserved. ISO 9001:2015 Certified.",
  maintenance_mode: false,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await fetchFromDB<SiteSettings>("site_settings", async (supabase) =>
    supabase.from("site_settings").select("*").limit(1).maybeSingle()
  );
  if (data) {
    return { ...FALLBACK_SETTINGS, ...data };
  }
  return readCacheSection<SiteSettings>("settings", FALLBACK_SETTINGS);
}

// ================================================================
// SEO
// ================================================================
export async function getPageSEO(slug: string): Promise<PageSEO | null> {
  const data = await fetchFromDB<PageSEO>("page_seo", async (supabase) =>
    supabase.from("page_seo").select("*").eq("page_slug", slug).maybeSingle()
  );
  if (data) return data;
  const seoCache = readCacheSection<Array<{ id?: string; slug?: string; title?: string; description?: string; keywords?: string }>>("seo", []);
  const matched = seoCache.find((s) => s.slug === slug);
  if (matched) {
    return {
      id: matched.id || slug,
      page_slug: matched.slug || slug,
      title: matched.title || slug,
      meta_description: matched.description || "",
      keywords: matched.keywords || "",
      updated_at: new Date().toISOString(),
    };
  }
  return null;
}

// ================================================================
// HERO CONTENT
// ================================================================
const FALLBACK_HERO: HeroContent = {
  id: "static",
  eyebrow_text: "INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE",
  headline_line1: "ENGINEERED FOR INDIA.",
  headline_line2: "DESIGNED FOR EVERY APPLICATION.",
  subheadline: "ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions for government, banking, corporate, institutional, commercial, and mission-critical environments across India.",
  cta_primary_label: "EXPLORE OUR WORK",
  cta_primary_href: "/projects",
  cta_secondary_label: "GET A QUOTE",
  cta_secondary_href: "/contact",
  bottom_tagline: "PROFESSIONALLY ENGINEERED\nAPPLICATION-SPECIFIC DISPLAY SYSTEMS",
  vertical_labels: ["GOVERNMENT", "BANKING", "CORPORATE", "INSTITUTIONAL", "COMMERCIAL", "MISSION-CRITICAL"],
  background_video_url: "/home-hero.mp4",
  poster_url: "/home-hero-poster.jpg",
  is_active: true,
  updated_at: new Date().toISOString(),
};

export async function getHeroContent(): Promise<HeroContent> {
  const cacheHero = readCacheSection<HeroContent>("hero", FALLBACK_HERO);
  const rows = await fetchFromDB<HeroContent[]>("hero_content", async (supabase) =>
    supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
  );
  const data = rows?.[0];
  if (data) {
    return {
      ...FALLBACK_HERO,
      ...cacheHero,
      ...data,
      background_video_url: data.background_video_url || cacheHero.background_video_url || "/home-hero.mp4",
      poster_url: data.poster_url || cacheHero.poster_url || "/home-hero-poster.jpg",
    };
  }
  return { ...FALLBACK_HERO, ...cacheHero };
}

// ================================================================
// HOME ABOUT SECTION
// ================================================================
const FALLBACK_ABOUT: HomeAboutSection = {
  id: "static",
  eyebrow: "ABOUT ACE SELECT",
  headline: "CREATIVE THINKING.\nDESIGNING BEYOND THE BOX.",
  body_paragraph1: "At ACE SELECT, creative thinking is the driving force of our designing process. We approach each project with a “beyond the box” mindset, balancing innovation with environmental responsibility—a philosophy deeply embedded in our heritage.",
  body_paragraph2: "With a presence in over 476+ cities across India and an average annual turnover of ₹100 Crore+, ACE SELECT is a trusted leader in Advertising, Branding, and Commercial Construction. Guided by the visionary leadership of our Founder, Mr. Kamal Gor, our Design-to-Build approach delivers inventive, elegant, and multi-functional spaces under one roof.",
  badge_text: "Secure Cloud CMS on JIO SOFTWARE",
  badge_sub_text: "Centralized Oversight & Access Controls",
  cta_label: "DISCOVER OUR STORY",
  cta_href: "/who-we-are",
  image_url: "/images/products/standee-banner.jpg",
  image_alt: "ACE SELECT Android Digital Signage Standee",
  updated_at: new Date().toISOString(),
};

export async function getHomeAbout(): Promise<HomeAboutSection> {
  type HomeAboutCache = HomeAboutSection & { body1?: string; body2?: string };
  const cacheAbout = readCacheSection<HomeAboutCache>("about", FALLBACK_ABOUT);
  const data = await fetchFromDB<HomeAboutCache>("home_about", async (supabase) =>
    supabase.from("home_about").select("*").limit(1).maybeSingle()
  );
  const raw = data || cacheAbout || FALLBACK_ABOUT;
  return {
    ...FALLBACK_ABOUT,
    ...cacheAbout,
    ...raw,
    eyebrow: raw.eyebrow || cacheAbout?.eyebrow || FALLBACK_ABOUT.eyebrow,
    headline: raw.headline || cacheAbout?.headline || FALLBACK_ABOUT.headline,
    body_paragraph1: (raw.body_paragraph1 && raw.body_paragraph1.trim()) || raw.body1 || cacheAbout?.body1 || FALLBACK_ABOUT.body_paragraph1,
    body_paragraph2: (raw.body_paragraph2 && raw.body_paragraph2.trim()) || raw.body2 || cacheAbout?.body2 || FALLBACK_ABOUT.body_paragraph2,
    badge_text: raw.badge_text || cacheAbout?.badge_text || FALLBACK_ABOUT.badge_text,
    badge_sub_text: raw.badge_sub_text || cacheAbout?.badge_sub_text || FALLBACK_ABOUT.badge_sub_text,
    cta_label: raw.cta_label || cacheAbout?.cta_label || FALLBACK_ABOUT.cta_label,
    cta_href: raw.cta_href || cacheAbout?.cta_href || FALLBACK_ABOUT.cta_href,
    image_url: raw.image_url || cacheAbout?.image_url || FALLBACK_ABOUT.image_url,
    image_alt: raw.image_alt || cacheAbout?.image_alt || FALLBACK_ABOUT.image_alt,
  };
}

// ================================================================
// HOME STATS
// ================================================================
const FALLBACK_STATS: HomeStat[] = [
  { id: "1", icon_name: "Building2", end_value: 476, suffix: "+", label: "CITIES SERVED", sort_order: 1, is_active: true },
  { id: "2", icon_name: "TrendingUp", end_value: 100, prefix: "₹", suffix: " CR+", label: "ANNUAL TURNOVER", sort_order: 2, is_active: true },
  { id: "3", icon_name: "Monitor", end_value: 34250, suffix: " m²+", label: "ACTIVE LED INSTALLED", sort_order: 3, is_active: true },
  { id: "4", icon_name: "Calendar", end_value: 1996, suffix: "", label: "SINCE YEAR", sort_order: 4, is_active: true },
];

function stableSortByOrder<T extends { sort_order?: number }>(rows: readonly T[]): T[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((first, second) => {
      const firstOrder = typeof first.row.sort_order === "number" && Number.isFinite(first.row.sort_order)
        ? first.row.sort_order
        : Number.POSITIVE_INFINITY;
      const secondOrder = typeof second.row.sort_order === "number" && Number.isFinite(second.row.sort_order)
        ? second.row.sort_order
        : Number.POSITIVE_INFINITY;
      return firstOrder - secondOrder || first.index - second.index;
    })
    .map(({ row }) => row);
}

function normalizeCmsLabel(label: string): string {
  return label.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

function selectHomeStats(rows: readonly HomeStat[]): HomeStat[] {
  const seenLabels = new Set<string>();

  return stableSortByOrder(rows)
    .filter((stat) => {
      const normalizedLabel = normalizeCmsLabel(stat.label);
      if (seenLabels.has(normalizedLabel)) return false;
      seenLabels.add(normalizedLabel);
      return true;
    })
    .slice(0, 4);
}

export async function getHomeStats(): Promise<HomeStat[]> {
  const data = await fetchFromDB<HomeStat[]>("home_stats", async (supabase) =>
    supabase.from("home_stats").select("*").eq("is_active", true).order("sort_order")
  );
  const list = (data && data.length > 0) ? data : readCacheSection<HomeStat[]>("stats", FALLBACK_STATS);
  return selectHomeStats(list);
}

// ================================================================
// HOME PROCESS STEPS
// ================================================================
const FALLBACK_STEPS: HomeProcessStep[] = [
  { id: "1", number: "01", title: "DISCOVER", description: "Understand your brand & objectives", sort_order: 1, is_active: true },
  { id: "2", number: "02", title: "DESIGN",   description: "Conceptualize & plan",                 sort_order: 2, is_active: true },
  { id: "3", number: "03", title: "PRODUCE",  description: "Manufacture with precision",           sort_order: 3, is_active: true },
  { id: "4", number: "04", title: "DEPLOY",   description: "Rollout & installation",               sort_order: 4, is_active: true },
  { id: "5", number: "05", title: "INSPECT",  description: "Quality checks & compliance",          sort_order: 5, is_active: true },
  { id: "6", number: "06", title: "DELIVER",  description: "Handover & ongoing support",           sort_order: 6, is_active: true },
];

export async function getProcessSteps(): Promise<HomeProcessStep[]> {
  const data = await fetchFromDB<HomeProcessStep[]>("home_process_steps", async (supabase) =>
    supabase.from("home_process_steps").select("*").eq("is_active", true).order("sort_order")
  );
  const list = (data && data.length > 0) ? data : readCacheSection<HomeProcessStep[]>("process", FALLBACK_STEPS);
  const seen = new Set<string>();
  const uniqueList: HomeProcessStep[] = [];
  for (const step of stableSortByOrder(list)) {
    const key = `${step.number || ""}-${step.title || ""}`.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(step);
    }
  }
  return uniqueList;
}

// ================================================================
// PAN-INDIA STATS
// ================================================================
const FALLBACK_PAN_INDIA: PanIndiaStat[] = [
  { id: "1", value: "27+", label: "STATES", sort_order: 1, is_active: true },
  { id: "2", value: "476+", label: "CITIES", sort_order: 2, is_active: true },
  { id: "3", value: "176+", label: "REGIONAL REPRESENTATIVES", sort_order: 3, is_active: true },
];

export async function getPanIndiaStats(): Promise<PanIndiaStat[]> {
  const data = await fetchFromDB<PanIndiaStat[]>("pan_india_stats", async (supabase) =>
    supabase.from("pan_india_stats").select("*").eq("is_active", true).order("sort_order")
  );
  const rawList = (data && data.length > 0) ? data : readCacheSection<PanIndiaStat[]>("pan_india", FALLBACK_PAN_INDIA);
  const seen = new Set<string>();
  const uniqueList: PanIndiaStat[] = [];
  for (const item of rawList) {
    const key = (item.label || "").trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push({
        id: item.id || String(uniqueList.length + 1),
        value: item.value,
        label: item.label,
        sort_order: item.sort_order ?? uniqueList.length + 1,
        is_active: item.is_active !== false,
      });
    }
  }
  return uniqueList;
}

// ================================================================
// PROJECTS
// ================================================================
export async function getAllProjects(): Promise<CMSProject[]> {
  const data = await fetchFromDB<CMSProject[]>("cms_projects", async (supabase) =>
    supabase.from("cms_projects").select("*").eq("is_active", true).order("sort_order")
  );

  if (data) return data;
  
  // Fallback: read from static file
  const { projectDetails } = await import("@/data/projectDetails");
  // Map legacy shape to CMSProject shape
  return projectDetails.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    client: p.client,
    category: p.category,
    vertical: (p.vertical as CMSProject["vertical"]) || "digital",
    location: p.location,
    city: p.city,
    state: p.state,
    completion: p.completion,
    scale: p.scale,
    hero_image: p.heroImage,
    gallery: p.gallery || [],
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    metrics: p.metrics || [],
    specs: p.specs || [],
    highlights: p.highlights || [],
    is_featured: i < 4,
    is_active: true,
    sort_order: i,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function getFeaturedProjects(): Promise<CMSProject[]> {
  const data = await fetchFromDB<CMSProject[]>("cms_projects", async (supabase) =>
    supabase.from("cms_projects").select("*").eq("is_active", true).eq("is_featured", true).order("sort_order").limit(4)
  );
  if (data) return data;
  
  const all = await getAllProjects();
  return all.filter((p) => p.is_featured).slice(0, 4);
}

export async function getProjectBySlug(slug: string): Promise<CMSProject | null> {
  const data = await fetchFromDB<CMSProject>("cms_projects", async (supabase) =>
    supabase.from("cms_projects").select("*").eq("slug", slug).single()
  );
  if (data) return data;

  const all = await getAllProjects();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
}

// ================================================================
// PRODUCTS
// ================================================================
export async function getProductCategories(): Promise<ProductCategory[]> {
  const data = await fetchFromDB<ProductCategory[]>("cms_product_categories", async (supabase) =>
    supabase.from("cms_product_categories").select("*").eq("is_active", true).order("sort_order")
  );
  if (data && data.length > 0) return data;
  return readCacheSection<ProductCategory[]>("product_categories", FALLBACK_PRODUCT_CATEGORIES as any);
}

export async function getProductsByCategory(categoryId: string): Promise<CMSProduct[]> {
  const data = await fetchFromDB<CMSProduct[]>("cms_products", async (supabase) =>
    supabase.from("cms_products").select("*").eq("category_id", categoryId).eq("is_active", true).order("sort_order")
  );
  return data || [];
}

// ================================================================
// CLIENTS
// ================================================================
const FALLBACK_CLIENTS: CMSClient[] = [
  { id: "1", name: "SBI", tag: "Public Sector", tint_color: "#283A97", sort_order: 1, is_active: true },
  { id: "2", name: "Bank of Baroda", tag: "National Bank", tint_color: "#EA580C", sort_order: 2, is_active: true },
  { id: "3", name: "ICICI Bank", tag: "Private Banking", tint_color: "#B91C1C", sort_order: 3, is_active: true },
  { id: "4", name: "Axis Bank", tag: "Commercial Banking", tint_color: "#9D174D", sort_order: 4, is_active: true },
  { id: "5", name: "HDFC Bank", tag: "Financial Services", tint_color: "#1E3A8A", sort_order: 5, is_active: true },
  { id: "6", name: "Indian Bank", tag: "Public Sector", tint_color: "#2563EB", sort_order: 6, is_active: true },
  { id: "7", name: "Muthoot Finance", tag: "NBFC Group", tint_color: "#DC2626", sort_order: 7, is_active: true },
  { id: "8", name: "Bank of Maharashtra", tag: "State Banking", tint_color: "#0284C7", sort_order: 8, is_active: true },
  { id: "9", name: "Cosmos Bank", tag: "Co-op Banking", tint_color: "#4F46E5", sort_order: 9, is_active: true },
  { id: "10", name: "City Union Bank", tag: "Commercial", tint_color: "#059669", sort_order: 10, is_active: true },
  { id: "11", name: "Punjab & Sindh Bank", tag: "Public Sector", tint_color: "#D97706", sort_order: 11, is_active: true },
];

export async function getClients(): Promise<CMSClient[]> {
  const data = await fetchFromDB<CMSClient[]>("cms_clients", async (supabase) =>
    supabase.from("cms_clients").select("*").eq("is_active", true).order("sort_order")
  );
  const list = (data && data.length > 0) ? data : readCacheSection<CMSClient[]>("clients", FALLBACK_CLIENTS);
  const seen = new Set<string>();
  const uniqueList: CMSClient[] = [];
  for (const client of list) {
    const key = (client.name || "").trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(client);
    }
  }
  return uniqueList;
}

// ================================================================
// TESTIMONIALS
// ================================================================
const FALLBACK_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: "1",
    quote: "ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.",
    author_name: "Rohit Sharma",
    author_title: "Head - ATM Deployments & Infrastructure",
    author_company: "HITACHI PAYMENT SERVICES",
    is_featured: true,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    quote: "Their end-to-end support from optical design to retail installation made our flagship in-store Active LED display rollouts smooth, stunning, and flawless.",
    author_name: "Neha Verma",
    author_title: "VP - Retail Experience & Projects",
    author_company: "TITAN COMPANY / CARATLANE",
    is_featured: true,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    quote: "Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch rebranding and display infrastructure for over a decade.",
    author_name: "Amit Khanna",
    author_title: "Chief Manager - Infrastructure & Branding",
    author_company: "STATE BANK OF INDIA",
    is_featured: true,
    sort_order: 3,
    is_active: true,
  },
  {
    id: "4",
    quote: "The architectural display installations and facade branding by ACE SELECT exceeded our expectations in build quality, structural safety, and visual impact.",
    author_name: "Priya Sundaram",
    author_title: "Director - Commercial Real Estate & Workspace Design",
    author_company: "DLF CYBERCITY",
    is_featured: true,
    sort_order: 4,
    is_active: true,
  },
  {
    id: "5",
    quote: "Rapid nationwide rollout across Tier 2 and Tier 3 branches without a single hitch. Their logistical capability and fabrication consistency across India is unmatched.",
    author_name: "Vikramaditya Rao",
    author_title: "Head of Operations & Network Expansion",
    author_company: "MUTHOOT FINANCE GROUP",
    is_featured: true,
    sort_order: 5,
    is_active: true,
  },
];

export async function getTestimonials(featuredOnly = false): Promise<CMSTestimonial[]> {
  const data = await fetchFromDB<CMSTestimonial[]>("cms_testimonials", async (supabase) => {
    let q = supabase.from("cms_testimonials").select("*").eq("is_active", true).order("sort_order");
    if (featuredOnly) q = q.eq("is_featured", true);
    return q;
  });
  const list = (data && data.length > 0) ? data : readCacheSection<CMSTestimonial[]>("testimonials", FALLBACK_TESTIMONIALS);

  const seen = new Set<string>();
  const uniqueList: CMSTestimonial[] = [];
  for (const item of stableSortByOrder(list)) {
    const key = item.id ? String(item.id).toLowerCase() : `${item.author_name}-${item.author_company}`.trim().toLowerCase();
    const contentKey = `${item.author_name}-${item.author_company}`.trim().toLowerCase();
    if (!seen.has(key) && !seen.has(contentKey)) {
      seen.add(key);
      seen.add(contentKey);
      uniqueList.push(item);
    }
  }

  return uniqueList.filter((testimonial) => testimonial.is_active !== false && (!featuredOnly || testimonial.is_featured));
}

// ================================================================
// COMPANY / WHO WE ARE PAGE
// ================================================================
const FALLBACK_COMPANY: CompanyPage = {
  id: "static",
  hero_headline: "CREATIVE THINKING.",
  hero_highlight: "BEYOND THE BOX.",
  hero_subheadline: "At ACE SELECT, creative thinking is the driving force of our designing process. We approach each project with a “beyond the box” mindset, balancing innovation with environmental responsibility—a philosophy deeply embedded in our heritage.",
  who_we_are_headline: "INVENTIVE SPACES.",
  who_we_are_highlight: "DESIGN-TO-BUILD EXCELLENCE.",
  who_we_are_body: "By working closely with clients from concept to completion, we’ve built a reputation for delivering inventive, elegant, and multi-functional spaces. With a presence in over 476+ cities across India, ACE SELECT is a trusted leader in Advertising, Branding, and Commercial Construction.",
  founder_name: "Mr. Kamal Gor",
  founder_title: "Founder & Managing Director, ACE SELECT",
  founder_quote: "Quality and trust are built through consistency, relentless innovation, and keeping our word on every single project.",
  founder_bio: "With decades of experience driving design-to-build innovation, Mr. Kamal Gor has guided ACE SELECT to nationwide leadership.",
  vision: "To engineer transformative visual experiences that elevate India's commercial and public landscapes.",
  mission: "Delivering turnkey Design-to-Build display systems and advertising infrastructure with unmatched precision, speed, and reliability.",
  videoUrl: "/company-hero.mp4",
  posterUrl: "",
  values: [],
  heritage_year: 1996,
  updated_at: new Date().toISOString(),
};

export async function getCompanyPage(): Promise<CompanyPage> {
  const cacheCompany = readCacheSection<CompanyPage>("company", FALLBACK_COMPANY);
  const data = await fetchFromDB<CompanyPage>("company_page", async (supabase) =>
    supabase.from("company_page").select("*").limit(1).maybeSingle()
  );
  const raw = data || cacheCompany || FALLBACK_COMPANY;
  return {
    ...FALLBACK_COMPANY,
    ...cacheCompany,
    ...raw,
    hero_headline: raw.hero_headline || cacheCompany?.hero_headline || FALLBACK_COMPANY.hero_headline,
    hero_highlight: raw.hero_highlight || cacheCompany?.hero_highlight || FALLBACK_COMPANY.hero_highlight,
    hero_subheadline: (raw.hero_subheadline && raw.hero_subheadline.trim()) || cacheCompany?.hero_subheadline || FALLBACK_COMPANY.hero_subheadline,
    who_we_are_headline: raw.who_we_are_headline || cacheCompany?.who_we_are_headline || FALLBACK_COMPANY.who_we_are_headline,
    who_we_are_highlight: raw.who_we_are_highlight || cacheCompany?.who_we_are_highlight || FALLBACK_COMPANY.who_we_are_highlight,
    who_we_are_body: (raw.who_we_are_body && raw.who_we_are_body.trim()) || cacheCompany?.who_we_are_body || FALLBACK_COMPANY.who_we_are_body,
    founder_name: raw.founder_name || cacheCompany?.founder_name || FALLBACK_COMPANY.founder_name,
    founder_title: raw.founder_title || cacheCompany?.founder_title || FALLBACK_COMPANY.founder_title,
    founder_quote: (raw.founder_quote && raw.founder_quote.trim()) || cacheCompany?.founder_quote || FALLBACK_COMPANY.founder_quote,
    founder_bio: (raw.founder_bio && raw.founder_bio.trim()) || cacheCompany?.founder_bio || FALLBACK_COMPANY.founder_bio,
    vision: (raw.vision && raw.vision.trim()) || cacheCompany?.vision || FALLBACK_COMPANY.vision,
    mission: (raw.mission && raw.mission.trim()) || cacheCompany?.mission || FALLBACK_COMPANY.mission,
    videoUrl: raw.videoUrl || cacheCompany?.videoUrl || "/company-hero.mp4",
    posterUrl: raw.posterUrl || cacheCompany?.posterUrl || "",
  };
}

// ================================================================
// CERTIFICATIONS
// ================================================================
export async function getCertifications(): Promise<CMSCertification[]> {
  const data = await fetchFromDB<CMSCertification[]>("cms_certifications", async (supabase) =>
    supabase.from("cms_certifications").select("*").eq("is_active", true).order("sort_order")
  );
  if (data && data.length > 0) return data;
  return readCacheSection<CMSCertification[]>("certifications", []);
}

// ================================================================
// TEAM MEMBERS
// ================================================================
export async function getTeamMembers(): Promise<TeamMemberCMS[]> {
  const data = await fetchFromDB<TeamMemberCMS[]>("team_members", async (supabase) =>
    supabase.from("team_members").select("*").eq("is_active", true).order("sort_order")
  );
  if (data && data.length > 0) return data;
  return readCacheSection<TeamMemberCMS[]>("team", []);
}

// ================================================================
// SUBMIT ENQUIRY (public form submission)
// ================================================================
export async function submitEnquiry(
  enquiry: Pick<CMSEnquiry, "name" | "email" | "phone" | "company" | "message" | "service_interest">
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Fallback: could save to a JSON file or just return success for now
    console.log("[CMS] Enquiry submitted (no Supabase):", enquiry);
    return { success: true };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("cms_enquiries").insert({
      ...enquiry,
      source: "website",
      status: "new",
    });

    if (error) {
      console.error("[CMS] Error saving enquiry:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

// ================================================================
// HOMEPAGE PRODUCTS & SOLUTIONS
// ================================================================
export interface HomepageSolutionItem {
  id: string;
  title: string;
  img: string;
  href?: string;
  sort_order?: number;
}

export const FALLBACK_HOMEPAGE_SOLUTIONS: HomepageSolutionItem[] = [
  { id: "1", title: "ACTIVE DIGITAL\nLED DISPLAYS", img: "/images/products/indoor-smd-page1.jpg", href: "/products", sort_order: 1 },
  { id: "2", title: "ANDROID DIGITAL\nSTANDEES (32\"-65\")", img: "/images/products/standee-banner.jpg", href: "/products", sort_order: 2 },
  { id: "3", title: "OUTDOOR HIGH BRIGHTNESS\nSMD SERIES", img: "/images/products/outdoor-smd-page1.jpg", href: "/products", sort_order: 3 },
  { id: "4", title: "INTERACTIVE &\nSELF-SERVICE KIOSKS", img: "/images/projects/project-bkc-elobby.jpg", href: "/products", sort_order: 4 },
  { id: "5", title: "STATIC SIGNAGE &\nGLOW SIGN BOARDS", img: "/images/projects/atm-kiosk-branding.jpg", href: "/products", sort_order: 5 },
  { id: "6", title: "SIGNAGE CMS ON\nJIO SOFTWARE", img: "/images/products/product-hierarchy.jpg", href: "/products", sort_order: 6 },
];

export async function getHomepageSolutions(): Promise<HomepageSolutionItem[]> {
  const list = readCacheSection<HomepageSolutionItem[]>("homepage_solutions", FALLBACK_HOMEPAGE_SOLUTIONS);
  return stableSortByOrder(list);
}

// ================================================================
// PRODUCT CATEGORIES & CATALOG
// ================================================================
export interface CMSProductCategory {
  id: string;
  slug?: string;
  name: string;
  icon?: string;
  description?: string;
  badge?: string;
  sort_order?: number;
  is_active?: boolean;
}

export const FALLBACK_PRODUCT_CATEGORIES: CMSProductCategory[] = [
  {
    id: "active-indoor-led",
    slug: "active-indoor-led",
    name: "Active Indoor LED",
    icon: "Monitor",
    description: "High-resolution indoor LED video wall solutions for corporate, command center & broadcast environments",
    badge: "Active LED",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "outdoor-led-displays",
    slug: "outdoor-led-displays",
    name: "Outdoor LED Displays",
    icon: "Sun",
    description: "Weather-resistant high-brightness outdoor active LED video displays and highway DOOH billboards",
    badge: "Outdoor",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "digital-standees",
    slug: "digital-standees",
    name: "Digital Standees",
    icon: "Tablet",
    description: "Android & Windows powered commercial digital standees from 32\" to 65\" for retail and bank branches",
    badge: "Standees",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "signage-software",
    slug: "signage-software",
    name: "Signage & Software",
    icon: "Cloud",
    description: "Architectural signage, banking kiosks, and centralized cloud CMS hosted on Jio Software",
    badge: "Software & CMS",
    sort_order: 4,
    is_active: true,
  },
];

export interface CMSProductCatalogItem {
  id: string;
  slug?: string;
  name: string;
  category: string;
  tagline?: string;
  badge?: string;
  image_url?: string;
  description?: string;
  specs?: string[] | { label: string; value: string }[];
  sort_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

export const FALLBACK_PRODUCTS: CMSProductCatalogItem[] = [
  {
    id: "indoor-active-led",
    name: "Indoor Active LED Video Wall",
    category: "Active Indoor LED",
    tagline: "Fine Pixel Pitch COB & SMD Display Systems",
    badge: "P1.2 - P3.0",
    image_url: "/images/products/indoor-smd-page1.jpg",
    specs: [
      "COB & SMD Fine Pixel Pitch (P1.2 to P3.0)",
      "High refresh rate >3840Hz & 16-bit grayscale",
      "160° ultra-wide horizontal & vertical viewing",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "outdoor-active-led",
    name: "Outdoor High-Brightness LED Display",
    category: "Outdoor LED Displays",
    tagline: "IP65 Weather-Resistant DOOH Advertising Facades",
    badge: ">6000 NITS",
    image_url: "/images/products/outdoor-smd-page1.jpg",
    specs: [
      ">6000 Nits high-brightness daylight readable",
      "IP65 waterproof all-weather die-cast cabinet",
      "ECO energy-saving low heat dissipation IC",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "digital-standees",
    name: "Commercial Digital Standee Displays",
    category: "Digital Standees",
    tagline: "Standalone Android 4K UHD Interactive Kiosks",
    badge: "4K UHD",
    image_url: "/images/products/standee-banner.jpg",
    specs: [
      "32\" to 65\" commercial-grade 4K UHD panels",
      "4mm tempered explosion-proof protective glass",
      "Android OS / Windows plug & play media engine",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "signage-software",
    name: "Architectural Signage & Wayfinding Solutions",
    category: "Signage & Software",
    tagline: "Precision Stainless Steel, Pylons & Cloud CMS",
    badge: "SEAMLESS",
    image_url: "/images/products/product-hierarchy.jpg",
    specs: [
      "Precision CNC & Laser Cut Stainless Steel 304/316",
      "Centralized cloud CMS hosted on Jio Software",
      "Mission-critical 24/7 control room & banking kiosk reliability",
    ],
    is_featured: true,
    is_active: true,
  },
];

export async function getProductsCatalog(): Promise<CMSProductCatalogItem[]> {
  const data = await fetchFromDB<CMSProductCatalogItem[]>("cms_products", async (supabase) =>
    supabase.from("cms_products").select("*").eq("is_active", true).order("sort_order")
  );
  if (data && data.length > 0) return data;
  return readCacheSection<CMSProductCatalogItem[]>("products", FALLBACK_PRODUCTS);
}

