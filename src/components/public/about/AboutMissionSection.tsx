import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface MissionContent {
  mission_heading?: string;
  mission_body?: string;
  vision_heading?: string;
  vision_body?: string;
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

export function AboutMissionSection({ content }: { content: Record<string, unknown> }) {
  const c = content as MissionContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const missionHeading = (c.mission_heading || 'TURN IDEAS INTO\nWELL-CRAFTED\nEXPERIENCES.').replace(/\\n/g, '\n');
  const missionBody = c.mission_body || 'We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.';
  const visionHeading = (c.vision_heading || 'BUILDING A TRUSTED\nCREATIVE EVENT\nCOMPANY.').replace(/\\n/g, '\n');
  const visionBody = c.vision_body || 'Creating experiences people remember. Growing across the region. Becoming the name people think of when they imagine an extraordinary event.';

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
        <div className="about-mv-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(48px, 6vw, 80px)',
        }}>
          <Reveal delay={0} visible={visible}>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#D6A54A',
              }} />
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '16px',
              }}>OUR MISSION</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.05,
                fontWeight: 400,
                color: '#161616',
                marginBottom: '16px',
                whiteSpace: 'pre-line' as const,
              }}>{missionHeading}</h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
              }}>{missionBody}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'rgba(214,165,74,0.3)',
              }} />
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '16px',
              }}>OUR VISION</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.05,
                fontWeight: 400,
                color: '#161616',
                marginBottom: '16px',
                whiteSpace: 'pre-line' as const,
              }}>{visionHeading}</h2>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                maxWidth: '440px',
              }}>{visionBody}</p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-mv-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
