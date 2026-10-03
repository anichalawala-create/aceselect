import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const bucket = (formData.get("bucket") as string) || "aceselect-projects";
    const folder = (formData.get("folder") as string) || "portfolio";

    // Gather all files from formData (supports key 'files' or 'file')
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if ((key === "files" || key === "file") && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided. Please select or drag and drop at least one file." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const uploadedMedia: {
      url: string;
      filename: string;
      size: number;
      type: "image" | "video" | "other";
      mimeType: string;
    }[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename and create unique path
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filePath = `${folder}/${timestamp}_${randomStr}_${safeName}`;

      const mimeType = file.type || "application/octet-stream";
      const isVideo = mimeType.startsWith("video/") || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name);
      const isImage = mimeType.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file.name);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error(`Upload error for ${file.name}:`, error);
        return NextResponse.json(
          { error: `Failed to upload "${file.name}": ${error.message}` },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;

      uploadedMedia.push({
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: isVideo ? "video" : isImage ? "image" : "other",
        mimeType,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedMedia,
      // Convenience field when uploading a single file
      url: uploadedMedia[0]?.url,
      type: uploadedMedia[0]?.type,
    });
  } catch (error: unknown) {
    console.error("Upload handler exception:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal upload error" },
      { status: 500 }
    );
  }
}
