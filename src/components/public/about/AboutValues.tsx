import { useState } from 'react';
import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutValuesContent {
  eyebrow?: string;
  heading?: string;
  values?: Array<{ id: string; name?: string }>;
  image?: string;
  image_alt?: string;
}

export function AboutValues({ content }: { content: unknown }) {
  const data = content as AboutValuesContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const heading = breakHeading((data?.heading || 'THE PRINCIPLES BEHIND THE EXPERIENCE.').replace(/\\n/g, '\n'));
  const values = data?.values?.length
    ? data.values
    : [
        { id: '1', name: 'CREATIVITY' },
        { id: '2', name: 'PASSION' },
        { id: '3', name: 'INTEGRITY' },
        { id: '4', name: 'EXCELLENCE' },
        { id: '5', name: 'TEAMWORK' },
      ];
  const image = data?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80';

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: '#111111',
        paddingTop: 'clamp(70px, 9vw, 120px)',
        paddingBottom: 'clamp(70px, 9vw, 120px)',
      }}
    >
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* Left: Values — 52% */}
          <div
            className="w-full lg:w-[52%] shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
            }}
          >
            <p
              className="font-sans uppercase tracking-[0.14em] mb-4"
              style={{ fontSize: '0.65rem', color: '#D6A54A' }}
            >
              {data?.eyebrow || 'OUR VALUES'}
            </p>
            <h2
              className="font-serif font-normal mb-10"
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
                lineHeight: '1.05',
                color: '#F5F2EA',
                maxWidth: '400px',
                whiteSpace: 'pre-line',
              }}
            >
              {heading}
            </h2>

            <div>
              {values.map((val, i) => {
                const isHovered = hoveredIndex === i;
                const num = String(i + 1).padStart(2, '0');
                return (
                  <div
                    key={val.id}
                    className="flex items-center cursor-default"
                    style={{
                      height: 'clamp(46px, 4.5vw, 62px)',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      borderBottom: i === values.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      transition: 'border-color 0.3s ease',
                      borderColor: isHovered ? 'rgba(214,165,74,0.3)' : undefined,
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span
                      className="font-sans shrink-0 transition-colors duration-300"
                      style={{
                        fontSize: '0.65rem',
                        color: '#D6A54A',
                        width: '32px',
                        opacity: isHovered ? 1 : 0.6,
                      }}
                    >
                      {num}
                    </span>
                    <span
                      className="font-sans uppercase tracking-[0.06em] flex-1 transition-all duration-300"
                      style={{
                        fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)',
                        color: '#F5F2EA',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      {val.name}
                    </span>
                    <span
                      className="font-sans transition-all duration-300 shrink-0"
                      style={{
                        fontSize: '0.8rem',
                        color: '#D6A54A',
                        transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Image — 48% */}
          <div
            className="w-full lg:w-[48%]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(26px)',
              transition: `opacity 0.9s ${EASE} 0.12s, transform 0.9s ${EASE} 0.12s`,
            }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={image}
                alt={data?.image_alt || 'Luxury event setup'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
