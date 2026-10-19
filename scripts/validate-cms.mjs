import fs from "node:fs";

const cachePath = new URL("../src/data/cms-content-cache.json", import.meta.url);
const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
const rows = cache.page_content;
const heroRoute = fs.readFileSync(new URL("../src/app/api/admin/content/route.ts", import.meta.url), "utf8");
const pageContentRoute = fs.readFileSync(new URL("../src/app/api/admin/page-content/route.ts", import.meta.url), "utf8");
const cmsService = fs.readFileSync(new URL("../src/lib/cms-service.ts", import.meta.url), "utf8");
const homepage = fs.readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error("CMS page-content cache must contain at least one row.");
}

const homeHeroBackground = rows.find((row) => row.page_slug === "home" && row.content_key === "hero.background");
if (!homeHeroBackground || homeHeroBackground.content_type !== "video") {
  throw new Error("CMS page-content cache must contain a home hero.background video row.");
}
if (!heroRoute.includes("syncHomeHeroVideoCache") || !heroRoute.includes("syncHomeHeroVideoPageContent")) {
  throw new Error("Legacy hero saves must synchronize the home hero.background page-content row.");
}
if (!pageContentRoute.includes("syncHomeHeroVideoHeroContent") || !cmsService.includes("syncHomeHeroVideoHeroContent")) {
  throw new Error("Page Content hero video saves must synchronize the legacy hero_content row.");
}
if (!homepage.includes('getPageContentMedia(pageContent, "hero.background"')) {
  throw new Error("Homepage must continue resolving the hero.background page-content override.");
}

const seen = new Set();
const pageSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const contentKeyPattern = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const safeUrl = (value) => {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

for (const row of rows) {
  for (const field of ["page_slug", "content_key", "label", "content_type"]) {
    if (typeof row[field] !== "string" || !row[field].trim()) {
      throw new Error(`Invalid CMS row: ${field} is required.`);
    }
  }
  if (!["text", "image", "video"].includes(row.content_type)) {
    throw new Error(`Invalid CMS row type: ${row.content_type}`);
  }
  if (!pageSlugPattern.test(row.page_slug) || row.page_slug.length > 80) {
    throw new Error(`Invalid CMS page slug: ${row.page_slug}`);
  }
  if (!contentKeyPattern.test(row.content_key) || row.content_key.length > 120) {
    throw new Error(`Invalid CMS content key: ${row.content_key}`);
  }
  if (row.content_type === "text" && row.media_url) {
    throw new Error(`Text CMS row cannot have media_url: ${row.content_key}`);
  }
  if (row.media_url && !safeUrl(row.media_url)) {
    throw new Error(`Invalid CMS media URL: ${row.media_url}`);
  }
  if (row.content_type !== "text" && row.value && !safeUrl(row.value)) {
    throw new Error(`Invalid CMS media value URL: ${row.content_key}`);
  }
  const key = `${row.page_slug}:${row.content_key}`;
  if (seen.has(key)) throw new Error(`Duplicate CMS content key: ${key}`);
  seen.add(key);
}

console.log(`CMS cache valid: ${rows.length} page-content fields.`);
