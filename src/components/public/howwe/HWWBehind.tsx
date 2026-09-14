import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWBehindContent { eyebrow?: string; heading?: string; description?: string; images?: string[]; }

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

const FALLBACK_IMGS = [images.behind[0], images.bts[0], images.bts[1]];

export function HWWBehind({ content }: { content: unknown }) {
  const data = content as HWWBehindContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const rawImgs = data?.images;
  const imgs = (Array.isArray(rawImgs) && rawImgs.length >= 3 && rawImgs.every((u: string) => typeof u === 'string' && u.startsWith('http')))
    ? rawImgs
    : FALLBACK_IMGS;
  const heading = (data?.heading || 'BEHIND\nTHE MOMENT.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section ref={ref} style={{ backgroundColor: '#090909' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 130px)',
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
          }}>{data?.eyebrow || 'BEHIND THE SCENES'}</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#F8F5EF',
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
            lineHeight: 1.7,
            color: '#C8C2B8',
            maxWidth: '400px',
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}>{data?.description || "It's not just about what you see — it's about the care, coordination and craft that goes into every moment."}</p>
        </Reveal>

        <div className="hww-behind-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(12px, 1.5vw, 20px)',
          alignItems: 'start',
        }}>
          <Reveal delay={0.1} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={imgs[0]}
                alt="Behind the scenes main"
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E} 0.2s`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
          <div className="hww-behind-pair" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(8px, 1vw, 16px)',
          }}>
            <Reveal delay={0.16} visible={visible}>
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={imgs[1]}
                  alt="Behind the scenes detail"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block',
                    transform: visible ? 'scale(1)' : 'scale(1.04)',
                    transition: `transform 1.2s ${E} 0.3s`,
                  }}
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={0.22} visible={visible}>
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={imgs[2]}
                  alt="Behind the scenes detail"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    display: 'block',
                    transform: visible ? 'scale(1)' : 'scale(1.04)',
                    transition: `transform 1.2s ${E} 0.4s`,
                  }}
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hww-behind-grid { grid-template-columns: 58% 1fr !important; }
        }
      `}</style>
    </section>
  );
}
