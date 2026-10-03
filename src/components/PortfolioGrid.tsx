"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  client: string;
  category: string;
  imageUrl: string;
  href?: string;
  tags?: string[];
}

interface PortfolioCardProps {
  project: Project;
}

function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-navy-mid hover:-translate-y-2 hover:shadow-glow transition-all duration-300 cursor-pointer">
      {/* Image */}
      <Image
        src={project.imageUrl}
        alt={`${project.client} — ${project.category} project by Ace Select`}
        fill
        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
      />

      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full bg-brand/80 text-white text-sm font-display font-semibold tracking-wide backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-400 z-10">
        <div
          className="translate-y-4 group-hover:translate-y-0 transition-transform duration-400"
        >
          <p className="text-neutral-300 text-sm font-body mb-1 uppercase tracking-widest">
            {project.category}
          </p>
          <h3 className="font-display font-bold text-xl text-white mb-3">
            {project.client}
          </h3>
          {project.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 text-sm font-body"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {project.href && (
            <Link
              href={project.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-navy font-display font-semibold text-sm rounded-xl hover:bg-neutral-100 transition-colors group/btn"
            >
              View Project
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/60 to-transparent pointer-events-none" />
    </div>
  );
}

interface PortfolioGridProps {
  projects: Project[];
  columns?: 2 | 3 | 4;
}

export default function PortfolioGrid({ projects, columns = 3 }: PortfolioGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${colClass} gap-6`}>
      {projects.map((project) => (
        <PortfolioCard key={project.id} project={project} />
      ))}
    </div>
  );
}
