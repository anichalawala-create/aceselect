"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { clientService } from "@/services/clientService";

export default function ClientPortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("client@demo.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail("client@demo.com");
    setPassword("password123");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await clientService.login(email, password);
      if (res.success) {
        router.push("/client-portal/dashboard");
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F2B] flex flex-col font-body selection:bg-[#283A97] selection:text-white">
      {/* Top Section: Architectural Hero Image with Overlay */}
      <div className="relative min-h-[50vh] sm:min-h-[55vh] flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.7] contrast-[1.1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop')",
          }}
        />
        {/* Editorial Blue/Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F2B]/80 via-[#0B0F2B]/50 to-[#0B0F2B]/95 pointer-events-none" />

        {/* Top Header: Logo + Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display font-black text-lg sm:text-xl tracking-[0.2em] text-white uppercase">
              ACE SELECT
            </span>
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/70">
              CLIENT PORTAL
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Ace Select
          </Link>
        </div>

        {/* Hero Headings */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] uppercase">
            YOUR PROJECTS.
            <br />
            <span className="text-blue-300">CONNECTED.</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/85 font-normal mt-3 max-w-sm leading-relaxed">
            Track projects, site progress, approvals and documentation in one place.
          </p>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-widest text-white/50">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          ISO 9001:2015 CERTIFIED ENTERPRISE PLATFORM
        </div>
      </div>

      {/* Bottom Section: White Login Sheet */}
      <div className="flex-1 bg-white text-[#0B0D12] rounded-t-3xl -mt-4 relative z-20 shadow-2xl p-6 sm:p-10 flex flex-col justify-between max-w-xl mx-auto w-full">
        <div>
          {/* Quick Demo Helper Banner */}
          <div className="mb-5 p-3 bg-blue-50/80 border border-blue-200/80 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#283A97] shrink-0" />
              <span className="text-[11px] text-neutral-700">
                Demo: <strong>client@demo.com</strong> / <strong>password123</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-display font-bold text-[#283A97] hover:underline uppercase tracking-wider shrink-0 ml-2"
            >
              Auto Fill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#59616D] mb-1.5">
                WORK EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@demo.com"
                className="w-full px-3.5 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0B0D12] placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:ring-1 focus:ring-[#283A97] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#59616D] mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-11 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0B0D12] placeholder:text-neutral-400 focus:outline-none focus:border-[#283A97] focus:ring-1 focus:ring-[#283A97] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#0B0D12] p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#283A97] hover:bg-[#1f2d77] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN →"}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => alert("Password reset link has been dispatched to client@demo.com")}
                className="text-xs font-semibold text-[#283A97] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[11px] text-neutral-400 font-body">
          © 2026 ACE SELECT. Designed for Pan-India Scale & Execution.
        </div>
      </div>
    </div>
  );
}
