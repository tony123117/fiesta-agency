import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ImageCarouselContent } from '@/lib/types';

export function ImageCarouselRenderer({ content }: { content: unknown }) {
  const data = content as ImageCarouselContent;
  const images = data?.images || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (images.length === 0) return null;

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-site mb-8 md:mb-12">
        {data?.heading && <h2 className="section text-ivory mb-4">{data.heading}</h2>}
        {data?.description && <p className="text-body-lg text-stone max-w-2xl">{data.description}</p>}
      </div>
      <div className="flex justify-end gap-2 mb-4 md:mb-6 max-w-[1440px] mx-auto px-5 md:px-[4vw] lg:px-[5vw]">
        <button
          onClick={() => scroll('left')}
          disabled={!canPrev}
          className="w-10 h-10 flex items-center justify-center border border-white/10 text-ivory/60 transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous images"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canNext}
          className="w-10 h-10 flex items-center justify-center border border-white/10 text-ivory/60 transition-all duration-300 hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next images"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ paddingLeft: 'max(1.25rem, 5vw)', paddingRight: 'max(1.25rem, 5vw)' }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="snap-start shrink-0"
            style={{ width: 'clamp(280px, 40vw, 520px)' }}
          >
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full h-full object-cover"
              style={{ aspectRatio: '3/4' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
