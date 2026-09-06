import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Star, Globe } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import type { StatsContent } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  events: Calendar,
  clients: Users,
  experience: Star,
  cities: Globe,
};

function getIconForLabel(label: string): React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> {
  const lower = label.toLowerCase();
  if (lower.includes('event') || lower.includes('production')) return ICON_MAP.events;
  if (lower.includes('client') || lower.includes('happy')) return ICON_MAP.clients;
  if (lower.includes('year') || lower.includes('experience')) return ICON_MAP.experience;
  if (lower.includes('cit') || lower.includes('countr') || lower.includes('operat')) return ICON_MAP.cities;
  return ICON_MAP.events;
}

export function StatsRenderer({ content }: { content: unknown }) {
  const data = content as StatsContent;
  const stats = data?.stats || [];
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.15 });
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    if (sectionVisible && !countersStarted) {
      setCountersStarted(true);
    }
  }, [sectionVisible, countersStarted]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      <div
        className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]"
        style={{
          paddingTop: 'clamp(60px, 8vw, 100px)',
          paddingBottom: 'clamp(60px, 8vw, 100px)',
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
          }}
        >
          {stats.slice(0, 5).map((stat, i) => (
            <div
              key={stat.id}
              className="text-center relative"
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.7s ${EASE} ${0.1 + i * 0.08}s, transform 0.7s ${EASE} ${0.1 + i * 0.08}s`,
              }}
            >
              {/* Vertical separator — not on first item */}
              {i > 0 && (
                <div
                  className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12"
                  style={{ backgroundColor: 'rgba(245,242,234,0.1)' }}
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4 md:mb-5">
                {(() => {
                  const Icon = getIconForLabel(stat.label);
                  return <Icon size={22} strokeWidth={1.2} className="text-gold" />;
                })()}
              </div>

              {/* Number */}
              <p
                className="font-serif font-light tracking-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 3.3vw, 3.25rem)',
                  color: '#F5F2EA',
                  lineHeight: '1',
                }}
              >
                {countersStarted ? stat.number : '0'}
              </p>

              {/* Label */}
              <p
                className="font-sans uppercase tracking-[0.18em] mt-3 md:mt-4"
                style={{
                  fontSize: '0.6rem',
                  color: '#A9A9A6',
                  lineHeight: '1.5',
                }}
              >
                {stat.label}
              </p>

              {/* Description */}
              {stat.description && (
                <p
                  className="font-sans mt-2 md:mt-3 hidden md:block"
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(169,169,166,0.7)',
                    lineHeight: '1.6',
                    maxWidth: '200px',
                    margin: '8px auto 0',
                  }}
                >
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
