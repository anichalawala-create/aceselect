import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { ProjectCard } from "@/components/ui/Cards";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  tag: string;
  scope?: string;
}

const digitalProjects: PortfolioItem[] = [
  {
    id: "kashi-vishwanath-temple",
    title: "Shri Kashi Vishwanath Temple",
    category: "Outdoor Active LED",
    location: "Varanasi, Uttar Pradesh",
    imageUrl: "/images/projects/proj-kashi-vishwanath.jpg",
    tag: "Heritage Landmark",
    scope: "All-weather IP65 display network across spiritual corridors"
  },
  {
    id: "bkc-curved-architectural-billboard",
    title: "BKC Curved Architectural Billboard",
    category: "Commercial DOOH",
    location: "Bandra-Kurla Complex, Mumbai",
    imageUrl: "/images/projects/proj-bkc-mumbai.jpg",
    tag: "Architectural Curved LED",
    scope: "P3.9 ultra-high brightness curved commercial facade display"
  },
  {
    id: "siripuram-smart-city-led",
    title: "Siripuram Smart City LED Wall",
    category: "Smart City Infrastructure",
    location: "Visakhapatnam, Andhra Pradesh",
    imageUrl: "/images/projects/proj-visakhapatnam.jpg",
    tag: "ICCC Integrated",
    scope: "Civic broadcasting and emergency alert video wall"
  },
  {
    id: "marine-drive-dooh-display",
    title: "Marine Drive Iconic DOOH Display",
    category: "DOOH Infrastructure",
    location: "Marine Drive Seaface, Mumbai",
    imageUrl: "/images/projects/proj-marine-drive.jpg",
    tag: "Marine Grade IP66",
    scope: "Anti-corrosive high-footfall coastal outdoor display"
  },
  {
    id: "barakhamba-road-delhi",
    title: "Barakhamba Road Digital Display",
    category: "Commercial DOOH",
    location: "Connaught Place, New Delhi",
    imageUrl: "/images/projects/proj-delhi-barakhamba.jpg",
    tag: "Capital DOOH Hub",
    scope: "Heavy-traffic commercial arterial display with auto-dimming"
  },
  {
    id: "chitrakoot-jaipur-led",
    title: "Chitrakoot Commercial LED Display",
    category: "Commercial DOOH",
    location: "Chitrakoot, Jaipur, Rajasthan",
    imageUrl: "/images/projects/proj-jaipur-chitrakoot.jpg",
    tag: "High-Lumen DOOH",
    scope: "High-contrast daylight readable roadside LED billboard"
  },
  {
    id: "bkc-executive-banking-elobby",
    title: "BKC Executive Banking E-Lobby",
    category: "Indoor Active LED & Millwork",
    location: "BKC Financial Center, Mumbai",
    imageUrl: "/images/projects/proj-bkc-elobby.jpg",
    tag: "Turnkey Video Wall",
    scope: "P1.5 fine pitch boardroom and corporate reception video wall"
  },
  {
    id: "lower-parel-commercial-tower",
    title: "Lower Parel Commercial Tower LED",
    category: "Corporate LED Display",
    location: "Lower Parel Business District, Mumbai",
    imageUrl: "/images/projects/proj-lower-parel.jpg",
    tag: "Tower Facade",
    scope: "Architectural tower atrium active LED installation"
  },
  {
    id: "mehboob-studio-bandra",
    title: "Mehboob Studio Production LED",
    category: "Indoor & Outdoor Production Display",
    location: "Bandra West, Mumbai",
    imageUrl: "/images/projects/proj-mehboob-bandra.jpg",
    tag: "Film & Entertainment",
    scope: "Dual outdoor and indoor high refresh rate production LED"
  },
  {
    id: "sandoz-house-worli",
    title: "Sandoz House Commercial Facade",
    category: "Commercial DOOH",
    location: "Worli, Mumbai",
    imageUrl: "/images/projects/proj-worli-mumbai.jpg",
    tag: "Corporate Tower",
    scope: "High-lumen corporate building video display system"
  },
  {
    id: "model-town-jalandhar",
    title: "Model Town Commercial DOOH",
    category: "Regional DOOH",
    location: "Model Town, Jalandhar, Punjab",
    imageUrl: "/images/projects/proj-jalandhar.jpg",
    tag: "North India Network",
    scope: "All-weather regional digital billboard deployment"
  },
  {
    id: "kolhapur-commercial-led",
    title: "Kolhapur Commercial LED Wall",
    category: "Commercial DOOH",
    location: "Kolhapur, Maharashtra",
    imageUrl: "/images/projects/proj-kolhapur.jpg",
    tag: "Urban Arterial",
    scope: "High-footfall junction commercial advertising display"
  },
  {
    id: "noida-sector-77-led",
    title: "Noida Sector-77 Commercial LED",
    category: "Commercial DOOH",
    location: "Noida Sector 77, Uttar Pradesh",
    imageUrl: "/images/projects/proj-noida.jpg",
    tag: "NCR DOOH",
    scope: "High-density residential and retail hub outdoor video wall"
  },
  {
    id: "t-nagar-chennai-display",
    title: "T Nagar Commercial Display",
    category: "Retail DOOH",
    location: "T Nagar, Chennai, Tamil Nadu",
    imageUrl: "/images/projects/proj-chennai-tnagar.jpg",
    tag: "South India Hub",
    scope: "Premium commercial retail junction video display"
  },
  {
    id: "sailani-transit-nasik",
    title: "Sailani Bus Stop Transit LED",
    category: "Public Transit Signage",
    location: "Sailani Transit Hub, Nasik",
    imageUrl: "/images/projects/proj-nasik-transit.jpg",
    tag: "Public Infrastructure",
    scope: "Transit passenger info and public messaging digital display"
  },
  {
    id: "caratlane-palladium-mall",
    title: "CaratLane Flagship Retail LED",
    category: "Luxury Retail Active LED",
    location: "Palladium Mall, Lower Parel, Mumbai",
    imageUrl: "/images/projects/proj-caratlane-palladium.jpg",
    tag: "High CRI Display",
    scope: "Ultra-fine pitch architectural jewellery showcase video wall"
  },
];

