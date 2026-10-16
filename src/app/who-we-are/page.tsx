import SectionReveal from "@/components/SectionReveal";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Target,
  Diamond,
  Users,
  Lightbulb,
  Building2,
  MapPin,
  Monitor,
  Calendar,
  TrendingUp,
  Cloud,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Quote,
  Briefcase,
  Store,
  Building,
  Car,
  UtensilsCrossed,
  Printer,
  Factory,
} from "lucide-react";
import { Counter } from "@/components/StatCounter";
import CertificatesShowcase from "@/components/CertificatesShowcase";
import { getCompanyPage, getHomeStats, getPageContent, getPageContentValue, getPageContentMedia } from "@/lib/cms-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STAT_ICONS: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6 text-neutral-400" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-neutral-400" />,
  Monitor: <Monitor className="w-6 h-6 text-neutral-400" />,
  Calendar: <Calendar className="w-6 h-6 text-neutral-400" />,
};

export default async function WhoWeArePage() {
  const [company, stats, pageContent] = await Promise.all([
    getCompanyPage(),
    getHomeStats(),
    getPageContent("who-we-are"),
  ]);

  const heroHeadline = getPageContentValue(pageContent, "hero.headline", `${company.hero_headline}\n${company.hero_highlight}`);
  const heroLines = heroHeadline.split("\n");
  const heroVideo = getPageContentMedia(pageContent, "hero.video", company.videoUrl || "/company-hero.mp4");
  const heroPoster = getPageContentMedia(pageContent, "hero.poster", company.posterUrl || "/home-hero-poster.jpg");

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="text-white pt-24 pb-0 relative border-b-[8px] border-solvorry-DEFAULT min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F2B] via-[#0B0F2B]/85 to-[#0B0F2B]/70 z-10" />
          <video 
            className="w-full h-full object-cover absolute inset-0" 
            poster={heroPoster}
            autoPlay 
            loop 
            muted 
            playsInline 
          >
            <source src={heroVideo} type="video/mp4" />
            <source src="/company-hero.mp4" type="video/mp4" />
            <source src="/home-hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row relative z-20">
          <div className="lg:w-2/3 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <nav className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/60 mb-6 font-display">
              HOME / COMPANY
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solvorry-DEFAULT/20 border border-solvorry-light/30 text-solvorry-light text-xs font-semibold uppercase tracking-widest mb-6 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              {getPageContentValue(pageContent, "hero.eyebrow", "ABOUT ACE SELECT")}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] mb-8 tracking-tight drop-shadow-xl text-white">
              {heroLines.map((line, index) => (
                <span key={`${line}-${index}`} className={index === heroLines.length - 1 ? "text-solvorry-light" : ""}>
                  {index > 0 && <br />}{line}
                </span>
              ))}
            </h1>
            <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-md mb-10">
              {getPageContentValue(pageContent, "hero.intro", company.hero_subheadline)}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="#our-story" 
                className="bg-solvorry-DEFAULT text-white px-8 py-4 font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 hover:bg-solvorry-dark transition-all"
              >
                OUR HERITAGE <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="#founder-vision" 
                className="border border-white/30 text-white px-8 py-4 font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 hover:bg-white hover:text-[#0B0F2B] transition-all backdrop-blur-sm bg-black/20"
              >
                FOUNDER&apos;S VISION <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are: Complete Design-to-Build */}
      <section className="bg-white py-24 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <SectionReveal direction="left" className="lg:w-1/2">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 font-display">
                {getPageContentValue(pageContent, "story.eyebrow", "WHO WE ARE")}
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 leading-[1.1] mb-6 tracking-tight">
                {getPageContentValue(pageContent, "story.headline", `${company.who_we_are_headline}\n${company.who_we_are_highlight}`).split("\n").map((line, index) => (
                  <span key={`${line}-${index}`} className={index > 0 ? "text-solvorry-DEFAULT" : ""}>{index > 0 && <br />}{line}</span>
                ))}
              </h2>
              <p className="text-neutral-700 font-body text-base mb-6 leading-relaxed">
                {getPageContentValue(pageContent, "story.body", company.who_we_are_body)}
              </p>
              <p className="text-neutral-600 font-body text-base mb-6 leading-relaxed">
                {getPageContentValue(pageContent, "story.body_secondary", "We specialize in creating inspiring workspaces and commercial environments, offering a complete suite of design and build services under one roof. Operating in a highly dynamic and sensitive industry, our team brings invaluable insights and deep market understanding to every installation.")}
              </p>
              <p className="text-neutral-600 font-body text-base mb-8 leading-relaxed">
                {getPageContentValue(pageContent, "story.body_tertiary", "With an average turnover of ₹100 Crore plus annually, ACE SELECT is your trusted partner for constructing, renovating, transferring, or creating new spaces across diverse sectors.")}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-solvorry-DEFAULT flex-shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-800">476+ Cities Pan-India</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-solvorry-DEFAULT flex-shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-800">₹100 Cr+ Annual Scale</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-solvorry-DEFAULT flex-shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-800">End-to-End Design & Build</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-solvorry-DEFAULT flex-shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-neutral-800">Environmental Responsibility</span>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={150} className="lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden shadow-2xl">
                <img 
                  src={getPageContentMedia(pageContent, "story.image", "/images/projects/project-bkc-elobby.jpg")}
                  alt={getPageContentValue(pageContent, "story.image_alt", "Modern Commercial Workplace Architecture")}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0B0F2B]/90 backdrop-blur-md text-white border-l-4 border-solvorry-light">
                  <p className="font-display font-bold text-sm tracking-wider uppercase mb-1">
                    Turnkey Design & Build
                  </p>
                  <p className="text-xs text-white/80 font-body">
                    Transforming abstract concepts into functional, inspiring environments under one roof.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 3. Key Numbers (Scale & Strength) */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <SectionReveal className="lg:w-1/4">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-2 font-display">
                KEY NUMBERS
              </div>
              <h3 className="font-display font-black text-3xl text-neutral-900 tracking-tight leading-tight">
                OUR SCALE<br />IN NUMBERS.
              </h3>
            </SectionReveal>

            <div className="lg:w-3/4 flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 w-full text-center">
              {stats.map((stat, i) => (
                <SectionReveal key={stat.id || stat.label || i} delay={i * 100} className="flex-1 py-8 sm:py-0 flex flex-col items-center justify-center group">
                  <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    {STAT_ICONS[stat.icon_name] || <Building2 className="w-6 h-6 text-neutral-400" />}
                  </div>
                  <div className="font-display font-black text-4xl text-solvorry-DEFAULT mb-2 tabular-nums tracking-tight">
                    <Counter end={stat.end_value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
                  </div>
                  <div className="text-neutral-500 font-display font-bold tracking-widest text-[10px] uppercase">
                    {stat.label}
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Founder & Visionary Leadership */}
      <section id="founder-vision" className="bg-[#0B0F2B] text-white py-24 border-b border-neutral-800 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal className="mb-16">
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-solvorry-light mb-4 font-display">
              LEADERSHIP & VISION
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-[1.1]">
              GUIDED BY EXCELLENCE.<br />
              <span className="text-solvorry-light">DRIVEN BY INNOVATION.</span>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Founder Profile Card */}
            <SectionReveal direction="left" className="lg:col-span-5">
              <div className="bg-[#12183D] border border-solvorry-DEFAULT/30 p-8 sm:p-10 rounded-sm relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-solvorry-DEFAULT" />
                <div className="w-16 h-16 rounded-full bg-solvorry-DEFAULT/20 flex items-center justify-center mb-6 text-solvorry-light border border-solvorry-light/30">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs uppercase tracking-[0.25em] font-bold text-solvorry-light font-display mb-2">
                  FOUNDER & VISIONARY
                </div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white mb-2 tracking-tight">
                  Mr. Kamal Gor
                </h3>
                <p className="text-white/60 text-sm font-display mb-6">
                  Founder & Managing Director, ACE SELECT
                </p>

                <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-2 h-2 rounded-full bg-solvorry-light" />
                    <span>Architect of Pan-India 476+ City Execution</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-2 h-2 rounded-full bg-solvorry-light" />
                    <span>Pioneer in Design-to-Build & Environmental Innovation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-2 h-2 rounded-full bg-solvorry-light" />
                    <span>Steering ₹100 Crore+ Annual Turnkey Operations</span>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Leadership Message & Philosophy */}
            <SectionReveal direction="right" delay={150} className="lg:col-span-7">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Quote className="w-12 h-12 text-solvorry-DEFAULT/50 flex-shrink-0" />
                  <p className="text-white/90 font-display font-semibold text-lg md:text-xl leading-relaxed italic">
                    “Guided by our visionary leadership, ACE SELECT is built on a foundation of excellence and innovation. Our Design-to-Build approach reflects a steadfast commitment to exploring fresh ideas and refining execution processes.”
                  </p>
                </div>

                <p className="text-white/70 font-body text-base leading-relaxed pl-16">
                  Every project is a testament to the expertise and dedication of our passionate team, who work tirelessly to bring your vision to life. Operating in a highly dynamic and sensitive industry, we have gained invaluable insights and a deep understanding of market demands, enabling us to consistently deliver exceptional and timely service.
                </p>

                <p className="text-white/70 font-body text-base leading-relaxed pl-16">
                  This reputation for quality and responsiveness is what sets us apart. By thoroughly understanding your current and future needs and your business’s essence, we transform abstract ideas into creative, impactful spaces that inspire.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Cloud CMS on JIO SOFTWARE */}
      <section className="bg-white py-24 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F8FA] border border-neutral-200 p-8 sm:p-12 lg:p-16 rounded-md">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solvorry-DEFAULT/10 border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT text-xs font-semibold uppercase tracking-wider mb-4">
                  <Cloud className="w-3.5 h-3.5" />
                  PROPRIETARY DIGITAL INFRASTRUCTURE
                </div>
                <h2 className="font-display font-black text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-[1.1]">
                  SECURE CLOUD CMS<br />
                  <span className="text-solvorry-DEFAULT">HOSTED ON JIO SOFTWARE.</span>
                </h2>
              </div>
              <p className="text-neutral-600 max-w-lg font-body text-base leading-relaxed">
                ACE SELECT offers a secure, cloud-based Content Management System (CMS) hosted on JIO SOFTWARE, providing centralized management with advanced access controls for seamless oversight of all digital branding elements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border border-neutral-200 rounded-sm shadow-sm hover:border-solvorry-DEFAULT transition-all">
                <div className="w-12 h-12 rounded-full bg-solvorry-DEFAULT/10 flex items-center justify-center text-solvorry-DEFAULT mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-neutral-900 mb-3">
                  Centralized Oversight
                </h4>
                <p className="text-neutral-600 font-body text-sm leading-relaxed">
                  Single-pane remote management across hundreds of digital displays, DOOH billboards, and visual brand assets distributed nationwide.
                </p>
              </div>

              <div className="bg-white p-8 border border-neutral-200 rounded-sm shadow-sm hover:border-solvorry-DEFAULT transition-all">
                <div className="w-12 h-12 rounded-full bg-solvorry-DEFAULT/10 flex items-center justify-center text-solvorry-DEFAULT mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-neutral-900 mb-3">
                  Advanced Access Controls
                </h4>
                <p className="text-neutral-600 font-body text-sm leading-relaxed">
                  Strict role-based permissions, multi-tier approvals, encrypted content streaming, and audit trails to protect brand integrity.
                </p>
              </div>

              <div className="bg-white p-8 border border-neutral-200 rounded-sm shadow-sm hover:border-solvorry-DEFAULT transition-all">
                <div className="w-12 h-12 rounded-full bg-solvorry-DEFAULT/10 flex items-center justify-center text-solvorry-DEFAULT mb-6">
                  <Cloud className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-neutral-900 mb-3">
                  JIO SOFTWARE Cloud
                </h4>
                <p className="text-neutral-600 font-body text-sm leading-relaxed">
                  High-availability cloud backbone guaranteeing continuous uptime, instant automated scheduling, and real-time screen health monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Diverse Sectors We Serve */}
      <section className="bg-white py-24 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-16">
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-4 font-display">
              VERSATILE INDUSTRY REACH
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 tracking-tight leading-[1.1]">
              SERVING CLIENTS ACROSS<br />
              <span className="text-solvorry-DEFAULT">DIVERSE SECTORS.</span>
            </h2>
            <p className="text-neutral-600 font-body text-base max-w-2xl mt-4 leading-relaxed">
              Whether constructing, renovating, transferring, or creating new spaces, we transform abstract ideas into creative, impactful spaces tailored to your industry’s essence.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Building className="w-6 h-6" />, title: "CORPORATE", desc: "Headquarters, executive lobbies & dynamic agile work floors." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "FINANCE", desc: "Banking branches, ATM networks, and wealth management centers." },
              { icon: <Car className="w-6 h-6" />, title: "AUTOMOTIVE", desc: "Showrooms, digital dealership experiences & outdoor façades." },
              { icon: <Store className="w-6 h-6" />, title: "RETAIL", desc: "Flagship rollouts, visual merchandising, and shop-in-shops." },
              { icon: <UtensilsCrossed className="w-6 h-6" />, title: "HOSPITALITY", desc: "Wayfinding, luxury digital ambiance, and experience lounges." },
            ].map((sector, i) => (
              <SectionReveal key={sector.title} delay={i * 80}>
                <div className="bg-[#F7F8FA] border border-neutral-200 p-8 h-full flex flex-col justify-between hover:border-solvorry-DEFAULT hover:bg-white transition-all group">
                  <div>
                    <div className="text-solvorry-DEFAULT mb-6 group-hover:scale-110 transition-transform">
                      {sector.icon}
                    </div>
                    <h4 className="font-display font-black text-lg text-neutral-900 mb-3 tracking-tight">
                      {sector.title}
                    </h4>
                    <p className="text-neutral-500 font-body text-xs leading-relaxed">
                      {sector.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-200 text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT">
                    DESIGN TO BUILD
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Our Journey & Heritage */}
      <section id="our-story" className="bg-[#F7F8FA] py-24 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 font-display">
                OUR JOURNEY
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 leading-[1.1] tracking-tight">
                A HERITAGE OF<br />INNOVATION & GROWTH.
              </h2>
            </div>
            <p className="text-neutral-500 max-w-md font-body text-base md:text-right leading-relaxed">
              From our founding in 1996 to managing ₹100 Crore+ operations across 476+ cities today, our journey is defined by unwavering dedication to client success.
            </p>
          </SectionReveal>
          
          <div className="relative mt-12 overflow-x-auto pb-8 scrollbar-hide">
            <div className="min-w-[850px]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-300" />
              <div className="flex justify-between w-full">
                {[
                  { year: 1996, title: "Founded with a vision to transform branding and visual displays under Mr. Kamal Gor" },
                  { year: 2005, title: "Expanded execution into regional commercial and retail projects nationwide" },
                  { year: 2012, title: "Pioneered integrated Design-to-Build turnkey solutions for corporate and banking" },
                  { year: 2018, title: "Scaled pan-India presence to over 300+ cities with robust fabrication logistics" },
                  { year: 2021, title: "Integrated secure cloud-based CMS hosted on JIO SOFTWARE for central oversight" },
                  { year: 2026, title: "Exceeding ₹100 Cr+ annual turnover with presence in 476+ cities across India" },
                ].map((item, i) => (
                  <SectionReveal key={item.year} delay={i * 100} className="relative pt-6 w-1/6 pr-4 shrink-0">
                    <div className="absolute top-[-4px] left-0 w-2 h-2 rounded-full bg-solvorry-DEFAULT border-2 border-white box-content" />
                    <div className="font-display font-black text-2xl text-neutral-900 mb-3 tracking-tight">{item.year}</div>
                    <p className="text-neutral-500 font-body text-[11px] leading-relaxed max-w-[140px]">{item.title}</p>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Mission & Vision */}
      <section className="bg-white border-b border-neutral-100">
        <div className="flex flex-col lg:flex-row">
          <SectionReveal direction="left" className="lg:w-1/2 relative min-h-[420px]">
            <img 
              src="/images/projects/project-varanasi-kashi.jpg" 
              alt="Shri Kashi Vishwanath Temple Project by ACE SELECT" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-center">
              <h2 className="font-display font-black text-5xl md:text-6xl text-white tracking-tighter leading-[1.05]">
                SPACES<br />THAT<br />INSPIRE
              </h2>
              <p className="text-white/80 font-body text-sm mt-4 max-w-xs">
                Balancing creative innovation with environmental responsibility.
              </p>
            </div>
          </SectionReveal>

          <div className="lg:w-1/2 p-12 md:p-16 lg:p-24 bg-white flex flex-col justify-center">
            <SectionReveal direction="right" delay={100}>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 font-display">
                MISSION & PURPOSE
              </div>
              <h2 className="font-display font-black text-4xl text-neutral-900 leading-[1.1] tracking-tight mb-6">
                TRANSFORMING ABSTRACT IDEAS<br />
                <span className="text-solvorry-DEFAULT">INTO IMPACTFUL REALITIES.</span>
              </h2>
              <p className="text-neutral-600 font-body text-base mb-12 leading-relaxed">
                {company.mission || "By thoroughly understanding our clients' current and future needs and business essence, our mission is to deliver inventive, elegant, and multi-functional spaces that elevate brand equity across India."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-neutral-100 pt-10">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT mb-4 bg-solvorry-DEFAULT/5">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-neutral-900 mb-3">
                    OUR VISION
                  </h4>
                  <p className="text-neutral-500 font-body text-xs leading-relaxed">
                    {company.vision || "To be India's most respected leader in Advertising, Branding, and Commercial Construction, renowned for beyond-the-box creative thinking."}
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT mb-4 bg-solvorry-DEFAULT/5">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-neutral-900 mb-3">
                    OUR COMMITMENT
                  </h4>
                  <p className="text-neutral-500 font-body text-xs leading-relaxed">
                    Flawless turnkey Design-to-Build execution, sustainable craftsmanship, and relentless dedication to timely delivery.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 9. Core Values */}
      <section className="bg-[#F7F8FA] py-24 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 font-display">
                OUR VALUES
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-neutral-900 leading-[1.1] tracking-tight">
                WHAT DRIVES<br />US EVERY DAY.
              </h2>
            </div>
            <p className="text-neutral-500 max-w-sm font-body text-base md:text-right leading-relaxed">
              Our values define who we are, our beyond-the-box mindset, and our commitment to environmental responsibility and customer trust.
            </p>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Diamond className="w-6 h-6" />, title: "EXCELLENCE", desc: "Setting benchmarks in design, fabrication precision, and flawless on-ground project execution." },
              { icon: <Lightbulb className="w-6 h-6" />, title: "BEYOND THE BOX", desc: "Creative thinking is our driving force, constantly exploring fresh ideas and inventive spatial solutions." },
              { icon: <Layers className="w-6 h-6" />, title: "ENVIRONMENTAL RESPONSIBILITY", desc: "Deeply embedded in our heritage, we balance cutting-edge innovation with sustainable materials and processes." },
              { icon: <Target className="w-6 h-6" />, title: "ACCOUNTABILITY", desc: "Taking total ownership from concept to completion with complete transparency and timely service." }
            ].map((val, i) => (
              <SectionReveal key={val.title} delay={i * 100} direction="up">
                <div className="bg-white p-10 border border-neutral-200 h-full flex flex-col hover:border-solvorry-DEFAULT transition-all">
                  <div className="text-solvorry-DEFAULT mb-8">
                    {val.icon}
                  </div>
                  <h4 className="font-display font-black text-lg text-neutral-900 mb-4 tracking-tight">{val.title}</h4>
                  <p className="text-neutral-500 font-body text-sm leading-relaxed">{val.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Pan-India Presence */}
      <section className="bg-white py-24 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-24">
            <SectionReveal direction="left" className="lg:w-1/3">
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 font-display">
                OUR PRESENCE
              </div>
              <h2 className="font-display font-black text-4xl text-neutral-900 leading-[1.1] tracking-tight mb-6">
                OVER 476+ CITIES.<br />
                <span className="text-solvorry-DEFAULT">PAN-INDIA REACH.</span>
              </h2>
              <p className="text-neutral-600 font-body text-base mb-8 leading-relaxed">
                With presence across 476+ cities, dedicated regional representatives, and localized fabrication facilities, we guarantee seamless execution and rapid turnaround in every state.
              </p>
              <Link href="/contact" className="bg-solvorry-DEFAULT text-white px-8 py-4 font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 hover:bg-solvorry-dark transition-colors">
                CONNECT WITH US <ArrowRight className="w-4 h-4" />
              </Link>
            </SectionReveal>
            
            <SectionReveal delay={100} className="lg:w-2/3 w-full bg-[#0B0F2B] p-12 md:p-16 rounded-[4px] flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[340px]">
              <div className="font-display font-black text-white text-3xl md:text-4xl tracking-tight z-10 w-full md:w-5/12 mb-8 md:mb-0 leading-[1.1]">
                NATIONWIDE<br />SCALE.<br />
                <span className="text-solvorry-light">LOCAL AGILITY.</span>
                <p className="text-xs font-body font-normal text-white/60 mt-4 leading-relaxed">
                  Delivering consistent quality across Tier-1, Tier-2, and Tier-3 cities under centralized project governance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 z-10 w-full md:w-7/12 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                {[
                  { value: "476+", label: "CITIES ACTIVE" },
                  { value: "27+", label: "STATES COVERED" },
                  { value: "176+", label: "REGIONAL REPS" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="font-display font-black text-3xl lg:text-4xl text-white tracking-tight mb-1">
                      {stat.value}
                    </div>
                    <div className="text-solvorry-light font-display font-bold tracking-widest text-[9px] uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 11. Workshop, Warehouse & Advanced Machinery (Pages 11-14) */}
      <section className="bg-[#F7F8FA] py-24 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-neutral-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-solvorry-DEFAULT/10 border border-solvorry-DEFAULT/20 text-solvorry-DEFAULT text-xs font-semibold uppercase tracking-wider mb-4">
                  <Factory className="w-3.5 h-3.5" />
                  MANUFACTURING & FABRICATION INFRASTRUCTURE
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-neutral-900 tracking-tight leading-[1.08]">
                  WORKSHOP, WAREHOUSE &<br />
                  <span className="text-solvorry-DEFAULT">HEAVY MACHINERY.</span>
                </h2>
              </div>
              <p className="text-neutral-600 max-w-xl font-body text-base leading-relaxed">
                Operating centralized production hubs with an unprecedented <strong>3,00,000 sq. ft. per day printing capacity</strong> and <strong>10,000 m² per year Active LED assembly capacity</strong>, ACE SELECT delivers end-to-end fabrication with zero vendor dependencies.
              </p>
            </div>
          </SectionReveal>

          {/* Infrastructure Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <SectionReveal direction="left" className="lg:col-span-7">
              <div className="relative rounded-sm overflow-hidden border border-neutral-200 shadow-md group h-full min-h-[380px]">
                <img
                  src="/images/infrastructure/workshop-facility.jpg"
                  alt="ACE SELECT Centralized Workshop & Fabrication Warehouse"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F2B]/90 via-[#0B0F2B]/40 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-solvorry-light font-display font-bold text-xs tracking-widest uppercase mb-1">
                    CENTRALIZED HEAVY FABRICATION HUB
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                    Turnkey Workshop & Structural Facility
                  </h3>
                  <p className="text-white/80 font-body text-xs sm:text-sm max-w-xl">
                    Housing cutting-edge UV printers, precision metal bending, CNC profile cutters, and climate-controlled display burn-in testing bays.
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={150} className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="bg-white border border-neutral-200 p-8 rounded-sm shadow-xs hover:border-solvorry-DEFAULT transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-solvorry-DEFAULT/10 flex items-center justify-center text-solvorry-DEFAULT">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-lg text-neutral-900">Vutek 8-Colour UV Setup</h4>
                    <span className="text-xs text-neutral-500 font-medium">Fast-5 Technology (2 High-Volume Lines)</span>
                  </div>
                </div>
                <p className="text-neutral-600 font-body text-xs leading-relaxed mb-4">
                  Offers eight-colour plus white and Fast-5 printing for photorealistic quality at production speeds, with dual resolution capability of 600 dpi or 1000 dpi.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-solvorry-DEFAULT tracking-wider uppercase font-display">
                  <span>DUAL 600 / 1000 DPI</span> • <span>PHOTOREALISTIC PRINTING</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-8 rounded-sm shadow-xs hover:border-solvorry-DEFAULT transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-solvorry-DEFAULT/10 flex items-center justify-center text-solvorry-DEFAULT">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-lg text-neutral-900">EPSON Four-Colour 60610</h4>
                    <span className="text-xs text-neutral-500 font-medium">Eco-Solvent Print Fleet (4 Machines)</span>
                  </div>
                </div>
                <p className="text-neutral-600 font-body text-xs leading-relaxed mb-4">
                  High-speed precision color gamut profiling for national banking rollouts, ATM skins, and luxury retail visual merchandising with eco-certified inks.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-solvorry-DEFAULT tracking-wider uppercase font-display">
                  <span>ECO-CERTIFIED INKS</span> • <span>HP 5100 FLEET & LEISTER SEAMING</span>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Machinery Production Capabilities Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "3,00,000 SQ. FT. / DAY", desc: "Daily Large-Format Printing Output", badge: "PRINT CAPACITY" },
              { title: "10,000 M² / YEAR", desc: "Active LED Display Assembly", badge: "DISPLAY CAPACITY" },
              { title: "586+ VENDORS & 476+ CITIES", desc: "Integrated Pan-India Logistics Grid", badge: "NETWORK REACH" },
              { title: "36/40 IN-HOUSE ENGINEERS", desc: "Dedicated Electronics & Civil Specialists", badge: "TECHNICAL TEAM" },
            ].map((cap, i) => (
              <div key={i} className="bg-white p-6 border border-neutral-200 rounded-sm">
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT block mb-2">
                  {cap.badge}
                </span>
                <div className="font-display font-black text-lg sm:text-xl text-neutral-900 tracking-tight mb-1">
                  {cap.title}
                </div>
                <p className="text-neutral-500 font-body text-xs leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Quality, Compliance & Official Scanned Certificates */}
      <CertificatesShowcase />
      
      {/* 12. Call to Action */}
      <section className="bg-[#0B0F2B] text-white py-32 border-t-[8px] border-solvorry-DEFAULT relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SectionReveal>
            <h2 className="font-display font-black text-5xl md:text-6xl text-white tracking-tight mb-8">
              READY TO BUILD<br />SOMETHING EXTRAORDINARY?
            </h2>
            <p className="font-body text-white/80 max-w-xl mx-auto mb-10 text-lg">
              Partner with ACE SELECT for Advertising, Branding, Commercial Construction, and centralized digital experiences that set new standards.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-bold text-xs tracking-widest uppercase transition-colors hover:bg-solvorry-light border border-transparent">
              START A CONVERSATION <ArrowRight className="w-4 h-4" />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
