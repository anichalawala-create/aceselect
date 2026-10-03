"use client";

import { useState } from "react";
import { Star, MessageSquareQuote, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_company: string;
  is_featured: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.",
    author_name: "Rohit Sharma",
    author_title: "Head - ATM Deployments & Infrastructure",
    author_company: "HITACHI PAYMENT SERVICES",
    is_featured: true,
  },
  {
    id: "2",
    quote: "Their end-to-end support from optical design to retail installation made our flagship in-store LED display rollouts smooth and flawless.",
    author_name: "Neha Verma",
    author_title: "Marketing & Retail Projects Head",
    author_company: "TITAN COMPANY / CARATLANE",
    is_featured: true,
  },
  {
    id: "3",
    quote: "Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch branding and display systems.",
    author_name: "Amit Khanna",
    author_title: "Chief Manager - Infrastructure & Branding",
    author_company: "STATE BANK OF INDIA",
    is_featured: true,
  },
];

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  function toggleFeatured(id: string) {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_featured: !t.is_featured } : t))
    );
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Client Testimonials</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Executive feedback and endorsements featured on the ACE SELECT public portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#283A97] tracking-wider uppercase">
                  {t.author_company}
                </span>
                <button
                  onClick={() => toggleFeatured(t.id)}
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold cursor-pointer ${
                    t.is_featured
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {t.is_featured ? "Featured" : "Standard"}
                </button>
              </div>
              <p className="text-sm text-neutral-700 italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900">{t.author_name}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{t.author_title}</p>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                title="Delete testimonial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
