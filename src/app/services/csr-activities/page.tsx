import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

export default function CSRActivitiesPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "CSR Activities" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                CSR <span className="text-solvorry-DEFAULT">ACTIVITIES</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                Building positive brand reputation through meaningful corporate social responsibility initiatives that give back to communities and the environment.
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
                    Corporate Social Responsibility (CSR) is a continuing commitment by businesses to integrate <strong className="font-semibold text-solvorry-dark">social and environmental concerns</strong> into their business operations. India became the first country to legislate CSR activities under the Companies Act 2013.
                  </p>
                  <p>
                    Companies invest in CSR to manage risk, recruit employees, bolster their brand in the eyes of investors and consumers, ease their supply chains, and save money — while giving back to the community and providing positive social value.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-solvorry-dark mb-6">Key Focus Areas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {["Environmental Responsibility", "Human Rights Responsibility", "Philanthropic Responsibility", "Economic Responsibility"].map((item) => (
                      <div key={item} className="flex items-center gap-4 py-3 border-b border-neutral-200">
                        <div className="w-1.5 h-1.5 rounded-none bg-solvorry-DEFAULT shrink-0" />
                        <span className="text-neutral-600 font-light text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    PLAN AN INITIATIVE
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {[
                    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
                  ].map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`CSR activity showcase ${i + 1}`} 
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
