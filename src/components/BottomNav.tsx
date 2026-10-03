"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, Layers, MessageSquare } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Services", href: "/services", icon: Layers },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-white/90 via-white/80 to-transparent pointer-events-none">
      <nav className="mx-auto max-w-sm glass bg-white/80 backdrop-blur-lg border border-white shadow-xl rounded-2xl p-2 flex justify-between items-center pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.name}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${
                isActive ? "bg-solvorry/10 text-solvorry" : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-display font-semibold tracking-wide">
                {tab.name}
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-solvorry rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
