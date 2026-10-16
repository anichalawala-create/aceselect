import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { CapabilityCard } from "@/components/ui/Cards";
import { getPageContent, getPageContentValue, getPageContentMedia } from "@/lib/cms-service";

const industries = [
  {
    title: "Banking & Finance",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    href: "#banking"
  },
  {
    title: "Retail & Fashion",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
    href: "#retail"
  },
  {
    title: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80",
    href: "#automotive"
  },
  {
    title: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    href: "#realestate"
  },
  {
    title: "Beauty & Cosmetics",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    href: "#beauty"
  },
  {
    title: "Food & Beverage",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80",
    href: "#fb"
  }
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function IndustriesPage() {
  const pageContent = await getPageContent("industries");
  const headline = getPageContentValue(pageContent, "hero.headline", "EXPERTISE ACROSS\nINDUSTRIES");
  const headlineLines = headline.split("\n");
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 bg-white overflow-hidden border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Industries" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">{getPageContentValue(pageContent, "hero.eyebrow", "SECTORS WE SERVE")}</Eyebrow>
              <EditorialHeadline className="mb-8">
                {headlineLines.map((line, index) => <span key={`${line}-${index}`} className={index > 0 ? "text-solvorry-DEFAULT" : ""}>{index > 0 && <br />}{line}</span>)}
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                {getPageContentValue(pageContent, "hero.intro", "We bring specialized knowledge and architectural precision to diverse sectors, creating impactful environments for leading global brands.")}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind, index) => (
                <CapabilityCard 
                  key={index}
                  title={ind.title}
                  imageUrl={getPageContentMedia(pageContent, `industry.${index + 1}.image`, ind.imageUrl)}
                  href={ind.href}
                />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
      
      {/* Industry Approach */}
      <section className="py-32 bg-navy text-white border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <Eyebrow className="mb-6 text-white/50">OUR APPROACH</Eyebrow>
            <EditorialHeadline className="mb-12 text-white">
              STRATEGIC INDUSTRY <span className="text-solvorry-DEFAULT">ALIGNMENT</span>
            </EditorialHeadline>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            <SectionReveal delay={100} className="border-t border-white/20 pt-8">
              <h3 className="font-display font-bold text-2xl mb-4">Deep Context</h3>
              <p className="text-white/70 font-light leading-relaxed">
                We immerse ourselves in the specific operational, regulatory, and aesthetic requirements of each industry, ensuring our solutions are functionally rigorous and brand-aligned.
              </p>
            </SectionReveal>
            
            <SectionReveal delay={200} className="border-t border-white/20 pt-8">
              <h3 className="font-display font-bold text-2xl mb-4">Scalable Execution</h3>
              <p className="text-white/70 font-light leading-relaxed">
                From a single flagship location to a nationwide rollout across hundreds of touchpoints, our architectural systems are designed for flawless scaling within any sector.
              </p>
            </SectionReveal>
            
            <SectionReveal delay={300} className="border-t border-white/20 pt-8">
              <h3 className="font-display font-bold text-2xl mb-4">Premium Consistency</h3>
              <p className="text-white/70 font-light leading-relaxed">
                Regardless of the industry context, we maintain an unwavering commitment to premium material choices, precise detailing, and architectural restraint.
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
