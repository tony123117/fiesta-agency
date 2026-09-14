import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesProcessContent {
  eyebrow?: string;
  heading?: string;
  steps?: Array<{ number: string; title: string; description: string }>;
}

const DEFAULT_STEPS = [
  { number: '01', title: 'DISCOVER', description: 'We listen to your vision and understand the heart of what you want.' },
  { number: '02', title: 'DESIGN', description: 'We develop a creative direction that brings your idea to life.' },
  { number: '03', title: 'PLAN', description: 'Every detail is mapped out with precision and care.' },
  { number: '04', title: 'PRODUCE', description: 'We execute with expertise, coordination, and flawless timing.' },
  { number: '05', title: 'DELIVER', description: 'The final experience exceeds expectations and creates lasting memories.' },
];

export function ServicesProcess({ content }: { content: unknown }) {
  const data = content as ServicesProcessContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const eyebrow = (data?.eyebrow as string) || 'HOW WE BRING IT TO LIFE';
  const heading = ((data?.heading as string) || 'FROM IDEA TO UNFORGETTABLE.').replace(/\\n/g, '\n');
  const steps = data?.steps?.length ? data.steps : DEFAULT_STEPS;

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(70px, 9vw, 120px)',
      paddingBottom: 'clamp(70px, 9vw, 120px)',
      overflow: 'hidden',
    }} className="grain">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>{eyebrow}</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#090909',
            }}>
              {heading.includes('UNFORGETTABLE.') ? (
                <>FROM IDEA TO{' '}<span style={{ fontStyle: 'italic' }}>UNFORGETTABLE.</span></>
              ) : heading}
            </h2>
          </div>
        </Reveal>

        <div className="svc-proc-desktop" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '18px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'rgba(20,20,20,0.08)',
          }} />
          {steps.map((step, i) => (
            <div key={step.number} style={{
              flex: 1,
              position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
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
                backgroundColor: '#F1EDE3',
                border: '1px solid rgba(20,20,20,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.number}</span>
              </div>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                marginBottom: '12px',
                color: '#090909',
              }}>{step.title}</h3>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: '#6F6B63',
                maxWidth: '180px',
              }}>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="svc-proc-mobile">
          {steps.map((step, i) => (
            <div key={step.number} style={{
              display: 'flex',
              gap: '20px',
              position: 'relative',
              paddingBottom: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.1}s, transform 0.7s ${E} ${0.1 + i * 0.1}s`,
            }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '17px',
                  top: '36px',
                  width: '1px',
                  height: 'calc(100% - 36px)',
                  backgroundColor: 'rgba(20,20,20,0.08)',
                }} />
              )}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#F1EDE3',
                border: '1px solid rgba(20,20,20,0.08)',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#D6A54A',
                }}>{step.number}</span>
              </div>
              <div style={{ paddingTop: '4px' }}>
                <h3 style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  marginBottom: '12px',
                  color: '#090909',
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: '#6F6B63',
                }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .svc-proc-desktop { display: flex; align-items: flex-start; justify-content: space-between; }
        .svc-proc-mobile { display: none; }
        @media (max-width: 768px) {
          .svc-proc-desktop { display: none !important; }
          .svc-proc-mobile { display: flex !important; flex-direction: column !important; }
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
