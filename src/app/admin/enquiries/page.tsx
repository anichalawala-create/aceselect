"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Trash2,
  RefreshCw,
} from "lucide-react";

type EnquiryStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service_interest?: string;
  status: EnquiryStatus;
  source: string;
  notes?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string; icon: React.ElementType }> = {
  new:       { label: "New",       color: "bg-blue-50 text-blue-700 border-blue-100",     icon: AlertCircle },
  contacted: { label: "Contacted", color: "bg-purple-50 text-purple-700 border-purple-100", icon: MessageSquare },
  qualified: { label: "Qualified", color: "bg-amber-50 text-amber-700 border-amber-100",   icon: Clock },
  converted: { label: "Converted", color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
  closed:    { label: "Closed",    color: "bg-neutral-100 text-neutral-500 border-neutral-200", icon: XCircle },
};

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnquiryStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function loadEnquiries() {
    setLoading(true);
    fetch("/api/admin/enquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.enquiries) {
          setEnquiries(data.enquiries);
        }
      })
      .catch((err) => console.error("Error fetching enquiries:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function handleStatusChange(id: string, newStatus: EnquiryStatus) {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete the enquiry from ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
    }
  }

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.message || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    qualified: enquiries.filter((e) => e.status === "qualified").length,
    converted: enquiries.filter((e) => e.status === "converted").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Client Enquiries & Leads</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time prospective client inquiries and project requirements from the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadEnquiries}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: "all", label: `All (${enquiries.length})` },
          { value: "new", label: `New (${counts.new})` },
          { value: "contacted", label: `Contacted (${counts.contacted})` },
          { value: "qualified", label: `Qualified (${counts.qualified})` },
          { value: "converted", label: `Converted (${counts.converted})` },
          { value: "closed", label: `Closed (${counts.closed})` },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value as typeof statusFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === tab.value
                ? "bg-[#283A97] text-white shadow-xs"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-[#283A97]/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by client, company, requirement, or email..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>
      </div>

      {/* Enquiry Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-20 text-center text-sm text-neutral-500">
            <div className="w-6 h-6 border-2 border-[#283A97] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading live client enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-16 text-center">
            <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm font-medium">No enquiries match your selected filters.</p>
          </div>
        ) : (
          filtered.map((enq) => {
            const isExpanded = expandedId === enq.id;
            return (
              <div
                key={enq.id}
                className={`bg-white rounded-xl border transition-all ${
                  isExpanded ? "border-[#283A97]/40 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : enq.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-sm font-bold text-neutral-900">{enq.name}</h3>
                      <StatusBadge status={enq.status} />
                      {enq.status === "new" && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-neutral-500">
                      <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        {enq.company || "Independent"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        {enq.email}
                      </span>
                      {enq.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          {enq.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-1">{enq.message}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                    <span className="text-[10px] text-neutral-400 font-medium">{formatDate(enq.created_at)}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                      {enq.source}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-neutral-100 bg-neutral-50/70 p-5 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Client Requirement & Message
                      </p>
                      <p className="text-sm text-neutral-800 leading-relaxed bg-white p-3.5 rounded-lg border border-neutral-200">
                        {enq.message}
                      </p>
                    </div>

                    {enq.service_interest && (
                      <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Product / Service Interest
                        </p>
                        <span className="inline-block text-xs bg-[#283A97]/10 text-[#283A97] px-3 py-1 rounded-full font-semibold border border-[#283A97]/20">
                          {enq.service_interest}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-neutral-200/60">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-neutral-600">Update Status:</label>
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                          className="px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#283A97]/20"
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${enq.email}?subject=${encodeURIComponent(`ACE SELECT — Response to Enquiry regarding ${enq.service_interest || "Display Solutions"}`)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" /> Reply by Email
                        </a>
                        {enq.phone && (
                          <a
                            href={`tel:${enq.phone}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-200 text-neutral-700 bg-white text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(enq.id, enq.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
        <p>Showing {filtered.length} of {enquiries.length} client enquiries</p>
        <p className="text-[11px] text-neutral-400">Live Client Enquiries Inbox</p>
      </div>
    </div>
  );
}
