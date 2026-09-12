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
import { BlocksSectionRenderer } from './BlocksSectionRenderer';
import type { BlocksSectionRendererToolbarProps } from './BlocksSectionRenderer';
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
import type { BlockResponsiveBreakpoint } from '@/lib/blockTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';

export interface SectionRendererBlockSelection {
  selectedBlockId?: string | null;
  hoveredBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  onHoverBlock?: (id: string | null) => void;
  blockDragSectionId?: string | null;
  blockDragBlockId?: string | null;
  blockDropTargetSectionId?: string | null;
  blockDropTargetIndex?: number | null;
  onBlockDragStart?: (sectionId: string, blockId: string, fromIndex: number) => void;
  onBlockDragOver?: (sectionId: string, toIndex: number) => void;
  onBlockDrop?: () => void;
  onBlockDragEnd?: () => void;
  blockToolbar?: BlocksSectionRendererToolbarProps;
  viewport?: BlockResponsiveBreakpoint;
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  // Cross-column drag
  layoutDragState?: LayoutBlockDragState | null;
  onLayoutBlockDragStart?: (sectionId: string, blockId: string, containerId: string, rowId: string, columnId: string, index: number) => void;
  onLayoutBlockDragOver?: (containerId: string, rowId: string, columnId: string, index: number) => void;
  onLayoutBlockDrop?: () => void;
  onLayoutBlockDragEnd?: () => void;
  // Column resize
  columnResizeState?: {
    sectionId: string;
    containerId: string;
    rowId: string;
    colId1: string;
    colId2: string;
    initialWidth1: number;
    initialWidth2: number;
    currentWidth1: number;
    currentWidth2: number;
    viewport: 'desktop' | 'tablet' | 'mobile';
  } | null;
  onColumnResizeStart?: (sectionId: string, containerId: string, rowId: string, colId1: string, colId2: string, width1: number, width2: number, viewport: 'desktop' | 'tablet' | 'mobile') => void;
  onColumnResizeMove?: (width1: number, width2: number) => void;
  onColumnResizeCommit?: () => void;
  onColumnResizeCancel?: () => void;
}

const renderers: Record<SectionType, React.ComponentType<{ content: unknown; sectionId?: string } & SectionRendererBlockSelection>> = {
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
  'blocks': BlocksSectionRenderer,
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

export function SectionRenderer({ section, selectedBlockId, hoveredBlockId, onSelectBlock, onHoverBlock, blockDragSectionId, blockDragBlockId, blockDropTargetSectionId, blockDropTargetIndex, onBlockDragStart, onBlockDragOver, onBlockDrop, onBlockDragEnd, blockToolbar, viewport, layoutSelection, onSelectLayout, layoutDragState, onLayoutBlockDragStart, onLayoutBlockDragOver, onLayoutBlockDrop, onLayoutBlockDragEnd, columnResizeState, onColumnResizeStart, onColumnResizeMove, onColumnResizeCommit, onColumnResizeCancel }: { section: Section } & SectionRendererBlockSelection) {
  if (!section.published) return null;

  const type = section.section_type as SectionType;
  const Renderer = renderers[type];

  if (!Renderer) return null;

  return <Renderer content={section.content} sectionId={section.id} selectedBlockId={selectedBlockId} hoveredBlockId={hoveredBlockId} onSelectBlock={onSelectBlock} onHoverBlock={onHoverBlock} blockDragSectionId={blockDragSectionId} blockDragBlockId={blockDragBlockId} blockDropTargetSectionId={blockDropTargetSectionId} blockDropTargetIndex={blockDropTargetIndex} onBlockDragStart={onBlockDragStart} onBlockDragOver={onBlockDragOver} onBlockDrop={onBlockDrop} onBlockDragEnd={onBlockDragEnd} blockToolbar={blockToolbar} viewport={viewport} layoutSelection={layoutSelection} onSelectLayout={onSelectLayout} layoutDragState={layoutDragState} onLayoutBlockDragStart={onLayoutBlockDragStart} onLayoutBlockDragOver={onLayoutBlockDragOver} onLayoutBlockDrop={onLayoutBlockDrop} onLayoutBlockDragEnd={onLayoutBlockDragEnd} columnResizeState={columnResizeState} onColumnResizeStart={onColumnResizeStart} onColumnResizeMove={onColumnResizeMove} onColumnResizeCommit={onColumnResizeCommit} onColumnResizeCancel={onColumnResizeCancel} />;
}
