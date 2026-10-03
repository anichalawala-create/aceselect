import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

export default function ReBrandingPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Re-Branding" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                RE-<span className="text-solvorry-DEFAULT">BRANDING</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                Changing the corporate image of an organization — giving a new name, symbol, or design to create a differentiated identity that resonates.
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
                    Rebranding is the process of changing the corporate image of an organization — a market strategy of giving a new name, symbol, or design change to an already-established brand, creating a differentiated identity from competitors.
                  </p>
                  <p>
                    There are several reasons companies rebrand — chiefly to reconnect with customers — though it carries risk, as consumers may not embrace the new identity. Ace Select&apos;s expertise helps navigate this transition smoothly.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      type: "Proactive Rebranding",
                      desc: "Done when a company recognizes an opportunity to grow, innovate, tap into new business/customers, and reconnect with users.",
                      example: "Titan Industries rebranded in 2013, changing its logo and name to Titan Company — highlighting a commitment to 'create value, innovate, and maintain highest global standards.'",
                    },
                    {
                      type: "Reactive Rebranding",
                      desc: "Done when an existing brand must be discontinued or changed due to mergers & acquisitions, legal issues, negative publicity, or to beat competition.",
                      example: "Following the 2009 fraud revelation, Satyam Computer Services was sold to Tech Mahindra and rebranded as 'Mahindra Satyam.'",
                    },
                  ].map((item) => (
                    <div key={item.type} className="flex flex-col border-t border-neutral-300 pt-6">
                      <span className="text-xs font-display font-bold uppercase tracking-widest text-solvorry-dark mb-4">
                        {item.type}
                      </span>
                      <p className="text-neutral-600 text-sm font-light leading-relaxed mb-4">{item.desc}</p>
                      <p className="text-neutral-500 text-xs font-light italic leading-relaxed border-l-2 border-neutral-200 pl-4">{item.example}</p>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    START YOUR REBRAND
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {[
                    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
                  ].map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`Rebranding showcase ${i + 1}`} 
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
