-- ============================================================================
-- ACE SELECT — FULL CMS INSTALLATION MIGRATION
-- ============================================================================
-- Run this single file in the Supabase SQL Editor when setting up a new
-- project, or when you are unsure which previous CMS migrations were applied.
--
-- This file is intentionally idempotent:
--   * safe to run more than once
--   * safe after a partially completed setup
--   * existing content is preserved by natural-key seed checks
--   * existing policies are dropped and recreated to avoid 42710 errors
--
-- After running this file:
--   1. Create/verify a Supabase Auth user for the admin.
--   2. Insert that user's auth UUID into admin_users.supabase_auth_id.
--   3. Configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
--      and SUPABASE_SERVICE_ROLE_KEY in the deployed application.
--   4. Open /admin/content and verify "Cloud CMS connected".
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. ADMIN, SETTINGS, SEO, AND HOMEPAGE CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'VIEWER'
    CHECK (role IN ('SUPER_ADMIN','CONTENT_ADMIN','PROJECT_MANAGER','MARKETING','SALES','VIEWER')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'ACE SELECT',
  tagline TEXT NOT NULL DEFAULT 'Engineered for India. Designed for Every Application.',
  company_description TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '(+91) 22 25182233',
  email TEXT NOT NULL DEFAULT 'info@aceselect.in',
  address TEXT NOT NULL DEFAULT 'C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai - 400079',
  whatsapp_number TEXT NOT NULL DEFAULT '+912225182233',
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  google_maps_embed TEXT,
  footer_description TEXT NOT NULL DEFAULT 'Trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India.',
  copyright_text TEXT NOT NULL DEFAULT '© {year} ACE SELECT. All rights reserved. ISO 9001:2015 Certified.',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  og_image TEXT,
  keywords TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS home_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon_name TEXT NOT NULL DEFAULT 'Building2',
  end_value INTEGER NOT NULL DEFAULT 0,
  prefix TEXT,
  suffix TEXT,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS home_about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eyebrow TEXT NOT NULL DEFAULT 'ABOUT ACE SELECT',
  headline TEXT NOT NULL DEFAULT 'CREATIVE THINKING. DESIGNING BEYOND THE BOX.',
  body_paragraph1 TEXT NOT NULL DEFAULT '',
  body_paragraph2 TEXT NOT NULL DEFAULT '',
  badge_text TEXT,
  badge_sub_text TEXT,
  cta_label TEXT NOT NULL DEFAULT 'DISCOVER OUR STORY',
  cta_href TEXT NOT NULL DEFAULT '/who-we-are',
  image_url TEXT NOT NULL DEFAULT '/images/products/standee-banner.jpg',
  image_alt TEXT NOT NULL DEFAULT 'ACE SELECT Android Digital Signage Standee',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS pan_india_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS company_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_headline TEXT NOT NULL DEFAULT 'CREATIVE THINKING.',
  hero_highlight TEXT NOT NULL DEFAULT 'BEYOND THE BOX.',
  hero_subheadline TEXT NOT NULL DEFAULT '',
  who_we_are_headline TEXT NOT NULL DEFAULT 'INVENTIVE SPACES.',
  who_we_are_highlight TEXT NOT NULL DEFAULT 'DESIGN-TO-BUILD EXCELLENCE.',
  who_we_are_body TEXT NOT NULL DEFAULT '',
  founder_name TEXT NOT NULL DEFAULT 'Kamal Gor',
  founder_title TEXT NOT NULL DEFAULT 'Founder & Managing Director, ACE SELECT',
  founder_quote TEXT NOT NULL DEFAULT '',
  founder_bio TEXT NOT NULL DEFAULT '',
  founder_photo_url TEXT,
  vision TEXT NOT NULL DEFAULT '',
  mission TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  poster_url TEXT,
  values JSONB NOT NULL DEFAULT '[]'::JSONB,
  heritage_year INTEGER NOT NULL DEFAULT 1996,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add columns that may be missing when an older partial schema already exists.
ALTER TABLE hero_content ADD COLUMN IF NOT EXISTS background_video_url TEXT;
ALTER TABLE hero_content ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE company_page ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE company_page ADD COLUMN IF NOT EXISTS poster_url TEXT;

INSERT INTO site_settings (site_name)
SELECT 'ACE SELECT'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

INSERT INTO page_seo (page_slug, title, meta_description)
SELECT * FROM (VALUES
  ('home', 'ACE SELECT — Indian OEM LED Video Wall & Digital Signage Manufacturer', 'ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems across India.'),
  ('who-we-are', 'About ACE SELECT — Creative Thinking. Beyond The Box.', 'Discover ACE SELECT design-to-build excellence, nationwide capabilities, and institutional heritage.'),
  ('projects', 'Projects — ACE SELECT Landmark Installations Across India', 'Explore ACE SELECT LED, digital signage, branding, and commercial installations across India.'),
  ('contact', 'Contact ACE SELECT — Start a Conversation', 'Reach out to ACE SELECT for display, branding, retail, and design-to-build solutions.'),
  ('industries', 'Industries — ACE SELECT', 'ACE SELECT creates impactful environments for diverse industries and leading brands.')
) AS seed(page_slug, title, meta_description)
WHERE NOT EXISTS (SELECT 1 FROM page_seo existing WHERE existing.page_slug = seed.page_slug);

INSERT INTO hero_content (eyebrow_text, background_video_url, poster_url)
SELECT 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE', '/home-hero.mp4', '/home-hero-poster.jpg'
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

INSERT INTO home_about (eyebrow, headline, body_paragraph1, body_paragraph2)
SELECT 'ABOUT ACE SELECT', 'CREATIVE THINKING. DESIGNING BEYOND THE BOX.',
  'At ACE SELECT, creative thinking is the driving force of our designing process.',
  'With a presence across India, ACE SELECT delivers inventive, elegant, and multi-functional spaces under one roof.'
WHERE NOT EXISTS (SELECT 1 FROM home_about);

INSERT INTO company_page (hero_headline, hero_highlight, hero_subheadline)
SELECT 'CREATIVE THINKING.', 'BEYOND THE BOX.', 'At ACE SELECT, creative thinking is the driving force of our designing process.'
WHERE NOT EXISTS (SELECT 1 FROM company_page);

INSERT INTO home_stats (icon_name, end_value, suffix, label, sort_order)
SELECT seed.icon_name, seed.end_value, seed.suffix, seed.label, seed.sort_order
FROM (VALUES
  ('Building2', 476, '+', 'CITIES SERVED', 1),
  ('TrendingUp', 100, ' CR+', 'ANNUAL TURNOVER', 2),
  ('Monitor', 34250, ' m²+', 'ACTIVE LED INSTALLED', 3),
  ('Calendar', 1996, '', 'SINCE YEAR', 4)
) AS seed(icon_name, end_value, suffix, label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM home_stats existing WHERE existing.label = seed.label);

INSERT INTO home_process_steps (number, title, description, sort_order)
SELECT seed.number, seed.title, seed.description, seed.sort_order
FROM (VALUES
  ('01', 'DISCOVER', 'Understand your brand and objectives', 1),
  ('02', 'DESIGN', 'Conceptualize and plan', 2),
  ('03', 'PRODUCE', 'Manufacture with precision', 3),
  ('04', 'DEPLOY', 'Rollout and installation', 4),
  ('05', 'INSPECT', 'Quality checks and compliance', 5),
  ('06', 'DELIVER', 'Handover and ongoing support', 6)
) AS seed(number, title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM home_process_steps existing WHERE existing.number = seed.number);

INSERT INTO pan_india_stats (value, label, sort_order)
SELECT seed.value, seed.label, seed.sort_order
FROM (VALUES
  ('27+', 'STATES', 1),
  ('476+', 'CITIES', 2),
  ('176+', 'REGIONAL REPRESENTATIVES', 3)
) AS seed(value, label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM pan_india_stats existing WHERE existing.label = seed.label);

-- ============================================================================
-- 2. PRODUCTS, PROJECTS, CLIENTS, TESTIMONIALS, CERTIFICATIONS, TEAM
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Monitor',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::JSONB,
  specs JSONB NOT NULL DEFAULT '[]'::JSONB,
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  client TEXT NOT NULL,
  category TEXT NOT NULL,
  vertical TEXT NOT NULL DEFAULT 'digital'
    CHECK (vertical IN ('digital', 'signage', 'kiosk', 'software', 'hybrid')),
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  completion TEXT NOT NULL DEFAULT 'Commissioned',
  scale TEXT NOT NULL DEFAULT '',
  hero_image TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]'::JSONB,
  description TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  metrics JSONB NOT NULL DEFAULT '[]'::JSONB,
  specs JSONB NOT NULL DEFAULT '[]'::JSONB,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_project_id UUID REFERENCES cms_projects(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_featured_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES cms_projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS cms_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  tint_color TEXT NOT NULL DEFAULT '#283A97',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  author_company TEXT NOT NULL,
  author_photo_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  certificate_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  experience TEXT,
  available_hours TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Building2',
  description TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_cms_products_category ON cms_products(category_id);
CREATE INDEX IF NOT EXISTS idx_cms_products_featured ON cms_products(is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cms_projects_slug ON cms_projects(slug);
CREATE INDEX IF NOT EXISTS idx_cms_projects_featured ON cms_projects(is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cms_projects_vertical ON cms_projects(vertical);
CREATE INDEX IF NOT EXISTS idx_cms_projects_state ON cms_projects(state);

INSERT INTO product_categories (name, slug, icon_name, description, sort_order)
SELECT seed.name, seed.slug, seed.icon_name, seed.description, seed.sort_order
FROM (VALUES
  ('Active Indoor LED', 'active-indoor-led', 'Monitor', 'High-resolution indoor LED video wall solutions', 1),
  ('Outdoor LED Displays', 'outdoor-led-displays', 'Sun', 'Weather-resistant high-brightness outdoor LED displays', 2),
  ('Digital Standees', 'digital-standees', 'Tablet', 'Android-powered digital standees from 32 to 65 inches', 3),
  ('Signage & Software', 'signage-software', 'Cloud', 'Architectural signage, kiosks, and cloud CMS', 4)
) AS seed(name, slug, icon_name, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM product_categories existing WHERE existing.slug = seed.slug);

INSERT INTO cms_clients (name, tag, tint_color, sort_order)
SELECT seed.name, seed.tag, seed.tint_color, seed.sort_order
FROM (VALUES
  ('SBI', 'Public Sector', '#283A97', 1),
  ('Bank of Baroda', 'National Bank', '#EA580C', 2),
  ('ICICI Bank', 'Private Banking', '#B91C1C', 3),
  ('Axis Bank', 'Commercial Banking', '#9D174D', 4),
  ('HDFC Bank', 'Financial Services', '#1E3A8A', 5),
  ('Indian Bank', 'Public Sector', '#2563EB', 6),
  ('Muthoot Finance', 'NBFC Group', '#DC2626', 7),
  ('Bank of Maharashtra', 'State Banking', '#0284C7', 8),
  ('Cosmos Bank', 'Co-op Banking', '#4F46E5', 9),
  ('City Union Bank', 'Commercial', '#059669', 10),
  ('Punjab & Sindh Bank', 'Public Sector', '#D97706', 11)
) AS seed(name, tag, tint_color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_clients existing WHERE existing.name = seed.name);

INSERT INTO cms_testimonials (quote, author_name, author_title, author_company, sort_order)
SELECT seed.quote, seed.author_name, seed.author_title, seed.author_company, seed.sort_order
FROM (VALUES
  ('ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.', 'Rohit Sharma', 'Head - ATM Deployments & Infrastructure', 'HITACHI PAYMENT SERVICES', 1),
  ('Their end-to-end support from optical design to retail installation made our flagship in-store LED display rollouts smooth and flawless.', 'Neha Verma', 'Marketing & Retail Projects Head', 'TITAN COMPANY / CARATLANE', 2),
  ('Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch branding and display systems.', 'Amit Khanna', 'Chief Manager - Infrastructure & Branding', 'STATE BANK OF INDIA', 3)
) AS seed(quote, author_name, author_title, author_company, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_testimonials existing WHERE existing.author_company = seed.author_company);

INSERT INTO cms_industries (name, slug, icon_name, sort_order)
SELECT seed.name, seed.slug, seed.icon_name, seed.sort_order
FROM (VALUES
  ('Retail & Lifestyle', 'retail', 'Store', 1),
  ('Banking & Finance', 'finance', 'Landmark', 2),
  ('Healthcare', 'healthcare', 'Activity', 3),
  ('Automotive', 'automotive', 'Car', 4),
  ('Government', 'government', 'Building2', 5),
  ('Hospitality', 'hospitality', 'UtensilsCrossed', 6)
) AS seed(name, slug, icon_name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_industries existing WHERE existing.slug = seed.slug);

-- ============================================================================
-- 3. MEDIA, ENQUIRIES, NAVIGATION SUPPORT, AUDIT, AND PAGE CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image','video','document','other')),
  alt_text TEXT,
  caption TEXT,
  folder TEXT NOT NULL DEFAULT 'general',
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  service_interest TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','qualified','converted','closed')),
  source TEXT NOT NULL DEFAULT 'website'
    CHECK (source IN ('website','whatsapp','email','phone','referral')),
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_library(media_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON cms_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON cms_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_cms_page_content_page_slug ON cms_page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_cms_page_content_active ON cms_page_content(page_slug, sort_order) WHERE is_active = true;

INSERT INTO cms_page_content (page_slug, content_key, label, content_type, value, media_url, alt_text, sort_order)
SELECT seed.page_slug, seed.content_key, seed.label, seed.content_type, seed.value, seed.media_url, seed.alt_text, seed.sort_order
FROM (VALUES
  ('home', 'hero.eyebrow', 'Hero eyebrow', 'text', 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE', NULL, NULL, 10),
  ('home', 'hero.headline_line1', 'Hero headline line 1', 'text', 'ENGINEERED FOR INDIA.', NULL, NULL, 11),
  ('home', 'hero.headline_line2', 'Hero headline line 2', 'text', 'DESIGNED FOR EVERY APPLICATION.', NULL, NULL, 12),
  ('home', 'hero.subheadline', 'Hero subheadline', 'text', 'ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions across India.', NULL, NULL, 13),
  ('home', 'hero.background', 'Hero background video', 'video', '', '/home-hero.mp4', 'ACE SELECT homepage hero video', 30),
  ('home', 'hero.poster', 'Hero poster image', 'image', '', '/home-hero-poster.jpg', 'ACE SELECT homepage hero poster', 31),
  ('home', 'about.eyebrow', 'About eyebrow', 'text', 'ABOUT ACE SELECT', NULL, NULL, 40),
  ('home', 'about.headline', 'About headline', 'text', 'CREATIVE THINKING.\nDESIGNING BEYOND THE BOX.', NULL, NULL, 41),
  ('home', 'about.body1', 'About paragraph 1', 'text', 'At ACE SELECT, creative thinking is the driving force of our designing process.', NULL, NULL, 42),
  ('home', 'about.body2', 'About paragraph 2', 'text', 'ACE SELECT delivers inventive, elegant, and multi-functional spaces under one roof.', NULL, NULL, 43),
  ('home', 'about.image', 'About image', 'image', '', '/images/products/standee-banner.jpg', 'ACE SELECT Android Digital Signage Standee', 44),
  ('home', 'products.eyebrow', 'Products eyebrow', 'text', 'OUR PRODUCTS & SOLUTIONS', NULL, NULL, 50),
  ('home', 'products.headline', 'Products headline', 'text', 'HARDWARE, SIGNAGE\n& CLOUD CMS.', NULL, NULL, 51),
  ('home', 'products.intro', 'Products introduction', 'text', 'From active LED displays and digital standees to architectural signage and secure cloud CMS, explore our end-to-end directory.', NULL, NULL, 52),
  ('home', 'pan_india.headline', 'Pan-India headline', 'text', 'BUILT FOR SCALE.', NULL, NULL, 60),
  ('home', 'pan_india.intro', 'Pan-India introduction', 'text', 'From a single location to nationwide rollouts, our network enables consistent execution across India.', NULL, NULL, 61),
  ('home', 'projects.headline', 'Featured projects headline', 'text', 'PROJECTS THAT\nMAKE AN IMPACT.', NULL, NULL, 70),
  ('home', 'projects.intro', 'Featured projects introduction', 'text', 'Explore recent work across retail, corporate, outdoor display, and commercial environments.', NULL, NULL, 71),
  ('home', 'process.headline', 'Process headline', 'text', 'FROM VISION\nTO REALITY.', NULL, NULL, 80),
  ('home', 'process.intro', 'Process introduction', 'text', 'A streamlined process to ensure quality, consistency, and on-time delivery.', NULL, NULL, 81),
  ('home', 'clients.headline', 'Clients headline', 'text', 'TRUSTED BY LEADING FINANCIAL INSTITUTIONS.', NULL, NULL, 90),
  ('home', 'testimonials.headline', 'Testimonials headline', 'text', 'WHAT OUR\nCLIENTS SAY.', NULL, NULL, 100),
  ('home', 'cta.headline', 'Final CTA headline', 'text', 'LET''S BUILD\nWHAT''S NEXT.', NULL, NULL, 110),
  ('home', 'cta.body', 'Final CTA body', 'text', 'Partner with ACE SELECT for innovative display, branding, and retail solutions.', NULL, NULL, 111),
  ('who-we-are', 'hero.eyebrow', 'Company hero eyebrow', 'text', 'ABOUT ACE SELECT', NULL, NULL, 9),
  ('who-we-are', 'hero.headline', 'Company hero headline', 'text', 'CREATIVE THINKING.\nBEYOND THE BOX.', NULL, NULL, 10),
  ('who-we-are', 'hero.intro', 'Company hero introduction', 'text', 'At ACE SELECT, creative thinking is the driving force of our designing process.', NULL, NULL, 11),
  ('who-we-are', 'hero.video', 'Company hero video', 'video', '', '/company-hero.mp4', 'ACE SELECT company story video', 20),
  ('who-we-are', 'hero.poster', 'Company hero poster', 'image', '', '/home-hero-poster.jpg', 'ACE SELECT company story poster', 21),
  ('who-we-are', 'story.eyebrow', 'Story eyebrow', 'text', 'WHO WE ARE', NULL, NULL, 29),
  ('who-we-are', 'story.headline', 'Story headline', 'text', 'INVENTIVE SPACES.\nDESIGN-TO-BUILD EXCELLENCE.', NULL, NULL, 30),
  ('who-we-are', 'story.image', 'Story image', 'image', '', '/images/projects/project-bkc-elobby.jpg', 'Modern commercial workplace architecture', 31),
  ('services', 'hero.eyebrow', 'Services eyebrow', 'text', 'WHAT WE DO BEST', NULL, NULL, 9),
  ('services', 'hero.headline', 'Services headline', 'text', 'END-TO-END\nSOLUTIONS\nFOR EVERY SPACE.', NULL, NULL, 10),
  ('services', 'hero.intro', 'Services introduction', 'text', 'From branding and retail execution to commercial interiors, activations, and rebranding, ACE SELECT delivers integrated solutions designed for scale.', NULL, NULL, 20),
  ('industries', 'hero.eyebrow', 'Industries eyebrow', 'text', 'SECTORS WE SERVE', NULL, NULL, 9),
  ('industries', 'hero.headline', 'Industries headline', 'text', 'EXPERTISE ACROSS\nINDUSTRIES', NULL, NULL, 10),
  ('industries', 'hero.intro', 'Industries introduction', 'text', 'We bring specialized knowledge and architectural precision to diverse sectors, creating impactful environments for leading global brands.', NULL, NULL, 20),
  ('projects', 'hero.eyebrow', 'Projects eyebrow', 'text', 'AUTHENTIC COMPANY PORTFOLIO', NULL, NULL, 9),
  ('projects', 'hero.headline', 'Projects headline', 'text', 'LANDMARK\nPROJECTS', NULL, NULL, 10),
  ('projects', 'hero.intro', 'Projects introduction', 'text', 'Explore ACE SELECT installations across active LED, digital signage, branding, and commercial environments.', NULL, NULL, 20),
  ('contact', 'hero.eyebrow', 'Contact eyebrow', 'text', 'CONTACT US', NULL, NULL, 9),
  ('contact', 'hero.headline', 'Contact headline', 'text', 'START A\nCONVERSATION', NULL, NULL, 10),
  ('contact', 'hero.intro', 'Contact introduction', 'text', 'Ready to elevate your brand? Reach out and let''s discuss your vision and spatial requirements.', NULL, NULL, 20)
) AS seed(page_slug, content_key, label, content_type, value, media_url, alt_text, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM cms_page_content existing
  WHERE existing.page_slug = seed.page_slug AND existing.content_key = seed.content_key
);

-- ============================================================================
-- 4. TIMESTAMPS, VALIDATION, ADMIN HELPERS, RLS, AND STORAGE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'admin_users', 'site_settings', 'hero_content', 'home_about',
    'cms_products', 'product_categories', 'cms_projects', 'cms_enquiries',
    'team_members', 'company_page', 'page_seo', 'cms_page_content'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I', table_name, table_name);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      table_name, table_name
    );
  END LOOP;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_page_slug_format
    CHECK (page_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(page_slug) <= 80);
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_key_format
    CHECK (content_key ~ '^[a-z0-9]+([._-][a-z0-9]+)*$' AND length(content_key) <= 120);
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_media_url_format
    CHECK (
      media_url IS NULL OR media_url = ''
      OR media_url ~ '^(https?://[^[:space:]]+|/[^/[:space:]][^[:space:]]*)$'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_text_has_no_media
    CHECK (content_type <> 'text' OR media_url IS NULL OR media_url = '');
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER TABLE cms_page_content
    ADD CONSTRAINT cms_page_content_media_value_format
    CHECK (
      content_type = 'text' OR btrim(value) = ''
      OR value ~ '^(https?://[^[:space:]]+|/[^/[:space:]][^[:space:]]*)$'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE supabase_auth_id = auth.uid() AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_users
  WHERE supabase_auth_id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pan_india_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_featured_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_content ENABLE ROW LEVEL SECURITY;

-- Drop all policy names used by the CMS before recreating them. This prevents
-- PostgreSQL error 42710 when an administrator runs this master file again.
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can read active projects" ON cms_projects;
  DROP POLICY IF EXISTS "Public can read active products" ON cms_products;
  DROP POLICY IF EXISTS "Public can read product cats" ON product_categories;
  DROP POLICY IF EXISTS "Public can read clients" ON cms_clients;
  DROP POLICY IF EXISTS "Public can read testimonials" ON cms_testimonials;
  DROP POLICY IF EXISTS "Public can read certifications" ON cms_certifications;
  DROP POLICY IF EXISTS "Public can read home stats" ON home_stats;
  DROP POLICY IF EXISTS "Public can read process steps" ON home_process_steps;
  DROP POLICY IF EXISTS "Public can read pan india stats" ON pan_india_stats;
  DROP POLICY IF EXISTS "Public can read team members" ON team_members;
  DROP POLICY IF EXISTS "Public can read industries" ON cms_industries;
  DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
  DROP POLICY IF EXISTS "Public can read hero content" ON hero_content;
  DROP POLICY IF EXISTS "Public can read home about" ON home_about;
  DROP POLICY IF EXISTS "Public can read page seo" ON page_seo;
  DROP POLICY IF EXISTS "Public can read company page" ON company_page;
  DROP POLICY IF EXISTS "Public can read featured projs" ON home_featured_projects;
  DROP POLICY IF EXISTS "Public can read active page content" ON cms_page_content;
  DROP POLICY IF EXISTS "Anyone can submit enquiry" ON cms_enquiries;
  DROP POLICY IF EXISTS "Admins can manage projects" ON cms_projects;
  DROP POLICY IF EXISTS "Admins can manage products" ON cms_products;
  DROP POLICY IF EXISTS "Admins can manage product cats" ON product_categories;
  DROP POLICY IF EXISTS "Admins can manage clients" ON cms_clients;
  DROP POLICY IF EXISTS "Admins can manage testimonials" ON cms_testimonials;
  DROP POLICY IF EXISTS "Admins can manage certs" ON cms_certifications;
  DROP POLICY IF EXISTS "Admins can manage media" ON media_library;
  DROP POLICY IF EXISTS "Admins can manage enquiries" ON cms_enquiries;
  DROP POLICY IF EXISTS "Admins can update enquiries" ON cms_enquiries;
  DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;
  DROP POLICY IF EXISTS "Admins can manage seo" ON page_seo;
  DROP POLICY IF EXISTS "Admins can manage hero" ON hero_content;
  DROP POLICY IF EXISTS "Admins can manage home about" ON home_about;
  DROP POLICY IF EXISTS "Admins can manage home stats" ON home_stats;
  DROP POLICY IF EXISTS "Admins can manage process steps" ON home_process_steps;
  DROP POLICY IF EXISTS "Admins can manage pan india" ON pan_india_stats;
  DROP POLICY IF EXISTS "Admins can manage team" ON team_members;
  DROP POLICY IF EXISTS "Admins can manage company page" ON company_page;
  DROP POLICY IF EXISTS "Admins can manage industries" ON cms_industries;
  DROP POLICY IF EXISTS "Admins can manage featured" ON home_featured_projects;
  DROP POLICY IF EXISTS "Admins can manage page content" ON cms_page_content;
  DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
  DROP POLICY IF EXISTS "Admins can read own profile" ON admin_users;
  DROP POLICY IF EXISTS "Super admin can manage users" ON admin_users;
END;
$$;

-- Public read policies
CREATE POLICY "Public can read active projects" ON cms_projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active products" ON cms_products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product cats" ON product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read clients" ON cms_clients FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read testimonials" ON cms_testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read certifications" ON cms_certifications FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read home stats" ON home_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read process steps" ON home_process_steps FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read pan india stats" ON pan_india_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read team members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read industries" ON cms_industries FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read hero content" ON hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read home about" ON home_about FOR SELECT USING (true);
CREATE POLICY "Public can read page seo" ON page_seo FOR SELECT USING (true);
CREATE POLICY "Public can read company page" ON company_page FOR SELECT USING (true);
CREATE POLICY "Public can read featured projs" ON home_featured_projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active page content" ON cms_page_content FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can submit enquiry" ON cms_enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage projects" ON cms_projects FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage products" ON cms_products FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage product cats" ON product_categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage clients" ON cms_clients FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage testimonials" ON cms_testimonials FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage certs" ON cms_certifications FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage media" ON media_library FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage enquiries" ON cms_enquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update enquiries" ON cms_enquiries FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage seo" ON page_seo FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage hero" ON hero_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage home about" ON home_about FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage home stats" ON home_stats FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage process steps" ON home_process_steps FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage pan india" ON pan_india_stats FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage team" ON team_members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage company page" ON company_page FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage industries" ON cms_industries FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage featured" ON home_featured_projects FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage page content" ON cms_page_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read own profile" ON admin_users FOR SELECT USING (is_admin());
CREATE POLICY "Super admin can manage users" ON admin_users FOR ALL USING (get_admin_role() = 'SUPER_ADMIN') WITH CHECK (get_admin_role() = 'SUPER_ADMIN');

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('aceselect-media', 'aceselect-media', true),
  ('aceselect-projects', 'aceselect-projects', true),
  ('aceselect-certificates', 'aceselect-certificates', true),
  ('aceselect-products', 'aceselect-products', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public can read ACE SELECT media" ON storage.objects;
CREATE POLICY "Public can read ACE SELECT media"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('aceselect-media', 'aceselect-projects', 'aceselect-certificates', 'aceselect-products'));

DROP POLICY IF EXISTS "Admins can upload ACE SELECT media" ON storage.objects;
CREATE POLICY "Admins can upload ACE SELECT media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('aceselect-media', 'aceselect-projects', 'aceselect-certificates', 'aceselect-products') AND is_admin());

DROP POLICY IF EXISTS "Admins can update ACE SELECT media" ON storage.objects;
CREATE POLICY "Admins can update ACE SELECT media"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('aceselect-media', 'aceselect-projects', 'aceselect-certificates', 'aceselect-products') AND is_admin())
  WITH CHECK (bucket_id IN ('aceselect-media', 'aceselect-projects', 'aceselect-certificates', 'aceselect-products') AND is_admin());

DROP POLICY IF EXISTS "Admins can delete ACE SELECT media" ON storage.objects;
CREATE POLICY "Admins can delete ACE SELECT media"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('aceselect-media', 'aceselect-projects', 'aceselect-certificates', 'aceselect-products') AND is_admin());

COMMIT;

-- ============================================================================
-- END OF FULL ACE SELECT CMS INSTALLATION MIGRATION
-- ============================================================================
