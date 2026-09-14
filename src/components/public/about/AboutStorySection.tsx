import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface StoryContent {
  eyebrow?: string;
  heading?: string;
  paragraphs?: string[];
  image?: string;
  image_alt?: string;
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

export function AboutStorySection({ content }: { content: Record<string, unknown> }) {
  const c = content as StoryContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const eyebrow = c.eyebrow || 'OUR STORY';
  const heading = (c.heading || "FROM A SINGLE IDEA\nTO A REGIONAL\nLEADER.").replace(/\\n/g, '\n');
  const paragraphs = c.paragraphs?.length
    ? c.paragraphs
    : [
        "Fiesta started with a simple belief: every gathering deserves to feel extraordinary. What began as a small event coordination effort has grown into one of Rwanda's most trusted creative event agencies.",
        "We've produced weddings that make people cry, concerts that make people dance until sunrise, and corporate events that inspire entire organizations. Our work speaks for itself — and our clients come back because they trust us to deliver.",
      ];
  const image = c.image || images.behind[2];
  const imageAlt = c.image_alt || 'Fiesta team coordinating event production behind the scenes';

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
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={image}
                alt={imageAlt}
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
                }}>{eyebrow}</p>
              </div>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '24px',
              }}>{heading}</h2>
            </Reveal>
            <Reveal delay={0.18} visible={visible}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {paragraphs.map((p, i) => (
                  <p key={i} style={{
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                    lineHeight: 1.8,
                    color: '#6F6B63',
                  }}>{p}</p>
                ))}
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
