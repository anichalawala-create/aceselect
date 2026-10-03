"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { ApprovalItem } from "@/types/portal";
import { StatusBadge } from "./StatusBadge";
import { approvalService } from "@/services/approvalService";

interface ApprovalCardProps {
  item: ApprovalItem;
  onStatusChange?: (updated: ApprovalItem) => void;
  compact?: boolean;
}

export function ApprovalCard({
  item,
  onStatusChange,
}: ApprovalCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const updated = await approvalService.approveItem(item.id);
      setToastMessage("Approval successfully recorded.");
      if (onStatusChange) onStatusChange(updated);
      setTimeout(() => {
        setModalOpen(false);
        setToastMessage(null);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeNotes.trim()) {
      setShowNotesInput(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await approvalService.requestChanges(item.id, changeNotes.trim());
      setToastMessage("Change request sent to ACE SELECT engineering team.");
      if (onStatusChange) onStatusChange(updated);
      setTimeout(() => {
        setModalOpen(false);
        setToastMessage(null);
        setShowNotesInput(false);
        setChangeNotes("");
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-[6px] hover:border-solvorry-DEFAULT/40 transition-all duration-200 flex items-center justify-between gap-4 group">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-14 h-12 rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 border border-[#E5E7EB]">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-bold text-sm text-[#0B0D12] truncate group-hover:text-solvorry-DEFAULT transition-colors">
              {item.title}
            </h4>
            <div className="text-[11px] text-neutral-500 font-body truncate mt-0.5">
              <span>{item.projectName}</span>
              <span className="mx-1.5 text-neutral-300">|</span>
              <span className="text-neutral-700 font-medium">{item.siteName}</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-body mt-0.5">
              Submitted: {item.submittedDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={item.status} size="sm" />
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-solvorry-DEFAULT uppercase tracking-wider px-3 py-1.5 rounded-[4px] border border-solvorry-DEFAULT/20 hover:bg-solvorry-DEFAULT hover:text-white transition-all duration-200"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Review & Approval Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-[8px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400">
                    {item.type}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <h3 className="font-display font-black text-xl text-[#0B0D12]">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {item.projectName} &bull; {item.siteName}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {toastMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  {toastMessage}
                </div>
              )}

              {/* Preview Image */}
              <div className="rounded-[6px] overflow-hidden border border-[#E5E7EB] aspect-video bg-neutral-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details & Specs */}
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wider text-neutral-800 mb-2">
                  Specification Details
                </h4>
                <p className="text-xs text-neutral-600 font-body leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.specs && item.specs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F7F8FA] p-4 rounded-[6px] border border-neutral-200">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="text-xs">
                        <span className="text-neutral-400 font-display font-bold uppercase tracking-wider text-[10px] block">
                          {spec.label}
                        </span>
                        <span className="text-neutral-800 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments History */}
              {item.comments && item.comments.length > 0 && (
                <div>
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-neutral-800 mb-2">
                    Review History
                  </h4>
                  <div className="space-y-2">
                    {item.comments.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 bg-neutral-50 rounded-[4px] border border-neutral-200 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-neutral-800">
                            {c.author} ({c.role})
                          </span>
                          <span className="text-neutral-400">{c.date}</span>
                        </div>
                        <p className="text-neutral-600">{c.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Changes Input */}
              {showNotesInput && (
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-[6px]">
                  <label className="block text-xs font-display font-bold text-amber-900 uppercase tracking-wider mb-2">
                    Feedback / Changes Required
                  </label>
                  <textarea
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe specific dimensional, color, or structural changes needed..."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 px-6 flex items-center justify-end gap-3 z-10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-neutral-50"
              >
                Close
              </button>

              {item.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleRequestChanges}
                    className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {showNotesInput ? "Confirm Changes" : "Request Changes"}
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleApprove}
                    className="px-5 py-2 bg-solvorry-DEFAULT text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-solvorry-dark transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
