"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isClientPortal = pathname?.startsWith("/client-portal");

  if (isAdmin) {
    return (
      <div className="w-full min-h-screen">
        {children}
        <ChatWidget />
      </div>
    );
  }

  if (isClientPortal) {
    return <main className="min-h-screen bg-[#F7F8FA] text-[#0B0D12]">{children}</main>;
  }

  return (
    <SmoothScroll>
      <div className="w-full max-w-full overflow-x-hidden relative min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-full overflow-x-hidden flex-1">{children}</main>
        <Footer />
        <BottomNav />
        <ChatWidget />
        <WhatsAppButton />
      </div>
    </SmoothScroll>
  );
}
