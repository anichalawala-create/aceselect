"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Camera,
  MapPin,
  Calendar,
  Users,
  Clock,
  ClipboardCheck,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressBar } from "@/components/portal/ProgressBar";
import { SiteGallery } from "@/components/portal/SiteGallery";
import { EmptyState } from "@/components/portal/EmptyState";
import { siteService } from "@/services/siteService";
import { Site } from "@/types/portal";

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSite() {
      if (!id) return;
      try {
        const data = await siteService.getSiteById(id);
        setSite(data);
      } finally {
        setLoading(false);
      }
    }

    loadSite();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 bg-neutral-200 rounded-lg" />
        <div className="h-24 bg-white border border-[#E5E7EB] rounded-lg" />
        <div className="h-48 bg-white border border-[#E5E7EB] rounded-lg" />
      </div>
    );
  }

  if (!site) {
    return (
      <EmptyState
        title="Site Not Found"
        description="The requested site location does not exist or has been archived."
        actionText="Back to Sites"
        onAction={() => router.push("/client-portal/sites")}
      />
    );
  }

  const isTatDelayed = site.elapsedDays > site.targetTATDays;
  const heroImage =
    site.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop";

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 06 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-4 -mx-3.5 -mt-3.5">
        {/* Title & Status */}
        <div className="px-4 pt-3 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-base text-[#0B0D12]">
              {site.name}
            </h1>
            <p className="text-xs text-[#59616D] font-medium mt-0.5">
              {site.projectName}
            </p>
          </div>
          <StatusBadge status={site.status} size="sm" />
        </div>

        {/* Large Site Image with "1/12" counter overlay */}
        <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
          <img
            src={heroImage}
            alt={site.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2.5 right-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>1/12</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-display font-bold text-[#0B0D12]">
                Progress
              </span>
              <span className="font-bold text-[#283A97]">{site.progress}%</span>
            </div>
            <ProgressBar value={site.progress} showValue={false} size="sm" />
          </div>
        </div>

        {/* Structured Metadata List */}
        <div className="px-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg divide-y divide-[#E5E7EB] shadow-xs">
            {/* City */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <MapPin className="w-4 h-4 text-[#283A97]" />
                <span className="font-medium">City</span>
              </div>
              <span className="font-bold text-[#0B0D12]">{site.city}</span>
            </div>

            {/* Status */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Status</span>
              </div>
              <span className="font-bold text-emerald-700 capitalize">{site.status}</span>
            </div>

            {/* Installation Date */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <Calendar className="w-4 h-4 text-[#283A97]" />
                <span className="font-medium">Installation Date</span>
              </div>
              <span className="font-bold text-[#0B0D12]">{site.installationTarget}</span>
            </div>

            {/* Inspection Date */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <ClipboardCheck className="w-4 h-4 text-[#283A97]" />
                <span className="font-medium">Inspection Date</span>
              </div>
              <span className="font-bold text-[#0B0D12]">{site.inspectionDate}</span>
            </div>

            {/* Assigned Team */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <Users className="w-4 h-4 text-[#283A97]" />
                <span className="font-medium">Assigned Team</span>
              </div>
              <span className="font-bold text-[#0B0D12]">{site.assignedTeam}</span>
            </div>

            {/* TAT */}
            <div className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-[#59616D]">
                <Clock className="w-4 h-4 text-[#283A97]" />
                <span className="font-medium">TAT</span>
              </div>
              <span className="font-bold text-[#0B0D12]">{site.targetTATDays} Days</span>
            </div>
          </div>
        </div>

        {/* SITE PHOTOS */}
        <div className="px-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0B0D12]">
              SITE PHOTOS
            </h3>
            <span className="text-[11px] text-[#283A97] font-semibold">
              View All (12) →
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {site.photos.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPhoto(p.url)}
                className="w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-[#E5E7EB] bg-neutral-100 cursor-pointer relative group"
              >
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* SITE UPDATES */}
        <div className="px-4 space-y-2 pb-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0B0D12]">
            SITE UPDATES
          </h3>
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 space-y-3 shadow-xs">
            {site.recentUpdates.map((upd, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#283A97] mt-1.5 shrink-0" />
                <p className="text-[#0B0D12] leading-relaxed">{upd}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for Mobile Site Photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-md w-full relative">
            <img src={selectedPhoto} alt="Site Photo" className="w-full rounded-lg shadow-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DEDICATED DESKTOP VIEW (>= lg)                              */}
      {/* ============================================================== */}
      <div className="hidden lg:block space-y-8">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/client-portal/dashboard" },
            { label: "Sites", href: "/client-portal/sites" },
            { label: site.code },
          ]}
          title={site.name}
          subtitle={`${site.address} • Associated Project: ${site.projectName}`}
          badge={<StatusBadge status={site.status} />}
          actions={
            <Link
              href="/client-portal/sites"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-neutral-700 text-xs font-display font-bold uppercase tracking-wider rounded-md hover:border-[#283A97] hover:text-[#283A97] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sites
            </Link>
          }
        />

        {/* Top Overview: Progress & TAT */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400">
                  Installation Completion
                </span>
                <span className="font-display font-black text-2xl text-neutral-900">
                  {site.progress}%
                </span>
              </div>
              <ProgressBar value={site.progress} showValue={false} className="mb-4" />
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-neutral-500">
              <span>Last Field Status Check: <strong className="text-neutral-800">{site.lastUpdate}</strong></span>
              <span>Target Handover: <strong className="text-neutral-800">{site.inspectionDate}</strong></span>
            </div>
          </div>

          <div className="col-span-5 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400">
                Turn-Around Time (TAT)
              </span>
              {isTatDelayed ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> SLA BREACH
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> WITHIN SLA
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display font-black text-3xl text-neutral-900">
                {site.elapsedDays}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                / {site.targetTATDays} Target Days
              </span>
            </div>

            <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${isTatDelayed ? "bg-rose-500" : "bg-emerald-500"}`}
                style={{
                  width: `${Math.min(100, (site.elapsedDays / site.targetTATDays) * 100)}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-neutral-500 font-body">
              Automated turn-around-time monitoring guarantees adherence to contracted retail opening dates.
            </p>
          </div>
        </div>

        {/* Schedule & Team */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-[#E5E7EB] pb-3">
              Critical Path Schedule
            </h3>
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="p-3 bg-[#F7F8FA] rounded border border-neutral-200">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">Survey Date</span>
                <span className="font-display font-bold text-xs text-neutral-900 block">{site.surveyDate}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Completed</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] rounded border border-neutral-200">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">Production</span>
                <span className="font-display font-bold text-xs text-neutral-900 block">{site.productionDate}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Completed</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] rounded border border-neutral-200">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">Dispatched</span>
                <span className="font-display font-bold text-xs text-neutral-900 block">{site.dispatchDate}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-1">In Transit</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] rounded border border-neutral-200">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">Installation Target</span>
                <span className="font-display font-bold text-xs text-neutral-900 block">{site.installationTarget}</span>
                <span className="text-[9px] text-[#283A97] font-semibold block mt-1">Active On-Site</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] rounded border border-neutral-200">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-neutral-400 block mb-1">Final QC Audit</span>
                <span className="font-display font-bold text-xs text-neutral-900 block">{site.inspectionDate}</span>
                <span className="text-[9px] text-neutral-400 font-semibold block mt-1">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 border-b border-[#E5E7EB] pb-3">
              Assigned Field Team
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-display font-bold uppercase tracking-wider block">Operations Unit</span>
                <span className="font-semibold text-neutral-900">{site.assignedTeam}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-display font-bold uppercase tracking-wider block">Lead Project Engineer</span>
                <span className="font-semibold text-[#283A97]">{site.leadEngineer}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-display font-bold uppercase tracking-wider block">Property Jurisdiction</span>
                <span className="text-neutral-700">{site.city}, {site.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Gallery */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-display font-bold text-base text-[#0B0D12] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#283A97]" />
                Site Inspection Photographic Records
              </h3>
              <p className="text-xs text-neutral-500 font-body mt-0.5">
                High-resolution photo documentation captured on-cloud via ACE SELECT field app.
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-display font-bold">
              {site.photos.length} Captured Assets
            </span>
          </div>

          <SiteGallery photos={site.photos} />
        </div>

        {/* Updates */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 sm:p-8 shadow-xs">
          <h3 className="font-display font-bold text-base text-[#0B0D12] mb-4 pb-4 border-b border-[#E5E7EB]">
            Site Field Updates
          </h3>
          <div className="space-y-3">
            {site.recentUpdates.map((upd, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#F7F8FA] rounded-md border border-neutral-200 text-xs text-neutral-700 font-body flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#283A97] mt-1.5 shrink-0" />
                <p className="leading-relaxed">{upd}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
