"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Smartphone,
  Monitor,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Globe,
  Menu,
  X,
  Phone,
  Mail,
} from "lucide-react";

const WEBSITE_NAV_LINKS = [
  {
    title: "Homepage",
    href: "/",
    desc: "Main brand experience, PAN-India presence, interactive marquee",
    badge: "Home",
  },
  {
    title: "Who We Are",
    href: "/who-we-are",
    desc: "Leadership, infrastructure, 20+ years heritage & client trust",
    badge: "About",
  },
  {
    title: "Capabilities & Services",
    href: "/services",
    desc: "Turnkey signage, architectural retail fixtures, wayfinding & lighting",
    badge: "Services",
  },
  {
    title: "Projects & Portfolio",
    href: "/projects",
    desc: "Pan-India flagship stores, bank rollouts, commercial complexes",
    badge: "Case Studies",
  },
  {
    title: "Industries Served",
    href: "/industries",
    desc: "Retail, BFSI, Healthcare, Automobile, Hospitality, Real Estate",
    badge: "Sectors",
  },
  {
    title: "Insights & Knowledge",
    href: "/insights",
    desc: "Signage engineering, architectural compliance, implementation guides",
    badge: "Articles",
  },
  {
    title: "Client Portal ERP",
    href: "/client-portal/dashboard",
    desc: "Enterprise client tracking, recce logs, approval queue, documents",
    badge: "Portal",
  },
  {
    title: "Contact & Schedule Recce",
    href: "/contact",
    desc: "Get an enterprise quote or schedule a site recce consultation",
    badge: "Inquiry",
  },
];

export interface ScreenInfo {
  id: string;
  name: string;
  title: string;
  path: string;
  category: "Auth" | "Core" | "Operations" | "Decisions" | "Assets";
  summary: string;
  businessValue: string;
  keyFeatures: string[];
  interactiveTip: string;
}

