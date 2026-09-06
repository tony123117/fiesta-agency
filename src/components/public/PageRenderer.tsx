import { useEffect, useState } from 'react';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import { SectionRenderer } from './SectionRenderer';
import type { Page, Section } from '@/lib/types';

interface PageRendererProps {
  slug: string;
  onHasContent?: (hasContent: boolean) => void;
  onPageLoaded?: (page: Page | null) => void;
}

export function PageRenderer({ slug, onHasContent, onPageLoaded }: PageRendererProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getPageBySlug(slug);
        if (!cancelled) onPageLoaded?.(page ?? null);
        if (!page || !page.published || cancelled) {
          if (!cancelled) {
            setLoading(false);
            onHasContent?.(false);
          }
          return;
        }
        const secs = await getSections(page.id);
        const published = secs.filter((s) => s.published);
        if (!cancelled) {
          setSections(published);
          onHasContent?.(published.length > 0);
        }
      } catch {
        if (!cancelled) {
          onPageLoaded?.(null);
          onHasContent?.(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, onHasContent, onPageLoaded]);

  if (loading) return null;
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
