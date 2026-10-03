import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import { Breadcrumbs } from "@/components/ui/Interactions";
import { 
  getProjectById, 
  getAllProjectIds, 
  projectDetails 
} from "@/data/projectDetails";
import { getProjectBySlug } from "@/lib/cms-service";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Maximize2, 
  MapPin, 
  Building2, 
  Calendar, 
  Layers, 
  Cpu, 
  Award, 
  Cloud, 
  Wrench,
  Sparkles
} from "lucide-react";

function isVideo(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(url);
}

async function resolveProject(id: string) {
  const cmsProject = await getProjectBySlug(id);
  const staticProject = getProjectById(id);

  if (cmsProject) {
    return {
      id: cmsProject.slug || cmsProject.id,
      slug: cmsProject.slug,
      title: cmsProject.title,
      subtitle: cmsProject.subtitle,
      client: cmsProject.client,
      category: cmsProject.category,
      vertical: cmsProject.vertical,
      location: cmsProject.location || `${cmsProject.city}, ${cmsProject.state}`,
      city: cmsProject.city,
      state: cmsProject.state,
      completion: cmsProject.completion,
      scale: cmsProject.scale,
      heroImage: cmsProject.hero_image || staticProject?.heroImage || "",
      gallery: cmsProject.gallery && cmsProject.gallery.length > 0 ? cmsProject.gallery : staticProject?.gallery || [],
      description: cmsProject.description || staticProject?.description || "",
      challenge: cmsProject.challenge || staticProject?.challenge || "",
      solution: cmsProject.solution || staticProject?.solution || "",
      metrics: cmsProject.metrics && cmsProject.metrics.length > 0 ? cmsProject.metrics : staticProject?.metrics || [],
      specs: cmsProject.specs && cmsProject.specs.length > 0 ? cmsProject.specs : staticProject?.specs || [],
      highlights: cmsProject.highlights && cmsProject.highlights.length > 0 ? cmsProject.highlights : staticProject?.highlights || [],
      nextProjectId: cmsProject.next_project_id || staticProject?.nextProjectId,
    };
  }

  return staticProject;
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllProjectIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await resolveProject(id);

  if (!project) {
    return {
      title: "Project Details | ACE SELECT",
      description: "Landmark Active LED, Digital Signage & Commercial Construction Projects by ACE SELECT.",
    };
  }

  return {
    title: `${project.title} | ACE SELECT Landmark Projects`,
    description: `${project.subtitle}. Executed by ACE SELECT in ${project.location}. Active LED video walls, digital signage, and commercial design-to-build.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await resolveProject(id);

  if (!project) {
    notFound();
  }

  // Find next project
  const nextProject = project.nextProjectId 
    ? (await resolveProject(project.nextProjectId)) || projectDetails[0]
    : projectDetails[0];

  return (
    <article className="bg-white min-h-screen">
      {/* 1. Top Header & Navigation */}
      <section className="relative pt-36 pb-12 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex items-center justify-between mb-8">
              <Breadcrumbs 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Projects", href: "/projects" },
                  { label: project.title }
                ]}
              />
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-widest uppercase text-neutral-500 hover:text-solvorry-DEFAULT transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                BACK TO ALL PROJECTS
              </Link>
            </div>

            {/* Badges Ribbon */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-solvorry-DEFAULT/10 border border-solvorry-DEFAULT/25 text-solvorry-DEFAULT font-display font-bold text-[10px] tracking-widest uppercase">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-display font-semibold text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-solvorry-DEFAULT" />
                {project.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-display font-semibold text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-solvorry-DEFAULT" />
                5-YEAR OEM WARRANTY
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-display font-semibold text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                <Award className="w-3 h-3 text-solvorry-DEFAULT" />
                ISO 9001:2015 CERTIFIED
              </span>
            </div>

            {/* Editorial Headline & Subtitle */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-8">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.05] mb-6">
                  {project.title}
                </h1>
                <p className="font-body text-neutral-600 text-lg sm:text-xl leading-relaxed max-w-3xl">
                  {project.subtitle}
                </p>
              </div>

              {/* Quick Metadata Box */}
              <div className="lg:col-span-4 bg-[#F7F8FA] border border-neutral-200 p-6 sm:p-8 rounded-sm">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-solvorry-DEFAULT mb-6 pb-3 border-b border-neutral-200">
                  PROJECT SPECIFICATION
                </h4>
                <div className="space-y-4 text-xs font-body">
                  <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">Client</span>
                    <span className="font-bold text-neutral-900 text-right max-w-[60%]">{project.client}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">Location</span>
                    <span className="font-bold text-neutral-900 text-right">{project.location}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">Scale</span>
                    <span className="font-bold text-neutral-900 text-right">{project.scale}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">Status</span>
                    <span className="font-bold text-solvorry-DEFAULT text-right uppercase tracking-wider">{project.completion}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-neutral-500 font-medium">Cloud Infrastructure</span>
                    <span className="font-bold text-neutral-900 text-right">JIO SOFTWARE (256-bit)</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 2. Hero Photograph Showcase */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="w-full rounded-sm overflow-hidden shadow-xl border border-neutral-200 bg-neutral-900 group">
              {/* Pristine, 100% Unobscured High-Resolution Photograph */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                {isVideo(project.heroImage) ? (
                  <video
                    src={project.heroImage}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project.heroImage}
                    alt={`${project.title} — Real Installation by ACE SELECT`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                )}
              </div>

              {/* Dedicated Metadata & Caption Bar Beneath Image (Zero Image Obstruction) */}
              <div className="bg-[#0B0F2B] text-white px-6 py-4 border-t-2 border-solvorry-DEFAULT flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2.5 py-1 rounded bg-solvorry-DEFAULT/20 text-solvorry-light font-display font-bold text-[10px] tracking-widest uppercase shrink-0">
                    LANDMARK EXECUTION
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm sm:text-base text-white truncate">
                      {project.title}
                    </p>
                    <p className="text-[11px] text-white/60 font-body">
                      {project.location} • Real On-Ground Site Installation
                    </p>
                  </div>
                </div>

                <div className="text-xs text-white/80 font-body md:text-right shrink-0">
                  <span className="text-white/40 block text-[9.5px] uppercase tracking-wider font-display font-semibold">
                    Technical Leadership
                  </span>
                  <span>
                    Engineered &amp; deployed by ACE SELECT under Founder Mr. Kamal Gor&apos;s leadership
                  </span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 3. Impact Metrics Bar */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="bg-[#F7F8FA] border-y border-neutral-200 py-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="pt-4 md:pt-0 px-4 flex flex-col items-center justify-center">
                    <span className="font-display font-black text-3xl sm:text-4xl text-solvorry-DEFAULT tracking-tight mb-1">
                      {metric.value}
                    </span>
                    <span className="font-display font-bold text-[10px] tracking-widest uppercase text-neutral-500">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* 4. Detailed Narrative: Overview, Challenge & Solution */}
      <section className="py-24 bg-white border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Main Narrative */}
            <div className="lg:col-span-7">
              <SectionReveal>
                <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-3">
                  COMPREHENSIVE CASE STUDY
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-tight mb-8">
                  Engineering Precision for Extreme Indian Operating Conditions.
                </h2>
                <p className="font-body text-neutral-700 text-base sm:text-lg leading-relaxed mb-12">
                  {project.description}
                </p>

                {/* Challenge & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-200">
                  <div className="bg-[#F7F8FA] p-6 sm:p-8 rounded-sm border-l-4 border-neutral-400">
                    <div className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-neutral-900 mb-3">
                      <Wrench className="w-4 h-4 text-neutral-700" />
                      THE CHALLENGE
                    </div>
                    <p className="font-body text-neutral-600 text-sm leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="bg-[#F7F8FA] p-6 sm:p-8 rounded-sm border-l-4 border-solvorry-DEFAULT">
                    <div className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-solvorry-DEFAULT mb-3">
                      <CheckCircle2 className="w-4 h-4 text-solvorry-DEFAULT" />
                      ACE SELECT SOLUTION
                    </div>
                    <p className="font-body text-neutral-600 text-sm leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>
              </SectionReveal>

              {/* Key Highlights Checklist */}
              {project.highlights && project.highlights.length > 0 && (
                <SectionReveal delay={150} className="mt-12 pt-8 border-t border-neutral-200">
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-6 uppercase tracking-wider">
                    Key Execution Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-solvorry-DEFAULT shrink-0 mt-0.5" />
                        <span className="font-body text-xs sm:text-sm text-neutral-700 leading-snug">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </SectionReveal>
              )}
            </div>

            {/* Technical Specifications Sidebar */}
            <div className="lg:col-span-5">
              <SectionReveal delay={100} className="sticky top-28 bg-[#F7F8FA] border border-neutral-200 p-8 rounded-sm shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <Cpu className="w-5 h-5 text-solvorry-DEFAULT" />
                  <h3 className="font-display font-black text-xl text-neutral-900 tracking-tight">
                    Technical Specifications
                  </h3>
                </div>

                <div className="divide-y divide-neutral-200">
                  {project.specs && project.specs.map((spec, i) => (
                    <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-xs">
                      <span className="font-display font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
                        {spec.label}
                      </span>
                      <span className="font-body font-semibold text-neutral-900 sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Assurance Box */}
                <div className="mt-8 pt-6 border-t border-neutral-200 bg-white p-6 rounded-sm border border-neutral-200/80">
                  <div className="flex items-center gap-2 text-solvorry-DEFAULT font-display font-bold text-xs uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    MANUFACTURING GUARANTEE
                  </div>
                  <p className="text-xs text-neutral-600 font-body leading-relaxed mb-4">
                    Backed by 36/40 in-house engineers, rapid 48-hour on-ground replacement logistics, and nationwide coverage across 476+ Indian cities.
                  </p>
                  <Link
                    href="/contact"
                    className="w-full text-center block bg-solvorry-DEFAULT text-white py-3 px-4 font-display font-bold text-xs tracking-widest uppercase hover:bg-solvorry-dark transition-colors"
                  >
                    INQUIRE ABOUT THIS SOLUTION
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Photographic Installation Gallery */}
      {project.gallery && project.gallery.length > 1 && (
        <section className="py-24 bg-white border-b border-neutral-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="mb-12">
              <div className="text-[10px] font-display font-bold tracking-widest uppercase text-solvorry-DEFAULT mb-2">
                VERIFIED VISUAL DOCUMENTATION
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Project Gallery & On-Site Perspectives
              </h2>
            </SectionReveal>

            <SectionReveal delay={100}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((img, i) => {
                  const isVid = isVideo(img);
                  return (
                    <div 
                      key={i} 
                      className="group relative aspect-[4/3] bg-neutral-900 rounded-sm overflow-hidden border border-neutral-200 shadow-xs"
                    >
                      {isVid ? (
                        <video
                          src={img}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={img}
                          alt={`${project.title} — Detail view ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                        <span className="text-white text-xs font-display font-bold tracking-wider uppercase">
                          {project.title} • {isVid ? "Video" : "View"} {i + 1}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* 6. Next Project Banner */}
      {nextProject && (
        <section className="py-24 bg-[#0B0F2B] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <SectionReveal>
              <div className="inline-flex items-center gap-2 text-solvorry-light font-display font-bold text-xs tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                EXPLORE NEXT LANDMARK PROJECT
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6 max-w-4xl mx-auto hover:text-solvorry-light transition-colors">
                <Link href={`/projects/${nextProject.id}`}>
                  {nextProject.title}
                </Link>
              </h2>
              <p className="text-white/70 font-body text-sm sm:text-base max-w-xl mx-auto mb-10">
                {nextProject.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/projects/${nextProject.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-solvorry-DEFAULT text-white font-display font-bold text-xs tracking-widest uppercase hover:bg-solvorry-light transition-colors"
                >
                  VIEW NEXT PROJECT <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-display font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-[#0B0F2B] transition-colors"
                >
                  ALL PROJECTS DIRECTORY
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}
    </article>
  );
}
