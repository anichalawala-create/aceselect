"use client";

import { useState } from "react";
import { Save, Eye, Info, RefreshCw } from "lucide-react";
import Link from "next/link";

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
  is_active: true,
};

export default function AdminHeroPage() {
  const [form, setForm] = useState(DEFAULT_HERO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
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
        <p className="text-xs text-blue-700">Changes will be reflected on the homepage immediately upon saving. The background video is managed separately via the public media folder.</p>
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
                <p className="text-xs text-neutral-400">Small text above the main headline — e.g. "INDIAN OEM & MANUFACTURER | ..."</p>
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
