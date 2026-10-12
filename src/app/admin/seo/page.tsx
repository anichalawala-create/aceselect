"use client";

import { useState, useEffect } from "react";
import { Globe, Save, Search, CheckCircle2 } from "lucide-react";

interface SEOPage {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}

const PAGES_SEO: SEOPage[] = [
  {
    slug: "home",
    name: "Homepage",
    title: "ACE SELECT | Advertising, Branding & Commercial Construction",
    description: "ACE SELECT is a trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India with ₹100 Cr+ turnover.",
    keywords: "ACE SELECT, LED Displays, Active LED Video Wall, Branding agency, Retail rollouts",
  },
  {
    slug: "projects",
    name: "Projects Portfolio",
    title: "Projects — ACE SELECT Landmark Installations Across India",
    description: "Explore ACE SELECT's portfolio of premium LED video walls, digital signage, and signage solutions deployed across India.",
    keywords: "Active LED video wall projects, digital signage installations, DOOH billboards India",
  },
  {
    slug: "who-we-are",
    name: "Who We Are (Company)",
    title: "About ACE SELECT — Creative Thinking. Beyond The Box.",
    description: "Discover ACE SELECT's heritage of design-to-build excellence. 476+ cities, ₹100 Cr+ turnover, ISO 9001:2015 certified since 1996.",
    keywords: "About ACE SELECT, Kamal Gor, Design to build India, ISO certified branding OEM",
  },
  {
    slug: "contact",
    name: "Contact & Inquiries",
    title: "Contact ACE SELECT — Start a Conversation",
    description: "Reach out to ACE SELECT for innovative display, branding and retail solutions. Get a quote or discuss your project requirements.",
    keywords: "Contact Ace Select, Mumbai branding agency, LED video wall quote, Vikhroli office",
  },
];

export default function AdminSEOPage() {
  const [pages, setPages] = useState<SEOPage[]>(PAGES_SEO);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadSEO() {
      try {
        const res = await fetch("/api/admin/content?section=seo");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPages(json.data);
        }
      } catch (err) {
        console.error("Failed to load SEO data:", err);
      }
    }
    loadSEO();
  }, []);

  function updateField(idx: number, field: keyof SEOPage, value: string) {
    setPages((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  }

  async function handleSave(idx: number) {
    setSavingIndex(idx);
    setSavedIndex(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "seo", data: pages[idx] }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save SEO settings");
      }
      setSavedIndex(idx);
      setTimeout(() => setSavedIndex(null), 3000);
    } catch (err: any) {
      alert("Error saving SEO: " + (err.message || String(err)));
    } finally {
      setSavingIndex(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Search Engine Optimization (SEO)</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure titles, meta descriptions, and keywords for major public pages
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {pages.map((p, idx) => (
          <div key={p.slug} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#283A97]" />
                <h3 className="font-bold text-sm text-neutral-900">{p.name}</h3>
                <span className="text-xs text-neutral-400 font-mono">/{p.slug === "home" ? "" : p.slug}</span>
              </div>
              <button
                onClick={() => handleSave(idx)}
                disabled={savingIndex === idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#283A97] text-white text-xs font-semibold rounded-md hover:bg-[#1e2d7a] transition-colors cursor-pointer disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {savedIndex === idx ? "Saved ✓" : savingIndex === idx ? "Saving..." : "Save SEO"}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => updateField(idx, "title", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={p.description}
                  onChange={(e) => updateField(idx, "description", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Target Keywords
                </label>
                <input
                  type="text"
                  value={p.keywords}
                  onChange={(e) => updateField(idx, "keywords", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
