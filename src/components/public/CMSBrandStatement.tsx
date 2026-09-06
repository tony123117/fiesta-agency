import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { BrandStatementContent } from '@/lib/types';

export function CMSBrandStatement({ content }: { content: unknown }) {
  const data = content as BrandStatementContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.1 });
  const { ref: imageRef, visible: imageVisible } = useReveal({ threshold: 0.15 });

  if (!data) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#F5F2EA', padding: 'clamp(80px, 12vw, 160px) 0' }}
    >
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Text content — 48% */}
          <div className="lg:col-span-5 relative">
            {/* Gold vertical line — desktop only */}
            <div
              className="hidden lg:block absolute left-0 top-0 w-[1px] bg-gold"
              style={{
                height: '100%',
                transformOrigin: 'top',
                transform: sectionVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
              aria-hidden="true"
            />

            <div className="lg:pl-10">
              {/* Eyebrow */}
              {data.eyebrow && (
                <p
                  className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.18em] text-gold mb-8 md:mb-10"
                  style={{
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {data.eyebrow}
                </p>
              )}

              {/* Primary statement */}
              {data.primary_text && (
                <h2
                  className="font-serif font-light text-obsidian leading-[1.15] tracking-tight mb-6 md:mb-8"
                  style={{
                    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                  }}
                >
                  {data.primary_text}
                </h2>
              )}

              {/* Highlighted / dominant statement */}
              {data.highlighted_text && (
                <h3
                  className="font-serif font-light text-obsidian leading-[0.92] tracking-tight mb-10 md:mb-12"
                  style={{
                    fontSize: 'clamp(3.25rem, 4.5vw, 4rem)',
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                  }}
                >
                  {data.accent_word ? (
                    <>
                      <span className="block">{data.highlighted_text.replace(new RegExp(`\\b${data.accent_word}\\b`, 'i'), '').trim()}</span>
                      <span className="block">
                        <span className="text-gold">{data.accent_word}</span>.
                      </span>
                    </>
                  ) : (
                    <span className="block">{data.highlighted_text}</span>
                  )}
                </h3>
              )}

              {/* Supporting description */}
              {data.description && (
                <p
                  className="font-sans text-[0.95rem] text-stone leading-[1.75] max-w-[430px] mb-10 md:mb-12"
                  style={{
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                  }}
                >
                  {data.description}
                </p>
              )}

              {/* About link */}
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 text-[0.7rem] font-sans font-semibold uppercase tracking-[0.15em] text-gold transition-colors duration-300 hover:text-muted-gold"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
                }}
              >
                ABOUT FIESTA
                <ArrowRight
                  className="w-4 h-4 stroke-2 transition-transform duration-500 ease-lux group-hover:translate-x-1"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Right: Image — 52% */}
          <div
            ref={imageRef}
            className="lg:col-span-7"
            style={{
              opacity: imageVisible ? 1 : 0,
              transform: imageVisible ? 'scale(1)' : 'scale(1.02)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
          >
            {data.image ? (
              <img
                src={data.image}
                alt={data.image_alt || 'Elegant event setup'}
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4 / 3', borderRadius: '0' }}
                loading="lazy"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
                alt="Elegant dinner table setup under warm lighting with floral arrangements"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4 / 3', borderRadius: '0' }}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
