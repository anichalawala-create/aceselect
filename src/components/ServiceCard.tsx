"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  index?: number;
}

export default function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  return (
    <div 
      className="bg-neutral-50 p-8 border border-neutral-200 hover:border-solvorry-DEFAULT transition-colors duration-300 group h-full flex flex-col relative overflow-hidden"
    >
      {/* Subtle line decoration */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-solvorry-DEFAULT scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      
      {/* Icon Container */}
      <div className="w-12 h-12 flex items-center justify-center text-solvorry-DEFAULT mb-8 transition-transform duration-500 group-hover:-translate-y-1">
        <span className="flex items-center justify-center w-full h-full [&>svg]:w-6 [&>svg]:h-6">
          {icon}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-xl text-solvorry-dark mb-4 group-hover:text-solvorry-DEFAULT transition-colors">
        {title}
      </h3>
      <p className="text-neutral-600 font-light text-sm mb-10 leading-relaxed flex-grow">
        {description}
      </p>

      {/* CTA */}
      <Link
        href={href}
        className="inline-flex items-center gap-3 text-[10px] font-display font-bold uppercase tracking-widest text-solvorry-dark group-hover:text-solvorry-DEFAULT transition-colors"
        aria-label={`Learn more about ${title}`}
      >
        Explore
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
