import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ContactLocationContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
  image_alt?: string;
}

export function ContactLocation({ content }: { content: unknown }) {
  const data = content as ContactLocationContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });
  const heading = (data?.heading || "OUR\nOFFICE.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="contact-location-grid"
        >
          <div className="contact-location-text">
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
              }}>{data?.eyebrow || 'VISIT US'}</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '20px',
              }}>
                {parts.length > 1 ? <>{parts[0]} <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span></> : heading}
              </h2>
            </div>

            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${E} 0.12s, transform 0.8s ${E} 0.12s`,
            }}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                marginBottom: '24px',
              }}>
                {data?.description || "We welcome visits by appointment. Reach out to schedule a meeting at our office to discuss your event in person."}
              </p>
              <div style={{ width: '32px', height: '1.5px', backgroundColor: '#D6A54A' }} />
            </div>
          </div>

          <div style={{
            overflow: 'hidden',
            backgroundColor: '#F1EDE3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: '16/10',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(22px)',
            transition: `opacity 0.8s ${E} 0.1s, transform 0.8s ${E} 0.1s`,
          }}>
            <img
              src={data?.image || ''}
              alt={data?.image_alt || "Map showing Fiesta Agency office location in Kigali"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: 0.6,
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .contact-location-grid { grid-template-columns: 38% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}
