import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface TeamContent {
  eyebrow?: string;
  heading?: string;
  members?: TeamMember[];
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

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Jean-Paul Habimana', role: 'Founder & Creative Director', image: images.blacktie[0] },
  { id: '2', name: 'Alice Uwimana', role: 'Head of Production', image: images.hero[2] },
  { id: '3', name: 'David Niyonzima', role: 'Event Coordinator', image: images.intimate[0] },
  { id: '4', name: 'Grace Mukamana', role: 'Design Lead', image: images.serena[0] },
  { id: '5', name: 'Samuel Bizimana', role: 'Technical Director', image: images.garden[0] },
];

export function AboutTeamSection({ content }: { content: Record<string, unknown> }) {
  const c = content as TeamContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });

  const eyebrow = c.eyebrow || 'THE TEAM';
  const heading = (c.heading || 'THE PEOPLE BEHIND\nTHE MAGIC.').replace(/\\n/g, '\n');
  const members = c.members?.length ? c.members : DEFAULT_MEMBERS;

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
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
              fontSize: 'clamp(2rem, 3.5vw, 3.125rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
              whiteSpace: 'pre-line' as const,
            }}>{heading}</h2>
          </div>
        </Reveal>

        <div className="about-team-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          {members.map((member, i) => (
            <div key={member.id} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.06}s, transform 0.7s ${E} ${0.1 + i * 0.06}s`,
            }}>
              <div style={{
                overflow: 'hidden',
                marginBottom: '12px',
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(0.2)',
                    transition: 'filter 0.5s ease, transform 0.5s ease',
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <h4 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#161616',
                marginBottom: '2px',
              }}>{member.name}</h4>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.58rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                color: '#9A9792',
              }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .about-team-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) {
          .about-team-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .about-team-grid::-webkit-scrollbar { display: none; }
          .about-team-grid > * {
            flex: 0 0 60% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}
