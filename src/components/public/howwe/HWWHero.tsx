import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWHeroContent { eyebrow?: string; heading?: string; description?: string; image?: string; image_alt?: string; }

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

export function HWWHero({ content }: { content: unknown }) {
  const data = content as HWWHeroContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });
  const heading = (data?.heading || 'A SEAMLESS PROCESS.\nEXCEPTIONAL RESULTS.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');
  const description = data?.description || 'From concept to execution, we handle every detail with precision, creativity and care — so you can focus on what matters most.';
  const image = data?.image || images.process[0];

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
        <div className="hww-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'flex-start',
        }}>
          <div style={{ maxWidth: '520px' }}>
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>{data?.eyebrow || 'HOW WE WORK'}</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>
                {parts[0]}{' '}
                <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>{parts.slice(1).join('\n')}</span>
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
              }}>{description}</p>
            </Reveal>
            <Reveal delay={0.2} visible={visible}>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#D6A54A' }} />
            </Reveal>
          </div>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ overflow: 'hidden' }} className="hww-hero-img">
              <img
                src={image}
                alt={data?.image_alt || 'Event planning process'}
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
        @media (min-width: 768px) {
          .hww-hero-grid { grid-template-columns: 45% 1fr !important; }
        }
      `}</style>
    </section>
  );
}
