import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  Eye,
  Gauge,
  Grid2X2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LDA II Series | ACE SELECT",
  description:
    "Explore ACE SELECT's LDA II Series indoor LED display: fine pixel pitch, high refresh rate, simple maintenance, and dependable performance for commercial spaces.",
};

const highlights = [
  { label: "Pixel pitch", value: "P1.2 – P4.0", icon: Grid2X2 },
  { label: "Refresh rate", value: "3840 Hz", icon: Gauge },
  { label: "Brightness", value: "500 nits", icon: Zap },
  { label: "Maintenance", value: "Front access", icon: Wrench },
];

const featureCards = [
  {
    title: "Worry-free stability",
    description:
      "Designed for long operating cycles, the LDA II Series delivers consistent color and dependable playback for retail, corporate, and institutional environments.",
    icon: ShieldCheck,
  },
  {
    title: "Simple installation",
    description:
      "A lightweight 60 mm cabinet, precision alignment, and tool-free module access help installation teams move from frame to finished wall with less downtime.",
    icon: Wrench,
  },
  {
    title: "Vivid visual experience",
    description:
      "A 3840 Hz refresh rate, high grayscale performance, and a wide viewing angle keep motion smooth and content clear across the room.",
    icon: Eye,
  },
  {
    title: "Cooler by design",
    description:
      "A hollowed cabinet structure and textured heat-dissipation ribs help manage operating temperature during continuous commercial use.",
    icon: Thermometer,
  },
];

const visualFeatures = [
  {
    number: "01",
    eyebrow: "INSTALLATION & SERVICE",
    title: "Built for quick access and easy maintenance.",
    description:
      "The LDA II cabinet keeps service practical. Front maintenance access, a compact 60 mm profile, and tool-free module handling make routine checks easier for on-site teams.",
    points: ["7.8 kg cabinet weight", "Front maintenance access", "Tool-free module assembly"],
    image: "/images/products/indoor-smd-page2.jpg",
    alt: "ACE SELECT indoor LED display cabinet detail",
  },
  {
    number: "02",
    eyebrow: "ALIGNMENT & PROTECTION",
    title: "A seamless wall that stays precise.",
    description:
      "Precision locating pins and XYZ axis adjustment support a smooth, scan-line-free canvas. Anti-collision protection helps safeguard the module, PCB, and lamp face during delivery and splicing.",
    points: ["Flatness up to ≤0.2 mm", "High-precision locating pins", "Anti-collision cabinet design"],
    image: "/images/products/indoor-smd-page3.jpg",
    alt: "ACE SELECT close-up of indoor LED module alignment",
  },
];

const parameters = [
  ["Product family", "LDA II Series"],
  ["Available pixel pitch", "P1.2 / P1.5 / P1.8 / P2.0 / P2.5 / P3.0 / P4.0"],
  ["Representative model", "LDA II 1.25"],
  ["Cabinet resolution", "512 × 384 pixels"],
  ["Cabinet size (W × H × D)", "640 × 480 × 60 mm"],
  ["Module resolution", "256 × 128 pixels"],
  ["Brightness", "500 nits"],
  ["Contrast ratio", "3000:1"],
  ["Refresh rate", "3840 Hz"],
  ["Viewing angle (H / V)", "160° / 140°"],
];

const cases = [
  {
    title: "BKC corporate lobby",
    category: "Corporate environment",
    location: "Mumbai, Maharashtra",
    image: "/images/projects/proj-bkc-elobby.jpg",
    alt: "Digital display installation in a corporate lobby",
  },
  {
    title: "Premium retail frontage",
    category: "Retail experience",
    location: "Mumbai, Maharashtra",
    image: "/images/projects/proj-caratlane-palladium.jpg",
    alt: "ACE SELECT retail display installation",
  },
  {
    title: "High-impact destination display",
    category: "Public & institutional",
    location: "Pan-India delivery",
    image: "/images/projects/proj-kashi-vishwanath.jpg",
    alt: "Large-format LED display project by ACE SELECT",
  },
];

