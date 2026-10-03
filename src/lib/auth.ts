import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "SUPER_ADMIN" | "CONTENT_ADMIN" | "PROJECT_MANAGER" | "MARKETING" | "SALES" | "VIEWER";
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  supabase_auth_id?: string;
}

function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, "utf-8").match(new RegExp(`^${key}=(.*)$`, "m"));
      if (match && match[1]?.trim()) return match[1].trim();
    }
  } catch {}
  return "";
}

export function getSupabaseAdmin() {
  const url = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ace_admin_token")?.value;
    if (!token) return null;

    // Verify token with Supabase
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user || !user.email) return null;

    // Fetch user details from admin_users
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!adminRecord || !adminRecord.is_active) return null;

    return {
      id: adminRecord.id,
      email: adminRecord.email,
      full_name: adminRecord.full_name || "Admin",
      role: adminRecord.role || "CONTENT_ADMIN",
      avatar_url: adminRecord.avatar_url,
      is_active: adminRecord.is_active,
      last_login: adminRecord.last_login,
      supabase_auth_id: user.id,
    };
  } catch (err) {
    console.error("getCurrentAdminUser error:", err);
    return null;
  }
}