const bankingProjects: PortfolioItem[] = [
  {
    id: "hitachi-sbi-atm-network",
    title: "Hitachi SBI ATM Network Rollout",
    category: "Banking Infrastructure",
    location: "Burar, Chattarpur MP, Bilhari & Pan-India",
    imageUrl: "/images/projects/proj-hitachi-atm.jpg",
    tag: "340+ Locations",
    scope: "Turnkey ATM kiosk fabrication, ACP cladding & digital surveillance fascia"
  },
  {
    id: "sbi-ncr-atm-kiosks",
    title: "SBI NCR ATM Kiosks Network",
    category: "ATM Kiosk Branding",
    location: "Dogra Complex, Mukerian & Punjab",
    imageUrl: "/images/projects/proj-atm-kiosks.jpg",
    tag: "North India Rollout",
    scope: "Standardized banking kiosk totems, vinyl wraps and directional signage"
  },
  {
    id: "sbi-branch-signage",
    title: "State Bank of India Branch Signage",
    category: "Nationalized Banking Network",
    location: "Over 476+ Cities Pan-India",
    imageUrl: "/images/projects/proj-sbi-branch-network.jpg",
    tag: "Pan-India Scale",
    scope: "Standardized external LED glow signs, 3D channel lettering & vinyl graphics"
  },
  {
    id: "atm-kiosk-cladding-totems",
    title: "ATM Kiosk Cladding & Static Totems",
    category: "ATM Infrastructure",
    location: "Pan-India Tier-1, Tier-2 & Rural Hubs",
    imageUrl: "/images/projects/proj-atm-kiosks-panindia.jpg",
    tag: "Modular Build",
    scope: "Factory-cured structural metal fabrication and weather-resistant coatings"
  },
  {
    id: "national-bank-branch-facades",
    title: "National Bank Branch Facades",
    category: "Turnkey Banking Signage",
    location: "Pan-India Branch Network",
    imageUrl: "/images/projects/proj-bank-signage-facade.jpg",
    tag: "Banking Architecture",
    scope: "Turnkey branch fascia replacement, wayfinding pylons and interior branding"
  },
  {
    id: "axis-house-headquarters",
    title: "Axis House Corporate Headquarters",
    category: "Corporate Bank Signage & Displays",
    location: "Worli, Mumbai",
    imageUrl: "/images/projects/proj-bank-signage.jpg",
    tag: "Corporate HQ",
    scope: "Bespoke corporate signage, executive boardroom wayfinding & visual displays"
  },
];

