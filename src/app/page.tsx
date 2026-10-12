import SectionReveal from "@/components/SectionReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Monitor, Building2, Network, Calendar, MapPin, Landmark, TrendingUp } from "lucide-react";
import { Counter } from "@/components/StatCounter";
import HeroVideo from "@/components/HeroVideo";
import {
  getHeroContent,
  getHomeStats,
  getHomeAbout,
  getProcessSteps,
  getPanIndiaStats,
  getClients,
  getTestimonials,
} from "@/lib/cms-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STAT_ICONS: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-8 h-8 text-neutral-400" />,
  TrendingUp: <TrendingUp className="w-8 h-8 text-neutral-400" />,
  Monitor: <Monitor className="w-8 h-8 text-neutral-400" />,
  Calendar: <Calendar className="w-8 h-8 text-neutral-400" />,
  MapPin: <MapPin className="w-8 h-8 text-neutral-400" />,
  Landmark: <Landmark className="w-8 h-8 text-neutral-400" />,
  Network: <Network className="w-8 h-8 text-neutral-400" />,
};

const DEFAULT_CLIENTS = [
  { name: "SBI", tag: "Public Sector", tint_color: "#283A97" },
  { name: "Bank of Baroda", tag: "National Bank", tint_color: "#EA580C" },
  { name: "ICICI Bank", tag: "Private Banking", tint_color: "#B91C1C" },
  { name: "Axis Bank", tag: "Commercial Banking", tint_color: "#9D174D" },
  { name: "HDFC Bank", tag: "Financial Services", tint_color: "#1E3A8A" },
  { name: "Indian Bank", tag: "Public Sector", tint_color: "#2563EB" },
  { name: "Muthoot Finance", tag: "NBFC Group", tint_color: "#DC2626" },
  { name: "Bank of Maharashtra", tag: "State Banking", tint_color: "#0284C7" },
  { name: "Cosmos Bank", tag: "Co-op Banking", tint_color: "#4F46E5" },
  { name: "City Union Bank", tag: "Commercial", tint_color: "#059669" },
  { name: "Punjab & Sindh Bank", tag: "Public Sector", tint_color: "#D97706" },
];

