import React from "react";

interface ProgressBarProps {
  progress?: number;
  value?: number;
  showLabel?: boolean;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  barColor?: string;
}

export function ProgressBar({
  progress,
  value,
  showLabel = false,
  showValue = false,
  size = "md",
  className = "",
  barColor = "bg-[#283A97]",
}: ProgressBarProps) {
  const actualValue = value !== undefined ? value : (progress !== undefined ? progress : 0);
  const clamped = Math.min(100, Math.max(0, actualValue));
  const shouldShowLabel = showLabel || showValue;

  const heightClass =
    size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <div className={`flex-1 ${heightClass} bg-[#E5E7EB] rounded-full overflow-hidden`}>
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {shouldShowLabel && (
        <span className="text-xs font-display font-bold text-neutral-700 min-w-[36px] text-right tabular-nums">
          {clamped}%
        </span>
      )}
    </div>
  );
}
