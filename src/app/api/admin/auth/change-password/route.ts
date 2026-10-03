import { NextResponse } from "next/server";
import { getCurrentAdminUser, getSupabaseAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { currentPassword, newPassword, targetUserId } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // If an admin is resetting another user's password
    if (targetUserId && targetUserId !== currentUser.id) {
      if (currentUser.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only a Super Admin can reset other team members' passwords." },
          { status: 403 }
        );
      }

      // Fetch target user's auth ID
      const { data: targetUser, error: fetchErr } = await supabase
        .from("admin_users")
        .select("supabase_auth_id, email")
        .eq("id", targetUserId)
        .single();

      if (fetchErr || !targetUser?.supabase_auth_id) {
        return NextResponse.json({ error: "Target user not found." }, { status: 404 });
      }

      const { error: resetErr } = await supabase.auth.admin.updateUserById(
        targetUser.supabase_auth_id,
        { password: newPassword }
      );

      if (resetErr) {
        return NextResponse.json({ error: resetErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Password reset successfully for ${targetUser.email}`,
      });
    }

    // Changing current user's own password: verify current password first
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Please provide your current password to proceed." },
        { status: 400 }
      );
    }

    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword,
    });

    if (verifyErr) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // Update password in Supabase Auth
    const { error: updateErr } = await supabase.auth.admin.updateUserById(
      currentUser.supabase_auth_id!,
      { password: newPassword }
    );

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully.",
    });
  } catch (error: unknown) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
