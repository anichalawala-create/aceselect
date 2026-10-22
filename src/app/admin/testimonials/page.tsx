"use client";

import { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Edit3,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  Building,
  User,
  Quote,
  AlertCircle
} from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_company: string;
  author_photo_url?: string | null;
  is_featured: boolean;
  is_active?: boolean;
  sort_order?: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.",
    author_name: "Rohit Sharma",
    author_title: "Head - ATM Deployments & Infrastructure",
    author_company: "HITACHI PAYMENT SERVICES",
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "2",
    quote: "Their end-to-end support from optical design to retail installation made our flagship in-store Active LED display rollouts smooth, stunning, and flawless.",
    author_name: "Neha Verma",
    author_title: "VP - Retail Experience & Projects",
    author_company: "TITAN COMPANY / CARATLANE",
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "3",
    quote: "Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch rebranding and display infrastructure for over a decade.",
    author_name: "Amit Khanna",
    author_title: "Chief Manager - Infrastructure & Branding",
    author_company: "STATE BANK OF INDIA",
    is_featured: true,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "4",
    quote: "The architectural display installations and facade branding by ACE SELECT exceeded our expectations in build quality, structural safety, and visual impact.",
    author_name: "Priya Sundaram",
    author_title: "Director - Commercial Real Estate & Workspace Design",
    author_company: "DLF CYBERCITY",
    is_featured: true,
    is_active: true,
    sort_order: 4,
  },
  {
    id: "5",
    quote: "Rapid nationwide rollout across Tier 2 and Tier 3 branches without a single hitch. Their logistical capability and fabrication consistency across India is unmatched.",
    author_name: "Vikramaditya Rao",
    author_title: "Head of Operations & Network Expansion",
    author_company: "MUTHOOT FINANCE GROUP",
    is_featured: true,
    is_active: true,
    sort_order: 5,
  },
];

