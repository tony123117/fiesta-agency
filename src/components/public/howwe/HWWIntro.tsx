import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';
import { ArrowRight } from 'lucide-react';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWIntroContent { eyebrow?: string; heading?: string; description?: string; image?: string; image_alt?: string; link_text?: string; link_url?: string; }

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

export function HWWIntro({ content }: { content: unknown }) {
  const data = content as HWWIntroContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const heading = (data?.heading || 'FROM FIRST IDEA\nTO FINAL MOMENT.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');
  const image = data?.image || images.process[1];

  return (
    <section ref={ref} style={{ backgroundColor: '#F1EDE3' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 130px)',
      }}>
        <div className="hww-intro-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'center',
        }}>
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={image}
                alt={data?.image_alt || 'Fiesta event planning approach'}
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E} 0.15s`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>{data?.eyebrow || 'THE FIESTA APPROACH'}</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>
                {parts[0]}{' '}
                <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
                marginBottom: '32px',
              }}>{data?.description || 'Every great event starts with a conversation. We listen, we imagine, and then we craft every detail to match your vision — blending creativity with precision to deliver something truly memorable.'}</p>
            </Reveal>
            <Reveal delay={0.2} visible={visible}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                color: '#D6A54A',
              }}>
                {data?.link_text || 'View Our Services'} <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hww-intro-grid { grid-template-columns: 48% 1fr !important; }
        }
      `}</style>
    </section>
  );
}
