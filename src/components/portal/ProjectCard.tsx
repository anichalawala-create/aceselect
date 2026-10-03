import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types/portal";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/client-portal/projects/${project.id}`}
      className="block group"
    >
      <div className="p-4 sm:p-5 bg-white border border-[#E5E7EB] rounded-[6px] hover:border-solvorry-DEFAULT/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Thumbnail + Titles */}
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="w-16 h-12 rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 border border-[#E5E7EB]">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-[#0B0D12] group-hover:text-solvorry-DEFAULT transition-colors">
              {project.title}
            </h4>
            <div className="text-[11px] text-neutral-400 font-display font-medium mt-0.5">
              <span>{project.id}</span>
              <span className="mx-2">|</span>
              <span>{project.sitesCount} Sites</span>
            </div>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-xs px-2">
          <ProgressBar progress={project.progress} showLabel />
        </div>

        {/* Right: Status Badge & Link Arrow */}
        <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px]">
          <StatusBadge status={project.status} size="sm" />
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-solvorry-DEFAULT group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
