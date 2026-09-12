import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { SectionRenderer } from '@/components/public/SectionRenderer';
import { getSectionLabel } from '@/lib/sectionTypes';
import { reorderSections } from '@/lib/sectionsService';
import { reorderBlocks } from '@/lib/blocksService';
import { FocalPointOverlay, getHeroSlides } from './FocalPointOverlay';
import type { Section, SectionType } from '@/lib/types';
import type { BlocksSectionRendererToolbarProps } from '@/components/public/BlocksSectionRenderer';
import type { BlockResponsiveBreakpoint } from '@/lib/blockTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';

type ViewportSize = '1440' | '1280' | '1024' | '768' | '390' | '375';

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  '1440': 1440,
  '1280': 1280,
  '1024': 1024,
  '768': 768,
  '390': 390,
  '375': 375,
};

const VIEWPORT_DEVICE: Record<ViewportSize, BlockResponsiveBreakpoint> = {
  '1440': 'desktop',
  '1280': 'desktop',
  '1024': 'desktop',
  '768': 'tablet',
  '390': 'mobile',
  '375': 'mobile',
};

const VIEWPORT_ICONS: Record<ViewportSize, typeof Monitor> = {
  '1440': Monitor,
  '1280': Monitor,
  '1024': Monitor,
  '768': Tablet,
  '390': Smartphone,
  '375': Smartphone,
};

const DEFAULT_ZOOM = 75;

interface VisualCanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onReorder?: (sections: Section[]) => void;
  onSectionUpdate?: (id: string, content: Record<string, unknown>) => void;
  onFocalPointChange?: (sectionId: string, slideIndex: number, focalX: number, focalY: number) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  blockToolbar?: BlocksSectionRendererToolbarProps;
  activeViewport?: BlockResponsiveBreakpoint;
  onViewportChange?: (viewport: BlockResponsiveBreakpoint) => void;
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  layoutDragState?: LayoutBlockDragState | null;
  onLayoutBlockDragStart?: (sectionId: string, blockId: string, containerId: string, rowId: string, columnId: string, index: number) => void;
  onLayoutBlockDragOver?: (containerId: string, rowId: string, columnId: string, index: number) => void;
  onLayoutBlockDrop?: () => void;
  onLayoutBlockDragEnd?: () => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
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

interface BlockDragState {
  sectionId: string;
  blockId: string;
  fromIndex: number;
}

interface BlockDropTarget {
  sectionId: string;
  toIndex: number;
}

