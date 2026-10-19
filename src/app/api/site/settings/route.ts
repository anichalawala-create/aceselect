import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/cms-service";

export const dynamic = "force-dynamic";

/** Public, read-only site settings used by the website footer. */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Public site settings read failed:", error);
    return NextResponse.json(
      { success: false, error: "Site settings are temporarily unavailable." },
      { status: 503 },
    );
  }
}
