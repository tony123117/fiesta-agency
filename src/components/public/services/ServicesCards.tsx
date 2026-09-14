import { useState } from 'react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesCardsContent {
  cards?: Array<{ id: string; title: string; description: string; image: string }>;
}

const DEFAULT_CARDS = [
  { id: '1', title: 'Event Planning', description: 'Full-service planning from concept to execution.', image: images.blacktie[2] },
  { id: '2', title: 'Event Design & Styling', description: 'Creative direction and aesthetic curation for your event.', image: images.process[4] },
  { id: '3', title: 'Weddings & Celebrations', description: 'Beautifully curated weddings and milestone celebrations.', image: images.serena[1] },
  { id: '4', title: 'Corporate Events', description: 'Professional conferences, summits, and corporate gatherings.', image: images.hero[4] },
  { id: '5', title: 'Production & Lighting', description: 'Stage design, sound, lighting, and full production.', image: images.process[5] },
  { id: '6', title: 'Catering & Hospitality', description: 'Premium catering and guest experience management.', image: images.lagoon[5] },
  { id: '7', title: 'Photography & Videography', description: 'Professional coverage to capture every moment.', image: images.intimate[3] },
  { id: '8', title: 'Private Events', description: 'Exclusive birthday parties, anniversaries, and private gatherings.', image: images.lagoon[6] },
];

export function ServicesCards({ content, loading = false }: { content: unknown; loading?: boolean }) {
  const data = content as ServicesCardsContent;
  const { ref, visible } = useReveal({ threshold: 0.05 });

  const cards = data?.cards?.length ? data.cards : DEFAULT_CARDS;

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(40px, 5vw, 60px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
    }} className="grain">
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(14px, 1.8vw, 20px)',
        }}
          className="svc-cards-grid"
        >
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '3/4' }} />
            ))
          ) : (
            cards.map((card, i) => (
              <ServiceCard key={card.id} card={card} index={i} visible={visible} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .svc-cards-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .svc-cards-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 14px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .svc-cards-grid::-webkit-scrollbar { display: none; }
          .svc-cards-grid > * {
            flex: 0 0 72% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ card, index, visible }: {
  card: { id: string; title: string; description: string; image: string };
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        overflow: 'hidden',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.7s ${E} ${0.1 + index * 0.06}s, transform 0.7s ${E} ${0.1 + index * 0.06}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ overflow: 'hidden' }}>
        <img
          src={card.image}
          alt={card.title}
          style={{
            width: '100%',
            aspectRatio: '16/11',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: `transform 0.7s ${E}`,
          }}
          loading="lazy"
        />
      </div>
      <div style={{ paddingTop: '12px', paddingBottom: '4px' }}>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
          fontWeight: 400,
          color: '#161616',
          marginBottom: '4px',
          lineHeight: 1.25,
        }}>{card.title}</h3>
        <p style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: 'clamp(0.65rem, 0.72vw, 0.72rem)',
          lineHeight: 1.5,
          color: '#6F6B63',
        }}>{card.description}</p>
      </div>
    </div>
  );
}
