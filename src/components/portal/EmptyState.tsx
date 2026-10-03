import React from "react";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description = "There are no records matching your current filter criteria.",
  icon,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-[6px] p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-4">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="font-display font-bold text-base text-[#0B0D12] tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 font-body max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-solvorry-DEFAULT text-white font-display font-bold text-xs uppercase tracking-wider rounded-[4px] hover:bg-solvorry-dark transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
