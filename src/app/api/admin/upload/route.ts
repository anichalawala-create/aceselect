import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentAdminUser, getSupabaseAdmin, isSupabaseAdminError } from "@/lib/auth";
import { STORAGE_BUCKETS } from "@/lib/supabase";
import {
  ADMIN_UPLOAD_MAX_FILES,
  ADMIN_UPLOAD_MAX_FILE_SIZE,
  ADMIN_UPLOAD_MAX_TOTAL_SIZE,
} from "@/lib/upload-limits";

export const dynamic = "force-dynamic";

const ALLOWED_BUCKETS = new Set<string>(Object.values(STORAGE_BUCKETS));
const MIME_BY_EXTENSION: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  mp4: "video/mp4",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  webm: "video/webm",
  webp: "image/webp",
  m4v: "video/x-m4v",
};

type UploadedMediaType = "image" | "video" | "other";
type ValidatedFile = {
  file: File;
  type: UploadedMediaType;
  mimeType: string;
};
type FileValidationResult = ValidatedFile | { error: string };

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot + 1).toLowerCase() : "";
}

function getMediaType(filename: string, mimeType: string): UploadedMediaType | null {
  const extension = getExtension(filename);
  const extensionMime = MIME_BY_EXTENSION[extension];
  const normalizedMime = mimeType.toLowerCase();
  const typeFromExtension = extensionMime
    ? extensionMime.startsWith("image/")
      ? "image"
      : extensionMime.startsWith("video/")
        ? "video"
        : "other"
    : null;
  const typeFromMime = normalizedMime.startsWith("image/")
    ? "image"
    : normalizedMime.startsWith("video/")
      ? "video"
      : normalizedMime === "application/pdf"
        ? "other"
        : null;

  if (normalizedMime && !typeFromMime) return null;
  if (!typeFromExtension && !typeFromMime) return null;
  if (typeFromExtension && typeFromMime && typeFromExtension !== typeFromMime) return null;
  if (extension && !extensionMime && typeFromMime) return null;
  return typeFromExtension || typeFromMime;
}

function sanitizeFilename(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() || "upload";
  const sanitized = basename
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+/, "")
    .slice(0, 160);
  return sanitized || "upload";
}

function validateFolder(folder: string): boolean {
  return (
    folder.length > 0 &&
    folder.length <= 120 &&
    /^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(folder) &&
    !folder.includes("//") &&
    !folder.split("/").some((part) => part === "." || part === "..")
  );
}

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const formData = await req.formData();
    const bucketValue = formData.get("bucket");
    const folderValue = formData.get("folder");
    const bucket = (typeof bucketValue === "string" && bucketValue.trim()) || "aceselect-projects";
    const folder = (typeof folderValue === "string" && folderValue.trim()) || "portfolio";

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: "Unsupported storage bucket. Choose one of the configured admin media buckets." },
        { status: 400 }
      );
    }

    if (!validateFolder(folder)) {
      return NextResponse.json(
        { error: "Invalid upload folder. Use letters, numbers, hyphens, underscores, and nested folders only." },
        { status: 400 }
      );
    }

    // Gather all files from formData (supports key 'files' or 'file').
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

    if (files.length > ADMIN_UPLOAD_MAX_FILES) {
      return NextResponse.json(
        { error: `You can upload up to ${ADMIN_UPLOAD_MAX_FILES} files at a time.` },
        { status: 400 }
      );
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0);
    if (totalSize > ADMIN_UPLOAD_MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: `The total upload size cannot exceed ${formatMegabytes(ADMIN_UPLOAD_MAX_TOTAL_SIZE)}.` },
        { status: 413 }
      );
    }

    const validatedFiles: FileValidationResult[] = files.map((file) => {
      if (!file.name || file.size <= 0) {
        return { error: `"${file.name || "Unnamed file"}" is empty.` };
      }
      if (file.size > ADMIN_UPLOAD_MAX_FILE_SIZE) {
        return {
          error: `"${file.name}" exceeds the ${formatMegabytes(ADMIN_UPLOAD_MAX_FILE_SIZE)} per-file limit.`,
        };
      }

      const type = getMediaType(file.name, file.type || "");
      if (!type) {
        return {
          error: `"${file.name}" is not a supported media file. Use JPG, PNG, GIF, SVG, WebP, AVIF, MP4, WebM, MOV, MKV, M4V, or PDF.`,
        };
      }

      const extension = getExtension(file.name);
      return {
        file,
        type,
        mimeType: file.type || MIME_BY_EXTENSION[extension] || "application/octet-stream",
      };
    });

    const validationError = validatedFiles.find(
      (entry): entry is { error: string } => "error" in entry
    );
    if (validationError) {
      return NextResponse.json({ error: validationError.error }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const uploadedMedia: {
      url: string;
      filename: string;
      size: number;
      type: UploadedMediaType;
      mimeType: string;
    }[] = [];
    const uploadedPaths: string[] = [];

    for (const { file, type, mimeType } of validatedFiles as ValidatedFile[]) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = sanitizeFilename(file.name).toLowerCase();
      const filePath = `${folder}/${Date.now()}_${randomUUID()}_${safeName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.error(`Upload error for ${file.name}:`, error);
        if (uploadedPaths.length > 0) {
          await supabase.storage.from(bucket).remove(uploadedPaths).catch(() => undefined);
        }
        return NextResponse.json(
          { error: `Failed to upload "${file.name}": ${error.message}` },
          { status: 500 }
        );
      }

      uploadedPaths.push(data.path);
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

      uploadedMedia.push({
        url: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        type,
        mimeType,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedMedia,
      // Convenience field when uploading a single file.
      url: uploadedMedia[0]?.url,
      type: uploadedMedia[0]?.type,
    });
  } catch (error: unknown) {
    console.error("Upload handler exception:", error);
    if (isSupabaseAdminError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal upload error" },
      { status: 500 }
    );
  }
}
