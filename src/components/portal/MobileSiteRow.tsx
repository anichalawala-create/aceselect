"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Site } from "@/types/portal";
import { StatusBadge } from "@/components/portal/StatusBadge";

interface MobileSiteRowProps {
  site: Site;
}

export function MobileSiteRow({ site }: MobileSiteRowProps) {
  const thumbnail =
    site.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop";

  return (
    <Link
      href={`/client-portal/sites/${site.id}`}
      className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#283A97]/40 transition-all shadow-xs group"
    >
      {/* Thumbnail */}
      <div className="w-13 h-13 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-[#E5E7EB]">
        <img
          src={thumbnail}
          alt={site.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Middle Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-xs sm:text-sm text-[#0B0D12] truncate group-hover:text-[#283A97] transition-colors">
          {site.name}
        </h4>
        <div className="text-[11px] text-[#59616D] mt-0.5 flex items-center gap-2">
          <span className="font-semibold text-[#0B0D12] tabular-nums">
            {site.progress}%
          </span>
          <span className="text-neutral-300">•</span>
          <StatusBadge status={site.status} size="sm" />
        </div>
      </div>

      {/* Right Arrow */}
      <div className="shrink-0 text-neutral-400 group-hover:text-[#283A97] group-hover:translate-x-0.5 transition-all">
        <ChevronRight className="w-4 h-4 stroke-[2.25]" />
      </div>
    </Link>
  );
}
