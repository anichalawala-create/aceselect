-- ================================================================
-- ACE SELECT CMS — Repair duplicate homepage hero records
-- ================================================================
-- The original CMS seed could create multiple active hero_content rows.
-- Keep the newest active row, then prevent this from happening again.

-- This migration is safe to run by itself. If the base CMS migration has not
-- been applied yet, create the hero table and its required media columns first.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eyebrow_text TEXT NOT NULL DEFAULT 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE',
  headline_line1 TEXT NOT NULL DEFAULT 'ENGINEERED FOR INDIA.',
  headline_line2 TEXT NOT NULL DEFAULT 'DESIGNED FOR EVERY APPLICATION.',
  subheadline TEXT NOT NULL DEFAULT '',
  cta_primary_label TEXT NOT NULL DEFAULT 'EXPLORE OUR WORK',
  cta_primary_href TEXT NOT NULL DEFAULT '/projects',
  cta_secondary_label TEXT NOT NULL DEFAULT 'GET A QUOTE',
  cta_secondary_href TEXT NOT NULL DEFAULT '/contact',
  bottom_tagline TEXT NOT NULL DEFAULT 'PROFESSIONALLY ENGINEERED APPLICATION-SPECIFIC DISPLAY SYSTEMS',
  vertical_labels TEXT[] NOT NULL DEFAULT ARRAY['GOVERNMENT','BANKING','CORPORATE','INSTITUTIONAL','COMMERCIAL','MISSION-CRITICAL'],
  background_video_url TEXT,
  poster_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE hero_content
  ADD COLUMN IF NOT EXISTS background_video_url TEXT;

ALTER TABLE hero_content
  ADD COLUMN IF NOT EXISTS poster_url TEXT;

INSERT INTO hero_content (eyebrow_text, background_video_url, poster_url)
SELECT
  'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE',
  '/home-hero.mp4',
  '/home-hero-poster.jpg'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

WITH ranked_hero_rows AS (
  SELECT
    id,
    row_number() OVER (
      ORDER BY updated_at DESC NULLS LAST, id DESC
    ) AS row_number
  FROM hero_content
  WHERE is_active = true
)
DELETE FROM hero_content
WHERE id IN (
  SELECT id FROM ranked_hero_rows WHERE row_number > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS hero_content_one_active_idx
  ON hero_content (is_active)
  WHERE is_active = true;
