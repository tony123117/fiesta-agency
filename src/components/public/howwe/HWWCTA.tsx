import { useReveal } from '@/lib/useReveal';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWCTAContent { eyebrow?: string; heading?: string; description?: string; button_text?: string; button_url?: string; }

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

export function HWWCTA({ content }: { content: unknown }) {
  const data = content as HWWCTAContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });
  const heading = (data?.heading || "PLANNING AN EVENT?\nLET'S MAKE IT HAPPEN.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section ref={ref} style={{ backgroundColor: '#F1EDE3' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 130px)',
        textAlign: 'center',
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
          }}>{data?.eyebrow || 'READY TO START?'}</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            whiteSpace: 'pre-line' as const,
            marginBottom: '16px',
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
            color: '#6F6B63',
            maxWidth: '480px',
            margin: '0 auto 32px',
          }}>{data?.description || 'Let us help you design and execute an event that reflects your vision and exceeds your expectations.'}</p>
        </Reveal>
        <Reveal delay={0.2} visible={visible}>
          <Link
            to={data?.button_url || '/contact'}
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
              transition: 'gap 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = '16px'; }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = '12px'; }}
          >
            {data?.button_text || 'Get In Touch'} <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
