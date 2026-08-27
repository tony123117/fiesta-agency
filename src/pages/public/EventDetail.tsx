import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CTASection } from '@/components/public/CTASection';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { EventItem } from '@/lib/types';

export function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [related, setRelated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: event ? `${event.title} — Fiesta Agency` : 'Event — Fiesta Agency',
    description: event?.description || undefined,
    ogImage: event?.cover_image || undefined,
  });

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!active) return;

      if (!data) {
        navigate('/events', { replace: true });
        return;
      }

      const ev = data as EventItem;
      setEvent(ev);

      const { data: relData } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .neq('id', ev.id)
        .order('sort_order')
        .limit(3);

      if (active) {
        setRelated((relData || []) as EventItem[]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug, navigate]);

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-obsidian pt-20">
        <div className="container-lux py-20">
          <div className="h-[60vh] skeleton" />
        </div>
      </div>
    );
  }

  const gallery = Array.isArray(event.gallery) ? event.gallery : [];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={event.cover_image || ''} alt={event.cover_alt || event.title} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/20" />
        </div>
        <div className="relative container-lux pb-16 md:pb-20">
          <Reveal>
            <Link to="/events" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-muted hover:text-gold transition-colors mb-6">
              <ArrowLeft size={14} /> All Events
            </Link>
            <div className="label-gold mb-4">
              {event.category}{event.location && ` • ${event.location}`}{event.event_date && ` • ${new Date(event.event_date).getFullYear()}`}
            </div>
            <h1 className="font-serif text-display md:text-6xl font-light text-ivory max-w-3xl text-balance">
              {event.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 md:py-28 bg-obsidian">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="space-y-6 text-ivory-muted leading-relaxed text-lg">
                {event.description?.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal>
              <div className="border border-charcoal-border p-8 space-y-6">
                <div>
                  <span className="label-ivory block mb-2">Date</span>
                  <p className="text-ivory flex items-center gap-2">
                    <Calendar size={16} className="text-gold" />
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
                  </p>
                </div>
                <div>
                  <span className="label-ivory block mb-2">Location</span>
                  <p className="text-ivory flex items-center gap-2">
                    <MapPin size={16} className="text-gold" />
                    {event.location || 'TBD'}
                  </p>
                </div>
                <div>
                  <span className="label-ivory block mb-2">Category</span>
                  <p className="text-ivory">{event.category}</p>
                </div>
                <div>
                  <span className="label-ivory block mb-2">Status</span>
                  <p className="text-gold capitalize">{event.status}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="pb-20 md:pb-28 bg-obsidian">
          <div className="container-lux">
            <Reveal>
              <span className="label-gold mb-8 block">Gallery</span>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {gallery.map((img, i) => (
                <Reveal key={i} delay={(i % 2) * 100}>
                  <div className={`overflow-hidden ${i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    <img src={img} alt={`${event.title} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-lux" loading="lazy" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 md:py-28 bg-charcoal">
          <div className="container-lux">
            <Reveal>
              <h2 className="font-serif text-3xl font-light text-ivory mb-12">Related Events</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel, i) => (
                <Reveal key={rel.id} delay={i * 100}>
                  <Link to={`/events/${rel.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/3] mb-4">
                      <img src={rel.cover_image || ''} alt={rel.cover_alt || rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-lux" loading="lazy" />
                    </div>
                    <div className="label-ivory mb-1">{rel.category}</div>
                    <h3 className="font-serif text-xl font-light text-ivory group-hover:text-gold transition-colors">{rel.title}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
