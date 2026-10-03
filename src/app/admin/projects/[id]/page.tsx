"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

const VERTICALS = ["digital", "signage", "kiosk", "software", "hybrid"];

interface MetricItem {
  label: string;
  value: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [id, setId] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("Outdoor Active LED");
  const [vertical, setVertical] = useState("digital");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
  const [completion, setCompletion] = useState("Commissioned");
  const [scale, setScale] = useState("");
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [specs, setSpecs] = useState<MetricItem[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        const found = (data.projects || []).find(
          (p: any) => p.slug === projectId || p.id === projectId
        );

        if (found) {
          setId(found.id || "");
          setSlug(found.slug || "");
          setTitle(found.title || "");
          setSubtitle(found.subtitle || "");
          setClient(found.client || "");
          setCategory(found.category || "Active LED");
          setVertical(found.vertical || "digital");
          setCity(found.city || "");
          setState(found.state || "");
          setLocation(found.location || `${found.city || ""}, ${found.state || ""}`);
          setCompletion(found.completion || "Commissioned");
          setScale(found.scale || "");
          setDescription(found.description || "");
          setChallenge(found.challenge || "");
          setSolution(found.solution || "");
          setHeroImage(found.hero_image || found.heroImage || "");
          setGallery(Array.isArray(found.gallery) ? found.gallery : []);
          setIsFeatured(!!found.is_featured);
          setIsActive(found.is_active !== false);
          setMetrics(Array.isArray(found.metrics) && found.metrics.length > 0 ? found.metrics : [{ label: "", value: "" }]);
          setSpecs(Array.isArray(found.specs) && found.specs.length > 0 ? found.specs : [{ label: "", value: "" }]);
          setHighlights(Array.isArray(found.highlights) && found.highlights.length > 0 ? found.highlights : [""]);
        } else {
          setErrorMessage(`Project "${projectId}" not found.`);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!title.trim() || !client.trim() || !city.trim()) {
      alert("Please fill in Title, Client, and City.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    const payload = {
      id: id || undefined,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      subtitle,
      client,
      category,
      vertical,
      location: location || `${city}, ${state || "India"}`,
      city,
      state: state || "India",
      completion,
      scale,
      hero_image: heroImage || (gallery[0] ?? ""),
      gallery,
      description,
      challenge,
      solution,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      highlights: highlights.filter((h) => h.trim()),
      is_featured: isFeatured,
      is_active: isActive,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save project.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save project changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Project deleted.");
        router.push("/admin/projects");
      } else {
        alert("Failed to delete project.");
      }
    } catch {
      alert("Error deleting project.");
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-neutral-500">
        <Loader2 className="w-8 h-8 text-[#283A97] animate-spin mx-auto mb-3" />
        <p className="font-semibold text-neutral-800">Loading project configuration...</p>
        <p className="text-xs text-neutral-400 mt-1">Retrieving portfolio item data</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-xs"
            title="Back to portfolio list"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Edit Project Details</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 uppercase">
                {vertical}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Slug: <code className="font-mono text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">{slug}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && (
            <Link
              href={`/projects/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" /> View Public Page
            </Link>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            title="Delete this project"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Saved ✓
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Project saved and published to the live portfolio successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Core Details & Media */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Core Info */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#283A97]" /> Primary Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Shri Kashi Vishwanath Temple Active LED Network"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Subtitle / Headline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. High-Durability Outdoor Active LED Video Walls for Sacred Spiritual Corridors"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Client / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  required
                  placeholder="e.g. Govt. of Uttar Pradesh"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Solution Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Outdoor Active LED Video Wall"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Vertical
                </label>
                <select
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
                >
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Project Scale
                </label>
                <input
                  type="text"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  placeholder="e.g. 12 Primary Corridors & Holy Gateways"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>
            </div>
          </div>

          {/* 2. Media Upload: HERO MEDIA & GALLERY MEDIA */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#283A97]" /> Visual Media & Video Assets
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Upload images and videos directly via drag &amp; drop or file selection. No URLs needed.
              </p>
            </div>

            {/* Hero Media (Image or Video) */}
            <div className="pt-2 border-t border-neutral-100">
              <MediaUploader
                label="Primary Hero Media (Image or Video)"
                helperText="Main display showcase shown on portfolio cards and top of project detail page"
                value={heroImage}
                onChange={(newUrl) => setHeroImage(newUrl)}
                multiple={false}
                bucket="aceselect-projects"
                folder="portfolio"
              />
            </div>

            {/* Gallery Media (Multiple Images and Videos) */}
            <div className="pt-4 border-t border-neutral-100">
              <MediaUploader
                label="Project Media Gallery (Multiple Images & Videos)"
                helperText="Drag & drop multiple project photos and video clips, or choose files from device"
                value={gallery}
                onChange={(newUrls) => setGallery(newUrls)}
                multiple={true}
                heroUrl={heroImage}
                onSetHero={(url) => setHeroImage(url)}
                bucket="aceselect-projects"
                folder="portfolio/gallery"
              />
            </div>
          </div>

          {/* 3. Narrative Description */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#283A97]" /> Case Study & Narrative
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Comprehensive Overview
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed project background, engineering approach, and execution story..."
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  The Challenge
                </label>
                <textarea
                  rows={3}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Environmental, structural, or logistical constraints solved..."
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  The Solution
                </label>
                <textarea
                  rows={3}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Engineered solution, hardware specifications, and durability measures..."
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Metadata & Settings */}
        <div className="space-y-6">
          {/* Publishing Settings */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              Publishing Options
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#283A97] cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Active On Website</p>
                  <p className="text-[11px] text-neutral-500">Visible on public showcase page</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#283A97] cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Featured On Homepage</p>
                  <p className="text-[11px] text-neutral-500">Pinned to homepage marquee</p>
                </div>
              </label>
            </div>
          </div>

          {/* Location & Status */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#283A97]" /> Geographic Deployment
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g. Varanasi"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Completion Status
              </label>
              <input
                type="text"
                value={completion}
                onChange={(e) => setCompletion(e.target.value)}
                placeholder="e.g. Commissioned"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Impact Metrics
              </h2>
              <button
                type="button"
                onClick={() => setMetrics([...metrics, { label: "", value: "" }])}
                className="text-xs text-[#283A97] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={m.value}
                    onChange={(e) => {
                      const updated = [...metrics];
                      updated[idx].value = e.target.value;
                      setMetrics(updated);
                    }}
                    placeholder="Value (e.g. 120m²)"
                    className="w-1/2 px-2.5 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#283A97]"
                  />
                  <input
                    value={m.label}
                    onChange={(e) => {
                      const updated = [...metrics];
                      updated[idx].label = e.target.value;
                      setMetrics(updated);
                    }}
                    placeholder="Label (e.g. Active Area)"
                    className="w-1/2 px-2.5 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#283A97]"
                  />
                  <button
                    type="button"
                    onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                    className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