export default function ProductsPage() {
  return (
    <div className="bg-white text-neutral-900">
      <main>
        <section className="relative overflow-hidden bg-[#0B0F2B] text-white pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
          <div className="pointer-events-none absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-solvorry-DEFAULT/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              <Link href="/#products" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Products
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
              <span className="text-solvorry-light">LDA II Series</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              <div className="max-w-3xl">
                <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-solvorry-light">
                  <span className="h-px w-8 bg-solvorry-light" />
                  ACE SELECT / ACTIVE INDOOR LED
                </p>
                <h1 className="font-display text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                  LDA II
                  <span className="block text-white/45">Series</span>
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  Indoor LED display engineered for confident commercial storytelling — from high-traffic retail spaces to polished corporate environments.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-solvorry-DEFAULT px-6 py-3.5 text-sm font-bold transition-colors hover:bg-solvorry-light"
                  >
                    Request a specification
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href="#parameter"
                    className="inline-flex items-center justify-center gap-2 border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    View parameters
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-4">
                  {highlights.map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <Icon className="mb-3 h-4 w-4 text-solvorry-light" aria-hidden="true" />
                      <p className="font-display text-lg font-bold text-white">{value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -inset-4 border border-white/10 sm:-inset-6" />
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <Image
                    src="/images/products/indoor-smd-page1.jpg"
                    alt="ACE SELECT LDA II Series indoor LED display"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F2B]/65 via-transparent to-white/10" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 border-t border-white/25 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Indoor active LED</p>
                    <p className="text-xs font-semibold text-white/55">ACE / LDA II</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 text-[#0B0F2B] shadow-xl sm:-left-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Designed for</p>
                  <p className="mt-1 text-sm font-bold">Clarity at every angle</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav aria-label="Product sections" className="sticky top-[68px] z-30 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur-md sm:top-[80px]">
          <div className="mx-auto flex max-w-[1600px] overflow-x-auto px-4 sm:px-6 lg:px-8">
            {[{ label: "Features", href: "#features" }, { label: "Parameter", href: "#parameter" }, { label: "Case", href: "#case" }].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="whitespace-nowrap border-b-2 border-transparent px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 transition-colors first:border-solvorry-DEFAULT first:text-solvorry-DEFAULT hover:border-solvorry-light hover:text-solvorry-DEFAULT sm:px-8"
              >
                {tab.label}
              </a>
            ))}
            <Link href="/contact" className="ml-auto hidden items-center gap-2 whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-solvorry-DEFAULT transition-colors hover:text-solvorry-dark sm:flex">
              Talk to our team <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>

        <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 bg-[#F7F8FA] py-20 sm:py-28">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.23em] text-solvorry-DEFAULT">
                <span className="h-px w-8 bg-solvorry-DEFAULT" />
                Product features
              </p>
              <h2 id="features-heading" className="font-display text-4xl font-black tracking-[-0.03em] text-neutral-950 sm:text-6xl">
                Confidence built into every cabinet.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                From the first pixel to long-term service, LDA II brings the practical details together for a display that looks exceptional and works hard.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <article key={title} className="bg-white p-7 sm:p-8">
                  <Icon className="h-6 w-6 text-solvorry-DEFAULT" aria-hidden="true" />
                  <h3 className="mt-7 font-display text-lg font-bold text-neutral-950">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
                </article>
              ))}
            </div>

            <div className="mt-24 space-y-20 sm:mt-32 sm:space-y-28">
              {visualFeatures.map((feature, index) => (
                <article key={feature.number} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                  <div className={`relative overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="absolute -inset-3 border border-solvorry-DEFAULT/15" />
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                      <Image src={feature.image} alt={feature.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <span className="absolute left-4 top-4 bg-[#0B0F2B] px-3 py-2 font-mono text-xs font-bold text-white">{feature.number} / 02</span>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-solvorry-DEFAULT">{feature.eyebrow}</p>
                    <h3 className="mt-5 max-w-xl font-display text-3xl font-black tracking-[-0.03em] text-neutral-950 sm:text-5xl">{feature.title}</h3>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{feature.description}</p>
                    <ul className="mt-8 space-y-3 border-t border-neutral-200 pt-6">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-solvorry-DEFAULT/10 text-solvorry-DEFAULT"><Check className="h-3 w-3" aria-hidden="true" /></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="parameter" aria-labelledby="parameter-heading" className="scroll-mt-20 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.23em] text-solvorry-DEFAULT">
                  <span className="h-px w-8 bg-solvorry-DEFAULT" />
                  Technical data
                </p>
                <h2 id="parameter-heading" className="font-display text-4xl font-black tracking-[-0.03em] text-neutral-950 sm:text-6xl">Parameter</h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
                  A practical starting point for planning your next indoor LED display. Final specifications are confirmed against the selected pixel pitch and site requirements.
                </p>
                <div className="mt-10 border-l-2 border-solvorry-DEFAULT pl-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Specification guide</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">Need a custom cabinet, curved wall, or multi-location rollout? Our team can build the right configuration around your space.</p>
                </div>
                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-solvorry-DEFAULT transition-colors hover:text-solvorry-dark">
                  Talk to an ACE SELECT specialist <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="overflow-x-auto border border-neutral-200">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <caption className="sr-only">LDA II Series technical parameters</caption>
                  <thead className="bg-[#0B0F2B] text-white">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] sm:px-7">Parameter</th>
                      <th scope="col" className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] sm:px-7">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map(([label, value], index) => (
                      <tr key={label} className={index % 2 === 0 ? "bg-[#F7F8FA]" : "bg-white"}>
                        <th scope="row" className="border-t border-neutral-200 px-5 py-4 text-sm font-semibold text-neutral-700 sm:px-7">{label}</th>
                        <td className="border-t border-neutral-200 px-5 py-4 text-sm text-neutral-600 sm:px-7">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="case" aria-labelledby="case-heading" className="scroll-mt-20 border-y border-neutral-200 bg-[#F7F8FA] py-20 sm:py-28">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.23em] text-solvorry-DEFAULT">
                  <span className="h-px w-8 bg-solvorry-DEFAULT" />
                  In the field
                </p>
                <h2 id="case-heading" className="font-display text-4xl font-black tracking-[-0.03em] text-neutral-950 sm:text-6xl">Case</h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-solvorry-DEFAULT transition-colors hover:text-solvorry-dark">
                Explore all projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {cases.map((item) => (
                <Link key={item.title} href="/projects" className="group block bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                    <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F2B]/65 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-[0.16em] text-white">{item.category}</span>
                  </div>
                  <div className="flex items-start justify-between gap-5 p-6">
                    <div>
                      <h3 className="font-display text-xl font-bold text-neutral-950 transition-colors group-hover:text-solvorry-DEFAULT">{item.title}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500"><MapPin className="h-3.5 w-3.5 text-solvorry-DEFAULT" aria-hidden="true" />{item.location}</p>
                    </div>
                    <ArrowUpRightIcon />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="relative overflow-hidden bg-[#0B0F2B] py-20 text-white sm:py-28">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-solvorry-DEFAULT/20 to-transparent" />
          <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.23em] text-solvorry-light">
                <span className="h-px w-8 bg-solvorry-light" />
                Start a conversation
              </p>
              <h2 id="contact-heading" className="font-display text-4xl font-black tracking-[-0.03em] sm:text-6xl">Have a display in mind?</h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">Share your space, audience, and content goals. ACE SELECT will help you shape the right LDA II configuration and rollout plan.</p>
              <Link href="/contact" className="mt-9 inline-flex items-center gap-2 bg-solvorry-DEFAULT px-6 py-3.5 text-sm font-bold transition-colors hover:bg-solvorry-light">
                Send a project message <MessageSquare className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 text-sm text-white/75 sm:grid-cols-3 lg:grid-cols-1 lg:min-w-[250px]">
              <a href="tel:+912225182233" className="flex items-center gap-3 transition-colors hover:text-white"><Phone className="h-4 w-4 text-solvorry-light" aria-hidden="true" /> (+91) 22 25182233</a>
              <a href="mailto:info@aceselect.in" className="flex items-center gap-3 transition-colors hover:text-white"><Mail className="h-4 w-4 text-solvorry-light" aria-hidden="true" /> info@aceselect.in</a>
              <span className="flex items-start gap-3"><Download className="mt-0.5 h-4 w-4 text-solvorry-light" aria-hidden="true" /> Specification pack available on request</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-300 transition-all group-hover:translate-x-1 group-hover:text-solvorry-DEFAULT" aria-hidden="true" />;
}
