"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Monitor,
  Sun,
  Tablet,
  Cloud,
  Layers,
  Cpu,
  Eye,
  Tv,
  Box,
  Sparkles,
  Plus,
  Save,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  slug?: string;
  name: string;
  icon?: string;
  description: string;
  badge?: string;
  sort_order?: number;
  is_active?: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Sun,
  Tablet,
  Cloud,
  Layers,
  Cpu,
  Eye,
  Tv,
  Box,
  Sparkles,
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "active-indoor-led",
    slug: "active-indoor-led",
    name: "Active Indoor LED",
    icon: "Monitor",
    description: "High-resolution indoor LED video wall solutions for corporate, command center & broadcast environments",
    badge: "Active LED",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "outdoor-led-displays",
    slug: "outdoor-led-displays",
    name: "Outdoor LED Displays",
    icon: "Sun",
    description: "Weather-resistant high-brightness outdoor active LED video displays and highway DOOH billboards",
    badge: "Outdoor",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "digital-standees",
    slug: "digital-standees",
    name: "Digital Standees",
    icon: "Tablet",
    description: "Android & Windows powered commercial digital standees from 32\" to 65\" for retail and bank branches",
    badge: "Standees",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "signage-software",
    slug: "signage-software",
    name: "Signage & Software",
    icon: "Cloud",
    description: "Architectural signage, banking kiosks, and centralized cloud CMS hosted on Jio Software",
    badge: "Software & CMS",
    sort_order: 4,
    is_active: true,
  },
];

export default function AdminProductCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<{
    name: string;
    slug: string;
    icon: string;
    description: string;
    badge: string;
    is_active: boolean;
  }>({
    name: "",
    slug: "",
    icon: "Monitor",
    description: "",
    badge: "Active",
    is_active: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/admin/content?section=product_categories"),
          fetch("/api/admin/content?section=products"),
        ]);
        const catJson = await catRes.json();
        const prodJson = await prodRes.json();

        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          setCategories(catJson.data);
        }
        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        }
      } catch (err: any) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute product count per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      const catKey = (p.category || "").toLowerCase().trim();
      map[catKey] = (map[catKey] || 0) + 1;
    }
    return map;
  }, [products]);

  function getCountForCategory(cat: Category): number {
    const nameKey = (cat.name || "").toLowerCase().trim();
    const slugKey = (cat.slug || cat.id || "").toLowerCase().trim();
    return (productCountMap[nameKey] || 0) + (productCountMap[slugKey] || 0);
  }

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.badge || "").toLowerCase().includes(q)
    );
  }, [categories, search]);

  function openCreateModal() {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      icon: "Monitor",
      description: "",
      badge: "Active Category",
      is_active: true,
    });
    setModalOpen(true);
  }

  function openEditModal(cat: Category) {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug || cat.id,
      icon: cat.icon || "Monitor",
      description: cat.description || "",
      badge: cat.badge || "Active Category",
      is_active: cat.is_active !== false,
    });
    setModalOpen(true);
  }

  function handleModalSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const generatedSlug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: form.name.trim(),
                slug: generatedSlug,
                icon: form.icon,
                description: form.description.trim(),
                badge: form.badge.trim(),
                is_active: form.is_active,
              }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: generatedSlug,
        slug: generatedSlug,
        name: form.name.trim(),
        icon: form.icon,
        description: form.description.trim(),
        badge: form.badge.trim() || "Active Category",
        sort_order: categories.length + 1,
        is_active: form.is_active,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function moveCategory(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const next = [...categories];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setCategories(next.map((c, i) => ({ ...c, sort_order: i + 1 })));
  }

  async function handleSaveAll() {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSaveSuccess(false);

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "product_categories",
          data: categories.map((c, idx) => ({ ...c, sort_order: idx + 1 })),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save product categories");
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            <Link href="/admin/products" className="hover:text-neutral-700 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#283A97]">Category Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Display Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Organize hardware categories, descriptions, specifications and icons shown across the site
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#283A97]" /> Add Category
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#283A97] hover:bg-[#1e2d7a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Product categories successfully updated and synced across the website!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-500 w-full sm:w-auto justify-between sm:justify-end">
          <span>
            Total Categories: <strong className="text-neutral-900">{categories.length}</strong>
          </span>
          <Link
            href="/admin/products"
            className="text-[#283A97] font-semibold hover:underline flex items-center gap-1"
          >
            Manage Products ({products.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#283A97]" /> Loading categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500">
          <p className="font-semibold text-neutral-700">No categories found</p>
          <p className="text-xs mt-1">Try adjusting your search or add a new category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCategories.map((cat, index) => {
            const Icon = ICON_MAP[cat.icon || "Monitor"] || Monitor;
            const count = getCountForCategory(cat);

            return (
              <div
                key={cat.id}
                className={`bg-white rounded-xl border p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                  cat.is_active === false ? "border-neutral-200 opacity-60" : "border-neutral-200"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#283A97] flex items-center justify-center shrink-0 border border-blue-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-neutral-900">{cat.name}</h3>
                        <p className="text-[11px] font-mono text-neutral-400">/{cat.slug || cat.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveCategory(index, "up")}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 hover:bg-neutral-50 rounded"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveCategory(index, "down")}
                        disabled={index === categories.length - 1}
                        title="Move Down"
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 hover:bg-neutral-50 rounded"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mt-3.5 leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {count} {count === 1 ? "Product" : "Products"}
                    </span>
                    {cat.badge && (
                      <span className="text-[11px] font-semibold text-[#283A97] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#283A97]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add / Edit Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-xs text-neutral-500">Set display title, icon, and description</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editingCategory
                        ? f.slug
                        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    }));
                  }}
                  placeholder="e.g. Active Indoor LED"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Slug / URL ID
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="active-indoor-led"
                    className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
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
                    placeholder="e.g. Active LED"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Category Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(ICON_MAP).map((iconName) => {
                    const IconComp = ICON_MAP[iconName];
                    const selected = form.icon === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, icon: iconName }))}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${
                          selected
                            ? "border-[#283A97] bg-blue-50 text-[#283A97] ring-2 ring-[#283A97]/20 font-bold"
                            : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[10px] truncate max-w-full">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Summary of hardware types in this category..."
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-active-check"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="rounded border-neutral-300 text-[#283A97] focus:ring-[#283A97]"
                />
                <label htmlFor="cat-active-check" className="text-xs font-medium text-neutral-700 cursor-pointer">
                  Category is Active and visible across website navigation
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
                  className="px-5 py-2 bg-[#283A97] hover:bg-[#1e2d7a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
