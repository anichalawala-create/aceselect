import SectionReveal from "@/components/SectionReveal";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star, Network, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { getPageContent, getPageContentValue, getPageContentMedia } from "@/lib/cms-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CapabilitiesPage() {
  const pageContent = await getPageContent("services");
  const heroImage = getPageContentMedia(pageContent, "hero.image", "");
  return (
    <div className="bg-white min-h-screen selection:bg-solvorry-DEFAULT selection:text-white font-body overflow-hidden">
      
      {/* 02 — HERO */}
      <section className="relative min-h-[85vh] pt-32 pb-16 flex items-center bg-[#F7F8FA] border-b border-neutral-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] bg-solvorry-DEFAULT/5 blur-[120px] rounded-full animate-float" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] bg-solvorry-light/5 blur-[100px] rounded-full animate-float-delayed" />
          
          {/* Subtle Grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(40, 58, 151, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(40, 58, 151, 0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {heroImage && <img src={heroImage} alt={getPageContentValue(pageContent, "hero.image_alt", "Services") } className="absolute inset-0 h-full w-full object-cover opacity-10" />}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between relative z-10">
          
          {/* Left: Content */}
          <div className="lg:w-3/5 flex flex-col justify-center">
            <nav className="text-[10px] tracking-[0.2em] uppercase font-bold text-solvorry-DEFAULT mb-8 font-display">
              HOME / CAPABILITIES
            </nav>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-solvorry-DEFAULT" />
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold font-display text-neutral-800">
                {getPageContentValue(pageContent, "hero.eyebrow", "WHAT WE DO BEST")}
              </div>
            </div>
            
            <h1 className="font-display font-black text-6xl md:text-7xl lg:text-[6rem] leading-[1.05] mb-8 tracking-tight text-neutral-900 drop-shadow-sm">
              {getPageContentValue(pageContent, "hero.headline", "END-TO-END\nSOLUTIONS\nFOR EVERY SPACE.").split("\n").map((line, index, lines) => (
                <span key={`${line}-${index}`} className={index === lines.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-solvorry-DEFAULT to-solvorry-light" : ""}>{index > 0 && <br />}{line}</span>
              ))}
            </h1>
            
            <p className="font-body text-neutral-600 text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-medium">
              {getPageContentValue(pageContent, "hero.intro", "From branding and retail execution to commercial interiors, activations and rebranding, ACE SELECT delivers integrated solutions designed for scale.")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="#capabilities" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:bg-solvorry-dark shadow-glow hover:shadow-none hover:-translate-y-1">
                EXPLORE CAPABILITIES <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-neutral-200 text-neutral-900 font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:border-solvorry-DEFAULT hover:text-solvorry-DEFAULT hover:bg-[#F7F8FA] hover:-translate-y-1 shadow-sm">
                START A PROJECT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Right: Architectural Typographic Graphic (Interactive) */}
          <div className="lg:w-2/5 flex items-center justify-end">
            <div className="w-full max-w-md border-l-2 border-neutral-200 pl-8 lg:pl-16 flex flex-col gap-8 relative">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-2 h-2 bg-solvorry-DEFAULT animate-pulse" />
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-neutral-300" />
               <div className="absolute top-1/2 -left-[1px] w-[2px] h-32 bg-solvorry-DEFAULT -translate-y-1/2" />
               
               {['BRANDING', 'RETAIL', 'INTERIORS', 'ACTIVATION', 'REBRANDING'].map((item, i) => (
                 <div key={item} className="group relative cursor-pointer">
                   <div className="absolute -inset-y-4 -inset-x-8 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded shadow-card -z-10" />
                   <div className="text-[10px] tracking-[0.3em] font-bold text-neutral-400 mb-1 group-hover:text-solvorry-DEFAULT transition-colors duration-300">
                     0{i + 1}
                   </div>
                   <div className="font-display font-black text-4xl text-neutral-800 tracking-tighter group-hover:pl-4 group-hover:text-solvorry-DEFAULT transition-all duration-300 flex items-center justify-between">
                     {item}
                     <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CAPABILITIES INTRODUCTION */}
      <section className="bg-white py-24 border-b border-neutral-100 relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <SectionReveal className="lg:w-1/2 relative">
              <div className="absolute -left-12 -top-12 text-[150px] font-black text-neutral-50 leading-none select-none -z-10 font-display tracking-tighter">BUILD</div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-solvorry-DEFAULT mb-6 font-display">
                WHAT WE DO
              </div>
              <h2 className="font-display font-black text-5xl md:text-6xl text-neutral-900 leading-[1.1] tracking-tight">
                SOLUTIONS<br/>THAT BUILD<br/>BRANDS.
              </h2>
            </SectionReveal>
            <SectionReveal delay={150} className="lg:w-1/2 flex flex-col justify-between">
              <div className="pl-0 lg:pl-12 border-l-0 lg:border-l border-neutral-200">
                <p className="text-neutral-600 font-body text-xl leading-relaxed mb-12 font-medium">
                  ACE SELECT executes complex physical brand transformations with precision. 
                  Our end-to-end capabilities ensure that whether you are rolling out a 
                  nationwide retail campaign or building a premium commercial interior, 
                  the result is consistently exceptional.
                </p>
                <div className="flex items-center gap-8 bg-[#F7F8FA] p-8 rounded-sm border border-neutral-100 group hover:border-solvorry-DEFAULT/30 transition-colors cursor-default">
                  <div className="font-display font-black text-7xl text-solvorry-DEFAULT tracking-tighter leading-none group-hover:scale-110 transition-transform duration-500">
                    06
                  </div>
                  <div className="font-display font-bold text-sm tracking-[0.2em] uppercase text-neutral-800">
                    CORE<br/>CAPABILITIES
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 04 — CORE CAPABILITIES GRID (Highly Interactive) */}
      <section id="capabilities" className="bg-[#0B0F2B] py-32 border-b-8 border-solvorry-DEFAULT relative overflow-hidden">
        {/* Ambient Dark Background Details */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-solvorry-DEFAULT/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal className="mb-20 text-center flex flex-col items-center">
            <div className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-solvorry-light mb-4">FROM CONCEPT TO COMPLETION.</div>
            <h2 className="font-display font-black text-5xl md:text-6xl text-white tracking-tight mb-2">OUR CAPABILITIES</h2>
            <div className="w-24 h-1 bg-solvorry-DEFAULT mt-8" />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "EXTERNAL BRANDING", desc: "High-impact outdoor branding, signage and large-format visual solutions." },
              { num: "02", title: "INTERNAL BRANDING", desc: "In-store branding and visual communication designed around customer experience." },
              { num: "03", title: "RETAIL ROLLOUTS", desc: "Multi-location retail execution with consistent quality and delivery." },
              { num: "04", title: "COMMERCIAL INTERIORS", desc: "Functional, premium interior solutions for commercial environments." },
              { num: "05", title: "BRAND ACTIVATION", desc: "Physical brand experiences, events and activation environments." },
              { num: "06", title: "REBRANDING", desc: "Complete transformation of existing spaces and brand environments." },
            ].map((cap, i) => (
              <SectionReveal key={cap.num} delay={i * 100}>
                <Link href={`/services/${cap.title.toLowerCase().replace(' ', '-')}`} className="block h-full">
                  <div className="bg-white/5 backdrop-blur-sm p-10 border border-white/10 flex flex-col h-full hover:bg-white hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                    {/* Hover Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-solvorry-DEFAULT transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    
                    <div className="font-display font-black text-5xl text-white/10 mb-10 group-hover:text-solvorry-DEFAULT/20 transition-colors duration-500">{cap.num}</div>
                    
                    <h3 className="font-display font-black text-2xl text-white tracking-tight leading-[1.1] mb-4 w-3/4 group-hover:text-neutral-900 transition-colors duration-500">
                      {cap.title.replace(' ', '\n')}
                    </h3>
                    
                    <p className="text-white/60 font-body text-sm leading-relaxed mb-12 flex-grow group-hover:text-neutral-600 transition-colors duration-500">
                      {cap.desc}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-white font-display font-bold text-[10px] tracking-widest uppercase group-hover:text-solvorry-DEFAULT transition-colors duration-500 mt-auto">
                      EXPLORE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — CAPABILITY DETAIL FEATURE (With Rich Imagery) */}
      <section className="bg-white py-32 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-40">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <SectionReveal direction="left" className="lg:w-1/2">
              <div className="w-full aspect-[4/3] relative overflow-hidden group shadow-card rounded-sm">
                 <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" alt="External Branding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-8 left-8 text-white">
                    <div className="font-display font-bold text-[10px] tracking-widest uppercase text-solvorry-light mb-2">FEATURED CAPABILITY</div>
                    <div className="font-display font-black text-4xl tracking-tight">EXTERNAL BRANDING</div>
                 </div>
              </div>
            </SectionReveal>
            <SectionReveal direction="right" delay={150} className="lg:w-1/2">
              <div className="text-[10px] tracking-[0.3em] font-bold text-solvorry-DEFAULT mb-4 font-display flex items-center gap-4">
                <span className="w-8 h-[2px] bg-solvorry-DEFAULT"></span>
                01 CAPABILITY
              </div>
              <h3 className="font-display font-black text-5xl md:text-6xl text-neutral-900 leading-[1.05] tracking-tight mb-8">
                BIGGER PLATFORMS.<br/>
                <span className="text-solvorry-DEFAULT">BOLDER IMPACT.</span>
              </h3>
              <p className="text-neutral-600 font-body text-lg leading-relaxed mb-10 max-w-lg">
                We engineer and execute high-visibility outdoor branding solutions that command attention. 
                From structural signage to massive building wraps, we ensure your brand dominates the physical landscape.
              </p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-12">
                {[
                  "Large-format displays", "Building facade branding", "Static & dynamic signage",
                  "Outdoor branding", "Transit & airport branding", "End-to-end execution"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-neutral-800 font-bold font-display">
                    <CheckCircle2 className="w-4 h-4 text-solvorry-DEFAULT" /> {item}
                  </div>
                ))}
              </div>
              <Link href="/services/external-branding" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F7F8FA] border border-neutral-200 text-neutral-900 font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:border-solvorry-DEFAULT hover:text-solvorry-DEFAULT hover:bg-white shadow-sm hover:shadow-md">
                EXPLORE EXTERNAL BRANDING <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <SectionReveal direction="right" className="lg:w-1/2">
              <div className="w-full aspect-[4/3] relative overflow-hidden group shadow-card rounded-sm">
                 <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" alt="Internal Branding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-8 right-8 text-white text-right">
                    <div className="font-display font-bold text-[10px] tracking-widest uppercase text-solvorry-light mb-2">FEATURED CAPABILITY</div>
                    <div className="font-display font-black text-4xl tracking-tight">INTERNAL BRANDING</div>
                 </div>
              </div>
            </SectionReveal>
            <SectionReveal direction="left" delay={150} className="lg:w-1/2">
              <div className="text-[10px] tracking-[0.3em] font-bold text-solvorry-DEFAULT mb-4 font-display flex items-center gap-4">
                <span className="w-8 h-[2px] bg-solvorry-DEFAULT"></span>
                02 CAPABILITY
              </div>
              <h3 className="font-display font-black text-5xl md:text-6xl text-neutral-900 leading-[1.05] tracking-tight mb-8">
                IMMERSIVE SPACES.<br/>
                <span className="text-solvorry-DEFAULT">ENGAGING EXPERIENCES.</span>
              </h3>
              <p className="text-neutral-600 font-body text-lg leading-relaxed mb-10 max-w-lg">
                Transform interiors into immersive brand environments. We integrate materials, lighting, 
                and spatial design to create seamless in-store communication and experiential zones.
              </p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-12">
                {[
                  "In-store visual merchandising", "Environmental graphics", "Wayfinding systems",
                  "Experiential zones", "Digital integration", "Premium material finishes"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-neutral-800 font-bold font-display">
                    <CheckCircle2 className="w-4 h-4 text-solvorry-DEFAULT" /> {item}
                  </div>
                ))}
              </div>
              <Link href="/services/internal-branding" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F7F8FA] border border-neutral-200 text-neutral-900 font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:border-solvorry-DEFAULT hover:text-solvorry-DEFAULT hover:bg-white shadow-sm hover:shadow-md">
                EXPLORE INTERNAL BRANDING <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>
          </div>

        </div>
      </section>

      {/* 06 — HOW WE EXECUTE (Interactive Timeline) */}
      <section className="bg-neutral-50 py-32 border-b border-neutral-200 overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-24 text-center">
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-solvorry-DEFAULT mb-4 font-display">THE ACE SELECT PROCESS</div>
            <h2 className="font-display font-black text-5xl text-neutral-900 tracking-tight mb-6">FROM CONCEPT TO COMPLETION.</h2>
            <p className="text-neutral-600 font-body text-lg max-w-2xl leading-relaxed mx-auto">
              A structured execution process built for consistency, quality and on-time delivery across every project.
            </p>
          </SectionReveal>

          <div className="relative">
             {/* Horizontal connecting line (Desktop) */}
             <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-neutral-200" />
             
             <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 justify-between relative z-10">
               {[
                 { step: "01", title: "DISCOVER", desc: "Site audits and requirement gathering.", delay: 0 },
                 { step: "02", title: "DESIGN", desc: "Engineering and structural planning.", delay: 100 },
                 { step: "03", title: "PRODUCE", desc: "In-house precision manufacturing.", delay: 200 },
                 { step: "04", title: "DEPLOY", desc: "Logistics and on-ground installation.", delay: 300 },
                 { step: "05", title: "INSPECT", desc: "Rigorous quality control checks.", delay: 400 },
                 { step: "06", title: "DELIVER", desc: "Handover and ongoing support.", delay: 500 },
               ].map((item) => (
                 <SectionReveal key={item.step} delay={item.delay} className="flex flex-row lg:flex-col items-center lg:items-center gap-6 lg:gap-6 flex-1 group">
                   {/* Node */}
                   <div className="w-14 h-14 rounded-full bg-white border-2 border-neutral-200 group-hover:border-solvorry-DEFAULT group-hover:bg-solvorry-DEFAULT transition-all duration-300 flex items-center justify-center font-display font-black text-neutral-400 group-hover:text-white text-lg flex-shrink-0 shadow-[0_0_0_8px_#F9FAFB] group-hover:shadow-[0_0_20px_rgba(40,58,151,0.3)] z-10">
                     {item.step}
                   </div>
                   {/* Vertical line for mobile */}
                   <div className="lg:hidden absolute left-[27px] top-14 bottom-0 w-[2px] bg-neutral-200 -z-10 h-[calc(100%+24px)] group-hover:bg-solvorry-DEFAULT transition-colors" />
                   
                   <div className="lg:text-center">
                     <h4 className="font-display font-black text-xl text-neutral-900 tracking-tight mb-2 group-hover:text-solvorry-DEFAULT transition-colors">{item.title}</h4>
                     <p className="text-neutral-500 font-body text-sm leading-relaxed max-w-[160px] mx-auto">{item.desc}</p>
                   </div>
                 </SectionReveal>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 07 — CAPABILITY × SCALE */}
      <section className="bg-solvorry-DEFAULT py-32 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F2B]/40 to-transparent" />
        {/* Animated Marquee Background */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex whitespace-nowrap opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
          <div className="animate-marquee font-display font-black text-[20vw] tracking-tighter leading-none select-none">
            NATIONWIDE SCALE • FLAWLESS EXECUTION • 
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SectionReveal>
            <h2 className="font-display font-black text-6xl md:text-7xl tracking-tight mb-8 drop-shadow-lg">
              BUILT FOR<br/>COMPLEXITY.
            </h2>
            <p className="text-white/80 font-body text-xl max-w-2xl mx-auto leading-relaxed mb-24">
              Whether a single location or a nationwide rollout, our capabilities are designed to maintain consistency across every touchpoint.
            </p>
          </SectionReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {[
              { num: "476+", label: "CITIES" },
              { num: "27", label: "STATES" },
              { num: "176+", label: "REGIONAL REPRESENTATIVES" }
            ].map((stat, i) => (
              <SectionReveal key={i} delay={i * 100} className="flex flex-col items-center justify-center pt-12 sm:pt-0 group">
                <div className="font-display font-black text-7xl md:text-8xl tracking-tighter mb-4 group-hover:scale-110 transition-transform duration-500">{stat.num}</div>
                <div className="font-display font-bold text-xs tracking-[0.3em] uppercase text-white/60">{stat.label}</div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — INDUSTRY CONNECTION */}
      <section className="bg-white py-32 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-20 text-center">
            <div className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-solvorry-DEFAULT mb-4">VERSATILE EXPERTISE</div>
            <h2 className="font-display font-black text-5xl text-neutral-900 tracking-tight">CAPABILITIES ACROSS INDUSTRIES.</h2>
          </SectionReveal>
          
          <div className="flex flex-col border-t-2 border-neutral-900 max-w-5xl mx-auto">
            {[
              { name: "RETAIL", desc: "Flagship stores, multi-brand outlets and shop-in-shops." },
              { name: "BANKING", desc: "Branch rollouts, ATM branding and corporate interiors." },
              { name: "AUTOMOTIVE", desc: "Dealership experiences and outdoor branding." },
              { name: "HOSPITALITY", desc: "Wayfinding, digital displays and premium finishes." },
              { name: "REAL ESTATE", desc: "Experience centers, site branding and hoarding." },
              { name: "CONSUMER BRANDS", desc: "Brand activations, events and product launches." }
            ].map((ind, i) => (
              <SectionReveal key={ind.name} delay={i * 50}>
                <div className="group border-b border-neutral-200 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-[#F7F8FA] px-6 -mx-6 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-solvorry-DEFAULT scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />
                  
                  <div className="font-display font-black text-3xl md:text-4xl text-neutral-900 tracking-tight md:w-5/12 group-hover:text-solvorry-DEFAULT transition-colors duration-300 flex items-center gap-6">
                    <span className="text-sm text-neutral-300 group-hover:text-solvorry-light font-bold tracking-widest transition-colors">0{i + 1}</span>
                    {ind.name}
                  </div>
                  <div className="text-neutral-500 font-body text-base md:w-6/12 group-hover:text-neutral-700 transition-colors">
                    {ind.desc}
                  </div>
                  <div className="md:w-1/12 flex justify-end">
                    <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-solvorry-DEFAULT group-hover:bg-solvorry-DEFAULT group-hover:text-white transition-all duration-300 text-neutral-400">
                       <ArrowUpRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — FEATURED PROJECTS */}
      <section className="bg-[#F7F8FA] py-32 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-20 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div>
               <div className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-solvorry-DEFAULT mb-4">OUR PORTFOLIO</div>
               <h2 className="font-display font-black text-5xl text-neutral-900 tracking-tight">CAPABILITIES<br/>IN ACTION.</h2>
            </div>
            <Link href="/projects" className="group inline-flex items-center gap-2 text-solvorry-DEFAULT font-display font-bold text-[10px] tracking-widest uppercase hover:text-solvorry-dark transition-all">
              <span className="border-b border-solvorry-DEFAULT/30 group-hover:border-solvorry-DEFAULT pb-1">VIEW ALL PROJECTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { client: "STATE BANK OF INDIA", project: "Hitachi ATM Network & Pan-India Signage", location: "Pan-India (476+ Cities)", cap: "BANKING INFRASTRUCTURE", img: "/images/projects/proj-hitachi-atm.jpg", href: "/projects/hitachi-sbi-atm-network" },
              { client: "SHRI KASHI VISHWANATH", project: "Heritage Active LED Video Wall Network", location: "Varanasi, UP", cap: "OUTDOOR ACTIVE LED", img: "/images/projects/proj-kashi-vishwanath.jpg", href: "/projects/kashi-vishwanath-temple" },
              { client: "CARATLANE / TITAN", project: "Flagship Luxury Retail Active LED Display", location: "Palladium Mall, Mumbai", cap: "RETAIL DISPLAY SYSTEMS", img: "/images/projects/proj-caratlane-palladium.jpg", href: "/projects/caratlane-palladium-mall" }
            ].map((proj, i) => (
              <SectionReveal key={proj.client} delay={i * 150} direction="up">
                <Link href={proj.href} className="group block cursor-pointer bg-white p-4 rounded-sm shadow-sm hover:shadow-card transition-all duration-500 hover:-translate-y-2">
                  <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative mb-6 rounded-sm">
                    <img src={proj.img} alt={proj.project} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 font-display font-bold text-[9px] tracking-widest uppercase text-neutral-900 rounded-sm">
                      {proj.cap}
                    </div>
                  </div>
                  <div className="px-2">
                     <div className="font-display font-bold text-xs tracking-[0.2em] uppercase text-solvorry-DEFAULT mb-2">{proj.client}</div>
                     <h4 className="font-display font-black text-2xl text-neutral-900 tracking-tight mb-4 group-hover:text-solvorry-DEFAULT transition-colors">{proj.project}</h4>
                     <div className="flex justify-between items-center text-sm text-neutral-500 font-medium border-t border-neutral-100 pt-4">
                       <span>{proj.location}</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-solvorry-DEFAULT text-xs uppercase tracking-wider font-bold">VIEW <ArrowUpRight className="w-4 h-4" /></span>
                     </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — WHY ACE SELECT */}
      <section className="bg-white py-32 border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-20 text-center">
            <h2 className="font-display font-black text-5xl md:text-6xl text-neutral-900 tracking-tight leading-[1.1]">
              MORE THAN A VENDOR.<br/>
              <span className="text-solvorry-DEFAULT">A TRUE PARTNER.</span>
            </h2>
          </SectionReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "EXPERIENCE", desc: "Years of industry and execution expertise across diverse environments.", icon: <Star className="w-8 h-8 text-solvorry-DEFAULT group-hover:text-white transition-colors" strokeWidth={1.5} /> },
              { title: "SCALE", desc: "Pan-India execution capability delivering consistency everywhere.", icon: <Network className="w-8 h-8 text-solvorry-DEFAULT group-hover:text-white transition-colors" strokeWidth={1.5} /> },
              { title: "PRECISION", desc: "Structured processes and rigorous quality control protocols.", icon: <ShieldCheck className="w-8 h-8 text-solvorry-DEFAULT group-hover:text-white transition-colors" strokeWidth={1.5} /> },
              { title: "TECHNOLOGY", desc: "Connected project visibility, reporting, and real-time approvals.", icon: <Zap className="w-8 h-8 text-solvorry-DEFAULT group-hover:text-white transition-colors" strokeWidth={1.5} /> }
            ].map((item, i) => (
              <SectionReveal key={item.title} delay={i * 100}>
                 <div className="bg-[#F7F8FA] p-10 h-full border border-neutral-100 group hover:bg-solvorry-DEFAULT hover:border-solvorry-DEFAULT transition-colors duration-500 rounded-sm hover:shadow-card hover:-translate-y-2">
                    <div className="mb-8 w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-sm group-hover:shadow-none">
                       {item.icon}
                    </div>
                    <h4 className="font-display font-black text-2xl text-neutral-900 tracking-tight mb-4 group-hover:text-white transition-colors">{item.title}</h4>
                    <p className="text-neutral-500 font-body text-base leading-relaxed group-hover:text-white/80 transition-colors">{item.desc}</p>
                 </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — TECHNOLOGY CONNECTION (Interactive UI Mockup) */}
      <section className="bg-white py-32 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20 lg:gap-24">
          <SectionReveal className="lg:w-1/2">
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-solvorry-DEFAULT mb-6 font-display">THE ACE SELECT ADVANTAGE</div>
            <h2 className="font-display font-black text-5xl md:text-6xl text-neutral-900 tracking-tight leading-[1.05] mb-8">
              EXECUTION,<br/>
              <span className="text-solvorry-DEFAULT">CONNECTED.</span>
            </h2>
            <p className="text-neutral-600 font-body text-xl leading-relaxed mb-12 max-w-lg font-medium">
              We leverage custom-built technology to bridge the gap between field execution and management. 
              Our proprietary platform provides real-time project visibility, seamless approvals, and comprehensive reporting.
            </p>
            <Link href="/technology" className="group inline-flex items-center gap-2 px-10 py-5 bg-[#F7F8FA] border border-neutral-200 text-neutral-900 font-display font-bold text-xs tracking-widest uppercase hover:border-solvorry-DEFAULT hover:text-white hover:bg-solvorry-DEFAULT transition-all duration-300 shadow-sm hover:shadow-glow">
              EXPLORE OUR TECHNOLOGY <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
          
          <SectionReveal delay={150} direction="left" className="lg:w-1/2 w-full">
            <div className="w-full aspect-[4/3] bg-neutral-100 rounded-lg border border-neutral-200 overflow-hidden relative shadow-card group cursor-pointer hover:-translate-y-2 transition-all duration-500">
               {/* Abstract Dashboard Mockup */}
               <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-20">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-amber-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
                 <div className="w-32 h-4 bg-neutral-100 rounded-sm" />
               </div>
               <div className="p-8 pt-24 h-full flex flex-col gap-6 bg-[#F7F8FA] relative">
                 {/* Decorative gradient orb */}
                 <div className="absolute top-20 right-10 w-64 h-64 bg-solvorry-DEFAULT/10 blur-[60px] rounded-full group-hover:bg-solvorry-DEFAULT/20 transition-colors duration-700" />
                 
                 <div className="flex gap-6 relative z-10">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-1/3 bg-white border border-neutral-200 rounded-md p-5 flex flex-col justify-between shadow-sm group-hover:shadow-md transition-shadow duration-300 transform group-hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
                       <div className="w-10 h-3 bg-neutral-200 rounded-full mb-8" />
                       <div className={`w-20 h-8 rounded-full ${i === 1 ? 'bg-solvorry-DEFAULT/20' : 'bg-neutral-100'}`} />
                     </div>
                   ))}
                 </div>
                 
                 <div className="w-full flex-grow bg-white border border-neutral-200 rounded-md p-8 flex flex-col gap-6 shadow-sm relative z-10 group-hover:shadow-md transition-shadow duration-300">
                   <div className="w-40 h-4 bg-neutral-200 rounded-full mb-2" />
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex gap-6 items-center border-b border-neutral-100 pb-5 last:border-0 hover:bg-neutral-50 p-2 -mx-2 rounded transition-colors cursor-pointer">
                       <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0" />
                       <div className="flex flex-col gap-3 flex-grow">
                         <div className="w-1/2 h-3 bg-neutral-200 rounded-full" />
                         <div className="w-1/4 h-2 bg-neutral-100 rounded-full" />
                       </div>
                       <div className="w-20 h-6 bg-green-100 rounded-full flex-shrink-0" />
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 12 — FINAL CTA */}
      <section className="bg-[#0B0F2B] text-white py-40 border-t-[8px] border-solvorry-DEFAULT relative overflow-hidden">
        {/* Subtle architectural lines & glowing elements */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/5" />
           <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5" />
           <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/5" />
           <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/5" />
           <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/5" />
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solvorry-DEFAULT/20 rounded-full blur-[120px] animate-pulse" />
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SectionReveal>
            <div className="w-[2px] h-20 bg-solvorry-DEFAULT mx-auto mb-10" />
            <h2 className="font-display font-black text-6xl md:text-7xl text-white tracking-tight mb-8 drop-shadow-lg">
              LET&apos;S BRING<br/>YOUR SPACE TO LIFE.
            </h2>
            <p className="font-body text-white/80 max-w-2xl mx-auto mb-12 text-xl font-medium">
              Discuss your branding, retail or interior project with the ACE SELECT team.
            </p>
            <Link href="/contact" className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-solvorry-DEFAULT text-white font-display font-bold text-sm tracking-widest uppercase transition-all hover:bg-solvorry-light shadow-glow hover:shadow-none hover:-translate-y-1 border border-transparent">
              START A CONVERSATION <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </SectionReveal>
        </div>
      </section>

    </div>
  );
}
