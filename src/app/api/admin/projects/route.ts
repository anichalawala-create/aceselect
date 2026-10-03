import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const search = searchParams.get("search")?.toLowerCase();

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("cms_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (search) {
      query = query.or(`title.ilike.%${search}%,client.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error("Fetch projects error:", error);
      // Fallback to static data
      const { projectDetails } = await import("@/data/projectDetails");
      return NextResponse.json({ projects: projectDetails });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    if (!body.title || !body.client || !body.city) {
      return NextResponse.json(
        { error: "Title, Client, and City are required fields." },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProject: Record<string, any> = {
      ...(body.id ? { id: body.id } : {}),
      slug,
      title: body.title,
      subtitle: body.subtitle || "",
      client: body.client,
      category: body.category || "Active LED",
      vertical: body.vertical || "digital",
      location: body.location || `${body.city}, ${body.state || "India"}`,
      city: body.city,
      state: body.state || "India",
      completion: body.completion || "Commissioned",
      scale: body.scale || "",
      hero_image: body.hero_image || "/images/projects/real-proj-p18-bkc--mumbai.jpeg",
      gallery: body.gallery || [],
      description: body.description || "",
      challenge: body.challenge || null,
      solution: body.solution || null,
      metrics: body.metrics || [],
      specs: body.specs || [],
      highlights: body.highlights || [],
      is_featured: !!body.is_featured,
      is_active: body.is_active !== false,
      sort_order: body.sort_order || 0,
    };

    const conflictTarget = body.id ? "id" : "slug";
    const { data, error } = await supabase
      .from("cms_projects")
      .upsert(newProject, { onConflict: conflictTarget })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("cms_projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
