import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface HWWProcessContent { eyebrow?: string; heading?: string; steps?: Array<{ num: string; title: string; description: string }> }

const DEFAULT_STEPS = [
  { num: '01', title: 'CONSULTATION', description: 'We understand your vision, requirements and expectations.' },
  { num: '02', title: 'PLANNING', description: 'We develop the concept, logistics and detailed event plan.' },
  { num: '03', title: 'PREPARATION', description: 'We coordinate suppliers, production and every necessary detail.' },
  { num: '04', title: 'EXECUTION', description: 'The vision becomes reality through precise coordination and execution.' },
  { num: '05', title: 'FOLLOW-UP', description: 'We review the experience and ensure every detail is properly concluded.' },
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

export function HWWProcess({ content }: { content: unknown }) {
  const data = content as HWWProcessContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const steps = data?.steps?.length ? data.steps : DEFAULT_STEPS;
  const heading = (data?.heading || 'OUR PROVEN\nFIVE-PHASE PROCESS.').replace(/\\n/g, '\n');
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
          }}>{data?.eyebrow || 'OUR PROCESS'}</p>
        </Reveal>
        <Reveal delay={0.08} visible={visible}>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 0.95,
            fontWeight: 400,
            color: '#161616',
            whiteSpace: 'pre-line' as const,
            marginBottom: 'clamp(40px, 5vw, 64px)',
          }}>
            {parts[0]}{' '}
            <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span>
          </h2>
        </Reveal>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '18px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }} className="hww-process-line" />
          <div className="hww-process-grid" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: 'clamp(16px, 2vw, 24px)',
          }}>
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={0.1 + i * 0.06} visible={visible}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: '#FFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}>
                    <span style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 400,
                      fontSize: '0.75rem',
                      color: '#D6A54A',
                    }}>{step.num}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.14em',
                    marginBottom: '12px',
                    color: '#161616',
                  }}>{step.title}</h3>
                  <p style={{
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    fontSize: '0.82rem',
                    lineHeight: 1.7,
                    color: '#6F6B63',
                    maxWidth: '180px',
                  }}>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hww-process-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hww-process-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}
