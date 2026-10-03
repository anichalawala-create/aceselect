"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  Building2,
  MapPin,
  Layers,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

const VERTICALS = ["digital", "signage", "kiosk", "software", "hybrid"];

interface MetricSpec {
  label: string;
  value: string;
}

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  client: "",
  category: "Outdoor Active LED Video Wall",
  vertical: "digital",
  location: "",
  city: "",
  state: "",
  completion: "Commissioned",
  scale: "",
  hero_image: "",
  gallery: [] as string[],
  description: "",
  challenge: "",
  solution: "",
  is_featured: false,
  is_active: true,
  highlights: [""],
  metrics: [{ label: "", value: "" }] as MetricSpec[],
  specs: [{ label: "", value: "" }] as MetricSpec[],
};

function InputField({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white"
      />
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
      />
    </div>
  );
}

function Section({
  title,
  children,
  hint,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  hint?: string;
  icon?: any;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#283A97]" />}
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{title}</h3>
        </div>
        {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function update(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.client.trim() || !form.city.trim()) {
      alert("Please fill in Title, Client, and City.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload = {
      slug,
      title: form.title,
      subtitle: form.subtitle,
      client: form.client,
      category: form.category,
      vertical: form.vertical,
      location: form.location || `${form.city}, ${form.state || "India"}`,
      city: form.city,
      state: form.state || "India",
      scale: form.scale,
      completion: form.completion,
      hero_image: form.hero_image || (form.gallery[0] ?? ""),
      gallery: form.gallery,
      description: form.description,
      challenge: form.challenge,
      solution: form.solution,
      highlights: form.highlights.filter((h) => h.trim()),
      metrics: form.metrics.filter((m) => m.label.trim() && m.value.trim()),
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
      is_featured: form.is_featured,
      is_active: form.is_active,
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

      alert("Project published to portfolio successfully!");
      router.push("/admin/projects");
    } catch (err: any) {
      setErrorMessage(err.message || "Error saving project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Add New Project</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fill in project specifications and upload photos/videos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-neutral-200 text-neutral-600 text-xs font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" /> View Portal
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Publish Project
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Core Details, Media Uploaders, Story */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Section title="Project Information" icon={Building2} hint="Core showcase details">
            <InputField
              label="Project Title"
              value={form.title}
              onChange={(v) => update("title", v)}
              required
              placeholder="e.g. Shri Kashi Vishwanath Temple Active LED Network"
            />
            <InputField
              label="Subtitle / Headline"
              value={form.subtitle}
              onChange={(v) => update("subtitle", v)}
              placeholder="e.g. High-Durability Outdoor Active LED Video Walls for Sacred Spiritual Corridors"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Client Name"
                value={form.client}
                onChange={(v) => update("client", v)}
                required
                placeholder="e.g. Govt. of Uttar Pradesh"
              />
              <InputField
                label="Solution Category"
                value={form.category}
                onChange={(v) => update("category", v)}
                placeholder="e.g. Outdoor Active LED Video Wall"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Vertical <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.vertical}
                  onChange={(e) => update("vertical", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
                >
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Project Scale"
                value={form.scale}
                onChange={(v) => update("scale", v)}
                placeholder="e.g. 12 Primary Corridors & Holy Gateways"
              />
            </div>
          </Section>

          {/* DRAG AND DROP MEDIA: IMAGES & VIDEOS (NO URL REQUIRED) */}
          <Section
            title="Visual Media & Video Assets"
            icon={Sparkles}
            hint="Drag & drop or choose files from device"
          >
            {/* Hero Media */}
            <div>
              <MediaUploader
                label="Primary Hero Media (Image or Video)"
                helperText="Main display showcase shown on portfolio cards and top of project detail page"
                value={form.hero_image}
                onChange={(newUrl) => update("hero_image", newUrl)}
                multiple={false}
                bucket="aceselect-projects"
                folder="portfolio"
              />
            </div>

            {/* Gallery Media */}
            <div className="pt-4 border-t border-neutral-100">
              <MediaUploader
                label="Project Media Gallery (Multiple Images & Videos)"
                helperText="Drag & drop multiple project photos and video clips, or choose files from device"
                value={form.gallery}
                onChange={(newUrls) => update("gallery", newUrls)}
                multiple={true}
                heroUrl={form.hero_image}
                onSetHero={(url) => update("hero_image", url)}
                bucket="aceselect-projects"
                folder="portfolio/gallery"
              />
            </div>
          </Section>

          {/* Narrative Content */}
          <Section title="Project Story" icon={Layers}>
            <TextareaField
              label="Comprehensive Project Description"
              value={form.description}
              onChange={(v) => update("description", v)}
              placeholder="Detailed description of the project, scope, engineering precision, and impact..."
              rows={4}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextareaField
                label="The Challenge"
                value={form.challenge}
                onChange={(v) => update("challenge", v)}
                placeholder="What constraints or unique environment obstacles were overcome?"
                rows={3}
              />
              <TextareaField
                label="The Solution"
                value={form.solution}
                onChange={(v) => update("solution", v)}
                placeholder="Engineered displays, weatherproof hardware, and turn-key deployment..."
                rows={3}
              />
            </div>
          </Section>
        </div>

        {/* Right Column (1 col): Location & Settings */}
        <div className="space-y-6">
          {/* Publishing Settings */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              Publishing Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
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
                  checked={form.is_featured}
                  onChange={(e) => update("is_featured", e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#283A97] cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Featured On Homepage</p>
                  <p className="text-[11px] text-neutral-500">Pinned to homepage marquee</p>
                </div>
              </label>
            </div>
          </div>

          {/* Location */}
          <Section title="Location" icon={MapPin}>
            <InputField
              label="City"
              value={form.city}
              onChange={(v) => update("city", v)}
              required
              placeholder="e.g. Varanasi"
            />
            <InputField
              label="State"
              value={form.state}
              onChange={(v) => update("state", v)}
              placeholder="e.g. Uttar Pradesh"
            />
            <InputField
              label="Completion Status"
              value={form.completion}
              onChange={(v) => update("completion", v)}
              placeholder="Commissioned"
            />
          </Section>

          {/* Impact Metrics */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Impact Metrics
              </h3>
              <button
                type="button"
                onClick={() =>
                  update("metrics", [...form.metrics, { label: "", value: "" }])
                }
                className="text-xs text-[#283A97] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {form.metrics.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={m.value}
                    onChange={(e) => {
                      const updated = [...form.metrics];
                      updated[idx].value = e.target.value;
                      update("metrics", updated);
                    }}
                    placeholder="Value (e.g. 120m²)"
                    className="w-1/2 px-2.5 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#283A97]"
                  />
                  <input
                    value={m.label}
                    onChange={(e) => {
                      const updated = [...form.metrics];
                      updated[idx].label = e.target.value;
                      update("metrics", updated);
                    }}
                    placeholder="Label (e.g. Active Area)"
                    className="w-1/2 px-2.5 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#283A97]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "metrics",
                        form.metrics.filter((_, i) => i !== idx)
                      )
                    }
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
    </form>
  );
}
