"use client";

import { useState } from "react";
import { Monitor, Sun, Tablet, Cloud, CheckCircle2, Plus } from "lucide-react";

const CATEGORIES = [
  {
    id: "active-indoor-led",
    name: "Active Indoor LED",
    icon: Monitor,
    description: "High-resolution indoor LED video wall solutions for corporate, command center & broadcast environments",
    productsCount: 6,
  },
  {
    id: "outdoor-led-displays",
    name: "Outdoor LED Displays",
    icon: Sun,
    description: "Weather-resistant high-brightness outdoor active LED video displays and highway DOOH billboards",
    productsCount: 4,
  },
  {
    id: "digital-standees",
    name: "Digital Standees",
    icon: Tablet,
    description: "Android & Windows powered commercial digital standees from 32\" to 65\" for retail and bank branches",
    productsCount: 4,
  },
  {
    id: "signage-software",
    name: "Signage & Software",
    icon: Cloud,
    description: "Architectural signage, banking kiosks, and centralized cloud CMS hosted on Jio Software",
    productsCount: 5,
  },
];

export default function AdminProductCategoriesPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Display Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">
            4 primary hardware categories featured in the main public navigation menu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#283A97] flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-neutral-900">{cat.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Active Category
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
