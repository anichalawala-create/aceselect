import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
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
      .eq("email", email.trim().toLowerCase())
      .single();

    if (adminRecord && !adminRecord.is_active) {
      return NextResponse.json(
        { error: "Your administrator account has been deactivated. Please contact your system administrator." },
        { status: 403 }
      );
    }

    // Update last_login
    if (adminRecord) {
      await supabase
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", adminRecord.id);
    }

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
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
