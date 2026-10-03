import { NextResponse } from "next/server";
import { getCurrentAdminUser, getSupabaseAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active, last_login, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only a Super Admin can create new administrator accounts." },
        { status: 403 }
      );
    }

    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Name, email, and a temporary password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Create auth user in Supabase Auth
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name, role: role || "CONTENT_ADMIN" },
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    // 2. Insert into admin_users table
    const { data: adminRecord, error: dbErr } = await supabase
      .from("admin_users")
      .insert({
        email: email.trim().toLowerCase(),
        full_name,
        role: role || "CONTENT_ADMIN",
        supabase_auth_id: authUser.user.id,
        is_active: true,
      })
      .select()
      .single();

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: adminRecord,
      message: `User ${full_name} (${email}) created successfully.`,
    });
  } catch (error: unknown) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }

    const { id, role, is_active, full_name } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const updates: Record<string, unknown> = {};
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;
    if (full_name !== undefined) updates.full_name = full_name;

    const { data, error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (id === currentUser.id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get auth id
    const { data: userRec } = await supabase
      .from("admin_users")
      .select("supabase_auth_id")
      .eq("id", id)
      .single();

    if (userRec?.supabase_auth_id) {
      await supabase.auth.admin.deleteUser(userRec.supabase_auth_id);
    }

    await supabase.from("admin_users").delete().eq("id", id);

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
