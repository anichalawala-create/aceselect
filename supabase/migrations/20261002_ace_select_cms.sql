-- ================================================================
-- ACE SELECT CMS — Full Supabase Schema
-- Migration: 20261002_ace_select_cms.sql
-- ================================================================
-- Applies to: aceselect-cms Supabase project
-- All tables use Row-Level Security (RLS) for production safety.
-- ================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast text search

-- ================================================================
-- 1. ADMIN USERS
-- ================================================================
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

-- ================================================================
-- 2. SITE SETTINGS (singleton row)
-- ================================================================
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

-- Insert default settings row
INSERT INTO site_settings (site_name) VALUES ('ACE SELECT') ON CONFLICT DO NOTHING;

-- ================================================================
-- 3. PAGE SEO
-- ================================================================
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT UNIQUE NOT NULL, -- 'home', 'who-we-are', 'projects', 'contact', 'industries'
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  og_image TEXT,
  keywords TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO page_seo (page_slug, title, meta_description) VALUES
  ('home', 'ACE SELECT — Indian OEM LED Video Wall & Digital Signage Manufacturer', 'ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems. Serving government, banking, corporate, and mission-critical environments across India.'),
  ('who-we-are', 'About ACE SELECT — Creative Thinking. Beyond The Box.', 'Discover ACE SELECT''s heritage of design-to-build excellence. 476+ cities, ₹100 Cr+ turnover, ISO 9001:2015 certified since 1996.'),
  ('projects', 'Projects — ACE SELECT Landmark Installations Across India', 'Explore ACE SELECT''s portfolio of premium LED video walls, digital signage, and signage solutions deployed across India.'),
  ('contact', 'Contact ACE SELECT — Start a Conversation', 'Reach out to ACE SELECT for innovative display, branding and retail solutions. Get a quote or discuss your project requirements.')
ON CONFLICT (page_slug) DO NOTHING;

-- ================================================================
-- 4. HERO CONTENT
-- ================================================================
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eyebrow_text TEXT NOT NULL DEFAULT 'INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE',
  headline_line1 TEXT NOT NULL DEFAULT 'ENGINEERED FOR INDIA.',
  headline_line2 TEXT NOT NULL DEFAULT 'DESIGNED FOR EVERY APPLICATION.',
  subheadline TEXT NOT NULL DEFAULT 'ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions for government, banking, corporate, institutional, commercial, and mission-critical environments across India.',
  cta_primary_label TEXT NOT NULL DEFAULT 'EXPLORE OUR WORK',
  cta_primary_href TEXT NOT NULL DEFAULT '/projects',
  cta_secondary_label TEXT NOT NULL DEFAULT 'GET A QUOTE',
  cta_secondary_href TEXT NOT NULL DEFAULT '/contact',
  bottom_tagline TEXT NOT NULL DEFAULT 'PROFESSIONALLY ENGINEERED APPLICATION-SPECIFIC DISPLAY SYSTEMS',
  vertical_labels TEXT[] NOT NULL DEFAULT ARRAY['GOVERNMENT','BANKING','CORPORATE','INSTITUTIONAL','COMMERCIAL','MISSION-CRITICAL'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO hero_content (eyebrow_text) VALUES ('INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE') ON CONFLICT DO NOTHING;

-- ================================================================
-- 5. HOME STATS
-- ================================================================
CREATE TABLE IF NOT EXISTS home_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon_name TEXT NOT NULL DEFAULT 'Building2',
  end_value INTEGER NOT NULL,
  prefix TEXT,
  suffix TEXT,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO home_stats (icon_name, end_value, prefix, suffix, label, sort_order) VALUES
  ('Building2',   476,   NULL,  '+',    'CITIES SERVED',        1),
  ('TrendingUp',  100,   '₹',   ' CR+', 'ANNUAL TURNOVER',      2),
  ('Monitor',     34250, NULL,  ' m²+', 'ACTIVE LED INSTALLED',  3),
  ('Calendar',    1996,  NULL,  '',     'SINCE YEAR',            4)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 6. HOME ABOUT SECTION
-- ================================================================
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

INSERT INTO home_about (eyebrow) VALUES ('ABOUT ACE SELECT') ON CONFLICT DO NOTHING;

-- ================================================================
-- 7. HOME PROCESS STEPS
-- ================================================================
CREATE TABLE IF NOT EXISTS home_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO home_process_steps (number, title, description, sort_order) VALUES
  ('01', 'DISCOVER', 'Understand your brand & objectives',   1),
  ('02', 'DESIGN',   'Conceptualize & plan',                  2),
  ('03', 'PRODUCE',  'Manufacture with precision',            3),
  ('04', 'DEPLOY',   'Rollout & installation',                4),
  ('05', 'INSPECT',  'Quality checks & compliance',           5),
  ('06', 'DELIVER',  'Handover & ongoing support',            6)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 8. PAN-INDIA STATS
-- ================================================================
CREATE TABLE IF NOT EXISTS pan_india_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO pan_india_stats (value, label, sort_order) VALUES
  ('27+',  'STATES',                    1),
  ('476+', 'CITIES',                    2),
  ('176+', 'REGIONAL REPRESENTATIVES',  3)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 9. PRODUCT CATEGORIES
-- ================================================================
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

INSERT INTO product_categories (name, slug, icon_name, description, sort_order) VALUES
  ('Active Indoor LED',    'active-indoor-led',    'Monitor',     'High-resolution indoor LED video wall solutions for premium environments', 1),
  ('Outdoor LED Displays', 'outdoor-led-displays', 'Sun',         'Weather-resistant high-brightness outdoor LED displays', 2),
  ('Digital Standees',     'digital-standees',     'Tablet',      'Android-powered digital standees from 32" to 65"', 3),
  ('Signage & Software',   'signage-software',     'Cloud',       'Architectural signage, kiosks, and Jio Software CMS', 4)
ON CONFLICT (slug) DO NOTHING;

-- ================================================================
-- 10. PRODUCTS
-- ================================================================
CREATE TABLE IF NOT EXISTS cms_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::JSONB,
  specs JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{label, value}]
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_products_category ON cms_products(category_id);
CREATE INDEX IF NOT EXISTS idx_cms_products_featured ON cms_products(is_featured) WHERE is_active = true;

