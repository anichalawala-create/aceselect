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

export class SupabaseAdminError extends Error {
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "SupabaseAdminError";
  }
}

export function isSupabaseAdminError(error: unknown): error is SupabaseAdminError {
  return error instanceof SupabaseAdminError;
}

function getEnvVar(key: string): string {
  const configuredValue = process.env[key]?.trim();
  if (configuredValue) return configuredValue.replace(/^(['"])(.*)\1$/, "$2");
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, "utf-8").match(new RegExp(`^${key}=(.*)$`, "m"));
      if (match && match[1]?.trim()) {
        return match[1].trim().replace(/^(['"])(.*)\1$/, "$2");
      }
    }
  } catch {}
  return "";
}

export function getSupabaseAdmin() {
  const url = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  if (!url) {
    throw new SupabaseAdminError(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL in .env.local or the deployment environment."
    );
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw new SupabaseAdminError(
      "Supabase is misconfigured: NEXT_PUBLIC_SUPABASE_URL must be a valid http(s) URL."
    );
  }

  const key = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    throw new SupabaseAdminError(
      "Supabase admin access is not configured: set SUPABASE_SERVICE_ROLE_KEY. Admin APIs cannot use the public anon key."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

function isInvalidSessionError(error: { status?: number; code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = error.message?.toLowerCase() || "";
  if (/api\s*key|apikey|configuration|network/.test(message)) return false;
  return (
    error.status === 401 ||
    /invalid (jwt|token|session)|jwt expired|session not found|user not found/.test(message)
  );
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ace_admin_token")?.value;
    if (!token) return null;

    // Verify token with Supabase
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      if (isInvalidSessionError(error)) return null;
      console.error("Supabase session verification error:", error);
      throw new SupabaseAdminError(
        "Unable to verify the admin session with Supabase. Check the Supabase URL and service role key."
      );
    }
    if (!user || !user.email) return null;

    // Fetch user details from admin_users
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    if (adminError) {
      console.error("Admin account lookup error:", adminError);
      throw new SupabaseAdminError(
        "Unable to verify the administrator account. Check that the admin_users table exists and Supabase is reachable."
      );
    }

    if (!adminRecord || !adminRecord.is_active) return null;

    // A stale auth id must not be able to authenticate by email alone. A null
    // value is allowed for legacy rows and is linked during the next login.
    if (adminRecord.supabase_auth_id && adminRecord.supabase_auth_id !== user.id) {
      return null;
    }

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
    if (isSupabaseAdminError(err)) throw err;
    console.error("getCurrentAdminUser error:", err);
    return null;
  }
}
