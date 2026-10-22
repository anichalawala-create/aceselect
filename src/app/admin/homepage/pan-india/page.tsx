"use client";

import { useState, useEffect } from "react";
import { Save, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminHomepagePanIndiaPage() {
  const [stats, setStats] = useState([
    { label: "States & Territories", value: "27+" },
    { label: "Cities with Active Installations", value: "476+" },
    { label: "Regional Representatives", value: "176+" },
    { label: "Direct Service Hubs", value: "14" },
  ]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPanIndia() {
      try {
        const res = await fetch("/api/admin/content?section=pan-india");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Failed to load pan-india stats:", err);
      }
    }
    loadPanIndia();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "pan-india", data: stats }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save metrics");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving pan-india metrics: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Pan-India Reach & Infrastructure</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Nationwide presence counters and regional deployment reach displayed on the homepage
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : saving ? "Saving..." : "Save Metrics"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Metric Label
              </label>
              <input
                type="text"
                value={s.label ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, label: val } : item)));
                }}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Display Value
              </label>
              <input
                type="text"
                value={s.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, value: val } : item)));
                }}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
