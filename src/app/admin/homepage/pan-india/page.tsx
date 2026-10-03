"use client";

import { useState } from "react";
import { Save, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminHomepagePanIndiaPage() {
  const [stats, setStats] = useState([
    { label: "States & Territories", value: "27+" },
    { label: "Cities with Active Installations", value: "476+" },
    { label: "Regional Representatives", value: "176+" },
    { label: "Direct Service Hubs", value: "14" },
  ]);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : "Save Metrics"}
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
                value={s.label}
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
                value={s.value}
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
