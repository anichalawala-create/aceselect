import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.resolve(process.cwd(), "src/data/cms-content-cache.json");

function readCache(): Record<string, any> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading CMS cache:", err);
  }
  return {};
}

function writeCache(data: Record<string, any>) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing CMS cache:", err);
  }
}

function updateCacheSection(section: string, sectionData: any) {
  const current = readCache();
  current[section] = sectionData;
  writeCache(current);
}

function isUuid(id: unknown): boolean {
  return typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section") || "all";
    const cache = readCache();
    const supabase = getSupabaseAdmin();

    // 1. HERO
    if (section === "hero") {
      try {
        const { data: dbHero, error } = await supabase.from("hero_content").select("*").limit(1).maybeSingle();
        if (dbHero && !error) {
          const merged = {
            ...(cache.hero || {}),
            ...dbHero,
            background_video_url: cache.hero?.background_video_url || "/videos/homepage-hero.mp4",
            poster_url: cache.hero?.poster_url || "",
          };
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("DB hero fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.hero });
    }

    // 2. ABOUT
    if (section === "about") {
      try {
        const { data: dbAbout, error } = await supabase.from("home_about").select("*").limit(1).maybeSingle();
        if (dbAbout && !error) {
          const merged = {
            eyebrow: dbAbout.eyebrow || cache.about?.eyebrow,
            headline: dbAbout.headline || cache.about?.headline,
            body1: dbAbout.body_paragraph1 || cache.about?.body1 || "",
            body2: dbAbout.body_paragraph2 || cache.about?.body2 || "",
          };
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("DB about fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.about });
    }

    // 3. STATS
    if (section === "stats") {
      try {
        const { data: dbStats, error } = await supabase.from("home_stats").select("*").order("sort_order");
        if (dbStats && dbStats.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbStats });
        }
      } catch (err) {
        console.error("DB stats fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.stats || [] });
    }

    // 4. PROCESS
    if (section === "process") {
      try {
        const { data: dbProcess, error } = await supabase.from("home_process_steps").select("*").order("sort_order");
        if (dbProcess && dbProcess.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbProcess });
        }
      } catch (err) {
        console.error("DB process fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.process || [] });
    }

    // 5. PAN-INDIA
    if (section === "pan-india" || section === "pan_india") {
      try {
        const { data: dbPan, error } = await supabase.from("pan_india_stats").select("*").order("sort_order");
        if (dbPan && dbPan.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbPan });
        }
      } catch (err) {
        console.error("DB pan-india fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.pan_india || [] });
    }

    // 6. COMPANY
    if (section === "company") {
      try {
        const { data: dbComp, error } = await supabase.from("company_page").select("*").limit(1).maybeSingle();
        if (dbComp && !error) {
          const merged = {
            ...(cache.company || {}),
            vision: dbComp.vision || cache.company?.vision,
            mission: dbComp.mission || cache.company?.mission,
            videoUrl: cache.company?.videoUrl || "/videos/company-bg.mp4",
            posterUrl: cache.company?.posterUrl || "",
          };
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("DB company fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.company });
    }

    // 7. SETTINGS
    if (section === "settings") {
      try {
        const { data: dbSettings, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
        if (dbSettings && !error) {
          const merged = {
            ...(cache.settings || {}),
            ...dbSettings,
          };
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("DB settings fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.settings });
    }

    // 8. SEO
    if (section === "seo") {
      try {
        const { data: dbSeo, error } = await supabase.from("page_seo").select("*");
        if (dbSeo && dbSeo.length > 0 && !error) {
          // Merge with cache to preserve nice display labels
          const merged = (cache.seo || []).map((cached: any) => {
            const found = dbSeo.find((s: any) => s.page_slug === cached.slug);
            if (found) {
              return {
                ...cached,
                title: found.title,
                description: found.meta_description,
                keywords: found.keywords || cached.keywords,
              };
            }
            return cached;
          });
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("DB seo fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.seo || [] });
    }

    // 9. CLIENTS
    if (section === "clients") {
      try {
        const { data: dbClients, error } = await supabase.from("cms_clients").select("*").order("sort_order");
        if (dbClients && dbClients.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbClients });
        }
      } catch (err) {
        console.error("DB clients fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.clients || [] });
    }

    // 10. TESTIMONIALS
    if (section === "testimonials") {
      try {
        const { data: dbTestimonials, error } = await supabase.from("cms_testimonials").select("*").order("sort_order");
        if (dbTestimonials && dbTestimonials.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbTestimonials });
        }
      } catch (err) {
        console.error("DB testimonials fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.testimonials || [] });
    }

    // 11. CERTIFICATIONS
    if (section === "certifications") {
      try {
        const { data: dbCerts, error } = await supabase.from("cms_certifications").select("*").order("sort_order");
        if (dbCerts && dbCerts.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbCerts });
        }
      } catch (err) {
        console.error("DB certs fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.certifications || [] });
    }

    // 12. TEAM
    if (section === "team") {
      try {
        const { data: dbTeam, error } = await supabase.from("team_members").select("*").order("sort_order");
        if (dbTeam && dbTeam.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbTeam });
        }
      } catch (err) {
        console.error("DB team fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.team || [] });
    }

    // 13. PRODUCTS
    if (section === "products") {
      try {
        const { data: dbProducts, error } = await supabase.from("cms_products").select("*").order("sort_order");
        if (dbProducts && dbProducts.length > 0 && !error) {
          return NextResponse.json({ success: true, data: dbProducts });
        }
      } catch (err) {
        console.error("DB products fetch error:", err);
      }
      return NextResponse.json({ success: true, data: cache.products || [] });
    }

    // Default: return all cache
    return NextResponse.json({ success: true, data: cache });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, data } = body;

    if (!section || data === undefined) {
      return NextResponse.json({ success: false, error: "Section and data are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Always update local cache immediately so it persists offline/instantly
    updateCacheSection(section, data);

    // Save to Supabase based on section
    if (section === "hero") {
      const heroFields = {
        eyebrow_text: data.eyebrow_text,
        headline_line1: data.headline_line1,
        headline_line2: data.headline_line2,
        subheadline: data.subheadline,
        cta_primary_label: data.cta_primary_label,
        cta_primary_href: data.cta_primary_href,
        cta_secondary_label: data.cta_secondary_label,
        cta_secondary_href: data.cta_secondary_href,
        bottom_tagline: data.bottom_tagline,
        vertical_labels: data.vertical_labels,
        is_active: data.is_active !== false,
      };

      const { data: existing } = await supabase.from("hero_content").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase.from("hero_content").update(heroFields).eq("id", existing[0].id);
      } else {
        await supabase.from("hero_content").insert(heroFields);
      }
    } else if (section === "about") {
      const aboutFields = {
        eyebrow: data.eyebrow,
        headline: data.headline,
        body_paragraph1: data.body1 || data.body_paragraph1 || "",
        body_paragraph2: data.body2 || data.body_paragraph2 || "",
      };

      const { data: existing } = await supabase.from("home_about").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase.from("home_about").update(aboutFields).eq("id", existing[0].id);
      } else {
        await supabase.from("home_about").insert(aboutFields);
      }
    } else if (section === "stats") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const stat = data[i];
          const statRow = {
            icon_name: stat.icon_name || "Building2",
            end_value: Number(stat.end_value) || 0,
            prefix: stat.prefix || null,
            suffix: stat.suffix || "",
            label: stat.label,
            sort_order: i + 1,
            is_active: stat.is_active !== false,
          };
          if (isUuid(stat.id)) {
            await supabase.from("home_stats").upsert({ id: stat.id, ...statRow });
          } else {
            const { data: matched } = await supabase.from("home_stats").select("id").eq("label", stat.label).limit(1);
            if (matched && matched.length > 0) {
              await supabase.from("home_stats").update(statRow).eq("id", matched[0].id);
            } else {
              await supabase.from("home_stats").insert(statRow);
            }
          }
        }
      }
    } else if (section === "process") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const step = data[i];
          const stepRow = {
            number: step.number,
            title: step.title,
            description: step.description,
            sort_order: i + 1,
            is_active: step.is_active !== false,
          };
          const { data: matched } = await supabase.from("home_process_steps").select("id").eq("number", step.number).limit(1);
          if (matched && matched.length > 0) {
            await supabase.from("home_process_steps").update(stepRow).eq("id", matched[0].id);
          } else {
            await supabase.from("home_process_steps").insert(stepRow);
          }
        }
      }
    } else if (section === "pan-india" || section === "pan_india") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const row = {
            label: item.label,
            value: item.value,
            sort_order: i + 1,
            is_active: true,
          };
          const { data: matched } = await supabase.from("pan_india_stats").select("id").eq("label", item.label).limit(1);
          if (matched && matched.length > 0) {
            await supabase.from("pan_india_stats").update(row).eq("id", matched[0].id);
          } else {
            await supabase.from("pan_india_stats").insert(row);
          }
        }
      }
    } else if (section === "company") {
      const compRow = {
        vision: data.vision,
        mission: data.mission,
      };
      const { data: existing } = await supabase.from("company_page").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase.from("company_page").update(compRow).eq("id", existing[0].id);
      } else {
        await supabase.from("company_page").insert(compRow);
      }
    } else if (section === "settings") {
      const settingFields = {
        site_name: data.site_name,
        tagline: data.tagline,
        company_description: data.company_description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        whatsapp_number: data.whatsapp_number,
        facebook_url: data.facebook_url,
        twitter_url: data.twitter_url,
        instagram_url: data.instagram_url,
        linkedin_url: data.linkedin_url,
        footer_description: data.footer_description,
        copyright_text: data.copyright_text,
        maintenance_mode: !!data.maintenance_mode,
      };
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1);
      if (existing && existing.length > 0) {
        await supabase.from("site_settings").update(settingFields).eq("id", existing[0].id);
      } else {
        await supabase.from("site_settings").insert(settingFields);
      }
    } else if (section === "seo") {
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const row = {
          page_slug: item.slug || item.page_slug,
          title: item.title,
          meta_description: item.description || item.meta_description,
          keywords: item.keywords || "",
        };
        await supabase.from("page_seo").upsert(row, { onConflict: "page_slug" });
      }
    } else if (section === "clients") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const c = data[i];
          const row = {
            name: c.name,
            tag: c.tag || "",
            tint_color: c.tint_color || "#283A97",
            is_active: c.is_active !== false,
            sort_order: i + 1,
          };
          if (isUuid(c.id)) {
            await supabase.from("cms_clients").update(row).eq("id", c.id);
          } else {
            const { data: matched } = await supabase.from("cms_clients").select("id").eq("name", c.name).limit(1);
            if (matched && matched.length > 0) {
              await supabase.from("cms_clients").update(row).eq("id", matched[0].id);
            } else {
              await supabase.from("cms_clients").insert(row);
            }
          }
        }
      }
    } else if (section === "testimonials") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const t = data[i];
          const row = {
            quote: t.quote,
            author_name: t.author_name,
            author_title: t.author_title,
            author_company: t.author_company,
            is_featured: !!t.is_featured,
            is_active: t.is_active !== false,
            sort_order: i + 1,
          };
          if (isUuid(t.id)) {
            await supabase.from("cms_testimonials").update(row).eq("id", t.id);
          } else {
            const { data: matched } = await supabase.from("cms_testimonials").select("id").eq("author_company", t.author_company).limit(1);
            if (matched && matched.length > 0) {
              await supabase.from("cms_testimonials").update(row).eq("id", matched[0].id);
            } else {
              await supabase.from("cms_testimonials").insert(row);
            }
          }
        }
      }
    } else if (section === "certifications") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const c = data[i];
          const row = {
            name: c.name,
            issuer: c.issuer,
            description: c.scope || c.description || "",
            image_url: c.image_url || "/images/certificates/iso.png",
            sort_order: i + 1,
            is_active: true,
          };
          if (isUuid(c.id)) {
            await supabase.from("cms_certifications").update(row).eq("id", c.id);
          } else {
            const { data: matched } = await supabase.from("cms_certifications").select("id").eq("name", c.name).limit(1);
            if (matched && matched.length > 0) {
              await supabase.from("cms_certifications").update(row).eq("id", matched[0].id);
            } else {
              await supabase.from("cms_certifications").insert(row);
            }
          }
        }
      }
    } else if (section === "team") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const m = data[i];
          const row = {
            name: m.name,
            role: m.role,
            department: m.department,
            experience: m.bio || "",
            sort_order: i + 1,
            is_active: m.is_active !== false,
          };
          if (isUuid(m.id)) {
            await supabase.from("team_members").update(row).eq("id", m.id);
          } else {
            const { data: matched } = await supabase.from("team_members").select("id").eq("name", m.name).limit(1);
            if (matched && matched.length > 0) {
              await supabase.from("team_members").update(row).eq("id", matched[0].id);
            } else {
              await supabase.from("team_members").insert(row);
            }
          }
        }
      }
    } else if (section === "products") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const p = data[i];
          const slug = p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `product-${i}`);
          const row = {
            name: p.name,
            slug,
            tagline: p.tagline || "",
            description: p.description || "",
            specs: Array.isArray(p.specs) ? p.specs.map((s: any) => typeof s === "string" ? { label: "Spec", value: s } : s) : [],
            sort_order: i + 1,
            is_featured: !!p.is_featured,
            is_active: true,
          };
          if (isUuid(p.id)) {
            await supabase.from("cms_products").update(row).eq("id", p.id);
          } else {
            await supabase.from("cms_products").upsert(row, { onConflict: "slug" });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: `Section '${section}' saved successfully.` });
  } catch (error: any) {
    console.error("Error saving CMS content:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const id = searchParams.get("id");

    if (!section || !id) {
      return NextResponse.json({ success: false, error: "Section and ID are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const cache = readCache();

    // Remove from local cache
    if (Array.isArray(cache[section])) {
      cache[section] = cache[section].filter((item: any) => item.id !== id && item.name !== id && item.slug !== id);
      writeCache(cache);
    }

    // Remove from Supabase if UUID or name
    const tableMap: Record<string, string> = {
      clients: "cms_clients",
      testimonials: "cms_testimonials",
      team: "team_members",
      certifications: "cms_certifications",
      products: "cms_products",
      stats: "home_stats",
    };

    const tableName = tableMap[section];
    if (tableName) {
      if (isUuid(id)) {
        await supabase.from(tableName).delete().eq("id", id);
      } else {
        await supabase.from(tableName).delete().or(`id.eq.${id},name.eq.${id},author_company.eq.${id},slug.eq.${id}`);
      }
    }

    return NextResponse.json({ success: true, message: `Item deleted from ${section}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
