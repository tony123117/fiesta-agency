import { useState, useEffect } from 'react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import type { Section } from '@/lib/types';
import { SectionRenderer } from '@/components/public/SectionRenderer';

/* ─── HOW WE WORK PAGE ─── */

export function HowWeWork() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);

  useDocumentMeta({
    title: 'How We Work | Fiesta Agency Rwanda',
    description: 'Discover our five-phase process for planning and producing extraordinary events.',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getPageBySlug('how-we-work');
        if (cancelled || !page) { setLoaded(true); return; }
        const secs = await getSections(page.id);
        if (cancelled) return;
        setSections(secs.filter((s: Section) => s.published));
      } catch {
        // CMS unavailable — show nothing
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!loaded) return null;

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

export default HowWeWork;
