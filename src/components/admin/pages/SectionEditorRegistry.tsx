import type { SectionType } from '@/lib/types';
import { HeroCarouselEditor } from './editors/HeroCarouselEditor';
import { BrandStatementEditor } from './editors/BrandStatementEditor';
import { ServicesEditorialEditor } from './editors/ServicesEditorialEditor';
import { EventsEditorialEditor } from './editors/EventsEditorialEditor';
import { PortfolioGalleryEditor } from './editors/PortfolioGalleryEditor';
import { TestimonialsEditor } from './editors/TestimonialsEditor';
import { FAQEditor } from './editors/FAQEditor';
import { StatsEditor } from './editors/StatsEditor';
import { ProcessEditor } from './editors/ProcessEditor';
import { TextImageEditor } from './editors/TextImageEditor';
import { CTAEditor } from './editors/CTAEditor';
import { EditorialListEditor } from './editors/EditorialListEditor';
import { CinematicImageEditor } from './editors/CinematicImageEditor';
import { TeamMembersEditor } from './editors/TeamMembersEditor';
import { ImageCarouselEditor } from './editors/ImageCarouselEditor';
import { BlocksSectionEditor } from './BlocksSectionEditor';

export interface SectionEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export const sectionEditorRegistry: Partial<Record<SectionType, React.ComponentType<SectionEditorProps>>> = {
  'hero-carousel': HeroCarouselEditor,
  'brand-statement': BrandStatementEditor,
  'services-editorial': ServicesEditorialEditor,
  'events-editorial': EventsEditorialEditor,
  'portfolio-gallery': PortfolioGalleryEditor,
  'testimonials': TestimonialsEditor,
  'faq': FAQEditor,
  'stats': StatsEditor,
  'process': ProcessEditor,
  'text-image': TextImageEditor,
  'cta': CTAEditor,
  'editorial-list': EditorialListEditor,
  'cinematic-image': CinematicImageEditor,
  'team-members': TeamMembersEditor,
  'image-carousel': ImageCarouselEditor,
  'blocks': BlocksSectionEditor,
};
