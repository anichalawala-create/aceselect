"use client";

import React, { useState } from "react";
import { FileText, Download, Check, FileArchive } from "lucide-react";
import { DocumentItem } from "@/types/portal";

interface MobileDocumentRowProps {
  doc: DocumentItem;
}

export function MobileDocumentRow({ doc }: MobileDocumentRowProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const isZip = doc.fileType.toLowerCase().includes("zip");

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#283A97]/40 transition-all shadow-xs group">
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        {/* File Type Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isZip
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}
        >
          {isZip ? (
            <FileArchive className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="font-display font-bold text-xs text-[#0B0D12] truncate group-hover:text-[#283A97] transition-colors">
            {doc.title}
          </h4>
          <div className="text-[11px] text-[#59616D] mt-0.5 flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-neutral-600">
              {doc.fileSize}
            </span>
            <span className="text-neutral-300">•</span>
            <span>{doc.uploadedDate}</span>
          </div>
        </div>
      </div>

      {/* Download Action */}
      <button
        type="button"
        onClick={handleDownload}
        className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
          downloaded
            ? "bg-emerald-50 border-emerald-300 text-emerald-600"
            : "bg-[#F7F8FA] border-[#E5E7EB] text-[#283A97] hover:bg-blue-50 hover:border-[#283A97]/40"
        }`}
        aria-label={`Download ${doc.title}`}
      >
        {downloaded ? (
          <Check className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
