import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';
// Image URLs from Supabase Storage (uploaded via admin)
const ABOUT_IMAGES = {
  process: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG'
  ],
  intimate: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG'
  ],
  bts: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG'
  ],
  lagoon: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG'
  ],
  blacktie: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237092060-8sq54jcdwr8.JPG'
  ],
  garden: [
    'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG'
  ]
};

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const VALUES = [
  { num: '01', title: 'CREATIVITY', text: 'Every event is a blank canvas. We bring fresh thinking and original ideas to every project.' },
  { num: '02', title: 'EXCELLENCE', text: 'We don\'t settle for average. Every detail is refined until it reaches our highest standard.' },
  { num: '03', title: 'INTEGRITY', text: 'Transparent communication, honest pricing, and genuine care for every client relationship.' },
  { num: '04', title: 'PASSION', text: 'We love what we do. That energy translates into events that feel alive and memorable.' },
];

const TEAM = [
  { name: 'Jean-Paul Habimana', role: 'Founder & Creative Director', image: ABOUT_IMAGES.process[0] },
  { name: 'Alice Uwimana', role: 'Head of Production', image: ABOUT_IMAGES.intimate[4] },
  { name: 'David Niyonzima', role: 'Event Coordinator', image: ABOUT_IMAGES.bts[3] },
  { name: 'Grace Mukamana', role: 'Design Lead', image: ABOUT_IMAGES.lagoon[7] },
  { name: 'Samuel Bizimana', role: 'Technical Director', image: ABOUT_IMAGES.process[1] },
];

/* ─── ABOUT PAGE ─── */

export function About() {
  useDocumentMeta({
    title: 'About Fiesta Agency | Rwanda',
    description: 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences across Rwanda.',
  });

  return (
    <>
      <A01Hero />
      <A02Story />
      <A03Mission />
      <A04Values />
      <A05Team />
      <A06CTA />
    </>
  );
}

/* ─── 01 — HERO ─── */

