import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                  EYEBROW                                   */
/* -------------------------------------------------------------------------- */

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

/**
 * Eyebrow Labels (Signature 02)
 * Small uppercase labels with a thin #283A97 line beside it.
 */
export function Eyebrow({ children, className = "", light = false }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-4 h-[1px] bg-solvorry-DEFAULT" />
      <span className={`text-[11px] font-display font-bold uppercase tracking-[0.2em] ${light ? "text-white/60" : "text-[#4B5563]"}`}>
        {children}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            EDITORIAL HEADLINE                              */
/* -------------------------------------------------------------------------- */

interface EditorialHeadlineProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  light?: boolean;
}

/**
 * Large editorial headlines (Signature 03)
 */
export function EditorialHeadline({ 
  children, 
  className = "", 
  as: Component = "h2",
  light = false
}: EditorialHeadlineProps) {
  return (
    <Component className={`font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] ${light ? "text-white" : "text-solvorry-dark"} ${className}`}>
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SECTION HEADER                                 */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  light?: boolean;
}

/**
 * Reusable section header component.
 * Features: small eyebrow with line, large heading, optional description, optional text link.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  linkText,
  linkHref,
  className = "",
  light = false
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 ${className}`}>
      <div className="max-w-3xl">
        <Eyebrow light={light} className="mb-6">{eyebrow}</Eyebrow>
        <EditorialHeadline light={light} className="mb-6">{title}</EditorialHeadline>
        
        {description && (
          <p className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl ${light ? "text-white/70" : "text-neutral-600"}`}>
            {description}
          </p>
        )}
      </div>

      {linkText && linkHref && (
        <div className="shrink-0 mb-2">
          <Link 
            href={linkHref} 
            className={`group inline-flex items-center gap-2 text-sm font-display font-semibold uppercase tracking-wider hover:underline underline-offset-4 transition-all ${
              light ? "text-white" : "text-solvorry-DEFAULT"
            }`}
          >
            {linkText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
