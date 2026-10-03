"use client";

import { useState } from "react";
import { Save, CheckCircle2, ArrowRight } from "lucide-react";

const STEPS = [
  { number: "01", title: "DISCOVER", description: "Understand client brand, site geometry & visibility requirements" },
  { number: "02", title: "DESIGN", description: "Optical engineering, structural calculation & architectural 3D planning" },
  { number: "03", title: "PRODUCE", description: "Precision OEM manufacturing with ISO 9001:2015 quality control" },
  { number: "04", title: "DEPLOY", description: "Turnkey nationwide structural installation & calibration" },
  { number: "05", title: "INSPECT", description: "Multi-point luminescence, thermal & safety compliance auditing" },
  { number: "06", title: "DELIVER", description: "Jio Software CMS integration, remote telemetry & SLA support" },
];

export default function AdminHomepageProcessPage() {
  const [steps, setSteps] = useState(STEPS);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Design-to-Build Process Steps</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure the 6-stage turnkey manufacturing methodology displayed on the homepage
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : "Save All Stages"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((st, i) => (
          <div key={st.number} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#283A97] bg-blue-50 px-2 py-0.5 rounded">
                Stage {st.number}
              </span>
              <span className="text-xs font-bold text-neutral-800">{st.title}</span>
            </div>
            <textarea
              rows={3}
              value={st.description}
              onChange={(e) => {
                const val = e.target.value;
                setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, description: val } : s)));
              }}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