function A01Hero() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

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
        <div className="about-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'center',
        }}>
          {/* Left: Text */}
          <Reveal delay={0} visible={visible}>
            <div style={{ maxWidth: '560px' }}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>ABOUT FIESTA</p>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>
                {"WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES."}
              </h1>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.7,
                color: '#C8C2B8',
                maxWidth: '420px',
              }}>
                Fiesta Agency is a creative event company focused on producing unforgettable weddings, concerts, corporate experiences and private celebrations across Rwanda.
              </p>
            </div>
          </Reveal>

          {/* Right: Image — editorial crop */}
          <Reveal delay={0.15} visible={visible}>
            <div style={{
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(8px, 1vw, 12px)',
            }} className="about-hero-images">
              <img
                src={images.serena[2]}
                alt="Elegant wedding ceremony setup"
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.05)',
                  transition: `transform 1.2s ${E} 0.2s`,
                }}
                loading="eager"
              />
              <img
                src={images.bts[2]}
                alt="Event production and lighting"
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.05)',
                  transition: `transform 1.2s ${E} 0.35s`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-hero-grid { grid-template-columns: 55% 1fr !important; }
        }
        @media (max-width: 767px) {
          .about-hero-images { max-height: 360px; overflow: hidden; }
          .about-hero-images img { height: 360px; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — STORY ─── */

function A02Story() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 140px)',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div className="about-story-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'center',
        }}>
          {/* Large image */}
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={images.behind[1]}
                alt="Fiesta team coordinating event production behind the scenes"
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.03)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Text — editorial offset */}
          <div className="about-story-text" style={{ maxWidth: '520px' }}>
            <Reveal delay={0.1} visible={visible}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '1px', backgroundColor: '#D6A54A' }} />
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  color: '#D6A54A',
                }}>OUR STORY</p>
              </div>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>
                {"FROM A SINGLE IDEA\nTO A REGIONAL\nLEADER."}
              </h2>
            </Reveal>
            <Reveal delay={0.18} visible={visible}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                  lineHeight: 1.8,
                  color: '#6F6B63',
                }}>
                  Fiesta started with a simple belief: every gathering deserves to feel extraordinary. What began as a small event coordination effort has grown into one of Rwanda&apos;s most trusted creative event agencies.
                </p>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                  lineHeight: 1.8,
                  color: '#6F6B63',
                }}>
                  We&apos;ve produced weddings that make people cry, concerts that make people dance until sunrise, and corporate events that inspire entire organizations. Our work speaks for itself — and our clients come back because they trust us to deliver.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-story-grid { grid-template-columns: 58% 1fr !important; }
          .about-story-text { padding-left: 16px; }
        }
      `}</style>
    </section>
  );
}

/* ─── 03 — MISSION / VISION ─── */

function A03Mission() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

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
        {/* Two-column: mission + vision */}
        <div className="about-mv-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(48px, 6vw, 80px)',
        }}>
          {/* Mission */}
          <Reveal delay={0} visible={visible}>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#D6A54A',
              }} />
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '16px',
              }}>OUR MISSION</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.05,
                fontWeight: 400,
                color: '#161616',
                marginBottom: '16px',
              }}>
                TURN IDEAS INTO<br />WELL-CRAFTED<br />EXPERIENCES.
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
              }}>
                We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.
              </p>
            </div>
          </Reveal>

          {/* Vision */}
          <Reveal delay={0.12} visible={visible}>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'rgba(214,165,74,0.3)',
              }} />
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '16px',
              }}>OUR VISION</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.05,
                fontWeight: 400,
                color: '#161616',
                marginBottom: '16px',
              }}>
                BUILDING A TRUSTED<br />CREATIVE EVENT<br />COMPANY.
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
              }}>
                Creating experiences people remember. Growing across the region. Becoming the name people think of when they imagine an extraordinary event.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-mv-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 04 — VALUES ─── */

function A04Values() {
  const { ref, visible } = useReveal({ threshold: 0.06 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
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
          <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>OUR VALUES</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F8F5EF',
              whiteSpace: 'pre-line' as const,
            }}>THE PRINCIPLES<br />BEHIND OUR WORK.</h2>
          </div>
        </Reveal>

        <div className="about-values-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
          alignItems: 'center',
        }}>
          {VALUES.map((v, i) => (
            <div key={v.num} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.08}s, transform 0.7s ${E} ${0.1 + i * 0.08}s`,
            }}>
              <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 400,
                fontSize: '0.8rem',
                color: 'rgba(214,165,74,0.4)',
                display: 'block',
                marginBottom: '12px',
                textAlign: 'center',
              }}>{v.num}</span>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                color: '#F8F5EF',
                marginBottom: '10px',
              }}>{v.title}</h3>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: 'rgba(248,245,239,0.45)',
                marginBottom: '16px',
              }}>{v.text}</p>
              <div style={{ width: '28px', height: '1.5px', backgroundColor: '#D6A54A' }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .about-values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .about-values-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 20px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .about-values-grid::-webkit-scrollbar { display: none; }
          .about-values-grid > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── 05 — TEAM ─── */

function A05Team() {
  const { ref, visible } = useReveal({ threshold: 0.06 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
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
            }}>THE TEAM</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
            }}>THE PEOPLE BEHIND<br />THE MAGIC.</h2>
          </div>
        </Reveal>

        <div className="about-team-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          {TEAM.map((member, i) => (
            <div key={member.name} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.06}s, transform 0.7s ${E} ${0.1 + i * 0.06}s`,
            }}>
              <div style={{
                overflow: 'hidden',
                marginBottom: '12px',
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(0.2)',
                    transition: 'filter 0.5s ease, transform 0.5s ease',
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <h4 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#161616',
                marginBottom: '2px',
              }}>{member.name}</h4>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.58rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                color: '#9A9792',
              }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .about-team-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) {
          .about-team-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .about-team-grid::-webkit-scrollbar { display: none; }
          .about-team-grid > * {
            flex: 0 0 60% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── 06 — CTA ─── */

function A06CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={images.hero[5]}
          alt="Elegant outdoor celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
      }} />
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center' as const,
        paddingLeft: 'clamp(24px, 4vw, 40px)', paddingRight: 'clamp(24px, 4vw, 40px)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s ${E} 0.1s, transform 0.9s ${E} 0.1s`,
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"READY TO CREATE\nSOMETHING EXTRAORDINARY?"}
        </h2>
        <Link
          to="/contact"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '32px',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.7rem', fontWeight: 600,
            textTransform: 'uppercase' as const, letterSpacing: '0.14em',
            color: '#D6A54A', textDecoration: 'none', transition: 'color 0.3s ease',
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

export default About;
