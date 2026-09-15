import { useState, useEffect } from 'react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import type { Section } from '@/lib/types';
import { AboutHeroSection } from '@/components/public/about/AboutHeroSection';
import { AboutStorySection } from '@/components/public/about/AboutStorySection';
import { AboutMissionSection } from '@/components/public/about/AboutMissionSection';
import { AboutValuesSection } from '@/components/public/about/AboutValuesSection';
import { AboutTeamSection } from '@/components/public/about/AboutTeamSection';
import { AboutClosingSection } from '@/components/public/about/AboutClosingSection';

export function About() {
  const [sections, setSections] = useState<Section[]>([]);
  const [seo, setSeo] = useState<{ title?: string; description?: string; ogImage?: string }>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getPageBySlug('about');
        if (cancelled || !page) { setLoaded(true); return; }
        setSeo({
          title: page.seo_title || undefined,
          description: page.seo_description || undefined,
          ogImage: page.og_image_url || undefined,
        });
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

  useDocumentMeta({
    title: seo.title || 'About Fiesta Agency | Rwanda',
    description: seo.description || 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences across Rwanda.',
    ogImage: seo.ogImage,
    canonicalPath: '/about',
  });

  if (!loaded) return null;

  const get = (type: string) => sections.find(s => s.section_type === type)?.content || {};

  return (
    <>
      <AboutHeroSection content={get('about-intro')} />
      <AboutStorySection content={get('about-story')} />
      <AboutMissionSection content={get('about-mission')} />
      <AboutValuesSection content={get('about-values')} />
      <AboutTeamSection content={get('about-team')} />
      <AboutClosingSection content={get('about-closing')} />
    </>
  );
}

export default About;
