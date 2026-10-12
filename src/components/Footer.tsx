"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const footerLinks = {
  products: [
    { label: "Active Digital Displays", href: "/#products" },
    { label: "Digital Standees (32\" - 65\")", href: "/#products" },
    { label: "Video Wall Solutions", href: "/#products" },
    { label: "Static Signage & GSB", href: "/#products" },
    { label: "Interactive Kiosks", href: "/#products" },
    { label: "Signage Software & CMS", href: "/#products" },
  ],
  company: [
    { label: "About Us", href: "/who-we-are" },
    { label: "Our Story", href: "/who-we-are#our-story" },
    { label: "Careers", href: "/contact" },
    { label: "News & Insights", href: "/insights" },
  ],
  projects: [
    { label: "All Projects", href: "/projects" },
    { label: "Retail Stores", href: "/projects?category=retail" },
    { label: "Corporate Spaces", href: "/projects?category=corporate" },
    { label: "Outdoor Displays", href: "/projects?category=outdoor" },
  ],
  industries: [
    { label: "Retail & Lifestyle", href: "/industries/retail" },
    { label: "Banking & Finance", href: "/industries/finance" },
    { label: "Healthcare", href: "/industries/healthcare" },
    { label: "Automotive", href: "/industries/automotive" },
  ],
};

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: "(+91) 22 25182233",
    email: "info@aceselect.in",
    address: "C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai - 400079",
    footer_description: "Trusted leader in Advertising, Branding, and Commercial Construction across 476+ cities in India. Design-to-Build excellence under one roof.",
    copyright_text: `© ${new Date().getFullYear()} ACE SELECT. All rights reserved. ISO 9001:2015 Certified.`,
    facebook_url: "https://www.facebook.com/AceSelect",
    twitter_url: "https://twitter.com/ace_select",
    instagram_url: "https://www.instagram.com/ace_select/",
    linkedin_url: "https://www.linkedin.com/company/aceselectsocial/",
  });

  useEffect(() => {
    fetch("/api/admin/content?section=settings")
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res?.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
            phone: res.data.phone || prev.phone,
            email: res.data.email || prev.email,
            address: res.data.address || prev.address,
            footer_description: res.data.footer_description || prev.footer_description,
            copyright_text: res.data.copyright_text || prev.copyright_text,
            facebook_url: res.data.facebook_url || prev.facebook_url,
            twitter_url: res.data.twitter_url || prev.twitter_url,
            instagram_url: res.data.instagram_url || prev.instagram_url,
            linkedin_url: res.data.linkedin_url || prev.linkedin_url,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const socials = [
    { label: "Facebook", icon: <FacebookIcon />, href: settings.facebook_url },
    { label: "Twitter / X", icon: <TwitterIcon />, href: settings.twitter_url },
    { label: "Instagram", icon: <InstagramIcon />, href: settings.instagram_url },
    { label: "LinkedIn", icon: <LinkedinIcon />, href: settings.linkedin_url },
  ];

  return (
    <footer className="bg-[#0B0F2B] text-white pt-24 pb-8" aria-label="Site footer">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Info (2 columns span) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <img src="/logo.png" alt="Ace Select Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-white/70 font-body text-base leading-relaxed mb-8 max-w-sm">
              {settings.footer_description}
            </p>
            <div className="flex items-center gap-4">
              {socials.filter((s) => s.href).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-solvorry-DEFAULT hover:border-solvorry-DEFAULT hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-widest text-white mb-6 uppercase">Products</h4>
            <ul className="space-y-4">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest text-white mb-6 uppercase">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest text-white mb-6 uppercase">Projects</h4>
            <ul className="space-y-4">
              {footerLinks.projects.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest text-white mb-6 uppercase">Contact</h4>
            <div className="space-y-4">
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 text-white/70 hover:text-white text-sm font-body transition-colors">
                <Phone className="w-4 h-4 text-solvorry-DEFAULT" />
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/70 hover:text-white text-sm font-body transition-colors">
                <Mail className="w-4 h-4 text-solvorry-DEFAULT" />
                {settings.email}
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm font-body mt-4">
                <MapPin className="w-4 h-4 text-solvorry-DEFAULT mt-1 flex-shrink-0" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm font-body text-center md:text-left">
            {settings.copyright_text.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-6 text-sm font-body">
            <Link href="/privacy-policy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
