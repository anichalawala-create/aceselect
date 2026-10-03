"use client";

import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Traffic & Inquiry Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time public visitor engagement, portfolio impressions, and lead conversion trends
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Monthly Visitors</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900 mt-2">12,480</p>
          <p className="text-xs text-neutral-400 mt-1">Across 27 Indian States</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Project Views</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +24.1% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900 mt-2">48,920</p>
          <p className="text-xs text-neutral-400 mt-1">Top: Kashi Vishwanath & BKC Billboard</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Catalog Downloads</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +12.8% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900 mt-2">1,140</p>
          <p className="text-xs text-neutral-400 mt-1">Active LED & Standee Brochures</p>
        </div>
      </div>
    </div>
  );
}
