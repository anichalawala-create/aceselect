"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  CheckCircle2,
  Shield,
  KeyRound,
  AlertCircle,
  Cpu,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  site_name: "ACE SELECT",
  tagline: "Engineered for India. Designed for Every Application.",
  company_description:
    "ACE SELECT is an Indian OEM and Manufacturer of Active LED Video Wall and Digital Signage Display Systems, delivering professionally engineered, application-specific display solutions for government, banking, corporate, institutional, commercial, and mission-critical environments across India.",
  phone: "(+91) 22 25182233",
  email: "info@aceselect.in",
  address: "C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai - 400079",
  whatsapp_number: "+91 22 25182233",
  facebook_url: "https://www.facebook.com/AceSelect",
  twitter_url: "https://twitter.com/ace_select",
  instagram_url: "https://www.instagram.com/ace_select/",
  linkedin_url: "https://www.linkedin.com/company/aceselectsocial/",
  youtube_url: "",
  footer_description:
    "Trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India. Design-to-Build excellence under one roof.",
  maintenance_mode: false,
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white transition-all"
      />
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] resize-none transition-all"
      />
    </div>
  );
}

function SectionCard({
  title,
  hint,
  icon: Icon,
  children,
}: {
  title: string;
  hint?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/70 flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-[#283A97]" />}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{title}</h3>
          {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/content?section=settings");
        const json = await res.json();
        if (json.success && json.data) {
          setForm((prev) => ({ ...prev, ...json.data }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, []);

  // Security password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "settings", data: form }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save settings");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving settings: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwdMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    setPwdLoading(true);
    setPwdMessage(null);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdMessage({ type: "error", text: data.error || "Failed to update password." });
      } else {
        setPwdMessage({ type: "success", text: "Your password has been changed successfully!" });
        setOldPassword("");
        setNewPassword("");
      }
    } catch {
      setPwdMessage({ type: "error", text: "Network error updating password." });
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">System & Website Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Global corporate identity, contact channels, public footer, and account security
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saved ? "Changes Saved ✓" : saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <SectionCard title="Corporate Identity" icon={Globe} hint="Shown across official website headers, footer, and brochures">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Brand Name"
              name="site_name"
              value={form.site_name}
              onChange={(v) => update("site_name", v)}
            />
            <Field
              label="Tagline"
              name="tagline"
              value={form.tagline}
              onChange={(v) => update("tagline", v)}
            />
          </div>
          <Textarea
            label="Corporate Description"
            name="company_description"
            value={form.company_description}
            onChange={(v) => update("company_description", v)}
            rows={3}
          />
          <Textarea
            label="Footer Overview"
            name="footer_description"
            value={form.footer_description}
            onChange={(v) => update("footer_description", v)}
            rows={2}
          />
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Official Contact Channels" icon={Phone} hint="Primary channels displayed to prospective clients">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field
              label="Official Phone"
              name="phone"
              value={form.phone}
              onChange={(v) => update("phone", v)}
            />
            <Field
              label="Inquiry Email"
              name="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              type="email"
            />
            <Field
              label="WhatsApp Business"
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={(v) => update("whatsapp_number", v)}
            />
          </div>
          <Field
            label="Headquarters Address"
            name="address"
            value={form.address}
            onChange={(v) => update("address", v)}
          />
        </SectionCard>

        {/* Social Media */}
        <SectionCard title="Social & Media Profiles" icon={MessageCircle} hint="Public links shown in navigation and footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="LinkedIn Company Page"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={(v) => update("linkedin_url", v)}
            />
            <Field
              label="Instagram Profile"
              name="instagram_url"
              value={form.instagram_url}
              onChange={(v) => update("instagram_url", v)}
            />
            <Field
              label="Facebook Page"
              name="facebook_url"
              value={form.facebook_url}
              onChange={(v) => update("facebook_url", v)}
            />
            <Field
              label="Twitter / X Profile"
              name="twitter_url"
              value={form.twitter_url}
              onChange={(v) => update("twitter_url", v)}
            />
          </div>
        </SectionCard>
      </form>

      {/* Account Security Section */}
      <SectionCard title="Account Security & Password" icon={Shield} hint="Update your administrative login credentials">
        <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
          {pwdMessage && (
            <div
              className={`p-3.5 rounded-lg flex items-center gap-2 text-xs font-medium ${
                pwdMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {pwdMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{pwdMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </SectionCard>

      {/* Production System Health */}
      <SectionCard title="System Operations & Status" icon={Cpu} hint="Operational health and platform versioning">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
            <p className="text-xs text-neutral-500 uppercase font-semibold">CMS Platform</p>
            <p className="text-sm font-bold text-neutral-900 mt-1">ACE SELECT Enterprise v2.4</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Production Release
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
            <p className="text-xs text-neutral-500 uppercase font-semibold">Content Delivery</p>
            <p className="text-sm font-bold text-neutral-900 mt-1">High-Speed CDN</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Real-time Active
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
            <p className="text-xs text-neutral-500 uppercase font-semibold">Cloud Infrastructure</p>
            <p className="text-sm font-bold text-neutral-900 mt-1">Enterprise Cloud Engine</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Synchronized & Healthy
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
