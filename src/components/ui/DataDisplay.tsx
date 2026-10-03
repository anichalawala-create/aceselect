import React from "react";

/* -------------------------------------------------------------------------- */
/*                                   METRIC                                   */
/* -------------------------------------------------------------------------- */

interface MetricProps {
  icon?: React.ReactNode;
  value: string;
  label: string;
  className?: string;
  showDivider?: boolean;
}

/**
 * Very clean enterprise metric treatment. No floating cards.
 * Small icon, huge number in #283A97, small uppercase label, thin vertical divider.
 */
export function Metric({ icon, value, label, className = "", showDivider = true }: MetricProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center py-8 ${className}`}>
      {icon && (
        <div className="text-neutral-400 mb-6 shrink-0">
          {icon}
        </div>
      )}
      <div className="font-display font-bold text-5xl md:text-6xl text-solvorry-DEFAULT mb-4">
        {value}
      </div>
      <div className="text-neutral-500 font-display font-semibold tracking-widest text-xs uppercase">
        {label}
      </div>
      
      {showDivider && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-24 bg-neutral-200" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 TIMELINE                                   */
/* -------------------------------------------------------------------------- */

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

/**
 * Horizontal timeline. Architectural and technical.
 */
export function Timeline({ steps, className = "" }: TimelineProps) {
  return (
    <div className={`flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 overflow-x-auto pb-8 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex-1 min-w-[200px] relative group">
          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-4 left-8 right-[-1rem] h-[1px] bg-neutral-200 z-0" />
          )}
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-300 ${
              step.active 
                ? "bg-solvorry-DEFAULT text-white scale-110" 
                : "bg-white border border-neutral-300 text-neutral-500 group-hover:border-solvorry-DEFAULT group-hover:text-solvorry-DEFAULT"
            }`}>
              {step.number}
            </div>
            
            <div>
              <h4 className={`font-display font-bold text-sm tracking-widest uppercase mb-2 ${step.active ? "text-solvorry-dark" : "text-neutral-700"}`}>
                {step.title}
              </h4>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-[240px]">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            TESTIMONIAL BLOCK                               */
/* -------------------------------------------------------------------------- */

interface TestimonialProps {
  quote: string;
  authorName: string;
  authorDesignation: string;
  authorCompany: string;
  className?: string;
  light?: boolean;
}

/**
 * Editorial quote blocks. No giant 5-star widgets.
 */
export function TestimonialBlock({ 
  quote, 
  authorName, 
  authorDesignation, 
  authorCompany, 
  className = "",
  light = false
}: TestimonialProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`text-6xl font-serif mb-4 leading-none h-8 ${light ? "text-white/20" : "text-neutral-200"}`}>
        &ldquo;
      </div>
      <p className={`font-display text-xl md:text-2xl font-light leading-relaxed mb-10 ${light ? "text-white" : "text-solvorry-dark"}`}>
        {quote}
      </p>
      <div>
        <div className={`font-display font-bold text-sm uppercase tracking-wider mb-1 ${light ? "text-white" : "text-solvorry-dark"}`}>
          {authorName}
        </div>
        <div className={`text-sm font-medium ${light ? "text-white/60" : "text-neutral-500"}`}>
          {authorDesignation}, {authorCompany}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                CLIENT WALL                                 */
/* -------------------------------------------------------------------------- */

interface ClientLogo {
  name: string;
  src: string;
}

interface ClientWallProps {
  logos: ClientLogo[];
  className?: string;
}

/**
 * Clean horizontal brand wall. Monochrome logos, equal visual height, generous spacing.
 */
export function ClientWall({ logos, className = "" }: ClientWallProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center md:justify-between gap-12 md:gap-8 ${className}`}>
      {logos.map((logo, idx) => (
        <div key={idx} className="flex items-center justify-center shrink-0 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
          <img 
            src={logo.src} 
            alt={logo.name} 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}
