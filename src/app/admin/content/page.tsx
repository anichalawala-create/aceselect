"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Eye,
  FilePlus2,
  Image as ImageIcon,
  Loader2,
  Monitor,
  PanelsTopLeft,
  Plus,
  RefreshCw,
  Smartphone,
  Search,
  Tablet,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

type ContentType = "text" | "image" | "video";
type FilterType = "all" | ContentType;
type PreviewDevice = "desktop" | "tablet" | "mobile";

interface ContentItem {
  id?: string | number;
  page_slug: string;
  content_key: string;
  label: string;
  content_type: ContentType;
  value: string;
  media_url: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
}

type EditorItem = ContentItem & { clientId: string };

const PAGES = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "who-we-are", label: "Who We Are", path: "/who-we-are" },
  { slug: "products", label: "Products", path: "/products" },
  { slug: "services", label: "Services", path: "/services" },
  { slug: "industries", label: "Industries", path: "/industries" },
  { slug: "projects", label: "Projects", path: "/projects" },
  { slug: "contact", label: "Contact", path: "/contact" },
] as const;

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#283A97] focus:ring-2 focus:ring-[#283A97]/15";
const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500";

const PREVIEW_DEVICES: Array<{ id: PreviewDevice; label: string; icon: typeof Monitor; width: string }> = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "min(100%, 768px)" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "min(100%, 390px)" },
];

