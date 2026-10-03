"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, FolderOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURED_PROJECTS = [
  { id: "1", title: "Shri Kashi Vishwanath Temple Active LED Network", client: "Govt. of Uttar Pradesh", location: "Varanasi, UP", vertical: "digital", order: 1 },
  { id: "2", title: "BKC Curved Architectural DOOH Billboard", client: "Bandra-Kurla Complex Commercial Media", location: "Mumbai, MH", vertical: "digital", order: 2 },
  { id: "3", title: "Siripuram Smart City Traffic LED Wall", client: "Greater Visakhapatnam Smart City Corp.", location: "Visakhapatnam, AP", vertical: "digital", order: 3 },
  { id: "4", title: "Marine Drive DOOH Digital Signage Display", client: "MCGM / Mumbai Urban Infra", location: "Mumbai, MH", vertical: "signage", order: 4 },
];

export default function AdminHomepageFeaturedPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Homepage Featured Projects</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Featured landmark installations highlighted directly on the primary landing page
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors"
        >
          Manage All Projects <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURED_PROJECTS.map((proj) => (
          <div key={proj.id} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-neutral-900 line-clamp-1">{proj.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{proj.client} • {proj.location}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Position #{proj.order}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