export function VisualCanvas({
  sections,
  selectedSectionId,
  onSelectSection,
  onReorder,
  onSectionUpdate,
  onFocalPointChange,
  selectedBlockId,
  onSelectBlock,
  blockToolbar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activeViewport,
  onViewportChange,
  layoutSelection,
  onSelectLayout,
  layoutDragState,
  onLayoutBlockDragStart,
  onLayoutBlockDragOver,
  onLayoutBlockDrop,
  onLayoutBlockDragEnd,
  hoveredBlockId,
  onHoverBlock,
  columnResizeState,
  onColumnResizeStart,
  onColumnResizeMove,
  onColumnResizeCommit,
  onColumnResizeCancel,
}: VisualCanvasProps) {
  const [viewport, setViewport] = useState<ViewportSize>('1440');
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [localHoveredBlockId, setLocalHoveredBlockId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [blockDrag, setBlockDrag] = useState<BlockDragState | null>(null);
  const [blockDropTarget, setBlockDropTarget] = useState<BlockDropTarget | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use prop if provided, otherwise local state
  const effectiveHoveredBlockId = hoveredBlockId ?? localHoveredBlockId;
  const effectiveSetHoveredBlockId = onHoverBlock || setLocalHoveredBlockId;

  const viewportWidth = VIEWPORT_WIDTHS[viewport];
  const scale = zoom / 100;

  // Auto-fit: calculate zoom to fit canvas in container
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48; // padding
    const fitZoom = Math.min(100, Math.floor((containerWidth / viewportWidth) * 100));
    setZoom(Math.max(25, fitZoom));
  }, [viewportWidth]);

  // Fit on viewport change
  useEffect(() => {
    fitToScreen();
  }, [viewport, fitToScreen]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(150, z + 25));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(25, z - 25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
  }, []);

  // Section drag reorder
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  }, []);

  const handleDrop = useCallback((targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDropIndex(null);
      setIsDragging(false);
      return;
    }

    const reordered = [...sections];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setDragIndex(null);
    setDropIndex(null);
    setIsDragging(false);

    if (onReorder) {
      onReorder(reordered);
      reorderSections(reordered).catch(() => {});
    }
  }, [dragIndex, sections, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropIndex(null);
    setIsDragging(false);
  }, []);

  // ── Block drag reorder ──
  const handleBlockDragStart = useCallback((sectionId: string, blockId: string, fromIndex: number) => {
    setBlockDrag({ sectionId, blockId, fromIndex });
  }, []);

  const handleBlockDragOver = useCallback((sectionId: string, toIndex: number) => {
    if (!blockDrag || blockDrag.sectionId !== sectionId) return;
    setBlockDropTarget({ sectionId, toIndex });
  }, [blockDrag]);

  const handleBlockDrop = useCallback(() => {
    if (!blockDrag || !blockDropTarget) return;
    if (blockDrag.fromIndex === blockDropTarget.toIndex) {
      setBlockDrag(null);
      setBlockDropTarget(null);
      return;
    }

    const section = sections.find((s) => s.id === blockDrag.sectionId);
    if (section && onSectionUpdate) {
      const newContent = reorderBlocks(section.content, blockDrag.fromIndex, blockDropTarget.toIndex);
      onSectionUpdate(blockDrag.sectionId, newContent);
    }

    setBlockDrag(null);
    setBlockDropTarget(null);
  }, [blockDrag, blockDropTarget, sections, onSectionUpdate]);

  const handleBlockDragEnd = useCallback(() => {
    setBlockDrag(null);
    setBlockDropTarget(null);
  }, []);

  // Click outside to deselect
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas === 'true') {
      if (onSelectBlock) onSelectBlock(null);
      onSelectSection(null);
    }
  }, [onSelectSection, onSelectBlock]);

  // Keyboard: Escape to deselect (block first, then section)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedBlockId && onSelectBlock) {
          onSelectBlock(null);
        } else {
          onSelectSection(null);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSelectSection, selectedBlockId, onSelectBlock]);

  // Sections to render
  const renderSections = useMemo(() => {
    return sections.map((section, index) => {
      const isSelected = section.id === selectedSectionId;
      const isHovered = section.id === hoveredSectionId;
      const isDragOver = dropIndex === index;
      const label = getSectionLabel(section.section_type as SectionType);

      return (
        <div
          key={section.id}
          data-section-id={section.id}
          data-canvas="false"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          onMouseEnter={() => setHoveredSectionId(section.id)}
          onMouseLeave={() => setHoveredSectionId(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSection(section.id);
          }}
          className={`relative group/section transition-all ${
            isDragOver ? 'border-t-2 border-gold' : ''
          } ${isDragging && dragIndex === index ? 'opacity-50' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          {/* Editor overlay — hover outline */}
          {(isHovered && !isSelected) && (
            <div className="absolute inset-0 z-10 pointer-events-none border-2 border-gold/30 transition-all">
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-charcoal/90 border border-gold/30 rounded text-[0.6rem] font-medium text-gold/80 backdrop-blur-sm">
                {label}
              </div>
            </div>
          )}

          {/* Editor overlay — selected outline */}
          {isSelected && (
            <div className="absolute inset-0 z-10 pointer-events-none border-2 border-gold shadow-[0_0_0_4px_rgba(214,166,79,0.1)]">
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-gold/90 rounded text-[0.6rem] font-semibold text-obsidian">
                {label} — Editing
              </div>
              {/* Drag handle */}
              <div
                className="absolute top-2 right-2 w-6 h-6 bg-charcoal/90 border border-gold/30 rounded flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gold/20 transition-colors"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleDragStart(index);
                }}
                title="Drag to reorder"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-gold/60">
                  <circle cx="4" cy="2" r="1" fill="currentColor" />
                  <circle cx="8" cy="2" r="1" fill="currentColor" />
                  <circle cx="4" cy="6" r="1" fill="currentColor" />
                  <circle cx="8" cy="6" r="1" fill="currentColor" />
                  <circle cx="4" cy="10" r="1" fill="currentColor" />
                  <circle cx="8" cy="10" r="1" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}

          {/* Actual section content — production renderer */}
          <SectionRenderer
            section={{ ...section, published: true }}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={effectiveHoveredBlockId}
            onSelectBlock={onSelectBlock}
            onHoverBlock={effectiveSetHoveredBlockId}
            blockDragSectionId={blockDrag?.sectionId ?? null}
            blockDragBlockId={blockDrag?.blockId ?? null}
            blockDropTargetSectionId={blockDropTarget?.sectionId ?? null}
            blockDropTargetIndex={blockDropTarget?.toIndex ?? null}
            onBlockDragStart={handleBlockDragStart}
            onBlockDragOver={handleBlockDragOver}
            onBlockDrop={handleBlockDrop}
            onBlockDragEnd={handleBlockDragEnd}
            blockToolbar={blockToolbar}
            viewport={VIEWPORT_DEVICE[viewport]}
            layoutSelection={layoutSelection}
            onSelectLayout={onSelectLayout}
            layoutDragState={layoutDragState}
            onLayoutBlockDragStart={onLayoutBlockDragStart}
            onLayoutBlockDragOver={onLayoutBlockDragOver}
            onLayoutBlockDrop={onLayoutBlockDrop}
            onLayoutBlockDragEnd={onLayoutBlockDragEnd}
            columnResizeState={columnResizeState}
            onColumnResizeStart={onColumnResizeStart}
            onColumnResizeMove={onColumnResizeMove}
            onColumnResizeCommit={onColumnResizeCommit}
            onColumnResizeCancel={onColumnResizeCancel}
          />

          {/* Focal point overlay for hero-carousel sections */}
          {isSelected && section.section_type === 'hero-carousel' && onFocalPointChange && (
            <FocalPointOverlay
              slides={getHeroSlides(section.content)}
              currentSlideIndex={0}
              onChange={(slideIndex, focalX, focalY) => onFocalPointChange(section.id, slideIndex, focalX, focalY)}
              isActive={true}
            />
          )}
        </div>
      );
    });
  }, [sections, selectedSectionId, hoveredSectionId, dropIndex, dragIndex, isDragging, handleDragStart, handleDragOver, handleDrop, handleDragEnd, onSelectSection, onFocalPointChange, selectedBlockId, effectiveHoveredBlockId, onSelectBlock, blockDrag, blockDropTarget, handleBlockDragStart, handleBlockDragOver, handleBlockDrop, handleBlockDragEnd, blockToolbar, viewport]);

  return (
    <div className="flex flex-col h-full bg-charcoal">
      {/* Canvas Toolbar */}
      <div className="h-10 border-b border-white/[0.06] flex items-center justify-between px-3 flex-shrink-0 bg-charcoal">
        {/* Viewport Toggle */}
        <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.04] rounded">
          {([ '1440', '1280', '1024', '768', '390', '375' ] as ViewportSize[]).map((w) => {
            const Icon = VIEWPORT_ICONS[w];
            return (
              <button
                key={w}
                onClick={() => {
                  setViewport(w);
                  onViewportChange?.(VIEWPORT_DEVICE[w]);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[0.55rem] font-medium transition-all ${
                  viewport === w
                    ? 'bg-gold/15 text-gold shadow-sm'
                    : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
                }`}
                title={`${w}px`}
              >
                <Icon size={11} />
                <span>{w}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 25}
            className="p-1 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={resetZoom}
            className="px-1.5 py-0.5 text-[0.55rem] font-mono text-white/40 hover:text-white/60 rounded hover:bg-white/[0.04] transition-colors min-w-[36px] text-center"
            title="Reset zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= 150}
            className="p-1 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={13} />
          </button>
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <button
            onClick={fitToScreen}
            className="p-1 text-white/30 hover:text-white/60 rounded transition-colors"
            title="Fit to screen"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-obsidian/50"
        onClick={handleCanvasClick}
      >
        {viewport !== '1440' && (
          <div className="text-center py-1.5 text-[0.55rem] text-white/20 bg-white/[0.02] border-b border-white/[0.04]">
            Previewing at {viewportWidth}px — {VIEWPORT_DEVICE[viewport]} view
          </div>
        )}
        <div
          className="min-h-full flex justify-center py-6"
          style={{ minWidth: viewportWidth * scale + 48 }}
        >
          {/* Scaled Canvas */}
          <div
            ref={canvasRef}
            className="origin-top bg-white"
            style={{
              width: viewportWidth,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            {sections.length > 0 ? (
              renderSections
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-10 h-10 rounded-full bg-stone/10 flex items-center justify-center mb-4">
                  <div className="w-5 h-5 border border-stone/20 rounded" />
                </div>
                <p className="text-[0.85rem] font-medium text-stone/60 mb-1">No sections yet</p>
                <p className="text-[0.75rem] text-stone/40">Add sections from the panel to preview your page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