const brandingProjects: PortfolioItem[] = [
  {
    id: "retail-visual-merchandising",
    title: "Retail Visual Merchandising Network",
    category: "Retail Branding & Signage",
    location: "Pan-India High Streets & Malls",
    imageUrl: "/images/projects/proj-retail-signage-panindia.jpg",
    tag: "Multi-Store Rollout",
    scope: "3,00,000 sq. ft./day printing output for pan-India retail campaigns"
  },
  {
    id: "corporate-hq-signage",
    title: "Corporate Headquarters Signage",
    category: "Corporate Wayfinding & Pylons",
    location: "Metro Financial Districts Across India",
    imageUrl: "/images/projects/proj-corporate-signage.jpg",
    tag: "Architectural Signage",
    scope: "Illuminated pylon totems, dimensional metal letters and interior acoustic signage"
  },
  {
    id: "commercial-facade-branding",
    title: "Commercial Facade Branding",
    category: "Architectural Cladding & Signage",
    location: "Pan-India Commercial Hubs",
    imageUrl: "/images/projects/proj-commercial-facades.jpg",
    tag: "Commercial Architecture",
    scope: "High-grade ACP cladding, structural framework and LED illuminated fascias"
  },
  {
    id: "ghatkopar-high-street-signage",
    title: "Ghatkopar High-Street Signage & LED",
    category: "Commercial Retail Branding",
    location: "Ghatkopar, Mumbai",
    imageUrl: "/images/projects/proj-ghatkopar-mumbai.jpg",
    tag: "High Footfall Retail",
    scope: "Integrated commercial signage and front-service active LED storefront"
  },
  {
    id: "viviana-mall-pc-chandra",
    title: "Viviana Mall & PC Chandra Displays",
    category: "Retail Mall Experiences",
    location: "Thane, Mumbai & Kolkata",
    imageUrl: "/images/projects/proj-viviana-mall.jpg",
    tag: "Luxury Retail",
    scope: "In-mall digital signage totems and flagship retail facade installations"
  },
];

const turnkeyProjects: PortfolioItem[] = [
  {
    id: "bkc-executive-elobby-turnkey",
    title: "BKC Executive E-Lobby & Experience Center",
    category: "Design-to-Build Fit-Out",
    location: "Bandra-Kurla Complex, Mumbai",
    imageUrl: "/images/projects/proj-bkc-elobby.jpg",
    tag: "Complete Turnkey",
    scope: "Fine pitch LED, acoustic interior wall treatments, and automated executive spaces"
  },
  {
    id: "nationwide-exhibition-pavilions",
    title: "Nationwide Exhibition Pavilions & Trade Shows",
    category: "Exhibition Design & Build",
    location: "Pan-India Convention Centers",
    imageUrl: "/images/projects/proj-exhibition-panindia.jpg",
    tag: "Trade Pavilions",
    scope: "Custom modular structural pavilions, dynamic LED backdrops and custom millwork"
  },
  {
    id: "turnkey-commercial-workplace",
    title: "Turnkey Commercial Workplace Construction",
    category: "Commercial Interiors & Fit-Out",
    location: "476+ Cities Pan-India",
    imageUrl: "/images/projects/proj-turnkey-commercial.jpg",
    tag: "Design to Build",
    scope: "₹100 Cr+ annual scale in turnkey construction, workplace renovation and fit-outs"
  },
  {
    id: "custom-pavilions-brand-activations",
    title: "Custom Pavilions & Brand Activations",
    category: "Experiential Build & AV",
    location: "Major Metro Exhibition Venues",
    imageUrl: "/images/projects/proj-exhibition.jpg",
    tag: "Brand Activations",
    scope: "Heavy fabrication, rapid-deployment exhibition booths and integrated AV systems"
  },
];

const tabs = [
  { id: "digital", label: "Digital Displays", count: digitalProjects.length },
  { id: "banking", label: "Banking & ATM Networks", count: bankingProjects.length },
  { id: "branding", label: "Signage & Branding", count: brandingProjects.length },
  { id: "turnkey", label: "Turnkey & Exhibitions", count: turnkeyProjects.length },
];

