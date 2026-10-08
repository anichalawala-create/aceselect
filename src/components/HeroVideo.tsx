"use client";

import React, { useState, useRef, useEffect } from "react";

interface HeroVideoProps {
  videoSrc?: string;
  poster?: string;
  className?: string;
}

export default function HeroVideo({
  videoSrc = "/home-hero.mp4",
  poster = "/home-hero-poster.jpg",
  className = "",
}: HeroVideoProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if the video is already buffered / ready
    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
      video.play().catch(() => {});
    }
  }, []);

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .then(() => {
        setIsVideoLoaded(true);
      })
      .catch(() => {
        // If autoplay policy blocks playback, poster frame stays smoothly visible
        setIsVideoLoaded(false);
      });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 1. Saved Frame: Instant-loading poster to prevent blank screen */}
      <picture className="absolute inset-0 w-full h-full">
        {poster && <img
          src={poster}
          alt="ACE SELECT LED Digital Displays"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />}
      </picture>

      {/* 2. Faststart Optimized Video: Fades in seamlessly once ready */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={handleVideoReady}
        onLoadedData={handleVideoReady}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F2B] via-[#0B0F2B]/80 to-transparent mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
}