-- ================================================================
-- 11. PROJECTS (PUBLIC PORTFOLIO)
-- ================================================================
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
  metrics JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{label, value}]
  specs JSONB NOT NULL DEFAULT '[]'::JSONB,   -- [{label, value}]
  highlights TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_project_id UUID REFERENCES cms_projects(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_projects_slug ON cms_projects(slug);
CREATE INDEX IF NOT EXISTS idx_cms_projects_featured ON cms_projects(is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cms_projects_vertical ON cms_projects(vertical);
CREATE INDEX IF NOT EXISTS idx_cms_projects_state ON cms_projects(state);

-- Home featured projects join table
CREATE TABLE IF NOT EXISTS home_featured_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES cms_projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ================================================================
-- 12. CLIENTS (LOGO MARQUEE)
-- ================================================================
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

INSERT INTO cms_clients (name, tag, tint_color, sort_order) VALUES
  ('SBI',                   'Public Sector',     '#283A97', 1),
  ('Bank of Baroda',        'National Bank',     '#EA580C', 2),
  ('ICICI Bank',            'Private Banking',   '#B91C1C', 3),
  ('Axis Bank',             'Commercial Banking','#9D174D', 4),
  ('HDFC Bank',             'Financial Services','#1E3A8A', 5),
  ('Indian Bank',           'Public Sector',     '#2563EB', 6),
  ('Muthoot Finance',       'NBFC Group',        '#DC2626', 7),
  ('Bank of Maharashtra',   'State Banking',     '#0284C7', 8),
  ('Cosmos Bank',           'Co-op Banking',     '#4F46E5', 9),
  ('City Union Bank',       'Commercial',        '#059669', 10),
  ('Punjab & Sindh Bank',   'Public Sector',     '#D97706', 11)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 13. TESTIMONIALS
-- ================================================================
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

INSERT INTO cms_testimonials (quote, author_name, author_title, author_company, sort_order) VALUES
  ('ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.', 'Rohit Sharma', 'Head - ATM Deployments & Infrastructure', 'HITACHI PAYMENT SERVICES', 1),
  ('Their end-to-end support from optical design to retail installation made our flagship in-store LED display rollouts smooth and flawless.', 'Neha Verma', 'Marketing & Retail Projects Head', 'TITAN COMPANY / CARATLANE', 2),
  ('Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch branding and display systems.', 'Amit Khanna', 'Chief Manager - Infrastructure & Branding', 'STATE BANK OF INDIA', 3)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 14. CERTIFICATIONS
-- ================================================================
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

-- ================================================================
-- 15. MEDIA LIBRARY
-- ================================================================
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

CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_library(media_type);

-- ================================================================
-- 16. ENQUIRIES / LEADS
-- ================================================================
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

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON cms_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON cms_enquiries(created_at DESC);

-- ================================================================
-- 17. TEAM MEMBERS
-- ================================================================
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

-- ================================================================
-- 18. COMPANY PAGE (singleton)
-- ================================================================
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
  values JSONB NOT NULL DEFAULT '[]'::JSONB,
  heritage_year INTEGER NOT NULL DEFAULT 1996,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO company_page (hero_headline) VALUES ('CREATIVE THINKING.') ON CONFLICT DO NOTHING;

-- ================================================================
-- 19. INDUSTRIES
-- ================================================================
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

INSERT INTO cms_industries (name, slug, icon_name, sort_order) VALUES
  ('Retail & Lifestyle',    'retail',       'Store',           1),
  ('Banking & Finance',     'finance',      'Landmark',        2),
  ('Healthcare',            'healthcare',   'Activity',        3),
  ('Automotive',            'automotive',   'Car',             4),
  ('Government',            'government',   'Building2',       5),
  ('Hospitality',           'hospitality',  'UtensilsCrossed', 6)
ON CONFLICT (slug) DO NOTHING;

-- ================================================================
-- 20. ADMIN AUDIT LOG
-- ================================================================
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

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);

-- ================================================================
-- 21. UPDATED_AT TRIGGER FUNCTION
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all mutable tables
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'admin_users','site_settings','hero_content','home_about',
    'cms_products','product_categories','cms_projects','media_library',
    'cms_enquiries','team_members','company_page','page_seo'
  ] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;
      CREATE TRIGGER trg_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

