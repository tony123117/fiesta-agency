import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { Service } from '@/lib/types';

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
  { id: '1', title: 'EVENT PLANNING', description: 'Full-service event planning tailored to your vision and goals.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' },
  { id: '2', title: 'CONCERTS & LIVE SHOWS', description: 'End-to-end production for unforgettable live experiences.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80' },
  { id: '3', title: 'WEDDINGS & CELEBRATIONS', description: 'Beautifully curated weddings and private celebrations.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
];

const DIRECTORY_LEFT = [
  { id: '1', number: '04', title: 'CORPORATE EVENTS' },
  { id: '2', number: '05', title: 'PRIVATE EVENTS & PARTIES' },
  { id: '3', number: '06', title: 'FESTIVALS & PUBLIC EVENTS' },
  { id: '4', number: '07', title: 'DECORATION & BRANDING' },
  { id: '5', number: '08', title: 'SOUND, LIGHTING & STAGE PRODUCTION' },
  { id: '6', number: '09', title: 'DJ & MC COORDINATION' },
];

const DIRECTORY_RIGHT = [
  { id: '7', number: '10', title: 'PHOTOGRAPHY & VIDEOGRAPHY' },
  { id: '8', number: '11', title: 'EVENT PROMOTION & SOCIAL MEDIA' },
  { id: '9', number: '12', title: 'BIRTHDAYS & GRADUATIONS' },
];

const PROCESS_STEPS = [
  { id: '1', number: '01', title: 'IDEA', description: 'We listen to your vision and understand the heart of what you want.' },
  { id: '2', number: '02', title: 'CREATIVE', description: 'We develop a creative direction that brings your idea to life.' },
  { id: '3', number: '03', title: 'PLANNING', description: 'Every detail is mapped out with precision and care.' },
  { id: '4', number: '04', title: 'PRODUCTION', description: 'We execute with expertise, coordination, and flawless timing.' },
  { id: '5', number: '05', title: 'DELIVERY', description: 'The final experience exceeds expectations and creates lasting memories.' },
];

const CTA_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80';
const HERO_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80';
const HERO_IMAGE_SECONDARY = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';

const STATS = [
  { number: '200+', label: 'EVENTS PRODUCED' },
  { number: '8', label: 'YEARS OF EXPERIENCE' },
  { number: '5K+', label: 'GUESTS SERVED' },
  { number: '100%', label: 'CLIENT SATISFACTION' },
];

const TESTIMONIALS = [
  { quote: 'Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.', author: 'SARAH & MICHEL', role: 'Wedding, Kigali' },
    { quote: 'Professional, creative, and genuinely passionate. They don\u2019t just plan events \u2014 they create experiences that stay with you.', author: 'DAVID NZAMUHO', role: 'Corporate Summit' },
  { quote: 'The energy they brought to our concert was unreal. From stage design to sound production — absolute perfection.', author: 'JEAN-PASCAL', role: 'Live Show Production' },
];

