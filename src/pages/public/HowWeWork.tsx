import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const STEPS = [
  { num: '01', title: 'CONSULTATION', description: 'We start with a conversation to understand your vision, goals and expectations.' },
  { num: '02', title: 'PLANNING', description: 'We develop a detailed plan including creative direction, budget and timeline.' },
  { num: '03', title: 'PREPARATION', description: 'We coordinate logistics, vendors and every behind-the-scenes detail.' },
  { num: '04', title: 'EXECUTION', description: 'On the day, we bring everything together and manage every element with precision.' },
  { num: '05', title: 'FOLLOW-UP', description: 'We make sure everything went as planned and gather feedback for future experiences.' },
];

const PRINCIPLES = [
  { num: '01', title: 'CREATIVITY', text: 'Every event deserves its own identity. We approach each project with fresh thinking and original ideas.' },
  { num: '02', title: 'PRECISION', description: 'We obsess over details so you don\'t have to. Every element is planned, checked and perfected.' },
  { num: '03', title: 'COLLABORATION', text: 'Great events are never created alone. We work closely with you at every stage.' },
  { num: '04', title: 'EXCELLENCE', text: 'We don\'t settle for average. Every event we produce reflects our highest standards.' },
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
      <HW06Statement />
      <HW07CTA />
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
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>HOW WE WORK</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5vw, 4.125rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {"A SEAMLESS PROCESS.\nEXCEPTIONAL RESULTS."}
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
                We follow a proven process to ensure every detail is handled with care, creativity and precision, from the first conversation to the final celebration.
              </p>
            </Reveal>
            <Reveal delay={0.2} visible={visible}>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#D6A54A' }} />
            </Reveal>
          </div>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ flex: 1, overflow: 'hidden' }} className="hw-hero-img">
              <img
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80"
                alt="Event production team coordinating behind the scenes"
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
          {/* Left: Image */}
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"
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

          {/* Right: Text */}
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
                fontSize: 'clamp(2.5rem, 4.2vw, 3.375rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>
                {"FROM FIRST IDEA\nTO FINAL MOMENT."}
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
              }}>
                Every event begins with a conversation. We listen, we ask the right questions, and we develop a creative direction that aligns with your vision. From consultation through production to the final moment, we coordinate every detail so you can focus on enjoying the experience.
              </p>
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
        {/* Desktop: Horizontal timeline */}
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

        {/* Mobile: Vertical timeline */}
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
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
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
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F8F5EF',
              whiteSpace: 'pre-line' as const,
            }}>{"BEHIND\nTHE MOMENT."}</h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="hw-behind-grid"
        >
          {/* Large image */}
          <Reveal delay={0.1} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&q=80"
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

          {/* Two stacked images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px, 1.5vw, 20px)' }}
            className="hw-behind-pair"
          >
            <Reveal delay={0.2} visible={visible}>
              <div style={{ overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80"
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
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
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
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
            }}>THE PRINCIPLES<br />BEHIND OUR WORK.</h2>
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
              <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 400,
                fontSize: '0.8rem',
                color: 'rgba(214,165,74,0.5)',
                display: 'block',
                marginBottom: '12px',
              }}>{p.num}</span>
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
              }}>{p.text || p.description}</p>
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

/* ─── 06 — EDITORIAL STATEMENT ─── */

function HW06Statement() {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#FFFFFF',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
      textAlign: 'center' as const,
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
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
          }}>OUR PROMISE</p>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            whiteSpace: 'pre-line' as const,
            marginBottom: '24px',
          }}>
            {"YOU DREAM IT.\nWE BRING IT TO LIFE."}
          </h2>
        </Reveal>
        <Reveal delay={0.12} visible={visible}>
          <p style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
            lineHeight: 1.75,
            color: '#6F6B63',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Whether it&apos;s an intimate dinner or a large-scale production, we bring the same level of care, creativity and precision to every event. Your vision deserves nothing less.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── 07 — CTA ─── */

function HW07CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80"
          alt="Elegant outdoor celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
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
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"PLANNING AN EVENT?\nLET'S MAKE IT HAPPEN."}
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

export default HowWeWork;
