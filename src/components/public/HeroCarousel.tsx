import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroCarouselContent } from '@/lib/types';

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

export function HeroCarousel({ content }: { content: unknown }) {
  const data = content as HeroCarouselContent;
  const slides = data?.slides || [];
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const [imageReady, setImageReady] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current || slides.length <= 1) return;
      setIsTransitioning(true);
      setTextVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setTextVisible(true);
        setTimeout(() => setIsTransitioning(false), 100);
      }, prefersReduced ? 50 : 400);
    },
    [current, isTransitioning, prefersReduced, slides.length],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (isPaused || isTransitioning || slides.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [isPaused, next, isTransitioning, slides.length]);

  useEffect(() => {
    const t1 = setTimeout(() => setImageReady(true), 100);
    const t2 = setTimeout(() => setContentVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  if (slides.length === 0) return null;
  const slide = slides[current];

  const textStyle = (delay: string): React.CSSProperties => ({
    opacity: textVisible ? 1 : 0,
    transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
    transition: prefersReduced
      ? 'opacity 200ms ease'
      : `opacity 700ms ${EASE} ${delay}, transform 700ms ${EASE} ${delay}`,
  });

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      className="relative w-full overflow-hidden bg-obsidian"
      style={{ height: 'clamp(800px, 96vh, 1000px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured experiences"
    >
      {/* Background images */}
      {slides.map((s, i) => {
        const active = i === current;
        return (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transition: prefersReduced ? 'opacity 200ms ease' : 'opacity 1200ms ease-in-out',
              zIndex: active ? 1 : 0,
            }}
          >
            {s.mobile_image && (
              <img
                src={s.mobile_image}
                alt={s.headline}
                className="absolute inset-0 w-full h-full object-cover md:hidden"
                style={{
                  objectPosition: `${(s.focal_x || 0.5) * 100}% ${(s.focal_y || 0.5) * 100}%`,
                  transform: active ? 'scale(1)' : 'scale(1.04)',
                  transition: prefersReduced ? 'none' : 'transform 7s ease-out',
                  willChange: 'transform',
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                onLoad={() => { if (i === 0) setImageReady(true); }}
              />
            )}
            {s.image && (
              <img
                src={s.image}
                alt={s.headline}
                className={`absolute inset-0 w-full h-full object-cover ${s.mobile_image ? 'hidden md:block' : ''}`}
                style={{
                  objectPosition: `${(s.focal_x || 0.5) * 100}% ${(s.focal_y || 0.5) * 100}%`,
                  transform: active ? 'scale(1)' : 'scale(1.04)',
                  transition: prefersReduced ? 'none' : 'transform 7s ease-out',
                  willChange: 'transform',
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                onLoad={() => { if (i === 0) setImageReady(true); }}
              />
            )}
          </div>
        );
      })}

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 45%)',
        }}
      />

      {/* Content */}
      <div
        className="relative h-full mx-auto max-w-[1280px]"
        style={{ zIndex: 10 }}
      >
        <div
          className="h-full flex flex-col justify-center px-5 md:px-[4vw] lg:px-[5vw]"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 600ms ease',
          }}
        >
          <div className="max-w-[860px]">
            {/* Eyebrow */}
            {slide.eyebrow && (
              <span
                className="label-gold block mb-6 md:mb-8"
                style={textStyle('0ms')}
              >
                {slide.eyebrow}
              </span>
            )}

            {/* Headline */}
            {slide.headline && (
              <h1
                className="font-serif font-light text-ivory tracking-tight text-balance mb-6 md:mb-8"
                style={{
                  fontSize: 'clamp(2.75rem, 5.5vw, 5.25rem)',
                  lineHeight: '0.92',
                  ...textStyle('80ms'),
                }}
              >
                {slide.highlight_word ? (
                  (() => {
                    const regex = new RegExp(`(.*?)(\\b${slide.highlight_word}\\b)(.*)`, 'is');
                    const match = slide.headline.match(regex);
                    if (match) {
                      return (
                        <>
                          {match[1] && <span className="block">{match[1]}</span>}
                          <span className="block">
                            {match[2] && <span className="text-gold italic">{match[2]}</span>}
                            {match[3] && <span>{match[3]}</span>}
                          </span>
                        </>
                      );
                    }
                    return <span className="block">{slide.headline}</span>;
                  })()
                ) : (
                  <span className="block">{slide.headline}</span>
                )}
              </h1>
            )}

            {/* Supporting copy */}
            {slide.description && (
              <p
                className="text-base text-ivory/80 leading-[1.8] max-w-[420px] mb-8 md:mb-10"
                style={textStyle('160ms')}
              >
                {slide.description}
              </p>
            )}

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-5"
              style={textStyle('240ms')}
            >
              {slide.cta_text && (
                <Link to={slide.cta_url || '/plan-your-event'} className="btn-primary group">
                  {slide.cta_text}
                  <ChevronRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
                </Link>
              )}
              {slide.secondary_cta_text && (
                <Link to={slide.secondary_cta_url || '/events'} className="btn-secondary group">
                  {slide.secondary_cta_text}
                  <ChevronRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide counter + progress bar (bottom-left) */}
      {slides.length > 1 && (
        <div
          className="absolute left-5 md:left-[4vw] lg:left-[5vw] bottom-[40px] md:bottom-[48px] flex items-center gap-4"
          style={{ zIndex: 20, ...textStyle('320ms') }}
        >
          <span className="text-ivory/50 text-[0.65rem] uppercase tracking-[0.2em] font-sans select-none">
            {pad(current + 1)}
          </span>
          <span className="hidden sm:block w-20 h-[1px] bg-white/15 relative overflow-hidden">
            <span
              className="absolute left-0 top-0 h-full bg-gold"
              style={{
                width: `${((current + 1) / slides.length) * 100}%`,
                transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </span>
          <span className="text-ivory/50 text-[0.65rem] uppercase tracking-[0.2em] font-sans select-none">
            {pad(slides.length)}
          </span>
        </div>
      )}

      {/* Arrow controls (bottom-right) */}
      {slides.length > 1 && (
        <div
          className="absolute right-5 md:right-[4vw] lg:right-[5vw] bottom-[40px] md:bottom-[48px] hidden lg:flex items-center gap-1"
          style={{ zIndex: 20, ...textStyle('360ms') }}
        >
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="text-ivory/40 hover:text-gold p-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="text-ivory/40 hover:text-gold p-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  );
}
