import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { Service } from '@/lib/types';
import { images } from '@/lib/images-supabase';

/* ─── PAGE LOAD INTRO ─── */
function useIntro() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);
  return ready;
}

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ─── DEFAULT DATA ─── */

const FEATURED_DEFAULTS = [
  { id: '1', title: 'EVENT PLANNING', description: 'Full-service event planning tailored to your vision and goals.', image: images.blacktie[2] },
  { id: '2', title: 'CONCERTS & LIVE SHOWS', description: 'End-to-end production for unforgettable live experiences.', image: images.hero[3] },
  { id: '3', title: 'WEDDINGS & CELEBRATIONS', description: 'Beautifully curated weddings and private celebrations.', image: images.serena[0] },
];

const SERVICE_CARDS = [
  { id: '1', title: 'Event Planning', description: 'Full-service planning from concept to execution.', image: images.blacktie[2] },
  { id: '2', title: 'Event Design & Styling', description: 'Creative direction and aesthetic curation for your event.', image: images.process[4] },
  { id: '3', title: 'Weddings & Celebrations', description: 'Beautifully curated weddings and milestone celebrations.', image: images.serena[1] },
  { id: '4', title: 'Corporate Events', description: 'Professional conferences, summits, and corporate gatherings.', image: images.hero[4] },
  { id: '5', title: 'Production & Lighting', description: 'Stage design, sound, lighting, and full production.', image: images.process[5] },
  { id: '6', title: 'Catering & Hospitality', description: 'Premium catering and guest experience management.', image: images.lagoon[5] },
  { id: '7', title: 'Photography & Videography', description: 'Professional coverage to capture every moment.', image: images.intimate[3] },
  { id: '8', title: 'Private Events', description: 'Exclusive birthday parties, anniversaries, and private gatherings.', image: images.lagoon[6] },
];

const STATS = [
  { number: '200+', label: 'Events Executed' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '5K+', label: 'Happy Guests' },
  { number: '100%', label: 'Commitment' },
];

const TESTIMONIALS = [
  { quote: 'Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.', author: 'SARAH & MICHEL', role: 'Wedding, Kigali' },
  { quote: 'Professional, creative, and genuinely passionate. They don\'t just plan events - they create experiences that stay with you.', author: 'DAVID NZAMUHO', role: 'Corporate Summit' },
  { quote: 'The energy they brought to our concert was unreal. From stage design to sound production - absolute perfection.', author: 'JEAN-PASCAL', role: 'Live Show Production' },
];

const HERO_IMAGE = images.hero[0];

