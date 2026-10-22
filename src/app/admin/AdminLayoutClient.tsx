"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Users,
  FileText,
  Star,
  Building2,
  Monitor,
  Award,
  MessageSquare,
  Globe,
  Home,
  ChevronDown,
  Menu,
  X,
  KeyRound,
  Shield,
  CheckCircle2,
  AlertCircle,
  CheckCheck,
  Server,
  ExternalLink,
  PanelsTopLeft,
} from "lucide-react";

// Admin nav items with sub-items
const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Homepage",
    icon: Home,
    children: [
      { label: "Hero Section", href: "/admin/homepage/hero" },
      { label: "Stats & Numbers", href: "/admin/homepage/stats" },
      { label: "About Section", href: "/admin/homepage/about" },
      { label: "Products & Solutions", href: "/admin/homepage/products" },
      { label: "Process Steps", href: "/admin/homepage/process" },
      { label: "Featured Projects", href: "/admin/homepage/featured" },
      { label: "Pan-India Stats", href: "/admin/homepage/pan-india" },
    ],
  },
  {
    label: "Projects",
    icon: FolderOpen,
    children: [
      { label: "All Projects", href: "/admin/projects" },
      { label: "Add Project", href: "/admin/projects/new" },
    ],
  },
  {
    label: "Products",
    icon: Monitor,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/products/categories" },
      { label: "Add Product", href: "/admin/products/new" },
    ],
  },
  {
    label: "Company",
    icon: Building2,
    children: [
      { label: "Company Page", href: "/admin/company" },
      { label: "Team Members", href: "/admin/team" },
    ],
  },
  {
    label: "Clients & Testimonials",
    icon: Star,
    children: [
      { label: "Client Logos", href: "/admin/clients" },
      { label: "Testimonials", href: "/admin/testimonials" },
    ],
  },
  {
    label: "Certifications",
    href: "/admin/certifications",
    icon: Award,
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    label: "Page Content",
    href: "/admin/content",
    icon: PanelsTopLeft,
  },
  {
    label: "Enquiries / Leads",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Users & Staff",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "SEO Settings",
    href: "/admin/seo",
    icon: FileText,
  },
  {
    label: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "User Manual",
    href: "/admin/manual",
    icon: ExternalLink,
  },
];

