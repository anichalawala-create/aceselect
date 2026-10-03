"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search, ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { ProjectTable } from "@/components/portal/ProjectTable";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { EmptyState } from "@/components/portal/EmptyState";
import { MobileProjectCard } from "@/components/portal/MobileProjectCard";
import { projectService } from "@/services/projectService";
import { Project } from "@/types/portal";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      filterStatus === "ALL" || p.status.replace(/\s+/g, "_") === filterStatus;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 03 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-4">
        {/* Title row with "+" button */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
            Projects
          </h1>
          <button
            type="button"
            onClick={() => alert("Initiate new project onboarding request.")}
            className="w-8 h-8 rounded-md bg-[#283A97] text-white flex items-center justify-center hover:bg-[#1f2d77] transition-colors shadow-xs"
            aria-label="Add project"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Horizontal filter pill row matching reference */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: "All", value: "ALL" },
            { label: "On Track", value: "ON_TRACK" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Delayed", value: "DELAYED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider shrink-0 transition-all ${
                filterStatus === tab.value
                  ? "bg-[#283A97] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#59616D] hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vertical Project List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white border border-[#E5E7EB] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects match filter"
            description="Try switching status or reset."
            actionText="Reset Filter"
            onAction={() => setFilterStatus("ALL")}
          />
        ) : (
          <div className="space-y-2.5">
            {filteredProjects.map((project) => (
              <MobileProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DEDICATED DESKTOP VIEW (>= lg)                              */}
      {/* ============================================================== */}
      <div className="hidden lg:block">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/client-portal/dashboard" },
            { label: "Projects" },
          ]}
          title="Project Portfolio"
          subtitle="Active rollouts, branding infrastructure, and architectural transformation programs."
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md border transition-colors ${
                  viewMode === "grid"
                    ? "bg-white border-[#283A97] text-[#283A97] shadow-xs"
                    : "bg-white border-[#E5E7EB] text-neutral-400 hover:text-neutral-700"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md border transition-colors ${
                  viewMode === "table"
                    ? "bg-white border-[#283A97] text-[#283A97] shadow-xs"
                    : "bg-white border-[#E5E7EB] text-neutral-400 hover:text-neutral-700"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 flex items-center justify-between gap-4 shadow-xs">
          {/* Search */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or ID..."
              className="w-full pl-9 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:bg-white transition-all"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2">
            {[
              { label: "All Projects", value: "ALL" },
              { label: "On Track", value: "ON_TRACK" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Delayed", value: "DELAYED" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  filterStatus === tab.value
                    ? "bg-[#283A97] text-white shadow-xs"
                    : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Display */}
        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white border border-[#E5E7EB] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects match your filter"
            description="Try selecting a different status or adjusting your search keywords."
            actionText="Reset Filters"
            onAction={() => {
              setFilterStatus("ALL");
              setSearchQuery("");
            }}
          />
        ) : viewMode === "table" ? (
          <ProjectTable projects={filteredProjects} />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/client-portal/projects/${project.id}`}
                className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden hover:border-[#283A97]/40 hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#0B0F2B]/85 backdrop-blur-xs text-[10px] font-display font-bold uppercase tracking-wider text-white">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-display font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {project.id} &bull; {project.client}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#0B0D12] group-hover:text-[#283A97] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-body line-clamp-2 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E7EB] space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5 font-display">
                        <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                          Overall Progress
                        </span>
                        <span className="font-bold text-neutral-900">{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} showValue={false} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-[#F7F8FA] p-2.5 rounded-md border border-neutral-200 text-xs">
                      <div>
                        <div className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400">Total Sites</div>
                        <div className="font-display font-black text-neutral-900 mt-0.5">{project.sitesCount}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400">Completed</div>
                        <div className="font-display font-black text-emerald-600 mt-0.5">{project.completedSites}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400">In Progress</div>
                        <div className="font-display font-black text-[#283A97] mt-0.5">{project.inProgressSites}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-neutral-400">
                        PM: <strong className="text-neutral-700 font-semibold">{project.projectManager}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 font-display font-bold text-[#283A97] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform text-[11px]">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
