import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesCTAContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
}

export function ServicesCTA({ content }: { content: unknown }) {
  const data = content as ServicesCTAContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });

  const eyebrow = (data?.eyebrow as string) || 'LET\'S CREATE SOMETHING EXTRAORDINARY';
  const heading = ((data?.heading as string) || 'Your Vision. Our Expertise.').replace(/\\n/g, '\n');
  const description = (data?.description as string) || 'Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.';
  const buttonText = (data?.button_text as string) || 'Book Your Event';
  const buttonUrl = (data?.button_url as string) || '/contact';

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 120px)',
      paddingBottom: 'clamp(80px, 10vw, 120px)',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        textAlign: 'center' as const,
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
          }}>{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            marginBottom: '16px',
          }}>
            {heading.includes('Expertise.') ? (
              <>Your Vision. Our{' '}<span style={{ fontStyle: 'italic' }}>Expertise.</span></>
            ) : heading}
          </h2>
        </Reveal>
        <Reveal delay={0.14} visible={visible}>
          <p style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
            lineHeight: 1.7,
            color: '#6F6B63',
            maxWidth: '480px',
            margin: '0 auto 32px',
          }}>
            {description}
          </p>
        </Reveal>
        <Reveal delay={0.2} visible={visible}>
          <Link
            to={buttonUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '0.7rem',
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
            {buttonText}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </Reveal>
      </div>
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
