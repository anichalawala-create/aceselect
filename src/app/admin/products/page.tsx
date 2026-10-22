"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Monitor,
  Plus,
  CheckCircle2,
  Star,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  Search,
  Filter,
  Upload,
  X,
  AlertCircle,
  Tag,
  Layers,
  ChevronRight,
  Sliders,
  Check,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  tagline: string;
  badge: string;
  image_url?: string;
  specs: string[];
  is_featured: boolean;
  is_active?: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "indoor-active-led",
    slug: "indoor-active-led",
    name: "Indoor Active LED Video Wall",
    category: "Active Indoor LED",
    tagline: "Fine Pixel Pitch COB & SMD Display Systems",
    badge: "P1.2 - P3.0",
    image_url: "/images/products/indoor-smd-page1.jpg",
    specs: [
      "COB & SMD Fine Pixel Pitch (P1.2 to P3.0)",
      "High refresh rate >3840Hz & 16-bit grayscale",
      "160° ultra-wide horizontal & vertical viewing",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "outdoor-active-led",
    slug: "outdoor-active-led",
    name: "Outdoor High-Brightness LED Display",
    category: "Outdoor LED Displays",
    tagline: "IP65 Weather-Resistant DOOH Advertising Facades",
    badge: ">6000 NITS",
    image_url: "/images/products/outdoor-smd-page1.jpg",
    specs: [
      ">6000 Nits high-brightness daylight readable",
      "IP65 waterproof all-weather die-cast cabinet",
      "ECO energy-saving low heat dissipation IC",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "digital-standees",
    slug: "digital-standees",
    name: "Commercial Digital Standee Displays",
    category: "Digital Standees",
    tagline: "Standalone Android 4K UHD Interactive Kiosks",
    badge: "4K UHD",
    image_url: "/images/products/standee-banner.jpg",
    specs: [
      "32\" to 65\" commercial-grade 4K UHD panels",
      "4mm tempered explosion-proof protective glass",
      "Android OS / Windows plug & play media engine",
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "signage-software",
    slug: "signage-software",
    name: "Architectural Signage & Wayfinding Solutions",
    category: "Signage & Software",
    tagline: "Precision Stainless Steel, Pylons & Cloud CMS",
    badge: "SEAMLESS",
    image_url: "/images/products/product-hierarchy.jpg",
    specs: [
      "Precision CNC & Laser Cut Stainless Steel 304/316",
      "Centralized cloud CMS hosted on Jio Software",
      "Mission-critical 24/7 control room & banking kiosk reliability",
    ],
    is_featured: true,
    is_active: true,
  },
];

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "active-indoor-led", name: "Active Indoor LED" },
  { id: "outdoor-led-displays", name: "Outdoor LED Displays" },
  { id: "digital-standees", name: "Digital Standees" },
  { id: "signage-software", name: "Signage & Software" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<{
    name: string;
    slug: string;
    category: string;
    tagline: string;
    badge: string;
    image_url: string;
    specs: string[];
    is_featured: boolean;
    is_active: boolean;
  }>({
    name: "",
    slug: "",
    category: "Active Indoor LED",
    tagline: "",
    badge: "STANDARD",
    image_url: "",
    specs: [""],
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/content?section=products"),
          fetch("/api/admin/content?section=product_categories"),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          setCategories(
            catJson.data.map((c: any) => ({
              id: c.slug || c.id,
              name: c.name,
            }))
          );
        }

        if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
          const normalized: Product[] = prodJson.data.map((p: any) => ({
            id: p.id || p.slug,
            slug: p.slug || p.id,
            name: p.name,
            category: p.category || "Active Indoor LED",
            tagline: p.tagline || "",
            badge: p.badge || (p.is_featured ? "FEATURED" : "STANDARD"),
            image_url: p.image_url || p.img || p.image || "",
            specs: Array.isArray(p.specs)
              ? p.specs.map((s: any) => (typeof s === "string" ? s : s.value || s.label || ""))
              : [],
            is_featured: !!p.is_featured,
            is_active: p.is_active !== false,
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  function openCreateModal() {
    setEditingProduct(null);
    setForm({
      name: "",
      slug: "",
      category: categories[0]?.name || "Active Indoor LED",
      tagline: "",
      badge: "NEW",
      image_url: "/images/products/indoor-smd-page1.jpg",
      specs: ["Commercial-grade display panel", "High brightness & contrast"],
      is_featured: false,
      is_active: true,
    });
    setModalOpen(true);
  }

  function openEditModal(prod: Product) {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      slug: prod.slug || prod.id,
      category: prod.category,
      tagline: prod.tagline || "",
      badge: prod.badge || "",
      image_url: prod.image_url || "",
      specs: prod.specs && prod.specs.length > 0 ? [...prod.specs] : [""],
      is_featured: prod.is_featured,
      is_active: prod.is_active !== false,
    });
    setModalOpen(true);
  }

  function handleSpecChange(index: number, val: string) {
    setForm((f) => {
      const next = [...f.specs];
      next[index] = val;
      return { ...f, specs: next };
    });
  }

  function addSpecField() {
    setForm((f) => ({ ...f, specs: [...f.specs, ""] }));
  }

  function removeSpecField(index: number) {
    setForm((f) => ({
      ...f,
      specs: f.specs.filter((_, i) => i !== index),
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        setForm((f) => ({ ...f, image_url: json.url }));
      } else {
        alert("Upload error: " + (json.error || "Failed to upload image"));
      }
    } catch (err: any) {
      alert("Error: " + (err.message || String(err)));
    } finally {
      setUploadingImage(false);
    }
  }

  function handleModalSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const cleanedSpecs = form.specs.map((s) => s.trim()).filter(Boolean);
    const generatedSlug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: form.name.trim(),
              slug: generatedSlug,
              category: form.category,
              tagline: form.tagline.trim(),
              badge: form.badge.trim(),
              image_url: form.image_url.trim(),
              specs: cleanedSpecs,
              is_featured: form.is_featured,
              is_active: form.is_active,
            }
          : p
      );
    } else {
      const newProd: Product = {
        id: generatedSlug,
        slug: generatedSlug,
        name: form.name.trim(),
        category: form.category,
        tagline: form.tagline.trim(),
        badge: form.badge.trim() || "NEW",
        image_url: form.image_url.trim(),
        specs: cleanedSpecs,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };
      updatedList = [...products, newProd];
    }

    setProducts(updatedList);
    setModalOpen(false);
    // Automatically trigger persist
    persistProducts(updatedList);
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    persistProducts(updated);
  }

  async function persistProducts(list: Product[]) {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSaveSuccess(false);

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "products", data: list }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save products");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            <span>Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#283A97]">Hardware Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Products & Display Solutions</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Edit all display series, specifications, images, categories, and badges shown across the website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/categories"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Layers className="w-4 h-4 text-[#283A97]" /> Manage Categories
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] hover:bg-[#1e2d7a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Product catalog updated and saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#283A97] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter(
              (p) => p.category.toLowerCase().trim() === c.name.toLowerCase().trim()
            ).length;
            const active = selectedCategory.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#283A97] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products & specs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#283A97]" /> Loading products catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500">
          <p className="font-semibold text-neutral-700">No products match your filter</p>
          <p className="text-xs mt-1">Try selecting another category or add a new display series.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className={`bg-white rounded-xl border p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow ${
                prod.is_active === false ? "border-neutral-200 opacity-60" : "border-neutral-200"
              }`}
            >
              <div>
                {/* Image & Header */}
                <div className="flex items-start gap-4 mb-4">
                  {prod.image_url ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-blue-50 text-[#283A97] flex items-center justify-center shrink-0 border border-blue-100">
                      <Monitor className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-[#283A97] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide truncate">
                        {prod.category}
                      </span>
                      {prod.badge && (
                        <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded shrink-0">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 leading-snug">{prod.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{prod.tagline}</p>
                  </div>
                </div>

                {/* Specs List */}
                {prod.specs && prod.specs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Technical Highlights:
                    </p>
                    {prod.specs.slice(0, 3).map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{s}</span>
                      </div>
                    ))}
                    {prod.specs.length > 3 && (
                      <p className="text-[10px] text-neutral-400 italic pl-5">
                        +{prod.specs.length - 3} more specifications
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active in Catalog
                  </span>
                  {prod.is_featured && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#283A97]" /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    href="/products"
                    target="_blank"
                    className="p-1.5 text-neutral-400 hover:text-[#283A97] hover:bg-blue-50 rounded-lg transition-colors"
                    title="View on website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingProduct ? "Edit Product Series" : "Add New Display Product"}
                </h3>
                <p className="text-xs text-neutral-500">Configure specifications, images, and category</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Indoor Active LED Video Wall"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                    placeholder="e.g. Fine Pixel Pitch COB & SMD Display Systems"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="e.g. P1.2 - P3.0 or 4K UHD"
                    className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <div className="w-14 h-14 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-200">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="/images/products/indoor-smd-page1.jpg"
                    className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Specifications Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-xs text-[#283A97] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Specification
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {form.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleSpecChange(index, e.target.value)}
                        placeholder={`Specification #${index + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                      />
                      {form.specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecField(index)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="rounded border-neutral-300 text-[#283A97] focus:ring-[#283A97]"
                  />
                  <span>Feature on Homepage / Highlights</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="rounded border-neutral-300 text-[#283A97] focus:ring-[#283A97]"
                  />
                  <span>Active in Public Catalog</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#283A97] hover:bg-[#1e2d7a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
