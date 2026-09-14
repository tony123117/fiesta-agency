import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ContactHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
  image_alt?: string;
}

export function ContactHero({ content }: { content: unknown }) {
  const data = content as ContactHeroContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });
  const heading = (data?.heading || "LET'S MAKE\nYOUR NEXT EVENT\nEXTRAORDINARY.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');

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
          className="contact-hero-grid"
        >
          <div style={{ flex: '0 0 45%' }} className="contact-hero-text">
            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${E}, transform 0.8s ${E}`,
            }}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>{data?.eyebrow || 'GET IN TOUCH'}</p>
            </div>
            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${E} 0.08s, transform 0.8s ${E} 0.08s`,
            }}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {parts.length > 1 ? <>{parts[0]} <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>{parts.slice(1).join('\n')}</span></> : heading}
              </h1>
            </div>
            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${E} 0.14s, transform 0.8s ${E} 0.14s`,
            }}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C8C2B8',
                maxWidth: '390px',
                marginBottom: '32px',
              }}>
                {data?.description || "Whether you have a clear vision or just the beginning of an idea, we're here to help bring it to life. Let's start a conversation."}
              </p>
            </div>
            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${E} 0.2s, transform 0.8s ${E} 0.2s`,
            }}>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#D6A54A' }} />
            </div>
          </div>

          <div style={{
            flex: 1,
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(22px)',
            transition: `opacity 0.8s ${E} 0.12s, transform 0.8s ${E} 0.12s`,
          }} className="contact-hero-img">
            <img
              src={data?.image || ''}
              alt={data?.image_alt || "Elegant event setup with warm lighting"}
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
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .contact-hero-grid { flex-direction: column !important; }
          .contact-hero-text { flex: none !important; width: 100% !important; }
          .contact-hero-img { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