/* ─── SERVICES PAGE ─── */

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const intro = useIntro();

  useDocumentMeta({
    title: 'Services | Fiesta Agency Rwanda',
    description: 'Explore our comprehensive event services - planning, production, entertainment and more.',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (data) setServices(data as Service[]);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const featured = services.filter((s) => s.featured).slice(0, 3);
  const featuredDisplay = featured.length >= 3
    ? featured.map((s) => ({ id: s.id, title: s.title.toUpperCase(), description: s.description || '', image: s.image_url || '' }))
    : FEATURED_DEFAULTS;

  return (
    <div style={{
      opacity: intro ? 1 : 0,
      transform: intro ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw',
    }}>
      <S01Hero intro={intro} />
      <S02Featured services={featuredDisplay} loading={loading} />
      <S03ServiceCards loading={loading} />
      <S04Stats />
      <S05Process />
      <S06Testimonials />
      <S07CTA />
    </div>
  );
}

/* ─── 01 — HERO ─── */

function S01Hero({ intro }: { intro: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ backgroundColor: '#090909', overflow: 'hidden', width: '100%' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(100px, 14vw, 180px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
        overflow: 'hidden',
      }}>
        <div className="svc-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'center',
        }}>
          {/* Left: Text */}
          <Reveal delay={0.15} visible={visible}>
            <div style={{ maxWidth: '520px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px',
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
              }}>
                <div style={{ width: '40px', height: '1.5px', backgroundColor: '#D6A54A' }} />
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  color: '#D6A54A',
                }}>OUR SERVICES</p>
              </div>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.85rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F7F4ED',
                marginBottom: '24px',
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}>
                EXCEPTIONAL SERVICES FOR UNFORGETTABLE{' '}
                <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>EVENTS.</span>
              </h1>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C7C2B9',
                maxWidth: '380px',
                marginBottom: '28px',
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
              }}>
                From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.
              </p>
            </div>
          </Reveal>

          {/* Right: Image */}
          <Reveal delay={0.2} visible={visible}>
            <div className="svc-hero-images" style={{
              overflow: 'hidden',
              minWidth: 0,
            }}>
              <img
                src={HERO_IMAGE}
                alt="Luxury event setup with elegant decor and warm lighting"
                style={{
                  width: '100%',
                  minWidth: 0,
                  height: 'clamp(320px, 38vw, 460px)',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.05)',
                  transition: `transform 1.4s ${E} 0.25s`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .svc-hero-grid { grid-template-columns: 42% 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — FEATURED SECTION ─── */

function S02Featured({ services: svcItems, loading }: { services: Array<{ id: string; title: string; description: string; image: string }>; loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.06 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 140px)',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="svc-featured-split"
        >
          {/* Left: Text */}
          <Reveal delay={0} visible={visible}>
            <div>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>WHAT WE OFFER</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#171717',
                marginBottom: '20px',
              }}>
                Experiences Crafted With{' '}
                <span style={{ fontStyle: 'italic' }}>Intentions.</span>
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.7,
                color: '#6F6B63',
                maxWidth: '400px',
                marginBottom: '32px',
              }}>
                Every event is unique. We listen, design, and deliver experiences that reflect your vision and exceed expectations.
              </p>
              <Link
                to="/services"
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
                Explore Our Services
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>

          {/* Right: Featured image with label */}
          <Reveal delay={0.12} visible={visible}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {loading ? (
                <div className="skeleton" style={{ aspectRatio: '16/10' }} />
              ) : (
                <>
                  <img
                    src={svcItems[0]?.image || FEATURED_DEFAULTS[0].image}
                    alt="Event Planning"
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
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(20px, 3vw, 32px)',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
                  }}>
                    <span style={{
                      fontFamily: "'Manrope', system-ui, sans-serif",
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.18em',
                      color: '#D6A54A',
                      display: 'block',
                      marginBottom: '8px',
                    }}>EVENT PLANNING</span>
                    <p style={{
                      fontFamily: "'Manrope', system-ui, sans-serif",
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      color: 'rgba(248,245,239,0.85)',
                      maxWidth: '320px',
                    }}>Full-service event planning tailored to your vision and goals.</p>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .svc-featured-split { grid-template-columns: 40% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 03 — SERVICE CARDS GRID ─── */

function S03ServiceCards({ loading }: { loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.05 });

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(16px, 2vw, 24px)',
        }}
          className="svc-cards-grid"
        >
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '3/4' }} />
            ))
          ) : (
            SERVICE_CARDS.map((card, i) => (
              <ServiceCard key={card.id} card={card} index={i} visible={visible} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .svc-cards-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .svc-cards-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .svc-cards-grid::-webkit-scrollbar { display: none; }
          .svc-cards-grid > * {
            flex: 0 0 72% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ card, index, visible }: {
  card: { id: string; title: string; description: string; image: string };
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        aspectRatio: '3/4',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ${E} ${0.1 + index * 0.06}s, transform 0.7s ${E} ${0.1 + index * 0.06}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={card.image}
        alt={card.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: `transform 0.7s ${E}`,
        }}
        loading="lazy"
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(9,9,9,0.05) 0%, rgba(9,9,9,0.7) 100%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(16px, 2.5vw, 24px)',
      }}>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
          fontWeight: 400,
          color: '#F7F4ED',
          marginBottom: '6px',
          lineHeight: 1.15,
        }}>{card.title}</h3>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: 'clamp(0.7rem, 0.8vw, 0.8rem)',
          lineHeight: 1.5,
          color: 'rgba(200,196,188,0.9)',
          maxWidth: '240px',
        }}>{card.description}</p>
      </div>
    </div>
  );
}

/* ─── 04 — STATS ─── */

