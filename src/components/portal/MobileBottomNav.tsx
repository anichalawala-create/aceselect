"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  MapPin,
  CheckSquare,
  Menu,
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenMore: () => void;
  pendingApprovalsCount?: number;
}

export function MobileBottomNav({
  onOpenMore,
  pendingApprovalsCount = 18,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === "/client-portal/dashboard") {
      return pathname === "/client-portal/dashboard";
    }
    return pathname.startsWith(href);
  };

  const navTabs = [
    {
      name: "Dashboard",
      href: "/client-portal/dashboard",
      icon: LayoutGrid,
    },
    {
      name: "Projects",
      href: "/client-portal/projects",
      icon: Briefcase,
    },
    {
      name: "Sites",
      href: "/client-portal/sites",
      icon: MapPin,
    },
    {
      name: "Approvals",
      href: "/client-portal/approvals",
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-2 safe-area-pb"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center">
        {navTabs.map((tab) => {
          const active = isTabActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center h-full w-full py-1 text-center transition-colors relative ${
                active ? "text-[#283A97]" : "text-[#59616D] hover:text-[#0B0D12]"
              }`}
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-transform"
                  strokeWidth={active ? 2.25 : 1.75}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#F59E0B] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-display tracking-tight ${
                  active ? "font-bold text-[#283A97]" : "font-medium"
                }`}
              >
                {tab.name}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#283A97] rounded-full" />
              )}
            </Link>
          );
        })}

        {/* More Tab */}
        <button
          type="button"
          onClick={onOpenMore}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-center text-[#59616D] hover:text-[#0B0D12] transition-colors relative"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
          <span className="text-[10px] mt-1 font-display font-medium tracking-tight">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
