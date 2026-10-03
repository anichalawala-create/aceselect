"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { DocumentTable } from "@/components/portal/DocumentTable";
import { EmptyState } from "@/components/portal/EmptyState";
import { MobileDocumentRow } from "@/components/portal/MobileDocumentRow";
import { documentService } from "@/services/documentService";
import { DocumentItem } from "@/types/portal";

function DocumentsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      try {
        const data = await documentService.getDocumentsByCategory(selectedCategory);
        setDocuments(data);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [selectedCategory]);

  const filtered = documents.filter((doc) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.projectName.toLowerCase().includes(q) ||
      doc.fileType.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* ============================================================== */}
      {/* 1. DEDICATED MOBILE VIEW (< lg) Matching Phone 10 Reference   */}
      {/* ============================================================== */}
      <div className="lg:hidden space-y-3.5">
        {/* Title row with Search Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-black text-xl text-[#0B0D12] tracking-tight">
            Documents
          </h1>
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              mobileSearchOpen
                ? "bg-[#283A97] text-white"
                : "bg-white border border-[#E5E7EB] text-neutral-600 hover:text-[#0B0D12]"
            }`}
            aria-label="Search documents"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Search input */}
        {mobileSearchOpen && (
          <div className="relative animate-in slide-in-from-top-2 duration-150">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search file name, project..."
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

        {/* Filter Tabs matching Phone 10 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "Drawings", "Reports", "Invoices"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider shrink-0 transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#283A97] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#59616D] hover:bg-neutral-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document rows */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-white border border-[#E5E7EB] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No documents"
            description="No files match your selected category or search."
            actionText="Show All"
            onAction={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((doc) => (
              <MobileDocumentRow key={doc.id} doc={doc} />
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
            { label: "Documents" },
          ]}
          title="Document Library"
          subtitle="Centralized repository of progress reports, high-res site photos, CAD drawings, BOQs, and tax invoices."
        />

        {/* Filter Category Tabs and Search */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {[
                "All",
                "Reports",
                "Site Photos",
                "Drawings",
                "Invoices",
                "Guidelines",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#283A97] text-white shadow-xs"
                      : "bg-[#F7F8FA] text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search file name, project..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Document Table */}
        {loading ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No documents found"
            description="Try selecting 'All' or searching for another keyword."
            actionText="View All Documents"
            onAction={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
          />
        ) : (
          <DocumentTable documents={filtered} />
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 space-y-4 animate-pulse">
          <div className="h-8 bg-neutral-200 w-48 rounded" />
          <div className="h-64 bg-neutral-100 rounded w-full" />
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
