"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  CheckSquare,
  Clock,
  FileText,
  PhoneCall,
  X,
} from "lucide-react";
import { approvalService } from "@/services/approvalService";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/client-portal/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/client-portal/projects", icon: Briefcase },
  { label: "Sites", href: "/client-portal/sites", icon: MapPin },
  { label: "Approvals", href: "/client-portal/approvals", icon: CheckSquare, badgeKey: "approvals" },
  { label: "Updates", href: "/client-portal/updates", icon: Clock },
  { label: "Documents", href: "/client-portal/documents", icon: FileText },
  { label: "Contact", href: "/client-portal/contact", icon: PhoneCall },
];

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(3);

  useEffect(() => {
    approvalService.getPendingCount().then(setPendingApprovalsCount);
  }, [pathname]);

  const sidebarContent = (
    <aside className="w-64 bg-[#0B0F2B] text-white flex flex-col justify-between h-full min-h-screen border-r border-[#192561] select-none">
      <div>
        {/* Logo / Header */}
        <div className="p-6 pb-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/client-portal/dashboard" className="block group">
            <div className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              <span>ACE</span>
              <span className="text-solvorry-light">SELECT</span>
            </div>
            <div className="text-[9px] font-display font-bold uppercase tracking-[0.25em] text-white/50 mt-0.5">
              CLIENT PORTAL
            </div>
          </Link>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden text-white/60 hover:text-white p-1"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5" aria-label="Portal Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/client-portal/dashboard"
                ? pathname === "/client-portal/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center justify-between px-4 py-3 rounded-[6px] text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 group ${
                  isActive
                    ? "bg-[#283A97] text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-white/60 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeKey === "approvals" && pendingApprovalsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-display font-bold flex items-center justify-center">
                    {pendingApprovalsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Editorial Visual Card & Copyright */}
      <div className="p-4 mt-auto">
        <div className="relative rounded-[6px] overflow-hidden aspect-[4/3] w-full mb-4 border border-white/10 group shadow-md">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop"
            alt="ACE SELECT Architectural Inspiration"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F2B] via-[#0B0F2B]/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white font-display font-black text-xs tracking-[0.2em] leading-relaxed uppercase">
            <div>IDEAS</div>
            <div>PEOPLE</div>
            <div>SPACES</div>
            <div className="text-solvorry-light">PROGRESS</div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/40 font-body">
            © 2026 ACE SELECT.<br />All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <div className="hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="relative w-64 shadow-2xl">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
