import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  images?: string[];
}

const DEFAULT_IMAGES = [
  images.hero[0],
  images.process[0],
  images.bts[0],
];

export function ServicesHero({ content }: { content: unknown }) {
  const data = content as ServicesHeroContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const rawHeading = data?.heading || 'EVERY DETAIL CRAFTED TO PERFECTION.';
  const heading = breakHeading(rawHeading.replace(/\\n/g, '\n'));
  const description = (data?.description || 'From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.').replace(/\\n/g, '\n');
  const images = data?.images?.length ? data.images : DEFAULT_IMAGES;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#090909' }}
    >
      <div
        className="svc-hero-container"
        style={{
          margin: '0 auto',
          paddingTop: '90px',
          paddingBottom: 'clamp(50px, 6vw, 80px)',
        }}
      >
        <div className="svc-hero-grid">
          {/* Left: Heading — 58% */}
          <div className="svc-hero-text">
            <RevealBlock delay={0} visible={visible}>
              <p className="svc-hero-eyebrow">{data?.eyebrow || 'OUR SERVICES'}</p>
              <h1 className="svc-hero-heading">{heading}</h1>
            </RevealBlock>
          </div>

          {/* Right: Description — 38% */}
          <div className="svc-hero-desc">
            <RevealBlock delay={0.12} visible={visible}>
              <p className="svc-hero-body">{description}</p>
            </RevealBlock>
          </div>
        </div>
      </div>

      {/* Image strip */}
      <RevealBlock delay={0.2} visible={visible}>
        <div
          className="svc-hero-container"
          style={{ margin: '0 auto', paddingBottom: 'clamp(60px, 8vw, 100px)' }}
        >
          <div className="svc-hero-strip">
            <div className="svc-hero-strip-img" style={{ flex: 3 }}>
              <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="svc-hero-strip-img" style={{ flex: 2 }}>
              <img src={images[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="svc-hero-strip-img svc-hero-strip-hide-mobile" style={{ flex: 2 }}>
              <img src={images[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </RevealBlock>

      <style>{`
        .svc-hero-container {
          width: min(1280px, calc(100vw - 120px));
        }
        .svc-hero-grid {
          display: flex;
          flex-direction: row;
          gap: clamp(32px, 4vw, 56px);
          align-items: flex-start;
        }
        .svc-hero-text {
          flex: 0 0 58%;
        }
        .svc-hero-eyebrow {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          color: #D6A54A;
          margin-bottom: 20px;
        }
        .svc-hero-heading {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(2.5rem, 4.8vw, 4rem);
          line-height: 0.95;
          font-weight: 400;
          color: #F5F2EA;
          white-space: pre-line;
        }
        .svc-hero-desc {
          flex: 1;
        }
        .svc-hero-body {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(0.82rem, 0.9vw, 0.9rem);
          line-height: 1.7;
          color: #D0CCC5;
          max-width: 340px;
          padding-top: 8px;
        }
        .svc-hero-strip {
          display: flex;
          gap: clamp(10px, 1.2vw, 16px);
          height: clamp(180px, 20vw, 280px);
        }
        .svc-hero-strip-img {
          overflow: hidden;
        }
        @media (max-width: 1280px) {
          .svc-hero-container { width: calc(100vw - 80px); }
        }
        @media (max-width: 1024px) {
          .svc-hero-container { width: calc(100vw - 64px); }
          .svc-hero-grid { flex-direction: column; gap: 24px; }
          .svc-hero-text { flex: none; width: 100%; }
          .svc-hero-desc { flex: none; width: 100%; }
          .svc-hero-body { max-width: 100%; }
        }
        @media (max-width: 768px) {
          .svc-hero-container { width: 100%; padding-left: 24px; padding-right: 24px; }
          .svc-hero-strip { flex-direction: column; height: auto; gap: 12px; }
          .svc-hero-strip-img { height: 180px; }
          .svc-hero-strip-hide-mobile { display: none; }
        }
        @media (max-width: 375px) {
          .svc-hero-container { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>
    </section>
  );
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
