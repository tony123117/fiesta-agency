import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { TestimonialsContent } from '@/lib/types';
import { useHomeData } from '@/lib/usePublicData';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80',
];

const DEFAULT_TESTIMONIALS = [
  { id: 'dt1', quote: 'Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.', client_name: 'SARAH & MICHEL', event_type: 'Wedding', location: 'Kigali', image_url: '' },
  { id: 'dt2', quote: 'Professional, creative, and genuinely passionate. They don\'t just plan events - they create experiences that stay with you.', client_name: 'DAVID NZAMUHO', event_type: 'Corporate Summit', location: '', image_url: '' },
  { id: 'dt3', quote: 'The energy they brought to our concert was unreal. From stage design to sound production - absolute perfection.', client_name: 'JEAN-PASCAL', event_type: 'Live Show Production', location: '', image_url: '' },
];

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

export function TestimonialsRenderer({ content }: { content: unknown }) {
  const data = content as TestimonialsContent;
  const { testimonials } = useHomeData();
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.06 });
  const prefersReduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawItems = data?.testimonials?.length ? data.testimonials : (testimonials || []).length ? (testimonials || []).slice(0, 4) : DEFAULT_TESTIMONIALS;
  const items = rawItems.map((t: Record<string, unknown>, i: number) => ({
    id: (t.id as string) || `ti${i}`,
    quote: (t.quote as string) || '',
    client_name: (t.client_name as string) || (t.author as string) || '',
    event_type: (t.event_type as string) || (t.role as string) || '',
    location: (t.location as string) || '',
    image_url: (t.image_url as string) || '',
  }));

  const total = items.length;

  const scrollToIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const w = el.offsetWidth;
    el.scrollTo({ left: index * w, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [prefersReduced]);

  const next = useCallback(() => {
    if (total === 0) return;
    const nextIdx = activeIndex >= total - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIdx);
    scrollToIndex(nextIdx);
  }, [activeIndex, total, scrollToIndex]);

  const prev = useCallback(() => {
    if (total === 0) return;
    const prevIdx = activeIndex <= 0 ? total - 1 : activeIndex - 1;
    setActiveIndex(prevIdx);
    scrollToIndex(prevIdx);
  }, [activeIndex, total, scrollToIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || total === 0) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const w = el.offsetWidth;
        const idx = Math.round(el.scrollLeft / w);
        setActiveIndex(Math.min(idx, total - 1));
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [total]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  if (total === 0) return null;

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
        {/* Carousel */}
        <div
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
          }}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="flex overflow-x-auto"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Testimonials carousel"
            aria-roledescription="carousel"
          >
            <style>{`.TestimonialTrack::-webkit-scrollbar { display: none; }`}</style>
            {items.map((testimonial, i) => (
              <TestimonialSlide
                key={testimonial.id}
                testimonial={testimonial}
                index={i}
                total={total}
                fallbackImage={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                prefersReduced={prefersReduced}
              />
            ))}
          </div>

          {/* Pagination + controls */}
          <div
            className="flex items-center justify-between mt-8 md:mt-10"
          >
            <span
              className="font-sans uppercase tracking-[0.15em]"
              style={{ fontSize: '0.65rem', color: '#8D8981' }}
            >
              {pad(activeIndex + 1)} / {pad(total)}
            </span>
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); scrollToIndex(i); }}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-400"
                  style={{
                    width: i === activeIndex ? '22px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    backgroundColor: i === activeIndex ? '#D6A64F' : 'rgba(9,9,9,0.12)',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex items-center justify-center w-9 h-9 transition-all duration-300"
                style={{ color: '#090909' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A64F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#090909'; }}
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex items-center justify-center w-9 h-9 transition-all duration-300"
                style={{ color: '#090909' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A64F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#090909'; }}
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSlide({
  testimonial,
  index,
  total,
  fallbackImage,
  prefersReduced,
}: {
  testimonial: { id: string; quote: string; client_name: string; event_type: string; location: string; image_url: string };
  index: number;
  total: number;
  fallbackImage: string;
  prefersReduced: boolean;
}) {
  const [imgHovered, setImgHovered] = useState(false);
  const imageUrl = testimonial.image_url || fallbackImage;
  const imageAlt = testimonial.image_url ? `${testimonial.client_name} — ${testimonial.event_type || 'event'}` : fallbackImage;

  return (
    <div
      className="shrink-0 w-full"
      style={{ scrollSnapAlign: 'start' }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: Testimonial from ${testimonial.client_name}`}
    >
      {/* Desktop: Two-column editorial */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: '0.55fr 0.45fr',
          gap: 'clamp(40px, 5vw, 80px)',
          alignItems: 'center',
        }}
      >
        {/* LEFT: Quote content — 55% */}
        <div className="flex flex-col justify-center" style={{ padding: 'clamp(24px, 3vw, 48px) 0' }}>
          {/* Gold quote mark */}
          <span
            className="font-serif font-light block mb-4"
            style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', color: '#D6A64F', lineHeight: '0.55', opacity: 0.4 }}
          >
            &ldquo;
          </span>
          <blockquote
            className="font-serif font-light leading-[1.25]"
            style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', color: '#090909', maxWidth: '520px' }}
          >
            {testimonial.quote}
          </blockquote>
          <div className="mt-8">
            <div className="mb-4" style={{ width: '28px', height: '2px', backgroundColor: '#D6A64F' }} />
            <p className="font-serif font-light tracking-tight" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: '#090909' }}>
              {testimonial.client_name}
            </p>
            <p className="font-sans uppercase tracking-[0.15em] mt-2" style={{ fontSize: '0.7rem', color: '#8D8981' }}>
              {testimonial.event_type}
              {testimonial.location ? ` · ${testimonial.location}` : ''}
            </p>
          </div>
        </div>

        {/* RIGHT: Image — 45% */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '4 / 3' }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: imgHovered && !prefersReduced ? 'scale(1.025)' : 'scale(1)',
              transition: `transform 0.7s ${EASE}`,
            }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      </div>

      {/* Mobile: Stacked layout */}
      <div className="md:hidden">
        <div className="relative overflow-hidden w-full" style={{ aspectRatio: '4 / 3' }}>
          <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
        </div>
        <div style={{ padding: '24px 0 8px' }}>
          <span className="font-serif font-light block mb-3" style={{ fontSize: '3rem', color: '#D6A64F', lineHeight: '0.55', opacity: 0.4 }}>
            &ldquo;
          </span>
          <blockquote className="font-serif font-light leading-[1.25]" style={{ fontSize: 'clamp(1.2rem, 5.5vw, 1.5rem)', color: '#090909' }}>
            {testimonial.quote}
          </blockquote>
          <div className="mt-5">
            <div className="mb-3" style={{ width: '24px', height: '2px', backgroundColor: '#D6A64F' }} />
            <p className="font-serif font-light tracking-tight" style={{ fontSize: '0.9rem', color: '#090909' }}>
              {testimonial.client_name}
            </p>
            <p className="font-sans uppercase tracking-[0.15em] mt-1.5" style={{ fontSize: '0.6rem', color: '#8D8981' }}>
              {testimonial.event_type}
              {testimonial.location ? ` · ${testimonial.location}` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
