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

  if (loading) return <PageSkeleton />;
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

function PageSkeleton() {
  return (
    <div
      className="w-full bg-obsidian animate-pulse"
      style={{ height: 'clamp(800px, 96vh, 1000px)' }}
      aria-hidden="true"
    >
      <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-center px-5 md:px-[4vw] lg:px-[5vw]">
        <div className="mb-8 h-3 w-40 rounded bg-white/10" />
        <div className="mb-4 h-16 w-full max-w-[700px] rounded bg-white/10 md:h-20" />
        <div className="mb-10 h-16 w-full max-w-[500px] rounded bg-white/10 md:h-20" />
        <div className="h-4 w-full max-w-[380px] rounded bg-white/[0.07]" />
      </div>
    </div>
  );
}

export default PageRenderer;