import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const regex = new RegExp(`^${key}=(.*)$`, "m");
      const match = fs.readFileSync(envPath, "utf-8").match(regex);
      if (match && match[1]?.trim()) return match[1].trim();
    }
  } catch {}
  return "";
}

export async function GET() {
  const url = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    return NextResponse.json({
      connected: false,
      reason: "Missing NEXT_PUBLIC_SUPABASE_URL or API Key in .env.local",
    });
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const [projectsRes, productsRes, settingsRes] = await Promise.all([
      supabase.from("cms_projects").select("id", { count: "exact", head: true }),
      supabase.from("cms_products").select("id", { count: "exact", head: true }),
      supabase.from("site_settings").select("id").limit(1),
    ]);

    if (settingsRes.error) {
      return NextResponse.json({
        connected: false,
        error: settingsRes.error.message,
        url,
      });
    }

    return NextResponse.json({
      connected: true,
      url,
      stats: {
        projects: projectsRes.count ?? 0,
        products: productsRes.count ?? 0,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({
      connected: false,
      error: String(error),
      url,
    });
  }
}
