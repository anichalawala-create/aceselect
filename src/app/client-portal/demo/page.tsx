"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MobileDeviceSimulator } from "@/components/portal/MobileDeviceSimulator";

function ClientDemoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const screenId = searchParams.get("screen") || "02";

  return (
    <MobileDeviceSimulator
      initialScreenId={screenId}
      onClose={() => router.push("/client-portal/dashboard")}
    />
  );
}

export default function ClientDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F2B] flex items-center justify-center text-white font-display">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest text-white/60">
              Launching Client Demo Suite...
            </span>
          </div>
        </div>
      }
    >
      <ClientDemoContent />
    </Suspense>
  );
}
