"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Monitor,
  LayoutGrid,
  Touchpad,
  Cpu,
  Check,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Complete Product Hierarchy extracted from ACE SELECT Official Hierarchy Diagram
export interface ProductItem {
  name: string;
  badge?: string;
  image?: string;
  specs?: string[];
  series?: string[];
}

export interface ProductGroup {
  heading: string;
  items: ProductItem[];
}

export interface ProductCategory {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: typeof Monitor;
  color: string;
  featuredProducts: ProductItem[];
  groups: ProductGroup[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "active-digital",
    title: "ACTIVE DIGITAL DISPLAY SOLUTIONS",
    shortTitle: "Active Displays",
    subtitle: "LED Walls & Standees",
    icon: Monitor,
    color: "from-blue-500 to-indigo-500",
    featuredProducts: [
      {
        name: "Indoor LED Video Wall",
        badge: "P1.2 - P3.0",
        image: "/images/products/indoor-smd-page1.jpg",
        specs: [
          "COB & SMD Fine Pixel Pitch (P1.2 to P3.0)",
          "High refresh rate >3840Hz & 16-bit grayscale",
          "160° ultra-wide horizontal & vertical viewing",
        ],
        series: ["COB Series", "SMD Series", "Fine Pixel Pitch"],
      },
      {
        name: "Outdoor LED Display",
        badge: ">6000 NITS",
        image: "/images/products/outdoor-smd-page1.jpg",
        specs: [
          ">6000 Nits high-brightness daylight readable",
          "IP65 waterproof all-weather die-cast cabinet",
          "ECO energy-saving low heat dissipation IC",
        ],
        series: ["Standard Outdoor", "ECO Series", "High Brightness"],
      },
      {
        name: "Digital Standee Displays",
        badge: "4K UHD",
        image: "/images/products/standee-banner.jpg",
        specs: [
          "32\" to 65\" commercial-grade 4K UHD panels",
          "4mm tempered explosion-proof protective glass",
          "Android OS / Windows plug & play media engine",
        ],
        series: ['32" Standee', '43" Standee', '55" Standee', '65" Standee'],
      },
      {
        name: "Active Architectural Video Wall",
        badge: "SEAMLESS",
        image: "/images/projects/real-proj-p18-bkc--mumbai.jpeg",
        specs: [
          "0.88mm ultra-narrow LCD & seamless LED video walls",
          "Mission-critical 24/7 control room reliability",
          "Hardware video matrix & distributed multi-windowing",
        ],
        series: ["Seamless LED", "LCD 0.88mm", "Command Centers"],
      },
    ],
    groups: [
      {
        heading: "A. LED Display Solutions",
        items: [
          {
            name: "Indoor LED Display",
            badge: "P1.2 - P3.0",
            series: ["COB Series", "SMD Series", "Fine Pixel Pitch Series"],
          },
          {
            name: "Outdoor LED Display",
            badge: ">6000 nits",
            series: ["Standard Outdoor Series", "ECO / Energy Saving Series", "High Brightness Series"],
          },
          {
            name: "Specialized LED",
            series: ["Transparent LED", "Flexible / Creative LED", "Rental / Event LED"],
          },
        ],
      },
      {
        heading: "B. Digital Standee Solutions",
        items: [
          {
            name: "LED Display Standee",
            badge: "4K UHD",
            series: ['32" Standee', '43" Standee', '55" Standee', '65" Standee'],
          },
          {
            name: "LCD Display Standee",
            series: ["Android Digital Signage", "Touch Display Standee"],
          },
          {
            name: "Smart Digital Standee",
            series: ["Plug & Play Commercial", "Toughened Glass Enclosure"],
          },
        ],
      },
      {
        heading: "C. Video Wall Solutions",
        items: [
          { name: "LED Video Wall", series: ["Seamless Bezel-Free"] },
          { name: "LCD Video Wall", series: ["Ultra-Narrow Bezel 0.88mm"] },
          { name: "Fine Pitch LED Video Wall", series: ["Command Centers & Studios"] },
          { name: "Outdoor Video Wall", series: ["Weatherproof IP65"] },
        ],
      },
    ],
  },
  {
    id: "static-signage",
    title: "STATIC DIGITAL SIGNAGE SOLUTIONS",
    shortTitle: "Static Signage",
    subtitle: "GSB, ACP & Directional",
    icon: LayoutGrid,
    color: "from-amber-500 to-orange-500",
    featuredProducts: [
      {
        name: "Glow Sign Board (GSB)",
        badge: "LIT & NON-LIT",
        image: "/images/projects/real-proj-p38-signage-and-branding---pan-ind.jpeg",
        specs: [
          "High-grade flex substrate with extruded frame",
          "Uniform high-lumen energy-efficient LED modules",
          "Weather-sealed & UV-resistant for all India climates",
        ],
        series: ["Lit Glow Sign", "Non-Lit Glow Sign", "Retrofit"],
      },
      {
        name: "ACP & Acrylic 3D Signage",
        badge: "PRECISION",
        image: "/images/projects/real-proj-p44-signage-and-branding---pan-ind.jpeg",
        specs: [
          "CNC router & high-precision laser cut letters",
          "3D acrylic with halo & front LED illumination",
          "Fire-retardant Aluminum Composite Panel backing",
        ],
        series: ["3D Letters", "LED Backlit", "Precision Fabrication"],
      },
      {
        name: "Indoor Directional Signage",
        badge: "WAYFINDING",
        image: "/images/projects/real-proj-p50-signage-and-branding---pan-ind.jpeg",
        specs: [
          "Modular corporate reception & directory boards",
          "Conference room identifiers & tactile signs",
          "Brushed stainless steel, brass & frosted acrylic",
        ],
        series: ["Reception Signage", "Conference Rooms", "Wayfinding"],
      },
      {
        name: "Outdoor Pylon & Façade Signs",
        badge: "STRUCTURAL",
        image: "/images/projects/real-proj-p55-signage-and-branding---pan-ind.jpeg",
        specs: [
          "Heavy-duty retail façades & highway monolith pylons",
          "Structural engineering design certified for high wind",
          "Automotive grade polyurethane paint finish",
        ],
        series: ["Façade Signage", "Pylon & Totems", "Site Hoardings"],
      },
    ],
    groups: [
      {
        heading: "Signage & Architectural Displays",
        items: [
          {
            name: "Glow Sign Board (GSB)",
            series: ["Lit Glow Sign Board", "Non-Lit Glow Sign Board"],
          },
          {
            name: "ACP / Acrylic Signage",
            series: ["3D Letters", "LED Backlit Signage", "Precision Fabrication"],
          },
          {
            name: "Indoor Directional Signage",
            series: ["Reception Signage", "Conference Room Identifiers", "Washroom & Wayfinding"],
          },
          {
            name: "Outdoor Static Signage",
            series: ["Façade Signage", "Pylon & Totem Signs", "Site Hoardings"],
          },
        ],
      },
    ],
  },
  {
    id: "interactive-kiosks",
    title: "INTERACTIVE & SELF-SERVICE SOLUTIONS",
    shortTitle: "Interactive Kiosks",
    subtitle: "Touchscreens & ATM Totems",
    icon: Touchpad,
    color: "from-cyan-500 to-teal-500",
    featuredProducts: [
      {
        name: "Interactive Touch Kiosk",
        badge: "CAPACITIVE",
        image: "/images/projects/real-proj-p40-atm-kiosk-branding---pan-india.jpeg",
        specs: [
          "10-point PCAP capacitive multi-touch technology",
          "Anti-glare toughened glass surface with fast response",
          "Custom brand vinyl wrapping & CNC sheet metal body",
        ],
        series: ["Capacitive Multi-Touch", "Custom Branding", "Floor Standing"],
      },
      {
        name: "Self-Service Ordering & Billing",
        badge: "COMMERCIAL",
        image: "/images/projects/real-proj-p21-bkc-e-lobby--mumbai.jpeg",
        specs: [
          "Integrated 80mm thermal receipt printer & scanner",
          "POS card payment terminal & QR code bracket",
          "Heavy-duty 24/7 continuous duty cycle rating",
        ],
        series: ["Billing & Ordering", "Document Scanners", "Fast Food POS"],
      },
      {
        name: "Banking & Financial ATM Kiosks",
        badge: "PAN-INDIA",
        image: "/images/projects/real-proj-p34-sbi-atm-hitachi--burar.jpeg",
        specs: [
          "ATM lobby totems, cash dispenser & passbook kiosks",
          "Vandal-resistant construction & secure cable routing",
          "Over 40+ leading PSU and private bank deployments",
        ],
        series: ["ATM Totems", "Passbook Kiosks", "Cheque Drop"],
      },
      {
        name: "Wayfinding & Queue Management",
        badge: "3D MAPS",
        image: "/images/projects/real-proj-p25-lower-parel--mumbai.jpeg",
        specs: [
          "Interactive 3D indoor map search for malls & hospitals",
          "Multi-counter queue token calling displays",
          "Visitor management check-in with webcam & badge printer",
        ],
        series: ["3D Maps", "Token Calling", "Visitor Check-in"],
      },
    ],
    groups: [
      {
        heading: "Interactive Self-Service Hardware",
        items: [
          { name: "Interactive Kiosk", badge: "Capacitive Touch", series: ["Capacitive Multi-Touch", "Custom Branding"] },
          { name: "Self-Service Kiosk", series: ["Billing & Ordering", "Document Scanners"] },
          { name: "Banking / Financial Kiosk", series: ["ATM Totems", "Passbook Printing Kiosks"] },
          { name: "Wayfinding Kiosk", series: ["3D Interactive Maps", "Malls & Lobbies"] },
          { name: "Touchscreen Information Kiosk", series: ["Visitor Management", "Museums & Exhibitions"] },
          { name: "Queue Management Display", series: ["Token Counter Displays", "Calling Screens"] },
        ],
      },
    ],
  },
  {
    id: "signage-software",
    title: "SIGNAGE SOFTWARE & CMS",
    shortTitle: "Software & CMS",
    subtitle: "JIO Cloud CMS Platform",
    icon: Cpu,
    color: "from-purple-500 to-pink-500",
    featuredProducts: [
      {
        name: "Enterprise Digital Signage CMS",
        badge: "HOSTED ON JIO",
        image: "/images/projects/real-proj-p9-software---cloud.jpeg",
        specs: [
          "Cloud CMS infrastructure hosted on JIO SOFTWARE",
          "256-Bit SSL/TLS military-grade data encryption",
          "Tier-4 Indian data center with 99.9% uptime SLA",
        ],
        series: ["Cloud-Hosted on JIO", "256-Bit Encrypted", "Role-Based Access"],
      },
      {
        name: "Content Canvas & Scheduling",
        badge: "MULTI-ZONE",
        image: "/images/client-portal-mockup.png",
        specs: [
          "Drag-and-drop split-screen canvas with live widgets",
          "Day-parting, recurring calendar rules & emergency overrides",
          "Supports 4K video, HTML5, live streaming, RSS & ticker",
        ],
        series: ["Multi-Zone Layouts", "Drag-and-Drop Media", "Remote Push"],
      },
      {
        name: "Remote Device Management (RDM)",
        badge: "TELEMETRY",
        image: "/images/projects/real-proj-p9-software---cloud.jpeg",
        specs: [
          "Real-time screen health, temperature & network telemetry",
          "Over-the-air (OTA) remote firmware & content updates",
          "Automated proof-of-play logs & compliance reporting",
        ],
        series: ["Health Monitoring", "Automated Reboot", "Proof of Play"],
      },
      {
        name: "Android Signage Player Hardware",
        badge: "NATIVE 4K",
        image: "/images/projects/real-proj-p10-product-offerings-and-usps.jpeg",
        specs: [
          "Native 4K UHD 60fps hardware video decoding",
          "Local smart caching enables seamless offline playback",
          "Industrial watchdog timer prevents system freezing",
        ],
        series: ["Native 4K Decode", "Offline Caching", "Dual-Band WiFi"],
      },
    ],
    groups: [
      {
        heading: "Enterprise Cloud CMS Infrastructure",
        items: [
          {
            name: "Digital Signage CMS",
            badge: "Hosted on JIO",
            series: ["Cloud-Hosted on JIO SOFTWARE", "256-Bit Encrypted"],
          },
          {
            name: "Content Management",
            series: ["Multi-Zone Layouts", "Drag-and-Drop Media", "Remote Push"],
          },
          {
            name: "Remote Device Management",
            series: ["Real-time Health Monitoring", "Automatic Reboot & OTA Updates"],
          },
          {
            name: "Scheduling & Playlist Management",
            series: ["Day-Parting & Calendar Rules", "Loop Sequences"],
          },
          {
            name: "Monitoring & Reports",
            series: ["Proof-of-Play Audit Trails", "Uptime & Fault Telemetry"],
          },
          {
            name: "Android Signage Player",
            series: ["Native 4K Hardware Decode", "Offline Content Caching"],
          },
        ],
      },
    ],
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/who-we-are" },
  { label: "Products", href: "#products", isProductsMenu: true },
  { label: "Projects", href: "/projects" },
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/insights" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showSelectionToast, setShowSelectionToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productsBtnRef = useRef<HTMLDivElement>(null);
  const [dropdownShift, setDropdownShift] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic left offset to ensure the products dropdown never cuts off on the right
  const handleCategoryHover = (idx: number) => {
    setActiveCategoryIndex(idx);
    if (productsBtnRef.current) {
      const rect = productsBtnRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const targetWidth = 580;
      const rightEdge = rect.left + targetWidth;
      const maxRight = viewportWidth - 16;

      if (rightEdge > maxRight) {
        const shift = -(rightEdge - maxRight);
        const maxLeftShift = -rect.left + 16;
        setDropdownShift(Math.max(shift, maxLeftShift));
      } else {
        setDropdownShift(0);
      }
    }
  };

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (productsBtnRef.current && productsDropdownOpen) {
        const rect = productsBtnRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const targetWidth = activeCategoryIndex !== null ? 580 : 220;
        const rightEdge = rect.left + targetWidth;
        const maxRight = viewportWidth - 16;

        if (rightEdge > maxRight) {
          const shift = -(rightEdge - maxRight);
          const maxLeftShift = -rect.left + 16;
          setDropdownShift(Math.max(shift, maxLeftShift));
        } else {
          setDropdownShift(0);
        }
      } else {
        setDropdownShift(0);
      }
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    return () => window.removeEventListener("resize", updateDropdownPosition);
  }, [activeCategoryIndex, productsDropdownOpen]);

  // Close menus on path change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    setActiveCategoryIndex(null);
  }

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
        setActiveCategoryIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isDarkHeroPage = pathname === "/" || pathname === "/who-we-are";
  const useTransparentBackground = !isScrolled && isDarkHeroPage && !mobileMenuOpen && !productsDropdownOpen;

  const handleSelectProduct = (productName: string, seriesName?: string) => {
    const fullSelection = seriesName ? `${productName} — ${seriesName}` : productName;
    setSelectedProduct(fullSelection);
    setShowSelectionToast(true);
    setProductsDropdownOpen(false);
    setActiveCategoryIndex(null);
    setMobileMenuOpen(false);

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setShowSelectionToast(false);
    }, 6000);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          useTransparentBackground
            ? "bg-transparent py-5 sm:py-6"
            : "bg-[#0B0F2B]/95 backdrop-blur-md py-3.5 sm:py-4 border-b border-white/10 shadow-sm"
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col group shrink-0"
              aria-label="Ace Select Home"
            >
              <img
                src="/logo.png"
                alt="Ace Select Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center gap-8 relative" ref={dropdownRef}>
              {navItems.map((item) => {
                if (item.isProductsMenu) {
                  return (
                    <div
                      key={item.label}
                      ref={productsBtnRef}
                      className="relative"
                      onMouseEnter={() => {
                        setProductsDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        setProductsDropdownOpen(false);
                        setActiveCategoryIndex(null);
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (productsDropdownOpen) {
                            setProductsDropdownOpen(false);
                            setActiveCategoryIndex(null);
                          } else {
                            setProductsDropdownOpen(true);
                            setActiveCategoryIndex(null);
                          }
                        }}
                        className={`text-sm font-display flex items-center gap-1.5 transition-all duration-300 py-1 ${
                          productsDropdownOpen || selectedProduct
                            ? "text-solvorry-light font-bold border-b-[1.5px] border-solvorry-light pb-1"
                            : "text-white/80 font-medium hover:text-white pb-1 border-b-[1.5px] border-transparent"
                        }`}
                        aria-expanded={productsDropdownOpen}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            productsDropdownOpen ? "rotate-180 text-solvorry-light" : "text-white/60"
                          }`}
                        />
                      </button>

                      {/* ============================================================== */}
                      {/* COMPACT FLOATING WHITE CARD DROPDOWN (Auto-Clamped on Viewport) */}
                      {/* ============================================================== */}
                      {productsDropdownOpen && (
                        <div
                          className="absolute top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                          style={{
                            left: `${dropdownShift}px`,
                            transition: "left 150ms ease-out",
                          }}
                        >
                          <div
                            className="bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden text-neutral-900 flex transition-[width] duration-200 ease-out"
                            style={{
                              width: activeCategoryIndex !== null ? "580px" : "220px",
                              maxWidth: "calc(100vw - 24px)",
                            }}
                          >
                            <div className="flex divide-x divide-neutral-200/80 w-full">
                              
                              {/* 1. LEFT COLUMN: 4 Main Categories in a Vertical Line Exact Down Products */}
                              <div className="w-[220px] bg-neutral-50/70 p-2.5 flex flex-col justify-between shrink-0">
                                <div>
                                  <div
                                    className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 px-2 py-1 mb-1 cursor-default select-none"
                                  >
                                    PRODUCT CATEGORIES
                                  </div>
                                  <div className="space-y-1">
                                    {PRODUCT_CATEGORIES.map((cat, idx) => {
                                      const Icon = cat.icon;
                                      const isActive = activeCategoryIndex === idx;
                                      return (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onMouseEnter={() => handleCategoryHover(idx)}
                                          onClick={() => handleCategoryHover(idx)}
                                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left relative group ${
                                            isActive
                                              ? "bg-white text-solvorry-DEFAULT shadow-xs font-bold border border-neutral-200/90 ring-1 ring-solvorry-DEFAULT/15"
                                              : "text-neutral-700 hover:text-neutral-900 hover:bg-white/80 font-medium border border-transparent"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <div
                                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                                isActive
                                                  ? "bg-solvorry-DEFAULT text-white shadow-xs"
                                                  : "bg-neutral-200/70 text-neutral-600 group-hover:bg-neutral-200"
                                              }`}
                                            >
                                              <Icon className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="text-[11px] font-display font-bold uppercase tracking-tight truncate leading-tight">
                                                {cat.shortTitle}
                                              </div>
                                              <div className="text-[9px] text-neutral-400 font-normal truncate mt-0.5">
                                                {cat.subtitle}
                                              </div>
                                            </div>
                                          </div>
                                          <ChevronRight
                                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                              isActive
                                                ? "text-solvorry-DEFAULT translate-x-0.5 opacity-100"
                                                : "text-neutral-400 opacity-40 group-hover:opacity-80"
                                            }`}
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Trust Assurance Badges */}
                                <div
                                  className="mt-3 pt-2.5 border-t border-neutral-200/60 px-1 space-y-1 text-[9.5px] text-neutral-500 font-medium cursor-default select-none"
                                >
                                  <div className="flex items-center gap-1.5 text-neutral-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Indian OEM Manufacturer</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-neutral-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-solvorry-DEFAULT shrink-0" />
                                    <span>5-Year Warranty Guarantee</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-neutral-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span>476+ Cities Pan-India</span>
                                  </div>
                                </div>
                              </div>

                              {/* 2. RIGHT PANE: Only shown when cursor goes on a category */}
                              {activeCategoryIndex !== null && (
                                <div className="w-[360px] p-3 bg-white flex flex-col justify-between shrink-0 animate-in fade-in duration-150">
                                  <div>
                                    {/* Active Category Header */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-solvorry-DEFAULT truncate">
                                          {PRODUCT_CATEGORIES[activeCategoryIndex].title}
                                        </span>
                                        <span className="text-neutral-300">•</span>
                                        <span className="text-[9px] text-neutral-500 shrink-0">
                                          {PRODUCT_CATEGORIES[activeCategoryIndex].featuredProducts.length} Solutions
                                        </span>
                                      </div>
                                    </div>

                                    {/* Vertical List of 4 Products with Photo and Specifications */}
                                    <div className="space-y-1.5">
                                      {PRODUCT_CATEGORIES[activeCategoryIndex].featuredProducts.map((prod, pIdx) => {
                                        const isSelected = selectedProduct?.startsWith(prod.name);
                                        return (
                                          <div
                                            key={pIdx}
                                            onClick={() => handleSelectProduct(prod.name)}
                                            className={`flex items-center gap-2.5 p-1.5 rounded-xl border transition-all group/card cursor-pointer ${
                                              isSelected
                                                ? "border-solvorry-DEFAULT bg-blue-50/50 shadow-xs"
                                                : "border-neutral-200/70 bg-neutral-50/40 hover:bg-neutral-50 hover:border-solvorry-DEFAULT/40 hover:shadow-xs"
                                            }`}
                                          >
                                            {/* Product Photo */}
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80 relative">
                                              <img
                                                src={prod.image}
                                                alt={prod.name}
                                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                              />
                                              {prod.badge && (
                                                <span className="absolute top-0.5 left-0.5 text-[6.5px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-solvorry-DEFAULT text-white shadow-xs">
                                                  {prod.badge}
                                                </span>
                                              )}
                                            </div>

                                            {/* Product Details & Specs */}
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between gap-1">
                                                <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-neutral-900 group-hover/card:text-solvorry-DEFAULT transition-colors truncate">
                                                  {prod.name}
                                                </h4>
                                                <ChevronRight className="w-3 h-3 text-neutral-400 group-hover/card:text-solvorry-DEFAULT group-hover/card:translate-x-0.5 transition-all shrink-0" />
                                              </div>

                                              {/* Technical Specifications */}
                                              {prod.specs && prod.specs.length > 0 && (
                                                <p className="text-[9px] text-neutral-500 font-body leading-tight truncate mt-0.5">
                                                  {prod.specs[0]}
                                                </p>
                                              )}

                                              {/* Series Tags */}
                                              {prod.series && prod.series.length > 0 && (
                                                <div
                                                  className="flex flex-wrap gap-1 mt-1"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  {prod.series.slice(0, 3).map((s, sIdx) => {
                                                    const isPillSelected = selectedProduct === `${prod.name} — ${s}`;
                                                    return (
                                                      <button
                                                        key={sIdx}
                                                        type="button"
                                                        onClick={() => handleSelectProduct(prod.name, s)}
                                                        className={`text-[7.5px] font-body px-1.5 py-0.5 rounded transition-all border ${
                                                          isPillSelected
                                                            ? "bg-solvorry-DEFAULT text-white border-solvorry-DEFAULT font-semibold"
                                                            : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-solvorry-DEFAULT hover:text-white hover:border-solvorry-DEFAULT"
                                                        }`}
                                                      >
                                                        {s}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Right Pane Footer Link */}
                                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                                    <span className="text-[9px] text-neutral-500 font-body truncate">
                                      Need custom OEM dimensions?
                                    </span>
                                    <Link
                                      href="/contact"
                                      onClick={() => {
                                        setProductsDropdownOpen(false);
                                        setActiveCategoryIndex(null);
                                      }}
                                      className="font-display font-bold text-[9.5px] uppercase tracking-wider text-solvorry-DEFAULT hover:text-solvorry-dark flex items-center gap-1 transition-colors group shrink-0"
                                    >
                                      <span>Request Quote</span>
                                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-display transition-all duration-300 ${
                      isActive
                        ? "text-white font-semibold border-b-[1.5px] border-solvorry-DEFAULT pb-1"
                        : "text-white/70 font-medium hover:text-white pb-1 border-b-[1.5px] border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/client-portal"
                className="px-3 py-2 text-xs font-display font-semibold uppercase tracking-wider text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Portal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
              <Button variant="primary" href="/contact" className="py-2.5 px-6">
                LET&apos;S TALK
              </Button>
            </div>

            {/* Mobile 3-line Hamburger Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open website navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>


      </header>

      {/* ============================================================== */}
      {/* SELECTION NOTIFICATION TOAST                                   */}
      {/* ============================================================== */}
      {showSelectionToast && selectedProduct && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md w-full">
          <div className="bg-[#0B0F2B] border-2 border-solvorry-DEFAULT text-white p-4 rounded-xl shadow-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-solvorry-DEFAULT/20 flex items-center justify-center text-solvorry-light shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[10px] uppercase tracking-widest text-solvorry-light">
                  PRODUCT SELECTED
                </span>
                <button
                  type="button"
                  onClick={() => setShowSelectionToast(false)}
                  className="text-white/40 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-display font-bold text-sm text-white mt-0.5">
                {selectedProduct}
              </p>
              <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/10">
                <Link
                  href="/contact"
                  onClick={() => setShowSelectionToast(false)}
                  className="px-3 py-1.5 bg-solvorry-DEFAULT hover:bg-solvorry-dark text-white font-display font-bold text-xs uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1"
                >
                  <span>REQUEST QUOTE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSelectionToast(false)}
                  className="text-xs text-white/60 hover:text-white font-display"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER (Drive into website)      */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0F2B] text-white flex flex-col pt-20 pb-8 px-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 md:hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-solvorry-DEFAULT/20 rounded-full blur-3xl pointer-events-none" />

          {/* Navigation Links to Drive into Website */}
          <div className="relative z-10 flex-1 flex flex-col justify-between max-w-sm mx-auto w-full py-4">
            <div className="space-y-1">
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-white/40 block mb-3">
                WEBSITE NAVIGATION
              </span>

              {navItems.map((item) => {
                if (item.isProductsMenu) {
                  return (
                    <div key={item.label} className="border-b border-white/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="w-full flex items-center justify-between py-3.5 px-3 rounded-lg text-lg font-display font-bold tracking-tight text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.label}</span>
                          <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-solvorry-DEFAULT/30 text-solvorry-light border border-solvorry-light/30">
                            Directory
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                            mobileProductsOpen ? "rotate-180 text-solvorry-light" : ""
                          }`}
                        />
                      </button>

                      {/* Accordion content with all products and subcategories */}
                      {mobileProductsOpen && (
                        <div className="pl-3 pr-2 py-3 space-y-6 bg-white/5 rounded-lg my-1 animate-in fade-in duration-200">
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <div key={cat.id} className="space-y-2">
                              <div className="font-display font-bold text-xs uppercase tracking-wider text-solvorry-light">
                                {cat.title}
                              </div>
                              <div className="space-y-2 pl-2 border-l border-white/10">
                                {cat.groups.map((group, gIdx) => (
                                  <div key={gIdx} className="space-y-1.5">
                                    <div className="text-[10px] font-display font-semibold text-white/50 uppercase">
                                      {group.heading}
                                    </div>
                                    <div className="space-y-1 pl-1">
                                      {group.items.map((prod, pIdx) => (
                                        <div key={pIdx}>
                                          <button
                                            type="button"
                                            onClick={() => handleSelectProduct(prod.name)}
                                            className="w-full text-left py-1 text-xs font-display font-medium text-white/80 hover:text-white flex items-center justify-between"
                                          >
                                            <span>{prod.name}</span>
                                            {prod.badge && (
                                              <span className="text-[9px] text-solvorry-light">
                                                {prod.badge}
                                              </span>
                                            )}
                                          </button>
                                          {prod.series && prod.series.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1 pl-2 pb-1">
                                              {prod.series.map((s, sIdx) => (
                                                <button
                                                  key={sIdx}
                                                  type="button"
                                                  onClick={() => handleSelectProduct(prod.name, s)}
                                                  className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/70 hover:bg-solvorry-DEFAULT hover:text-white"
                                                >
                                                  {s}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-lg text-lg font-display font-bold tracking-tight transition-colors ${
                      isActive
                        ? "bg-white/10 text-white border-l-4 border-solvorry-light pl-4"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </Link>
                );
              })}

              {/* Dedicated Client Portal Link */}
              <div className="pt-4">
                <Link
                  href="/client-portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-950/40 border border-blue-500/30 flex items-center justify-between text-white hover:border-blue-400 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#283A97] flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <span className="font-display font-black text-xs tracking-wider uppercase block text-white">
                        CLIENT PORTAL
                      </span>
                      <span className="text-[10px] text-blue-200">
                        Live site tracking &amp; approvals
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-solvorry-DEFAULT hover:bg-solvorry-dark text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>GET A QUOTE / LET&apos;S TALK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-between text-xs text-white/60 pt-2 px-1">
                <a
                  href="tel:+918452942177"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>+91 84529 42177</span>
                </a>
                <a
                  href="mailto:info@aceselect.in"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>info@aceselect.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
