"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from "lucide-react";
import { DocumentItem } from "@/types/portal";

interface DocumentTableProps {
  documents: DocumentItem[];
}

export function DocumentTable({ documents }: DocumentTableProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const getFormatIcon = (format: DocumentItem["fileType"]) => {
    switch (format) {
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-500" />;
      case "DWG":
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case "XLSX":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case "ZIP":
        return <FileArchive className="w-4 h-4 text-amber-600" />;
      default:
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    setDownloadToast(`Downloading "${doc.title}" (${doc.fileSize})...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 2500);
  };

  return (
    <>
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#0B0F2B] text-white rounded-[6px] shadow-xl border border-white/10 flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 px-6">Document Name</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Uploaded</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-[#F7F8FA]/60 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                        {getFormatIcon(doc.fileType)}
                      </div>
                      <span className="font-display font-bold text-neutral-900 group-hover:text-solvorry-DEFAULT transition-colors">
                        {doc.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-600 font-body">
                    {doc.projectName}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-neutral-100 text-neutral-700 text-[10px] font-display font-bold uppercase tracking-wider">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-display font-bold text-neutral-500 text-[11px]">
                    {doc.fileType}
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-body tabular-nums">
                    {doc.fileSize}
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-body tabular-nums">
                    {doc.uploadedDate}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1.5 text-neutral-400 hover:text-solvorry-DEFAULT hover:bg-neutral-100 rounded transition-colors"
                        title="View Document Info"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-display font-bold uppercase tracking-wider text-solvorry-DEFAULT hover:bg-solvorry-DEFAULT hover:text-white rounded border border-solvorry-DEFAULT/20 transition-all"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document View Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-[8px] max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center border border-neutral-200">
                  {getFormatIcon(selectedDoc.fileType)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B0D12]">
                    {selectedDoc.title}
                  </h3>
                  <span className="text-[10px] text-neutral-400 uppercase font-display font-bold tracking-wider">
                    {selectedDoc.fileType} Document &bull; {selectedDoc.fileSize}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6 bg-[#F7F8FA] p-4 rounded border border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-display uppercase tracking-wider text-[10px]">Project:</span>
                <span className="font-medium text-neutral-900">{selectedDoc.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-display uppercase tracking-wider text-[10px]">Category:</span>
                <span className="font-medium text-neutral-900">{selectedDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-display uppercase tracking-wider text-[10px]">Uploaded Date:</span>
                <span className="font-medium text-neutral-900">{selectedDoc.uploadedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-display uppercase tracking-wider text-[10px]">Integrity Hash:</span>
                <span className="font-mono text-[10px] text-neutral-600">SHA256: 7f83b1657ff1...</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-neutral-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 bg-solvorry-DEFAULT text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-solvorry-dark flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
