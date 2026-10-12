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

// ================================================================
// Helper: fetch from Supabase OR return null (triggers fallback)
// ================================================================
async function fetchFromDB<T>(
  tableName: string,
  query: (supabase: any) => Promise<{ data: T | null; error: unknown }>
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
    if (error || !data) {
      return null;
    }
    if (Array.isArray(data) && data.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
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
  const seoCache = readCacheSection<any[]>("seo", []);
  const matched = seoCache.find((s) => s.slug === slug);
  if (matched) {
    return {
      id: matched.id || slug,
      page_slug: matched.slug,
      title: matched.title,
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
  background_video_url: "/videos/homepage-hero.mp4",
  poster_url: "",
  is_active: true,
  updated_at: new Date().toISOString(),
};

export async function getHeroContent(): Promise<HeroContent> {
  const cacheHero = readCacheSection<HeroContent>("hero", FALLBACK_HERO);
  const data = await fetchFromDB<HeroContent>("hero_content", async (supabase) =>
    supabase.from("hero_content").select("*").eq("is_active", true).limit(1).maybeSingle()
  );
  if (data) {
    return {
      ...FALLBACK_HERO,
      ...cacheHero,
      ...data,
      background_video_url: (data as any).background_video_url || cacheHero.background_video_url || "/videos/homepage-hero.mp4",
      poster_url: (data as any).poster_url || cacheHero.poster_url || "",
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
  const cacheAbout = readCacheSection<any>("about", FALLBACK_ABOUT);
  const data = await fetchFromDB<any>("home_about", async (supabase) =>
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

export async function getHomeStats(): Promise<HomeStat[]> {
  const data = await fetchFromDB<HomeStat[]>("home_stats", async (supabase) =>
    supabase.from("home_stats").select("*").eq("is_active", true).order("sort_order")
  );
  if (data && data.length > 0) return data;
  return readCacheSection<HomeStat[]>("stats", FALLBACK_STATS);
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
  if (data && data.length > 0) return data;
  return readCacheSection<HomeProcessStep[]>("process", FALLBACK_STEPS);
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
  if (data && data.length > 0) return data;
  const fromCache = readCacheSection<any[]>("pan_india", FALLBACK_PAN_INDIA);
  return fromCache.map((item, idx) => ({
    id: item.id || String(idx + 1),
    value: item.value,
    label: item.label,
    sort_order: item.sort_order ?? idx + 1,
    is_active: item.is_active !== false,
  }));
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
  const data = await fetchFromDB<ProductCategory[]>("product_categories", async (supabase) =>
    supabase.from("product_categories").select("*").eq("is_active", true).order("sort_order")
  );
  return data || [];
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
  if (data && data.length > 0) return data;
  return readCacheSection<CMSClient[]>("clients", FALLBACK_CLIENTS);
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
    quote: "Their end-to-end support from optical design to retail installation made our flagship in-store LED display rollouts smooth and flawless.",
    author_name: "Neha Verma",
    author_title: "Marketing & Retail Projects Head",
    author_company: "TITAN COMPANY / CARATLANE",
    is_featured: true,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    quote: "Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch branding and display systems.",
    author_name: "Amit Khanna",
    author_title: "Chief Manager - Infrastructure & Branding",
    author_company: "STATE BANK OF INDIA",
    is_featured: true,
    sort_order: 3,
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
  return featuredOnly ? list.filter((t) => t.is_featured) : list;
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
  const cacheCompany = readCacheSection<any>("company", FALLBACK_COMPANY);
  const data = await fetchFromDB<any>("company_page", async (supabase) =>
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
