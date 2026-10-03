import React from "react";
import Link from "next/link";
import {
  MapPin,
  CheckSquare,
  FileText,
  Hammer,
  Eye,
  Truck,
  ArrowRight,
} from "lucide-react";
import { ProjectUpdate } from "@/types/portal";

interface ActivityFeedProps {
  updates: ProjectUpdate[];
  showViewAllLink?: boolean;
}

export function ActivityFeed({ updates, showViewAllLink = true }: ActivityFeedProps) {
  const getIcon = (type: ProjectUpdate["type"]) => {
    switch (type) {
      case "inspection":
        return <MapPin className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
      case "approval":
        return <CheckSquare className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
      case "production":
        return <Hammer className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
      case "survey":
        return <Eye className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
      case "delivery":
        return <Truck className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-solvorry-DEFAULT" />;
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[6px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
        <h3 className="font-display font-bold text-base text-[#0B0D12]">
          Project Activity
        </h3>
        {showViewAllLink && (
          <Link
            href="/client-portal/updates"
            className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-solvorry-DEFAULT uppercase tracking-wider hover:underline"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E5E7EB]">
        {updates.map((upd) => (
          <div key={upd.id} className="relative group">
            {/* Timeline Icon Node */}
            <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:border-solvorry-DEFAULT group-hover:bg-solvorry-DEFAULT group-hover:text-white transition-colors duration-200">
              {getIcon(upd.type)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h4 className="font-display font-bold text-xs text-[#0B0D12] group-hover:text-solvorry-DEFAULT transition-colors">
                  {upd.title}
                </h4>
                <p className="text-[11px] text-neutral-500 font-body">
                  {upd.subtitle}
                </p>
                {upd.details && (
                  <p className="text-[11px] text-neutral-400 font-body mt-1 leading-snug line-clamp-2">
                    {upd.details}
                  </p>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 font-body shrink-0 tabular-nums">
                {upd.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showViewAllLink && (
        <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center">
          <Link
            href="/client-portal/updates"
            className="text-xs font-display font-bold text-solvorry-DEFAULT uppercase tracking-wider hover:underline inline-flex items-center gap-1"
          >
            View all activity <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
