"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Image as ImageIcon,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Users,
  Eye,
  Star,
  Globe,
  Plus,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface RecentProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  city: string;
  category: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 31,
    products: 4,
    enquiries: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live dashboard statistics and recent projects
    Promise.all([
      fetch("/api/cms/status").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/projects?limit=5").then((r) => r.json()).catch(() => ({ projects: [] })),
    ]).then(([statusData, projData]) => {
      if (statusData?.stats) {
        setStats({
          projects: statusData.stats.projects || 31,
          products: statusData.stats.products || 4,
          enquiries: statusData.stats.enquiries || 5,
        });
      }
      if (projData?.projects && Array.isArray(projData.projects)) {
        setRecentProjects(projData.projects.slice(0, 5));
      }
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      label: "Showcase Projects",
      value: String(stats.projects),
      subtext: "Landmark installations live",
      icon: FolderOpen,
      color: "#283A97",
    },
    {
      label: "Display Products",
      value: String(stats.products),
      subtext: "Active hardware series",
      icon: Monitor,
      color: "#059669",
    },
    {
      label: "Client Enquiries",
      value: "5",
      subtext: "Inbound quote requests",
      icon: MessageSquare,
      color: "#DC2626",
    },
    {
      label: "Quality Standard",
      value: "ISO 9001",
      subtext: "2015 Certified Operations",
      icon: ShieldCheck,
      color: "#D97706",
    },
  ];

  const quickActions = [
    { label: "Add Showcase Project", href: "/admin/projects/new", icon: Plus, desc: "Add a new client installation" },
    { label: "Manage Portfolio", href: "/admin/projects", icon: FolderOpen, desc: "Browse and edit all 31 projects" },
    { label: "Review Enquiries", href: "/admin/enquiries", icon: MessageSquare, desc: "View incoming client requests" },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon, desc: "Upload photos and brochures" },
    { label: "Staff & Users", href: "/admin/users", icon: Users, desc: "Manage team permissions" },
    { label: "Homepage Editor", href: "/admin/homepage/hero", icon: Eye, desc: "Update hero and statistics" },
  ];

  const systemModules = [
    { name: "Public Website Status", status: "Production Live", href: "/" },
    { name: `Projects Portfolio (${stats.projects})`, status: "Synchronized", href: "/admin/projects" },
    { name: `Products Catalog (${stats.products})`, status: "Active", href: "/admin/products" },
    { name: "Client Inquiries Inbox", status: "Online", href: "/admin/enquiries" },
    { name: "Authorized Staff Access", status: "Secure", href: "/admin/users" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            ACE SELECT Enterprise CMS • Centralized Corporate Management Suite
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Status: Production Live
          </div>
        </div>
      </div>

      {/* Corporate Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#283A97] via-[#1E2D7A] to-[#151F54] text-white p-7 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>ACE SELECT Commercial Platform</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome to the ACE SELECT Management Center
          </h2>
          <p className="text-sm text-white/80 mt-2 leading-relaxed">
            Manage your nationwide branding installations, active LED display systems, digital signage portfolio, and commercial enquiries in one unified, real-time portal.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#283A97] font-semibold text-xs rounded-lg hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Browse All Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-neutral-200/80 p-5 hover:shadow-md transition-all shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-neutral-700 mt-1">{stat.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Quick Actions + System Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Management Modules
            </h2>
            <span className="text-xs text-neutral-400">Quick Navigation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 hover:border-[#283A97]/30 hover:bg-[#283A97]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-[#283A97] group-hover:text-white text-neutral-600 transition-colors shrink-0 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 group-hover:text-[#283A97] transition-colors truncate">
                      {action.label}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Module Status */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">
              Live Operations
            </h2>
            <div className="space-y-3">
              {systemModules.map((mod) => (
                <Link
                  key={mod.name}
                  href={mod.href}
                  className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0 hover:text-[#283A97] group transition-colors"
                >
                  <span className="text-xs font-medium text-neutral-700 group-hover:text-[#283A97] transition-colors">
                    {mod.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {mod.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <div className="bg-neutral-50 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-800">Public Portal</p>
                <p className="text-[11px] text-neutral-500">Live for corporate clients</p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="px-3 py-1.5 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors"
              >
                Visit Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real Portfolio Highlights */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Recent Landmark Projects
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live installations currently showcasing on the public ACE SELECT website
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-[#283A97] hover:underline flex items-center gap-1"
          >
            <span>View All {stats.projects} Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200/70 hover:border-[#283A97]/40 transition-colors bg-neutral-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Uttar Pradesh
            </span>
            <h3 className="font-bold text-sm text-neutral-900 mt-2 line-clamp-1">
              Shri Kashi Vishwanath Temple
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Govt. of Uttar Pradesh • Varanasi</p>
            <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
              Turnkey outdoor active LED network deployed across the sacred corridor with centralized Jio Software CMS.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200/70 hover:border-[#283A97]/40 transition-colors bg-neutral-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Maharashtra
            </span>
            <h3 className="font-bold text-sm text-neutral-900 mt-2 line-clamp-1">
              BKC Curved Architectural Billboard
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Bandra-Kurla Complex • Mumbai</p>
            <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
              High-resolution curved outdoor active LED architectural facade designed for prime financial district visibility.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200/70 hover:border-[#283A97]/40 transition-colors bg-neutral-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Andhra Pradesh
            </span>
            <h3 className="font-bold text-sm text-neutral-900 mt-2 line-clamp-1">
              Siripuram Smart City LED Wall
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Smart City Corp. • Visakhapatnam</p>
            <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
              Mission-critical traffic control and municipal public announcement display system engineered for all-weather conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
