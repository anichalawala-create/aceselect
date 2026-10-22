-- ================================================================
-- ACE SELECT CMS — Reusable page-content overrides
-- ================================================================
-- Fully standalone, idempotent migration for cms_page_content table.
-- Safe to run directly in Supabase SQL Editor or via migrations.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure is_admin helper exists with safe fallback if admin_users does not exist yet
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'admin_users'
  ) THEN
    RETURN (auth.role() = 'authenticated');
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE supabase_auth_id = auth.uid() AND is_active = true
  );
END;
$$;

-- Create cms_page_content table
CREATE TABLE IF NOT EXISTS cms_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Representative defaults for the public routes.
-- ON CONFLICT preserves existing edits and allows safe re-execution.
INSERT INTO cms_page_content
  (page_slug, content_key, label, content_type, value, media_url, alt_text, sort_order)
VALUES
  ('home', 'hero.eyebrow', 'Hero eyebrow', 'text', 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE', NULL, NULL, 10),
  ('home', 'hero.headline_line1', 'Hero headline line 1', 'text', 'ENGINEERED FOR INDIA.', NULL, NULL, 11),
  ('home', 'hero.headline_line2', 'Hero headline line 2', 'text', 'DESIGNED FOR EVERY APPLICATION.', NULL, NULL, 12),
  ('home', 'hero.subheadline', 'Hero subheadline', 'text', 'ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions for government, banking, corporate, institutional, commercial, and mission-critical environments across India.', NULL, NULL, 13),
  ('home', 'hero.bottom_tagline', 'Hero bottom tagline', 'text', 'PROFESSIONALLY ENGINEERED\nAPPLICATION-SPECIFIC DISPLAY SYSTEMS', NULL, NULL, 14),
  ('home', 'hero.headline', 'Hero headline', 'text', 'ENGINEERED FOR INDIA. DESIGNED FOR EVERY APPLICATION.', NULL, NULL, 20),
  ('home', 'hero.background', 'Hero background video', 'video', '', '/home-hero.mp4', 'ACE SELECT hero video', 30),
  ('home', 'hero.poster', 'Hero poster image', 'image', '', '/home-hero-poster.jpg', 'ACE SELECT homepage hero', 31),
  ('home', 'about.eyebrow', 'About eyebrow', 'text', 'ABOUT ACE SELECT', NULL, NULL, 40),
  ('home', 'about.headline', 'About headline', 'text', 'CREATIVE THINKING.\nDESIGNING BEYOND THE BOX.', NULL, NULL, 41),
  ('home', 'about.body1', 'About paragraph 1', 'text', '', NULL, NULL, 42),
  ('home', 'about.body2', 'About paragraph 2', 'text', '', NULL, NULL, 43),
  ('home', 'about.image', 'About image', 'image', '', '/images/products/standee-banner.jpg', 'ACE SELECT Android Digital Signage Standee', 44),
  ('home', 'products.eyebrow', 'Products eyebrow', 'text', 'OUR PRODUCTS & SOLUTIONS', NULL, NULL, 50),
  ('home', 'products.headline', 'Products headline', 'text', 'HARDWARE, SIGNAGE\n& CLOUD CMS.', NULL, NULL, 51),
  ('home', 'products.intro', 'Products introduction', 'text', 'From active indoor & outdoor LED displays and 4K Android standees to architectural signage and secure Jio Software CMS, explore our end-to-end directory.', NULL, NULL, 52),
  ('home', 'pan_india.headline', 'Pan-India headline', 'text', 'BUILT FOR SCALE.', NULL, NULL, 60),
  ('home', 'pan_india.intro', 'Pan-India introduction', 'text', 'From a single location to nationwide rollouts, our network enables consistent execution across India. With a strong on-ground team and trusted partners, we deliver high-quality installations anywhere in the country.', NULL, NULL, 61),
  ('home', 'projects.headline', 'Featured projects headline', 'text', 'PROJECTS THAT\nMAKE AN IMPACT.', NULL, NULL, 70),
  ('home', 'projects.intro', 'Featured projects introduction', 'text', 'Explore some of our recent work across industries. From retail stores and corporate spaces to large-scale outdoor displays, our solutions help brands stand out.', NULL, NULL, 71),
  ('home', 'process.headline', 'Process headline', 'text', 'FROM VISION\nTO REALITY.', NULL, NULL, 80),
  ('home', 'process.intro', 'Process introduction', 'text', 'A streamlined process to ensure quality, consistency and on-time delivery across every project.', NULL, NULL, 81),
  ('home', 'clients.headline', 'Clients headline', 'text', 'TRUSTED BY LEADING FINANCIAL INSTITUTIONS.', NULL, NULL, 90),
  ('home', 'testimonials.headline', 'Testimonials headline', 'text', 'WHAT OUR\nCLIENTS SAY.', NULL, NULL, 100),
  ('home', 'cta.headline', 'Final CTA headline', 'text', 'LET''S BUILD\nWHAT''S NEXT.', NULL, NULL, 110),
  ('home', 'cta.body', 'Final CTA body', 'text', 'Partner with ACE SELECT for innovative display, branding and retail solutions that make your brand impossible to ignore.', NULL, NULL, 111),
  ('who-we-are', 'hero.eyebrow', 'Company hero eyebrow', 'text', 'ABOUT ACE SELECT', NULL, NULL, 9),
  ('who-we-are', 'hero.headline', 'Company hero headline', 'text', 'CREATIVE THINKING. BEYOND THE BOX.', NULL, NULL, 10),
  ('who-we-are', 'hero.intro', 'Company hero introduction', 'text', '', NULL, NULL, 11),
  ('who-we-are', 'hero.video', 'Company hero video', 'video', '', '/company-hero.mp4', 'ACE SELECT company story', 20),
  ('who-we-are', 'hero.poster', 'Company hero poster', 'image', '', '/home-hero-poster.jpg', 'ACE SELECT company story', 21),
  ('who-we-are', 'story.eyebrow', 'Story eyebrow', 'text', 'WHO WE ARE', NULL, NULL, 29),
  ('who-we-are', 'story.headline', 'Story headline', 'text', 'INVENTIVE SPACES.\nDESIGN-TO-BUILD EXCELLENCE.', NULL, NULL, 30),
  ('who-we-are', 'story.image', 'Story image', 'image', '', '/images/projects/project-bkc-elobby.jpg', 'Modern Commercial Workplace Architecture', 31),
  ('services', 'hero.image', 'Services hero image', 'image', '', NULL, 'Services hero', 8),
  ('services', 'hero.headline', 'Services hero headline', 'text', 'END-TO-END SOLUTIONS FOR EVERY SPACE.', NULL, NULL, 10),
  ('services', 'hero.intro', 'Services introduction', 'text', 'From branding and retail execution to commercial interiors, activations and rebranding, ACE SELECT delivers integrated solutions designed for scale.', NULL, NULL, 20),
  ('industries', 'hero.eyebrow', 'Industries eyebrow', 'text', 'SECTORS WE SERVE', NULL, NULL, 10),
  ('industries', 'hero.headline', 'Industries hero headline', 'text', 'EXPERTISE ACROSS INDUSTRIES', NULL, NULL, 20),
  ('industries', 'hero.intro', 'Industries introduction', 'text', 'We bring specialized knowledge and architectural precision to diverse sectors, creating impactful environments for leading global brands.', NULL, NULL, 21),
  ('projects', 'hero.eyebrow', 'Projects eyebrow', 'text', 'AUTHENTIC COMPANY PORTFOLIO', NULL, NULL, 9),
  ('projects', 'hero.headline', 'Projects hero headline', 'text', 'PROJECTS THAT MAKE AN IMPACT.', NULL, NULL, 10),
  ('projects', 'hero.intro', 'Projects introduction', 'text', 'Explore ACE SELECT installations across active LED, digital signage, branding and commercial environments.', NULL, NULL, 20),
  ('contact', 'hero.eyebrow', 'Contact eyebrow', 'text', 'CONTACT US', NULL, NULL, 10),
  ('contact', 'hero.headline', 'Contact hero headline', 'text', 'START A CONVERSATION', NULL, NULL, 20),
  ('contact', 'hero.intro', 'Contact introduction', 'text', 'Ready to elevate your brand? Reach out and let''s discuss your vision and spatial requirements.', NULL, NULL, 30)
ON CONFLICT (page_slug, content_key) DO NOTHING;

COMMIT;
