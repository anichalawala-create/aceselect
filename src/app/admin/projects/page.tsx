"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Star,
  StarOff,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  city: string;
  state: string;
  category: string;
  vertical: string;
  hero_image?: string;
  is_featured: boolean;
  is_active: boolean;
  scale?: string;
}

const VERTICALS = ["All", "digital", "signage", "kiosk", "software", "hybrid"];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "non-featured">("all");
  const [selected, setSelected] = useState<string[]>([]);

  function loadProjects() {
    setLoading(true);
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error("Error loading projects:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(search.toLowerCase())) ||
      (p.state && p.state.toLowerCase().includes(search.toLowerCase()));
    const matchVertical = vertical === "All" || p.vertical === vertical;
    const matchFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && p.is_featured) ||
      (featuredFilter === "non-featured" && !p.is_featured);
    return matchSearch && matchVertical && matchFeatured;
  });

  const allSelected = selected.length === filtered.length && filtered.length > 0;

  function toggleAll() {
    setSelected(allSelected ? [] : filtered.map((p) => p.id));
  }

  function toggleOne(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project.");
      }
    } catch {
      alert("Error deleting project.");
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Landmark Projects Portfolio</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {projects.length} verified showcase installations live on the public ACE SELECT portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            className="p-2.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
            title="Refresh projects"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, client, city, or state..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
          >
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v === "All" ? "All Verticals" : v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as "all" | "featured" | "non-featured")}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
          >
            <option value="all">All Projects</option>
            <option value="featured">Featured On Homepage</option>
            <option value="non-featured">Standard Portfolio</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500">
            <div className="w-6 h-6 border-2 border-[#283A97] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading verified portfolio projects...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-500">
            No projects matched your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-neutral-300 text-[#283A97] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5">Project & Location</th>
                  <th className="px-4 py-3.5">Client</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Vertical</th>
                  <th className="px-4 py-3.5 text-center">Featured</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((proj) => {
                  const isChecked = selected.includes(proj.id);
                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-neutral-50/60 transition-colors ${
                        isChecked ? "bg-[#283A97]/5" : ""
                      }`}
                    >
                      <td className="w-10 px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOne(proj.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-[#283A97] cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {proj.hero_image && (
                            <Link
                              href={`/admin/projects/${proj.slug || proj.id}`}
                              className="shrink-0 group/img"
                              title="Edit project"
                            >
                              <img
                                src={proj.hero_image}
                                alt=""
                                className="w-12 h-10 object-cover rounded-md border border-neutral-200 shrink-0 bg-neutral-100 group-hover/img:opacity-85 transition-opacity"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/images/products/indoor-smd-page1.jpg";
                                }}
                              />
                            </Link>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/admin/projects/${proj.slug || proj.id}`}
                              className="font-semibold text-neutral-900 hover:text-[#283A97] transition-colors line-clamp-1 group/title flex items-center gap-1.5"
                            >
                              <span>{proj.title}</span>
                            </Link>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                              <span className="truncate">
                                {proj.city}, {proj.state}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-neutral-800 line-clamp-1">{proj.client}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-neutral-600 line-clamp-1">
                          {proj.category}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                          {proj.vertical}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {proj.is_featured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${proj.slug || proj.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#283A97] hover:bg-[#1e2d7a] rounded-lg transition-colors shadow-xs"
                            title="Edit Project Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <Link
                            href={`/projects/${proj.slug || proj.id}`}
                            target="_blank"
                            className="p-1.5 text-neutral-400 hover:text-[#283A97] rounded-lg hover:bg-neutral-100 transition-colors"
                            title="View on website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(proj.id, proj.title)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{projects.length}</strong> showcase projects
          </span>
          <span className="text-[11px] text-neutral-400">
            Live portfolio synchronized
          </span>
        </div>
      </div>
    </div>
  );
}
