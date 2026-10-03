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
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

async function main() {
  const env = getEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("=== ACE SELECT Supabase Data Upload ===");
  console.log(`Supabase URL: ${url || "(not set)"}`);
  console.log(`API Key: ${key ? "Present (" + key.slice(0, 12) + "...)" : "(not set)"}`);

  if (!url || !key) {
    console.error("\n❌ Missing Supabase credentials in .env.local!");
    console.log("Please add your NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY to .env.local.");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("\nTesting connection to Supabase...");
  const { data: testData, error: testError } = await supabase.from("site_settings").select("count").limit(1);

  if (testError && testError.code === "42P01") {
    console.log("⚠️ Tables have not been created yet in Supabase.");
    console.log("To create all 22 tables and upload all initial data:");
    console.log("1. Open: https://supabase.com/dashboard/project/" + url.split("//")[1]?.split(".")[0] + "/sql/new");
    console.log("2. Copy all contents from supabase/migrations/20261002_ace_select_cms.sql");
    console.log("3. Paste into the SQL editor and click 'Run'");
    console.log("This will create all tables, indexes, security policies, AND seed all initial data automatically!");
    return;
  } else if (testError) {
    console.error("Connection error:", testError.message);
    return;
  }

  console.log("✅ Successfully connected to Supabase!");
  console.log("Database tables are online and ready.");
}

main().catch(console.error);
