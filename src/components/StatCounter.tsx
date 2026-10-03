"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export function Counter({ end, suffix = "", prefix = "", duration = 2000 }: Omit<StatCounterProps, "label">) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatCounter({ end, suffix, prefix, label, duration }: StatCounterProps) {
  return (
    <div className="text-center group">
      <div className="font-display font-bold text-5xl lg:text-6xl text-white mb-2 tabular-nums">
        <Counter end={end} suffix={suffix} prefix={prefix} duration={duration} />
      </div>
      <div className="text-neutral-400 font-body text-sm tracking-wide uppercase">{label}</div>
    </div>
  );
}

interface StatsBandProps {
  stats: Array<{ value: number; suffix?: string; prefix?: string; label: string }>;
}

export default function StatsBand({ stats }: StatsBandProps) {
  return (
    <section className="py-20 bg-navy-mid border-y border-white/5" aria-label="Company statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              end={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
