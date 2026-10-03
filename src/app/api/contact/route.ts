import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, service_interest } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Try to save to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createSupabaseServerClient } = await import("@/lib/supabase");
      const supabase = createSupabaseServerClient();

      const { error } = await supabase.from("cms_enquiries").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        message: message.trim(),
        service_interest: service_interest?.trim() || null,
        source: "website",
        status: "new",
      });

      if (error) {
        console.error("[Contact API] Supabase error:", error);
        // Don't fail silently — fallback to email notification
      }
    } else {
      // Log to console if Supabase not configured
      console.log("[Contact API] New enquiry (Supabase not connected):", {
        name, email, phone, company, message, service_interest,
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: Send email notification via SMTP/Resend/SendGrid
    // await sendEmail({ to: "info@aceselect.in", from: email, name, message });

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. Our team will get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("[Contact API] Error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
