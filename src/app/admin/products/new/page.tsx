"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Plus, Upload, X, CheckCircle2 } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "active-indoor-led", name: "Active Indoor LED" },
  { id: "outdoor-led-displays", name: "Outdoor LED Displays" },
  { id: "digital-standees", name: "Digital Standees" },
  { id: "signage-software", name: "Signage & Software" },
];

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Active Indoor LED");
  const [tagline, setTagline] = useState("");
  const [badge, setBadge] = useState("NEW");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<string[]>([""]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/content?section=product_categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const list = json.data.map((c: any) => ({
            id: c.slug || c.id,
            name: c.name,
          }));
          setCategories(list);
          if (list[0]) setCategory(list[0].name);
        }
      } catch (e) {
        console.warn("Could not load categories:", e);
      }
    }
    loadCategories();
  }, []);

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
        setImageUrl(json.url);
      } else {
        alert("Upload error: " + (json.error || "Failed to upload image"));
      }
    } catch (err: any) {
      alert("Error: " + (err.message || String(err)));
    } finally {
      setUploadingImage(false);
    }
  }

  function handleSpecChange(index: number, val: string) {
    setSpecs((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  function addSpecField() {
    setSpecs((prev) => [...prev, ""]);
  }

  function removeSpecField(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const cleanedSpecs = specs.map((s) => s.trim()).filter(Boolean);

      const newProduct = {
        id: slug,
        name: name.trim(),
        slug,
        category,
        tagline: tagline.trim(),
        badge: badge.trim() || "NEW",
        image_url: imageUrl.trim() || "/images/products/indoor-smd-page1.jpg",
        description: description.trim(),
        specs: cleanedSpecs.length > 0 ? cleanedSpecs : [tagline.trim() || name.trim()],
        is_featured: isFeatured,
        is_active: true,
      };

      // Fetch existing products to append
      const existingRes = await fetch("/api/admin/content?section=products");
      const existingJson = await existingRes.json();
      const existingList = Array.isArray(existingJson.data) ? existingJson.data : [];
      const updatedList = [...existingList, newProduct];

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "products", data: updatedList }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save new product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      alert("Error adding product: " + (err.message || String(err)));
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Add New Display Product</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Publish a new display series to the ACE SELECT product line</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Product Series Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fine Pitch COB Ultra-Series"
            required
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 4K High Refresh Rate Commercial Display"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Badge / Specification Tag
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. P1.2 - P3.0 or >6000 NITS"
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-neutral-300 text-[#283A97] focus:ring-[#283A97]"
              />
              <span>Feature on Homepage and Product Highlights</span>
            </label>
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Product Image
          </label>
          <div className="flex items-center gap-3">
            {imageUrl && (
              <div className="w-14 h-14 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-200">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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
              Technical Specifications
            </label>
            <button
              type="button"
              onClick={addSpecField}
              className="text-xs text-[#283A97] font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Spec
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecChange(index, e.target.value)}
                  placeholder={`e.g. Ultra high refresh rate >3840Hz & 16-bit grayscale`}
                  className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
                {specs.length > 1 && (
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

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
            Technical Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed optical and electrical engineering description..."
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none"
          />
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-semibold rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
