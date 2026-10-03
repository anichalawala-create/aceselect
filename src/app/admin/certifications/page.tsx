"use client";

import { Award, CheckCircle2, ShieldCheck, Calendar, FileText } from "lucide-react";

const CERTIFICATIONS = [
  {
    name: "ISO 9001:2015 Quality Management Standard",
    issuer: "International Organization for Standardization",
    scope: "Design, Manufacture, Supply, Installation & Servicing of Active LED Displays, Digital Signage & Commercial Branding",
    status: "Active & Verified",
    validity: "Certified Since 1996",
  },
  {
    name: "OEM Electrical Safety & Ingress Protection (IP65)",
    issuer: "National Standards Laboratory Compliance",
    scope: "Outdoor Display Enclosures & Daylight-Visible All-Weather Thermal Dissipation Engineering",
    status: "Active & Verified",
    validity: "Certified Production",
  },
  {
    name: "CPWD / Government of India Vendor Empanelment",
    issuer: "Central Public Works Department",
    scope: "Public Infrastructure, Smart City Video Walls & Architectural Signage",
    status: "Empaneled",
    validity: "Class 1 Enterprise",
  },
];

export default function AdminCertificationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Quality Certifications & Compliance</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Official ISO credentials and government manufacturing accreditations
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-neutral-900">{cert.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#283A97] mt-0.5">{cert.issuer}</p>
                <p className="text-xs text-neutral-600 mt-2 max-w-2xl">{cert.scope}</p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-neutral-400 font-medium block">Compliance Record</span>
              <span className="text-xs font-bold text-neutral-800 mt-0.5 block">{cert.validity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
