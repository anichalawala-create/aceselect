"use client";

import { useState } from "react";
import { Building2, Save, CheckCircle2 } from "lucide-react";

export default function AdminCompanyPage() {
  const [vision, setVision] = useState("To engineer transformative visual experiences that elevate India's commercial and public landscapes.");
  const [mission, setMission] = useState("Delivering turnkey Design-to-Build display systems and advertising infrastructure with unmatched precision, speed, and reliability.");
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
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Company Overview & Heritage</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Corporate narrative, founding history, and institutional vision showcased on the Who We Are page
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : "Save Overview"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Corporate Vision
          </label>
          <textarea
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Corporate Mission
          </label>
          <textarea
            rows={3}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