function S04Stats() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
      paddingTop: 'clamp(60px, 8vw, 100px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ textAlign: 'center' as const, marginBottom: 'clamp(40px, 5vw, 56px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>WHY CHOOSE US</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F8F5EF',
            }}>
              More Than Just{' '}
              <span style={{ fontStyle: 'italic' }}>An Event.</span>
            </h2>
          </div>
        </Reveal>

        <div className="svc-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
        }}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{
              textAlign: 'center' as const,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.7s ${E} ${0.15 + i * 0.08}s, transform 0.7s ${E} ${0.15 + i * 0.08}s`,
            }}>
              <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 400,
                color: '#D6A54A',
                lineHeight: 1,
                display: 'block',
                marginBottom: '8px',
              }}>{stat.number}</span>
              <span style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.16em',
                color: 'rgba(248,245,239,0.4)',
              }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <Reveal delay={0.4} visible={visible}>
          <div style={{ textAlign: 'center' as const, marginTop: 'clamp(40px, 5vw, 56px)' }}>
            <Link
              to="/about"
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
              Learn More
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .svc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 05 — PROCESS ─── */

function S05Process() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const steps = [
    { number: '01', title: 'DISCOVER', description: 'We listen to your vision and understand the heart of what you want.' },
    { number: '02', title: 'DESIGN', description: 'We develop a creative direction that brings your idea to life.' },
    { number: '03', title: 'PLAN', description: 'Every detail is mapped out with precision and care.' },
    { number: '04', title: 'PRODUCE', description: 'We execute with expertise, coordination, and flawless timing.' },
    { number: '05', title: 'DELIVER', description: 'The final experience exceeds expectations and creates lasting memories.' },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(70px, 9vw, 120px)',
      paddingBottom: 'clamp(70px, 9vw, 120px)',
      overflow: 'hidden',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>HOW WE BRING IT TO LIFE</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#090909',
            }}>
              FROM IDEA TO{' '}
              <span style={{ fontStyle: 'italic' }}>UNFORGETTABLE.</span>
            </h2>
          </div>
        </Reveal>

        {/* Desktop: Horizontal */}
        <div className="svc-proc-desktop" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '18px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'rgba(20,20,20,0.08)',
          }} />
          {steps.map((step, i) => (
            <div key={step.number} style={{
              flex: 1,
              position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#F1EDE3',
                border: '1px solid rgba(20,20,20,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.number}</span>
              </div>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                marginBottom: '12px',
                color: '#090909',
              }}>{step.title}</h3>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: '#6F6B63',
                maxWidth: '180px',
              }}>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical */}
        <div className="svc-proc-mobile">
          {steps.map((step, i) => (
            <div key={step.number} style={{
              display: 'flex',
              gap: '20px',
              position: 'relative',
              paddingBottom: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '17px',
                  top: '36px',
                  width: '1px',
                  height: 'calc(100% - 36px)',
                  backgroundColor: 'rgba(20,20,20,0.08)',
                }} />
              )}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#F1EDE3',
                border: '1px solid rgba(20,20,20,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.number}</span>
              </div>
              <div style={{ paddingTop: '4px' }}>
                <h3 style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  marginBottom: '12px',
                  color: '#090909',
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: '#6F6B63',
                }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .svc-proc-desktop { display: flex; align-items: flex-start; justify-content: space-between; }
        .svc-proc-mobile { display: none; }
        @media (max-width: 768px) {
          .svc-proc-desktop { display: none !important; }
          .svc-proc-mobile { display: flex !important; flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 06 — TESTIMONIALS ─── */

function S06Testimonials() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#101010',
      paddingTop: 'clamp(80px, 10vw, 140px)',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>WHAT THEY SAY</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F7F4ED',
            }}>WORDS FROM<br />OUR CLIENTS.</h2>
          </div>
        </Reveal>

        <div className="svc-testi-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
        }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} testimonial={t} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .svc-testi-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 20px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .svc-testi-grid::-webkit-scrollbar { display: none; }
          .svc-testi-grid > * {
            flex: 0 0 80% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ testimonial, index, visible }: {
  testimonial: { quote: string; author: string; role: string };
  index: number;
  visible: boolean;
}) {
  return (
    <div style={{
      borderLeft: '2px solid rgba(214,165,74,0.2)',
      paddingLeft: 'clamp(20px, 2.5vw, 32px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.7s ${E} ${0.15 + index * 0.1}s, transform 0.7s ${E} ${0.15 + index * 0.1}s`,
    }}>
      <span style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: '2.5rem',
        fontWeight: 400,
        color: 'rgba(214,165,74,0.2)',
        lineHeight: 1,
        display: 'block',
        marginBottom: '16px',
      }}>&ldquo;</span>
      <p style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#F7F4ED',
        lineHeight: 1.5,
        marginBottom: '24px',
      }}>{testimonial.quote}</p>
      <div>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.12em',
          color: '#F7F4ED',
          marginBottom: '2px',
        }}>{testimonial.author}</p>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '0.6rem',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          color: 'rgba(247,244,237,0.35)',
        }}>{testimonial.role}</p>
      </div>
    </div>
  );
}

/* ─── 07 — CTA ─── */

function S07CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 120px)',
      paddingBottom: 'clamp(80px, 10vw, 120px)',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        textAlign: 'center' as const,
      }}>
        <Reveal delay={0} visible={visible}>
          <p style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            fontWeight: 600,
            color: '#D6A54A',
            marginBottom: '20px',
          }}>LET&apos;S CREATE SOMETHING EXTRAORDINARY</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            marginBottom: '16px',
          }}>
            Your Vision. Our{' '}
            <span style={{ fontStyle: 'italic' }}>Expertise.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14} visible={visible}>
          <p style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
            lineHeight: 1.7,
            color: '#6F6B63',
            maxWidth: '480px',
            margin: '0 auto 32px',
          }}>
            Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.
          </p>
        </Reveal>
        <Reveal delay={0.2} visible={visible}>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
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
            Book Your Event
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </Reveal>
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

export default Services;
