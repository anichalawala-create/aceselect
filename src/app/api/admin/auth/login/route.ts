import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin, isSupabaseAdminError } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError || !authData.session) {
      return NextResponse.json(
        { error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // Verify admin_users table authorization & status
    const { data: adminRecord, error: adminErr } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (adminErr) {
      console.error("Admin authorization lookup error:", adminErr);
      return NextResponse.json(
        { error: "The administrator account could not be verified. Check the admin_users table and Supabase configuration." },
        { status: 503 }
      );
    }

    if (!adminRecord) {
      return NextResponse.json(
        { error: "This account is not authorized to access the administrator portal." },
        { status: 403 }
      );
    }

    if (!adminRecord.is_active) {
      return NextResponse.json(
        { error: "Your administrator account has been deactivated. Please contact your system administrator." },
        { status: 403 }
      );
    }

    if (adminRecord.supabase_auth_id && adminRecord.supabase_auth_id !== authData.user.id) {
      return NextResponse.json(
        { error: "This administrator account is linked to a different authentication identity." },
        { status: 403 }
      );
    }

    // Older installations may have an admin row without the auth UUID. Link
    // it only after Supabase has verified the supplied credentials.
    if (!adminRecord.supabase_auth_id) {
      const { error: linkError } = await supabase
        .from("admin_users")
        .update({ supabase_auth_id: authData.user.id })
        .eq("id", adminRecord.id)
        .is("supabase_auth_id", null);

      if (linkError) {
        console.error("Admin identity linking error:", linkError);
        return NextResponse.json(
          { error: "The administrator account could not be linked to Supabase Auth. Please contact your system administrator." },
          { status: 503 }
        );
      }
    }

    // Update last_login
    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", adminRecord.id);

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set("ace_admin_token", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const userProfile = {
      id: adminRecord?.id || authData.user.id,
      email: authData.user.email,
      full_name: adminRecord?.full_name || "Administrator",
      role: adminRecord?.role || "SUPER_ADMIN",
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error: unknown) {
    console.error("Login API error:", error);
    if (isSupabaseAdminError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
