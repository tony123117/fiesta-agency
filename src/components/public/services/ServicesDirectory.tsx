import { useState } from 'react';
import { useReveal } from '@/lib/useReveal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesDirectoryContent {
  heading?: string;
  services?: Array<{ id: string; number: string; title: string }>;
}

const DEFAULT_LEFT = [
  { id: '1', number: '04', title: 'CORPORATE EVENTS' },
  { id: '2', number: '05', title: 'PRIVATE EVENTS & PARTIES' },
  { id: '3', number: '06', title: 'FESTIVALS & PUBLIC EVENTS' },
  { id: '4', number: '07', title: 'DECORATION & BRANDING' },
  { id: '5', number: '08', title: 'SOUND, LIGHTING &\nSTAGE PRODUCTION' },
  { id: '6', number: '09', title: 'DJ & MC COORDINATION' },
];

const DEFAULT_RIGHT = [
  { id: '7', number: '10', title: 'PHOTOGRAPHY & VIDEOGRAPHY' },
  { id: '8', number: '11', title: 'EVENT PROMOTION &\nSOCIAL MEDIA' },
  { id: '9', number: '12', title: 'BIRTHDAYS &\nGRADUATIONS' },
];

export function ServicesDirectory({ content }: { content: unknown }) {
  const data = content as ServicesDirectoryContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.05 });

  const leftServices = data?.services?.length ? data.services.slice(0, 6) : DEFAULT_LEFT;
  const rightServices = data?.services?.length ? data.services.slice(6) : DEFAULT_RIGHT;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#090909',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      <div className="svc-dir-container">
        <div className="svc-dir-grid">
          {/* Left column */}
          <div>
            {leftServices.map((service, i) => (
              <DirectoryRow
                key={service.id}
                number={service.number}
                title={service.title}
                visible={sectionVisible}
                delay={0.1 + i * 0.05}
              />
            ))}
          </div>

          {/* Right column */}
          <div>
            {rightServices.map((service, i) => (
              <DirectoryRow
                key={service.id}
                number={service.number}
                title={service.title}
                visible={sectionVisible}
                delay={0.15 + i * 0.05}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .svc-dir-container {
          width: min(1280px, calc(100vw - 120px));
          margin: 0 auto;
          padding-left: clamp(24px, 4vw, 40px);
          padding-right: clamp(24px, 4vw, 40px);
        }
        .svc-dir-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 4vw, 64px);
        }
        @media (max-width: 1280px) {
          .svc-dir-container { width: calc(100vw - 80px); }
        }
        @media (max-width: 1024px) {
          .svc-dir-container { width: calc(100vw - 64px); }
        }
        @media (max-width: 768px) {
          .svc-dir-container { width: 100%; padding-left: 24px; padding-right: 24px; }
          .svc-dir-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 375px) {
          .svc-dir-container { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>
    </section>
  );
}

function DirectoryRow({
  number,
  title,
  visible,
  delay,
}: {
  number: string;
  title: string;
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="svc-dir-row"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transition: `opacity 0.6s ${EASE} ${delay}s, transform 0.6s ${EASE} ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="svc-dir-num"
        style={{ color: hovered ? '#D6A54A' : 'rgba(214,165,74,0.4)' }}
      >
        {number}
      </span>
      <span
        className="svc-dir-title"
        style={{
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        {title}
      </span>
      <span
        className="svc-dir-plus"
        style={{
          color: hovered ? '#D6A54A' : 'rgba(245,242,234,0.15)',
          transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        +
      </span>

      <style>{`
        .svc-dir-row {
          display: flex;
          align-items: center;
          gap: 20px;
          height: clamp(58px, 6vw, 75px);
          border-bottom: 1px solid rgba(245,242,234,0.06);
          cursor: default;
        }
        .svc-dir-num {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 300;
          font-size: 0.75rem;
          min-width: 24px;
          transition: color 0.3s ease;
        }
        .svc-dir-title {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(0.88rem, 1.2vw, 1.1rem);
          font-weight: 400;
          color: #F5F2EA;
          letter-spacing: 0.02em;
          white-space: pre-line;
          line-height: 1.2;
          flex: 1;
          transition: transform 0.3s ease;
        }
        .svc-dir-plus {
          font-family: 'Manrope', system-ui, sans-serif;
          font-weight: 300;
          font-size: 1rem;
          transition: color 0.3s ease, transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
