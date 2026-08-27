import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import type { Service } from '@/lib/types';

export function ServiceSection({ services }: { services: Service[] }) {
  const published = services.filter((s) => s.published).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="py-24 md:py-32 bg-obsidian">
      <div className="container-lux">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-6">
            <div>
              <span className="label-gold mb-4 block">What We Create</span>
              <h2 className="font-serif text-section font-light text-ivory max-w-2xl">
                From idea to experience, under one roof.
              </h2>
            </div>
            <p className="text-ivory-muted max-w-md leading-relaxed">
              From intimate celebrations to large-scale productions, Fiesta brings creative direction, planning and execution together under one roof.
            </p>
          </div>
        </Reveal>

        <div className="space-y-0">
          {published.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, index, reverse }: { service: Service; index: number; reverse: boolean }) {
  const items = service.details?.items || [];

  return (
    <div className="group border-t border-charcoal-border last:border-b py-12 md:py-16">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
        {/* Text */}
        <div className="lg:col-span-5 lg:[direction:ltr]">
          <Reveal>
            <span className="font-serif text-5xl md:text-6xl font-light text-gold/40 block mb-4">
              0{index + 1}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-ivory mb-4 uppercase tracking-wide">
              {service.title}
            </h3>
            <p className="text-ivory-muted leading-relaxed mb-6">{service.description}</p>
            {items.length > 0 && (
              <ul className="space-y-2 mb-8">
                {items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-ivory/70">
                    <span className="block w-1 h-1 bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/services" className="btn-ghost">
              Explore Service <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        {/* Image */}
        <div className="lg:col-span-7 lg:[direction:ltr]">
          <Reveal>
            <div className="relative overflow-hidden aspect-[16/10]">
              <img
                src={service.image_url || ''}
                alt={service.image_alt || service.title}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-obsidian/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
