import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  href?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
}

export function MetricCard({
  icon,
  value,
  label,
  href,
  iconBgColor = "bg-blue-50/50",
  iconBorderColor = "border-blue-200 text-solvorry-DEFAULT",
}: MetricCardProps) {
  const content = (
    <div className="bg-white p-6 border border-[#E5E7EB] rounded-[6px] hover:border-solvorry-DEFAULT/40 transition-all duration-200 flex items-center justify-between group shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-[6px] border ${iconBorderColor} ${iconBgColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200`}
        >
          {icon}
        </div>
        <div>
          <div className="font-display font-black text-3xl md:text-4xl text-[#0B0D12] tracking-tight leading-none mb-1.5 tabular-nums">
            {typeof value === "number" && value < 10 ? `0${value}` : value}
          </div>
          <div className="text-[10px] md:text-[11px] font-display font-bold uppercase tracking-[0.15em] text-neutral-500">
            {label}
          </div>
        </div>
      </div>
      {href && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-solvorry-DEFAULT group-hover:translate-x-1 transition-all duration-200">
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
