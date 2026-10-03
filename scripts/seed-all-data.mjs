import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function getEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = getEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

// Valid vertical check
function normalizeVertical(v) {
  const allowed = ["digital", "signage", "kiosk", "software", "hybrid"];
  if (allowed.includes(v)) return v;
  if (v?.toLowerCase().includes("sign")) return "signage";
  if (v?.toLowerCase().includes("kiosk") || v?.toLowerCase().includes("atm")) return "kiosk";
  if (v?.toLowerCase().includes("soft") || v?.toLowerCase().includes("cms")) return "software";
  return "digital";
}

async function seed() {
  console.log("=== Starting Data Seeding to Supabase ===");

  // 1. Get Categories
  const { data: categories } = await supabase.from("product_categories").select("id, slug");
  const catMap = {};
  categories?.forEach(c => { catMap[c.slug] = c.id; });

  // 2. Load projectDetails
  // We can read projectDetails.ts directly
  const projectDetailsFile = fs.readFileSync(path.resolve(process.cwd(), "src/data/projectDetails.ts"), "utf-8");
  
  // Extract projects using node vm or tsx
  console.log("Seeding cms_projects...");
  // Let's use tsx or dynamic require
  const { execSync } = await import("child_process");
  const projectsJson = execSync(
    'npx -y tsx -e "import { projectDetails } from \'./src/data/projectDetails\'; console.log(JSON.stringify(projectDetails));"',
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );
  const projects = JSON.parse(projectsJson);

  let insertedProjects = 0;
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const row = {
      slug: p.slug || p.id,
      title: p.title,
      subtitle: p.subtitle || "",
      client: p.client,
      category: p.category,
      vertical: normalizeVertical(p.vertical),
      location: p.location,
      city: p.city,
      state: p.state,
      completion: p.completion || "Commissioned",
      scale: p.scale || "",
      hero_image: p.heroImage,
      gallery: p.gallery || [],
      description: p.description,
      challenge: p.challenge || null,
      solution: p.solution || null,
      metrics: p.metrics || [],
      specs: p.specs || [],
      highlights: p.highlights || [],
      is_featured: i < 4,
      is_active: true,
      sort_order: i + 1,
    };

    const { error } = await supabase
      .from("cms_projects")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.error(`Error inserting project ${p.slug}:`, error.message);
    } else {
      insertedProjects++;
    }
  }
  console.log(`✅ Uploaded ${insertedProjects}/${projects.length} projects to cms_projects!`);

  // 3. Seed Products from PRODUCT_CATEGORIES in Navbar
  console.log("\nSeeding cms_products...");
  const defaultCatId = categories?.[0]?.id || null;
  const sampleProducts = [
    {
      name: "Indoor Active LED Video Wall",
      slug: "indoor-active-led-video-wall",
      tagline: "Fine Pixel Pitch COB & SMD Display Systems",
      description: "Ultra-high definition indoor active LED video walls engineered for control rooms, boardrooms, luxury retail, and broadcast studios.",
      thumbnail_url: "/images/products/indoor-smd-page1.jpg",
      category_slug: "active-indoor-led",
      features: ["P1.2 to P3.0 Pixel Pitch", "Ultra-high refresh rate >3840Hz", "160° Wide Viewing Angle", "Seamless zero-bezel alignment"],
      specs: [{ label: "Pixel Pitch", value: "P1.2 / P1.5 / P1.8 / P2.0 / P2.5" }, { label: "Brightness", value: "800 - 1200 Nits" }, { label: "Refresh Rate", value: "3840 Hz" }],
      is_featured: true,
    },
    {
      name: "Outdoor High-Brightness LED Display",
      slug: "outdoor-high-brightness-led-display",
      tagline: "IP65 Weather-Resistant DOOH Advertising Billboards",
      description: "Heavy-duty outdoor active LED displays with daylight visibility and IP65 weatherproof casing for highways, commercial facades, and stadiums.",
      thumbnail_url: "/images/products/outdoor-smd-page1.jpg",
      category_slug: "outdoor-led-displays",
      features: [">6000 Nits Daylight Visible", "IP65 Waterproof Protection", "Energy Efficient ECO IC", "Front & Rear Serviceable"],
      specs: [{ label: "Brightness", value: ">6500 Nits" }, { label: "Ingress Protection", value: "IP65" }, { label: "Operating Temp", value: "-20°C to +60°C" }],
      is_featured: true,
    },
    {
      name: "Commercial Digital Standee",
      slug: "commercial-digital-standee",
      tagline: "Standalone Android 4K UHD Interactive Kiosks",
      description: "Ultra-slim free-standing digital signage kiosks with 4K UHD commercial displays, Android/Windows OS, and centralized cloud CMS support.",
      thumbnail_url: "/images/products/standee-banner.jpg",
      category_slug: "digital-standees",
      features: ["32\" to 65\" Commercial Panels", "Explosion-proof 4mm Tempered Glass", "Built-in Wi-Fi & LAN", "Cloud CMS Remote Scheduling"],
      specs: [{ label: "Sizes", value: "32\", 43\", 55\", 65\"" }, { label: "Resolution", value: "3840 x 2160 4K UHD" }, { label: "OS", value: "Android 12 / Windows 11" }],
      is_featured: true,
    },
    {
      name: "Architectural Signage & Wayfinding",
      slug: "architectural-signage-wayfinding",
      tagline: "Turnkey Exterior & Interior Architectural Identity",
      description: "Custom precision-engineered static and illuminated architectural signage, monolith pylons, and campus wayfinding systems.",
      thumbnail_url: "/images/projects/real-proj-p18-bkc--mumbai.jpeg",
      category_slug: "signage-software",
      features: ["Precision CNC & Laser Cut Stainless Steel", "High-efficiency Samsung LED illumination", "Custom corporate design matching", "Pan-India turnkey installation"],
      specs: [{ label: "Materials", value: "SS 304 / SS 316 / ACM / Acrylic" }, { label: "Warranty", value: "5 Years Outdoor" }],
      is_featured: true,
    },
  ];

  let insertedProducts = 0;
  for (let i = 0; i < sampleProducts.length; i++) {
    const prod = sampleProducts[i];
    const catId = catMap[prod.category_slug] || defaultCatId;
    const row = {
      name: prod.name,
      slug: prod.slug,
      tagline: prod.tagline,
      description: prod.description,
      thumbnail_url: prod.thumbnail_url,
      category_id: catId,
      features: prod.features,
      specs: prod.specs,
      is_featured: prod.is_featured,
      is_active: true,
      sort_order: i + 1,
    };

    const { error } = await supabase.from("cms_products").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error(`Error inserting product ${prod.slug}:`, error.message);
    } else {
      insertedProducts++;
    }
  }
  console.log(`✅ Uploaded ${insertedProducts} products to cms_products!`);

  console.log("\n=== Seeding Finished Successfully! ===");
}

seed().catch(console.error);
