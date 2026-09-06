import { Link } from 'react-router-dom';
import type { EventsEditorialContent } from '@/lib/types';
import { useHomeData } from '@/lib/usePublicData';

export function EventsRenderer({ content }: { content: unknown }) {
  const data = content as EventsEditorialContent;
  const { events } = useHomeData();

  let displayEvents = events || [];
  if (data?.featured_only) displayEvents = displayEvents.filter((e) => e.featured);
  if (data?.upcoming_only) displayEvents = displayEvents.filter((e) => e.status === 'upcoming');
  displayEvents = displayEvents.slice(0, data?.limit || 3);

  if (displayEvents.length === 0) return null;

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-site">
        {data?.heading && <h2 className="section text-ivory mb-4">{data.heading}</h2>}
        {data?.description && <p className="text-body-lg text-stone mb-12 max-w-2xl">{data.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className="group block border border-white/[0.06] rounded-lg overflow-hidden">
              {event.cover_image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={event.cover_image} alt={event.cover_alt || event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <p className="text-caption text-gold mb-2">{event.category}</p>
                <h3 className="font-serif text-ivory text-lg mb-2">{event.title}</h3>
                {event.location && <p className="text-sm text-stone">{event.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
