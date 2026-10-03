import SectionReveal from "@/components/SectionReveal";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { Button } from "@/components/ui/Button";

const images = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&q=80",
];

const benefits = [
  "Employees become genuine brand ambassadors",
  "Sharp, consistent brand image from the inside out",
  "Increased customer loyalty through aligned staff behavior",
  "Early employee integration in brand development",
  "Systematic planning across all business units",
  "Brand strategy lived by every team member",
];

export default function InternalBrandingPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <Breadcrumbs 
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Internal Branding" }
              ]}
              className="mb-8"
            />
            <div className="max-w-5xl">
              <Eyebrow className="mb-6">CAPABILITY</Eyebrow>
              <EditorialHeadline className="mb-8">
                INTERNAL <span className="text-solvorry-DEFAULT">BRANDING</span>
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl leading-relaxed max-w-3xl">
                A corporate strategy measure to enable and motivate employees to not only keep the brand promise but to &quot;live&quot; it — creating brand ambassadors from within.
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
                    Internal Branding is a corporate strategy measure to enable and motivate employees to not only keep the brand promise but to <strong className="font-semibold text-solvorry-dark">&quot;live&quot; it</strong> — involving employees in brand development, informing and inspiring them to feel enthusiastic about the brand, influencing their behavior to support it.
                  </p>
                  <p>
                    Internal branding matters because brands grow from the inside out and contribute to increased sales; the internal and external brand must align. A brand is successfully rooted in a company when all employees understand it and act accordingly — resulting in a <strong className="font-semibold text-solvorry-dark">sharpened brand image</strong>.
                  </p>
                  <p>
                    Brand strategy must be a priority for every staff member and lived by all employees. This requires systematic planning so employees are involved early — representatives from different business units integrated as early as possible. The sooner employees are integrated, the greater their understanding, acceptance, and willingness to &quot;live&quot; the brand.
                  </p>
                  <p>
                    The goal isn&apos;t to force job-specific behavior, but to guide employees toward brand-specific behavior — so customers experience employees who&apos;ve internalized the brand promise and act accordingly.
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
                  {images.map((img, i) => (
                    <div key={i} className={`overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[21/9]"}`}>
                      <img 
                        src={img} 
                        alt={`Internal branding showcase ${i + 1}`} 
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
