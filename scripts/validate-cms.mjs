import fs from "node:fs";

const cachePath = new URL("../src/data/cms-content-cache.json", import.meta.url);
const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
const rows = cache.page_content;

if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error("CMS page-content cache must contain at least one row.");
}

const seen = new Set();
for (const row of rows) {
  for (const field of ["page_slug", "content_key", "label", "content_type"]) {
    if (typeof row[field] !== "string" || !row[field].trim()) {
      throw new Error(`Invalid CMS row: ${field} is required.`);
    }
  }
  if (!["text", "image", "video"].includes(row.content_type)) {
    throw new Error(`Invalid CMS row type: ${row.content_type}`);
  }
  const key = `${row.page_slug}:${row.content_key}`;
  if (seen.has(key)) throw new Error(`Duplicate CMS content key: ${key}`);
  seen.add(key);
}

console.log(`CMS cache valid: ${rows.length} page-content fields.`);
