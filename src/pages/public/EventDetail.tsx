import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { EventItem } from '@/lib/types';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref: heroRef, visible: heroVisible } = useReveal({ threshold: 0.1 });
  const { ref: detailsRef, visible: detailsVisible } = useReveal({ threshold: 0.15 });
  const { ref: lineupRef, visible: lineupVisible } = useReveal({ threshold: 0.15 });
  const { ref: galleryRef, visible: galleryVisible } = useReveal({ threshold: 0.15 });
  const { ref: ctaRef, visible: ctaVisible } = useReveal({ threshold: 0.15 });

  useDocumentMeta({
    title: event ? `${event.title} | Fiesta Agency` : 'Event | Fiesta Agency',
    description: event?.description || 'Event details from Fiesta Agency.',
    ogImage: event?.cover_image || undefined,
  });

  useEffect(() => {
    if (!slug) return;
    const fetchEvent = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();
        if (supabaseError) throw supabaseError;
        if (data) {
          setEvent(data as EventItem);
        } else {
          setError('Event not found');
        }
      } catch {
        setError('Unable to load event. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#090909' }}>
        <div className="skeleton" style={{ width: '200px', height: '4px', borderRadius: '2px' }} />
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-5" style={{ backgroundColor: '#090909' }}>
        <h1 className="font-serif font-light text-ivory tracking-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          EVENT NOT FOUND
        </h1>
        <p className="font-sans text-stone-muted mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="btn-primary group">
          VIEW ALL EVENTS
          <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  const date = event.event_date ? new Date(event.event_date) : null;
  const formattedDate = date
    ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'TBA';
  const formattedTime = date
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'TBA';

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — Full-width cover image with metadata
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ height: 'clamp(60vh, 75vh, 700px)', minHeight: '500px' }}
      >
        <div className="absolute inset-0">
          <img
            src={event.cover_image || undefined}
            alt={event.cover_alt || event.title}
            className="w-full h-full object-cover"
            style={{
              transform: heroVisible ? 'scale(1)' : 'scale(1.05)',
              transition: `transform 1.2s ${EASE}`,
            }}
            loading="eager"
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(9,9,9,0.4) 0%, rgba(9,9,9,0.1) 35%, rgba(9,9,9,0.2) 65%, rgba(9,9,9,0.85) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(9,9,9,0.55) 0%, transparent 45%, transparent 55%, rgba(9,9,9,0.45) 100%)',
          }}
        />

        <div className="relative h-full mx-auto max-w-[1440px] px-5 md:px-[4vw] lg:px-[5vw]">
          <div className="h-full flex flex-col justify-end pb-[80px] md:pb-[100px] lg:pb-[120px]">
            <div className="max-w-[800px]">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-[0.12em] text-ivory/70 hover:text-gold transition-colors duration-300 mb-6 md:mb-8"
                style={{
                  fontSize: '0.6rem',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
                }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
                BACK TO EVENTS
              </Link>

              <span
                className="label-gold block mb-4 md:mb-5"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
                }}
              >
                {event.category}
              </span>

              <h1
                className="font-serif font-light text-ivory leading-[0.9] tracking-tight text-balance"
                style={{
                  fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.9s ${EASE} 0.2s, transform 0.9s ${EASE} 0.2s`,
                }}
              >
                {event.title}
              </h1>

              <div
                className="flex flex-wrap items-center gap-6 md:gap-8 mt-6 md:mt-8"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE} 0.3s, transform 0.8s ${EASE} 0.3s`,
                }}
              >
                <div className="flex items-center gap-2 text-ivory/80" style={{ fontSize: '0.85rem' }}>
                  <Calendar size={16} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="font-sans uppercase tracking-[0.1em] text-stone-muted" style={{ fontSize: '0.55rem' }}>DATE</p>
                    <p className="font-serif font-light">{formattedDate}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2 text-ivory/80" style={{ fontSize: '0.85rem' }}>
                    <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <p className="font-sans uppercase tracking-[0.1em] text-stone-muted" style={{ fontSize: '0.55rem' }}>VENUE</p>
                      <p className="font-serif font-light">{event.location}</p>
                    </div>
                  </div>
                )}

                {date && (
                  <div className="flex items-center gap-2 text-ivory/80" style={{ fontSize: '0.85rem' }}>
                    <Clock size={16} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <p className="font-sans uppercase tracking-[0.1em] text-stone-muted" style={{ fontSize: '0.55rem' }}>TIME</p>
                      <p className="font-serif font-light">{formattedTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-ivory/80" style={{ fontSize: '0.85rem' }}>
                  <CheckCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="font-sans uppercase tracking-[0.1em] text-stone-muted" style={{ fontSize: '0.55rem' }}>STATUS</p>
                    <p className="font-serif font-light text-gold">
                      {event.status === 'upcoming' ? 'Upcoming' : event.status === 'completed' ? 'Past' : 'Cancelled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: `opacity 0.8s ${EASE} 0.5s`,
          }}
          aria-hidden="true"
        >
          <span className="label-muted text-[0.55rem]">SCROLL</span>
          <div className="w-[1px] h-8 bg-white/15 relative overflow-hidden">
            <span className="absolute left-0 top-0 w-full bg-gold" style={{ height: '40%', animation: 'pulseSlow 3s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DESCRIPTION
          ═══════════════════════════════════════════ */}
      {event.description && (
        <section
          ref={detailsRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#151515', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div className="max-w-3xl">
              <div
                className="mb-8"
                style={{
                  opacity: detailsVisible ? 1 : 0,
                  transform: detailsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
                }}
              >
                <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                  EVENT OVERVIEW
                </p>
                <div className="w-16 h-[2px] bg-gold mb-6" />
              </div>
              <div
                className="font-sans text-ivory leading-[1.85]"
                style={{
                  fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                  opacity: detailsVisible ? 1 : 0,
                  transform: detailsVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE} 0.2s, transform 0.8s ${EASE} 0.2s`,
                }}
              >
                {event.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {event.ticket_url || event.registration_url ? (
                <a
                  href={event.ticket_url || event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group mt-10"
                  style={{
                    opacity: detailsVisible ? 1 : 0,
                    transform: detailsVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.8s ${EASE} 0.3s, transform 0.8s ${EASE} 0.3s`,
                  }}
                >
                  {event.ticket_url ? 'GET TICKETS' : 'REGISTER NOW'}
                  <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="btn-primary group mt-10"
                  style={{
                    opacity: detailsVisible ? 1 : 0,
                    transform: detailsVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.8s ${EASE} 0.3s, transform 0.8s ${EASE} 0.3s`,
                  }}
                >
                  INQUIRE / BOOK TICKETS
                  <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          LINEUP
          ═══════════════════════════════════════════ */}
      {event.lineup && event.lineup.length > 0 && (
        <section
          ref={lineupRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#090909', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div
              className="mb-10 md:mb-14"
              style={{
                opacity: lineupVisible ? 1 : 0,
                transform: lineupVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
              }}
            >
              <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                LINEUP
              </p>
              <h2 className="font-serif font-light tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#F5F2EA', lineHeight: '1.1' }}>
                ARTISTS & PERFORMERS
              </h2>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              style={{
                opacity: lineupVisible ? 1 : 0,
                transform: lineupVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
              }}
            >
              {event.lineup.map((artist, i) => (
                <div
                  key={i}
                  className="group p-6 md:p-8 transition-all duration-300 hover:border-gold/30 hover:-translate-y-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,242,234,0.06)', borderRadius: '6px' }}
                >
                  <p className="font-serif font-light text-ivory tracking-tight mb-3" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)', lineHeight: '1.2' }}>
                    {artist}
                  </p>
                  <p className="font-sans text-stone/60" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Performer
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          PHOTO HIGHLIGHTS
          ═══════════════════════════════════════════ */}
      {event.gallery && event.gallery.length > 0 && (
        <section
          ref={galleryRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#151515', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div
              className="mb-10 md:mb-14"
              style={{
                opacity: galleryVisible ? 1 : 0,
                transform: galleryVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
              }}
            >
              <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                PHOTO HIGHLIGHTS
              </p>
              <h2 className="font-serif font-light tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#F5F2EA', lineHeight: '1.1' }}>
                MOMENTS CAPTURED
              </h2>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
              style={{
                opacity: galleryVisible ? 1 : 0,
                transform: galleryVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
              }}
            >
              {event.gallery.map((img, i) => (
                <div key={i} className="group relative overflow-hidden" style={{ aspectRatio: '4/3', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <img
                    src={img}
                    alt={`${event.title} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: 'scale(1)',
                      transition: `transform 0.7s ${EASE}`,
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100" style={{ background: 'rgba(21,21,21,0.5)', transition: 'opacity 0.4s ease' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden"
        style={{ height: 'clamp(400px, 55vh, 500px)' }}
      >
        <div className="absolute inset-0">
          <img
            src={images.hero[2]}
            alt="Elegant celebration with dramatic lighting"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(21,21,21,0.45) 0%, rgba(21,21,21,0.6) 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5 md:px-[4vw] lg:px-[5vw]">
          <p className="font-sans font-semibold uppercase tracking-[0.22em] mb-5 md:mb-6" style={{ fontSize: '0.7rem', color: '#D6A64F', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s` }}>
            WANT SOMETHING LIKE THIS?
          </p>
          <div className="mb-6 md:mb-8" style={{ width: '32px', height: '2px', backgroundColor: '#D6A64F', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'scaleX(1)' : 'scaleX(0)', transition: `opacity 0.7s ${EASE} 0.2s, transform 0.7s ${EASE} 0.2s` }} />
          <h2 className="font-serif font-light tracking-tight leading-[0.9] max-w-2xl" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EA', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.9s ${EASE} 0.2s, transform 0.9s ${EASE} 0.2s` }}>
            LET'S CREATE
            <br />
            <span className="text-gradient-gold">YOUR EXPERIENCE</span>
          </h2>
          <Link to="/contact" className="btn-primary group mt-8 md:mt-10" style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.8s ${EASE} 0.3s, transform 0.8s ${EASE} 0.3s` }}>
            START PLANNING
            <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
export default EventDetail;

