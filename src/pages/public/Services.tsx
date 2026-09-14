import { useState, useEffect } from 'react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import type { Section } from '@/lib/types';
import { ServicesHero } from '@/components/public/services/ServicesHero';
import { ServicesFeatured } from '@/components/public/services/ServicesFeatured';
import { ServicesCards } from '@/components/public/services/ServicesCards';
import { StatsRenderer } from '@/components/public/StatsRenderer';
import { ServicesProcess } from '@/components/public/services/ServicesProcess';
import { TestimonialsRenderer } from '@/components/public/TestimonialsRenderer';
import { ServicesCTA } from '@/components/public/services/ServicesCTA';

/* ─── PAGE LOAD INTRO ─── */
function useIntro() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);
  return ready;
}

/* ─── SERVICES PAGE ─── */

export function Services() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const intro = useIntro();

  useDocumentMeta({
    title: 'Services | Fiesta Agency Rwanda',
    description: 'Explore our comprehensive event services - planning, production, entertainment and more.',
  });

  useEffect(() => {
    (async () => {
      try {
        const page = await getPageBySlug('services');
        if (!page) { setLoading(false); return; }
        const secs = await getSections(page.id);
        setSections(secs.filter((s: Section) => s.published));
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const get = (type: string) => sections.find(s => s.section_type === type)?.content || {};

  return (
    <div style={{
      opacity: intro ? 1 : 0,
      transform: intro ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw',
    }}>
      <ServicesHero content={get('services-hero')} intro={intro} />
      <ServicesFeatured content={get('services-featured')} loading={loading} />
      <ServicesCards content={get('services-cards')} loading={loading} />
      <StatsRenderer content={get('stats')} />
      <ServicesProcess content={get('services-process')} />
      <TestimonialsRenderer content={get('testimonials')} />
      <ServicesCTA content={get('services-cta')} />
    </div>
  );
}

export default Services;
