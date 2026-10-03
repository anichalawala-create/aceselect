import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types/portal";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-6">Project</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Sites (Done / Total)</th>
              <th className="py-3.5 px-4 w-48">Progress</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Lead</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {projects.map((proj) => (
              <tr
                key={proj.id}
                className="hover:bg-[#F7F8FA]/60 transition-colors group cursor-pointer"
              >
                <td className="py-4 px-6">
                  <Link
                    href={`/client-portal/projects/${proj.id}`}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-12 h-9 rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 border border-[#E5E7EB]">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="font-display font-bold text-neutral-900 group-hover:text-solvorry-DEFAULT transition-colors">
                        {proj.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-display mt-0.5">
                        {proj.id}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4 text-neutral-600 font-medium font-body">
                  {proj.category}
                </td>
                <td className="py-4 px-4 text-center font-display font-bold text-neutral-700">
                  <span className="text-solvorry-DEFAULT">{proj.completedSites}</span> /{" "}
                  <span>{proj.sitesCount}</span>
                </td>
                <td className="py-4 px-4">
                  <ProgressBar progress={proj.progress} showLabel />
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={proj.status} size="sm" />
                </td>
                <td className="py-4 px-4 text-neutral-600 font-body">
                  {proj.projectManager}
                </td>
                <td className="py-4 px-6 text-right">
                  <Link
                    href={`/client-portal/projects/${proj.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-solvorry-DEFAULT uppercase tracking-wider hover:underline"
                  >
                    View <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
