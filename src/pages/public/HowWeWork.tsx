import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const STEPS = [
  { num: '01', title: 'CONSULTATION', description: 'We understand your vision, requirements and expectations.' },
  { num: '02', title: 'PLANNING', description: 'We develop the concept, logistics and detailed event plan.' },
  { num: '03', title: 'PREPARATION', description: 'We coordinate suppliers, production and every necessary detail.' },
  { num: '04', title: 'EXECUTION', description: 'The vision becomes reality through precise coordination and execution.' },
  { num: '05', title: 'FOLLOW-UP', description: 'We review the experience and ensure every detail is properly concluded.' },
];

const PRINCIPLES = [
  { num: '01', title: 'CREATIVITY', text: 'Fresh ideas, distinctive concepts and thoughtful details.' },
  { num: '02', title: 'PRECISION', text: 'Careful planning and attention to every important detail.' },
  { num: '03', title: 'COLLABORATION', text: 'Working closely with clients and partners to bring the vision together.' },
  { num: '04', title: 'EXCELLENCE', text: 'A commitment to delivering memorable experiences.' },
];

/* ─── HOW WE WORK PAGE ─── */

export function HowWeWork() {
  useDocumentMeta({
    title: 'How We Work | Fiesta Agency Rwanda',
    description: 'Discover our five-phase process for planning and producing extraordinary events.',
  });

  return (
    <>
      <HW01Hero />
      <HW02Intro />
      <HW03Process />
      <HW04Behind />
      <HW05Why />
      <HW06CTA />
    </>
  );
}

/* ─── 01 — HERO ─── */

function HW01Hero() {
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
          className="hw-hero-grid"
        >
          <div style={{ flex: '0 0 45%' }} className="hw-hero-text">
            <Reveal delay={0} visible={visible}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '1.5px', backgroundColor: '#D6A54A' }} />
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  color: '#D6A54A',
                }}>HOW WE WORK</p>
              </div>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                A SEAMLESS PROCESS.{' '}
                <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>EXCEPTIONAL RESULTS.</span>
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
                From concept to execution, we handle every detail with precision, creativity and care - so you can focus on what matters most.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ flex: 1, overflow: 'hidden' }} className="hw-hero-img">
              <img
                src={images.process[0]}
                alt="Event production team coordinating behind the scenes"
                style={{
                  width: '100%',
                  height: 'clamp(300px, 28vw, 380px)',
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
          .hw-hero-grid { flex-direction: column !important; }
          .hw-hero-text { flex: none !important; width: 100% !important; }
          .hw-hero-img { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — INTRODUCTION ─── */

function HW02Intro() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="hw-intro-grid"
        >
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={images.process[1]}
                alt="Event planning meeting with creative team"
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.03)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          <div className="hw-intro-text">
            <Reveal delay={0.12} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>THE FIESTA APPROACH</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                marginBottom: '24px',
              }}>
                FROM FIRST IDEA{' '}
                <span style={{ fontStyle: 'italic' }}>TO FINAL MOMENT.</span>
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
                marginBottom: '32px',
              }}>
                Every great event starts with a conversation. We listen, understand your vision, and bring it to life with a detailed plan, trusted partners and flawless execution. From concept development to on-site management, we ensure every detail is handled with precision.
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
                View Our Services
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hw-intro-grid { grid-template-columns: 48% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 03 — FIVE-STEP PROCESS ─── */

function HW03Process() {
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
        <div className="hw-proc-desktop" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '18px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'rgba(0,0,0,0.08)',
          }} />
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
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
                border: '1px solid rgba(0,0,0,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.num}</span>
              </div>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                marginBottom: '12px',
                color: '#161616',
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

        <div className="hw-proc-mobile">
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              display: 'flex',
              gap: '20px',
              position: 'relative',
              paddingBottom: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '17px',
                  top: '36px',
                  width: '1px',
                  height: 'calc(100% - 36px)',
                  backgroundColor: 'rgba(0,0,0,0.08)',
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
                border: '1px solid rgba(0,0,0,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.num}</span>
              </div>
              <div style={{ paddingTop: '4px' }}>
                <h3 style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  marginBottom: '12px',
                  color: '#161616',
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
        .hw-proc-desktop { display: flex; align-items: flex-start; justify-content: space-between; }
        .hw-proc-mobile { display: none; }
        @media (max-width: 768px) {
          .hw-proc-desktop { display: none !important; }
          .hw-proc-mobile { display: flex !important; flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 04 — BEHIND THE SCENES ─── */

function HW04Behind() {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <div>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>BEHIND THE SCENES</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#F8F5EF',
              }}>
                BEHIND{' '}
                <span style={{ fontStyle: 'italic' }}>THE MOMENT.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} visible={visible}>
          <p style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
            lineHeight: 1.7,
            color: '#C8C2B8',
            maxWidth: '400px',
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}>
            It&apos;s not just about what you see. Behind every beautiful event is a dedicated team working with precision, creativity and passion.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}
          className="hw-behind-grid"
        >
          <Reveal delay={0.1} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={images.behind[0]}
                alt="Event setup and stage production preparation"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px, 1.5vw, 20px)' }}
            className="hw-behind-pair"
          >
            <Reveal delay={0.2} visible={visible}>
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={images.bts[0]}
                  alt="Table styling and floral arrangements"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.28} visible={visible}>
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={images.bts[1]}
                  alt="Lighting and sound production setup"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hw-behind-grid { grid-template-columns: 58% 1fr !important; gap: 20px !important; align-items: start !important; }
          .hw-behind-pair { grid-template-rows: auto auto !important; }
        }
        @media (max-width: 1023px) {
          .hw-behind-grid { gap: 16px !important; }
        }
        @media (max-width: 640px) {
          .hw-behind-pair {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hw-behind-pair::-webkit-scrollbar { display: none; }
          .hw-behind-pair > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── 05 — WHY FIESTA ─── */

function HW05Why() {
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
            }}>WHY FIESTA</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
            }}>
              THE PRINCIPLES{' '}
              <span style={{ fontStyle: 'italic' }}>BEHIND OUR WORK.</span>
            </h2>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
        }}
          className="hw-why-grid"
        >
          {PRINCIPLES.map((p, i) => (
            <div key={p.num} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.08}s, transform 0.7s ${E} ${0.1 + i * 0.08}s`,
            }}>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                color: '#161616',
                marginBottom: '10px',
              }}>{p.title}</h3>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: '#6F6B63',
                marginBottom: '16px',
              }}>{p.text}</p>
              <div style={{ width: '32px', height: '1.5px', backgroundColor: '#D6A54A' }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .hw-why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .hw-why-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 20px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hw-why-grid::-webkit-scrollbar { display: none; }
          .hw-why-grid > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── 06 — CTA ─── */

function HW06CTA() {
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
          }}>READY TO START?</p>
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
            PLANNING AN EVENT?{' '}
            <span style={{ fontStyle: 'italic' }}>LET&apos;S MAKE IT HAPPEN.</span>
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
            Get In Touch
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── REVEAL HELPER ─── */

function Reveal({ children, delay = 0, visible }: { children: ReactNode; delay?: number; visible: boolean }) {
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

export default HowWeWork;
