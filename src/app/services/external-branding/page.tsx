import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

const serviceImages = [
  "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
];

const benefits = [
  "Brand identity that fits seamlessly into your corporate architecture",
  "Clear positioning that differentiates from competition",
  "Messaging clarity and alignment across all touchpoints",
  "Maximized revenue through well-articulated brand strategy",
  "Continuous deposit of brand equity into the 'brand bank'",
  "Expert recce and implementation across pan-India locations",
];

export default function ExternalBrandingPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "External Branding" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                EXTERNAL <span className="text-solvorry-DEFAULT">BRANDING</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                The sum of all marketing activities created to influence the mind-set and purchase behavior of customers and prospective customers for your company&apos;s product or service.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="pb-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            <div className="lg:col-span-6 space-y-12">
              <SectionReveal direction="left">
                <div className="space-y-6 text-neutral-600 font-light text-lg leading-relaxed">
                  <p>
                    External branding is the sum of all marketing activities created to influence the mind-set and purchase behavior of customers and prospective customers for a company&apos;s product or service. <strong className="font-semibold text-solvorry-dark">Well-articulated branding</strong> provides identity and architecture for the overall company and product brands, an easily identified brand personality, and clear positioning that differentiates from competition — maximizing revenue.
                  </p>
                  <p>
                    Many companies have a point of view on branding — some well-executed, some incomplete, or in need of updating. Branding is a <strong className="font-semibold text-solvorry-dark">long-term proposition</strong> — you should be continuously depositing brand equity into the &quot;brand bank.&quot;
                  </p>
                  <p>
                    A key component of branding is messaging clarity and alignment — are customers receiving clear, correct messages in advertising and promotion? Branding and sub-branding is complex — Ace Select helps ensure your products/services carry a brand identity that fits seamlessly into your corporate brand identity.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-solvorry-dark mb-6">Key Benefits</h3>
                  <ul className="space-y-4">
                    {benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-none bg-solvorry-DEFAULT mt-2 shrink-0" />
                        <span className="text-neutral-600 font-light leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    REQUEST A QUOTE
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {serviceImages.map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`External branding showcase ${i + 1}`} 
                        className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700" 
                        loading="lazy" 
                      />
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
