// =====================================================
// ACE SELECT CMS — Canonical Type Definitions
// =====================================================

// -------------------------------------------------------
// ROLES
// -------------------------------------------------------
export type AdminRole =
  | "SUPER_ADMIN"
  | "CONTENT_ADMIN"
  | "PROJECT_MANAGER"
  | "MARKETING"
  | "SALES"
  | "VIEWER";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

// -------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------
export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  company_description: string;
  phone: string;
  email: string;
  address: string;
  whatsapp_number: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  google_maps_embed?: string;
  footer_description: string;
  copyright_text: string;
  maintenance_mode: boolean;
  updated_at: string;
}

// -------------------------------------------------------
// SEO
// -------------------------------------------------------
export interface PageSEO {
  id: string;
  page_slug: string; // e.g. "home", "who-we-are", "projects", "contact"
  title: string;
  meta_description: string;
  og_image?: string;
  keywords?: string;
  updated_at: string;
}

// -------------------------------------------------------
// PAGE CONTENT OVERRIDES
// -------------------------------------------------------
export type PageContentType = "text" | "image" | "video";

/** A stable, addressable content override for a public page. */
export interface PageContent {
  id: string;
  page_slug: string;
  content_key: string;
  label: string;
  content_type: PageContentType;
  value: string;
  media_url?: string | null;
  alt_text?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PageContentMap = Record<string, PageContent>;

// -------------------------------------------------------
// HOMEPAGE
// -------------------------------------------------------
export interface HeroContent {
  id: string;
  eyebrow_text: string; // "INDIAN OEM & MANUFACTURER | ..."
  headline_line1: string; // "ENGINEERED FOR INDIA."
  headline_line2: string; // "DESIGNED FOR EVERY APPLICATION."
  subheadline: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  bottom_tagline: string;
  vertical_labels: string[]; // GOVERNMENT, BANKING, etc.
  background_video_url?: string;
  poster_url?: string;
  is_active: boolean;
  updated_at: string;
}

export interface HomeStat {
  id: string;
  icon_name: string; // lucide icon name e.g. "Building2"
  end_value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export interface HomeAboutSection {
  id: string;
  eyebrow: string;
  headline: string;
  body_paragraph1: string;
  body_paragraph2: string;
  body1?: string;
  body2?: string;
  badge_text?: string;
  badge_sub_text?: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  image_alt: string;
  updated_at: string;
}

export interface HomeProcessStep {
  id: string;
  number: string; // "01", "02", ...
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface HomeFeaturedProject {
  id: string;
  project_id: string; // FK to cms_projects
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// WHO WE ARE (COMPANY) PAGE
// -------------------------------------------------------
export interface CompanyPage {
  id: string;
  hero_headline: string;
  hero_highlight: string;
  hero_subheadline: string;
  who_we_are_headline: string;
  who_we_are_highlight: string;
  who_we_are_body: string;
  founder_name: string;
  founder_title: string;
  founder_quote: string;
  founder_bio: string;
  founder_photo_url?: string;
  vision: string;
  mission: string;
  videoUrl?: string;
  posterUrl?: string;
  values: { title: string; description: string }[];
  heritage_year: number;
  updated_at: string;
}

export interface TeamMemberCMS {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photo_url?: string;
  experience: string;
  available_hours: string;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon_name?: string;
  icon?: string;
  description: string;
  badge?: string;
  sort_order: number;
  is_active: boolean;
}

export interface CMSProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnail_url: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  features: string[];
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------
// PROJECTS (PUBLIC PORTFOLIO)
// -------------------------------------------------------
export interface CMSProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  vertical: "digital" | "signage" | "kiosk" | "software" | "hybrid";
  location: string;
  city: string;
  state: string;
  completion: string;
  scale: string;
  hero_image: string;
  gallery: string[];
  description: string;
  challenge?: string;
  solution?: string;
  metrics: { label: string; value: string }[];
  specs: { label: string; value: string }[];
  highlights: string[];
  is_featured: boolean;
  is_active: boolean;
  next_project_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------
// CLIENTS (LOGO MARQUEE)
// -------------------------------------------------------
export interface CMSClient {
  id: string;
  name: string;
  tag: string;
  logo_url?: string;
  tint_color: string;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// TESTIMONIALS
// -------------------------------------------------------
export interface CMSTestimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_company: string;
  author_photo_url?: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// CERTIFICATIONS / APPROVALS SHOWCASE
// -------------------------------------------------------
export interface CMSCertification {
  id: string;
  name: string;
  issuer: string;
  description?: string;
  image_url: string;
  certificate_number?: string;
  issue_date?: string;
  expiry_date?: string;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// MEDIA LIBRARY
// -------------------------------------------------------
export type MediaType = "image" | "video" | "document" | "other";

export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  media_type: MediaType;
  alt_text?: string;
  caption?: string;
  folder?: string;
  width?: number;
  height?: number;
  uploaded_by: string;
  created_at: string;
}

// -------------------------------------------------------
// ENQUIRIES / LEADS
// -------------------------------------------------------
export type EnquiryStatus = "new" | "contacted" | "qualified" | "converted" | "closed";
export type EnquirySource = "website" | "whatsapp" | "email" | "phone" | "referral";

export interface CMSEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service_interest?: string;
  status: EnquiryStatus;
  source: EnquirySource;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------
export interface NavItem {
  id: string;
  label: string;
  href: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
}

// -------------------------------------------------------
// INDUSTRIES PAGE
// -------------------------------------------------------
export interface CMSIndustry {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  description: string;
  hero_image_url?: string;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// PAN-INDIA STATS
// -------------------------------------------------------
export interface PanIndiaStat {
  id: string;
  value: string; // "27+", "476+", "176+"
  label: string;
  sort_order: number;
  is_active: boolean;
}

// -------------------------------------------------------
// ADMIN AUDIT LOG
// -------------------------------------------------------
export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string; // "CREATE_PROJECT", "UPDATE_SETTINGS", etc.
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// -------------------------------------------------------
// Supabase DB Row Helpers
// -------------------------------------------------------
export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};
