import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { CTAContent } from '@/lib/types';
import { images } from '@/lib/images-supabase';

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

const DEFAULT_IMAGE = images.hero[7];

export function CTARenderer({ content }: { content: unknown }) {
  const data = content as CTAContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.1 });
  const prefersReduced = usePrefersReducedMotion();

  if (!data) return null;
  const hasContent = data.heading || data.description || data.button_text || data.secondary_button_text;
  if (!hasContent) return null;

  const bgImage = data.background_image || DEFAULT_IMAGE;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: 'clamp(420px, 50vh, 500px)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          style={{
            transform: sectionVisible && !prefersReduced ? 'scale(1)' : 'scale(1.04)',
            transition: `transform 8s ${EASE}`,
          }}
          loading="eager"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(9,9,9,0.5) 0%, rgba(9,9,9,0.4) 40%, rgba(9,9,9,0.65) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 md:px-[4vw] lg:px-[5vw]"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
        }}
      >
        {/* Eyebrow */}
        {data.eyebrow && (
          <p
            className="font-sans font-semibold uppercase tracking-[0.22em] mb-5 md:mb-6"
            style={{
              fontSize: '0.7rem',
              color: '#D6A64F',
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.8s ${EASE} 0.2s, transform 0.8s ${EASE} 0.2s`,
            }}
          >
            {data.eyebrow}
          </p>
        )}

        {/* Heading */}
        {data.heading && (
          <h2
            className="font-serif font-light tracking-tight leading-[0.95]"
            style={{
              fontSize: 'clamp(2.875rem, 4.5vw, 4rem)',
              color: '#F5F2EA',
              maxWidth: '16ch',
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.9s ${EASE} 0.3s, transform 0.9s ${EASE} 0.3s`,
            }}
          >
            {data.heading}
          </h2>
        )}

        {/* Description */}
        {data.description && (
          <p
            className="font-sans leading-[1.8] mt-6 md:mt-8"
            style={{
              fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
              color: 'rgba(245,242,234,0.65)',
              maxWidth: '520px',
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.8s ${EASE} 0.45s, transform 0.8s ${EASE} 0.45s`,
            }}
          >
            {data.description}
          </p>
        )}

        {/* CTA buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-8 md:mt-10"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.8s ${EASE} 0.55s, transform 0.8s ${EASE} 0.55s`,
          }}
        >
          {data.button_text && (
            <Link to={data.button_url || '/plan-your-event'} className="btn-primary group">
              {data.button_text}
              <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
            </Link>
          )}
          {data.secondary_button_text && (
            <Link to={data.secondary_button_url || '/contact'} className="btn-secondary group">
              {data.secondary_button_text}
              <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
