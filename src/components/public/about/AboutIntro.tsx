import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutIntroContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
  mission?: { icon?: string; title?: string; description?: string };
  vision?: { icon?: string; title?: string; description?: string };
  values_intro?: { icon?: string; title?: string; description?: string };
  team_eyebrow?: string;
  team_members?: Array<{ id: string; name: string; role: string; image?: string }>;
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

export function AboutIntro({ content }: { content: unknown }) {
  const data = content as AboutIntroContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.05 });

  const rawHeading = data?.heading || "WE DON'T JUST\nPLAN EVENTS. WE\nCREATE EXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.";
  const normalizedHeading = rawHeading.replace(/\\n/g, '\n');
  const heading = breakHeading(normalizedHeading);
  const body = (data?.body || 'Fiesta Agency is an event planning and entertainment company focused on creating unforgettable experiences through creativity, production, planning and flawless execution.').replace(/\\n/g, '\n');
  const image = data?.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80';

  const mission = data?.mission || { title: 'OUR MISSION', description: 'We turn ideas into well-crafted experiences by combining creativity, entertainment, production and precision.' };
  const vision = data?.vision || { title: 'OUR VISION', description: 'Building a trusted and creative event company. Creating experiences people remember. Growing across the region.' };
  const valuesIntro = data?.values_intro || { title: 'OUR VALUES', description: 'Creativity. Excellence. Integrity. Passion. Teamwork.' };

  const teamMembers = data?.team_members || [];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* ── HERO ── */}
      <div
        className="about-hero-container"
        style={{
          margin: '0 auto',
          paddingTop: 'clamp(120px, 14vw, 180px)',
          paddingBottom: '48px',
          paddingLeft: 'clamp(24px, 4vw, 40px)',
          paddingRight: 'clamp(24px, 4vw, 40px)',
        }}
      >
        <div className="about-hero-grid">
          {/* Left: Text — 500px */}
          <RevealBlock delay={0} visible={visible}>
            <div className="about-hero-text">
              <p className="about-hero-eyebrow">
                {data?.eyebrow || 'ABOUT FIESTA'}
              </p>
              <h1 className="about-hero-heading">
                {heading}
              </h1>
              <p className="about-hero-body">
                {body}
              </p>
            </div>
          </RevealBlock>

          {/* Right: Image — 740px */}
          <RevealBlock delay={0.12} visible={visible}>
            <div className="about-hero-image">
              <img
                src={image}
                alt={data?.image_alt || 'Luxury event experience'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </RevealBlock>
        </div>
      </div>

      {/* ── MISSION / VISION / VALUES ── */}
      <div
        className="about-mvv-container"
        style={{
          margin: '0 auto',
          paddingTop: '72px',
          paddingBottom: '72px',
          paddingLeft: 'clamp(24px, 4vw, 40px)',
          paddingRight: 'clamp(24px, 4vw, 40px)',
        }}
      >
        <div style={{ borderTop: '1px solid rgba(20,20,20,0.1)' }} />
        <div className="about-mvv-grid">
          {[
            { data: mission, delay: 0.05 },
            { data: vision, delay: 0.1 },
            { data: valuesIntro, delay: 0.15 },
          ].map((item, i) => (
            <RevealBlock key={i} delay={item.delay} visible={visible}>
              <div>
                <div
                  style={{
                    width: '28px', height: '28px',
                    border: '1.5px solid #D6A54A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6A54A" strokeWidth="1.5">
                    {i === 0 && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                    {i === 1 && <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></>}
                    {i === 2 && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />}
                  </svg>
                </div>
                <h3 className="about-mvv-heading">{item.data.title}</h3>
                <p className="about-mvv-body">{item.data.description}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>

      {/* ── TEAM ── */}
      {teamMembers.length > 0 && (
        <div
          className="about-mvv-container"
          style={{
            margin: '0 auto',
            paddingBottom: 'clamp(60px, 8vw, 100px)',
            paddingLeft: 'clamp(24px, 4vw, 40px)',
            paddingRight: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <RevealBlock delay={0.05} visible={visible}>
            <p style={{ fontSize: '11px', letterSpacing: '0.14em', marginBottom: '24px', fontFamily: "'Fraunces', Georgia, serif", textTransform: 'uppercase', fontWeight: 500, color: '#151515' }}>
              {data?.team_eyebrow || 'OUR TEAM'}
            </p>
          </RevealBlock>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-6 gap-y-8">
            {teamMembers.map((member, i) => (
              <RevealBlock key={member.id} delay={0.05 + i * 0.05} visible={visible}>
                <div className="group">
                  <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '3/4' }}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: '#E8E5DE' }} />
                    )}
                  </div>
                  <h4 className="font-sans font-medium transition-colors duration-300 group-hover:text-[#D6A54A]" style={{ fontSize: '0.8rem', color: '#151515' }}>{member.name}</h4>
                  <p className="font-sans uppercase tracking-[0.08em] mt-0.5" style={{ fontSize: '0.58rem', color: '#9A9792' }}>{member.role}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      )}

      {/* ── RESPONSIVE ── */}
      <style>{`
        /* === 1440px default: 500px text + 40px gap + 740px image = 1280px === */
        .about-hero-container {
          width: min(1280px, calc(100vw - 120px));
        }
        .about-mvv-container {
          width: min(1280px, calc(100vw - 120px));
        }
        .about-hero-grid {
          display: flex;
          flex-direction: row;
          gap: 40px;
          align-items: center;
        }
        .about-hero-text {
          width: 500px;
          flex-shrink: 0;
        }
        .about-hero-heading {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 58px;
          line-height: 0.96;
          letter-spacing: 0.06em;
          font-weight: 500;
          color: #151515;
          white-space: pre-line;
          max-width: 650px;
          margin-bottom: 0;
        }
        .about-hero-eyebrow {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          margin-bottom: 20px;
          text-transform: uppercase;
          font-weight: 600;
          color: #D6A54A;
        }
        .about-hero-body {
          width: 390px;
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.65;
          margin-top: 32px;
          color: #73706A;
        }
        .about-hero-image {
          width: 740px;
          height: 620px;
          flex-shrink: 0;
          overflow: hidden;
          aspect-ratio: 6 / 5;
        }
        .about-mvv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          padding-top: 40px;
        }
        .about-mvv-heading {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #151515;
          margin-bottom: 12px;
        }
        .about-mvv-body {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #73706A;
        }

        /* === 1280px === */
        @media (max-width: 1280px) {
          .about-hero-container { width: calc(100vw - 80px); }
          .about-mvv-container { width: calc(100vw - 80px); }
          .about-hero-grid { gap: 32px; }
          .about-hero-text { width: 440px; }
          .about-hero-heading { font-size: 52px; max-width: 580px; }
        }

        /* === 1024px === */
        @media (max-width: 1024px) {
          .about-hero-container { width: calc(100vw - 64px); }
          .about-mvv-container { width: calc(100vw - 64px); }
          .about-hero-grid {
            flex-direction: column;
            gap: 0;
            align-items: flex-start;
          }
          .about-hero-text { width: 42%; }
          .about-hero-heading { font-size: 46px; max-width: 100%; }
          .about-hero-body { width: 100%; }
          .about-hero-image { width: 58%; height: 500px; }
        }

        /* === 768px — STACK === */
        @media (max-width: 768px) {
          .about-hero-container {
            width: 100%;
            padding-left: 24px;
            padding-right: 24px;
          }
          .about-mvv-container {
            width: 100%;
            padding-left: 24px;
            padding-right: 24px;
          }
          .about-hero-grid {
            flex-direction: column;
            gap: 40px;
            align-items: flex-start;
          }
          .about-hero-text { width: 100%; }
          .about-hero-heading {
            font-size: 40px;
            line-height: 1.0;
            max-width: 100%;
          }
          .about-hero-body { width: 100%; }
          .about-hero-image { width: 100%; height: 360px; }
          .about-mvv-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        /* === 390px === */
        @media (max-width: 390px) {
          .about-hero-container { padding-left: 24px; padding-right: 24px; }
          .about-mvv-container { padding-left: 24px; padding-right: 24px; }
          .about-hero-heading { font-size: 36px; }
          .about-hero-image { height: 360px; }
        }

        /* === 375px === */
        @media (max-width: 375px) {
          .about-hero-container { padding-left: 22px; padding-right: 22px; }
          .about-mvv-container { padding-left: 22px; padding-right: 22px; }
          .about-hero-heading { font-size: 34px; }
          .about-hero-image { height: 340px; }
        }
      `}</style>
    </section>
  );
}
