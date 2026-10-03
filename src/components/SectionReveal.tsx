"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  // On mobile screens (< md), horizontal translations are replaced with translate-y-8
  // to completely eliminate horizontal document overflow and side scroll gaps.
  const initialTransformClass = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-y-8 md:-translate-x-10",
    right: "translate-y-8 md:translate-x-10",
    none: "",
  }[direction];

  return (
    <div
      ref={ref}
      className={`max-w-full transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${initialTransformClass}`
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
