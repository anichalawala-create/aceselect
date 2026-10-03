"use client";

import { useState } from "react";
import { Users, Plus, Trash2, Mail, Phone, Building2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  is_active: boolean;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Mr. Kamal Gor",
    role: "Founder & Managing Director",
    department: "Executive Leadership",
    bio: "Guiding ACE SELECT's vision of design-to-build excellence across 476+ cities with ₹100 Cr+ annual turnover.",
    is_active: true,
  },
  {
    id: "2",
    name: "Projects & Engineering Head",
    role: "Vice President - Technology & Installations",
    department: "Display Engineering",
    bio: "Supervising 34,250+ sq. meters of active LED video walls and high-reliability smart city network infrastructure.",
    is_active: true,
  },
  {
    id: "3",
    name: "National Operations Lead",
    role: "Director - Retail & Banking Rollouts",
    department: "Commercial Operations",
    bio: "Leading rapid-response installation teams across 27+ states and nationwide regional representative networks.",
    is_active: true,
  },
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_TEAM);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Executive & Leadership Team</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Corporate leaders and departmental directors managing nationwide operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#283A97]/10 text-[#283A97] flex items-center justify-center font-bold text-sm mb-4">
                {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <h3 className="font-bold text-base text-neutral-900">{m.name}</h3>
              <p className="text-xs font-semibold text-[#283A97] mt-0.5">{m.role}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{m.department}</p>
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed">{m.bio}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Profile
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
