import { NextResponse } from "next/server";
import { getCurrentAdminUser, isSupabaseAdminError } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentAdminUser();

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: unknown) {
    if (isSupabaseAdminError(error)) {
      return NextResponse.json({ authenticated: false, error: error.message }, { status: error.status });
    }
    console.error("Admin session API error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Unable to verify the administrator session." },
      { status: 500 }
    );
  }
}
