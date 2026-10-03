"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  CheckSquare,
  FolderOpen,
  Receipt,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/portal/Metric";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { ActivityFeed } from "@/components/portal/ActivityFeed";
import { ApprovalCard } from "@/components/portal/ApprovalCard";
import { MobileProjectCard } from "@/components/portal/MobileProjectCard";
import { projectService } from "@/services/projectService";
import { approvalService } from "@/services/approvalService";
import { updateService } from "@/services/updateService";
import { clientService } from "@/services/clientService";
import { Project, ApprovalItem, ProjectUpdate, DashboardStats, ClientProfile } from "@/types/portal";

export default function ClientDashboardPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prof, st, proj, appr, upd] = await Promise.all([
          clientService.getClientProfile(),
          projectService.getDashboardStats(),
          projectService.getActiveProjects(),
          approvalService.getApprovals(),
          updateService.getRecentUpdates(5),
        ]);

        setProfile(prof);
        setStats(st);
        setActiveProjects(proj.slice(0, 4));
        setPendingApprovals(appr.filter((a) => a.status === "PENDING").slice(0, 3));
        setRecentUpdates(upd);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleApprovalUpdate = (updated: ApprovalItem) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== updated.id));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-neutral-200/60 rounded-md w-2/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-neutral-200/60 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE DASHBOARD (Screens < lg)                    */}
      {/* Matches Phone 02 Reference Pixel-for-Pixel                      */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-5">
        {/* Mobile Greeting + Date */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#59616D] font-medium block">
                Good morning,
              </span>
              <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
                {profile?.name || "Rohit Sharma"}
              </h1>
            </div>
            <span className="text-[11px] font-medium text-[#59616D] pt-0.5">
              Mon, 29 Sep 2026
            </span>
          </div>
          <p className="text-[11px] text-[#59616D] font-body mt-1 leading-tight">
            Here&apos;s the latest update on your projects with ACE SELECT.
          </p>
        </div>

        {/* 2 × 2 KPI Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Active Projects */}
          <Link
            href="/client-portal/projects"
            className="p-3 bg-white border border-[#E5E7EB] rounded-lg shadow-xs hover:border-[#283A97]/40 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-md bg-blue-50/70 border border-blue-100 flex items-center justify-center text-[#283A97] mb-2">
              <Briefcase className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-[#0B0D12] leading-none">
                06
              </div>
              <div className="text-[10px] font-bold text-[#59616D] uppercase tracking-wider mt-1">
                Active Projects
              </div>
            </div>
          </Link>

          {/* Active Sites */}
          <Link
            href="/client-portal/sites"
            className="p-3 bg-white border border-[#E5E7EB] rounded-lg shadow-xs hover:border-[#283A97]/40 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-md bg-blue-50/70 border border-blue-100 flex items-center justify-center text-[#283A97] mb-2">
              <MapPin className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-[#0B0D12] leading-none">
                42
              </div>
              <div className="text-[10px] font-bold text-[#59616D] uppercase tracking-wider mt-1">
                Active Sites
              </div>
            </div>
          </Link>

          {/* Pending Approvals */}
          <Link
            href="/client-portal/approvals"
            className="p-3 bg-white border border-[#E5E7EB] rounded-lg shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-md bg-amber-50/80 border border-amber-200/80 flex items-center justify-center text-amber-600 mb-2">
              <FileText className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-[#0B0D12] leading-none">
                18
              </div>
              <div className="text-[10px] font-bold text-[#59616D] uppercase tracking-wider mt-1">
                Pending Approvals
              </div>
            </div>
          </Link>

          {/* Completed Sites */}
          <Link
            href="/client-portal/sites?status=completed"
            className="p-3 bg-white border border-[#E5E7EB] rounded-lg shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-md bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-2">
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-[#0B0D12] leading-none">
                37
              </div>
              <div className="text-[10px] font-bold text-[#59616D] uppercase tracking-wider mt-1">
                Completed Sites
              </div>
            </div>
          </Link>
        </div>

        {/* Active Projects List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-sm text-[#0B0D12]">
              Active Projects
            </h2>
            <Link
              href="/client-portal/projects"
              className="text-xs font-display font-bold text-[#283A97] hover:underline flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {activeProjects.map((proj) => (
              <MobileProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DEDICATED DESKTOP DASHBOARD (Screens >= lg)                  */}
      {/* High-density Enterprise View with SVG Donut & Activity Stream    */}
      {/* ============================================================== */}
      <div className="hidden lg:block space-y-8">
        {/* 1. Header Greeting & Current Date */}
        <div className="flex flex-row items-end justify-between gap-4 pb-2">
          <div>
            <h1 className="font-display font-black text-3xl lg:text-4xl text-[#0B0D12] tracking-tight">
              Good morning, {profile?.name || "Rohit Sharma"}
            </h1>
            <p className="text-sm text-neutral-500 font-body mt-1">
              Here&apos;s the latest update on your projects with ACE SELECT.
            </p>
          </div>
          <div className="text-sm font-display font-medium text-neutral-500">
            Monday, 29 September 2026
          </div>
        </div>

        {/* 2. Top 4 Metric Cards */}
        <div className="grid grid-cols-4 gap-5">
          <MetricCard
            icon={<Briefcase className="w-6 h-6 text-[#283A97]" strokeWidth={1.75} />}
            value={stats?.activeProjects || 6}
            label="ACTIVE PROJECTS"
            href="/client-portal/projects"
            iconBgColor="bg-blue-50/50"
            iconBorderColor="border-blue-200"
          />
          <MetricCard
            icon={<MapPin className="w-6 h-6 text-[#283A97]" strokeWidth={1.75} />}
            value={stats?.activeSites || 42}
            label="ACTIVE SITES"
            href="/client-portal/sites"
            iconBgColor="bg-blue-50/50"
            iconBorderColor="border-blue-200"
          />
          <MetricCard
            icon={<FileText className="w-6 h-6 text-amber-600" strokeWidth={1.75} />}
            value={stats?.pendingApprovals || 18}
            label="PENDING APPROVALS"
            href="/client-portal/approvals"
            iconBgColor="bg-amber-50/50"
            iconBorderColor="border-amber-200"
          />
          <MetricCard
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" strokeWidth={1.75} />}
            value={stats?.completedSites || 37}
            label="COMPLETED SITES"
            href="/client-portal/sites?status=completed"
            iconBgColor="bg-emerald-50/50"
            iconBorderColor="border-emerald-200"
          />
        </div>

        {/* 3. Upper Grid: Active Projects + Activity Feed */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                <h2 className="font-display font-bold text-base text-[#0B0D12]">
                  Active Projects
                </h2>
                <Link
                  href="/client-portal/projects"
                  className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
                >
                  View All Projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {activeProjects.map((proj) => (
                  <ProjectCard key={proj.id} project={proj} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <ActivityFeed updates={recentUpdates} />
          </div>
        </div>

        {/* 4. Middle Grid: Pending Approvals + Site Status Donut + Milestones */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
              <h3 className="font-display font-bold text-base text-[#0B0D12]">
                Pending Approvals
              </h3>
              <Link
                href="/client-portal/approvals"
                className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((appr) => (
                  <ApprovalCard
                    key={appr.id}
                    item={appr}
                    onStatusChange={handleApprovalUpdate}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-xs text-neutral-400">
                  All submitted assets have been approved.
                </div>
              )}
            </div>
          </div>

          {/* SVG Donut Chart */}
          <div className="col-span-4 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                <h3 className="font-display font-bold text-base text-[#0B0D12]">
                  Site Status
                </h3>
                <Link
                  href="/client-portal/sites"
                  className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
                >
                  View All Sites <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 py-4">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F3F4F6" strokeWidth="12" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="159.2 238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#283A97" strokeWidth="12" strokeDasharray="56.8 238.76" strokeDashoffset="-159.2" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="22.7 238.76" strokeDashoffset="-216" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display font-black text-2xl text-[#0B0D12] leading-none">
                      42
                    </span>
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 mt-1">
                      Total Sites
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-neutral-600 font-medium">Completed</span>
                    <span className="font-display font-bold text-neutral-900 tabular-nums ml-auto">28</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#283A97]" />
                    <span className="text-neutral-600 font-medium">In Progress</span>
                    <span className="font-display font-bold text-neutral-900 tabular-nums ml-auto">10</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-neutral-600 font-medium">Pending</span>
                    <span className="font-display font-bold text-neutral-900 tabular-nums ml-auto">04</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="text-neutral-600 font-medium">Delayed</span>
                    <span className="font-display font-bold text-neutral-900 tabular-nums ml-auto">00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="col-span-3 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
              <h3 className="font-display font-bold text-base text-[#0B0D12]">
                Upcoming Milestones
              </h3>
              <Link
                href="/client-portal/sites"
                className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-[#283A97] uppercase tracking-wider hover:underline"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { day: "30", month: "SEP", title: "Delhi – Store 05", desc: "Installation Completion", eta: "In 1 day" },
                { day: "02", month: "OCT", title: "Jaipur – Store 03", desc: "Final Inspection", eta: "In 3 days" },
                { day: "05", month: "OCT", title: "Mumbai – HQ", desc: "Interior Handover", eta: "In 6 days" },
                { day: "08", month: "OCT", title: "Bengaluru – Store 02", desc: "Signage Installation", eta: "In 9 days" },
              ].map((m, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col items-center justify-center shrink-0">
                      <span className="font-display font-black text-sm text-[#0B0D12] leading-none">{m.day}</span>
                      <span className="text-[8px] font-display font-bold text-neutral-400 leading-tight">{m.month}</span>
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-xs text-[#0B0D12]">{m.title}</h5>
                      <p className="text-[11px] text-neutral-500 font-body">{m.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium shrink-0 pt-0.5 whitespace-nowrap">{m.eta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Quick Links */}
        <div>
          <h3 className="font-display font-bold text-base text-[#0B0D12] mb-4">Quick Links</h3>
          <div className="grid grid-cols-6 gap-4">
            {[
              { title: "Project Reports", icon: <FileText className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/documents?category=Reports" },
              { title: "Site Photos", icon: <ImageIcon className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/documents?category=Site%20Photos" },
              { title: "Approvals", icon: <CheckSquare className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/approvals" },
              { title: "Drawings & BOQ", icon: <FolderOpen className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/documents?category=Drawings" },
              { title: "Invoices", icon: <Receipt className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/documents?category=Invoices" },
              { title: "Contact Team", icon: <Users className="w-5 h-5 text-[#283A97]" />, href: "/client-portal/contact" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="p-5 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#283A97]/40 hover:shadow-sm transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="font-display font-bold text-xs text-neutral-800 group-hover:text-[#283A97] transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
