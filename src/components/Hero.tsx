"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
      aria-label="Hero section"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="w-full h-full object-cover opacity-40"
          aria-hidden="true"
        >
          <source src="/videos/hero-billboard.mp4" type="video/mp4" />
          <source src="/videos/hero-billboard.webm" type="video/webm" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-navy/60" />
        {/* Radial highlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-brand/10 blur-[100px]" />
      </div>

      {/* Grid overlay pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand/30 text-brand-light text-xs font-display font-semibold tracking-[0.15em] uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          ISO 9001:2015 Certified · 18+ Years of Excellence
        </div>

        {/* Main headline — dual slides baked in */}
        <h1 className="font-display font-bold text-display-xl text-white mb-6 max-w-5xl mx-auto">
          We Build Brands With{" "}
          <span className="gradient-text">360° Solutions.</span>
        </h1>

        <p className="font-body text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Full-Service Advertising & Branding Agency. Take control of your
          business success with a partner who delivers results.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-light text-white font-display font-semibold rounded-2xl transition-all duration-300 hover:shadow-glow hover:scale-105 text-lg"
          >
            Start Your Brand Journey
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            href="/who-we-are"
            className="inline-flex items-center gap-2 px-8 py-4 glass border border-white/10 text-white font-display font-semibold rounded-2xl hover:bg-white/5 transition-all duration-300 text-lg"
          >
            Discover Our Story
          </Link>
        </div>

        {/* Stats quick preview */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: "₹100 Cr+", label: "Annual Turnover" },
            { value: "5364+", label: "Projects Delivered" },
            { value: "476+", label: "Cities Served" },
            { value: "28+", label: "Years of Excellence" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-3xl text-white mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-500 text-sm font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-xs font-body tracking-[0.15em] uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}
