-- ================================================================
-- ACE SELECT CMS — Reusable page-content overrides
-- ================================================================

CREATE TABLE IF NOT EXISTS cms_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT NOT NULL,
  content_key TEXT NOT NULL,
  label TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
  value TEXT NOT NULL DEFAULT '',
  media_url TEXT,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cms_page_content_page_key_unique UNIQUE (page_slug, content_key)
);

CREATE INDEX IF NOT EXISTS idx_cms_page_content_page_slug ON cms_page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_cms_page_content_active ON cms_page_content(page_slug, sort_order) WHERE is_active = true;

DROP TRIGGER IF EXISTS trg_cms_page_content_updated_at ON cms_page_content;
CREATE TRIGGER trg_cms_page_content_updated_at
  BEFORE UPDATE ON cms_page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE cms_page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active page content" ON cms_page_content;
CREATE POLICY "Public can read active page content"
  ON cms_page_content FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage page content" ON cms_page_content;
CREATE POLICY "Admins can manage page content"
  ON cms_page_content FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Representative defaults for the currently public routes. ON CONFLICT keeps
-- this seed safe to run repeatedly and preserves administrator edits.
INSERT INTO cms_page_content
  (page_slug, content_key, label, content_type, value, media_url, alt_text, sort_order)
VALUES
  ('home', 'hero.eyebrow', 'Hero eyebrow', 'text', 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE', NULL, NULL, 10),
  ('home', 'hero.headline', 'Hero headline', 'text', 'ENGINEERED FOR INDIA. DESIGNED FOR EVERY APPLICATION.', NULL, NULL, 20),
  ('home', 'hero.background', 'Hero background video', 'video', '', '/home-hero.mp4', 'ACE SELECT hero video', 30),
  ('who-we-are', 'hero.headline', 'Company hero headline', 'text', 'CREATIVE THINKING. BEYOND THE BOX.', NULL, NULL, 10),
  ('who-we-are', 'hero.video', 'Company hero video', 'video', '', '/company-hero.mp4', 'ACE SELECT company story', 20),
  ('services', 'hero.headline', 'Services hero headline', 'text', 'END-TO-END SOLUTIONS FOR EVERY SPACE.', NULL, NULL, 10),
  ('services', 'hero.intro', 'Services introduction', 'text', 'From branding and retail execution to commercial interiors, activations and rebranding, ACE SELECT delivers integrated solutions designed for scale.', NULL, NULL, 20),
  ('industries', 'hero.eyebrow', 'Industries eyebrow', 'text', 'SECTORS WE SERVE', NULL, NULL, 10),
  ('industries', 'hero.headline', 'Industries hero headline', 'text', 'EXPERTISE ACROSS INDUSTRIES', NULL, NULL, 20),
  ('projects', 'hero.headline', 'Projects hero headline', 'text', 'PROJECTS THAT MAKE AN IMPACT.', NULL, NULL, 10),
  ('projects', 'hero.intro', 'Projects introduction', 'text', 'Explore ACE SELECT installations across active LED, digital signage, branding and commercial environments.', NULL, NULL, 20),
  ('contact', 'hero.eyebrow', 'Contact eyebrow', 'text', 'CONTACT US', NULL, NULL, 10),
  ('contact', 'hero.headline', 'Contact hero headline', 'text', 'START A CONVERSATION', NULL, NULL, 20),
  ('contact', 'hero.intro', 'Contact introduction', 'text', 'Ready to elevate your brand? Reach out and let''s discuss your vision and spatial requirements.', NULL, NULL, 30)
ON CONFLICT (page_slug, content_key) DO NOTHING;
