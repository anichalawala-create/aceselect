"use client";

import React, { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/portal/Sidebar";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { MobileHeader } from "@/components/portal/MobileHeader";
import { MobileBottomNav } from "@/components/portal/MobileBottomNav";
import { MobileMoreDrawer } from "@/components/portal/MobileMoreDrawer";
import { MobileDeviceSimulator } from "@/components/portal/MobileDeviceSimulator";
import { Smartphone, Sparkles } from "lucide-react";

function subscribe() {
  return () => {};
}

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/client-portal";
  const isDemoPage = pathname === "/client-portal/demo";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState(false);

  const isEmbedded = useSyncExternalStore(
    subscribe,
    () => typeof window !== "undefined" && window.self !== window.top,
    () => false
  );

  // Dedicated demo presentation page handles its own layout
  if (isDemoPage) {
    return <>{children}</>;
  }

  // Determine if current mobile view is a detail page needing a Back button
  let backHref: string | undefined = undefined;
  if (pathname.startsWith("/client-portal/projects/") && pathname !== "/client-portal/projects") {
    backHref = "/client-portal/projects";
  } else if (pathname.startsWith("/client-portal/sites/") && pathname !== "/client-portal/sites") {
    backHref = "/client-portal/sites";
  } else if (pathname.startsWith("/client-portal/approvals/") && pathname !== "/client-portal/approvals") {
    backHref = "/client-portal/approvals";
  }

  // 1. If embedded inside the iPhone Simulator iframe, render the pure mobile shell
  if (isEmbedded) {
    if (isLoginPage) {
      return <div className="bg-[#0B0F2B] min-h-screen">{children}</div>;
    }

    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-[#0B0D12] font-body">
        <MobileHeader
          backHref={backHref}
          onOpenMenu={() => setMoreDrawerOpen(true)}
        />
        <main className="flex-1 p-3.5 pb-20 overflow-y-auto no-scrollbar">
          {children}
        </main>
        <MobileBottomNav
          onOpenMore={() => setMoreDrawerOpen(true)}
          pendingApprovalsCount={18}
        />
        <MobileMoreDrawer
          isOpen={moreDrawerOpen}
          onClose={() => setMoreDrawerOpen(false)}
        />
      </div>
    );
  }

  // 2. Normal Login Page View
  if (isLoginPage) {
    return (
      <>
        {children}
        {/* Floating Demo Trigger on Login Page */}
        <Link
          href="/client-portal/demo"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-[#283A97] hover:bg-[#1f2d77] text-white rounded-full text-xs font-display font-bold uppercase tracking-wider shadow-[0_10px_25px_rgba(40,58,151,0.5)] border border-blue-400/40 flex items-center gap-2 group transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Launch Client Demo Suite</span>
        </Link>
      </>
    );
  }

  // 3. Full-Screen Simulator Mode Overlay
  if (simulatorMode) {
    return <MobileDeviceSimulator onClose={() => setSimulatorMode(false)} />;
  }

  // 4. Default Responsive Desktop / Mobile Application Shell
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex text-[#0B0D12] font-body selection:bg-[#283A97] selection:text-white">
      {/* Permanent Desktop Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Dedicated Desktop Header */}
        <div className="hidden lg:block relative">
          <PortalHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          {/* Quick Simulator Switch Button */}
          <button
            type="button"
            onClick={() => setSimulatorMode(true)}
            className="absolute right-52 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-50 border border-blue-200 text-[#283A97] rounded-full text-[11px] font-display font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Preview dedicated mobile app experience in iPhone 15 Pro simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Preview</span>
          </button>
        </div>

        {/* Dedicated Mobile Header (Only on small viewports) */}
        <div className="lg:hidden">
          <MobileHeader
            backHref={backHref}
            onOpenMenu={() => setMoreDrawerOpen(true)}
          />
        </div>

        {/* Page Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Dedicated Mobile Bottom Navigation (Only on small viewports) */}
        <MobileBottomNav
          onOpenMore={() => setMoreDrawerOpen(true)}
          pendingApprovalsCount={18}
        />

        {/* Mobile Slide-Up Menu Drawer */}
        <MobileMoreDrawer
          isOpen={moreDrawerOpen}
          onClose={() => setMoreDrawerOpen(false)}
        />

        {/* Floating Quick Demo Trigger for Client Presentations */}
        <Link
          href="/client-portal/demo"
          className="hidden sm:flex fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-[#283A97] hover:bg-[#1f2d77] text-white rounded-full text-xs font-display font-bold uppercase tracking-wider shadow-[0_10px_25px_rgba(40,58,151,0.4)] border border-blue-400/40 items-center gap-2 group transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Client Demo Suite</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </Link>
      </div>
    </div>
  );
}
