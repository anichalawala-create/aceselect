"use client";

import { useState, useEffect } from "react";
import { Save, Eye, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { generateVideoThumbnail } from "@/lib/videoUtils";

const DEFAULT_HERO = {
  eyebrow_text: "INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE",
  headline_line1: "ENGINEERED FOR INDIA.",
  headline_line2: "DESIGNED FOR EVERY APPLICATION.",
  subheadline: "ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions for government, banking, corporate, institutional, commercial, and mission-critical environments across India.",
  cta_primary_label: "EXPLORE OUR WORK",
  cta_primary_href: "/projects",
  cta_secondary_label: "GET A QUOTE",
  cta_secondary_href: "/contact",
  bottom_tagline: "PROFESSIONALLY ENGINEERED\nAPPLICATION-SPECIFIC DISPLAY SYSTEMS",
  vertical_labels: ["GOVERNMENT", "BANKING", "CORPORATE", "INSTITUTIONAL", "COMMERCIAL", "MISSION-CRITICAL"],
  background_video_url: "/videos/homepage-hero.mp4",
  poster_url: "",
  is_active: true,
};

export default function AdminHeroPage() {
  const [form, setForm] = useState(DEFAULT_HERO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/admin/content?section=hero");
        const json = await res.json();
        if (json.success && json.data) {
          setForm((prev) => ({ ...prev, ...json.data }));
        }
      } catch (err) {
        console.error("Failed to load hero content:", err);
      }
    }
    loadHero();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    
    // Generate a thumbnail if it's a video
    if (file.type.startsWith("video/")) {
      try {
        const thumbnail = await generateVideoThumbnail(file);
        formData.append("files", thumbnail);
      } catch (err) {
        console.error("Failed to generate thumbnail:", err);
      }
    }
    
    formData.append("folder", "homepage");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.files?.length > 0) {
        const uploadedFiles = data.files as Array<{ type?: string; url?: string }>;
        const uploadedVideo = uploadedFiles.find((file) => file.type === "video");
        const uploadedImage = uploadedFiles.find((file) => file.type === "image");
        
        if (uploadedVideo) {
          update("background_video_url", uploadedVideo.url);
        } else if (data.url && !uploadedVideo) {
          // fallback if only one file was uploaded and it's not strictly 'video'
          update("background_video_url", data.url);
        }

        if (uploadedImage) {
          update("poster_url", uploadedImage.url);
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  function update(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", data: form }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save changes");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      alert("Error saving hero content: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-medium uppercase tracking-wider">
            <Link href="/admin/homepage/hero" className="text-[#283A97]">Homepage</Link> / Hero Section
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Hero Section</h1>
          <p className="text-sm text-neutral-500 mt-1">Edit the top hero section of the homepage</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors">
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors disabled:opacity-60">
            <Save className="w-4 h-4" />
            {saved ? "Saved ✓" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700">
          <p className="font-semibold">How to change the homepage video</p>
          <ol className="mt-1 list-decimal list-inside space-y-0.5">
            <li>Upload or drag a new MP4 or WebM file into the Background Video box below.</li>
            <li>Wait until the upload finishes and confirm the new filename under Current Video.</li>
            <li>Click <strong>Save Changes</strong> at the top right.</li>
            <li>Refresh the homepage. You do not need to replace a file in the public folder.</li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Text Content */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Heading & Text</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Eyebrow Text</label>
                <input value={form.eyebrow_text} onChange={(e) => update("eyebrow_text", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
                <p className="text-xs text-neutral-400">Small text above the main headline — e.g. &quot;INDIAN OEM &amp; MANUFACTURER | ...&quot;</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Headline Line 1</label>
                <input value={form.headline_line1} onChange={(e) => update("headline_line1", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Headline Line 2 <span className="text-[10px] text-[#283A97] font-normal">(shown in blue)</span></label>
                <input value={form.headline_line2} onChange={(e) => update("headline_line2", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Sub-Headline</label>
                <textarea value={form.subheadline} onChange={(e) => update("subheadline", e.target.value)} rows={4} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Bottom Tagline</label>
                <textarea value={form.bottom_tagline} onChange={(e) => update("bottom_tagline", e.target.value)} rows={2} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none" />
                <p className="text-xs text-neutral-400">Text shown at the bottom left. Use \n for line breaks.</p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Background Video</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">Upload the video file that will play in the background of the hero section.</p>
                
                {form.background_video_url && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 truncate pr-4">
                      <div className="w-8 h-8 bg-[#283A97]/10 rounded flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-[#283A97]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-blue-900">Current Video</p>
                        <p className="text-xs text-blue-700 truncate">{form.background_video_url.split('/').pop() || form.background_video_url}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative group">
                  <input 
                    type="file" 
                    accept="video/*,image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                    title="Upload new video"
                  />
                  <div className={`w-full flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl transition-colors ${uploading ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-50/50 border-neutral-300 group-hover:bg-blue-50 group-hover:border-[#283A97]/40'}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2 text-neutral-500">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-medium">Uploading video... Please wait</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-600">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-neutral-200 mb-1 group-hover:text-[#283A97] group-hover:border-[#283A97]/30 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <span className="text-sm font-semibold">Click or drag video to upload</span>
                        <span className="text-xs text-neutral-400">Supports MP4, WebM (Max 50MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Call-to-Action Buttons</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Primary Button Label</label>
                <input value={form.cta_primary_label} onChange={(e) => update("cta_primary_label", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Primary Button Link</label>
                <input value={form.cta_primary_href} onChange={(e) => update("cta_primary_href", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Secondary Button Label</label>
                <input value={form.cta_secondary_label} onChange={(e) => update("cta_secondary_label", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Secondary Button Link</label>
                <input value={form.cta_secondary_href} onChange={(e) => update("cta_secondary_href", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
            </div>
          </div>

          {/* Vertical Labels */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Right Column Vertical Labels</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Industry labels shown on the right of the hero on large screens</p>
            </div>
            <div className="p-6 space-y-3">
              {form.vertical_labels.map((lbl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={lbl}
                    onChange={(e) => {
                      const vl = [...form.vertical_labels];
                      vl[i] = e.target.value;
                      update("vertical_labels", vl);
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none"
                    placeholder={`Label ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar — Live Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Preview</h3>
              <button type="button" className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-gradient-to-br from-[#0B0F2B] to-[#283A97] rounded-lg p-5 text-white space-y-3 min-h-[200px]">
                <p className="text-[8px] tracking-widest text-white/60 uppercase">{form.eyebrow_text}</p>
                <h2 className="font-black text-lg leading-tight">
                  {form.headline_line1}<br/>
                  <span className="text-[#7B92FF]">{form.headline_line2}</span>
                </h2>
                <p className="text-[10px] text-white/70 leading-relaxed line-clamp-3">{form.subheadline}</p>
                <div className="flex gap-2 pt-2">
                  <span className="text-[9px] bg-[#283A97] px-2 py-1 rounded font-bold">{form.cta_primary_label}</span>
                  <span className="text-[9px] border border-white/30 px-2 py-1 rounded font-bold">{form.cta_secondary_label}</span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 text-center mt-3">Simplified preview — actual design may differ</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Visibility</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">Active</p>
                <p className="text-xs text-neutral-500">This hero is shown on the homepage</p>
              </div>
              <button
                type="button"
                onClick={() => update("is_active", !form.is_active)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-[#283A97]" : "bg-neutral-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
