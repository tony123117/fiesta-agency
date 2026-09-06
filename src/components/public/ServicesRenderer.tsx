import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { ServicesEditorialContent } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function ServicesRenderer({ content }: { content: unknown }) {
  const data = content as ServicesEditorialContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.05 });
  const prefersReduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  const services = data?.services || [];
  const total = services.length;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setVisibleCards(5);
      else if (w >= 1024) setVisibleCards(4);
      else if (w >= 768) setVisibleCards(3);
      else setVisibleCards(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 280;
    const w = window.innerWidth;
    const containerPadding = w >= 1024 ? 80 : w >= 768 ? 64 : 40;
    const gap = 16;
    const available = w - containerPadding;
    return Math.floor((available - gap * (visibleCards - 1)) / visibleCards);
  }, [visibleCards]);

  const scrollToIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const cardW = getCardWidth();
    const gap = 16;
    const maxIndex = Math.max(0, total - visibleCards);
    const clampedIndex = Math.min(index, maxIndex);
    trackRef.current.scrollTo({
      left: clampedIndex * (cardW + gap),
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [getCardWidth, total, visibleCards, prefersReduced]);

  const next = useCallback(() => {
    const nextIdx = Math.min(activeIndex + 1, total - visibleCards);
    setActiveIndex(nextIdx);
    scrollToIndex(nextIdx);
  }, [activeIndex, total, visibleCards, scrollToIndex]);

  const prev = useCallback(() => {
    const prevIdx = Math.max(activeIndex - 1, 0);
    setActiveIndex(prevIdx);
    scrollToIndex(prevIdx);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const cardW = getCardWidth();
        const gap = 16;
        const idx = Math.round(el.scrollLeft / (cardW + gap));
        setActiveIndex(Math.min(idx, total - visibleCards));
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [getCardWidth, total, visibleCards]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  const maxIndex = Math.max(0, total - visibleCards);

  if (total === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#151515' }}
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div
          className="text-center px-5 md:px-[4vw] lg:px-[5vw]"
          style={{
            paddingTop: 'clamp(80px, 10vw, 140px)',
            paddingBottom: 'clamp(40px, 5vw, 70px)',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
          }}
        >
          {data?.eyebrow && (
            <p
              className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.18em] text-gold mb-6"
            >
              {data.eyebrow}
            </p>
          )}
          {data?.heading && (
            <h2
              className="font-serif font-light tracking-tight"
              style={{
                fontSize: 'clamp(2.375rem, 3vw, 3rem)',
                color: '#F5F2EA',
                lineHeight: '1.15',
              }}
            >
              {data.heading}
            </h2>
          )}
        </div>

        {/* Carousel */}
        <div
          className="relative"
          style={{
            paddingBottom: 'clamp(50px, 6vw, 80px)',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ${EASE} 0.12s, transform 0.9s ${EASE} 0.12s`,
          }}
        >
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous services"
            className="hidden md:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
            style={{
              color: '#F5F2EA',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A64F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#F5F2EA'; }}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={activeIndex >= maxIndex}
            aria-label="Next services"
            className="hidden md:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
            style={{
              color: '#F5F2EA',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A64F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#F5F2EA'; }}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

          {/* Card track */}
          <div
            ref={trackRef}
            className="flex overflow-x-auto gap-4 px-5 md:px-[4vw] lg:px-[5vw]"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Services carousel"
            aria-roledescription="carousel"
          >
            <style>{`.ServicesTrack::-webkit-scrollbar { display: none; }`}</style>
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                prefersReduced={prefersReduced}
              />
            ))}
          </div>

          {/* Pagination dots */}
          <div
            className="flex items-center justify-center gap-2 mt-6 md:mt-8"
            role="tablist"
            aria-label="Carousel navigation"
          >
            {Array.from({ length: Math.min(total, visibleCards + 2) }).map((_, i) => {
              const dotIndex = i < maxIndex ? i : maxIndex;
              const isActive = i === activeIndex || (i === Math.min(total, visibleCards + 2) - 1 && activeIndex >= maxIndex);
              return (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(dotIndex); scrollToIndex(dotIndex); }}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-400"
                  style={{
                    width: isActive ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: isActive ? '#D6A64F' : 'rgba(245,242,234,0.2)',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  prefersReduced,
}: {
  service: { id?: string; title: string; slug?: string; description?: string; image_url?: string; image_alt?: string };
  index: number;
  prefersReduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const imageUrl = service.image_url || '';
  const imageAlt = service.image_alt || service.title;
  const description = service.description || '';

  const getCardWidthStyle = () => {
    if (typeof window === 'undefined') return '25%';
    const w = window.innerWidth;
    if (w >= 1280) return 'calc((100vw - 80px - 64px) / 5)';
    if (w >= 1024) return 'calc((100vw - 80px - 48px) / 4)';
    if (w >= 768) return 'calc((100vw - 64px - 32px) / 3)';
    return 'calc(100vw - 40px)';
  };

  return (
    <div
      className="shrink-0"
      style={{
        width: getCardWidthStyle(),
        scrollSnapAlign: 'start',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${10}: ${service.title}`}
    >
      <div
        className="group block"
        style={{
          height: 'clamp(220px, 20vw, 280px)',
          borderRadius: '0',
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? 'rgba(214,166,79,0.2)' : 'rgba(245,242,234,0.06)'}`,
          overflow: 'hidden',
          transition: `border-color 0.4s ${EASE}, transform 0.4s ${EASE}`,
          transform: hovered && !prefersReduced ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '55%' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
              style={{
                transform: hovered && !prefersReduced ? 'scale(1.04)' : 'scale(1)',
                transition: `transform 0.7s ${EASE}`,
              }}
              loading={index < 5 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: '#1A1A1A' }} />
          )}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '40%',
              background: 'linear-gradient(180deg, rgba(21,21,21,0) 0%, rgba(21,21,21,0.6) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div
          className="flex flex-col justify-between"
          style={{
            height: '45%',
            padding: 'clamp(12px, 1.5vw, 16px) clamp(14px, 1.8vw, 20px) clamp(10px, 1.2vw, 14px)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="font-serif font-light"
                style={{ fontSize: '0.7rem', color: 'rgba(214,166,79,0.5)', lineHeight: '1' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ width: '16px', height: '1px', backgroundColor: 'rgba(214,166,79,0.25)' }} />
            </div>
            <h3
              className="font-serif font-light tracking-tight leading-[1.12]"
              style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                color: '#F5F2EA',
              }}
            >
              {service.title}
            </h3>
          </div>
          <p
            className="font-sans leading-[1.6]"
            style={{
              fontSize: 'clamp(0.72rem, 0.85vw, 0.8rem)',
              color: 'rgba(169,169,166,0.85)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
