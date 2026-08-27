import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import type { EventItem } from '@/lib/types';

export function FeaturedEvents({ events }: { events: EventItem[] }) {
  const featured = events
    .filter((e) => e.published && e.featured)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-charcoal">
      <div className="container-lux">
        <Reveal>
          <div className="mb-16 md:mb-24">
            <span className="label-gold mb-4 block">Experiences in Motion</span>
            <h2 className="font-serif text-section font-light text-ivory max-w-3xl">
              Events we've created.
            </h2>
          </div>
        </Reveal>

        <div className="space-y-24 md:space-y-32">
          {featured.map((event, i) => (
            <FeaturedEventCard key={event.id} event={event} index={i} reverse={i % 2 === 1} />
          ))}
        </div>

        <Reveal>
          <div className="mt-20 text-center">
            <Link to="/events" className="btn-outline">
              View All Events <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedEventCard({ event, index, reverse }: { event: EventItem; index: number; reverse: boolean }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
      {/* Image */}
      <div className="lg:col-span-8 lg:[direction:ltr]">
        <Reveal>
          <Link to={`/events/${event.slug}`} className="group block relative overflow-hidden">
            <div className="aspect-[16/10] md:aspect-[16/9] overflow-hidden">
              <img
                src={event.cover_image || ''}
                alt={event.cover_alt || event.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-lux group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
          </Link>
        </Reveal>
      </div>

      {/* Text */}
      <div className="lg:col-span-4 lg:[direction:ltr]">
        <Reveal>
          <span className="font-serif text-6xl font-light text-gold/30 block mb-4">
            0{index + 1}
          </span>
          <div className="label-ivory mb-4">
            {event.category}
            {event.location && ` • ${event.location}`}
            {event.event_date && ` • ${new Date(event.event_date).getFullYear()}`}
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-light text-ivory mb-4">
            {event.title}
          </h3>
          <p className="text-ivory-muted leading-relaxed mb-6 line-clamp-3">
            {event.description}
          </p>
          <Link to={`/events/${event.slug}`} className="btn-ghost">
            View Event <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
