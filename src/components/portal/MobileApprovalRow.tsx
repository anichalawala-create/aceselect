"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ApprovalItem } from "@/types/portal";
import { StatusBadge } from "@/components/portal/StatusBadge";

interface MobileApprovalRowProps {
  item: ApprovalItem;
}

export function MobileApprovalRow({ item }: MobileApprovalRowProps) {
  return (
    <Link
      href={`/client-portal/approvals/${item.id}`}
      className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#283A97]/40 transition-all shadow-xs group"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-[#E5E7EB]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Middle info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-xs sm:text-sm text-[#0B0D12] truncate group-hover:text-[#283A97] transition-colors">
          {item.title}
        </h4>
        <div className="text-[11px] text-[#59616D] mt-0.5 truncate">
          <span>{item.projectName}</span>
        </div>
        <div className="text-[10px] text-[#59616D] mt-0.5 flex items-center gap-1.5 truncate">
          <span>{item.siteName}</span>
          <span className="text-neutral-300">•</span>
          <span>{item.submittedDate}</span>
        </div>
        <div className="mt-1.5">
          <StatusBadge status={item.status} size="sm" />
        </div>
      </div>

      {/* Right Arrow */}
      <div className="shrink-0 text-neutral-400 group-hover:text-[#283A97] group-hover:translate-x-0.5 transition-all">
        <ChevronRight className="w-4 h-4 stroke-[2.25]" />
      </div>
    </Link>
  );
}