const AVATAR_COLORS = [
  "from-[#283A97] to-[#4A60D4]",
  "from-[#0F766E] to-[#14B8A6]",
  "from-[#9A3412] to-[#F97316]",
  "from-[#6B21A8] to-[#9333EA]",
  "from-[#BE123C] to-[#E11D48]",
];

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<{
    quote: string;
    author_name: string;
    author_title: string;
    author_company: string;
    author_photo_url: string;
    is_featured: boolean;
  }>({
    quote: "",
    author_name: "",
    author_title: "",
    author_company: "",
    author_photo_url: "",
    is_featured: true,
  });

  useEffect(() => {
    async function loadTestimonials() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/content?section=testimonials");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Deduplicate defensively
          const seen = new Set<string>();
          const deduped: Testimonial[] = [];
          for (const item of json.data) {
            const key = item.id || `${item.author_name}-${item.author_company}`;
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(item);
            }
          }
          setItems(deduped);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  async function persistTestimonials(updated: Testimonial[]) {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "testimonials", data: updated }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to persist");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error saving testimonials:", err);
      setErrorMsg(err.message || "Failed to sync changes with server");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setFormData({
      quote: "",
      author_name: "",
      author_title: "",
      author_company: "",
      author_photo_url: "",
      is_featured: true,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(t: Testimonial) {
    setEditingItem(t);
    setFormData({
      quote: t.quote,
      author_name: t.author_name,
      author_title: t.author_title,
      author_company: t.author_company,
      author_photo_url: t.author_photo_url || "",
      is_featured: !!t.is_featured,
    });
    setModalOpen(true);
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.quote.trim() || !formData.author_name.trim() || !formData.author_company.trim()) {
      alert("Please enter the quote, author name, and company.");
      return;
    }

    let updated: Testimonial[];
    if (editingItem) {
      // Update existing
      updated = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              quote: formData.quote.trim(),
              author_name: formData.author_name.trim(),
              author_title: formData.author_title.trim(),
              author_company: formData.author_company.trim(),
              author_photo_url: formData.author_photo_url.trim() || null,
              is_featured: formData.is_featured,
            }
          : item
      );
    } else {
      // Add new
      const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `test-${Date.now()}`;
      const newItem: Testimonial = {
        id: newId,
        quote: formData.quote.trim(),
        author_name: formData.author_name.trim(),
        author_title: formData.author_title.trim(),
        author_company: formData.author_company.trim(),
        author_photo_url: formData.author_photo_url.trim() || null,
        is_featured: formData.is_featured,
        is_active: true,
        sort_order: items.length + 1,
      };
      updated = [...items, newItem];
    }

    setItems(updated);
    setModalOpen(false);
    await persistTestimonials(updated);
  }

  async function toggleFeatured(id: string) {
    const updated = items.map((t) => (t.id === id ? { ...t, is_featured: !t.is_featured } : t));
    setItems(updated);
    await persistTestimonials(updated);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const updated = items.filter((t) => t.id !== id);
    setItems(updated);
    try {
      await fetch(`/api/admin/content?section=testimonials&id=${id}`, { method: "DELETE" });
      await persistTestimonials(updated);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    // re-assign sort_orders
    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(reordered);
    await persistTestimonials(reordered);
  }

  const featuredCount = items.filter((i) => i.is_featured).length;

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
              Client Testimonials
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#283A97] border border-blue-200">
              {items.length} Total • {featuredCount} Featured
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1.5 max-w-2xl">
            Manage executive client feedback and endorsements. Changes sync in real time with the homepage testimonials section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
          <button
            onClick={() => persistTestimonials(items)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-all cursor-pointer shadow-sm hover:shadow disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Synced with Website
              </>
            ) : saving ? (
              <>
                <Save className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-[#283A97]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#283A97] shrink-0" />
          <span>
            The homepage prominently displays the top <strong>3 featured testimonials</strong> ordered by your custom priority list below.
          </span>
        </div>
        <span className="font-semibold text-neutral-500 hidden md:inline">
          Use the arrows (↑ ↓) to reorder priority
        </span>
      </div>

      {/* Grid of Testimonial Cards */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading testimonials...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl p-8">
          <MessageSquareQuote className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No testimonials yet</h3>
          <p className="text-sm text-neutral-500 mt-1 mb-5">Add your first client endorsement to feature on the homepage.</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a]"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const initials = t.author_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={t.id || index}
                className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group"
              >
                {/* Top Bar with Company Tag and Controls */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#283A97] bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100/60 truncate max-w-[200px]">
                      <Building className="w-3 h-3 shrink-0" />
                      <span className="truncate">{t.author_company}</span>
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleFeatured(t.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                          t.is_featured
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        }`}
                        title="Click to toggle featured on homepage"
                      >
                        {t.is_featured ? "★ Featured" : "Standard"}
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <span className="text-[#283A97]/20 font-serif text-5xl leading-none absolute -top-4 -left-1 select-none pointer-events-none">
                      “
                    </span>
                    <p className="text-sm text-neutral-700 leading-relaxed font-normal pt-2 pl-2">
                      {t.quote}
                    </p>
                  </div>
                </div>

                {/* Author Info & Actions */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {t.author_photo_url ? (
                        <img src={t.author_photo_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        initials || "AS"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{t.author_name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{t.author_title}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                      title="Move up in display order"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                      title="Move down in display order"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-neutral-500 hover:text-[#283A97] hover:bg-blue-50 rounded cursor-pointer"
                      title="Edit testimonial"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Delete testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add / Edit Testimonial */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#283A97]" />
                <h3 className="font-bold text-lg text-neutral-900 font-display">
                  {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Quote Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Enter the client endorsement or review..."
                  className="w-full text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="e.g. Rohit Sharma"
                    className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_company}
                    onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                    placeholder="e.g. HITACHI PAYMENT SERVICES"
                    className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={formData.author_title}
                  onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                  placeholder="e.g. Head - ATM Deployments & Infrastructure"
                  className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.author_photo_url}
                  onChange={(e) => setFormData({ ...formData, author_photo_url: e.target.value })}
                  placeholder="https://... (leave blank for colorful initials avatar)"
                  className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modal-featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#283A97] rounded border-neutral-300 focus:ring-[#283A97]"
                />
                <label htmlFor="modal-featured" className="text-sm font-semibold text-neutral-800 cursor-pointer">
                  Feature this testimonial on the homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#283A97] hover:bg-[#1e2d7a] rounded-lg cursor-pointer shadow-sm"
                >
                  {editingItem ? "Update Testimonial" : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