function makeClientId() {
  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeItem(raw: Partial<ContentItem>, pageSlug: string, index: number): EditorItem {
  return {
    clientId: makeClientId(),
    id: raw.id,
    page_slug: raw.page_slug || pageSlug,
    content_key: raw.content_key || `field_${index + 1}`,
    label: raw.label || "Untitled field",
    content_type: raw.content_type === "image" || raw.content_type === "video" ? raw.content_type : "text",
    value: raw.value || "",
    media_url: raw.media_url || "",
    alt_text: raw.alt_text || "",
    sort_order: typeof raw.sort_order === "number" ? raw.sort_order : index,
    is_active: raw.is_active !== false,
  };
}

function toApiItem(item: EditorItem): ContentItem {
  return {
    id: item.id,
    page_slug: item.page_slug,
    content_key: item.content_key,
    label: item.label,
    content_type: item.content_type,
    value: item.value,
    media_url: item.media_url,
    alt_text: item.alt_text,
    sort_order: item.sort_order,
    is_active: item.is_active,
  };
}

function serializeItems(items: EditorItem[]) {
  return JSON.stringify(items.map(toApiItem));
}

function typeLabel(type: ContentType) {
  return type === "text" ? "Text" : type === "image" ? "Image" : "Video";
}

function previewText(items: EditorItem[], keys: string[], fallback: string) {
  const item = items.find((entry) => entry.is_active && keys.includes(entry.content_key));
  return item ? item.value : fallback;
}

function previewMedia(items: EditorItem[], keys: string[]) {
  const item = items.find((entry) => entry.is_active && keys.includes(entry.content_key));
  return item ? item.media_url || item.value : "";
}

function TypeIcon({ type }: { type: ContentType }) {
  return type === "text" ? (
    <FilePlus2 className="h-4 w-4" />
  ) : type === "image" ? (
    <ImageIcon className="h-4 w-4" />
  ) : (
    <Video className="h-4 w-4" />
  );
}

export default function AdminPageContent() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [items, setItems] = useState<EditorItem[]>([]);
  const [savedItems, setSavedItems] = useState<EditorItem[]>([]);
  const [deletedItems, setDeletedItems] = useState<EditorItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [contentSource, setContentSource] = useState<"supabase" | "local" | null>(null);
  const [sourceWarning, setSourceWarning] = useState<string | null>(null);

  const dirty = serializeItems(items) !== serializeItems(savedItems) || deletedItems.length > 0;

  const loadContent = useCallback(async (slug: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/page-content?slug=${encodeURIComponent(slug)}`);
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Could not load page content.");
      }
      const nextItems = (Array.isArray(json.data) ? json.data : []).map((item: Partial<ContentItem>, index: number) =>
        normalizeItem(item, slug, index),
      );
      setContentSource(json.source === "supabase" ? "supabase" : "local");
      setSourceWarning(typeof json.warning === "string" ? json.warning : null);
      setItems(nextItems);
      setSavedItems(nextItems);
      setDeletedItems([]);
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Could not load page content." });
      setContentSource(null);
      setSourceWarning(null);
      setItems([]);
      setSavedItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The fetch callback owns the loading state for this external resource.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContent(selectedPage);
  }, [loadContent, selectedPage]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = filter === "all" || item.content_type === filter;
      const matchesSearch = !query || [item.content_key, item.label, item.value, item.media_url]
        .some((value) => value.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [filter, items, search]);

  const groups = useMemo(() => {
    const grouped: Record<ContentType, EditorItem[]> = { text: [], image: [], video: [] };
    visibleItems.forEach((item) => grouped[item.content_type].push(item));
    return grouped;
  }, [visibleItems]);

  function updateItem(clientId: string, patch: Partial<ContentItem>) {
    setItems((current) => current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item)));
    setFeedback(null);
  }

  function addItem(type: ContentType) {
    const nextNumber = items.length + 1;
    const newItem: EditorItem = {
      clientId: makeClientId(),
      page_slug: selectedPage,
      content_key: `new_${type}_${nextNumber}`,
      label: type === "text" ? "New text field" : `New ${type} field`,
      content_type: type,
      value: "",
      media_url: "",
      alt_text: "",
      sort_order: items.length,
      is_active: true,
    };
    setItems((current) => [...current, newItem]);
    setFeedback(null);
  }

  function removeItem(item: EditorItem) {
    setItems((current) => current.filter((entry) => entry.clientId !== item.clientId));
    // Rows returned by the API may omit ids; their slug/key DELETE form still
    // needs to be queued. New local rows are not persisted yet and need no DELETE.
    const savedItem = savedItems.find((entry) => entry.clientId === item.clientId);
    if (savedItem) {
      setDeletedItems((current) => [...current, savedItem]);
    }
    setFeedback(null);
  }

  function resetChanges() {
    setItems(savedItems);
    setDeletedItems([]);
    setFeedback(null);
  }

  async function saveAll() {
    const invalid = items.find((item) => !item.content_key.trim() || !item.label.trim());
    if (invalid) {
      setFeedback({ type: "error", text: "Every field needs a content key and label before it can be saved." });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const payloadItems = items.map((editorItem) => ({
        ...toApiItem(editorItem),
        page_slug: selectedPage,
        content_key: editorItem.content_key.trim(),
        label: editorItem.label.trim(),
        value: editorItem.content_type === "text" ? editorItem.value : editorItem.media_url || editorItem.value,
      }));
      if (payloadItems.length > 0) {
        const response = await fetch("/api/admin/page-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payloadItems }),
        });
        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json.error || "Could not save page content.");
        }
      }

      for (const item of deletedItems) {
        const query = item.id !== undefined
          ? `id=${encodeURIComponent(String(item.id))}`
          : `slug=${encodeURIComponent(item.page_slug)}&key=${encodeURIComponent(item.content_key)}`;
        const deleteResponse = await fetch(`/api/admin/page-content?${query}`, { method: "DELETE" });
        const deleteJson = await deleteResponse.json().catch(() => ({}));
        if (!deleteResponse.ok || deleteJson.success === false) {
          throw new Error(deleteJson.error || `Could not remove ${item.label}.`);
        }
      }

      await loadContent(selectedPage);
      setFeedback({ type: "success", text: "Page content saved successfully." });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Could not save page content." });
    } finally {
      setSaving(false);
    }
  }

  async function uploadMedia(item: EditorItem, file: File) {
    setUploadingId(item.clientId);
    setFeedback(null);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", `page-content/${selectedPage}`);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await response.json();
      const uploadedUrl = json.files?.[0]?.url || json.url;
      if (!response.ok || json.error || !uploadedUrl) {
        throw new Error(json.error || "Upload failed. Please try again.");
      }
      const uploadedType: ContentType = json.files?.[0]?.type === "video" || file.type.startsWith("video/") ? "video" : "image";
      updateItem(item.clientId, {
        content_type: uploadedType,
        media_url: uploadedUrl,
        value: uploadedUrl,
      });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Upload failed. Please try again." });
    } finally {
      setUploadingId(null);
    }
  }

  function handlePageChange(nextPage: string) {
    if (nextPage === selectedPage) return;
    if (dirty && !window.confirm("You have unsaved changes. Discard them and switch pages?")) return;
    setSelectedPage(nextPage);
  }

  const selectedPageInfo = PAGES.find((page) => page.slug === selectedPage) || PAGES[0];
  const totalActive = items.filter((item) => item.is_active).length;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#283A97]">
            <PanelsTopLeft className="h-4 w-4" />
            Content management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Page Content</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            Manage reusable text and media fields across your public pages from one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={selectedPageInfo.path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-[#283A97]/30 hover:text-[#283A97]"
          >
            <ExternalLink className="h-4 w-4" />
            Preview page
          </a>
          <button
            type="button"
            onClick={resetChanges}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => void saveAll()}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#283A97] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e2d7a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {feedback.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="ml-auto text-current/60 hover:text-current" aria-label="Dismiss message">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="page-select" className={labelClass}>Editing page</label>
            <div className="relative max-w-sm">
              <select
                id="page-select"
                value={selectedPage}
                onChange={(event) => handlePageChange(event.target.value)}
                className={`${inputClass} appearance-none pr-9 font-semibold`}
              >
                {PAGES.map((page) => <option key={page.slug} value={page.slug}>{page.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-[#F0F2F8] px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Fields</p>
              <p className="mt-0.5 text-lg font-bold text-neutral-900">{items.length}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Visible</p>
              <p className="mt-0.5 text-lg font-bold text-emerald-800">{totalActive}</p>
            </div>
            <div className="col-span-2 rounded-lg bg-amber-50 px-4 py-2.5 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Status</p>
              <p className="mt-0.5 text-sm font-bold text-amber-800">{dirty ? "Unsaved changes" : "All changes saved"}</p>
            </div>
            </div>
          </div>
      </section>

      <div className={`flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 text-xs ${contentSource === "supabase" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : contentSource === "local" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-neutral-200 bg-white text-neutral-500"}`}>
        <span className={`h-2 w-2 rounded-full ${contentSource === "supabase" ? "bg-emerald-500" : contentSource === "local" ? "bg-amber-500" : "bg-neutral-300"}`} />
        <span className="font-bold">{contentSource === "supabase" ? "Cloud CMS connected" : contentSource === "local" ? "Local fallback cache" : "Checking CMS connection"}</span>
        <span className="text-current/75">{sourceWarning || (contentSource === "supabase" ? "Changes are reading from Supabase." : contentSource === "local" ? "Save after restoring Supabase before client handoff." : "Loading the selected page content source...")}</span>
      </div>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by field name, label, or value..."
            className={`${inputClass} pl-9`}
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {(["all", "text", "image", "video"] as FilterType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === type ? "bg-[#283A97] text-white" : "text-neutral-500 hover:bg-neutral-100"}`}
            >
              {type === "all" ? "All" : typeLabel(type)}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          {visibleItems.length} of {items.length} fields shown{dirty ? " · Changes are not saved" : ""}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => addItem("text")} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:border-[#283A97]/30 hover:text-[#283A97]">
            <Plus className="h-3.5 w-3.5" /> Add text field
          </button>
          <button type="button" onClick={() => addItem("image")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#283A97]/20 bg-[#283A97]/5 px-3 py-2 text-xs font-bold text-[#283A97] transition hover:bg-[#283A97]/10">
            <Plus className="h-3.5 w-3.5" /> Add media field
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] xl:items-start">
        <div className="min-w-0">
          {loading ? (
            <div className="rounded-xl border border-neutral-200 bg-white py-20 text-center shadow-xs">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#283A97]" />
              <p className="mt-3 text-sm font-medium text-neutral-500">Loading page content...</p>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#283A97]/10 text-[#283A97]"><FilePlus2 className="h-6 w-6" /></div>
              <h2 className="mt-4 text-base font-bold text-neutral-900">{items.length ? "No matching fields" : "No content fields yet"}</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">{items.length ? "Try a different search or filter." : "Start with a text field or a media field to build this page's editable content."}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {(["text", "image", "video"] as ContentType[]).map((type) => groups[type].length > 0 && (
                <section key={type} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
                  <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/70 px-5 py-3.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${type === "text" ? "bg-violet-100 text-violet-700" : type === "image" ? "bg-sky-100 text-sky-700" : "bg-orange-100 text-orange-700"}`}>
                      <TypeIcon type={type} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-900">{typeLabel(type)} fields</h2>
                      <p className="text-[11px] text-neutral-500">{groups[type].length} editable {groups[type].length === 1 ? "field" : "fields"}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {groups[type].map((item) => (
                      <ContentRow
                        key={item.clientId}
                        item={item}
                        uploading={uploadingId === item.clientId}
                        onChange={updateItem}
                        onRemove={removeItem}
                        onUpload={uploadMedia}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <LivePreview
          key={`${selectedPage}-${previewVersion}`}
          items={items}
          page={selectedPageInfo}
          device={previewDevice}
          onDeviceChange={setPreviewDevice}
          onRefresh={() => setPreviewVersion((current) => current + 1)}
        />
      </div>

      <div className="sticky bottom-3 z-20 -mx-2 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/95 p-2 shadow-lg backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate text-xs font-bold text-neutral-800">{dirty ? "Unsaved changes" : "All changes saved"}</p>
          <p className="text-[10px] text-neutral-500">{totalActive} visible field{totalActive === 1 ? "" : "s"}</p>
        </div>
        <button
          type="button"
          onClick={resetChanges}
          disabled={!dirty || saving}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#283A97] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#1e2d7a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {saving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}

function LivePreview({
  items,
  page,
  device,
  onDeviceChange,
  onRefresh,
}: {
  items: EditorItem[];
  page: (typeof PAGES)[number];
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  onRefresh: () => void;
}) {
  const headline = previewText(items, ["hero.headline", "story.headline"], `${page.label.toUpperCase()} CONTENT PREVIEW`);
  const headlineLine1 = previewText(items, ["hero.headline_line1"], "ENGINEERED FOR INDIA.");
  const headlineLine2 = previewText(items, ["hero.headline_line2"], "DESIGNED FOR EVERY APPLICATION.");
  const intro = previewText(items, ["hero.subheadline", "hero.intro", "products.intro"], "A live look at the content currently being edited in this draft.");
  const eyebrow = previewText(items, ["hero.eyebrow", "story.eyebrow"], `${page.label.toUpperCase()} / LIVE PREVIEW`);
  const mediaUrl = previewMedia(items, ["hero.poster", "hero.image", "about.image", "story.image"]);
  const heroHeadline = page.slug === "home" && (headlineLine1 || headlineLine2)
    ? `${headlineLine1}${headlineLine1 && headlineLine2 ? " " : ""}${headlineLine2}`
    : headline;
  const activeItems = items.filter((item) => item.is_active).sort((first, second) => first.sort_order - second.sort_order).slice(0, 3);
  const frameIsMobile = device === "mobile";

  return (
    <aside className="min-w-0 xl:sticky xl:top-6" aria-label="Live page preview">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#283A97]">
                <Eye className="h-4 w-4" />
                Live preview
              </div>
              <p className="mt-1 text-xs text-neutral-500">Draft updates appear here before you save.</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {items.length ? `${items.length} fields` : "Empty draft"}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
            {PREVIEW_DEVICES.map(({ id, label, icon: DeviceIcon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onDeviceChange(id)}
                aria-pressed={device === id}
                className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-bold transition ${device === id ? "bg-white text-[#283A97] shadow-sm" : "text-neutral-500 hover:bg-white/70 hover:text-neutral-700"}`}
              >
                <DeviceIcon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#eef1f8] p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2 text-[10px] font-semibold text-neutral-500">
            <span className="truncate">{device === "desktop" ? "1440px canvas" : device === "tablet" ? "768px canvas" : "390px canvas"}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[#283A97] transition hover:bg-white hover:shadow-sm"
                title="Refresh preview"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
              <a
                href={page.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[#283A97] transition hover:bg-white hover:shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open page
              </a>
            </div>
          </div>

          <div className="mx-auto transition-[width] duration-300" style={{ width: PREVIEW_DEVICES.find((entry) => entry.id === device)?.width }}>
            <div className={`overflow-hidden border border-neutral-300 bg-white shadow-[0_18px_45px_rgba(40,58,151,0.14)] ${frameIsMobile ? "rounded-[1.75rem] border-[5px] border-neutral-800" : device === "tablet" ? "rounded-2xl border-[4px] border-neutral-700" : "rounded-lg"}`}>
              <div className="flex h-7 items-center gap-1 border-b border-neutral-200 bg-neutral-100 px-3">
                <span className="h-2 w-2 rounded-full bg-red-300" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span className="ml-2 min-w-0 flex-1 truncate rounded bg-white px-2 py-0.5 text-[8px] text-neutral-400">aceselect.com{page.path}</span>
              </div>

              <div className="max-h-[620px] overflow-y-auto bg-white">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0f2b] px-4 py-3 text-white">
                  <span className="text-[11px] font-black tracking-[0.15em]">ACE SELECT</span>
                  <div className={`${device === "desktop" ? "flex" : "hidden"} items-center gap-3 text-[8px] font-semibold uppercase tracking-wider text-white/60`}>
                    <span>Solutions</span><span>Projects</span><span>Contact</span>
                  </div>
                  {frameIsMobile && <span className="text-lg leading-none text-white/70">☰</span>}
                </div>

                <section className={`relative overflow-hidden bg-[#0b0f2b] px-5 py-12 text-white ${device !== "mobile" ? "sm:px-8 sm:py-16" : ""}`}>
                  {mediaUrl && <img src={mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f2b]/95 via-[#0b0f2b]/85 to-[#283A97]/70" />
                  <div className="relative">
                    <p className="max-w-full text-[8px] font-bold uppercase tracking-[0.2em] text-[#9eafff]">{eyebrow}</p>
                    <h2 className={`mt-4 max-w-2xl whitespace-pre-line text-2xl font-black leading-[1.08] tracking-tight ${device !== "mobile" ? "sm:text-4xl" : ""}`}>{heroHeadline}</h2>
                    <p className={`mt-4 max-w-xl whitespace-pre-line text-[11px] leading-relaxed text-white/75 ${device !== "mobile" ? "sm:text-sm" : ""}`}>{intro}</p>
                    <span className="mt-6 inline-flex rounded bg-[#4a60d4] px-3 py-2 text-[9px] font-bold uppercase tracking-wider">Explore our work</span>
                  </div>
                </section>

                <section className={`space-y-6 px-5 py-8 ${device !== "mobile" ? "sm:px-8 sm:py-10" : ""}`}>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#283A97]">{page.label} / CONTENT</p>
                    <h3 className={`mt-2 whitespace-pre-line text-xl font-black leading-tight text-neutral-900 ${device !== "mobile" ? "sm:text-2xl" : ""}`}>{previewText(items, ["about.headline", "story.headline", "products.headline"], `Shape the ${page.label.toLowerCase()} experience.`)}</h3>
                  </div>
                  <div className={`grid gap-3 ${frameIsMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    {activeItems.length > 0 ? activeItems.map((item) => (
                      <div key={item.clientId} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                        <p className="truncate text-[8px] font-bold uppercase tracking-wider text-neutral-400">{item.label}</p>
                        {item.content_type === "image" && (item.media_url || item.value) ? (
                          <img src={item.media_url || item.value} alt={item.alt_text || ""} className="mt-2 h-20 w-full rounded object-cover" />
                        ) : item.content_type === "video" && (item.media_url || item.value) ? (
                          <div className="mt-2 flex h-20 items-center justify-center rounded bg-[#0b0f2b] text-[9px] font-bold text-white/70">Video content</div>
                        ) : (
                          <p className="mt-2 line-clamp-3 whitespace-pre-line text-[10px] leading-relaxed text-neutral-600">{item.value || "Empty text field"}</p>
                        )}
                      </div>
                    )) : (
                      <div className="col-span-full rounded-lg border border-dashed border-neutral-300 px-3 py-6 text-center text-[10px] text-neutral-400">Add content fields to populate this preview.</div>
                    )}
                  </div>
                </section>

                <footer className={`bg-[#f7f8fa] px-5 py-5 text-[9px] text-neutral-400 ${device !== "mobile" ? "sm:px-8" : ""}`}>
                  <span className="font-bold uppercase tracking-wider text-neutral-600">ACE SELECT</span> · Responsive content preview
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ContentRow({
  item,
  uploading,
  onChange,
  onRemove,
  onUpload,
}: {
  item: EditorItem;
  uploading: boolean;
  onChange: (clientId: string, patch: Partial<ContentItem>) => void;
  onRemove: (item: EditorItem) => void;
  onUpload: (item: EditorItem, file: File) => Promise<void>;
}) {
  const mediaValue = item.media_url || item.value;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <article className="p-5">
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px]">
          <div>
            <label className={labelClass}>Field label</label>
            <input className={inputClass} value={item.label} onChange={(event) => onChange(item.clientId, { label: event.target.value })} placeholder="e.g. Hero headline" />
          </div>
          <div>
            <label className={labelClass}>Content key</label>
            <input className={`${inputClass} font-mono text-xs`} value={item.content_key} onChange={(event) => onChange(item.clientId, { content_key: event.target.value })} placeholder="hero_title" />
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" min={0} className={inputClass} value={item.sort_order} onChange={(event) => onChange(item.clientId, { sort_order: Number(event.target.value) || 0 })} />
          </div>
        </div>
        <div className="flex items-end gap-2 xl:w-52">
          <div className="min-w-0 flex-1">
            <label className={labelClass}>Field type</label>
            <select
              className={`${inputClass} capitalize`}
              value={item.content_type}
              onChange={(event) => {
                const nextType = event.target.value as ContentType;
                const switchingBetweenTextAndMedia = (item.content_type === "text") !== (nextType === "text");
                onChange(item.clientId, {
                  content_type: nextType,
                  ...(switchingBetweenTextAndMedia ? { value: "", media_url: "" } : {}),
                });
              }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <button type="button" onClick={() => onRemove(item)} title="Remove field" className="mb-0.5 rounded-lg border border-neutral-200 p-2 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.content_type === "text" ? (
        <div className="mt-4">
          <label className={labelClass}>Content value</label>
          <textarea rows={3} className={`${inputClass} resize-y`} value={item.value} onChange={(event) => onChange(item.clientId, { value: event.target.value })} placeholder="Enter the text displayed on the page..." />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <label className={labelClass}>{typeLabel(item.content_type)} URL</label>
            <div className="flex gap-2">
              <input className={inputClass} value={mediaValue} onChange={(event) => onChange(item.clientId, { media_url: event.target.value, value: event.target.value })} placeholder={`Paste a ${item.content_type} URL or upload a file`} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-700 transition hover:border-[#283A97]/30 hover:text-[#283A97] disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={item.content_type === "video" ? "video/*" : "image/*"}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.currentTarget.value = "";
                  if (file) void onUpload(item, file);
                }}
              />
            </div>
            <div className="mt-3">
              <label className={labelClass}>Alt text <span className="font-normal normal-case tracking-normal text-neutral-400">(optional)</span></label>
              <input className={inputClass} value={item.alt_text} onChange={(event) => onChange(item.clientId, { alt_text: event.target.value })} placeholder="Describe this media for accessibility" />
            </div>
          </div>
          <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-200 bg-neutral-50">
            {mediaValue && item.content_type === "image" ? (
              <img src={mediaValue} alt={item.alt_text || item.label} className="h-full max-h-32 w-full object-contain" />
            ) : mediaValue && item.content_type === "video" ? (
              <video src={mediaValue} controls className="max-h-32 w-full" />
            ) : (
              <div className="text-center text-neutral-400"><TypeIcon type={item.content_type} /><span className="mt-1 block text-[11px]">Preview appears here</span></div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="font-mono text-[10px] text-neutral-400">{item.page_slug} / {item.content_key || "missing-key"}</span>
        <button type="button" role="switch" aria-checked={item.is_active} onClick={() => onChange(item.clientId, { is_active: !item.is_active })} className="group inline-flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <span className={`relative h-5 w-9 rounded-full transition-colors ${item.is_active ? "bg-emerald-500" : "bg-neutral-300"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
          </span>
          {item.is_active ? "Visible" : "Hidden"}
        </button>
      </div>
    </article>
  );
}
