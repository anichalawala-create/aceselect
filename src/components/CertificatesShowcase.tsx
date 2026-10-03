"use client";

import { useState } from "react";
import SectionReveal from "@/components/SectionReveal";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Maximize2, 
  X, 
  ExternalLink, 
  FileCheck,
  Building2,
  Clock,
  Wrench
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  code: string;
  scope: string;
  issuingBody: string;
  image: string;
  tag: string;
  features: string[];
}

const certificates: Certificate[] = [
  {
    id: "iso-9001",
    title: "Quality Management System",
    code: "ISO 9001:2015",
    scope: "Design, Fabrication, Supply, Installation & Servicing of Active LED Video Walls, Digital Displays, Signage Systems & Commercial Turnkey Fit-Outs.",
    issuingBody: "International Organization for Standardization",
    image: "/images/certificates/cert-left.jpg",
    tag: "QUALITY EXCELLENCE",
    features: [
      "Rigorous quality control on LED lamp batches and IC drivers",
      "Standardized fabrication and CNC machining processes",
      "Documented multi-stage inspection before site dispatch",
      "Full traceability for every installed cabinet and power supply"
    ]
  },
  {
    id: "iso-14001",
    title: "Environmental & Safety Management",
    code: "ISO 14001:2015 & ISO 45001:2018",
    scope: "Environmentally Responsible Manufacturing, Sustainable Materials, Zero-Accident Site Protocols & Energy Efficient Display Systems.",
    issuingBody: "International Environmental & Safety Standards",
    image: "/images/certificates/cert-center.jpg",
    tag: "SAFETY & ENVIRONMENT",
    features: [
      "Eco-solvent inks and RoHS compliant electronics",
      "Low power consumption high-efficiency cathode LED technology",
      "Zero-accident occupational safety protocols across all 476+ cities",
      "Sustainable waste segregation in workshops and production floors"
    ]
  },
  {
    id: "ce-msme",
    title: "CE Conformity & MSME Registration",
    code: "CE Marking & MSME Certified",
    scope: "Conformity with European Health, Safety, and Environmental Protection Directives, and Registered Enterprise with Ministry of MSME, Govt. of India.",
    issuingBody: "European Conformity & Govt. of India",
    image: "/images/certificates/cert-right.jpg",
    tag: "COMPLIANCE & OEM",
    features: [
      "Electromagnetic Compatibility (EMC) tested electronics",
      "Low Voltage Directive (LVD) certified safe power distribution",
      "Registered Indian Enterprise under Ministry of MSME",
      "Make In India verified indigenous assembly & display engineering"
    ]
  },
  {
    id: "master-credentials",
    title: "Official Corporate Credentials & Accreditations",
    code: "Master Credentials Document",
    scope: "Comprehensive official credential sheet confirming all accreditations, government registrations, and international compliance certificates.",
    issuingBody: "ACE SELECT Corporate Quality Directorate",
    image: "/images/certificates/certificates-page.jpg",
    tag: "FULL CREDENTIALS",
    features: [
      "Complete Page 3 official certificate presentation",
      "Direct verification of active credential status",
      "Authorized corporate registrations for central and state tenders",
      "Recognized by major public sector and private institutions"
    ]
  }
];

