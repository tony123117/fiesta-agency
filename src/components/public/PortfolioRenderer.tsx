import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { PortfolioGalleryContent } from '@/lib/types';
import { useHomeData } from '@/lib/usePublicData';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function PortfolioRenderer({ content }: { content: unknown }) {
  const data = content as PortfolioGalleryContent;
  const { portfolio: projects } = useHomeData();
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.05 });

  const items = data?.items?.length ? data.items : (projects || []).slice(0, 6).map((p) => ({
    id: p.id, image: p.cover_image || '', title: p.title, category: p.category,
  }));

  if (items.length === 0) return null;

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
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* Left: Text — 35% */}
          <div
            className="lg:col-span-4"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
            }}
          >
            <p
              className="font-sans font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontSize: '0.65rem', color: '#D6A64F' }}
            >
              FEATURED WORK
            </p>
            {data?.heading && (
              <h2
                className="font-serif font-light tracking-tight mb-6 md:mb-8"
                style={{
                  fontSize: 'clamp(2.875rem, 3.8vw, 3.625rem)',
                  color: '#090909',
                  lineHeight: '1.05',
                }}
              >
                {data.heading}
              </h2>
            )}
            {data?.description && (
              <p
                className="font-sans leading-[1.75] mb-8 md:mb-10"
                style={{
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  color: '#6B6860',
                  maxWidth: '320px',
                }}
              >
                {data.description}
              </p>
            )}
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-3 text-[0.7rem] font-sans font-semibold uppercase tracking-[0.15em] text-obsidian transition-colors duration-300 hover:text-gold"
            >
              VIEW ALL PROJECTS
              <ArrowRight
                className="w-4 h-4 stroke-2 transition-transform duration-500 ease-lux group-hover:translate-x-1"
                size={16}
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Right: Asymmetric mosaic — 65% */}
          <div
            className="lg:col-span-8"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.9s ${EASE} 0.12s, transform 0.9s ${EASE} 0.12s`,
            }}
          >
            {/* Row 1: dominant left + small right */}
            <div className="grid grid-cols-12 gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="col-span-7">
                <MosaicImage image={items[0]?.image} title={items[0]?.title} height="clamp(280px, 28vw, 380px)" />
              </div>
              <div className="col-span-5 flex flex-col gap-3 md:gap-4">
                {items[1] && <MosaicImage image={items[1].image} title={items[1].title} height="clamp(132px, 13vw, 180px)" />}
                {items[2] && <MosaicImage image={items[2].image} title={items[2].title} height="clamp(132px, 13vw, 180px)" />}
              </div>
            </div>
            {/* Row 2: two medium */}
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {items[3] && (
                <div className="col-span-5">
                  <MosaicImage image={items[3].image} title={items[3].title} height="clamp(180px, 18vw, 240px)" />
                </div>
              )}
              {items[4] && (
                <div className="col-span-7">
                  <MosaicImage image={items[4].image} title={items[4].title} height="clamp(180px, 18vw, 240px)" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MosaicImage({ image, title, height }: { image: string; title: string; height: string }) {
  return (
    <div className="overflow-hidden group relative" style={{ height }}>
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full" style={{ backgroundColor: '#E8E5DC' }} />
      )}
      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-5"
        style={{
          background: 'linear-gradient(180deg, rgba(9,9,9,0) 40%, rgba(9,9,9,0.4) 100%)',
        }}
      >
        <span className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.15em] text-ivory">
          {title}
        </span>
      </div>
    </div>
  );
}
