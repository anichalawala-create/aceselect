import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

export default function CustomizedGiftsPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Customized Gifts" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                CUSTOMIZED <span className="text-solvorry-DEFAULT">GIFTS</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                Personalized gifts that carry your brand story into the hands and hearts of your customers, creating a personal connection that lasts.
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
                    Customized/Personalized gifts are items that carry a person&apos;s name, initials, picture or monogram. They create a <strong className="font-semibold text-solvorry-dark">sense of belonging</strong> among loved ones and give a feeling that the gift is made exclusively for them.
                  </p>
                  <p>
                    Corporate gifting with a personal touch transforms a business transaction into a meaningful relationship. Your brand becomes associated with thoughtfulness, care, and quality — values that customers carry with them long after the gift is received.
                  </p>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={100}>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-solvorry-dark mb-6">Our Offerings</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {["Corporate Gift Sets", "Branded Merchandise", "Promotional Items", "Executive Gifts", "Event Memorabilia", "Custom Packaging"].map((item) => (
                      <div key={item} className="flex items-center gap-4 py-3 border-b border-neutral-200">
                        <span className="text-neutral-600 font-light text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal direction="left" delay={200}>
                <div className="pt-4">
                  <Button variant="primary" href="/contact">
                    REQUEST CATALOGUE
                  </Button>
                </div>
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal direction="right" delay={150}>
                <div className="flex flex-col gap-8">
                  {[
                    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
                    "https://images.unsplash.com/photo-1513201099705-a9746072f3a4?w=800&q=80",
                    "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
                  ].map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`Customized gifts showcase ${i + 1}`} 
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
