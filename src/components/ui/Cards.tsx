import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                               PROJECT CARD                                 */
/* -------------------------------------------------------------------------- */

interface ProjectCardProps {
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  href: string;
  className?: string;
}

/**
 * Editorial photography project card.
 * Minimalist with bottom text overlay, no gradients over the whole card, no heavy shadows.
 */
export function ProjectCard({ title, category, location, imageUrl, href, className = "" }: ProjectCardProps) {
  const isVideo = !!imageUrl && /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(imageUrl);

  return (
    <Link href={href} className={`group block relative overflow-hidden bg-neutral-900 rounded-[4px] aspect-[4/5] sm:aspect-[3/4] ${className}`}>
      {isVideo ? (
        <video
          src={imageUrl}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      
      {/* Subtle bottom overlay for text readability */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 transition-opacity duration-300 group-hover:from-black/90">
        <h3 className="font-display font-bold text-white text-xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 transition-transform duration-300 group-hover:-translate-y-1">
            <span className="text-[10px] font-display font-semibold tracking-widest text-white/70 uppercase">
              {category}
            </span>
            <span className="text-[10px] font-display tracking-widest text-white/50 uppercase">
              {location}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-display font-bold tracking-widest text-white uppercase opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            VIEW PROJECT
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                             CAPABILITY CARD                                */
/* -------------------------------------------------------------------------- */

interface CapabilityCardProps {
  title: string;
  imageUrl: string;
  href: string;
  className?: string;
}

/**
 * Large photographic tile for capabilities.
 * Dark subtle overlay, text, and arrow.
 */
export function CapabilityCard({ title, imageUrl, href, className = "" }: CapabilityCardProps) {
  return (
    <Link href={href} className={`group block relative overflow-hidden bg-neutral-900 rounded-[4px] aspect-square md:aspect-[4/3] ${className}`}>
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-60"
      />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <h3 className="font-display font-bold text-white text-2xl max-w-[80%] leading-tight transition-transform duration-300 group-hover:-translate-y-1">
            {title}
          </h3>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white shrink-0 transition-all duration-300 group-hover:bg-solvorry-DEFAULT group-hover:border-solvorry-DEFAULT group-hover:-translate-y-1">
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
