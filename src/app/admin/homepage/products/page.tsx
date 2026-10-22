"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  X,
  Upload,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface SolutionCard {
  id: string;
  title: string;
  img: string;
  href?: string;
  sort_order?: number;
}

const DEFAULT_HEADER = {
  eyebrow: "OUR PRODUCTS & SOLUTIONS",
  headline: "HARDWARE, SIGNAGE\n& CLOUD CMS.",
  intro: "From active indoor & outdoor LED displays and 4K Android standees to architectural signage and secure Jio Software CMS, explore our end-to-end directory.",
  link_label: "EXPLORE PRODUCT DIRECTORY",
  link_href: "/products",
};

const DEFAULT_CARDS: SolutionCard[] = [
  { id: "1", title: "ACTIVE DIGITAL\nLED DISPLAYS", img: "/images/products/indoor-smd-page1.jpg", href: "/products", sort_order: 1 },
  { id: "2", title: "ANDROID DIGITAL\nSTANDEES (32\"-65\")", img: "/images/products/standee-banner.jpg", href: "/products", sort_order: 2 },
  { id: "3", title: "OUTDOOR HIGH BRIGHTNESS\nSMD SERIES", img: "/images/products/outdoor-smd-page1.jpg", href: "/products", sort_order: 3 },
  { id: "4", title: "INTERACTIVE &\nSELF-SERVICE KIOSKS", img: "/images/projects/project-bkc-elobby.jpg", href: "/products", sort_order: 4 },
  { id: "5", title: "STATIC SIGNAGE &\nGLOW SIGN BOARDS", img: "/images/projects/atm-kiosk-branding.jpg", href: "/products", sort_order: 5 },
  { id: "6", title: "SIGNAGE CMS ON\nJIO SOFTWARE", img: "/images/products/product-hierarchy.jpg", href: "/products", sort_order: 6 },
];

