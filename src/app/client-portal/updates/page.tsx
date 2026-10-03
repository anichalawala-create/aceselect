"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Hammer,
  Eye,
  Truck,
  FileText,
  Search,
  Camera,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { EmptyState } from "@/components/portal/EmptyState";
import { updateService } from "@/services/updateService";
import { projectService } from "@/services/projectService";
import { siteService } from "@/services/siteService";
import { ProjectUpdate, Project, Site } from "@/types/portal";

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<string>("ALL");
  const [selectedSite, setSelectedSite] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [upd, proj, st] = await Promise.all([
          updateService.getAllUpdates(),
          projectService.getProjects(),
          siteService.getSites(),
        ]);
        setUpdates(upd);
        setProjects(proj);
        setSites(st);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getIcon = (type: ProjectUpdate["type"]) => {
    switch (type) {
      case "inspection":
        return <Camera className="w-3.5 h-3.5 text-[#283A97]" />;
      case "approval":
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case "production":
        return <Hammer className="w-3.5 h-3.5 text-amber-600" />;
      case "survey":
        return <Eye className="w-3.5 h-3.5 text-blue-600" />;
      case "delivery":
        return <Truck className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-neutral-600" />;
    }
  };

  const filtered = updates.filter((u) => {
    const matchesType = selectedType === "ALL" || u.type === selectedType;
    const matchesProject =
      selectedProject === "ALL" || u.projectId === selectedProject;
    const matchesSite =
      selectedSite === "ALL" || u.siteId === selectedSite;
    const matchesSearch =
      search.trim() === "" ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      (u.details && u.details.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesProject && matchesSite && matchesSearch;
  });

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 09 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-4">
        {/* Title */}
        <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
          Project Updates
        </h1>

        {/* 2 Dropdown Filters matching Phone 09 */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full pl-3 pr-7 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#0B0D12] appearance-none focus:outline-none focus:border-[#283A97]"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full pl-3 pr-7 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#0B0D12] appearance-none focus:outline-none focus:border-[#283A97]"
            >
              <option value="ALL">All Sites</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Vertical Activity Timeline with left line and nodes */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-xs">
          <div className="relative pl-7 space-y-6">
            {/* Connecting Vertical Line */}
            <div className="absolute left-3 top-3 bottom-3 w-[1.5px] bg-[#E5E7EB]" />

            {filtered.map((item) => (
              <div key={item.id} className="relative text-xs">
                {/* Node Icon */}
                <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-white border border-[#283A97] flex items-center justify-center shadow-xs">
                  {getIcon(item.type)}
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">
                    {item.timeAgo}
                  </span>
                  <h4 className="font-display font-bold text-xs text-[#0B0D12] mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#59616D] font-medium mt-0.5">
                    {item.subtitle}
                  </p>

                  {/* Photo Thumbnails if present matching Phone 09 */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {item.photos.slice(0, 3).map((photoUrl, i) => (
                        <div
                          key={i}
                          className="w-14 h-11 rounded-md overflow-hidden bg-neutral-100 border border-[#E5E7EB]"
                        >
                          <img
                            src={photoUrl}
                            alt="Update photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {item.photos.length > 3 && (
                        <div className="w-11 h-11 rounded-md bg-[#0B0F2B]/90 text-white flex items-center justify-center text-xs font-mono font-bold">
                          +{item.photos.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DEDICATED DESKTOP VIEW (>= lg)                              */}
      {/* ============================================================== */}
      <div className="hidden lg:block">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/client-portal/dashboard" },
            { label: "Updates" },
          ]}
          title="Project Activity & Updates"
          subtitle="Chronological feed of milestones, site inspection certifications, artwork sign-offs, and factory production."
        />

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 space-y-4 shadow-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity feed..."
                className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:bg-white"
              />
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-700 focus:outline-none focus:border-[#283A97] focus:bg-white font-medium"
              >
                <option value="ALL">All Activity Types</option>
                <option value="inspection">Site Inspection</option>
                <option value="approval">Asset Approval</option>
                <option value="production">Production & Factory</option>
                <option value="survey">Site Survey & LiDAR</option>
                <option value="delivery">Logistics & Delivery</option>
              </select>
            </div>

            <div>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-700 focus:outline-none focus:border-[#283A97] focus:bg-white font-medium"
              >
                <option value="ALL">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activity Timeline List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white border border-[#E5E7EB] rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No activity updates found"
            description="Try changing your search terms or filter selection."
            actionText="Reset Filters"
            onAction={() => {
              setSelectedType("ALL");
              setSelectedProject("ALL");
              setSearch("");
            }}
          />
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="relative pl-8 space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E5E7EB]">
              {filtered.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-white border-2 border-neutral-300 group-hover:border-[#283A97] flex items-center justify-center transition-colors">
                    {getIcon(item.type)}
                  </div>

                  <div className="bg-[#F7F8FA] p-5 rounded-lg border border-neutral-200 group-hover:border-[#283A97]/30 group-hover:bg-white transition-all duration-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#283A97] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/50 mr-2">
                          {item.type}
                        </span>
                        <span className="font-display font-bold text-sm text-[#0B0D12]">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-body tabular-nums">
                        {item.timeAgo}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 font-medium mb-2">
                      Location / Subject: <strong className="text-neutral-900">{item.subtitle}</strong>
                    </div>

                    {item.details && (
                      <p className="text-xs text-neutral-600 font-body leading-relaxed mb-3">
                        {item.details}
                      </p>
                    )}

                    {item.photos && item.photos.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {item.photos.map((p, i) => (
                          <div key={i} className="w-16 h-12 rounded-md overflow-hidden border border-[#E5E7EB]">
                            <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {item.author && (
                      <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Logged by: <strong className="text-neutral-700 font-medium">{item.author}</strong></span>
                        {item.projectId && <span className="font-mono">{item.projectId}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
