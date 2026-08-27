import { useState, useEffect } from 'react';
import { Reveal } from '@/components/Reveal';
import type { Testimonial } from '@/lib/types';

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const published = testimonials.filter((t) => t.published).sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (published.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % published.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [published.length]);

  if (published.length === 0) return null;

  const current = published[active];

  return (
    <section className="py-24 md:py-32 bg-charcoal">
      <div className="container-narrow text-center">
        <Reveal>
          <span className="label-gold mb-4 block">Words From Our Clients</span>
          <h2 className="font-serif text-section font-light text-ivory mb-16">
            What they remember.
          </h2>
        </Reveal>

        <div className="relative min-h-[200px] flex items-center justify-center">
          <blockquote
            key={active}
            className="font-serif text-2xl md:text-3xl font-light italic text-ivory leading-relaxed max-w-3xl animate-fade-in"
          >
            "{current.quote}"
          </blockquote>
        </div>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">{current.client_name}</p>
          <p className="text-xs text-ivory-muted mt-1">
            {current.event_type}{current.location && ` • ${current.location}`}
          </p>
        </div>

        {published.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {published.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1 transition-all duration-500 ${i === active ? 'w-10 bg-gold' : 'w-5 bg-charcoal-border hover:bg-ivory-muted'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