/* ─── SERVICES PAGE ─── */

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const intro = useIntro();

  useDocumentMeta({
    title: 'Services | Fiesta Agency Rwanda',
    description: 'Explore our comprehensive event services — planning, production, entertainment and more.',
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
      <S07Stats intro={intro} />
      <S03Directory />
      <S04Standard />
      <S05Process />
      <S08Testimonials />
      <S06CTA />
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
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
              }}>OUR SERVICES</p>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F7F4ED',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}>
                {"EVERY DETAIL\nCRAFTED TO\nPERFECTION."}
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
              <div style={{
                width: '50px', height: '2px', backgroundColor: '#D6A54A',
                opacity: intro ? 1 : 0,
                transform: intro ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s',
              }} />
            </div>
          </Reveal>

          {/* Right: Two editorial images */}
          <Reveal delay={0.2} visible={visible}>
            <div className="svc-hero-images" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(8px, 1vw, 12px)',
              overflow: 'hidden',
              minWidth: 0,
            }}>
              <img
                src={HERO_IMAGE}
                alt="Luxury event setup with elegant décor and warm lighting"
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
              <img
                src={HERO_IMAGE_SECONDARY}
                alt="Event production and live audience atmosphere"
                style={{
                  width: '100%',
                  minWidth: 0,
                  height: 'clamp(320px, 38vw, 460px)',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.05)',
                  transition: `transform 1.4s ${E} 0.4s`,
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

/* ─── 02 — FEATURED SERVICES ─── */

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
        {/* Header */}
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>FEATURED SERVICES</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#171717',
              whiteSpace: 'pre-line' as const,
            }}>
              {"EXPERIENCES\nCRAFTED WITH\nINTENTION."}
            </h2>
          </div>
        </Reveal>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(16px, 2vw, 24px)',
        }}
          className="svc-featured-grid"
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '4/5' }} />
            ))
          ) : (
            svcItems.map((service, i) => (
              <FeaturedCard key={service.id} service={service} index={i} visible={visible} delay={0.15 + i * 0.1} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .svc-featured-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .svc-featured-grid::-webkit-scrollbar { display: none; }
          .svc-featured-grid > * {
            flex: 0 0 72% !important;
            scroll-snap-align: start !important;
          }
          .svc-featured-card {
            height: 420px !important;
          }
        }
        @media (max-width: 480px) {
          .svc-featured-card {
            height: 460px !important;
          }
        }
      `}</style>
    </section>
  );
}

function FeaturedCard({ service, index, visible, delay }: {
  service: { id: string; title: string; description: string; image: string };
  index: number;
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="svc-featured-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        height: 'clamp(360px, 34vw, 400px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ${E} ${delay}s, transform 0.7s ${E} ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
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
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#E8E3D9' }} />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(9,9,9,0.05) 0%, rgba(9,9,9,0.7) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(20px, 3vw, 32px)',
      }}>
        <span style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 400,
          fontSize: '0.8rem',
          color: 'rgba(214,165,74,0.6)',
          lineHeight: 1,
          marginBottom: '10px',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
          fontWeight: 400,
          color: '#F7F4ED',
          marginBottom: '8px',
          lineHeight: 1.15,
          whiteSpace: 'pre-line' as const,
        }}>{service.title}</h3>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: 'clamp(0.72rem, 0.85vw, 0.82rem)',
          lineHeight: 1.6,
          color: 'rgba(200,196,188,0.9)',
          maxWidth: '280px',
          marginBottom: '14px',
        }}>{service.description}</p>
        <ArrowRight
          style={{
            color: hovered ? '#D6A54A' : 'rgba(247,244,237,0.35)',
            transform: hovered ? 'translateX(5px)' : 'translateX(0)',
            transition: `transform 0.4s ${E}, color 0.4s ${E}`,
          }}
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* ─── 03 — FULL SERVICE DIRECTORY ─── */

function S03Directory() {
  const { ref, visible } = useReveal({ threshold: 0.05 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
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
        {/* Header */}
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>OUR FULL SERVICES</p>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#F7F4ED',
                whiteSpace: 'pre-line' as const,
                flex: '1 1 400px',
              }}>
                {"MORE EXPERIENCES.\nMORE POSSIBILITIES."}
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#77736B',
                maxWidth: '360px',
                flex: '1 1 300px',
                paddingTop: '8px',
              }}>
                From large-scale productions to intimate gatherings, our full range of services covers every aspect of event creation and management.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Directory Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 4vw, 64px)',
        }}
          className="svc-dir-grid"
        >
          <div>
            {DIRECTORY_LEFT.map((item, i) => (
              <DirRow key={item.id} number={item.number} title={item.title} visible={visible} delay={0.1 + i * 0.05} />
            ))}
          </div>
          <div>
            {DIRECTORY_RIGHT.map((item, i) => (
              <DirRow key={item.id} number={item.number} title={item.title} visible={visible} delay={0.15 + i * 0.05} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .svc-dir-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function DirRow({ number, title, visible, delay }: { number: string; title: string; visible: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        height: 'clamp(58px, 6vw, 72px)',
        borderBottom: '1px solid rgba(247,244,237,0.06)',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transition: `opacity 0.6s ${E} ${delay}s, transform 0.6s ${E} ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 300,
        fontSize: '0.8rem',
        minWidth: '24px',
        color: hovered ? '#D6A54A' : 'rgba(214,165,74,0.4)',
        transition: 'color 0.3s ease',
      }}>{number}</span>
      <span style={{
        fontFamily: "'Manrope', system-ui, sans-serif",
        fontSize: 'clamp(0.88rem, 1.2vw, 1.1rem)',
        fontWeight: 400,
        color: '#F7F4ED',
        letterSpacing: '0.02em',
        whiteSpace: 'pre-line' as const,
        lineHeight: 1.2,
        flex: 1,
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>{title}</span>
      <Plus
        style={{
          color: hovered ? '#D6A54A' : 'rgba(247,244,237,0.12)',
          transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'color 0.3s ease, transform 0.3s ease',
        }}
        size={16}
        strokeWidth={1.5}
      />
    </div>
  );
}

