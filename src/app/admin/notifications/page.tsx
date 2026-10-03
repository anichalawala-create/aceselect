"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Server,
  MessageSquare,
  Search,
  Filter,
  Check,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Sliders,
  CheckCheck,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "lead" | "security" | "system" | "content";
  priority: "urgent" | "normal" | "low";
  timestamp: string;
  is_read: boolean;
  action_url: string;
  action_label: string;
  sender_name?: string;
  company?: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "lead" | "security" | "system">("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ unread: 0, leads: 0, security: 0, system: 0 });

  function loadNotifications() {
    setLoading(true);
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.notifications) {
          setNotifications(d.notifications);
          setStats({
            unread: d.unread_count || 0,
            leads: d.stats?.leads || 0,
            security: d.stats?.security || 0,
            system: d.stats?.system || 0,
          });
        }
      })
      .catch((e) => console.error("Error loading notifications:", e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(id: string, currentRead: boolean) {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentRead ? "mark_unread" : "mark_read",
          id,
        }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: !currentRead } : n))
      );
      setStats((prev) => ({
        ...prev,
        unread: currentRead ? prev.unread + 1 : Math.max(0, prev.unread - 1),
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    try {
      const allIds = notifications.map((n) => n.id);
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", allIds }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setStats((prev) => ({ ...prev, unread: 0 }));
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = notifications.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      (n.company && n.company.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return n.type === filter;
  });

  function formatTime(iso: string) {
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Notification Center</h1>
            {stats.unread > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#283A97] text-white">
                {stats.unread} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time feed of client enquiries, security alerts, and system health operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            disabled={stats.unread === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-neutral-500" />
            Mark All as Read
          </button>
          <button
            onClick={loadNotifications}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#283A97] text-white text-xs font-semibold hover:bg-[#1e2d7a] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Unread Alerts</span>
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.unread}</p>
          <p className="text-[11px] text-neutral-400 mt-1">Requiring staff review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Client Leads</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{notifications.filter(n => n.type === 'lead').length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Prospective projects</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Security Events</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{notifications.filter(n => n.type === 'security').length}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Staff auth & protection</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">System Operations</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{notifications.filter(n => n.type === 'system').length}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Cloud sync & health</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { value: "all", label: `All (${notifications.length})` },
            { value: "unread", label: `Unread (${stats.unread})` },
            { value: "lead", label: "Leads" },
            { value: "security", label: "Security" },
            { value: "system", label: "System" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.value
                  ? "bg-[#283A97] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-20 text-center text-sm text-neutral-500">
            <div className="w-6 h-6 border-2 border-[#283A97] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading live notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 py-16 text-center">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm font-medium">No notifications matching your criteria.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isUnread = !item.is_read;
            const isLead = item.type === "lead";
            const isSecurity = item.type === "security";
            const isSystem = item.type === "system";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4.5 transition-all flex flex-col sm:flex-row sm:items-start gap-4 ${
                  isUnread
                    ? "border-blue-200 bg-blue-50/20 shadow-xs"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isLead
                      ? "bg-emerald-100 text-emerald-700"
                      : isSecurity
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-[#283A97]"
                  }`}
                >
                  {isLead ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : isSecurity ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Server className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className={`text-sm font-bold ${isUnread ? "text-neutral-900" : "text-neutral-700"}`}>
                      {item.title}
                    </h3>

                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}

                    {item.priority === "urgent" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                        Urgent
                      </span>
                    )}

                    {item.company && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {item.company}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(item.timestamp)}
                    </span>
                    <span className="capitalize text-[11px] font-medium text-neutral-500">
                      Type: {item.type}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  {item.action_url && (
                    <Link
                      href={item.action_url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors"
                    >
                      {item.action_label}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  <button
                    onClick={() => handleMarkRead(item.id, item.is_read)}
                    title={item.is_read ? "Mark as unread" : "Mark as read"}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
                  >
                    <Check className={`w-4 h-4 ${item.is_read ? "text-neutral-400" : "text-blue-600 font-bold"}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
