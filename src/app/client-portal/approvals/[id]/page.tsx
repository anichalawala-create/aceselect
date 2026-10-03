"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageSquare,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { EmptyState } from "@/components/portal/EmptyState";
import { approvalService } from "@/services/approvalService";
import { ApprovalItem } from "@/types/portal";

export default function ApprovalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ApprovalItem | null>(null);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const data = await approvalService.getApprovalById(id);
        setItem(data);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  const handleApprove = async () => {
    if (!item) return;
    setProcessing(true);
    try {
      const updated = await approvalService.approveItem(
        item.id,
        "Approved by Rohit Sharma (Client) for on-site production."
      );
      setItem(updated);
      setActionSuccess("Asset has been officially APPROVED for fabrication.");
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !revisionNotes.trim()) return;
    setProcessing(true);
    try {
      const updated = await approvalService.requestChanges(item.id, revisionNotes.trim());
      setItem(updated);
      setShowChangesModal(false);
      setRevisionNotes("");
      setActionSuccess("Modification request logged and dispatched to the design team.");
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-2xl mx-auto">
        <div className="h-8 bg-neutral-200 w-48 rounded" />
        <div className="h-60 bg-white border border-[#E5E7EB] rounded-lg" />
        <div className="h-32 bg-white border border-[#E5E7EB] rounded-lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <EmptyState
        title="Approval Item Not Found"
        description="The requested approval ticket does not exist or has been removed."
        actionText="Back to Approvals"
        onAction={() => router.push("/client-portal/approvals")}
      />
    );
  }

  const isApproved = item.status === "APPROVED";
  const fileName = item.file || "SBI_Hitachi_Kiosk_Drawing_v2.pdf";
  const artworkImages = item.images && item.images.length > 0 ? item.images : [item.thumbnail];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-28 lg:pb-8">
      {/* Back button for desktop view */}
      <div className="hidden lg:flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
        <Link
          href="/client-portal/approvals"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-neutral-600 hover:text-[#283A97] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Approvals
        </Link>
        <StatusBadge status={item.status} />
      </div>

      {/* Title & Project Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg text-[#0B0D12]">
              {item.title}
            </h1>
            <p className="text-xs text-[#59616D] mt-0.5">
              <span>{item.projectName}</span>
              <span className="mx-1.5 text-neutral-300">•</span>
              <span>{item.siteName}</span>
            </p>
          </div>
          <div className="lg:hidden">
            <StatusBadge status={item.status} size="sm" />
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Large Approval Artwork / Image Treatment matching Phone 08 */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-neutral-900">
          {artworkImages.map((img, i) => (
            <div key={i} className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
              <img
                src={img}
                alt={`${item.title} render ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Render View {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] block">
              Submitted By
            </span>
            <span className="font-bold text-[#0B0D12] mt-0.5 block">
              {item.submittedBy}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] block">
              Submitted On
            </span>
            <span className="font-bold text-[#0B0D12] mt-0.5 block">
              {item.submittedDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] block">
              Type
            </span>
            <span className="font-bold text-[#0B0D12] mt-0.5 block">
              {item.type}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] block">
              Attached File
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-mono text-[11px] font-bold text-[#283A97] truncate hover:underline cursor-pointer">
                {fileName}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-4">
          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] block mb-2">
            Comments & Review Notes
          </span>
          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-xs flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#283A97] shrink-0 mt-0.5" />
            <p className="text-[#0B0D12] leading-relaxed">
              {item.description || "Please review the final artwork for the Jaipur store exterior signage."}
            </p>
          </div>

          {/* Past Comments Trail */}
          {item.comments && item.comments.length > 0 && (
            <div className="mt-3 space-y-2">
              {item.comments.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-white border border-[#E5E7EB] rounded-md text-[11px]"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-0.5">
                    <span className="font-bold text-[#0B0D12]">{c.author} ({c.role})</span>
                    <span className="text-[10px]">{c.date}</span>
                  </div>
                  <p className="text-neutral-700">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Area matching Phone 08 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3 sm:p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {isApproved ? (
            <div className="w-full py-3.5 bg-emerald-600 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-xs">
              <Check className="w-4 h-4" /> APPROVED BY CLIENT
            </div>
          ) : (
            <>
              {/* Approve Button in #283A97 */}
              <button
                type="button"
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 py-3.5 bg-[#283A97] hover:bg-[#1f2d77] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {processing ? "PROCESSING..." : "APPROVE"}
              </button>

              {/* Request Changes Button: White with thin border */}
              <button
                type="button"
                onClick={() => setShowChangesModal(true)}
                disabled={processing}
                className="flex-1 py-3.5 bg-white border border-[#E5E7EB] text-rose-600 hover:bg-rose-50 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              >
                REQUEST CHANGES
              </button>
            </>
          )}
        </div>
      </div>

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-2xl relative">
            <h3 className="font-display font-bold text-base text-[#0B0D12] mb-1">
              Request Design Modifications
            </h3>
            <p className="text-xs text-[#59616D] mb-4">
              Specify the required adjustments for {item.title}. The design team will update and resubmit.
            </p>

            <form onSubmit={handleRequestChanges} className="space-y-4">
              <textarea
                required
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Example: Please reduce exterior canopy projection by 130mm to clear mall fire safety requirements..."
                className="w-full p-3 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#0B0D12] placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97]"
              />

              <div className="flex items-center gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangesModal(false)}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#59616D] hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Submit Revisions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
