"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Send,
  Building2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { clientService } from "@/services/clientService";
import { TeamMember } from "@/types/portal";

export default function ContactPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    clientService.getTeamMembers().then(setTeam);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSentSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/client-portal/dashboard" },
          { label: "Contact Team" },
        ]}
        title="Assigned ACE SELECT Project Team"
        subtitle="Direct access to your dedicated senior account directors, lead engineers, and on-ground logistics managers."
      />

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-solvorry-DEFAULT/40 transition-colors"
          >
            <div>
              <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 mb-4 border border-[#E5E7EB]">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-display font-bold text-base text-[#0B0D12]">
                {member.name}
              </h3>
              <div className="text-xs font-semibold text-solvorry-DEFAULT mt-0.5">
                {member.role}
              </div>
              <div className="text-[11px] text-neutral-400 font-body mt-0.5">
                {member.department}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2 text-xs">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 text-neutral-600 hover:text-solvorry-DEFAULT transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </a>
                <a
                  href={`tel:${member.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 text-neutral-600 hover:text-solvorry-DEFAULT transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{member.phone}</span>
                </a>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-between">
              <span>{member.experience}</span>
              <span className="text-emerald-600 font-bold uppercase">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column: Message Inquiry + Head Office & Escalation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[6px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h3 className="font-display font-bold text-base text-[#0B0D12] mb-1">
            Direct Project Dispatch Message
          </h3>
          <p className="text-xs text-neutral-500 font-body mb-6">
            Send an expedited communication directly to your assigned project team.
          </p>

          {sentSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[4px] text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Your message has been dispatched to the assigned team. A representative will acknowledge within 30 minutes.
              </span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Send To
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-800 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
              >
                <option value="all">Full Project Coordination Unit (All Leads)</option>
                {team.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Schedule priority inspection for Store 03"
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Message & Requirement Details
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe any urgent requirement, site access details, or timeline adjustments..."
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-[4px] text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-solvorry-DEFAULT focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 bg-solvorry-DEFAULT hover:bg-solvorry-dark text-white font-display font-bold text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? "Sending Dispatch..." : "Send Message"}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Head Office & Escalation Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-solvorry-DEFAULT" />
              Corporate Headquarters
            </h3>

            <div className="text-xs space-y-2 text-neutral-600 font-body">
              <p className="font-bold text-neutral-900 font-display">
                ACE SELECT Private Limited
              </p>
              <p>
                C 1601/02/03 Kailas Business Park, Veer Savarkar Marg, Vikhroli (West), Mumbai – 400079, Maharashtra, India
              </p>
              <div className="pt-2 border-t border-neutral-100 space-y-1 text-neutral-700">
                <div>Board: <strong className="text-neutral-900">(+91) 22 25182233</strong></div>
                <div>Corporate: <strong className="text-neutral-900">info@aceselect.in</strong></div>
                <div>Hours: <span className="text-neutral-500">9:30 AM – 7:00 PM IST (Mon - Sat)</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-neutral-500 border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              24/7 Field Escalation Desk
            </h3>

            <p className="text-xs text-neutral-600 font-body leading-relaxed">
              For on-site emergency structural clearance or night installation mall access issues, reach our rapid response command team directly.
            </p>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs font-mono text-neutral-800">
              Hotline: +91 98200 99887 (Priority 1)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