export const DEMO_SCREENS: ScreenInfo[] = [
  {
    id: "01",
    name: "01 Login",
    title: "Enterprise Client Authentication",
    path: "/client-portal",
    category: "Auth",
    summary: "Secure biometric and single sign-on entry point for brand heads and retail operations teams.",
    businessValue: "Multi-tenant enterprise access with role-based permissions and ISO 9001:2015 audit trails.",
    keyFeatures: [
      "1-Click Demo Credential Auto Fill",
      "Architectural Brand Backdrop with dynamic contrast",
      "Encrypted enterprise credential validation",
      "Direct session persistence to active project dashboard",
    ],
    interactiveTip: "Click 'Auto Fill' and then 'SIGN IN →' to launch directly into the mobile experience.",
  },
  {
    id: "02",
    name: "02 Dashboard",
    title: "Executive Mobile Command Center",
    path: "/client-portal/dashboard",
    category: "Core",
    summary: "At-a-glance status across all nationwide projects, sites, pending sign-offs, and completions.",
    businessValue: "C-level and operational visibility without manual status calls or messy email spreadsheets.",
    keyFeatures: [
      "2x2 High-Density Metric Grid (06 Projects, 42 Sites, 18 Approvals, 37 Completed)",
      "Active Projects overview with completion bars and ON TRACK chips",
      "Real-time site inspection activity log with relative timestamps",
      "Interactive Site Status distribution breakdown",
    ],
    interactiveTip: "Notice the 2x2 metric cards and bottom navigation bar with active badge indicators.",
  },
  {
    id: "03",
    name: "03 Projects",
    title: "Portfolio Rollout Directory",
    path: "/client-portal/projects",
    category: "Core",
    summary: "Unified list of ongoing brand programs across India with live completion meters.",
    businessValue: "Instant status monitoring across multiple retail campaigns, flagship re-brandings, and bank branches.",
    keyFeatures: [
      "Quick status filter pills: All, In Progress, On Track, Delayed",
      "'+' New Project Request trigger for client brand managers",
      "Live progress percentage meters with color-coded status chips",
      "Brand thumbnails with site counts and project codes",
    ],
    interactiveTip: "Tap on 'Retail Rollout — North India' to dive into the 6-stage engineering timeline.",
  },
  {
    id: "04",
    name: "04 Project Detail",
    title: "6-Stage Engineering & Rollout Roadmap",
    path: "/client-portal/projects/ACE-2026-014",
    category: "Operations",
    summary: "Deep-dive view into milestone progression from site recce to final store handover.",
    businessValue: "Eliminates project ambiguity by mapping every deliverable to audited stage gates.",
    keyFeatures: [
      "Vertical 6-Stage Milestone Tracker (Recce, Concept, Engineering, Production, Installation, Handover)",
      "Multi-store regional distribution across North India",
      "Direct team escalation contact for project managers",
      "Quick links to drawings, site photos, and technical BOQ",
    ],
    interactiveTip: "Scroll through the vertical milestone timeline to see completed vs in-progress stages.",
  },
  {
    id: "05",
    name: "05 Sites",
    title: "Pan-India Location Registry",
    path: "/client-portal/sites",
    category: "Operations",
    summary: "Geographical registry of all 42 store sites with state, city, and inspection status.",
    businessValue: "Complete operational tracking for retail store expansion teams across tier 1, 2, and 3 cities.",
    keyFeatures: [
      "Search-by-store-code and instant filter pills",
      "Multi-state filter: All, Rajasthan, Maharashtra, Delhi NCR, Karnataka",
      "Site cards with high-res store front photo and photo counters",
      "Color-coded status badges: In Progress, Completed, Inspection",
    ],
    interactiveTip: "Tap on 'Jaipur Store 01' to inspect the photo gallery and punch list.",
  },
  {
    id: "06",
    name: "06 Site Detail",
    title: "Store Recce & Photo Inspection Gallery",
    path: "/client-portal/sites/SITE-101",
    category: "Operations",
    summary: "Comprehensive site punch list, high-resolution photo slider, and geo-tagged inspection records.",
    businessValue: "Enables corporate quality assurance without requiring senior management to travel to remote stores.",
    keyFeatures: [
      "High-res store facade photo slider with '1/12' live counter",
      "Interactive QA Inspection checklist with passed status chips",
      "GPS coordinates, store manager contacts, and square footage specs",
      "Direct action buttons to request recce re-audit or upload drawings",
    ],
    interactiveTip: "Inspect the photo counter and QA punch list for the flagship Jaipur store.",
  },
  {
    id: "07",
    name: "07 Approvals",
    title: "Executive Approval Queue",
    path: "/client-portal/approvals",
    category: "Decisions",
    summary: "Priority queue of pending artwork, structural shop drawings, and material sample sign-offs.",
    businessValue: "Reduces approval turnaround time from an industry average of 4.2 days down to under 4 hours.",
    keyFeatures: [
      "Pending (18) badge filter for urgent action items",
      "Approval cards with visual preview, submission date, and reviewer",
      "Urgency indicators (Days remaining before factory production freeze)",
      "Direct 'Review →' action button leading to decision sheet",
    ],
    interactiveTip: "Tap 'Review →' on the Exterior Signage Artwork item to experience the sign-off workflow.",
  },
  {
    id: "08",
    name: "08 Approval Detail",
    title: "Interactive Artwork Sign-Off & Revisions",
    path: "/client-portal/approvals/APP-501",
    category: "Decisions",
    summary: "Full-fidelity vector artwork review with interactive Approve and Request Modification actions.",
    businessValue: "Legally binding electronic approvals with audit timestamps prevent costly fabrication errors.",
    keyFeatures: [
      "High-res asset preview with version comparison (v2.1 vs v2.0)",
      "Sticky bottom decision action bar (Approve vs Request Changes)",
      "Audit log with client comments and fabrication specs",
      "Instant real-time state update on approval or revision submission",
    ],
    interactiveTip: "Tap the green 'Approve Artwork' or 'Request Changes' button to see the live feedback loop.",
  },
  {
    id: "09",
    name: "09 Updates",
    title: "Real-Time Field Activity Stream",
    path: "/client-portal/updates",
    category: "Operations",
    summary: "Chronological feed of verified field milestones, site photos, and supervisor comments.",
    businessValue: "Total transparency between factory production floors, installation crews, and client leadership.",
    keyFeatures: [
      "Project & Site filter selector dropdowns",
      "Time-stamped audit entries (e.g. 'Site survey uploaded', 'Production started')",
      "Photo attachment grid with zoom previews",
      "Supervisor notes and verification badges",
    ],
    interactiveTip: "Filter by project to isolate updates for specific rollout campaigns.",
  },
  {
    id: "10",
    name: "10 Documents",
    title: "Secure Enterprise Document Vault",
    path: "/client-portal/documents",
    category: "Assets",
    summary: "Centralized repository for CAD drawings, BOQs, structural engineering certifications, and invoices.",
    businessValue: "Never lose a compliance certificate, architectural DWG, or tax invoice during audits.",
    keyFeatures: [
      "Category tabs: All, Drawings, BOQ, Compliance, Invoices",
      "File metadata: Format (.DWG, .PDF, .XLSX), file size, and upload date",
      "Instant 1-tap view and download actions",
      "Version controlled repository with security tags",
    ],
    interactiveTip: "Switch between category tabs to see categorized engineering drawings and financial BOQs.",
  },
];

