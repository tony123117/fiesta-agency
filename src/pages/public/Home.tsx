import { useState, useCallback } from 'react';
import { PageRenderer } from '@/components/public/PageRenderer';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { Page } from '@/lib/types';

export function Home() {
  const [seo, setSeo] = useState<{ title?: string; description?: string; ogImage?: string }>({});

  const handlePageLoaded = useCallback((page: Page | null) => {
    if (page) {
      setSeo({
        title: page.seo_title || undefined,
        description: page.seo_description || undefined,
        ogImage: page.og_image_url || undefined,
      });
    }
  }, []);

  useDocumentMeta({
    title: seo.title || 'Fiesta Agency | Events, Entertainment & Experiences in Rwanda',
    description: seo.description || 'Fiesta designs, produces and manages unforgettable weddings, celebrations, corporate events and premium experiences in Rwanda.',
    ogImage: seo.ogImage,
  });

  return <PageRenderer slug="home" onPageLoaded={handlePageLoaded} />;
}
export default Home;
