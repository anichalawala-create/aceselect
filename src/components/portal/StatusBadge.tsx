import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const norm = status.toUpperCase().replace(/\s+/g, "_");

  let colorClasses = "bg-neutral-100 text-neutral-700 border-neutral-200";

  switch (norm) {
    case "ON_TRACK":
    case "COMPLETED":
    case "APPROVED":
      colorClasses = "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]";
      break;
    case "IN_PROGRESS":
      colorClasses = "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]";
      break;
    case "PENDING":
      colorClasses = "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]";
      break;
    case "DELAYED":
    case "REJECTED":
      colorClasses = "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]";
      break;
    case "CHANGES_REQUESTED":
      colorClasses = "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]";
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "text-[9px] px-2 py-0.5 tracking-wider font-bold"
      : "text-[10px] px-2.5 py-1 tracking-widest font-bold";

  return (
    <span
      className={`inline-flex items-center uppercase rounded-[4px] border ${colorClasses} ${sizeClasses} font-display ${className}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
