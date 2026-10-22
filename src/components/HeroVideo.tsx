"use client";

import React, { useState, useRef, useEffect } from "react";

interface HeroVideoProps {
  videoSrc?: string;
  poster?: string;
  className?: string;
}

export default function HeroVideo({
  videoSrc = "/home-hero.mp4",
  poster = "",
  className = "",
}: HeroVideoProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Normalize URLs to always point to guaranteed existing assets
  const effectiveSrc = videoSrc && videoSrc.trim() ? videoSrc : "/home-hero.mp4";
  const isDefaultVideo = effectiveSrc === "/home-hero.mp4" || effectiveSrc === "/videos/homepage-hero.mp4";
  const effectivePoster = poster && poster.trim() ? poster : (isDefaultVideo ? "/home-hero-poster.jpg" : "");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Browser policy: enforce muted property on DOM node to permit immediate background autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsVideoLoaded(true);
          })
          .catch(() => {
            // If browser blocks autoplay, poster frame remains smoothly displayed
          });
      }
    };

    if (video.readyState >= 2) {
      setIsVideoLoaded(true);
      playVideo();
    } else {
      video.addEventListener("loadeddata", () => setIsVideoLoaded(true), { once: true });
      video.addEventListener("canplay", () => setIsVideoLoaded(true), { once: true });
      playVideo();
    }
  }, [effectiveSrc]);

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => {
        setIsVideoLoaded(true);
      })
      .catch(() => {});
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 1. Instant-loading high-resolution poster frame (visible as foundation) */}
      {effectivePoster ? (
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src={effectivePoster}
            alt="ACE SELECT Active LED Video Walls and Digital Displays"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </picture>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#0B0F2B]" />
      )}

      {/* 2. Hardware-accelerated background video with multi-source fallback */}
      <video
        key={effectiveSrc}
        ref={videoRef}
        poster={effectivePoster || undefined}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={handleVideoReady}
        onLoadedData={handleVideoReady}
        onPlaying={() => setIsVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={effectiveSrc} type="video/mp4" />
      </video>

      {/* 3. Dark gradient overlay for typography readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F2B] via-[#0B0F2B]/80 to-transparent mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
}