/* ─── 04 — THE FIESTA STANDARD ─── */

function S04Standard() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
        }}
          className="svc-standard-grid"
        >
          {/* Left: Heading + Gold Rule */}
          <div style={{ position: 'relative' }}>
            {/* Gold vertical rule */}
            <div
              className="svc-standard-rule"
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
              }}>THE FIESTA STANDARD</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.75rem, 4.5vw, 3.625rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#151515',
                whiteSpace: 'pre-line' as const,
              }}>
                {"EVERY EVENT\nDESERVES ITS\nOWN STORY."}
              </h2>
            </Reveal>
          </div>

          {/* Right: Body */}
          <Reveal delay={0.15} visible={visible}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.9rem, 1.05vw, 1rem)',
                lineHeight: 1.8,
                color: '#77736B',
                maxWidth: '480px',
              }}>
                We don't believe in copying the same event twice. A wedding should feel like the people getting married. A concert should feel like the artist performing. A corporate gathering should feel like the brand behind it.
              </p>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.9rem, 1.05vw, 1rem)',
                lineHeight: 1.8,
                color: '#77736B',
                maxWidth: '480px',
              }}>
                Our role is to understand the idea first, then build everything around it — creative direction, planning, production, coordination, and flawless execution. Every event deserves its own story, and we are here to tell it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .svc-standard-grid { grid-template-columns: 45% 1fr !important; gap: 48px !important; align-items: start !important; }
          .svc-standard-rule { display: block !important; }
        }
        @media (max-width: 1023px) {
          .svc-standard-rule { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 05 — PROCESS ─── */

function S05Process() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#FFFFFF',
      paddingTop: 'clamp(70px, 9vw, 120px)',
      paddingBottom: 'clamp(70px, 9vw, 120px)',
      overflow: 'hidden',
    }}>
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
              fontSize: 'clamp(2.5rem, 4.2vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#090909',
              whiteSpace: 'pre-line' as const,
            }}>
              {"FROM IDEA TO\nUNFORGETTABLE."}
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
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.id} style={{
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
                backgroundColor: '#FFFFFF',
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
                color: '#77736B',
                maxWidth: '180px',
              }}>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical */}
        <div className="svc-proc-mobile">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.id} style={{
              display: 'flex',
              gap: '20px',
              position: 'relative',
              paddingBottom: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
              {i < PROCESS_STEPS.length - 1 && (
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
                backgroundColor: '#FFFFFF',
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
                  color: '#77736B',
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

/* ─── 07 — STATS ─── */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function S07Stats(_props: { intro?: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
      paddingTop: 'clamp(60px, 8vw, 100px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
      borderTop: '1px solid rgba(247,244,237,0.06)',
      borderBottom: '1px solid rgba(247,244,237,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
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
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.08}s, transform 0.7s ${E} ${0.1 + i * 0.08}s`,
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
                color: 'rgba(247,244,237,0.4)',
              }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .svc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 08 — TESTIMONIALS ─── */

function S08Testimonials() {
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
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
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

/* ─── 06 — CINEMATIC CTA ─── */

function S06CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(320px, 42vh, 420px)',
      width: '100%',
    }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src={CTA_IMAGE}
          alt="Elegant outdoor celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Content */}
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
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2.25rem, 4vw, 3.125rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F7F4ED',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"TELL US WHAT\nYOU'RE IMAGINING."}
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
          <ArrowRight size={16} strokeWidth={2} style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
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

export default Services;
