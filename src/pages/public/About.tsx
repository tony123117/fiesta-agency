import { useState, useCallback } from 'react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { PageRenderer } from '@/components/public/PageRenderer';
import type { Page } from '@/lib/types';

export function About() {
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
    title: seo.title || 'About Fiesta Agency | Rwanda',
    description: seo.description || 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences across Rwanda.',
    ogImage: seo.ogImage,
  });

  return <PageRenderer slug="about" onPageLoaded={handlePageLoaded} />;
}

export default About;
