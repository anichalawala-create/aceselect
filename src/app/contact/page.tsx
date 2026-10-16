import SectionReveal from "@/components/SectionReveal";
import ContactForm from "@/components/ContactForm";
import { EditorialHeadline, Eyebrow } from "@/components/ui/Typography";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getPageContent, getPageContentValue } from "@/lib/cms-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const pageContent = await getPageContent("contact");
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <div className="max-w-4xl">
              <Eyebrow className="mb-6">{getPageContentValue(pageContent, "hero.eyebrow", "CONTACT US")}</Eyebrow>
              <EditorialHeadline className="mb-6">
                {getPageContentValue(pageContent, "hero.headline", "START A\nCONVERSATION").split("\n").map((line, index, lines) => <span key={`${line}-${index}`} className={index === lines.length - 1 ? "text-solvorry-DEFAULT" : ""}>{index > 0 && <br />}{line}</span>)}
              </EditorialHeadline>
              <p className="text-neutral-600 font-light text-xl md:text-2xl max-w-2xl leading-relaxed">
                {getPageContentValue(pageContent, "hero.intro", "Ready to elevate your brand? Reach out and let's discuss your vision and spatial requirements.")}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Contact content */}
      <section className="pb-32 pt-10 bg-white" aria-labelledby="contact-heading">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Info column */}
            <div className="lg:col-span-5 space-y-16">
              <SectionReveal direction="left">
                <div className="space-y-8">
                  {[
                    {
                      icon: <Phone className="w-5 h-5" />,
                      label: "Phone",
                      value: "(+91) 22 25182233",
                      href: "tel:+912225182233",
                    },
                    {
                      icon: <Mail className="w-5 h-5" />,
                      label: "Email",
                      value: "info@aceselect.in",
                      href: "mailto:info@aceselect.in",
                    },
                    {
                      icon: <MapPin className="w-5 h-5" />,
                      label: "Address",
                      value: "C 1601/02/03 Kailas Business Park, Vikhroli (West), Mumbai – 400079",
                      href: "https://maps.google.com/?q=Kailas+Business+Park,+Vikhroli+West,+Mumbai",
                    },
                    {
                      icon: <Clock className="w-5 h-5" />,
                      label: "Business Hours",
                      value: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-6 group">
                      <div className="w-12 h-12 flex items-center justify-center text-solvorry-DEFAULT border border-neutral-200 group-hover:border-solvorry-DEFAULT transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-display font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-solvorry-dark font-body text-lg hover:text-solvorry-DEFAULT transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-solvorry-dark font-body text-lg">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              {/* Google Map embed */}
              <SectionReveal direction="left" delay={150}>
                <div className="overflow-hidden border border-neutral-200 h-80 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5!2d72.9260!3d19.1027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8e8b0000001%3A0x1!2sKailas+Business+Park%2C+Vikhroli+West%2C+Mumbai!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ace Select office location — Kailas Business Park, Vikhroli West, Mumbai"
                    aria-label="Google Maps showing Ace Select office location"
                  />
                </div>
              </SectionReveal>
            </div>

            {/* Form column */}
            <div className="lg:col-span-7">
              <SectionReveal direction="right" delay={100}>
                <div className="bg-white">
                  <ContactForm />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
