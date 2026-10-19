-- ================================================================
-- ACE SELECT CMS — Legacy hero media bridge
-- ================================================================
-- Run after the core CMS/page-content migrations. This is safe for both
-- incremental installations and the standalone full-CMS migration.

ALTER TABLE IF EXISTS hero_content
  ADD COLUMN IF NOT EXISTS background_video_url TEXT;

ALTER TABLE IF EXISTS hero_content
  ADD COLUMN IF NOT EXISTS poster_url TEXT;
