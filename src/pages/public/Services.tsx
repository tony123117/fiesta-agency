import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CTASection } from '@/components/public/CTASection';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { Service } from '@/lib/types';

export function Services() {
  useDocumentMeta({
    title: 'Services — Fiesta Agency',
    description: 'Event planning, production, weddings, corporate events and private celebrations by Fiesta.',
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('services').select('*').eq('published', true).order('sort_order');
      setServices((data || []) as Service[]);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">What We Create</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              From idea to experience.
            </h1>
            <p className="mt-8 text-lg text-ivory-muted max-w-2xl leading-relaxed">
              From intimate celebrations to large-scale productions, Fiesta brings creative direction, planning and execution together under one roof.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-obsidian">
        <div className="container-lux">
          {loading ? (
            <div className="space-y-16">
              {[1, 2, 3].map((i) => <div key={i} className="h-80 skeleton" />)}
            </div>
          ) : services.length === 0 ? (
            <Reveal>
              <div className="text-center py-20">
                <p className="font-serif text-2xl italic text-ivory-muted">No services published yet.</p>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-0">
              {services.map((service, i) => (
                <ServiceDetailRow key={service.id} service={service} index={i} reverse={i % 2 === 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}

function ServiceDetailRow({ service, index, reverse }: { service: Service; index: number; reverse: boolean }) {
  const items = service.details?.items || [];

  return (
    <div className="group border-t border-charcoal-border last:border-b py-12 md:py-20">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
        <div className="lg:col-span-5 lg:[direction:ltr]">
          <Reveal>
            <span className="font-serif text-6xl md:text-7xl font-light text-gold/40 block mb-6">0{index + 1}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-ivory mb-4 uppercase tracking-wide">
              {service.title}
            </h2>
            <p className="text-ivory-muted leading-relaxed mb-8">{service.description}</p>
            {items.length > 0 && (
              <ul className="space-y-3">
                {items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-ivory/70">
                    <span className="block w-1.5 h-1.5 bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/plan-your-event" className="btn-ghost mt-8">
              Plan Your Event <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:[direction:ltr]">
          <Reveal>
            <div className="relative overflow-hidden aspect-[16/10]">
              <img
                src={service.image_url || ''}
                alt={service.image_alt || service.title}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
