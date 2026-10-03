"use client";

import Image from "next/image";

const clients = [
  { name: "ICICI Bank", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=ICICI+Bank" },
  { name: "DBS Bank", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=DBS+Bank" },
  { name: "Aditya Birla Capital", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Aditya+Birla" },
  { name: "Aldo", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=ALDO" },
  { name: "Charles & Keith", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Charles+%26+Keith" },
  { name: "Beverly Hills Polo Club", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=BHPC" },
  { name: "Apollo Tyres", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Apollo+Tyres" },
  { name: "Pirelli Tyres", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Pirelli" },
  { name: "CEAT Tyres", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=CEAT" },
  { name: "Goodyear", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Goodyear" },
  { name: "Bridgestone", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Bridgestone" },
  { name: "Baskin Robbins", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Baskin+Robbins" },
  { name: "Faces Canada", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Faces+Canada" },
  { name: "Faber-Castell", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Faber-Castell" },
  { name: "Nitco Tiles", logo: "https://placehold.co/160x60/283A97/FFFFFF?text=Nitco+Tiles" },
];

// Duplicate array for seamless loop
const doubledClients = [...clients, ...clients];

export default function LogoMarquee() {
  return (
    <section className="py-16 bg-navy-mid border-y border-white/5 overflow-hidden" aria-label="Our prestigious clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-neutral-500 text-xs font-display font-semibold tracking-[0.2em] uppercase mb-2">
          Trusted By
        </p>
        <h2 className="font-display font-bold text-display-sm text-white">
          Our Prestigious Clients
        </h2>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-navy-mid to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-navy-mid to-transparent z-10 pointer-events-none" />

        <div className="flex items-center animate-marquee" aria-hidden="false">
          {doubledClients.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex-shrink-0 mx-8 sm:mx-12 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <Image
                src={client.logo}
                alt={`${client.name} — Ace Select client`}
                width={160}
                height={60}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