function NavItem({
  item,
  collapsed,
  pathname,
}: {
  item: (typeof NAV_ITEMS)[0];
  collapsed: boolean;
  pathname: string;
}) {
  const isActive = item.href
    ? item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href)
    : item.children?.some((c) => pathname.startsWith(c.href));

  const [open, setOpen] = useState(isActive);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all cursor-pointer ${
            isActive
              ? "bg-[#283A97] text-white"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-7 mt-1 space-y-0.5 border-l border-white/10 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-2 rounded text-xs font-medium transition-colors ${
                  pathname === child.href
                    ? "text-[#7B92FF] font-semibold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-[#283A97] text-white"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </Link>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null>(null);

  // Change password modal
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [currPwd, setCurrPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Live Notifications State
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifTab, setNotifTab] = useState<"all" | "leads" | "system">("all");

  const fetchNotifs = () => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.notifications) {
          setNotifications(d.notifications);
          setUnreadCount(d.unread_count || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isLoginPage) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 25000);
    return () => clearInterval(interval);
  }, [isLoginPage]);

  async function handleMarkRead(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  }

  async function handleMarkAllRead(e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    try {
      const allIds = notifications.map((n) => n.id);
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", allIds }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  }

  function formatRelativeTime(iso: string) {
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch {
      return iso;
    }
  }

  // Check authentication
  useEffect(() => {
    if (isLoginPage) {
      setAuthLoading(false);
      return;
    }

    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setCurrentUser(data.user);
          setAuthLoading(false);
        } else if (!isLoginPage) {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (!isLoginPage) router.replace("/admin/login");
      });
  }, [pathname, isLoginPage, router]);

  // Close mobile on navigate
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setPwdLoading(true);
    setPwdMsg(null);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currPwd,
          newPassword: newPwd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdMsg({ type: "error", text: data.error || "Failed to update password." });
      } else {
        setPwdMsg({ type: "success", text: "Password changed successfully." });
        setCurrPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => setPwdModalOpen(false), 1500);
      }
    } catch {
      setPwdMsg({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setPwdLoading(false);
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#07090E]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#283A97] rounded-full animate-spin" />
          <p className="text-xs text-neutral-400 font-medium tracking-wide">
            Authenticating ACE SELECT Admin...
          </p>
        </div>
      </div>
    );
  }

  const initials = currentUser?.full_name
    ? currentUser.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const Sidebar = (
    <aside
      className={`flex flex-col bg-[#0B0F2B] border-r border-white/10 h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <img src="/logo.png" alt="ACE SELECT" className="h-8 w-auto shrink-0 brightness-0 invert" />
        {!collapsed && (
          <span className="font-bold text-white text-sm tracking-widest uppercase">
            Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom: User Info & Actions */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {!collapsed && (
          <div 
            onClick={() => setPwdModalOpen(true)}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
            title="Click to change password"
          >
            <div className="w-8 h-8 rounded-full bg-[#283A97] flex items-center justify-center text-white text-xs font-bold shrink-0 group-hover:ring-2 group-hover:ring-blue-400 transition-all">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate flex items-center gap-1.5">
                {currentUser?.full_name || "Super Admin"}
                <KeyRound className="w-3 h-3 text-white/30 group-hover:text-blue-300" />
              </p>
              <p className="text-white/40 text-[10px] truncate">{currentUser?.email || "admin@aceselect.in"}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-white/50 hover:text-red-400 text-xs transition-colors cursor-pointer"
            title="Sign out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && "Sign Out"}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#F0F2F8] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">{Sidebar}</div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 shrink-0">{Sidebar}</div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-neutral-200 flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-600 hidden sm:inline">
              Production CMS Live
            </span>
          </div>

          <div className="flex-1" />

          <Link
            href="/"
            target="_blank"
            className="text-xs text-neutral-600 hover:text-[#283A97] font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100"
          >
            <Globe className="w-3.5 h-3.5" />
            View Website
          </Link>

          {/* Notification Bell Button & Floating Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Notifications & Alerts"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white bg-red-500 rounded-full shadow-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                  <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60 pointer-events-none" />
                </span>
              )}
            </button>

            {/* Dropdown Floating Notification Panel */}
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden flex flex-col max-h-[500px] animate-in fade-in zoom-in-95 duration-150">
                  {/* Panel Header */}
                  <div className="px-4 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#283A97] text-white">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-200 text-neutral-600">
                          All caught up
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-[#283A97] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="px-4 py-2 border-b border-neutral-100 flex items-center gap-1.5 bg-white">
                    {[
                      { id: "all", label: "All" },
                      { id: "leads", label: "Leads" },
                      { id: "system", label: "System & Security" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setNotifTab(tab.id as typeof notifTab)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          notifTab === tab.id
                            ? "bg-[#283A97] text-white"
                            : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification Items List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 max-h-[300px]">
                    {notifications.filter((n) => {
                      if (notifTab === "leads") return n.type === "lead";
                      if (notifTab === "system") return n.type === "system" || n.type === "security";
                      return true;
                    }).length === 0 ? (
                      <div className="py-12 text-center text-neutral-400">
                        <Bell className="w-7 h-7 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No notifications in this category</p>
                      </div>
                    ) : (
                      notifications
                        .filter((n) => {
                          if (notifTab === "leads") return n.type === "lead";
                          if (notifTab === "system") return n.type === "system" || n.type === "security";
                          return true;
                        })
                        .map((n) => {
                          const isUnread = !n.is_read;
                          const isLead = n.type === "lead";
                          const isSecurity = n.type === "security";

                          return (
                            <div
                              key={n.id}
                              onClick={() => {
                                handleMarkRead(n.id);
                                if (n.action_url) {
                                  setNotifOpen(false);
                                  router.push(n.action_url);
                                }
                              }}
                              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                                isUnread ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-neutral-50"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isLead
                                    ? "bg-emerald-100 text-emerald-700"
                                    : isSecurity
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-[#283A97]"
                                }`}
                              >
                                {isLead ? (
                                  <MessageSquare className="w-4 h-4" />
                                ) : isSecurity ? (
                                  <Shield className="w-4 h-4" />
                                ) : (
                                  <Server className="w-4 h-4" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <p
                                    className={`text-xs truncate ${
                                      isUnread ? "font-bold text-neutral-900" : "font-medium text-neutral-700"
                                    }`}
                                  >
                                    {n.title}
                                  </p>
                                  <span className="text-[10px] text-neutral-400 shrink-0">
                                    {formatRelativeTime(n.timestamp)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                                  {n.message}
                                </p>
                              </div>

                              {isUnread && (
                                <button
                                  onClick={(e) => handleMarkRead(n.id, e)}
                                  title="Mark as read"
                                  className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 hover:scale-125 transition-transform"
                                />
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>

                  {/* Panel Footer */}
                  <div className="p-2.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs">
                    <Link
                      href="/admin/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="text-[#283A97] font-semibold hover:underline px-2 py-1"
                    >
                      View All Alerts →
                    </Link>
                    <Link
                      href="/admin/enquiries"
                      onClick={() => setNotifOpen(false)}
                      className="text-neutral-500 hover:text-neutral-900 font-medium px-2 py-1"
                    >
                      Client Enquiries
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => setPwdModalOpen(true)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#283A97] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="text-xs font-semibold text-neutral-700 hidden md:inline">
              {currentUser?.full_name?.split(" ")[0] || "Admin"}
            </span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Change Password Modal */}
      {pwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#283A97]/10 flex items-center justify-center text-[#283A97]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Change Password</h3>
                  <p className="text-xs text-neutral-500">{currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPwdModalOpen(false);
                  setPwdMsg(null);
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdMsg && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-xs ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {pwdMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currPwd}
                  onChange={(e) => setCurrPwd(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPwdModalOpen(false);
                    setPwdMsg(null);
                  }}
                  className="flex-1 py-2 px-4 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="flex-1 py-2 px-4 bg-[#283A97] hover:bg-[#1E2D7A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {pwdLoading ? "Updating..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
