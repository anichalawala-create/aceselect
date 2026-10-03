import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACE SELECT | Advertising, Branding & Commercial Construction",
  description:
    "ACE SELECT is a trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India with ₹100 Cr+ turnover. Guided by Founder Mr. Kamal Gor, delivering Design-to-Build solutions and Cloud CMS hosted on Jio Software.",
  keywords: [
    "ACE SELECT",
    "Kamal Gor",
    "Advertising agency",
    "Branding agency",
    "Commercial Construction",
    "LED Displays",
    "Retail Rollouts",
    "Design to Build",
    "Jio Software CMS",
    "Pan India",
  ],
  openGraph: {
    title: "ACE SELECT | Advertising, Branding & Commercial Construction",
    description:
      "Design-to-Build solutions across 476+ cities in India. Trusted leader in Advertising, Branding, and Commercial Construction.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jakarta.variable} font-body bg-white text-neutral-800 antialiased`}
      >
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
