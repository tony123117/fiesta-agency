import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface StatsContent {
  eyebrow?: string;
  heading?: string;
  stats?: Array<{ number: string; label: string }>;
  link_text?: string;
}

const DEFAULT_STATS = [
  { number: '200+', label: 'Events Executed' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '5K+', label: 'Happy Guests' },
  { number: '100%', label: 'Commitment' },
];

export function StatsRenderer({ content }: { content: unknown }) {
  const data = content as StatsContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });

  const eyebrow = (data?.eyebrow as string) || 'WHY CHOOSE US';
  const heading = ((data?.heading as string) || 'More Than Just An Event.').replace(/\\n/g, '\n');
  const stats = data?.stats?.length ? data.stats : DEFAULT_STATS;
  const linkText = (data?.link_text as string) || 'Learn More';

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(60px, 8vw, 100px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}>
        <div className="svc-stats-split" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          alignItems: 'center',
        }}>
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
              <img
                src={images.process[4]}
                alt="Live event with dramatic stage lighting"
                style={{
                  width: '100%',
                  height: 'clamp(280px, 32vw, 400px)',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'grayscale(30%)',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1} visible={visible}>
              <div style={{ marginBottom: 'clamp(28px, 3vw, 40px)' }}>
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  color: '#D6A54A',
                  marginBottom: '16px',
                }}>{eyebrow}</p>
                <h2 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: 0.95,
                  fontWeight: 400,
                  color: '#F8F5EF',
                }}>
                  {heading.includes('An Event.') ? (
                    <>More Than Just{' '}<span style={{ fontStyle: 'italic' }}>An Event.</span></>
                  ) : heading}
                </h2>
              </div>
            </Reveal>

            <div className="svc-stats-row" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(20px, 3vw, 32px)',
              marginBottom: 'clamp(28px, 3vw, 40px)',
            }}>
              {stats.slice(0, 3).map((stat, i) => (
                <div key={stat.label} style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.7s ${E} ${0.15 + i * 0.08}s, transform 0.7s ${E} ${0.15 + i * 0.08}s`,
                }}>
                  <span style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    fontWeight: 400,
                    color: '#D6A54A',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '6px',
                  }}>{stat.number}</span>
                  <span style={{
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    fontSize: '0.58rem',
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.14em',
                    color: 'rgba(248,245,239,0.45)',
                  }}>{stat.label}</span>
                </div>
              ))}
            </div>

            <Reveal delay={0.35} visible={visible}>
              <Link
                to="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.68rem',
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
                {linkText}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .svc-stats-split { grid-template-columns: 48% 1fr !important; }
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
