"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, RefreshCw, X } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { EmptyState } from "@/components/portal/EmptyState";
import { MobileSiteRow } from "@/components/portal/MobileSiteRow";
import { siteService } from "@/services/siteService";
import { projectService } from "@/services/projectService";
import { Site, Project } from "@/types/portal";

function SitesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";

  const [sites, setSites] = useState<Site[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedProject, setSelectedProject] = useState("all");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSites() {
      setLoading(true);
      try {
        const [sitesData, projectsData] = await Promise.all([
          siteService.filterSites({
            search,
            city: selectedCity,
            status: selectedStatus,
            projectId: selectedProject,
          }),
          projectService.getProjects(),
        ]);
        setSites(sitesData);
        setProjects(projectsData);
      } finally {
        setLoading(false);
      }
    }

    loadSites();
  }, [search, selectedCity, selectedStatus, selectedProject]);

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 05 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-3.5">
        {/* Title row with Search Icon */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
            Sites ({sites.length})
          </h1>
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              mobileSearchOpen
                ? "bg-[#283A97] text-white"
                : "bg-white border border-[#E5E7EB] text-neutral-600 hover:text-[#0B0D12]"
            }`}
            aria-label="Search sites"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Search input expander */}
        {mobileSearchOpen && (
          <div className="relative animate-in slide-in-from-top-2 duration-150">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store name, city, code..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#283A97] rounded-md text-xs text-[#0B0D12] focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filter pill row matching reference */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: "All", value: "all" },
            { label: "Completed", value: "completed" },
            { label: "In Progress", value: "in progress" },
            { label: "Pending", value: "pending" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider shrink-0 transition-all ${
                selectedStatus === tab.value
                  ? "bg-[#283A97] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#59616D] hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vertical Site Rows matching Phone 05 */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-white border border-[#E5E7EB] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <EmptyState
            title="No sites found"
            description="Try changing status or search term."
            actionText="Reset Filters"
            onAction={() => {
              setSearch("");
              setSelectedStatus("all");
            }}
          />
        ) : (
          <div className="space-y-2">
            {sites.map((site) => (
              <MobileSiteRow key={site.id} site={site} />
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
            { label: "Sites" },
          ]}
          title="Site Tracking"
          subtitle="Live pan-India installation progress, city-level coordination, and Turn-Around-Time (TAT) monitoring."
        />

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 space-y-4 shadow-xs">
          <div className="grid grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search site, city, code..."
                className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:bg-white"
              />
            </div>

            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-700 focus:outline-none focus:border-[#283A97] focus:bg-white font-medium"
              >
                <option value="all">All Cities</option>
                <option value="delhi">Delhi</option>
                <option value="jaipur">Jaipur</option>
                <option value="mumbai">Mumbai</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="udaipur">Udaipur</option>
                <option value="chandigarh">Chandigarh</option>
                <option value="ahmedabad">Ahmedabad</option>
                <option value="pune">Pune</option>
                <option value="lucknow">Lucknow</option>
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-700 focus:outline-none focus:border-[#283A97] focus:bg-white font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-700 focus:outline-none focus:border-[#283A97] focus:bg-white font-medium"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(search || selectedCity !== "all" || selectedStatus !== "all" || selectedProject !== "all") && (
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs">
              <span className="text-neutral-500">
                Showing <strong className="text-neutral-900 font-bold">{sites.length}</strong> matching sites
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCity("all");
                  setSelectedStatus("all");
                  setSelectedProject("all");
                }}
                className="text-[#283A97] hover:underline font-display font-bold text-[11px] uppercase tracking-wider flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Sites Table */}
        {loading ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded w-full" />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <EmptyState
            title="No sites match your criteria"
            description="Try broadening your search query or selecting 'All Cities'."
            actionText="Clear Filters"
            onAction={() => {
              setSearch("");
              setSelectedCity("all");
              setSelectedStatus("all");
              setSelectedProject("all");
            }}
          />
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3.5 px-6">Site</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 w-44">Progress</th>
                    <th className="py-3.5 px-4">Assigned Team</th>
                    <th className="py-3.5 px-4">Last Update</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {sites.map((site) => (
                    <tr
                      key={site.id}
                      className="hover:bg-[#F7F8FA]/60 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <Link href={`/client-portal/sites/${site.id}`} className="block">
                          <div className="font-display font-bold text-neutral-900 group-hover:text-[#283A97] transition-colors">
                            {site.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-display mt-0.5">
                            {site.code} &bull; {site.projectName}
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-neutral-700 font-medium">
                        {site.city}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={site.status} size="sm" />
                      </td>
                      <td className="py-4 px-4">
                        <ProgressBar value={site.progress} showValue={false} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-neutral-600 font-body">
                        {site.assignedTeam}
                      </td>
                      <td className="py-4 px-4 text-neutral-500 font-body tabular-nums">
                        {site.lastUpdate}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/client-portal/sites/${site.id}`}
                          className="inline-flex items-center gap-1 font-display font-bold text-xs text-[#283A97] uppercase tracking-wider group-hover:underline"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SitesListPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 space-y-4 animate-pulse">
          <div className="h-8 bg-neutral-200 w-48 rounded" />
          <div className="h-64 bg-neutral-100 rounded w-full" />
        </div>
      }
    >
      <SitesContent />
    </Suspense>
  );
}
