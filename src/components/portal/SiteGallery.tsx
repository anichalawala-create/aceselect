"use client";

import React, { useState } from "react";
import { SitePhoto } from "@/types/portal";
import { X, ZoomIn } from "lucide-react";

interface SiteGalleryProps {
  photos: SitePhoto[];
}

export function SiteGallery({ photos }: SiteGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<SitePhoto | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F7F8FA] border border-[#E5E7EB] rounded-[6px] text-xs text-neutral-500">
        No photographic records uploaded for this site yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group cursor-pointer bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden hover:border-solvorry-DEFAULT/40 hover:shadow-md transition-all duration-200"
          >
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                <ZoomIn className="w-5 h-5" />
                <span className="text-xs font-display font-bold uppercase tracking-wider">
                  Expand
                </span>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0B0F2B]/80 backdrop-blur-xs text-[9px] font-display font-bold uppercase tracking-wider text-white">
                {photo.category}
              </div>
            </div>

            <div className="p-3">
              <h5 className="font-display font-bold text-xs text-neutral-900 group-hover:text-solvorry-DEFAULT transition-colors truncate">
                {photo.title}
              </h5>
              <p className="text-[11px] text-neutral-500 font-body line-clamp-1 mt-0.5">
                {photo.caption}
              </p>
              <div className="text-[10px] text-neutral-400 mt-1 font-body">
                {photo.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-[8px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video max-h-[70vh] bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-solvorry-DEFAULT bg-blue-50 px-2 py-0.5 rounded">
                  {activePhoto.category}
                </span>
                <h4 className="font-display font-black text-lg text-neutral-900 mt-1">
                  {activePhoto.title}
                </h4>
                <p className="text-xs text-neutral-600 font-body mt-1">
                  {activePhoto.caption}
                </p>
                <div className="text-[11px] text-neutral-400 mt-2">
                  Captured: {activePhoto.timestamp}
                </div>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
