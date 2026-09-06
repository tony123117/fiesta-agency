import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { EventItem } from '@/lib/types';

export function UpcomingEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .eq('published', true)
        .order('event_date', { ascending: true })
        .limit(4);
      if (!active) return;
      setEvents((data || []) as EventItem[]);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-1.5">
            UPCOMING EVENTS
          </p>
          <h2 className="font-serif font-light text-ivory tracking-tight text-lg">
            What&apos;s coming up
          </h2>
        </div>
        <Link
          to="/admin/events"
          className="group inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold/60 hover:text-gold transition-colors"
        >
          View All
          <ArrowRight size={11} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 border border-white/[0.04]">
              <div className="w-16 h-16 bg-white/[0.04] rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-20 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3 w-32 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center border border-white/[0.04]">
          <p className="text-[0.8rem] text-white/30 mb-1">Nothing on the calendar yet.</p>
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-1.5 mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold/60 hover:text-gold transition-colors"
          >
            <Plus size={12} strokeWidth={1.5} /> Add Event
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {events.map((event, i) => {
            const date = event.event_date ? new Date(event.event_date) : null;
            const day = date ? date.getDate() : '--';
            const month = date ? date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() : '';

            return (
              <Link
                key={event.id}
                to={`/admin/events/${event.id}/edit`}
                className={`group flex items-center gap-4 p-3 transition-colors duration-200 hover:bg-white/[0.015] ${
                  i < events.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                {/* Date block */}
                <div className="w-14 h-14 flex flex-col items-center justify-center border border-white/[0.06] shrink-0 group-hover:border-gold/20 transition-colors duration-200">
                  <span className="font-serif font-light text-ivory text-lg leading-none">{day}</span>
                  <span className="text-[0.5rem] font-semibold tracking-[0.15em] text-white/30 mt-0.5">{month}</span>
                </div>

                {/* Event image if available */}
                {event.cover_image && (
                  <div className="hidden sm:block w-10 h-10 overflow-hidden rounded shrink-0">
                    <img
                      src={event.cover_image}
                      alt={event.cover_alt || event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-[0.85rem] text-ivory truncate group-hover:text-gold transition-colors duration-200">
                    {event.title}
                  </p>
                  <p className="text-[0.7rem] text-white/25 truncate">
                    {event.location || 'Venue TBA'}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 hidden sm:block">
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-green-400/70">
                    UPCOMING
                  </span>
                </div>

                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="shrink-0 text-white/10 group-hover:text-gold/50 transition-all duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
