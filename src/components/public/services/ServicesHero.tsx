import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
}

const DEFAULT_IMAGE = images.hero[0];

export function ServicesHero({ content, intro = true }: { content: unknown; intro?: boolean }) {
  const data = content as ServicesHeroContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });

  const image = data?.image || DEFAULT_IMAGE;
  const eyebrow = data?.eyebrow || 'OUR SERVICES';
  const heading = ((data?.heading as string) || 'EXCEPTIONAL SERVICES FOR UNFORGETTABLE EVENTS.').replace(/\\n/g, '\n');
  const description = (data?.description as string) || 'From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.';

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
                }}>{eyebrow}</p>
              </div>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.85rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F7F4ED',
                marginBottom: '24px',
                whiteSpace: 'pre-line' as const,
                opacity: intro ? 1 : 0,
                transform: intro ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}>
                {heading.includes('EVENTS.') ? (
                  <>EXCEPTIONAL SERVICES FOR UNFORGETTABLE{' '}<span style={{ fontStyle: 'italic', color: '#D6A54A' }}>EVENTS.</span></>
                ) : heading}
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
                {description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2} visible={visible}>
            <div className="svc-hero-images" style={{
              overflow: 'hidden',
              minWidth: 0,
            }}>
              <img
                src={image}
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