interface MobileDeviceSimulatorProps {
  initialScreenId?: string;
  onClose?: () => void;
}

export function MobileDeviceSimulator({
  initialScreenId = "02",
  onClose,
}: MobileDeviceSimulatorProps) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(() => {
    const idx = DEMO_SCREENS.findIndex((s) => s.id === initialScreenId);
    return idx >= 0 ? idx : 1; // default to Dashboard (02)
  });

  const [deviceTheme, setDeviceTheme] = useState<"titanium" | "black" | "blue">("titanium");
  const [presentationMode, setPresentationMode] = useState<"dual" | "phone">("dual");
  const [scale, setScale] = useState<"fit" | "100" | "85" | "75">("fit");
  const [iframeKey, setIframeKey] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScreen = DEMO_SCREENS[currentScreenIndex];

  const handleSelectScreen = (index: number) => {
    setCurrentScreenIndex(index);
    setIsIframeLoading(true);
  };

  const handleNext = () => {
    if (currentScreenIndex < DEMO_SCREENS.length - 1) {
      handleSelectScreen(currentScreenIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreenIndex > 0) {
      handleSelectScreen(currentScreenIndex - 1);
    }
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setIsIframeLoading(true);
  };

  // Device color themes
  const themeStyles = {
    titanium: {
      outer: "bg-gradient-to-b from-[#3a3d42] via-[#24272c] to-[#1a1b1e] border-[#555a64]",
      rim: "border-[#40444c]",
      glare: "from-white/15 to-transparent",
    },
    black: {
      outer: "bg-gradient-to-b from-[#1f2022] via-[#141517] to-[#0a0a0b] border-[#2e3034]",
      rim: "border-[#1c1d1f]",
      glare: "from-white/10 to-transparent",
    },
    blue: {
      outer: "bg-gradient-to-b from-[#1e2746] via-[#131b34] to-[#0d1222] border-[#2a3861]",
      rim: "border-[#1e2746]",
      glare: "from-blue-400/20 to-transparent",
    },
  };

  const currentTheme = themeStyles[deviceTheme];

  // Scale calculations for responsive viewport fit
  const getScaleStyle = () => {
    if (scale === "100") return { transform: "scale(1)", transformOrigin: "top center" };
    if (scale === "85") return { transform: "scale(0.85)", transformOrigin: "top center" };
    if (scale === "75") return { transform: "scale(0.75)", transformOrigin: "top center" };
    // "fit": dynamic calculation for typical 580px - 750px window heights
    return {
      transform: "scale(min(1, calc((100vh - 170px) / 852)))",
      transformOrigin: "top center",
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F2B] text-white flex flex-col font-body overflow-hidden select-none">
      {/* ============================================================== */}
      {/* 1. TOP EXECUTIVE CONTROL BAR                                   */}
      {/* ============================================================== */}
      <header className="h-16 px-4 sm:px-6 bg-[#0E1338]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 z-50">
        {/* Left: Brand & Demo Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#283A97] border border-blue-400/40 flex items-center justify-center font-display font-black text-xs text-white shadow-[0_0_15px_rgba(40,58,151,0.5)]">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm tracking-wider uppercase text-white">
                  ACE SELECT
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Mobile Preview
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-body">
                Client Demo • 10-Screen Enterprise Suite
              </p>
            </div>
          </div>
        </div>

        {/* Center: Presentation Mode Toggle + Screen Stepper */}
        <div className="hidden md:flex items-center gap-3">
          {/* Stepper buttons */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={handlePrev}
              disabled={currentScreenIndex === 0}
              className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Previous Screen"
              aria-label="Previous screen"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="text-xs font-mono font-bold px-2.5 text-blue-300">
              {currentScreenIndex + 1} / {DEMO_SCREENS.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentScreenIndex === DEMO_SCREENS.length - 1}
              className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Next Screen"
              aria-label="Next screen"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setPresentationMode("dual")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                presentationMode === "dual"
                  ? "bg-[#283A97] text-white shadow-sm font-semibold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dual Presentation</span>
            </button>
            <button
              onClick={() => setPresentationMode("phone")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                presentationMode === "phone"
                  ? "bg-[#283A97] text-white shadow-sm font-semibold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Focus</span>
            </button>
          </div>

          {/* Scale Control */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-[11px] font-mono">
            {(["fit", "100", "85", "75"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2 py-1 rounded transition-colors ${
                  scale === s
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {s === "fit" ? "Fit" : `${s}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions & Exit */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Frame */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
            title="Reload Screen"
            aria-label="Reload current mobile screen"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIframeLoading ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* Theme selector */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setDeviceTheme("titanium")}
              className={`w-4 h-4 rounded-full bg-neutral-400 border ${
                deviceTheme === "titanium" ? "ring-2 ring-blue-400 border-white" : "border-transparent"
              }`}
              title="Natural Titanium"
              aria-label="Titanium frame"
            />
            <button
              onClick={() => setDeviceTheme("black")}
              className={`w-4 h-4 rounded-full bg-neutral-900 border ${
                deviceTheme === "black" ? "ring-2 ring-blue-400 border-white" : "border-neutral-700"
              }`}
              title="Space Black"
              aria-label="Black frame"
            />
            <button
              onClick={() => setDeviceTheme("blue")}
              className={`w-4 h-4 rounded-full bg-[#1e2746] border ${
                deviceTheme === "blue" ? "ring-2 ring-blue-400 border-white" : "border-neutral-700"
              }`}
              title="Deep Blue"
              aria-label="Blue frame"
            />
          </div>

          {/* 3-line option on navigation bar to drive into website */}
          <button
            type="button"
            onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/25 hover:bg-blue-500/40 text-white border border-blue-400/40 rounded-lg text-xs font-display font-semibold transition-all active:scale-95 shadow-sm"
            aria-label="3-line navigation menu to drive into website"
            aria-expanded={websiteMenuOpen}
          >
            {websiteMenuOpen ? (
              <X className="w-3.5 h-3.5 text-cyan-300" />
            ) : (
              <Menu className="w-3.5 h-3.5 text-cyan-300" />
            )}
            <span className="hidden sm:inline">Drive into Website</span>
            <span className="sm:hidden">Website</span>
          </button>

          {/* Exit to Desktop Portal */}
          {onClose ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-display font-semibold transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop ERP View</span>
            </button>
          ) : (
            <Link
              href="/client-portal/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-display font-semibold transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </Link>
          )}
        </div>
      </header>

      {/* ============================================================== */}
      {/* DRIVE INTO WEBSITE SLIDE-OVER DRAWER MENU                      */}
      {/* ============================================================== */}
      {websiteMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-[#0B0F2B]/95 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setWebsiteMenuOpen(false)}
          />
          <div className="w-full max-w-md bg-[#0E1338] border-l border-white/15 h-[calc(100vh-64px)] flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="font-display font-black text-xs uppercase tracking-widest text-cyan-300">
                      ACE SELECT NETWORK
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mt-1">
                    Drive into Website
                  </h3>
                  <p className="text-xs text-white/60">
                    Jump directly to any website section or case study
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWebsiteMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {WEBSITE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setWebsiteMenuOpen(false)}
                    className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-blue-400/40 flex items-center justify-between transition-all group"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {link.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-blue-300 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Contact / Direct Help */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0B0F2B]/60 space-y-3">
              <Link
                href="/contact"
                onClick={() => setWebsiteMenuOpen(false)}
                className="w-full py-3 bg-[#283A97] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>GET A QUOTE / RFQ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                <a
                  href="tel:+918452942177"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>+91 84529 42177</span>
                </a>
                <a
                  href="mailto:info@aceselect.in"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>info@aceselect.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. 10-SCREEN INTERACTIVE SCROLLABLE PILL NAVIGATOR             */}
      {/* ============================================================== */}
      <div className="bg-[#0B0F2B]/90 border-b border-white/10 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-400" /> Screens:
        </span>
        {DEMO_SCREENS.map((screen, idx) => {
          const isActive = idx === currentScreenIndex;
          return (
            <button
              key={screen.id}
              onClick={() => handleSelectScreen(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-display tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-[#283A97] text-white font-bold shadow-[0_0_12px_rgba(40,58,151,0.5)] border border-blue-400/50"
                  : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-cyan-300 animate-pulse" : "bg-white/30"}`} />
              <span>{screen.name}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN STAGE: IPHONE 15 PRO + OPTIONAL PRESENTATION DECK      */}
      {/* ============================================================== */}
      <main
        ref={containerRef}
        className="flex-1 overflow-hidden relative flex items-center justify-center p-3 sm:p-6"
      >
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-radial from-blue-900/15 via-transparent to-transparent pointer-events-none" />

        <div
          className={`w-full h-full max-w-[1500px] mx-auto flex items-center justify-center gap-8 lg:gap-12 transition-all duration-500`}
        >
          {/* ---------------------------------------------------------- */}
          {/* LEFT / CENTER: ULTRA-REALISTIC IPHONE 15 PRO DEVICE FRAME  */}
          {/* ---------------------------------------------------------- */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div style={getScaleStyle()} className="transition-transform duration-300">
              {/* Physical Exterior Phone Casing */}
              <div
                className={`relative w-[393px] h-[852px] rounded-[54px] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] border-[4px] ${currentTheme.outer} ${currentTheme.rim}`}
              >
                {/* Physical Hardware Buttons on Rim */}
                {/* Left: Action Button */}
                <div className="absolute -left-[7px] top-[115px] w-[4px] h-[26px] bg-neutral-600 rounded-l-xs shadow-xs" />
                {/* Left: Volume Up */}
                <div className="absolute -left-[7px] top-[158px] w-[4px] h-[48px] bg-neutral-600 rounded-l-xs shadow-xs" />
                {/* Left: Volume Down */}
                <div className="absolute -left-[7px] top-[218px] w-[4px] h-[48px] bg-neutral-600 rounded-l-xs shadow-xs" />
                {/* Right: Power / Siri Button */}
                <div className="absolute -right-[7px] top-[175px] w-[4px] h-[72px] bg-neutral-600 rounded-r-xs shadow-xs" />

                {/* Inner Screen Display (393 x 852 Viewport) */}
                <div className="relative w-full h-full bg-[#F7F8FA] rounded-[44px] overflow-hidden flex flex-col shadow-inner select-auto">
                  {/* Dynamic Island Pill with Camera & Sensor */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[122px] h-[34px] bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-md pointer-events-none">
                    {/* Front Camera Lens */}
                    <div className="w-3 h-3 rounded-full bg-[#0a0d16] border border-neutral-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-950/60" />
                    </div>
                    {/* Ambient Sensor */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>

                  {/* Simulated iOS Top Status Bar */}
                  <div className="h-11 bg-white border-b border-neutral-100 flex items-end justify-between px-7 pb-1 text-[11px] font-bold text-neutral-900 shrink-0 z-40 select-none">
                    <span className="font-semibold tracking-tight">9:41</span>
                    <div className="flex items-center gap-1.5 text-neutral-800">
                      {/* Cellular 4-bars */}
                      <div className="flex items-end gap-0.5 h-2.5">
                        <div className="w-0.5 h-1 bg-neutral-800 rounded-xs" />
                        <div className="w-0.5 h-1.5 bg-neutral-800 rounded-xs" />
                        <div className="w-0.5 h-2 bg-neutral-800 rounded-xs" />
                        <div className="w-0.5 h-2.5 bg-neutral-800 rounded-xs" />
                      </div>
                      <span className="text-[10px] font-bold">5G</span>
                      {/* Battery Icon */}
                      <div className="w-5 h-2.5 rounded-[3px] border border-neutral-800 p-0.5 flex items-center">
                        <div className="w-full h-full bg-emerald-600 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Live Interactive Iframe Loading the Screen */}
                  <div className="flex-1 w-full relative bg-[#F7F8FA] overflow-hidden">
                    {isIframeLoading && (
                      <div className="absolute inset-0 bg-[#F7F8FA] flex flex-col items-center justify-center gap-3 z-30">
                        <div className="w-7 h-7 border-2 border-[#283A97] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-display font-semibold text-neutral-500">
                          Loading {activeScreen.name}...
                        </span>
                      </div>
                    )}
                    <iframe
                      key={`${iframeKey}-${activeScreen.path}`}
                      src={activeScreen.path}
                      title={activeScreen.title}
                      onLoad={() => setIsIframeLoading(false)}
                      className="w-full h-full border-0 select-auto"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="h-5 bg-white shrink-0 flex items-center justify-center relative z-40 select-none">
                    <div className="w-36 h-1 bg-neutral-300 rounded-full" />
                  </div>
                </div>

                {/* Glass screen reflection shine */}
                <div
                  className={`absolute inset-0 rounded-[50px] bg-gradient-to-tr ${currentTheme.glare} pointer-events-none`}
                />
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT: EXECUTIVE CLIENT DEMO INTEL & VALUE PROPOSITION     */}
          {/* ---------------------------------------------------------- */}
          {presentationMode === "dual" && (
            <div className="hidden lg:flex flex-col flex-1 max-w-xl h-full max-h-[820px] bg-[#0E1338]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 overflow-y-auto no-scrollbar shadow-2xl justify-between">
              <div>
                {/* Screen Category Tag + Index */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Screen {activeScreen.id} of {DEMO_SCREENS.length} • {activeScreen.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>ISO 9001:2015 Audited</span>
                  </div>
                </div>

                {/* Screen Headline */}
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                  {activeScreen.title}
                </h2>

                <p className="text-sm text-white/80 font-body mt-3 leading-relaxed">
                  {activeScreen.summary}
                </p>

                {/* Business Value Highlight Box */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-blue-950/20 to-transparent border-l-4 border-blue-400 border-y border-r border-white/5">
                  <div className="text-[10px] font-display font-bold uppercase tracking-widest text-blue-300 mb-1">
                    ENTERPRISE BUSINESS IMPACT
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {activeScreen.businessValue}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-[11px] font-display font-bold uppercase tracking-wider text-white/50">
                    DEMONSTRATED ARCHITECTURAL CAPABILITIES
                  </div>
                  {activeScreen.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/85">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Demo Tip */}
                <div className="mt-6 p-3.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-display font-bold uppercase tracking-wider text-cyan-300 block">
                      TRY IT ON THE PHONE:
                    </span>
                    <p className="text-xs text-white/80 mt-0.5">
                      {activeScreen.interactiveTip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Client Profile & Next Button */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-display font-bold tracking-widest text-white/40 block">
                    ACTIVE CLIENT DEMO CONTEXT
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    Sunil Deshmukh • Head of National ATM Infrastructure
                  </p>
                  <p className="text-[11px] text-blue-300 font-medium">
                    Hitachi Payment Services (ACE-2026-002) • 340 Active Sites
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentScreenIndex === DEMO_SCREENS.length - 1}
                  className="px-4 py-2.5 bg-[#283A97] hover:bg-[#354bb8] disabled:opacity-40 text-white rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <span>Next Screen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
