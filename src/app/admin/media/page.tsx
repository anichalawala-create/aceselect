"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  Search,
  Grid,
  List,
  Image as ImageIcon,
  File,
  Video,
  Trash2,
  Copy,
  Download,
  Check,
  Loader2,
  Film,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { isVideoUrl } from "@/components/admin/MediaUploader";

type MediaType = "all" | "image" | "video" | "document";

interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  media_type: "image" | "video" | "document";
  file_size: number;
  folder: string;
  created_at: string;
  width?: number;
  height?: number;
}

const FOLDERS = ["All", "projects", "products", "certifications", "team", "general"];

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  { id: "1", filename: "proj-kashi-vishwanath.jpg", file_url: "/images/projects/proj-kashi-vishwanath.jpg", media_type: "image", file_size: 284500, folder: "projects", created_at: "2026-10-01", width: 1920, height: 1080 },
  { id: "2", filename: "proj-bkc-mumbai.jpg", file_url: "/images/projects/proj-bkc-mumbai.jpg", media_type: "image", file_size: 312000, folder: "projects", created_at: "2026-10-01", width: 1920, height: 1080 },
  { id: "3", filename: "proj-visakhapatnam.jpg", file_url: "/images/projects/proj-visakhapatnam.jpg", media_type: "image", file_size: 198000, folder: "projects", created_at: "2026-09-30", width: 1920, height: 1080 },
  { id: "4", filename: "proj-marine-drive.jpg", file_url: "/images/projects/proj-marine-drive.jpg", media_type: "image", file_size: 245000, folder: "projects", created_at: "2026-09-30", width: 1920, height: 1080 },
  { id: "5", filename: "standee-banner.jpg", file_url: "/images/products/standee-banner.jpg", media_type: "image", file_size: 163000, folder: "products", created_at: "2026-09-28", width: 800, height: 1200 },
  { id: "6", filename: "indoor-smd-page1.jpg", file_url: "/images/products/indoor-smd-page1.jpg", media_type: "image", file_size: 178000, folder: "products", created_at: "2026-09-28", width: 1200, height: 800 },
  { id: "7", filename: "outdoor-smd-page1.jpg", file_url: "/images/products/outdoor-smd-page1.jpg", media_type: "image", file_size: 210000, folder: "products", created_at: "2026-09-27", width: 1200, height: 800 },
  { id: "8", filename: "pan-india-map.jpg", file_url: "/images/pan-india-map.jpg", media_type: "image", file_size: 98000, folder: "general", created_at: "2026-09-25", width: 800, height: 800 },
];

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function MediaTypeIcon({ type }: { type: string }) {
  if (type === "image") return <ImageIcon className="w-4 h-4" />;
  if (type === "video") return <Video className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [typeFilter, setTypeFilter] = useState<MediaType>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((m) => {
    const matchSearch = m.filename.toLowerCase().includes(search.toLowerCase());
    const matchFolder = folder === "All" || m.folder === folder;
    const matchType = typeFilter === "all" || m.media_type === typeFilter;
    return matchSearch && matchFolder && matchType;
  });

  function toggleSelect(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleFilesUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadStatus(`Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`);

    const formData = new FormData();
    formData.append("bucket", "aceselect-media");
    formData.append("folder", folder === "All" ? "general" : folder);

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

      const newMedia: MediaItem[] = (data.files || []).map((f: any) => ({
        id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        filename: f.filename,
        file_url: f.url,
        media_type: f.type === "video" ? "video" : "image",
        file_size: f.size,
        folder: folder === "All" ? "general" : folder,
        created_at: new Date().toISOString().split("T")[0],
      }));

      setItems((prev) => [...newMedia, ...prev]);
    } catch (err: any) {
      alert(err.message || "Failed to upload file(s).");
    } finally {
      setUploading(false);
      setUploadStatus("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFilesUpload(e.dataTransfer.files);
    }
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      handleFilesUpload(e.target.files);
    }
  }

  function handleDeleteItem(id: string) {
    if (!confirm("Are you sure you want to remove this asset?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDeleteSelected() {
    if (!confirm(`Are you sure you want to delete ${selected.length} items?`)) return;
    setItems((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Media &amp; Video Library</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {items.length} assets • Upload high-resolution images and videos via drag &amp; drop
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            onChange={onFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload Files
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Drop Zone (Zero URL input needed) */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group select-none ${
          isDragging
            ? "border-[#283A97] bg-[#283A97]/5 scale-[0.99]"
            : "border-neutral-200 hover:border-[#283A97]/40 hover:bg-[#283A97]/2 bg-neutral-50/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#283A97] animate-spin mb-2" />
            <p className="text-sm font-semibold text-neutral-800">{uploadStatus}</p>
            <p className="text-xs text-neutral-400 mt-1">Uploading directly to cloud storage...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#283A97] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm text-neutral-700 font-semibold">
              Drop images or videos here, or <span className="text-[#283A97] underline">choose from your files</span>
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Supports: JPG, PNG, WebP, MP4, WebM, MOV • Multiple files supported • Up to 50MB per file
            </p>
          </>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none bg-white cursor-pointer"
          >
            {FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MediaType)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none bg-white cursor-pointer"
          >
            <option value="all">All Media</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
            <option value="document">Documents Only</option>
          </select>

          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-1 bg-neutral-50">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                view === "grid" ? "bg-white shadow-xs text-[#283A97]" : "text-neutral-500 hover:text-neutral-900"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                view === "list" ? "bg-white shadow-xs text-[#283A97]" : "text-neutral-500 hover:text-neutral-900"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <span className="text-sm font-semibold text-blue-900">{selected.length} items selected</span>
          <button
            onClick={handleDeleteSelected}
            className="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors ml-auto cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((item) => {
            const isVideo = item.media_type === "video" || isVideoUrl(item.file_url);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`group relative bg-white rounded-xl overflow-hidden cursor-pointer border transition-all shadow-xs ${
                  selected.includes(item.id)
                    ? "border-[#283A97] ring-2 ring-[#283A97]/20"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="aspect-[4/3] relative bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={item.file_url}
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
                  ) : item.media_type === "image" ? (
                    <img
                      src={item.file_url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/products/indoor-smd-page1.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-500">
                      <MediaTypeIcon type={item.media_type} />
                    </div>
                  )}

                  {/* Badge */}
                  <span
                    className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs ${
                      isVideo ? "bg-purple-600/90" : "bg-blue-600/90"
                    }`}
                  >
                    {isVideo ? "VIDEO" : "IMAGE"}
                  </span>

                  {/* Selected check */}
                  {selected.includes(item.id) && (
                    <div className="absolute inset-0 bg-[#283A97]/30 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#283A97] flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Hover Actions Bar */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(item.file_url, item.id);
                      }}
                      className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="Copy URL"
                    >
                      {copied === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-white border-t border-neutral-100">
                  <p className="text-xs text-neutral-800 truncate font-semibold">{item.filename}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{formatBytes(item.file_size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">File Asset</th>
                <th className="p-4 hidden sm:table-cell">Type</th>
                <th className="p-4 hidden md:table-cell">Folder</th>
                <th className="p-4 hidden md:table-cell">Size</th>
                <th className="p-4 hidden lg:table-cell">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((item) => {
                const isVideo = item.media_type === "video" || isVideoUrl(item.file_url);

                return (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200">
                          {isVideo ? (
                            <video src={item.file_url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img
                              src={item.file_url}
                              alt={item.filename}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/products/indoor-smd-page1.jpg";
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate max-w-xs">{item.filename}</p>
                          <p className="text-[11px] text-neutral-400 truncate max-w-xs">{item.file_url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          isVideo ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {isVideo ? "Video" : "Image"}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                        {item.folder}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-neutral-500 hidden md:table-cell">
                      {formatBytes(item.file_size)}
                    </td>
                    <td className="p-4 text-xs text-neutral-400 hidden lg:table-cell">{item.created_at}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => copyUrl(item.file_url, item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#283A97] hover:bg-neutral-100 transition-colors"
                          title="Copy Public URL"
                        >
                          {copied === item.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                          title="View file"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm">No media files found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
