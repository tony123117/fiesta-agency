import type { Section, SectionType } from '@/lib/types';
import { HeroCarousel } from './HeroCarousel';
import { CMSBrandStatement } from './CMSBrandStatement';
import { ServicesRenderer } from './ServicesRenderer';
import { EventsRenderer } from './EventsRenderer';
import { PortfolioRenderer } from './PortfolioRenderer';
import { TestimonialsRenderer } from './TestimonialsRenderer';
import { FAQRenderer } from './FAQRenderer';
import { StatsRenderer } from './StatsRenderer';
import { ProcessRenderer } from './ProcessRenderer';
import { TextImageRenderer } from './TextImageRenderer';
import { CTARenderer } from './CTARenderer';
import { EditorialListRenderer } from './EditorialListRenderer';
import { CinematicImageRenderer } from './CinematicImageRenderer';
import { TeamMembersRenderer } from './TeamMembersRenderer';
import { ImageCarouselRenderer } from './ImageCarouselRenderer';
import { ServicesHero } from './services/ServicesHero';
import { ServicesFeatured } from './services/ServicesFeatured';
import { ServicesDirectory } from './services/ServicesDirectory';
import { ServicesPhilosophy } from './services/ServicesPhilosophy';
import { ServicesProcess } from './services/ServicesProcess';
import { ServicesImageStatement } from './services/ServicesImageStatement';
import { ServicesCTA as ServicesCTARenderer } from './services/ServicesCTA';
import { AboutIntro } from './about/AboutIntro';
import { AboutStory } from './about/AboutStory';
import { AboutFoundation } from './about/AboutFoundation';
import { AboutValues } from './about/AboutValues';
import { AboutWhy } from './about/AboutWhy';
import { AboutClosing } from './about/AboutClosing';

const renderers: Record<SectionType, React.ComponentType<{ content: unknown }>> = {
  'hero-carousel': HeroCarousel,
  'brand-statement': CMSBrandStatement,
  'services-editorial': ServicesRenderer,
  'events-editorial': EventsRenderer,
  'portfolio-gallery': PortfolioRenderer,
  'testimonials': TestimonialsRenderer,
  'faq': FAQRenderer,
  'stats': StatsRenderer,
  'process': ProcessRenderer,
  'text-image': TextImageRenderer,
  'cta': CTARenderer,
  'editorial-list': EditorialListRenderer,
  'cinematic-image': CinematicImageRenderer,
  'team-members': TeamMembersRenderer,
  'image-carousel': ImageCarouselRenderer,
  'services-hero': ServicesHero,
  'services-featured': ServicesFeatured,
  'services-directory': ServicesDirectory,
  'services-philosophy': ServicesPhilosophy,
  'services-process': ServicesProcess,
  'services-image-statement': ServicesImageStatement,
  'services-cta': ServicesCTARenderer,
  'about-intro': AboutIntro,
  'about-story': AboutStory,
  'about-foundation': AboutFoundation,
  'about-values': AboutValues,
  'about-why': AboutWhy,
  'about-closing': AboutClosing,
};

export function SectionRenderer({ section }: { section: Section }) {
  if (!section.published) return null;

  const type = section.section_type as SectionType;
  const Renderer = renderers[type];

  if (!Renderer) return null;

  return <Renderer content={section.content} />;
}
