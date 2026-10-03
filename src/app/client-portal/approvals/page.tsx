"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { ApprovalCard } from "@/components/portal/ApprovalCard";
import { EmptyState } from "@/components/portal/EmptyState";
import { MobileApprovalRow } from "@/components/portal/MobileApprovalRow";
import { approvalService } from "@/services/approvalService";
import { ApprovalItem } from "@/types/portal";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [tab, setTab] = useState<"ALL" | "PENDING" | "APPROVED" | "CHANGES_REQUESTED">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    approvalService.getApprovals().then((data) => {
      if (active) {
        setApprovals(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = () => {
    approvalService.getApprovals().then(setApprovals);
  };

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;
  const approvedCount = approvals.filter((a) => a.status === "APPROVED").length;
  const changesCount = approvals.filter((a) => a.status === "CHANGES_REQUESTED").length;

  const filtered = approvals.filter((item) => {
    const matchesTab = tab === "ALL" || item.status === tab;
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.projectName.toLowerCase().includes(search.toLowerCase()) ||
      item.siteName.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 07 Reference    */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-3.5">
        {/* Title */}
        <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
          Approvals ({approvals.length})
        </h1>

        {/* Filter pills matching Phone 07 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {([
            { label: "All", value: "ALL" },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Changes", value: "CHANGES_REQUESTED" },
          ] as const).map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider shrink-0 transition-all ${
                tab === t.value
                  ? "bg-[#283A97] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#59616D] hover:bg-neutral-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Approvals vertical list */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white border border-[#E5E7EB] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No approvals"
            description="No items match your selected filter."
            actionText="Show All"
            onAction={() => setTab("ALL")}
          />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((item) => (
              <MobileApprovalRow key={item.id} item={item} />
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
            { label: "Approvals" },
          ]}
          title="Asset & Engineering Approvals"
          subtitle="Review, approve, and submit engineering modifications on signage artwork, CAD mock-ups, and material samples."
        />

        {/* Tabs and Filter Strip */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("ALL")}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  tab === "ALL"
                    ? "bg-[#283A97] text-white shadow-xs"
                    : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                All ({approvals.length})
              </button>
              <button
                onClick={() => setTab("PENDING")}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  tab === "PENDING"
                    ? "bg-[#283A97] text-white shadow-xs"
                    : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setTab("APPROVED")}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  tab === "APPROVED"
                    ? "bg-[#283A97] text-white shadow-xs"
                    : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setTab("CHANGES_REQUESTED")}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  tab === "CHANGES_REQUESTED"
                    ? "bg-[#283A97] text-white shadow-xs"
                    : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Changes Requested ({changesCount})
              </button>
            </div>

            <div className="relative w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search approvals..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Approvals List */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white border border-[#E5E7EB] rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No approvals found"
            description={
              tab === "PENDING"
                ? "All submitted asset approvals have been processed. Great job!"
                : "No approval records match your current filter settings."
            }
            actionText="Show All Approvals"
            onAction={() => {
              setTab("ALL");
              setSearch("");
            }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
