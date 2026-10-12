"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Pencil } from "lucide-react";

const DEFAULT_STATS = [
  { id: "1", icon_name: "Building2", end_value: 476, prefix: "", suffix: "+", label: "CITIES SERVED", sort_order: 1, is_active: true },
  { id: "2", icon_name: "TrendingUp", end_value: 100, prefix: "₹", suffix: " CR+", label: "ANNUAL TURNOVER", sort_order: 2, is_active: true },
  { id: "3", icon_name: "Monitor", end_value: 34250, prefix: "", suffix: " m²+", label: "ACTIVE LED INSTALLED", sort_order: 3, is_active: true },
  { id: "4", icon_name: "Calendar", end_value: 1996, prefix: "", suffix: "", label: "SINCE YEAR", sort_order: 4, is_active: true },
];

export default function AdminStatsPage() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/content?section=stats");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    }
    loadStats();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "stats", data: stats }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save statistics");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving statistics: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  function update(id: string, key: string, value: string | number | boolean) {
    setStats((s) => s.map((stat) => stat.id === id ? { ...stat, [key]: value } : stat));
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Homepage Stats</h1>
          <p className="text-sm text-neutral-500 mt-1">Edit the 4 stat counters shown below the hero section</p>
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors disabled:opacity-60 cursor-pointer">
          <Save className="w-4 h-4" /> {saved ? "Changes Saved ✓" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <div key={stat.id} className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Stat #{i + 1}</span>
              <button
                type="button"
                onClick={() => update(stat.id, "is_active", !stat.is_active)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${stat.is_active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}
              >
                {stat.is_active ? "Active" : "Hidden"}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Label</label>
                <input value={stat.label} onChange={(e) => update(stat.id, "label", e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Value</label>
                <input type="number" value={stat.end_value} onChange={(e) => update(stat.id, "end_value", parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Prefix</label>
                <input value={stat.prefix} onChange={(e) => update(stat.id, "prefix", e.target.value)} placeholder="₹" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Suffix</label>
                <input value={stat.suffix} onChange={(e) => update(stat.id, "suffix", e.target.value)} placeholder="+" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">Icon</label>
                <input value={stat.icon_name} onChange={(e) => update(stat.id, "icon_name", e.target.value)} placeholder="Building2" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none" />
              </div>
            </div>
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
              <span className="text-2xl font-black text-[#283A97]">{stat.prefix}{stat.end_value.toLocaleString()}{stat.suffix}</span>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