export default function ProjectsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Projects" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">AUTHENTIC COMPANY PORTFOLIO</Eyebrow>
              <EditorialHeadline className="mb-8">
                LANDMARK <span className="text-solvorry-DEFAULT">PROJECTS</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                Real landmark installations delivered by ACE SELECT across 476+ cities—encompassing over 34,250 m² of Active LED displays, national banking ATM networks, commercial construction, and pan-India branding. Click on any project to explore full case studies, technical specifications, and galleries.
              </p>
            </div>
          </SectionReveal>

          {/* Quick Metrics Bar from Credentials */}
          <SectionReveal delay={100} className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#F7F8FA] border border-neutral-200 rounded-sm">
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT block">INSTALLED BASE</span>
                <span className="font-display font-black text-2xl text-neutral-900">34,251 m²</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Active LED displays nationwide</p>
              </div>
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT block">ANNUAL CAPACITY</span>
                <span className="font-display font-black text-2xl text-neutral-900">10,000 m²</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">LED assembly & testing/year</p>
              </div>
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT block">PRINTING SCALE</span>
                <span className="font-display font-black text-2xl text-neutral-900">3 Lakh sq.ft.</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">Per day UV & Eco-solvent output</p>
              </div>
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT block">PAN-INDIA GRID</span>
                <span className="font-display font-black text-2xl text-neutral-900">476+ Cities</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">586+ vendors & 36 engineers</p>
              </div>
            </div>
          </SectionReveal>

          {/* Tab navigation */}
          <SectionReveal className="mt-12" delay={150}>
            <div className="flex flex-wrap gap-6 border-b border-neutral-200 pb-2" role="navigation" aria-label="Project categories">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="group flex items-baseline gap-2 pb-2 text-sm font-display font-bold uppercase tracking-widest text-neutral-500 hover:text-solvorry-DEFAULT transition-colors relative"
                >
                  {tab.label}
                  <span className="text-[10px] text-neutral-400 group-hover:text-solvorry-DEFAULT font-normal">({tab.count})</span>
                  <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-solvorry-DEFAULT scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 1. Digital Displays & Active LED */}
      <section id="digital" className="pb-32 bg-white pt-10" aria-labelledby="digital-heading">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-2">
                ACTIVE LED & DOOH BILLBOARDS (PAGES 16–36)
              </div>
              <h2 id="digital-heading" className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Digital Displays & Active LED
              </h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-md font-body">
              Engineered for Indian weather conditions with high refresh rates, high-lumen daylight visibility, and secured cloud management on JIO SOFTWARE. Click any card to view detailed specifications.
            </p>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {digitalProjects.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <ProjectCard 
                    title={p.title}
                    category={p.category}
                    location={p.location}
                    imageUrl={p.imageUrl}
                    href={`/projects/${p.id}`}
                  />
                  {p.scope && (
                    <div className="mt-2 px-1 text-xs text-neutral-500 font-body leading-relaxed">
                      {p.scope}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 2. Banking & ATM Networks */}
      <section id="banking" className="py-32 bg-[#F7F8FA] border-y border-neutral-200" aria-labelledby="banking-heading">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-2">
                FINANCIAL INFRASTRUCTURE (PAGES 37–43)
              </div>
              <h2 id="banking-heading" className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Banking & ATM Networks
              </h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-md font-body">
              Fabrication, turnkey installation, and signage rollouts for State Bank of India, Hitachi Payment Services, Axis Bank, and leading national institutions. Click any card to view detailed specifications.
            </p>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bankingProjects.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <ProjectCard 
                    title={p.title}
                    category={p.category}
                    location={p.location}
                    imageUrl={p.imageUrl}
                    href={`/projects/${p.id}`}
                  />
                  {p.scope && (
                    <div className="mt-2 px-1 text-xs text-neutral-500 font-body leading-relaxed">
                      {p.scope}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 3. Pan-India Signage & Branding */}
      <section id="branding" className="py-32 bg-white" aria-labelledby="branding-heading">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-2">
                HIGH-STREET, RETAIL & WAYFINDING (PAGES 44–57)
              </div>
              <h2 id="branding-heading" className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Pan-India Signage & Branding
              </h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-md font-body">
              Large-format UV and Eco-Solvent graphics, architectural metal pylons, ACP facades, and dynamic visual merchandising across 476+ cities. Click any card to view detailed specifications.
            </p>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {brandingProjects.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <ProjectCard 
                    title={p.title}
                    category={p.category}
                    location={p.location}
                    imageUrl={p.imageUrl}
                    href={`/projects/${p.id}`}
                  />
                  {p.scope && (
                    <div className="mt-2 px-1 text-xs text-neutral-500 font-body leading-relaxed">
                      {p.scope}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 4. Turnkey Design-to-Build & Exhibitions */}
      <section id="turnkey" className="py-32 bg-[#F7F8FA] border-t border-neutral-200" aria-labelledby="turnkey-heading">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-2">
                COMMERCIAL CONSTRUCTION & EXPOS (PAGES 58–60)
              </div>
              <h2 id="turnkey-heading" className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Turnkey Design & Build & Exhibitions
              </h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-md font-body">
              Comprehensive turnkey spatial architecture, custom trade show pavilions, and corporate interiors with ₹100 Crore+ annual operational capacity. Click any card to view detailed specifications.
            </p>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {turnkeyProjects.map((p) => (
                <div key={p.id} className="flex flex-col">
                  <ProjectCard 
                    title={p.title}
                    category={p.category}
                    location={p.location}
                    imageUrl={p.imageUrl}
                    href={`/projects/${p.id}`}
                  />
                  {p.scope && (
                    <div className="mt-2 px-1 text-xs text-neutral-500 font-body leading-relaxed">
                      {p.scope}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
