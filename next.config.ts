import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Allow production builds even with TS errors (stub pages)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/videos/homepage-hero.mp4",
        destination: "/home-hero.mp4",
      },
      {
        source: "/videos/home-hero.mp4",
        destination: "/home-hero.mp4",
      },
      {
        source: "/videos/company-bg.mp4",
        destination: "/company-hero.mp4",
      },
      {
        source: "/videos/company-hero.mp4",
        destination: "/company-hero.mp4",
      },
    ];
  },
};

export default nextConfig;
