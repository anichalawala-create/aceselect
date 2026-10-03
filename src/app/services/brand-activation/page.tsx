import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

export default function BrandActivationPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Brand Activation" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                BRAND <span className="text-solvorry-DEFAULT">ACTIVATION</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                Driving consumer actions through interaction and immersive experiences — creating genuine relationships between brand and consumer.
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
                    In a nutshell, brand activation is the process of driving consumer actions through interaction and experiences centered on the brand — a newer approach to marketing achieved through experiential marketing and other activation concepts. It&apos;s a highly effective paradigm, especially with younger millennials and Gen Z.
                  </p>
                  <p>
                    Any campaign, experience, or event enabling direct brand-consumer interaction with the intent of building brand loyalty and community is considered brand activation. BTL marketing activities for brand activation have grown in popularity amid changing attitudes toward traditional marketing and the rise of experiential technology.
                  </p>
                  <p>
                    As people grow distrustful of traditional advertising, brand activation focuses on creating a <strong className="font-semibold text-solvorry-dark">genuine relationship</strong> between brand and consumer — usually via experiential technology creating immersive brand experiences.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-solvorry-dark mb-6">Activation Types</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {["Events & Roadshows", "Experiential Campaigns", "BTL Marketing Activities", "Immersive Brand Experiences", "Consumer Engagement Programs"].map((item) => (
                      <div key={item} className="flex items-center gap-4 py-3 border-b border-neutral-200">
                        <div className="w-1.5 h-1.5 rounded-none bg-solvorry-DEFAULT shrink-0" />
                        <span className="text-neutral-600 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    PLAN AN ACTIVATION
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {[
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
                  ].map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`Brand activation showcase ${i + 1}`} 
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
