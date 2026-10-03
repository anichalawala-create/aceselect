"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Film,
  Sparkles,
} from "lucide-react";

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(url);
}

export interface MediaItem {
  url: string;
  type?: "image" | "video" | "other";
  name?: string;
  size?: number;
}

interface MediaUploaderProps {
  label?: string;
  helperText?: string;
  value: string | string[]; // Single URL or array of URLs
  onChange: (value: any) => void;
  multiple?: boolean;
  accept?: string;
  bucket?: string;
  folder?: string;
  onSetHero?: (url: string) => void;
  heroUrl?: string;
}

export default function MediaUploader({
  label = "Upload Media",
  helperText = "Drag and drop images or videos here, or choose from your files",
  value,
  onChange,
  multiple = false,
  accept = "image/*,video/*",
  bucket = "aceselect-projects",
  folder = "portfolio",
  onSetHero,
  heroUrl,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize value to array for unified rendering
  const items: string[] = multiple
    ? Array.isArray(value)
      ? value.filter(Boolean)
      : value
      ? [value]
      : []
    : typeof value === "string" && value.trim()
    ? [value.trim()]
    : [];

  async function handleFiles(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    setErrorMessage(null);
    setUploading(true);
    setUploadProgress(`Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`);

    const formData = new FormData();
    formData.append("bucket", bucket);
    formData.append("folder", folder);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      const newUrls: string[] = (data.files || []).map((f: any) => f.url);

      if (multiple) {
        const updated = [...items, ...newUrls];
        onChange(updated);
      } else {
        // Single file mode
        onChange(newUrls[0] || "");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }

  function handleRemove(urlToRemove: string) {
    if (multiple) {
      onChange(items.filter((u) => u !== urlToRemove));
    } else {
      onChange("");
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[11px] font-medium text-neutral-400">
            {multiple ? `${items.length} file${items.length === 1 ? "" : "s"} uploaded` : items.length ? "File ready" : "No file uploaded"}
          </span>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? "border-[#283A97] bg-[#283A97]/5 scale-[0.99]"
            : "border-neutral-200 hover:border-[#283A97]/50 hover:bg-neutral-50/80 bg-neutral-50/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#283A97] animate-spin" />
              <p className="text-sm font-semibold text-neutral-800">{uploadProgress}</p>
              <p className="text-xs text-neutral-400">Transferring high-resolution assets to storage...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#283A97] flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  <span className="text-[#283A97] underline underline-offset-2">Click to choose from files</span> or drag & drop here
                </p>
                <p className="text-xs text-neutral-500 mt-1">{helperText}</p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400 font-medium">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100">
                  <ImageIcon className="w-3 h-3 text-neutral-500" /> Images: JPG, PNG, WEBP
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100">
                  <Film className="w-3 h-3 text-neutral-500" /> Videos: MP4, WEBM, MOV
                </span>
                {multiple && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    <Sparkles className="w-3 h-3" /> Multi-select enabled
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-500 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preview Grid for Uploaded Media */}
      {items.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            {multiple ? `Uploaded Media Assets (${items.length})` : "Current Hero Media"}
          </p>

          <div
            className={`grid gap-3 ${
              multiple
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-1 max-w-md"
            }`}
          >
            {items.map((url, idx) => {
              const isVideo = isVideoUrl(url);
              const isHero = heroUrl ? heroUrl === url : idx === 0;

              return (
                <div
                  key={`${url}-${idx}`}
                  className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-xs aspect-[4/3] flex items-center justify-center"
                >
                  {/* Media Content */}
                  {isVideo ? (
                    <video
                      src={url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Uploaded media ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/products/indoor-smd-page1.jpg";
                      }}
                    />
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white shadow-xs ${
                        isVideo ? "bg-purple-600/90" : "bg-blue-600/90"
                      }`}
                    >
                      {isVideo ? (
                        <>
                          <Video className="w-3 h-3" /> VIDEO
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3" /> IMAGE
                        </>
                      )}
                    </span>

                    {isHero && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white shadow-xs">
                        <Star className="w-3 h-3 fill-white" /> HERO
                      </span>
                    )}
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-2.5 z-20">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
                        title="Open full size in new tab"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(url);
                        }}
                        className="p-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {multiple && onSetHero && !isHero && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetHero(url);
                        }}
                        className="w-full py-1 px-2 rounded bg-[#283A97] hover:bg-[#1e2d7a] text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Star className="w-3 h-3" /> Set as Hero
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
