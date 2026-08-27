import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { EventItem } from '@/lib/types';
import { EVENT_CATEGORIES } from '@/lib/types';

export function Events() {
  useDocumentMeta({
    title: 'Events — Fiesta Agency',
    description: 'Explore celebrations, productions and experiences brought to life by Fiesta.',
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('events').select('*').eq('published', true).order('sort_order');
      setEvents((data || []) as EventItem[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter((e) => {
      const cat = e.category.toLowerCase();
      const f = filter.toLowerCase();
      return cat === f || cat.includes(f.slice(0, -1)); // handle plural
    });
  }, [events, filter]);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">Experiences in Motion</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              Experiences in Motion
            </h1>
            <p className="mt-8 text-lg text-ivory-muted max-w-2xl leading-relaxed">
              Explore celebrations, productions and experiences brought to life by Fiesta.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-obsidian">
        <div className="container-lux">
          {/* Filters */}
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-16 border-b border-charcoal-border pb-6">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                    filter === cat ? 'text-gold border-b border-gold' : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-96 skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <Reveal>
              <div className="text-center py-20">
                <p className="font-serif text-2xl italic text-ivory-muted">No events published yet.</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {filtered.map((event, i) => (
                <Reveal key={event.id} delay={(i % 2) * 100}>
                  <Link to={`/events/${event.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/3] mb-6">
                      <img
                        src={event.cover_image || ''}
                        alt={event.cover_alt || event.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-lux group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                    </div>
                    <div className="label-ivory mb-2">
                      {event.category}{event.location && ` • ${event.location}`}{event.event_date && ` • ${new Date(event.event_date).getFullYear()}`}
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-light text-ivory group-hover:text-gold transition-colors duration-300">
                      {event.title}
                    </h2>
                    <p className="text-ivory-muted mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                    <span className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-[0.2em] text-gold">
                      View Event <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
