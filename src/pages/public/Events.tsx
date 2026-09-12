import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { EventItem } from '@/lib/types';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const CATEGORIES = ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'] as const;

const CTA_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80';

const FALLBACK_EVENTS: EventItem[] = [
  { id: 'f1', title: 'Afro Rhythm Live in Kigali', slug: 'afro-rhythm-live-kigali', description: 'A spectacular night of African rhythms and world-class performance.', category: 'Concert', event_date: '2025-05-24', location: 'Kigali Arena', cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', cover_alt: 'Live concert stage with dramatic lighting', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: true, published: true, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'f2', title: 'Global Leadership Summit 2025', slug: 'global-leadership-summit-2025', description: 'An international corporate summit bringing together industry leaders.', category: 'Corporate', event_date: '2025-06-15', location: 'Kigali Convention Centre', cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', cover_alt: 'Corporate event with dramatic lighting', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'f3', title: 'The Williams Wedding', slug: 'the-williams-wedding', description: 'An intimate garden wedding celebration surrounded by nature.', category: 'Wedding', event_date: '2025-04-12', location: 'Five Hills Estate', cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', cover_alt: 'Elegant outdoor wedding ceremony', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'f4', title: 'Gala Night Celebration', slug: 'gala-night-celebration', description: 'A premium private gala evening with live entertainment.', category: 'Private', event_date: '2025-03-20', location: 'Radisson Blu Kigali', cover_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', cover_alt: 'Elegant candlelit gala dinner', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 3, created_at: '', updated_at: '' },
  { id: 'f5', title: 'Cultural Heritage Festival', slug: 'cultural-heritage-festival', description: 'A vibrant public festival celebrating Rwandan culture.', category: 'Festival', event_date: '2025-02-08', location: 'Amahoro Stadium', cover_image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', cover_alt: 'Outdoor cultural festival with crowds', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 4, created_at: '', updated_at: '' },
  { id: 'f6', title: 'New Year Eve Concert', slug: 'new-year-eve-concert', description: 'Ring in the new year with an unforgettable night of music.', category: 'Concert', event_date: '2024-12-31', location: 'Kigali Arena', cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', cover_alt: 'Night concert with stage lights', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 5, created_at: '', updated_at: '' },
  { id: 'f7', title: 'Rooftop Party Night', slug: 'rooftop-party-night', description: 'An exclusive rooftop celebration under the city lights.', category: 'Private', event_date: '2025-01-18', location: 'Ubumwe Grande Hotel', cover_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', cover_alt: 'Rooftop party with city skyline', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 6, created_at: '', updated_at: '' },
  { id: 'f8', title: 'Kigali Music Festival', slug: 'kigali-music-festival', description: 'A three-day music festival celebrating African talent.', category: 'Festival', event_date: '2025-07-10', location: 'BD Life Centre', cover_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', cover_alt: 'Music festival crowd at sunset', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 7, created_at: '', updated_at: '' },
  { id: 'f9', title: 'Tech Innovation Conference', slug: 'tech-innovation-conference', description: 'Where founders, investors, and technologists shape the future of African tech.', category: 'Corporate', event_date: '2025-08-22', location: 'Kigali Convention Centre', cover_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', cover_alt: 'Modern conference hall with attendees', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 8, created_at: '', updated_at: '' },
  { id: 'f10', title: 'Sunset Garden Wedding', slug: 'sunset-garden-wedding', description: 'A breathtaking garden ceremony as the sun sets over the hills.', category: 'Wedding', event_date: '2025-09-06', location: 'Serena Hotel Kigali', cover_image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', cover_alt: 'Garden wedding at golden hour', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 9, created_at: '', updated_at: '' },
  { id: 'f11', title: 'Jazz & Wine Evening', slug: 'jazz-wine-evening', description: 'An intimate evening of smooth jazz and curated wine selections.', category: 'Private', event_date: '2025-10-14', location: 'Marriott Kigali', cover_image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80', cover_alt: 'Jazz performance with wine glasses', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 10, created_at: '', updated_at: '' },
  { id: 'f12', title: 'Kigali Fashion Week', slug: 'kigali-fashion-week', description: 'A week-long celebration of African fashion design and runway artistry.', category: 'Festival', event_date: '2025-11-20', location: 'Kigali Arena', cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', cover_alt: 'Fashion runway show with models', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 11, created_at: '', updated_at: '' },
  { id: 'f13', title: 'Annual Charity Gala', slug: 'annual-charity-gala', description: 'A black-tie evening raising funds for education across Rwanda.', category: 'Corporate', event_date: '2025-12-05', location: 'Radisson Blu Kigali', cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', cover_alt: 'Charity gala with elegant decor', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 12, created_at: '', updated_at: '' },
  { id: 'f14', title: 'Independence Day Concert', slug: 'independence-day-concert', description: 'A grand celebration of Rwandan independence with top artists.', category: 'Concert', event_date: '2025-07-04', location: 'Amahoro Stadium', cover_image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', cover_alt: 'Stadium concert with fireworks', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 13, created_at: '', updated_at: '' },
  { id: 'f15', title: 'Luxury Birthday Celebration', slug: 'luxury-birthday-celebration', description: 'A milestone birthday party with bespoke décor and live band.', category: 'Private', event_date: '2025-05-10', location: 'Four Seasons Resort', cover_image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', cover_alt: 'Elegant birthday celebration setup', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 14, created_at: '', updated_at: '' },
  { id: 'f16', title: 'East African Food Festival', slug: 'east-african-food-festival', description: 'A culinary journey through the flavors of East Africa.', category: 'Festival', event_date: '2025-04-26', location: 'Garden City Mall', cover_image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', cover_alt: 'Food festival with vibrant stalls', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 15, created_at: '', updated_at: '' },
  { id: 'f17', title: 'Startup Pitch Night', slug: 'startup-pitch-night', description: 'An electric evening where founders pitch to top investors.', category: 'Corporate', event_date: '2025-03-15', location: 'Norrsken House Kigali', cover_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', cover_alt: 'Pitch event with audience', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'completed', featured: false, published: true, sort_order: 16, created_at: '', updated_at: '' },
  { id: 'f18', title: 'Acoustic Sunset Sessions', slug: 'acoustic-sunset-sessions', description: 'Live acoustic performances as the sun dips below the horizon.', category: 'Concert', event_date: '2025-06-28', location: 'Lake Kivu Marina', cover_image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', cover_alt: 'Acoustic performance at sunset', gallery: [], lineup: [], ticket_url: null, registration_url: null, status: 'upcoming', featured: false, published: true, sort_order: 17, created_at: '', updated_at: '' },
];

/* ─── EVENTS PAGE ─── */

export function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useDocumentMeta({
    title: 'Events | Fiesta Agency Rwanda',
    description: 'Discover upcoming events and see our past productions across Rwanda.',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (data) setEvents(data as EventItem[]);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const displayEvents = events.length > 0 ? events : FALLBACK_EVENTS;

  const featured = useMemo(() => displayEvents.find((e) => e.featured && e.cover_image) || displayEvents.find((e) => e.cover_image) || null, [displayEvents]);
  const upcoming = useMemo(() => displayEvents.filter((e) => e.status === 'upcoming' && e.cover_image && e.id !== featured?.id), [displayEvents, featured]);
  const past = useMemo(() => displayEvents.filter((e) => e.status === 'completed' && e.cover_image && e.id !== featured?.id), [displayEvents, featured]);

  const filteredUpcoming = useMemo(() => {
    if (activeFilter === 'ALL') return upcoming;
    const cat = activeFilter.toLowerCase();
    return upcoming.filter((e) => e.category?.toLowerCase() === cat);
  }, [upcoming, activeFilter]);

  return (
    <>
      <E01Hero />
      <E02Filter active={activeFilter} onChange={setActiveFilter} />
      {featured && <E03Featured event={featured} />}
      <E04Upcoming events={filteredUpcoming} loading={loading} />
      <E05Past events={past} loading={loading} />
      <E06Editorial />
      <E07CTA />
    </>
  );
}

/* ─── 01 — HERO ─── */

function E01Hero() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ backgroundColor: '#090909', overflow: 'hidden' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(90px, 12vw, 160px)',
        paddingBottom: 'clamp(50px, 6vw, 80px)',
      }}>
        <div style={{ display: 'flex', gap: 'clamp(32px, 4vw, 56px)', alignItems: 'flex-start' }}
          className="evt-hero-grid"
        >
          {/* Left: Text — 45% */}
          <div style={{ flex: '0 0 45%' }} className="evt-hero-text">
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>OUR EVENTS</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {"EXTRAORDINARY\nMOMENTS.\nALWAYS."}
              </h1>
            </Reveal>
            <Reveal delay={0.14} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C8C2B8',
                maxWidth: '390px',
                marginBottom: '32px',
              }}>
                From intimate gatherings to large celebrations, our events are designed to create lasting memories and meaningful connections.
              </p>
            </Reveal>
            <Reveal delay={0.2} visible={visible}>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#D6A54A' }} />
            </Reveal>
          </div>

          {/* Right: Image — 55% */}
          <Reveal delay={0.12} visible={visible}>
            <div style={{ flex: 1, overflow: 'hidden' }} className="evt-hero-img">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
                alt="Elegant candlelit event reception with floral arrangements"
                style={{
                  width: '100%',
                  height: 'clamp(300px, 28vw, 340px)',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .evt-hero-grid { flex-direction: column !important; }
          .evt-hero-text { flex: none !important; width: 100% !important; }
          .evt-hero-img { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — FILTER BAR ─── */

function E02Filter({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <section style={{
      backgroundColor: '#F1EDE3',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        height: '52px',
        overflowX: 'auto',
      }}
        className="evt-filter-bar"
      >
        <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 36px)', flexShrink: 0 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                color: active === cat ? '#D6A54A' : '#6F6B63',
                background: 'none',
                border: 'none',
                borderBottom: active === cat ? '1.5px solid #D6A54A' : '1.5px solid transparent',
                paddingBottom: '2px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 03 — FEATURED EVENT ─── */

function E03Featured({ event }: { event: EventItem }) {
  const { ref, visible } = useReveal({ threshold: 0.08 });
  const dateStr = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : '';

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(60px, 8vw, 100px)',
      paddingBottom: 'clamp(80px, 10vw, 120px)',
      position: 'relative',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="evt-featured-grid"
        >
          {/* Left: Image — 55% */}
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={event.cover_image || ''}
                alt={event.cover_alt || event.title}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.03)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Right: Text — 40% */}
          <div className="evt-featured-text">
            <Reveal delay={0.12} visible={visible}>
              {event.category && (
                <span style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.15em',
                  color: '#D6A54A',
                  display: 'block',
                  marginBottom: '16px',
                }}>{event.category}</span>
              )}
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '20px',
              }}>{event.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {dateStr && (
                  <div>
                    <span style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#6F6B63', display: 'block', marginBottom: '2px' }}>DATE</span>
                    <span style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.85rem', color: '#161616' }}>{dateStr}</span>
                  </div>
                )}
                {event.location && (
                  <div>
                    <span style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#6F6B63', display: 'block', marginBottom: '2px' }}>VENUE</span>
                    <span style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.85rem', color: '#161616' }}>{event.location}</span>
                  </div>
                )}
              </div>
              {event.description && (
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                  lineHeight: 1.7,
                  color: '#6F6B63',
                  marginBottom: '28px',
                  maxWidth: '400px',
                }}>{event.description}</p>
              )}
              <Link
                to={`/events/${event.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  color: '#D6A54A',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B8862D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
              >
                VIEW EVENT
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .evt-featured-grid { grid-template-columns: 55% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 04 — UPCOMING EVENTS ─── */

function E04Upcoming({ events: evts, loading }: { events: EventItem[]; loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.06 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#FFFFFF',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>UPCOMING EVENTS</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
            }}>WHAT&apos;S COMING UP</h2>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', opacity: 0.5 }}
            className="evt-grid"
          >
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '4/3' }} />)}
          </div>
        ) : evts.length === 0 ? (
          <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.9rem', color: '#6F6B63' }}>
            No upcoming events at the moment.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 2vw, 24px)' }}
            className="evt-grid"
          >
            {evts.slice(0, 6).map((event, i) => (
              <EventCard key={event.id} event={event} index={i} visible={visible} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .evt-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .evt-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .evt-grid::-webkit-scrollbar { display: none; }
          .evt-grid > * {
            flex: 0 0 80% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function EventCard({ event, index, visible }: { event: EventItem; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const dateStr = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : '';

  return (
    <Link
      to={`/events/${event.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ${E} ${0.1 + index * 0.08}s, transform 0.8s ${E} ${0.1 + index * 0.08}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View event: ${event.title}`}
    >
      <div style={{ overflow: 'hidden', marginBottom: '14px' }}>
        <img
          src={event.cover_image || ''}
          alt={event.cover_alt || event.title}
          style={{
            width: '100%',
            aspectRatio: '4/3',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: `transform 0.7s ${E}`,
          }}
          loading="lazy"
        />
      </div>
      {event.category && (
        <span style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '0.55rem',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.18em',
          color: '#D6A54A',
          display: 'block',
          marginBottom: '6px',
        }}>{event.category}</span>
      )}
      <h3 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
        fontWeight: 400,
        color: '#161616',
        lineHeight: 1.2,
        marginBottom: '6px',
      }}>{event.title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {dateStr && (
          <span style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.62rem',
            color: '#6F6B63',
          }}>{dateStr}</span>
        )}
        {event.location && (
          <span style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.62rem',
            color: '#6F6B63',
          }}>{event.location}</span>
        )}
      </div>
      <ArrowRight
        style={{
          color: hovered ? '#D6A54A' : 'rgba(22,22,22,0.2)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: `transform 0.4s ${E}, color 0.4s ${E}`,
          marginTop: '10px',
        }}
        size={14}
        strokeWidth={1.5}
      />
    </Link>
  );
}

/* ─── 05 — PAST EVENTS ─── */

function E05Past({ events: evts, loading }: { events: EventItem[]; loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.05 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
      position: 'relative',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>PAST EVENTS</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F8F5EF',
            }}>MOMENTS WE&apos;VE CREATED</h2>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', opacity: 0.5 }}
            className="evt-past-grid"
          >
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '4/3' }} />)}
          </div>
        ) : evts.length === 0 ? (
          <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.9rem', color: 'rgba(248,245,239,0.4)' }}>
            No past events to display.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(12px, 1.5vw, 20px)' }}
            className="evt-past-grid"
          >
            {evts.slice(0, 6).map((event, i) => (
              <PastEventItem key={event.id} event={event} index={i} visible={visible} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .evt-past-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .evt-past-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .evt-past-grid::-webkit-scrollbar { display: none; }
          .evt-past-grid > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function PastEventItem({ event, index, visible }: { event: EventItem; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const year = event.event_date ? new Date(event.event_date).getFullYear() : '';

  return (
    <Link
      to={`/events/${event.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ${E} ${0.1 + index * 0.08}s, transform 0.8s ${E} ${0.1 + index * 0.08}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View event: ${event.title}`}
    >
      <img
        src={event.cover_image || ''}
        alt={event.cover_alt || event.title}
        style={{
          width: '100%',
          aspectRatio: '4/3',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: `transform 0.7s ${E}`,
        }}
        loading="lazy"
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.35) 100%)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        pointerEvents: 'none',
      }}>
        {event.category && (
          <span style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.5rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.18em',
            color: '#D6A54A',
            display: 'block',
            marginBottom: '4px',
          }}>{event.category}</span>
        )}
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
          fontWeight: 400,
          color: '#F8F5EF',
          lineHeight: 1.2,
          opacity: hovered ? 1 : 0.9,
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: `opacity 0.4s ${E}, transform 0.4s ${E}`,
        }}>{event.title}</h3>
        {year && (
          <span style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.55rem',
            color: 'rgba(248,245,239,0.5)',
          }}>{year}</span>
        )}
      </div>
    </Link>
  );
}

/* ─── 06 — EDITORIAL STATEMENT ─── */

function E06Editorial() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
      position: 'relative',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="evt-editorial-grid"
        >
          {/* Left: Gold Rule + Heading */}
          <div style={{ position: 'relative' }}>
            <div
              className="evt-editorial-rule"
              style={{
                position: 'absolute',
                left: '-28px',
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#D6A54A',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.8s ease 0.2s',
              }}
            />
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>THE FIESTA EXPERIENCE</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.75rem, 4.5vw, 3.625rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
              }}>
                {"EVERY EVENT\nBECOMES A STORY\nWORTH REMEMBERING."}
              </h2>
            </Reveal>
          </div>

          {/* Right: Body */}
          <Reveal delay={0.15} visible={visible}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: 'clamp(0.9rem, 1.05vw, 1rem)',
              lineHeight: 1.8,
              color: '#6F6B63',
              maxWidth: '480px',
            }}>
              Fiesta creates experiences rather than simply coordinating schedules. We bring together creative direction, production expertise, and an obsession with detail to craft events that resonate with people long after the last song fades. Every gathering has a story — we help tell it.
            </p>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .evt-editorial-grid { grid-template-columns: 45% 1fr !important; gap: 48px !important; align-items: start !important; }
          .evt-editorial-rule { display: block !important; }
        }
        @media (max-width: 1023px) { .evt-editorial-rule { display: none !important; } }
      `}</style>
    </section>
  );
}

/* ─── 07 — CTA ─── */

function E07CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(320px, 42vh, 440px)',
    }} className="grain">
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={CTA_IMAGE}
          alt="Elegant outdoor celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05) saturate(0.85)' }}
          loading="lazy"
        />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 100%)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        paddingLeft: 'clamp(24px, 4vw, 40px)',
        paddingRight: 'clamp(24px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s ${E} 0.1s, transform 0.9s ${E} 0.1s`,
      }}>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          fontWeight: 600,
          color: '#D6A54A',
          marginBottom: '20px',
        }}>LET&apos;S CREATE TOGETHER</p>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"READY TO PLAN\nYOUR NEXT EVENT?"}
        </h2>
        <Link
          to="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '32px',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.14em',
            color: '#D6A54A',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#B8862D'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
        >
          GET IN TOUCH
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}

/* ─── REVEAL HELPER ─── */

function Reveal({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.8s ${E} ${delay}s, transform 0.8s ${E} ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default Events;
