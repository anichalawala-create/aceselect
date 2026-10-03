"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Activity,
  FolderOpen,
  PhoneCall,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { clientService } from "@/services/clientService";

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMoreDrawer({ isOpen, onClose }: MobileMoreDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await clientService.logout();
    onClose();
    router.push("/client-portal");
  };

  const navItems = [
    {
      name: "Project Updates",
      href: "/client-portal/updates",
      icon: Activity,
      desc: "Live field logs, inspection sign-offs & milestone stream",
    },
    {
      name: "Documents",
      href: "/client-portal/documents",
      icon: FolderOpen,
      desc: "CAD drawings, BOQ matrices, reports & tax invoices",
    },
    {
      name: "Contact Team",
      href: "/client-portal/contact",
      icon: PhoneCall,
      desc: "Direct line to your Key Account Director & Lead Architect",
    },
    {
      name: "Client Profile",
      href: "/client-portal/profile",
      icon: User,
      desc: "Organization settings, security & contact preferences",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Handle bar on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F8FA]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm text-[#283A97] tracking-wider">
                ACE SELECT
              </span>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#59616D]">
                MORE MENU
              </span>
            </div>
            <p className="text-xs text-[#59616D] mt-0.5">
              Additional portal navigation & support
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-3 sm:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? "bg-blue-50/70 border-[#283A97]/40 text-[#283A97]"
                    : "bg-white border-transparent hover:border-[#E5E7EB] hover:bg-neutral-50 text-[#0B0D12]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-[#283A97] text-white"
                        : "bg-[#F7F8FA] border border-[#E5E7EB] text-[#283A97]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#59616D] line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            );
          })}

          {/* Drive into Website section */}
          <div className="pt-3 border-t border-[#E5E7EB] mt-3 space-y-1">
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#59616D] px-2 block mb-1">
              DRIVE INTO WEBSITE
            </span>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 border border-blue-100 text-xs font-semibold text-[#283A97] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#283A97]" />
                <span>Ace Select Main Website</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#283A97]" />
            </Link>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Link
                href="/services"
                onClick={onClose}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-[11px] font-medium text-neutral-700 text-center"
              >
                Capabilities
              </Link>
              <Link
                href="/projects"
                onClick={onClose}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-[11px] font-medium text-neutral-700 text-center"
              >
                Projects
              </Link>
              <Link
                href="/who-we-are"
                onClick={onClose}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-[11px] font-medium text-neutral-700 text-center"
              >
                Who We Are
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-[11px] font-medium text-neutral-700 text-center"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E7EB] mt-2 space-y-1">
            <Link
              href="/client-portal/profile"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 text-xs font-semibold text-[#0B0D12]"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-[#59616D]" />
                <span>Security &amp; Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out of Client Portal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F7F8FA] border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#59616D]">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#283A97]" /> ISO 9001:2015 Compliant
          </span>
          <span className="font-mono">v2.4.0 (Mobile)</span>
        </div>
      </div>
    </div>
  );
}
