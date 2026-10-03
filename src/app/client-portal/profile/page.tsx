"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Bell,
  LogOut,
  Save,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { clientService } from "@/services/clientService";
import { ClientProfile } from "@/types/portal";

export default function ClientProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notification toggles
  const [notifApprovals, setNotifApprovals] = useState(true);
  const [notifTatAlerts, setNotifTatAlerts] = useState(true);
  const [notifInspections, setNotifInspections] = useState(true);

  useEffect(() => {
    clientService.getClientProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setPhone(data.phone);
      setAddress(data.address);
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await clientService.updateClientProfile({
        name,
        phone,
        address,
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await clientService.logout();
    router.push("/client-portal");
  };

  if (!profile) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-200 w-48 rounded" />
        <div className="h-64 bg-white border border-[#E5E7EB] rounded-[6px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/client-portal/dashboard" },
          { label: "Client Profile" },
        ]}
        title="Client Profile & Settings"
        subtitle="Manage your company contact profile, notification triggers, and portal security credentials."
        actions={
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50/50 text-xs font-display font-bold uppercase tracking-wider rounded-[4px] hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        }
      />

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[4px] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile parameters updated successfully.</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-5 pb-6 border-b border-[#E5E7EB] mb-6">
          <div className="w-16 h-16 rounded-full bg-[#0B0F2B] text-white flex items-center justify-center font-display font-black text-2xl tracking-wider">
            {profile.initials}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0D12]">
              {profile.name}
            </h2>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">
              {profile.role} &bull; <strong className="text-solvorry-DEFAULT">{profile.company}</strong>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono mt-1">
              Account ID: {profile.id}
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-900 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Organization / Client Unit
              </label>
              <input
                type="text"
                disabled
                value={profile.company}
                className="w-full px-3 py-2 bg-neutral-100 border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Registered Corporate Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-neutral-100 border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-900 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Regional Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-900 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-solvorry-DEFAULT hover:bg-solvorry-dark text-white font-display font-bold text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-solvorry-DEFAULT" />
          Automated Notification Subscriptions
        </h3>

        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifApprovals}
              onChange={(e) => setNotifApprovals(e.target.checked)}
              className="mt-0.5 rounded text-solvorry-DEFAULT focus:ring-solvorry-DEFAULT"
            />
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Engineering & Artwork Approvals
              </div>
              <div className="text-[11px] text-neutral-500">
                Notify instantly when new 3D models, signage artwork, or material sample specs are submitted for sign-off.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifTatAlerts}
              onChange={(e) => setNotifTatAlerts(e.target.checked)}
              className="mt-0.5 rounded text-solvorry-DEFAULT focus:ring-solvorry-DEFAULT"
            />
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Automated TAT & Milestone Breach Warnings
              </div>
              <div className="text-[11px] text-neutral-500">
                Receive proactive alerts when any on-ground site installation approaches SLA boundaries.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifInspections}
              onChange={(e) => setNotifInspections(e.target.checked)}
              className="mt-0.5 rounded text-solvorry-DEFAULT focus:ring-solvorry-DEFAULT"
            />
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Completed Inspection Snag Certificates
              </div>
              <div className="text-[11px] text-neutral-500">
                Receive instant PDF copies of verified final ISO quality audit checklists and high-res closure photographs.
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
