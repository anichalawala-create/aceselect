"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, Plus, Minus } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                FILTER TABS                                 */
/* -------------------------------------------------------------------------- */

interface FilterOption {
  label: string;
  value: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Filter System for Projects. 
 * Thin outlined rectangular selectors. No modern pill-style filters everywhere.
 */
export function FilterTabs({ options, activeValue, onChange, className = "" }: FilterTabsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-6 py-2.5 text-xs font-display font-semibold uppercase tracking-widest transition-all duration-300 border ${
              isActive
                ? "bg-solvorry-DEFAULT border-solvorry-DEFAULT text-white"
                : "bg-transparent border-neutral-300 text-neutral-600 hover:border-solvorry-DEFAULT hover:text-solvorry-DEFAULT"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 ACCORDION                                  */
/* -------------------------------------------------------------------------- */

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export function AccordionItem({ question, answer, isOpen = false, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-neutral-200">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className={`font-display text-lg transition-colors duration-300 ${isOpen ? "font-bold text-solvorry-dark" : "font-semibold text-neutral-700 group-hover:text-solvorry-DEFAULT"}`}>
          {question}
        </span>
        <div className="shrink-0 ml-4 text-solvorry-DEFAULT">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="text-neutral-600 leading-relaxed font-light pr-12">
          {answer}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                BREADCRUMBS                                 */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

/**
 * Very minimal breadcrumbs on internal pages. Small uppercase text.
 */
export function Breadcrumbs({ items, className = "", light = false }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-widest ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={item.label}>
            {isLast ? (
              <span className="text-solvorry-DEFAULT">{item.label}</span>
            ) : (
              <>
                {item.href ? (
                  <Link href={item.href} className={`transition-colors ${light ? "text-white/60 hover:text-white" : "text-neutral-500 hover:text-solvorry-dark"}`}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={light ? "text-white/60" : "text-neutral-500"}>{item.label}</span>
                )}
                <span className={`mx-1 ${light ? "text-white/30" : "text-neutral-300"}`}>/</span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SCROLL INDICATOR                               */
/* -------------------------------------------------------------------------- */

interface ScrollIndicatorProps {
  text?: string;
  className?: string;
  light?: boolean;
}

/**
 * Minimal and editorial scroll interactions.
 */
export function ScrollIndicator({ text = "SCROLL", className = "", light = true }: ScrollIndicatorProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${light ? "text-white" : "text-solvorry-dark"} ${className}`}>
      <span className="text-[10px] font-display font-bold tracking-widest uppercase drop-shadow-sm">
        {text}
      </span>
      <div className={`w-[1px] h-12 relative ${light ? "bg-white/30" : "bg-solvorry-dark/20"}`}>
        <div className={`absolute top-0 w-full h-4 animate-bounce ${light ? "bg-white" : "bg-solvorry-DEFAULT"}`} />
      </div>
      <ArrowDown className="w-3 h-3" />
    </div>
  );
}
