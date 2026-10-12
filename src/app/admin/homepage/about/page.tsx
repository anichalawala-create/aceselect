"use client";

import { useState, useEffect } from "react";
import { Save, Eye, CheckCircle2 } from "lucide-react";

export default function AdminHomepageAboutPage() {
  const [headline, setHeadline] = useState("CREATIVE THINKING. DESIGNING BEYOND THE BOX.");
  const [eyebrow, setEyebrow] = useState("ABOUT ACE SELECT");
  const [body1, setBody1] = useState(
    "ACE SELECT stands as India's premier Design-to-Build agency, bridging the gap between innovative branding concepts and robust commercial fabrication."
  );
  const [body2, setBody2] = useState(
    "From high-density urban transit hubs to remote tier-3 banking branches, our active LED and architectural identity networks empower brands across 476+ cities nationwide."
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch("/api/admin/content?section=about");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.headline) setHeadline(json.data.headline);
          if (json.data.eyebrow) setEyebrow(json.data.eyebrow);
          if (json.data.body1) setBody1(json.data.body1);
          if (json.data.body2) setBody2(json.data.body2);
        }
      } catch (err) {
        console.error("Failed to load about section:", err);
      }
    }
    loadAbout();
  }, []);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "about",
          data: { headline, eyebrow, body1, body2 },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save changes");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving about section: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Homepage About Section</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure the brand story and core narrative showcased on the main landing page
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          {saved ? "Changes Saved ✓" : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Section Eyebrow
          </label>
          <input
            type="text"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Main Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Primary Paragraph
          </label>
          <textarea
            rows={3}
            value={body1}
            onChange={(e) => setBody1(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Secondary Supporting Paragraph
          </label>
          <textarea
            rows={3}
            value={body2}
            onChange={(e) => setBody2(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>
      </form>
    </div>
  );
}
