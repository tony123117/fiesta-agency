import { useReveal } from '@/lib/useReveal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesProcessContent {
  heading?: string;
  steps?: Array<{ id: string; number: string; title: string; description: string }>;
}

const DEFAULT_STEPS = [
  { id: '1', number: '01', title: 'IDEA', description: 'We listen to your vision and understand the heart of what you want.' },
  { id: '2', number: '02', title: 'CREATIVE', description: 'We develop a creative direction that brings your idea to life.' },
  { id: '3', number: '03', title: 'PLANNING', description: 'Every detail is mapped out with precision and care.' },
  { id: '4', number: '04', title: 'PRODUCTION', description: 'We execute with expertise, coordination, and flawless timing.' },
  { id: '5', number: '05', title: 'DELIVERY', description: 'The final experience exceeds expectations and creates lasting memories.' },
];

function RevealBlock({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 0.7s ${EASE} ${delay}s, transform 0.7s ${EASE} ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export function ServicesProcess({ content }: { content: unknown }) {
  const data = content as ServicesProcessContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const steps = data?.steps?.length ? data.steps : DEFAULT_STEPS;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 'clamp(70px, 9vw, 120px)',
        paddingBottom: 'clamp(70px, 9vw, 120px)',
      }}
    >
      <div className="svc-proc-container">
        <RevealBlock delay={0} visible={visible}>
          {/* Desktop: Horizontal */}
          <div className="svc-proc-desktop">
            <div className="svc-proc-line" />
            {steps.map((step, i) => (
              <div key={step.id} className="svc-proc-step" style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
                <div className="svc-proc-dot">
                  <span className="svc-proc-num">{step.number}</span>
                </div>
                <h3 className="svc-proc-title">{step.title}</h3>
                <p className="svc-proc-desc">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical */}
          <div className="svc-proc-mobile">
            {steps.map((step, i) => (
              <div key={step.id} className="svc-proc-step-m" style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
                {i < steps.length - 1 && <div className="svc-proc-vline" />}
                <div className="svc-proc-dot">
                  <span className="svc-proc-num">{step.number}</span>
                </div>
                <div className="svc-proc-text-m">
                  <h3 className="svc-proc-title">{step.title}</h3>
                  <p className="svc-proc-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>
      </div>

      <style>{`
        .svc-proc-container {
          width: min(1280px, calc(100vw - 120px));
          margin: 0 auto;
          padding-left: clamp(24px, 4vw, 40px);
          padding-right: clamp(24px, 4vw, 40px);
        }
        .svc-proc-desktop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
        }
        .svc-proc-line {
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          height: 1px;
          background-color: rgba(20,20,20,0.08);
        }
        .svc-proc-step {
          flex: 1;
          position: relative;
        }
        .svc-proc-step:last-child {
          max-width: 180px;
        }
        .svc-proc-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 10;
          background-color: #FFFFFF;
          border: 1px solid rgba(20,20,20,0.08);
        }
        .svc-proc-num {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 400;
          font-size: 0.7rem;
          color: #D6A54A;
        }
        .svc-proc-title {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 12px;
          color: #090909;
        }
        .svc-proc-desc {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 0.8rem;
          line-height: 1.7;
          color: #8D8981;
          max-width: 200px;
        }
        .svc-proc-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .svc-proc-container { width: 100%; padding-left: 24px; padding-right: 24px; }
          .svc-proc-desktop { display: none; }
          .svc-proc-mobile { display: flex; flex-direction: column; }
          .svc-proc-step-m {
            display: flex;
            gap: 20px;
            position: relative;
            padding-bottom: 32px;
          }
          .svc-proc-step-m:last-child { padding-bottom: 0; }
          .svc-proc-vline {
            position: absolute;
            left: 17px;
            top: 36px;
            width: 1px;
            height: calc(100% - 36px);
            background-color: rgba(20,20,20,0.08);
          }
          .svc-proc-step-m .svc-proc-dot { flex-shrink: 0; }
          .svc-proc-text-m { padding-top: 4px; }
          .svc-proc-desc { max-width: 100%; }
        }
        @media (max-width: 1280px) {
          .svc-proc-container { width: calc(100vw - 80px); }
        }
        @media (max-width: 1024px) {
          .svc-proc-container { width: calc(100vw - 64px); }
        }
        @media (max-width: 375px) {
          .svc-proc-container { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>
    </section>
  );
}