-- ================================================================
-- 22. ROW LEVEL SECURITY (RLS)
-- ================================================================
-- Public tables: readable by anyone (for SSR fetching), write requires auth
-- Admin tables: readable + writable only by authenticated admin users

-- Helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE supabase_auth_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS TEXT AS $$
  SELECT role FROM admin_users
  WHERE supabase_auth_id = auth.uid() AND is_active = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
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

-- Public READ policies (website can read active content anonymously)
CREATE POLICY "Public can read active projects"  ON cms_projects    FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active products"  ON cms_products    FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product cats"     ON product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read clients"          ON cms_clients     FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read testimonials"     ON cms_testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read certifications"   ON cms_certifications FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read home stats"       ON home_stats      FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read process steps"    ON home_process_steps FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read pan india stats"  ON pan_india_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read team members"     ON team_members    FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read industries"       ON cms_industries  FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site settings"    ON site_settings   FOR SELECT USING (true);
CREATE POLICY "Public can read hero content"     ON hero_content    FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read home about"       ON home_about      FOR SELECT USING (true);
CREATE POLICY "Public can read page seo"         ON page_seo        FOR SELECT USING (true);
CREATE POLICY "Public can read company page"     ON company_page    FOR SELECT USING (true);
CREATE POLICY "Public can read featured projs"   ON home_featured_projects FOR SELECT USING (is_active = true);

-- Public INSERT policy: Anyone can submit an enquiry
CREATE POLICY "Anyone can submit enquiry" ON cms_enquiries FOR INSERT WITH CHECK (true);

-- Admin WRITE policies
CREATE POLICY "Admins can manage projects"      ON cms_projects        FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage products"      ON cms_products        FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product cats"  ON product_categories  FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage clients"       ON cms_clients         FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage testimonials"  ON cms_testimonials    FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage certs"         ON cms_certifications  FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage media"         ON media_library       FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage enquiries"     ON cms_enquiries       FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update enquiries"     ON cms_enquiries       FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can manage settings"      ON site_settings       FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage seo"           ON page_seo            FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage hero"          ON hero_content        FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage home about"    ON home_about          FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage home stats"    ON home_stats          FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage process steps" ON home_process_steps  FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage pan india"     ON pan_india_stats     FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage team"          ON team_members        FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage company page"  ON company_page        FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage industries"    ON cms_industries      FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage featured"      ON home_featured_projects FOR ALL USING (is_admin());
CREATE POLICY "Admins can read audit logs"      ON audit_logs          FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read own profile"     ON admin_users         FOR SELECT USING (is_admin());
CREATE POLICY "Super admin can manage users"    ON admin_users         FOR ALL USING (get_admin_role() = 'SUPER_ADMIN');

-- ================================================================
-- 23. STORAGE BUCKETS (run in Supabase dashboard if needed)
-- ================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('aceselect-media', 'aceselect-media', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('aceselect-projects', 'aceselect-projects', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('aceselect-certificates', 'aceselect-certificates', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('aceselect-products', 'aceselect-products', true);

-- ================================================================
-- End of migration
-- ================================================================
