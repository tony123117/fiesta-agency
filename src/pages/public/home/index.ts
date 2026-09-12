// ── Home Page — All Components ──
// Single import point for the entire home page rendering pipeline.

// Core pipeline
export { Home, default } from '@/pages/public/Home';
export { PageRenderer, default as PageRendererDefault } from '@/components/public/PageRenderer';
export { SectionRenderer } from '@/components/public/SectionRenderer';
export { LayoutRenderer } from '@/components/public/LayoutRenderer';
export { BlocksSectionRenderer } from '@/components/public/BlocksSectionRenderer';

// Section renderers
export { HeroCarousel } from '@/components/public/HeroCarousel';
export { CMSBrandStatement } from '@/components/public/CMSBrandStatement';
export { ServicesRenderer } from '@/components/public/ServicesRenderer';
export { EventsRenderer } from '@/components/public/EventsRenderer';
export { PortfolioRenderer } from '@/components/public/PortfolioRenderer';
export { TestimonialsRenderer } from '@/components/public/TestimonialsRenderer';
export { FAQRenderer } from '@/components/public/FAQRenderer';
export { StatsRenderer } from '@/components/public/StatsRenderer';
export { CTARenderer } from '@/components/public/CTARenderer';
