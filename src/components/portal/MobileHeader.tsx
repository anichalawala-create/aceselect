"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronLeft,
  Bell,
  X,
  ArrowRight,
} from "lucide-react";

interface MobileHeaderProps {
  backHref?: string;
  onBack?: () => void;
  onOpenMenu?: () => void;
  notificationCount?: number;
}

export function MobileHeader({
  backHref,
  onBack,
  onOpenMenu,
  notificationCount = 3,
}: MobileHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const isBackMode = Boolean(backHref || onBack);

  return (
    <>
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-3.5 h-14 flex items-center justify-between">
        {/* Left Action: Back arrow OR Hamburger menu */}
        <div className="flex items-center w-10">
          {isBackMode ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0B0D12] hover:bg-neutral-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenMenu}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0B0D12] hover:bg-neutral-100 transition-colors"
              aria-label="Open portal menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Center: ACE SELECT / CLIENT PORTAL */}
        <Link
          href="/client-portal/dashboard"
          className="flex flex-col items-center justify-center text-center select-none"
        >
          <span className="font-display font-black text-[13px] tracking-[0.18em] text-[#283A97] leading-none uppercase">
            ACE SELECT
          </span>
          <span className="text-[8.5px] font-display font-bold uppercase tracking-[0.25em] text-[#59616D] mt-0.5 leading-none">
            CLIENT PORTAL
          </span>
        </Link>

        {/* Right: Notifications & Profile Avatar */}
        <div className="flex items-center gap-2 w-16 justify-end">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-[#0B0D12] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#EF4444] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <Link
            href="/client-portal/profile"
            className="w-7 h-7 rounded-full bg-[#0B0F2B] text-white flex items-center justify-center text-[10px] font-display font-bold hover:ring-2 hover:ring-[#283A97] transition-all shadow-xs"
            aria-label="Client Profile"
          >
            RS
          </Link>
        </div>
      </header>

      {/* Notifications Drawer Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="absolute inset-0"
            onClick={() => setShowNotifications(false)}
          />
          <div className="relative w-full max-w-sm mt-12 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-in slide-in-from-top-4 duration-200">
            <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F8FA]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#283A97]" />
                <span className="font-display font-bold text-xs text-[#0B0D12]">
                  Notifications ({notificationCount})
                </span>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-6 h-6 rounded-full hover:bg-neutral-200/60 flex items-center justify-center text-neutral-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#E5E7EB] max-h-72 overflow-y-auto">
              {[
                {
                  title: "Artwork approval required",
                  desc: "Retail Rollout Jaipur — Store 01 signage artwork awaiting sign-off.",
                  time: "10 min ago",
                  href: "/client-portal/approvals",
                },
                {
                  title: "Site inspection passed",
                  desc: "Delhi — Store 04 final handover certificate signed.",
                  time: "1 hour ago",
                  href: "/client-portal/sites/site-02",
                },
                {
                  title: "New CAD drawings uploaded",
                  desc: "Storefront architectural pack v4 ready for download.",
                  time: "Yesterday",
                  href: "/client-portal/documents",
                },
              ].map((n, i) => (
                <Link
                  key={i}
                  href={n.href}
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display font-bold text-xs text-[#0B0D12]">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#59616D] mt-0.5 line-clamp-2">
                    {n.desc}
                  </p>
                </Link>
              ))}
            </div>

            <div className="p-2.5 bg-[#F7F8FA] border-t border-[#E5E7EB] text-center">
              <Link
                href="/client-portal/updates"
                onClick={() => setShowNotifications(false)}
                className="text-[11px] font-display font-bold text-[#283A97] hover:underline inline-flex items-center gap-1"
              >
                View all project updates <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
