import React from "react";
import { TimelineStage } from "@/types/portal";
import { Check } from "lucide-react";

interface TimelineProps {
  stages: TimelineStage[];
  className?: string;
}

export function Timeline({ stages, className = "" }: TimelineProps) {
  return (
    <div className={`w-full py-4 ${className}`}>
      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-6 gap-2 relative">
        {/* Connecting bar */}
        <div className="absolute top-5 left-[8%] right-[8%] h-[2px] bg-[#E5E7EB] -z-0" />

        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div key={stage.id || idx} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-solvorry-DEFAULT text-white ring-4 ring-white shadow-sm"
                    : isCurrent
                    ? "bg-white border-2 border-solvorry-DEFAULT text-solvorry-DEFAULT ring-4 ring-solvorry-DEFAULT/15"
                    : "bg-white border border-[#E5E7EB] text-neutral-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>

              <div className="mt-3">
                <span
                  className={`text-xs font-display font-bold uppercase tracking-wider block ${
                    isCurrent
                      ? "text-solvorry-DEFAULT font-black"
                      : isCompleted
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {stage.name}
                </span>
                {stage.date && (
                  <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                    {stage.date}
                  </span>
                )}
              </div>

              {stage.description && (
                <p className="text-[11px] text-neutral-500 font-body mt-2 leading-snug px-2 line-clamp-2">
                  {stage.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet vertical view */}
      <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-[#E5E7EB] ml-4">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div key={stage.id || idx} className="relative">
              <div
                className={`absolute -left-[33px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs ${
                  isCompleted
                    ? "bg-solvorry-DEFAULT text-white"
                    : isCurrent
                    ? "bg-white border-2 border-solvorry-DEFAULT text-solvorry-DEFAULT"
                    : "bg-white border border-[#E5E7EB] text-neutral-400"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-display font-bold uppercase tracking-wider ${
                      isCurrent
                        ? "text-solvorry-DEFAULT font-black"
                        : isCompleted
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {stage.name}
                  </span>
                  {stage.date && (
                    <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                      {stage.date}
                    </span>
                  )}
                </div>
                {stage.description && (
                  <p className="text-xs text-neutral-500 font-body mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
