"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, Users, Lock, Key } from "lucide-react";

export default function AdminClientPortalPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Institutional Client Portal</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Dedicated multi-site installation tracking and SLA monitoring for banking & corporate enterprise clients
          </p>
        </div>
        <Link
          href="/client-portal"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors"
        >
          <span>Open Client Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-xs max-w-2xl space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#283A97] flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-neutral-900">Enterprise Live Monitoring Gateway</h2>
        <p className="text-xs text-neutral-600 leading-relaxed">
          The ACE SELECT Client Portal enables banking institutions (SBI, Bank of Baroda, HDFC) and corporate partners to inspect site installation progress, GPS coordinates, real-time photographic audits, and hardware serial records.
        </p>

        <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Portal Active
          </span>
          <span className="text-xs text-neutral-400">Role-based institutional access enabled</span>
        </div>
      </div>
    </div>
  );
}