export default async function HomePage() {
  const [hero, stats, about, processSteps, panIndia, clients, testimonials] = await Promise.all([
    getHeroContent(),
    getHomeStats(),
    getHomeAbout(),
    getProcessSteps(),
    getPanIndiaStats(),
    getClients(),
    getTestimonials(),
  ]);

  const clientList = clients && clients.length > 0 ? clients : DEFAULT_CLIENTS;

  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] text-white flex flex-col justify-center pt-24 pb-12 overflow-hidden z-0" aria-label="Hero section">
        {/* Full-screen background video with instant frame poster */}
        <div className="absolute inset-0 z-0">
          <HeroVideo videoSrc={hero.background_video_url || "/videos/homepage-hero.mp4"} poster={hero.poster_url || ""} />
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 mt-10 flex-grow">
          
          {/* Left Content */}
          <div className="lg:w-[64%] xl:w-[62%] flex flex-col relative py-8">
            <div className="absolute -left-4 sm:-left-6 lg:-left-8 top-8 bottom-8 w-1 bg-solvorry-light shadow-[0_0_15px_rgba(74,96,212,0.5)]" />
            
            <p className="text-white/90 tracking-[0.12em] sm:tracking-[0.2em] text-[11px] sm:text-xs font-semibold mb-6 drop-shadow-md uppercase">
              {hero.eyebrow_text || "INDIAN OEM & MANUFACTURER | ACTIVE LED & DIGITAL SIGNAGE"}
            </p>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.08] mb-6 tracking-tight drop-shadow-2xl uppercase">
              {hero.headline_line1} <br/>
              <span className="text-solvorry-light">{hero.headline_line2}</span>
            </h1>
            
            <p className="text-white/95 text-base sm:text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed drop-shadow-lg">
              {hero.subheadline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link
                href={hero.cta_primary_href || "/projects"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-semibold transition-all hover:bg-solvorry-dark text-sm border border-transparent"
              >
                {hero.cta_primary_label || "EXPLORE OUR WORK"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={hero.cta_secondary_href || "/contact"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-display font-semibold transition-all hover:bg-white hover:text-[#0B0F2B] text-sm backdrop-blur-sm bg-black/20"
              >
                {hero.cta_secondary_label || "GET A QUOTE"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="mt-auto">
              <p className="text-[10px] tracking-widest text-white/90 uppercase leading-relaxed font-semibold drop-shadow-md whitespace-pre-line">
                {hero.bottom_tagline || "PROFESSIONALLY ENGINEERED\nAPPLICATION-SPECIFIC DISPLAY SYSTEMS"}
              </p>
            </div>
          </div>
          
          {/* Right Spacing / Decorative elements */}
          <div className="hidden lg:flex lg:w-[36%] xl:w-[38%] relative lg:h-auto flex-col justify-end">
            {/* Right Side Vertical Text */}
            <div className="hidden xl:flex flex-col items-end justify-center absolute right-8 top-1/2 -translate-y-1/2">
               <div className="flex flex-col gap-5 text-[10px] tracking-[0.3em] font-semibold text-white/90 uppercase leading-none text-right drop-shadow-lg">
                  {(hero.vertical_labels && hero.vertical_labels.length > 0 ? hero.vertical_labels : ["GOVERNMENT", "BANKING", "CORPORATE", "INSTITUTIONAL", "COMMERCIAL", "MISSION-CRITICAL"]).map((lbl) => (
                    <p key={lbl}>{lbl}</p>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-4 text-white z-10">
          <span className="text-[10px] tracking-widest uppercase font-bold drop-shadow-md">SCROLL</span>
          <div className="w-[1px] h-12 bg-white/50 relative">
            <div className="absolute top-0 w-full h-4 bg-white animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white border-b border-neutral-100 relative z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {stats.map((stat) => (
              <div key={stat.id || stat.label} className="py-12 md:py-16 flex flex-col items-center justify-center text-center group hover:bg-neutral-50 transition-colors">
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
                  {STAT_ICONS[stat.icon_name] || <Building2 className="w-8 h-8 text-neutral-400" />}
                </div>
                <div className="font-display font-bold text-5xl md:text-6xl text-solvorry-DEFAULT mb-3 tabular-nums">
                  <Counter end={stat.end_value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
                </div>
                <div className="text-neutral-500 font-display font-semibold tracking-wider text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. About Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal direction="left">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">
                  {about.eyebrow || "ABOUT ACE SELECT"}
                </span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-8 tracking-tight leading-[1.1] whitespace-pre-line">
                {about.headline || "CREATIVE THINKING.\nDESIGNING BEYOND THE BOX."}
              </h2>
              <p className="text-neutral-600 font-body text-lg leading-relaxed mb-6 max-w-xl">
                {about.body_paragraph1 || about.body1}
              </p>
              <p className="text-neutral-600 font-body text-base leading-relaxed mb-8 max-w-xl">
                {about.body_paragraph2 || about.body2}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solvorry-DEFAULT/10 border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-solvorry-DEFAULT animate-pulse" />
                  {about.badge_text || "Secure Cloud CMS on JIO SOFTWARE"}
                </div>
                <span className="text-xs text-neutral-400 font-medium font-body">
                  {about.badge_sub_text || "Centralized Oversight & Access Controls"}
                </span>
              </div>
              <div>
                <Link href={about.cta_href || "/who-we-are"} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-semibold transition-all hover:bg-solvorry-dark text-sm group">
                  {about.cta_label || "DISCOVER OUR STORY"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={150}>
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md">
                <img 
                  src={about.image_url || "/images/products/standee-banner.jpg"} 
                  alt={about.image_alt || "ACE SELECT Android Digital Signage Standee"} 
                  className="w-full h-full object-cover"
                />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 4. Products & Solutions Grid */}
      <section className="py-24 bg-white" id="products">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                  <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">OUR PRODUCTS &amp; SOLUTIONS</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tight">
                  HARDWARE, SIGNAGE<br/>&amp; CLOUD CMS.
                </h2>
              </div>
              <div className="lg:max-w-md flex flex-col items-start lg:items-end gap-6">
                <p className="text-neutral-600 font-body text-base lg:text-right">
                  From active indoor &amp; outdoor LED displays and 4K Android standees to architectural signage and secure Jio Software CMS, explore our end-to-end directory.
                </p>
                <a href="#products" className="inline-flex items-center gap-2 text-solvorry-DEFAULT font-display font-bold text-sm tracking-widest uppercase group hover:text-solvorry-dark">
                  EXPLORE PRODUCT DIRECTORY
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              { title: "ACTIVE DIGITAL\nLED DISPLAYS", img: "/images/products/indoor-smd-page1.jpg" },
              { title: "ANDROID DIGITAL\nSTANDEES (32\"-65\")", img: "/images/products/standee-banner.jpg" },
              { title: "OUTDOOR HIGH BRIGHTNESS\nSMD SERIES", img: "/images/products/outdoor-smd-page1.jpg" },
              { title: "INTERACTIVE &\nSELF-SERVICE KIOSKS", img: "/images/projects/project-bkc-elobby.jpg" },
              { title: "STATIC SIGNAGE &\nGLOW SIGN BOARDS", img: "/images/projects/atm-kiosk-branding.jpg" },
              { title: "SIGNAGE CMS ON\nJIO SOFTWARE", img: "/images/products/product-hierarchy.jpg" }
            ].map((cap, i) => (
              <SectionReveal key={cap.title} delay={i * 50} direction="up">
                <div className="block relative aspect-[4/3] group overflow-hidden bg-neutral-900">
                  <img src={cap.img} alt={cap.title.replace('\n',' ')} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-[1.03] transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                    <h3 className="text-white font-display font-bold text-xl tracking-wide whitespace-pre-line leading-tight">
                      {cap.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pan India */}
      <section className="py-24 bg-[#F7F8FA] border-y border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <SectionReveal direction="left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                  <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">PAN INDIA PRESENCE</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6 tracking-tight">
                  BUILT FOR SCALE.
                </h2>
                <p className="text-neutral-600 font-body text-lg leading-relaxed mb-10 max-w-md">
                  From a single location to nationwide rollouts, our network enables consistent execution across India. With a strong on-ground team and trusted partners, we deliver high-quality installations anywhere in the country.
                </p>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-semibold transition-all hover:bg-solvorry-dark text-sm group">
                  OUR PRESENCE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </SectionReveal>
            </div>
            
            <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-12">
              <SectionReveal delay={100} className="w-full md:w-2/3 relative aspect-square">
                <picture className="w-full h-full block">
                  <source srcSet="/images/pan-india-map.webp" type="image/webp" />
                  <img
                    src="/images/pan-india-map.jpg"
                    alt="ACE SELECT PAN India Network Map"
                    className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                    loading="lazy"
                  />
                </picture>
              </SectionReveal>

              <SectionReveal delay={200} className="w-full md:w-1/3 flex flex-col gap-10">
                {panIndia.map((stat, i) => (
                  <div key={stat.id || stat.label || i} className="flex flex-col items-start gap-2">
                    <div className="w-10 h-10 rounded-full border border-solvorry-DEFAULT/20 flex items-center justify-center mb-1">
                       <MapPin className="w-4 h-4 text-solvorry-DEFAULT" />
                    </div>
                    <div className="font-display font-black text-4xl text-neutral-900">{stat.value}</div>
                    <div className="text-neutral-500 font-display font-bold tracking-widest text-[10px] uppercase">{stat.label}</div>
                  </div>
                ))}
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Projects */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                  <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">FEATURED PROJECTS</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tight">
                  PROJECTS THAT<br/>MAKE AN IMPACT.
                </h2>
              </div>
              <div className="lg:max-w-md flex flex-col items-start lg:items-end gap-6">
                <p className="text-neutral-600 font-body text-base lg:text-right">
                  Explore some of our recent work across industries. From retail stores and corporate spaces to large-scale outdoor displays, our solutions help brands stand out.
                </p>
                <Link href="/projects" className="inline-flex items-center gap-2 text-solvorry-DEFAULT font-display font-bold text-sm tracking-widest uppercase group hover:text-solvorry-dark">
                  VIEW ALL PROJECTS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { client: "SHRI KASHI VISHWANATH", type: "OUTDOOR HIGH-IMPACT LED", location: "Varanasi, Uttar Pradesh", img: "/images/projects/proj-kashi-vishwanath.jpg", href: "/projects/kashi-vishwanath-temple" },
              { client: "BKC MUMBAI", type: "CURVED ARCHITECTURAL LED", location: "Bandra Kurla Complex, Mumbai", img: "/images/projects/proj-bkc-mumbai.jpg", href: "/projects/bkc-curved-architectural-billboard" },
              { client: "SIRIPURAM JUNCTION", type: "SMART CITY TRAFFIC LED WALL", location: "Visakhapatnam, Andhra Pradesh", img: "/images/projects/proj-visakhapatnam.jpg", href: "/projects/siripuram-smart-city-led" },
              { client: "MARINE DRIVE", type: "LARGE-FORMAT DIGITAL SIGNAGE", location: "Marine Drive, Mumbai", img: "/images/projects/proj-marine-drive.jpg", href: "/projects/marine-drive-dooh-display" }
            ].map((proj, i) => (
              <SectionReveal key={proj.client} delay={i * 100} direction="up">
                <Link href={proj.href} className="block group">
                  <div className="w-full aspect-[4/3] bg-neutral-100 overflow-hidden mb-6 rounded-sm">
                    <img src={proj.img} alt={proj.client} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="font-display font-black text-xl text-neutral-900 mb-1 tracking-tight group-hover:text-solvorry-DEFAULT transition-colors">{proj.client}</h4>
                  <p className="text-solvorry-DEFAULT font-display font-bold text-[10px] tracking-widest uppercase mb-2">{proj.type}</p>
                  <p className="text-neutral-500 font-body text-sm">{proj.location}</p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Process */}
      <section className="py-24 bg-white border-t border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col items-center text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">OUR PROCESS</span>
                <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tight mb-6">
                FROM VISION<br/>TO REALITY.
              </h2>
              <p className="text-neutral-600 font-body max-w-xl">
                A streamlined process to ensure quality, consistency and on-time delivery across every project.
              </p>
            </div>
          </SectionReveal>

          <div className="relative max-w-5xl mx-auto">
            {/* Horizontal Line */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-[1px] bg-neutral-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {processSteps.map((step, i) => (
                <SectionReveal key={step.number || i} delay={i * 100} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-solvorry-DEFAULT flex items-center justify-center border-4 border-white mb-6 relative z-10 shadow-sm">
                    <span className="text-white font-display font-bold text-lg">{step.number || `0${i + 1}`}</span>
                  </div>
                  <h4 className="font-display font-bold text-neutral-900 mb-2 text-sm tracking-wide">{step.title}</h4>
                  <p className="text-neutral-500 font-body text-xs leading-relaxed max-w-[120px]">{step.description}</p>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Client Portal & Technology */}
      <section className="py-24 bg-white border-t border-neutral-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <SectionReveal direction="left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                  <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">CLIENT PORTAL</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 mb-6 tracking-tight">
                  EXECUTION,<br/>CONNECTED.
                </h2>
                <p className="text-neutral-600 font-body text-lg leading-relaxed mb-8 max-w-md">
                  Our proprietary client portal gives complete visibility across every project, from site recce and installation to approvals and final delivery.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="border-l-2 border-solvorry-DEFAULT/40 pl-3">
                    <p className="font-display font-bold text-neutral-900 text-sm">Real-Time Tracking</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Live site status &amp; metrics</p>
                  </div>
                  <div className="border-l-2 border-solvorry-DEFAULT/40 pl-3">
                    <p className="font-display font-bold text-neutral-900 text-sm">Instant Approvals</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Artwork &amp; sign-offs on the go</p>
                  </div>
                </div>

                <Link href="/client-portal" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-semibold transition-all hover:bg-solvorry-dark text-sm group">
                  EXPLORE CLIENT PORTAL
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </SectionReveal>
            </div>

            <div className="lg:col-span-7">
              <SectionReveal direction="right" delay={150}>
                <Link 
                  href="/client-portal" 
                  className="group relative block w-full transition-transform duration-500 hover:scale-[1.01]"
                  aria-label="ACE SELECT Client Portal Demonstration"
                >
                  {/* Subtle ambient glow behind the mockup */}
                  <div className="absolute inset-0 sm:-inset-4 bg-gradient-to-tr from-solvorry-DEFAULT/15 via-solvorry-light/10 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-full">
                    <Image
                      src="/images/client-portal-mockup.png"
                      alt="ACE SELECT Client Portal on Desktop and Mobile"
                      width={1024}
                      height={512}
                      priority
                      className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(40,58,151,0.12)]"
                    />
                  </div>
                </Link>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Clients - 3D Left-to-Right Sliding Line */}
      <section className="py-24 bg-white border-t border-neutral-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <SectionReveal className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
              <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">OUR CLIENTS</span>
              <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight">
              TRUSTED BY LEADING FINANCIAL INSTITUTIONS.
            </h2>
          </SectionReveal>
        </div>

        {/* 3D Infinite Single-Line Carousel Sliding Left to Right */}
        <SectionReveal delay={150}>
          <div className="relative w-full overflow-hidden py-6 perspective-container group">
            {/* Left Edge Ambient Fade Mask */}
            <div className="pointer-events-none absolute left-0 inset-y-0 w-24 sm:w-44 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
            
            {/* Right Edge Ambient Fade Mask */}
            <div className="pointer-events-none absolute right-0 inset-y-0 w-24 sm:w-44 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

            {/* Continuous Marquee Track moving Left to Right */}
            <div className="flex items-center gap-6 sm:gap-8 w-max animate-marquee-reverse group-hover:[animation-play-state:paused] py-4">
              {/* Double array ensures seamless, gap-free infinite translation */}
              {[...clientList, ...clientList].map((client, idx) => (
                <div
                  key={`${client.name}-${idx}`}
                  className="brand-card-3d group/card relative flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl cursor-default select-none shrink-0"
                >
                  {/* Subtle specular reflection across upper half */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/70 to-transparent opacity-80" />

                  {/* 3D Embossed Emblem Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center relative shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.05)] border border-white/90 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, #ffffff 0%, #f1f5f9 60%, ${client.tint_color || (client as any).tint || "#283A97"}18 100%)`,
                    }}
                  >
                    <Landmark className="w-5 h-5 stroke-[2.2]" style={{ color: client.tint_color || (client as any).tint || "#283A97" }} />
                  </div>

                  {/* Brand Name with 3D Extruded Lettering */}
                  <div className="flex flex-col">
                    <span className="font-display font-black text-lg sm:text-xl md:text-2xl text-[#0B0F2B] tracking-tight text-3d-extrusion leading-none group-hover/card:text-solvorry-DEFAULT transition-colors">
                      {client.name}
                    </span>
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 mt-1">
                      {client.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* 10. Testimonials */}
      <section className="py-24 bg-[#F7F8FA] border-t border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
             <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-solvorry-DEFAULT" />
                  <span className="text-neutral-500 font-display font-bold tracking-[0.2em] text-xs uppercase">TESTIMONIALS</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tight">
                  WHAT OUR<br/>CLIENTS SAY.
                </h2>
              </div>
              <div className="lg:max-w-md flex flex-col items-start lg:items-end gap-6">
                <Link href="#" className="inline-flex items-center gap-2 text-solvorry-DEFAULT font-display font-bold text-sm tracking-widest uppercase group hover:text-solvorry-dark">
                  VIEW ALL TESTIMONIALS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <SectionReveal key={test.author_name || (test as any).name || i} delay={i * 100} direction="up">
                <div className="bg-white p-10 border border-neutral-200 rounded-sm h-full flex flex-col">
                  <span className="text-solvorry-DEFAULT font-display font-black text-6xl leading-none opacity-20 mb-4">&quot;</span>
                  <p className="text-neutral-700 font-body text-base leading-relaxed flex-grow mb-8 font-medium">
                    {test.quote}
                  </p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-neutral-100">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                       <img src={test.author_photo_url || `https://i.pravatar.cc/150?u=${test.author_name || (test as any).name}`} alt={test.author_name || (test as any).name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-neutral-900 text-sm">{test.author_name || (test as any).name}</h4>
                      <p className="text-neutral-500 font-body text-xs">{test.author_title || (test as any).title}</p>
                      <p className="text-neutral-900 font-display font-bold text-xs uppercase tracking-wider mt-0.5">{test.author_company || (test as any).company}</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="relative py-32 bg-[#0B0F2B] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
           <img src="https://images.unsplash.com/photo-1542451542907-6cf80ff362d6?q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-[#0B0F2B]/80" />
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <SectionReveal className="max-w-2xl">
            <h2 className="font-display font-black text-5xl md:text-7xl mb-6 tracking-tight leading-[1.05]">
              LET&apos;S BUILD<br/>WHAT&apos;S NEXT.
            </h2>
            <p className="text-white/80 font-body text-lg md:text-xl mb-10 max-w-xl font-light">
              Partner with ACE SELECT for innovative display, branding and retail solutions that make your brand impossible to ignore.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-semibold transition-all hover:bg-solvorry-light text-sm group">
              START A CONVERSATION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
          
          <div className="hidden md:flex flex-col gap-2 text-right mt-12 md:mt-0">
             {["BRANDS", "SPACES", "EXPERIENCES", "ACROSS INDIA"].map((word, i) => (
               <span key={word} className={`font-display font-bold text-xs tracking-[0.4em] uppercase ${i === 3 ? "text-solvorry-light mt-4" : "text-white/40"}`}>
                 {word}
               </span>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
