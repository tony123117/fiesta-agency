import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ContactCTAContent {
  heading?: string;
  background_image?: string;
  background_image_alt?: string;
}

export function ContactCTA({ content }: { content: unknown }) {
  const data = content as ContactCTAContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });
  const heading = (data?.heading || "READY TO START?\nWE'RE ALL EARS.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={data?.background_image || ''}
          alt={data?.background_image_alt || "Beautiful outdoor celebration setup with ambient lighting"}
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
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {parts.length > 1 ? <>{parts[0]} <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span></> : heading}
        </h2>
      </div>
    </section>
  );
}
