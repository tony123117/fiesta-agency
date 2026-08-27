import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import type { PortfolioProject } from '@/lib/types';

export function PortfolioGrid({ projects, limit }: { projects: PortfolioProject[]; limit?: number }) {
  const published = projects
    .filter((p) => p.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  const shown = limit ? published.slice(0, limit) : published;

  if (shown.length === 0) return null;

  // Asymmetrical layout pattern
  const spans = [
    'lg:col-span-8 aspect-[16/10]',
    'lg:col-span-4 aspect-[3/4] lg:aspect-[16/10]',
    'lg:col-span-4 aspect-[3/4]',
    'lg:col-span-8 aspect-[16/10]',
    'lg:col-span-12 aspect-[21/9]',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      {shown.map((project, i) => (
        <PortfolioCard key={project.id} project={project} className={spans[i % spans.length]} />
      ))}
    </div>
  );
}

function PortfolioCard({ project, className }: { project: PortfolioProject; className: string }) {
  return (
    <Reveal className={className}>
      <Link to={`/portfolio/${project.slug}`} className="group block relative w-full h-full overflow-hidden">
        <img
          src={project.cover_image || ''}
          alt={project.cover_alt || project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-lux group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <span className="label-gold mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            {project.category}{project.year ? ` • ${project.year}` : ''}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-light text-ivory">
            {project.title}
          </h3>
          <p className="text-sm text-ivory-muted mt-2 max-w-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            {project.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            View Project <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