export default function AdminHomepageProductsPage() {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [cards, setCards] = useState<SolutionCard[]>(DEFAULT_CARDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SolutionCard | null>(null);
  const [cardForm, setCardForm] = useState<{
    title: string;
    img: string;
    href: string;
  }>({
    title: "",
    img: "",
    href: "/products",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/content?section=homepage_products");
        const json = await res.json();
        if (json.success && json.data) {
          setHeader({
            eyebrow: json.data.eyebrow || DEFAULT_HEADER.eyebrow,
            headline: json.data.headline || DEFAULT_HEADER.headline,
            intro: json.data.intro || DEFAULT_HEADER.intro,
            link_label: json.data.link_label || DEFAULT_HEADER.link_label,
            link_href: json.data.link_href || DEFAULT_HEADER.link_href,
          });
          if (Array.isArray(json.data.cards) && json.data.cards.length > 0) {
            setCards(json.data.cards);
          }
        }
      } catch (err) {
        console.error("Failed to load homepage products content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "homepage_products",
          data: {
            ...header,
            cards,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save section");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error saving homepage products:", err);
      setErrorMsg(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenAdd() {
    setEditingCard(null);
    setCardForm({
      title: "",
      img: "/images/products/indoor-smd-page1.jpg",
      href: "/products",
    });
    setModalOpen(true);
  }

  function handleOpenEdit(card: SolutionCard) {
    setEditingCard(card);
    setCardForm({
      title: card.title,
      img: card.img,
      href: card.href || "/products",
    });
    setModalOpen(true);
  }

  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cardForm.title.trim() || !cardForm.img.trim()) {
      alert("Please provide both a title and an image URL.");
      return;
    }

    let updated: SolutionCard[];
    if (editingCard) {
      updated = cards.map((c) =>
        c.id === editingCard.id
          ? {
              ...c,
              title: cardForm.title.trim(),
              img: cardForm.img.trim(),
              href: cardForm.href.trim() || "/products",
            }
          : c
      );
    } else {
      const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `card-${Date.now()}`;
      const newCard: SolutionCard = {
        id: newId,
        title: cardForm.title.trim(),
        img: cardForm.img.trim(),
        href: cardForm.href.trim() || "/products",
        sort_order: cards.length + 1,
      };
      updated = [...cards, newCard];
    }

    setCards(updated);
    setModalOpen(false);
  }

  function handleDeleteCard(id: string) {
    if (!confirm("Are you sure you want to delete this solution card?")) return;
    setCards(cards.filter((c) => c.id !== id));
  }

  function moveCard(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCards(updated.map((item, idx) => ({ ...item, sort_order: idx + 1 })));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "products");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.files?.length > 0) {
        const uploadedFile = data.files[0];
        setCardForm((prev) => ({ ...prev, img: uploadedFile.url || data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("An error occurred during image upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 font-medium uppercase tracking-wider">
            <Link href="/admin" className="text-[#283A97] hover:underline">Homepage</Link> / Products & Solutions
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
            Products & Solutions Section
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Edit the section headline, intro text, and customize the 6 visual product showcase cards displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#products"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-50 transition-all cursor-pointer shadow-xs"
          >
            <Eye className="w-4 h-4" /> Preview Live
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-all cursor-pointer shadow-sm hover:shadow disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Changes Saved ✓
              </>
            ) : saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Header Typography Settings */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#283A97]" />
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">
              Section Heading & Description
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Controls top text of the section</span>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={header.eyebrow}
                onChange={(e) => setHeader({ ...header, eyebrow: e.target.value })}
                placeholder="OUR PRODUCTS & SOLUTIONS"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
              <p className="text-[11px] text-neutral-400">Small uppercase badge text above the headline.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Headline Text <span className="text-[#283A97] font-normal">(use \n for line breaks)</span>
              </label>
              <input
                type="text"
                value={header.headline}
                onChange={(e) => setHeader({ ...header, headline: e.target.value })}
                placeholder="HARDWARE, SIGNAGE\n& CLOUD CMS."
                className="w-full px-3.5 py-2.5 text-sm font-bold border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
              <p className="text-[11px] text-neutral-400">Main large headline text shown on the left.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Intro Paragraph
            </label>
            <textarea
              rows={3}
              value={header.intro}
              onChange={(e) => setHeader({ ...header, intro: e.target.value })}
              placeholder="From active indoor & outdoor LED displays..."
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none leading-relaxed"
            />
            <p className="text-[11px] text-neutral-400">Summary paragraph positioned on the right side of the section.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-neutral-100">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Call-to-Action Link Label
              </label>
              <input
                type="text"
                value={header.link_label}
                onChange={(e) => setHeader({ ...header, link_label: e.target.value })}
                placeholder="EXPLORE PRODUCT DIRECTORY"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Call-to-Action URL Target
              </label>
              <input
                type="text"
                value={header.link_href}
                onChange={(e) => setHeader({ ...header, link_href: e.target.value })}
                placeholder="/products"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Solution Showcase Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-display">
                Showcase Cards Grid
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-[#283A97] border border-blue-200">
                {cards.length} Cards
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              These cards are rendered in a 3-column interactive responsive gallery on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Add Showcase Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={card.id || index}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Visual preview */}
              <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                <img
                  src={card.img}
                  alt=""
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono font-bold text-white rounded border border-white/20">
                    #{index + 1}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-display font-bold text-sm tracking-wide leading-snug whitespace-pre-line drop-shadow-sm">
                    {card.title.replace(/\\n/g, "\n")}
                  </h4>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50">
                <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[160px]" title={card.href || "/products"}>
                  {card.href || "/products"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveCard(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-white rounded border border-transparent hover:border-neutral-200 disabled:opacity-30 cursor-pointer transition-all"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCard(index, "down")}
                    disabled={index === cards.length - 1}
                    className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-white rounded border border-transparent hover:border-neutral-200 disabled:opacity-30 cursor-pointer transition-all"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(card)}
                    className="p-1.5 text-[#283A97] hover:bg-blue-50 rounded cursor-pointer transition-all"
                    title="Edit card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-all"
                    title="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add / Edit Card */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900 font-display">
                {editingCard ? "Edit Showcase Card" : "Add New Showcase Card"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Card Title <span className="text-[#283A97] font-normal">(use \n for line breaks)</span> *
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  placeholder="e.g. ACTIVE DIGITAL\nLED DISPLAYS"
                  className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Image URL / Asset Path *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={cardForm.img}
                    onChange={(e) => setCardForm({ ...cardForm, img: e.target.value })}
                    placeholder="/images/products/..."
                    className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent font-mono text-xs"
                  />
                  
                  {/* File Upload Option */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-2 py-2 px-3 bg-neutral-50 hover:bg-blue-50 border border-dashed border-neutral-300 hover:border-[#283A97] rounded-lg text-xs text-neutral-600 transition-colors">
                      {uploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading image...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" /> Upload from Computer
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Target Link Destination
                </label>
                <input
                  type="text"
                  value={cardForm.href}
                  onChange={(e) => setCardForm({ ...cardForm, href: e.target.value })}
                  placeholder="/products"
                  className="w-full text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#283A97] focus:border-transparent"
                />
              </div>

              {/* Mini Preview */}
              {cardForm.img && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Card Preview
                  </label>
                  <div className="relative aspect-[16/9] rounded-xl bg-neutral-900 overflow-hidden border border-neutral-200">
                    <img src={cardForm.img} alt="" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-display font-bold text-sm whitespace-pre-line leading-tight">
                        {cardForm.title.replace(/\\n/g, "\n") || "Card Title"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleModalSubmit}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#283A97] hover:bg-[#1e2d7a] rounded-lg cursor-pointer shadow-sm"
                >
                  {editingCard ? "Apply Changes" : "Add Card"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
