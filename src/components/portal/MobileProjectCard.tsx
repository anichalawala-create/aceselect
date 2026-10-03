"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Project } from "@/types/portal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressBar } from "@/components/portal/ProgressBar";

interface MobileProjectCardProps {
  project: Project;
}

export function MobileProjectCard({ project }: MobileProjectCardProps) {
  return (
    <Link
      href={`/client-portal/projects/${project.id}`}
      className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#283A97]/40 transition-all shadow-xs group"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-[#E5E7EB]">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Middle Information */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-xs sm:text-sm text-[#0B0D12] truncate group-hover:text-[#283A97] transition-colors">
          {project.title}
        </h4>
        <div className="text-[11px] text-[#59616D] mt-0.5">
          <span>{project.id}</span>
          <span className="mx-1 text-neutral-300">|</span>
          <span>{project.sitesCount} Sites</span>
        </div>

        {/* Progress row */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1">
            <ProgressBar value={project.progress} showValue={false} size="sm" />
          </div>
          <span className="text-[10px] font-bold text-[#0B0D12] tabular-nums shrink-0">
            {project.progress}%
          </span>
        </div>

        {/* Status Badge */}
        <div className="mt-1.5 flex items-center justify-between">
          <StatusBadge status={project.status} size="sm" />
        </div>
      </div>

      {/* Right Arrow */}
      <div className="shrink-0 text-neutral-400 group-hover:text-[#283A97] group-hover:translate-x-0.5 transition-all">
        <ChevronRight className="w-4 h-4 stroke-[2.25]" />
      </div>
    </Link>
  );
}
