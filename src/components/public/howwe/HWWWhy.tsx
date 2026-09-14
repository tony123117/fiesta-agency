import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWWhyContent { eyebrow?: string; heading?: string; principles?: Array<{ num: string; title: string; text: string }> }

const DEFAULTS = [
  { num: '01', title: 'CREATIVITY', text: 'Fresh ideas, distinctive concepts and thoughtful details.' },
  { num: '02', title: 'PRECISION', text: 'Careful planning and attention to every important detail.' },
  { num: '03', title: 'COLLABORATION', text: 'Working closely with clients and partners to bring the vision together.' },
  { num: '04', title: 'EXCELLENCE', text: 'A commitment to delivering memorable experiences.' },
];

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

export function HWWWhy({ content }: { content: unknown }) {
  const data = content as HWWWhyContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const items = data?.principles?.length ? data.principles : DEFAULTS;
  const heading = (data?.heading || 'THE PRINCIPLES\nBEHIND OUR WORK.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section ref={ref} style={{ backgroundColor: '#FFFFFF' }}>
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
          }}>{data?.eyebrow || 'WHY FIESTA'}</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            whiteSpace: 'pre-line' as const,
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}>
            {parts[0]}{' '}
            <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span>
          </h2>
        </Reveal>

        <div className="hww-why-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
        }}>
          {items.map((p, i) => (
            <Reveal key={p.num} delay={0.12 + i * 0.06} visible={visible}>
              <div>
                <h3 style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.12em',
                  color: '#161616',
                  marginBottom: '10px',
                }}>{p.title}</h3>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: '#6F6B63',
                  marginBottom: '16px',
                }}>{p.text}</p>
                <div style={{ width: '32px', height: '1.5px', backgroundColor: '#D6A54A' }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hww-why-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
