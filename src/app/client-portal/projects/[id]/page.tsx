"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  FileText,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { Timeline } from "@/components/portal/Timeline";
import { EmptyState } from "@/components/portal/EmptyState";
import { MobileSiteRow } from "@/components/portal/MobileSiteRow";
import { projectService } from "@/services/projectService";
import { siteService } from "@/services/siteService";
import { documentService } from "@/services/documentService";
import { Project, Site, DocumentItem } from "@/types/portal";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeTab, setActiveTab] = useState<"Overview" | "Sites" | "Approvals" | "Updates">("Overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        const proj = await projectService.getProjectById(id);
        if (proj) {
          setProject(proj);
          const [projectSites, projectDocs] = await Promise.all([
            siteService.getSitesByProject(proj.id),
            documentService.getDocumentsByProject(proj.id),
          ]);
          setSites(projectSites);
          setDocuments(projectDocs);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-neutral-200 rounded-lg" />
        <div className="h-20 bg-white border border-[#E5E7EB] rounded-lg" />
        <div className="h-48 bg-white border border-[#E5E7EB] rounded-lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project Not Found"
        description="The requested project identifier could not be located in your account."
        actionText="Back to Projects"
        onAction={() => router.push("/client-portal/projects")}
      />
    );
  }

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 04 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-4 -mx-3.5 -mt-3.5">
        {/* Top Large Project Image */}
        <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-display font-bold uppercase tracking-wider text-white">
              {project.category}
            </span>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="px-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display font-bold text-base text-[#0B0D12] leading-snug">
                {project.title}
              </h1>
              <span className="text-xs text-[#59616D] font-mono mt-0.5 block">
                {project.id}
              </span>
            </div>
            <StatusBadge status={project.status} size="sm" />
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-[#E5E7EB] px-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {(["Overview", "Sites", "Approvals", "Updates"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-xs font-display transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-[#283A97] text-[#283A97] font-bold"
                    : "border-transparent text-[#59616D] hover:text-[#0B0D12] font-medium"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "Overview" && (
          <div className="px-4 space-y-4">
            {/* Stats 4-Column Bar */}
            <div className="grid grid-cols-4 gap-2 bg-white border border-[#E5E7EB] rounded-lg p-3 text-center shadow-xs">
              <div>
                <div className="font-display font-black text-base sm:text-lg text-[#283A97]">
                  {project.sitesCount}
                </div>
                <div className="text-[9px] font-bold text-[#59616D] uppercase tracking-wider mt-0.5">
                  Total Sites
                </div>
              </div>
              <div>
                <div className="font-display font-black text-base sm:text-lg text-emerald-600">
                  {project.completedSites}
                </div>
                <div className="text-[9px] font-bold text-[#59616D] uppercase tracking-wider mt-0.5">
                  Completed
                </div>
              </div>
              <div>
                <div className="font-display font-black text-base sm:text-lg text-[#283A97]">
                  {project.inProgressSites}
                </div>
                <div className="text-[9px] font-bold text-[#59616D] uppercase tracking-wider mt-0.5">
                  In Progress
                </div>
              </div>
              <div>
                <div className="font-display font-black text-base sm:text-lg text-amber-600">
                  {project.pendingSites < 10 ? `0${project.pendingSites}` : project.pendingSites}
                </div>
                <div className="text-[9px] font-bold text-[#59616D] uppercase tracking-wider mt-0.5">
                  Pending
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-display font-bold text-[#0B0D12]">
                  Project Progress
                </span>
                <span className="font-bold text-[#283A97]">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} showValue={false} size="sm" />
            </div>

            {/* Project Timeline Vertical */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E7EB]">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0B0D12]">
                  Project Timeline
                </h3>
                <span className="text-[11px] font-display font-bold text-[#283A97] hover:underline cursor-pointer">
                  View Details →
                </span>
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-neutral-200" />
                {project.timeline.map((step, idx) => {
                  const isDone = step.status === "completed";
                  const isCurrent = step.status === "current";
                  const stageNum = `0${idx + 1}`;

                  return (
                    <div key={step.id} className="relative flex items-start gap-3 text-xs">
                      {/* Node */}
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono border-2 bg-white ${
                          isDone
                            ? "border-[#283A97] bg-[#283A97] text-white"
                            : isCurrent
                            ? "border-[#283A97] text-[#283A97] ring-2 ring-blue-100"
                            : "border-neutral-300 text-neutral-400"
                        }`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-display font-bold ${
                              isDone || isCurrent ? "text-[#0B0D12]" : "text-neutral-500"
                            }`}
                          >
                            {stageNum} {step.name}
                          </span>
                          <span
                            className={`text-[10px] font-medium uppercase tracking-wider ${
                              isDone
                                ? "text-emerald-600 font-semibold"
                                : isCurrent
                                ? "text-[#283A97] font-semibold"
                                : "text-neutral-400"
                            }`}
                          >
                            {isDone ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                        {step.description && (
                          <p className="text-[11px] text-[#59616D] mt-0.5 line-clamp-1">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sites */}
        {activeTab === "Sites" && (
          <div className="px-4 space-y-2.5">
            {sites.map((site) => (
              <MobileSiteRow key={site.id} site={site} />
            ))}
          </div>
        )}

        {/* Tab 3: Approvals */}
        {activeTab === "Approvals" && (
          <div className="px-4 space-y-3">
            <Link
              href="/client-portal/approvals"
              className="p-3 bg-white border border-[#E5E7EB] rounded-lg block text-xs hover:border-[#283A97]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[#0B0D12]">
                  Exterior Signage Artwork
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded">
                  PENDING
                </span>
              </div>
              <p className="text-[11px] text-[#59616D] mt-1">
                Jaipur Store 01 storefront fascia 3D model
              </p>
            </Link>
          </div>
        )}

        {/* Tab 4: Updates */}
        {activeTab === "Updates" && (
          <div className="px-4 space-y-3">
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg text-xs">
              <span className="text-[10px] text-neutral-400 font-mono">Today, 10:42 AM</span>
              <h5 className="font-bold text-[#0B0D12] mt-0.5">Site inspection completed</h5>
              <p className="text-[11px] text-[#59616D] mt-1">
                Jaipur — Store 01 structural anchor bolts certified.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DEDICATED DESKTOP VIEW (>= lg)                              */}
      {/* ============================================================== */}
      <div className="hidden lg:block space-y-8">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/client-portal/dashboard" },
            { label: "Projects", href: "/client-portal/projects" },
            { label: project.id },
          ]}
          title={project.title}
          subtitle={project.description}
          badge={<StatusBadge status={project.status} />}
          actions={
            <Link
              href="/client-portal/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-neutral-700 text-xs font-display font-bold uppercase tracking-wider rounded-md hover:border-[#283A97] hover:text-[#283A97] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Projects
            </Link>
          }
        />

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-[#E5E7EB] rounded-lg shadow-xs">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Total Sites
            </span>
            <div className="font-display font-black text-3xl text-neutral-900 leading-none">
              {project.sitesCount}
            </div>
            <span className="text-[11px] text-neutral-500 font-body mt-2 block">
              Across Tier-1 & Tier-2 cities
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E7EB] rounded-lg shadow-xs">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-emerald-600 block mb-1">
              Completed Sites
            </span>
            <div className="font-display font-black text-3xl text-emerald-600 leading-none">
              {project.completedSites}
            </div>
            <span className="text-[11px] text-neutral-500 font-body mt-2 block">
              Signed off & handed over
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E7EB] rounded-lg shadow-xs">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#283A97] block mb-1">
              In Progress Sites
            </span>
            <div className="font-display font-black text-3xl text-[#283A97] leading-none">
              {project.inProgressSites}
            </div>
            <span className="text-[11px] text-neutral-500 font-body mt-2 block">
              Active fabrication / deployment
            </span>
          </div>

          <div className="bg-white p-5 border border-[#E5E7EB] rounded-lg shadow-xs">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-amber-600 block mb-1">
              Pending / Survey
            </span>
            <div className="font-display font-black text-3xl text-amber-600 leading-none">
              {project.pendingSites}
            </div>
            <span className="text-[11px] text-neutral-500 font-body mt-2 block">
              Awaiting landlord NOC / survey
            </span>
          </div>
        </div>

        {/* Execution Lifecycle Timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-display font-bold text-base text-[#0B0D12]">
                Project Execution Timeline
              </h3>
              <p className="text-xs text-neutral-500 font-body mt-0.5">
                Standardized 6-stage ACE SELECT turnkey delivery framework.
              </p>
            </div>
            <div className="flex items-center gap-3 w-60">
              <span className="text-xs font-display font-bold text-neutral-600">
                {project.progress}%
              </span>
              <ProgressBar value={project.progress} showValue={false} />
            </div>
          </div>

          <Timeline stages={project.timeline} />
        </div>

        {/* Associated Sites Table */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="font-display font-bold text-base text-[#0B0D12]">
                  Active Project Sites
                </h3>
                <p className="text-xs text-neutral-500 font-body mt-0.5">
                  Detailed tracking per location for {project.title}.
                </p>
              </div>
              <Link
                href="/client-portal/sites"
                className="text-xs font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
              >
                All Sites Table →
              </Link>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-[#F7F8FA] px-3 -mx-3 rounded transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-[#283A97] flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <Link
                        href={`/client-portal/sites/${site.id}`}
                        className="font-display font-bold text-xs sm:text-sm text-[#0B0D12] group-hover:text-[#283A97] transition-colors flex items-center gap-1.5"
                      >
                        {site.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="text-[11px] text-neutral-500 font-body">
                        {site.city}, {site.state} &bull; Lead: {site.leadEngineer}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="w-24">
                      <ProgressBar value={site.progress} showValue={false} size="sm" />
                    </div>
                    <StatusBadge status={site.status} size="sm" />
                    <Link
                      href={`/client-portal/sites/${site.id}`}
                      className="p-1.5 text-neutral-400 hover:text-[#283A97] transition-colors"
                      title="View Site Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Parameters Sidebar */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 border-b border-[#E5E7EB] pb-3">
                Project Parameters
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Project Code:</span>
                  <span className="font-mono font-bold text-neutral-900">{project.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Category:</span>
                  <span className="font-semibold text-neutral-900">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Commercial Budget:</span>
                  <span className="font-semibold text-neutral-900">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Lead Account Manager:</span>
                  <span className="font-semibold text-[#283A97]">{project.projectManager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Mobilization Date:</span>
                  <span className="font-medium text-neutral-800">{project.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Target Handover:</span>
                  <span className="font-medium text-neutral-800">{project.targetDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-[#E5E7EB] pb-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500">
                  Project Files
                </h4>
                <Link
                  href="/client-portal/documents"
                  className="text-[10px] font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
                >
                  All Files →
                </Link>
              </div>
              <div className="space-y-2.5">
                {documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 bg-[#F7F8FA] rounded-md border border-neutral-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-3.5 h-3.5 text-[#283A97] shrink-0" />
                      <span className="truncate text-neutral-800 font-medium">{doc.title}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 uppercase font-mono">
                      {doc.fileType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
