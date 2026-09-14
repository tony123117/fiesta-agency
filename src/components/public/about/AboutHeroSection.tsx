import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HeroContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
  image2?: string;
  image2_alt?: string;
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

export function AboutHeroSection({ content }: { content: Record<string, unknown> }) {
  const c = content as HeroContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const eyebrow = c.eyebrow || 'ABOUT FIESTA';
  const heading = (c.heading || "WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES.").replace(/\\n/g, '\n');
  const body = c.body || 'Fiesta Agency is a creative event company focused on producing unforgettable weddings, concerts, corporate experiences and private celebrations across Rwanda.';
  const image1 = c.image || images.serena[4];
  const image1Alt = c.image_alt || 'Elegant wedding ceremony setup';
  const image2 = c.image2 || images.hero[5];
  const image2Alt = c.image2_alt || 'Event production and lighting';

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
              }}>{eyebrow}</p>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>{heading}</h1>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.7,
                color: '#C8C2B8',
                maxWidth: '420px',
              }}>{body}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15} visible={visible}>
            <div style={{
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(8px, 1vw, 12px)',
            }} className="about-hero-images">
              <img
                src={image1}
                alt={image1Alt}
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
                src={image2}
                alt={image2Alt}
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
