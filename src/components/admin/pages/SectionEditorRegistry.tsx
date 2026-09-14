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
import { ServicesHeroEditor } from './editors/ServicesHeroEditor';
import { ServicesFeaturedEditor } from './editors/ServicesFeaturedEditor';
import { ServicesCardsEditor } from './editors/ServicesCardsEditor';
import { ServicesProcessEditor } from './editors/ServicesProcessEditor';
import { ServicesCTAEditor } from './editors/ServicesCTAEditor';
import { EventsHeroEditor } from './editors/EventsHeroEditor';
import { EventsCTAEditor } from './editors/EventsCTAEditor';
import { PortfolioHeroEditor } from './editors/PortfolioHeroEditor';
import { PortfolioFilteredGalleryEditor } from './editors/PortfolioFilteredGalleryEditor';
import { PortfolioFeaturedEditor } from './editors/PortfolioFeaturedEditor';
import { HWWHeroEditor } from './editors/HWWHeroEditor';
import { HWWIntroEditor } from './editors/HWWIntroEditor';
import { HWWProcessEditor } from './editors/HWWProcessEditor';
import { HWWBehindEditor } from './editors/HWWBehindEditor';
import { HWWWhyEditor } from './editors/HWWWhyEditor';
import { HWWCTAEditor } from './editors/HWWCTAEditor';
import { AboutHeroEditor } from './editors/AboutHeroEditor';
import { AboutStoryEditor } from './editors/AboutStoryEditor';
import { AboutMissionEditor } from './editors/AboutMissionEditor';
import { AboutValuesEditor } from './editors/AboutValuesEditor';
import { AboutTeamEditor } from './editors/AboutTeamEditor';
import { AboutClosingEditor } from './editors/AboutClosingEditor';
import { ContactHeroEditor } from './editors/ContactHeroEditor';
import { ContactInfoEditor } from './editors/ContactInfoEditor';
import { ContactLocationEditor } from './editors/ContactLocationEditor';
import { ContactCTAEditor } from './editors/ContactCTAEditor';
import { LegalPageEditor } from './editors/LegalPageEditor';
import { EventsFeaturedEditor } from './editors/EventsFeaturedEditor';
import { EventsFilterEditor } from './editors/EventsFilterEditor';
import { EventsUpcomingEditor } from './editors/EventsUpcomingEditor';
import { EventsPastEditor } from './editors/EventsPastEditor';

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
  'services-hero': ServicesHeroEditor,
  'services-featured': ServicesFeaturedEditor,
  'services-cards': ServicesCardsEditor,
  'services-process': ServicesProcessEditor,
  'services-cta': ServicesCTAEditor,
  'events-hero': EventsHeroEditor,
  'events-cta': EventsCTAEditor,
  'portfolio-hero': PortfolioHeroEditor,
  'portfolio-filtered-gallery': PortfolioFilteredGalleryEditor,
  'portfolio-featured': PortfolioFeaturedEditor,
  'hww-hero': HWWHeroEditor,
  'hww-intro': HWWIntroEditor,
  'hww-process': HWWProcessEditor,
  'hww-behind': HWWBehindEditor,
  'hww-why': HWWWhyEditor,
  'hww-cta': HWWCTAEditor,
  'about-intro': AboutHeroEditor,
  'about-story': AboutStoryEditor,
  'about-mission': AboutMissionEditor,
  'about-values': AboutValuesEditor,
  'about-team': AboutTeamEditor,
  'about-closing': AboutClosingEditor,
  'contact-hero': ContactHeroEditor,
  'contact-info': ContactInfoEditor,
  'contact-location': ContactLocationEditor,
  'contact-cta': ContactCTAEditor,
  'legal-page': LegalPageEditor,
  'events-featured': EventsFeaturedEditor,
  'events-filter': EventsFilterEditor,
  'events-upcoming': EventsUpcomingEditor,
  'events-past': EventsPastEditor,
};
