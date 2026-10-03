"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  FileText,
  Clock,
} from "lucide-react";
import { clientService } from "@/services/clientService";
import { ClientProfile } from "@/types/portal";

interface PortalHeaderProps {
  onMobileMenuToggle?: () => void;
}

export function PortalHeader({ onMobileMenuToggle }: PortalHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clientService.getClientProfile().then(setProfile);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await clientService.logout();
    router.push("/client-portal");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/client-portal/sites?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] h-16 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle + Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-[4px] hover:bg-neutral-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, sites, documents..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-xs font-body text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-solvorry-DEFAULT focus:ring-1 focus:ring-solvorry-DEFAULT/20 transition-all"
          />
        </form>
      </div>

      {/* Right: Notification + Profile + Logout */}
      <div className="flex items-center gap-4">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-display font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-[6px] shadow-lg py-2 z-50 text-left">
              <div className="px-4 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-neutral-900">
                  Notifications
                </span>
                <span className="text-[10px] text-solvorry-DEFAULT font-bold tracking-wider uppercase cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-[#F7F8FA] transition-colors flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-solvorry-DEFAULT mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900">
                      Site inspection completed: Jaipur – Store 01
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Aakash Mehta certified structural mounting.
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Today, 10:42 AM
                    </span>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#F7F8FA] transition-colors flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900">
                      Artwork approved: Delhi – Store 04
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Store sign-off completed and scheduled for opening.
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Today, 09:15 AM
                    </span>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#F7F8FA] transition-colors flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900">
                      Action Required: Exterior Signage Artwork
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Review submitted drawing before production cut.
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Yesterday, 05:30 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-[#E5E7EB] text-center">
                <Link
                  href="/client-portal/updates"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-display font-bold text-solvorry-DEFAULT uppercase tracking-wider hover:underline"
                >
                  View All Activity Feed →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="User profile options"
          >
            <div className="w-9 h-9 rounded-full bg-[#0B0F2B] text-white flex items-center justify-center font-display font-bold text-xs tracking-wider">
              {profile?.initials || "RS"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-display font-bold text-[#0B0D12] leading-tight">
                {profile?.name || "Sunil Deshmukh"}
              </div>
              <div className="text-[10px] text-neutral-500 leading-tight">
                {profile?.company || "Hitachi Payment Services"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-[6px] shadow-lg py-2 z-50 text-left">
              <div className="px-4 py-2 border-b border-[#E5E7EB]">
                <div className="text-xs font-bold text-neutral-900">
                  {profile?.name}
                </div>
                <div className="text-[11px] text-neutral-500 truncate">
                  {profile?.email}
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/client-portal/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F7F8FA] hover:text-solvorry-DEFAULT transition-colors"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  Client Profile
                </Link>
                <Link
                  href="/client-portal/documents"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F7F8FA] hover:text-solvorry-DEFAULT transition-colors"
                >
                  <FileText className="w-4 h-4 text-neutral-400" />
                  Project Documents
                </Link>
                <Link
                  href="/client-portal/updates"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-[#F7F8FA] hover:text-solvorry-DEFAULT transition-colors"
                >
                  <Clock className="w-4 h-4 text-neutral-400" />
                  Audit Trail
                </Link>
              </div>

              <div className="border-t border-[#E5E7EB] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
