import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

export default function SafetySolutionsPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Safety Solutions" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                SAFETY <span className="text-solvorry-DEFAULT">SOLUTIONS</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                End-to-end solutions for Electronic Security and Fire Fighting products — keeping your premises safe and compliant since 2011.
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
                    Safety Solutions is an end-to-end solution provider for a wide range of <strong className="font-semibold text-solvorry-dark">Electronic Security and Fire Fighting products</strong>. Present in the industry since 2011, we&apos;ve successfully kept pace with market trends, changing consumer needs, and the latest developments.
                  </p>
                  <p>
                    Safety is paramount — we deliver comprehensive security installations with precision, reliability, and full compliance with industry standards and regulations.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-solvorry-dark mb-6">Our Solutions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { title: "CCTV & Surveillance", desc: "High-definition cameras and monitoring systems for complete premises coverage." },
                      { title: "Access Control", desc: "Smart access management for secure, monitored entry and exit." },
                      { title: "Fire Fighting Systems", desc: "Comprehensive fire detection and suppression solutions." },
                      { title: "Alarm Systems", desc: "Intrusion detection and emergency alert systems." },
                    ].map((item) => (
                      <div key={item.title} className="flex flex-col border-t border-neutral-200 pt-4">
                        <h4 className="font-display font-bold text-sm text-solvorry-dark mb-2">{item.title}</h4>
                        <p className="text-neutral-600 text-sm font-light leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    REQUEST A SAFETY AUDIT
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {[
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
                    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
                  ].map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`Safety solutions showcase ${i + 1}`} 
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
