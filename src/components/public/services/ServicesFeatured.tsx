import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesFeaturedContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
  label?: string;
  label_text?: string;
  link_text?: string;
}

const DEFAULT_IMAGE = images.blacktie[2];

export function ServicesFeatured({ content, loading = false }: { content: unknown; loading?: boolean }) {
  const data = content as ServicesFeaturedContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });

  const eyebrow = (data?.eyebrow as string) || 'WHAT WE OFFER';
  const heading = ((data?.heading as string) || 'Experiences Crafted With Intentions.').replace(/\\n/g, '\n');
  const description = (data?.description as string) || 'Every event is unique. We listen, design, and deliver experiences that reflect your vision and exceed expectations.';
  const image = (data?.image as string) || DEFAULT_IMAGE;
  const label = (data?.label as string) || 'EVENT PLANNING';
  const labelText = (data?.label_text as string) || 'Full-service event planning tailored to your vision and goals.';
  const linkText = (data?.link_text as string) || 'Explore Our Services';

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
              }}>{eyebrow}</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#171717',
                marginBottom: '20px',
              }}>
                {heading.includes('Intentions.') ? (
                  <>Experiences Crafted With{' '}<span style={{ fontStyle: 'italic' }}>Intentions.</span></>
                ) : heading}
              </h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.7,
                color: '#6F6B63',
                maxWidth: '400px',
                marginBottom: '32px',
              }}>
                {description}
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
                {linkText}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {loading ? (
                <div className="skeleton" style={{ aspectRatio: '16/10' }} />
              ) : (
                <>
                  <img
                    src={image}
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
                    }}>{label}</span>
                    <p style={{
                      fontFamily: "'Manrope', system-ui, sans-serif",
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      color: 'rgba(248,245,239,0.85)',
                      maxWidth: '320px',
                    }}>{labelText}</p>
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
