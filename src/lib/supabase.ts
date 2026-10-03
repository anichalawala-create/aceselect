import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// ======================================================
// Supabase client configuration
// ======================================================
// Set these in your .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
//   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   (server-only)
// ======================================================

function getEnv(key: string): string {
  if (process.env[key]) return process.env[key]!;
  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const regex = new RegExp(`^${key}=(.*)$`, "m");
        const match = fs.readFileSync(envPath, "utf-8").match(regex);
        if (match && match[1]?.trim()) return match[1].trim();
      }
    } catch {}
  }
  return "";
}

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Browser-side Supabase client (use in Client Components, forms, auth) */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createBrowserClient(url, key);
}

/** Server-side anon client (use in Server Components / Server Actions for public data) */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !key) {
    throw new Error("Supabase credentials are not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/** Server-side admin client with full privileges (use ONLY in secure server code) */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. This client requires the service role key.");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Shared singleton for server components (cached per request in Next.js) */
let serverClientInstance: any = null;

export function getServerClient() {
  if (!serverClientInstance && isSupabaseConfigured()) {
    try {
      serverClientInstance = createSupabaseServerClient();
    } catch {
      return null;
    }
  }
  return serverClientInstance;
}

// Storage bucket names
export const STORAGE_BUCKETS = {
  MEDIA: "aceselect-media",
  PROJECTS: "aceselect-projects",
  CERTIFICATES: "aceselect-certificates",
  PRODUCTS: "aceselect-products",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Get a public URL for a file in Supabase storage
export function getStorageUrl(bucket: StorageBucket, path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !key) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
