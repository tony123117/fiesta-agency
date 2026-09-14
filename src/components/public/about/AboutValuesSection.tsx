import { useReveal } from '@/lib/useReveal';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ValueItem {
  id: string;
  num?: string;
  title: string;
  text: string;
}

interface ValuesContent {
  eyebrow?: string;
  heading?: string;
  values?: ValueItem[];
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

const DEFAULT_VALUES: ValueItem[] = [
  { id: '1', num: '01', title: 'CREATIVITY', text: 'Every event is a blank canvas. We bring fresh thinking and original ideas to every project.' },
  { id: '2', num: '02', title: 'EXCELLENCE', text: "We don't settle for average. Every detail is refined until it reaches our highest standard." },
  { id: '3', num: '03', title: 'INTEGRITY', text: 'Transparent communication, honest pricing, and genuine care for every client relationship.' },
  { id: '4', num: '04', title: 'PASSION', text: 'We love what we do. That energy translates into events that feel alive and memorable.' },
];

export function AboutValuesSection({ content }: { content: Record<string, unknown> }) {
  const c = content as ValuesContent;
  const { ref, visible } = useReveal({ threshold: 0.06 });

  const eyebrow = c.eyebrow || 'OUR VALUES';
  const heading = (c.heading || 'THE PRINCIPLES\nBEHIND OUR WORK.').replace(/\\n/g, '\n');
  const values = c.values?.length ? c.values : DEFAULT_VALUES;

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
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
          <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
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
              color: '#F8F5EF',
              whiteSpace: 'pre-line' as const,
            }}>{heading}</h2>
          </div>
        </Reveal>

        <div className="about-values-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 3vw, 40px)',
        }}>
          {values.map((v, i) => (
            <div key={v.id} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.7s ${E} ${0.1 + i * 0.08}s, transform 0.7s ${E} ${0.1 + i * 0.08}s`,
            }}>
              <span style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 400,
                fontSize: '0.8rem',
                color: 'rgba(214,165,74,0.4)',
                display: 'block',
                marginBottom: '12px',
              }}>{v.num || String(i + 1).padStart(2, '0')}</span>
              <h3 style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                color: '#F8F5EF',
                marginBottom: '10px',
              }}>{v.title}</h3>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: 'rgba(248,245,239,0.45)',
                marginBottom: '16px',
              }}>{v.text}</p>
              <div style={{ width: '28px', height: '1.5px', backgroundColor: '#D6A54A' }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .about-values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .about-values-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 20px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .about-values-grid::-webkit-scrollbar { display: none; }
          .about-values-grid > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}
