import { useReveal } from '@/lib/useReveal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesPhilosophyContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
}

function RevealBlock({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export function ServicesPhilosophy({ content }: { content: unknown }) {
  const data = content as ServicesPhilosophyContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = (data?.heading || "EVERY EVENT\nDESERVES ITS\nOWN STORY.").replace(/\\n/g, '\n');
  const body = (data?.body || "We don't believe in copying the same event twice.\n\nA wedding should feel like the people getting married.\nA concert should feel like the artist performing.\nA corporate gathering should feel like the brand behind it.\n\nOur role is to understand the idea first, then build everything around it.").replace(/\\n/g, '\n');

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#F5F2EA',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      <div className="svc-phil-container">
        <div className="svc-phil-grid">
          {/* Left: Gold rule */}
          <div className="svc-phil-rule-wrap">
            <div
              className="svc-phil-rule"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.8s ease 0.2s',
              }}
            />
          </div>

          {/* Left: Heading */}
          <div className="svc-phil-heading">
            <RevealBlock delay={0} visible={visible}>
              <p className="svc-eyebrow">{data?.eyebrow || 'THE FIESTA STANDARD'}</p>
              <h2 className="svc-phil-heading-text">{heading}</h2>
            </RevealBlock>
          </div>

          {/* Right: Body */}
          <div className="svc-phil-body">
            <RevealBlock delay={0.15} visible={visible}>
              <div className="svc-phil-paragraphs">
                {body.split('\n\n').map((para, i) => (
                  <p key={i} className="svc-phil-para">{para}</p>
                ))}
              </div>
            </RevealBlock>
          </div>
        </div>
      </div>

      <style>{`
        .svc-phil-container {
          width: min(1280px, calc(100vw - 120px));
          margin: 0 auto;
          padding-left: clamp(24px, 4vw, 40px);
          padding-right: clamp(24px, 4vw, 40px);
        }
        .svc-phil-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 1024px) {
          .svc-phil-grid {
            grid-template-columns: 45% 1fr;
            gap: 48px;
            align-items: start;
          }
        }
        .svc-phil-rule-wrap {
          display: none;
        }
        @media (min-width: 1024px) {
          .svc-phil-rule-wrap {
            display: block;
            position: absolute;
            left: calc(45% - 24px - 1px);
            top: 0;
            bottom: 0;
          }
          .svc-phil-rule {
            width: 1px;
            height: 100%;
            background-color: #D6A54A;
          }
        }
        .svc-eyebrow {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          color: #D6A54A;
          margin-bottom: 20px;
        }
        .svc-phil-heading-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.75rem, 4.5vw, 4.25rem);
          line-height: 0.95;
          font-weight: 400;
          color: #151515;
          white-space: pre-line;
        }
        .svc-phil-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .svc-phil-para {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(0.9rem, 1.05vw, 1rem);
          line-height: 1.8;
          color: #8D8981;
          max-width: 480px;
        }
        @media (max-width: 1280px) {
          .svc-phil-container { width: calc(100vw - 80px); }
        }
        @media (max-width: 1024px) {
          .svc-phil-container { width: calc(100vw - 64px); }
        }
        @media (max-width: 768px) {
          .svc-phil-container { width: 100%; padding-left: 24px; padding-right: 24px; }
        }
        @media (max-width: 375px) {
          .svc-phil-container { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>
    </section>
  );
}
