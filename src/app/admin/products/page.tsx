"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Monitor, Plus, CheckCircle2, Star, ExternalLink, Cpu } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  badge: string;
  specs: string[];
  is_featured: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "indoor-active-led",
    name: "Indoor Active LED Video Wall",
    category: "Active Indoor LED",
    tagline: "Fine Pixel Pitch COB & SMD Display Systems",
    badge: "P1.2 - P3.0",
    specs: [
      "COB & SMD Fine Pixel Pitch (P1.2 to P3.0)",
      "High refresh rate >3840Hz & 16-bit grayscale",
      "160° ultra-wide horizontal & vertical viewing",
    ],
    is_featured: true,
  },
  {
    id: "outdoor-active-led",
    name: "Outdoor High-Brightness LED Display",
    category: "Outdoor LED Displays",
    tagline: "IP65 Weather-Resistant DOOH Advertising Facades",
    badge: ">6000 NITS",
    specs: [
      ">6000 Nits high-brightness daylight readable",
      "IP65 waterproof all-weather die-cast cabinet",
      "ECO energy-saving low heat dissipation IC",
    ],
    is_featured: true,
  },
  {
    id: "digital-standees",
    name: "Commercial Digital Standee Displays",
    category: "Digital Standees",
    tagline: "Standalone Android 4K UHD Interactive Kiosks",
    badge: "4K UHD",
    specs: [
      "32\" to 65\" commercial-grade 4K UHD panels",
      "4mm tempered explosion-proof protective glass",
      "Android OS / Windows plug & play media engine",
    ],
    is_featured: true,
  },
  {
    id: "signage-software",
    name: "Architectural Signage & Wayfinding Solutions",
    category: "Signage & Software",
    tagline: "Precision Stainless Steel, Pylons & Cloud CMS",
    badge: "SEAMLESS",
    specs: [
      "Precision CNC & Laser Cut Stainless Steel 304/316",
      "Centralized cloud CMS hosted on Jio Software",
      "Mission-critical 24/7 control room & banking kiosk reliability",
    ],
    is_featured: true,
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/admin/content?section=products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized: Product[] = json.data.map((p: any) => ({
            id: p.id || p.slug,
            name: p.name,
            category: p.category || "Active LED",
            tagline: p.tagline || "",
            badge: p.badge || (p.is_featured ? "FEATURED" : "STANDARD"),
            specs: Array.isArray(p.specs)
              ? p.specs.map((s: any) => (typeof s === "string" ? s : s.value || s.label || ""))
              : [],
            is_featured: !!p.is_featured,
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Products & Display Solutions</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Active OEM LED hardware series, digital standees, and signage specifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/categories"
            className="px-3.5 py-2 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#283A97] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide">
                  {prod.category}
                </span>
                <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                  {prod.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">{prod.name}</h3>
              <p className="text-xs text-neutral-500 mt-1">{prod.tagline}</p>

              <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Specifications:</p>
                {prod.specs.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active in Catalog
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-xs text-[#283A97] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View on Website</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
