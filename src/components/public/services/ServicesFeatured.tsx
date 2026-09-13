import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesFeaturedContent {
  eyebrow?: string;
  heading?: string;
  services?: Array<{ id: string; title: string; description: string; image?: string }>;
}

const DEFAULT_SERVICES = [
  { id: '1', title: 'EVENT PLANNING', description: 'Full-service event planning tailored to your vision and goals.', image: images.blacktie[2] },
  { id: '2', title: 'CONCERTS &\nLIVE SHOWS', description: 'End-to-end production for unforgettable live experiences.', image: images.hero[3] },
  { id: '3', title: 'WEDDINGS &\nCELEBRATIONS', description: 'Beautifully curated weddings and private celebrations.', image: images.serena[0] },
];

export function ServicesFeatured({ content }: { content: unknown }) {
  const data = content as ServicesFeaturedContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.05 });

  const services = data?.services?.length ? data.services : DEFAULT_SERVICES;
  const heading = (data?.heading || "EVENTS\nCRAFTED WITH\nINTENTION.").replace(/\\n/g, '\n');

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
      <div className="svc-container">
        {/* Header */}
        <RevealBlock delay={0} visible={sectionVisible}>
          <div style={{ marginBottom: 'clamp(40px, 5vw, 56px)' }}>
            {data?.eyebrow && (
              <p className="svc-eyebrow">{data.eyebrow}</p>
            )}
            <h2 className="svc-heading-dark">{heading}</h2>
          </div>
        </RevealBlock>

        {/* Services grid */}
        <div className="svc-featured-grid">
          {services.slice(0, 3).map((service, i) => (
            <FeaturedCard
              key={service.id}
              service={service}
              index={i}
              visible={sectionVisible}
              delay={0.15 + i * 0.1}
            />
          ))}
        </div>
      </div>

      <style>{`
        .svc-container {
          width: min(1280px, calc(100vw - 120px));
          margin: 0 auto;
          padding-left: clamp(24px, 4vw, 40px);
          padding-right: clamp(24px, 4vw, 40px);
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
        .svc-heading-dark {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(2.5rem, 4.2vw, 3.75rem);
          line-height: 0.95;
          font-weight: 400;
          color: #F5F2EA;
          white-space: pre-line;
        }
        .svc-featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 24px);
        }
        @media (max-width: 1280px) {
          .svc-container { width: calc(100vw - 80px); }
        }
        @media (max-width: 1024px) {
          .svc-container { width: calc(100vw - 64px); }
        }
        @media (max-width: 768px) {
          .svc-container { width: 100%; padding-left: 24px; padding-right: 24px; }
          .svc-featured-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 375px) {
          .svc-container { padding-left: 22px; padding-right: 22px; }
        }
      `}</style>
    </section>
  );
}

function FeaturedCard({
  service,
  index,
  visible,
  delay,
}: {
  service: { id: string; title: string; description: string; image?: string };
  index: number;
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="svc-featured-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ${EASE} ${delay}s, transform 0.7s ${EASE} ${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
          className="svc-featured-card-img"
          style={{
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
          loading="lazy"
        />
      ) : (
        <div className="svc-featured-card-img" style={{ backgroundColor: '#151515' }} />
      )}

      {/* Dark overlay */}
      <div className="svc-featured-card-overlay" />

      {/* Content */}
      <div className="svc-featured-card-content">
        <span className="svc-featured-card-num">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="svc-featured-card-title">{service.title}</h3>
          <p className="svc-featured-card-desc">{service.description}</p>
          <ArrowRight
            className="svc-featured-card-arrow"
            style={{
              color: hovered ? '#D6A54A' : 'rgba(245,242,234,0.4)',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            }}
            size={16}
            aria-hidden="true"
          />
        </div>
      </div>

      <style>{`
        .svc-featured-card {
          position: relative;
          overflow: hidden;
          cursor: default;
          height: clamp(280px, 26vw, 340px);
        }
        .svc-featured-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .svc-featured-card-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(9,9,9,0.1) 0%, rgba(9,9,9,0.7) 100%);
        }
        .svc-featured-card-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(16px, 2.5vw, 28px);
        }
        .svc-featured-card-num {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 400;
          font-size: 0.75rem;
          color: rgba(214,165,74,0.5);
          line-height: 1;
          margin-bottom: 6px;
        }
        .svc-featured-card-title {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(1rem, 1.4vw, 1.25rem);
          font-weight: 600;
          color: #F5F2EA;
          margin-bottom: 8px;
          line-height: 1.15;
          white-space: pre-line;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .svc-featured-card-desc {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(0.72rem, 0.85vw, 0.8rem);
          line-height: 1.6;
          color: rgba(169,169,166,0.85);
          max-width: 260px;
          margin-bottom: 12px;
        }
        .svc-featured-card-arrow {
          width: 16px;
          height: 16px;
          stroke-width: 2;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        @media (max-width: 768px) {
          .svc-featured-card { height: 280px; }
        }
      `}</style>
    </div>
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
