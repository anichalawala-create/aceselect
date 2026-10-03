import SectionReveal from "@/components/SectionReveal";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal>
            <nav className="flex items-center gap-2 text-xs font-body text-neutral-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-neutral-500 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-neutral-500">Privacy Policy</span>
            </nav>
            <h1 className="font-display font-bold text-display-xl text-neutral-900 mb-6">Privacy Policy</h1>
            <p className="text-neutral-600 font-body text-sm">Last updated: {new Date().getFullYear()}</p>
          </SectionReveal>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-neutral max-w-none font-body space-y-8">
            <SectionReveal>
              <div className="bg-white shadow-sm border border-neutral-200 border border-neutral-200 rounded-2xl p-8 space-y-6 text-neutral-600 text-sm leading-relaxed">
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900 mb-3">Information We Collect</h2>
                  <p>Ace Select collects information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or request a quote. This includes your name, email address, phone number, and any messages you send.</p>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900 mb-3">How We Use Information</h2>
                  <p>We use the information we collect to respond to your inquiries, send you newsletters (if subscribed), and improve our services. We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900 mb-3">Data Security</h2>
                  <p>We implement appropriate security measures to protect your personal information. Our website is ISO 9001:2015 certified, reflecting our commitment to quality and security standards.</p>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-neutral-900 mb-3">Contact</h2>
                  <p>For questions about this privacy policy, contact us at <a href="mailto:info@aceselect.in" className="text-solvorry-light hover:text-white transition-colors">info@aceselect.in</a>.</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