export default function CertificatesShowcase() {
  const [activeModal, setActiveModal] = useState<Certificate | null>(null);

  return (
    <section className="bg-white py-24 border-b border-neutral-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionReveal className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solvorry-DEFAULT/10 border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                OFFICIAL ACCREDITATIONS & CERTIFICATES
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight leading-[1.08]">
                CERTIFIED TO<br />
                <span className="text-solvorry-DEFAULT">GLOBAL STANDARDS.</span>
              </h2>
            </div>
            <p className="text-neutral-600 max-w-xl font-body text-base leading-relaxed">
              Every Active LED display, signage totem, and commercial installation delivered by ACE SELECT conforms to internationally accredited quality, environmental, and occupational safety frameworks. View the authentic certificates from our official credentials.
            </p>
          </div>
        </SectionReveal>

        {/* Certificate Badges Ribbon */}
        <SectionReveal delay={100} className="mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-[#F7F8FA] border border-neutral-200 rounded-sm">
            {[
              { label: "ISO 9001:2015", sub: "Quality Management", icon: <Award className="w-5 h-5 text-solvorry-DEFAULT" /> },
              { label: "ISO 14001:2015", sub: "Environmental", icon: <ShieldCheck className="w-5 h-5 text-solvorry-DEFAULT" /> },
              { label: "ISO 45001:2018", sub: "Health & Safety", icon: <CheckCircle2 className="w-5 h-5 text-solvorry-DEFAULT" /> },
              { label: "CE CERTIFIED", sub: "European Safety", icon: <FileCheck className="w-5 h-5 text-solvorry-DEFAULT" /> },
              { label: "MSME INDIA", sub: "Govt. Registered", icon: <Building2 className="w-5 h-5 text-solvorry-DEFAULT" /> },
              { label: "MAKE IN INDIA", sub: "Indigenous OEM", icon: <Wrench className="w-5 h-5 text-solvorry-DEFAULT" /> },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 bg-white border border-neutral-200/80 rounded-sm shadow-2xs">
                <div className="mb-2 p-2 bg-solvorry-DEFAULT/10 rounded-full">
                  {badge.icon}
                </div>
                <span className="font-display font-black text-xs tracking-tight text-neutral-900">{badge.label}</span>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide mt-0.5">{badge.sub}</span>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Certificate Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certificates.map((cert, index) => (
            <SectionReveal key={cert.id} delay={index * 120} direction="up">
              <div className="group bg-white border border-neutral-200 hover:border-solvorry-DEFAULT transition-all duration-300 rounded-sm overflow-hidden flex flex-col h-full shadow-xs hover:shadow-lg">
                {/* Certificate Scanned Image Container */}
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden border-b border-neutral-200 p-3 flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badge Pill */}
                  <div className="absolute top-4 left-4 bg-[#0B0F2B]/90 backdrop-blur-md px-3 py-1 text-white font-display font-bold text-[9px] tracking-widest uppercase rounded-xs">
                    {cert.tag}
                  </div>

                  {/* Hover Overlay with Action Button */}
                  <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
                    <button
                      onClick={() => setActiveModal(cert)}
                      className="bg-solvorry-DEFAULT text-white px-5 py-3 font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 shadow-lg hover:bg-solvorry-dark transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" /> VIEW FULL DOCUMENT
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <div className="text-[11px] font-display font-bold tracking-widest text-solvorry-DEFAULT uppercase mb-1">
                      {cert.code}
                    </div>
                    <h3 className="font-display font-black text-xl text-neutral-900 tracking-tight mb-3">
                      {cert.title}
                    </h3>
                    <p className="text-neutral-600 font-body text-xs leading-relaxed mb-4">
                      {cert.scope}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => setActiveModal(cert)}
                      className="w-full text-left font-display font-bold text-[10px] tracking-widest uppercase text-solvorry-DEFAULT hover:text-solvorry-dark transition-colors inline-flex items-center justify-between group-hover:translate-x-1 duration-200"
                    >
                      <span>INSPECT CERTIFICATE SCAN</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Manufacturing & Engineering Commitment Box */}
        <SectionReveal delay={200} className="mt-16">
          <div className="bg-[#0B0F2B] text-white p-8 md:p-12 rounded-sm border-l-4 border-solvorry-DEFAULT">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="text-solvorry-light font-display font-bold text-xs tracking-widest uppercase mb-2">
                  5-YEAR STANDARD COMMERCIAL WARRANTY
                </div>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight mb-4">
                  Built to Perform in Indian Environmental Conditions
                </h3>
                <p className="text-white/80 font-body text-sm leading-relaxed max-w-3xl">
                  ACE SELECT’s Active LED and DOOH display systems are engineered specifically for Indian voltage fluctuations, ambient dust, humidity, and high summer temperatures. Backed by 36/40 in-house engineers and nationwide service coverage in over 476+ cities.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-solvorry-light flex-shrink-0" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">Minimum Installation Period</div>
                    <div className="text-xs text-white/60">Rapid turnaround time nationwide</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-solvorry-light flex-shrink-0" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">256-Bit Encrypted Cloud</div>
                    <div className="text-xs text-white/60">Hosted on Indian JIO SOFTWARE servers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* Lightbox / High-Res Certificate Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col rounded-sm shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#0B0F2B] text-white flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-light">
                  {activeModal.code}
                </span>
                <h3 className="font-display font-black text-xl text-white tracking-tight">
                  {activeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="flex-1 bg-neutral-900 p-4 sm:p-8 overflow-auto flex items-center justify-center min-h-[300px]">
              <img
                src={activeModal.image}
                alt={activeModal.title}
                className="max-h-[65vh] w-auto object-contain mx-auto shadow-2xl rounded-xs"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-neutral-200">
              <p className="text-neutral-700 font-body text-xs sm:text-sm leading-relaxed mb-3">
                <strong>Certified Scope:</strong> {activeModal.scope}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                {activeModal.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-solvorry-DEFAULT flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
