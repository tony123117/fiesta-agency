import { useState, useRef, useCallback, useEffect } from 'react';
import { Monitor, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { SectionRenderer } from '@/components/public/SectionRenderer';
import { reorderSections } from '@/lib/sectionsService';
import { reorderBlocks } from '@/lib/blocksService';
import { FocalPointOverlay, getHeroSlides } from './FocalPointOverlay';
import type { Section } from '@/lib/types';
import type { BlocksSectionRendererToolbarProps } from '@/components/public/BlocksSectionRenderer';
import type { BlockResponsiveBreakpoint } from '@/lib/blockTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';

type ViewportSize = '1440' | '1280' | '1024';

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  '1440': 1440,
  '1280': 1280,
  '1024': 1024,
};

const VIEWPORT_DEVICE: Record<ViewportSize, BlockResponsiveBreakpoint> = {
  '1440': 'desktop',
  '1280': 'desktop',
  '1024': 'desktop',
};

const VIEWPORT_ICONS: Record<ViewportSize, typeof Monitor> = {
  '1440': Monitor,
  '1280': Monitor,
  '1024': Monitor,
};

const DEFAULT_ZOOM = 75;

const SECTION_PLACEHOLDER_HEIGHT = 200;

interface VisualCanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onReorder?: (sections: Section[]) => void;
  onSectionUpdate?: (id: string, content: Record<string, unknown>) => void;
  onFocalPointChange?: (sectionId: string, slideIndex: number, focalX: number, focalY: number) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  isPreview?: boolean;
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

export function VisualCanvas({
  sections,
  selectedSectionId,
  onSelectSection,
  onReorder,
  onSectionUpdate,
  onFocalPointChange,
  selectedBlockId,
  onSelectBlock,
  isPreview = true,
  blockToolbar,
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
  const [localHoveredBlockId, setLocalHoveredBlockId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [blockDrag, setBlockDrag] = useState<{ sectionId: string; blockId: string; fromIndex: number } | null>(null);
  const [blockDropTarget, setBlockDropTarget] = useState<{ sectionId: string; toIndex: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deferred rendering: track which sections are visible in the scroll viewport
  const [mountedSections, setMountedSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const effectiveHoveredBlockId = hoveredBlockId ?? localHoveredBlockId;
  const effectiveSetHoveredBlockId = onHoverBlock || setLocalHoveredBlockId;

  const viewportWidth = VIEWPORT_WIDTHS[viewport];
  const zoomFactor = zoom / 100;

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48;
    const fitZoom = Math.min(100, Math.floor((containerWidth / viewportWidth) * 100));
    setZoom(Math.max(25, fitZoom));
  }, [viewportWidth]);

  useEffect(() => { fitToScreen(); }, [viewport, fitToScreen]);

  // IntersectionObserver to mount/unmount sections as they scroll in/out
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setMountedSections((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-section-id');
            if (!id) continue;
            if (entry.isIntersecting) {
              next.add(id);
            }
          }
          return next;
        });
      },
      {
        root: scrollContainer,
        rootMargin: '200px 0px',
        threshold: 0,
      }
    );

    // Observe all section placeholder elements
    sectionRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections]);

  // Always mount selected section
  useEffect(() => {
    if (selectedSectionId) {
      setMountedSections((prev) => {
        if (prev.has(selectedSectionId)) return prev;
        const next = new Set(prev);
        next.add(selectedSectionId);
        return next;
      });
    }
  }, [selectedSectionId]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(150, z + 25)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(25, z - 25)), []);
  const resetZoom = useCallback(() => setZoom(DEFAULT_ZOOM), []);

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

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas === 'true') {
      if (onSelectBlock) onSelectBlock(null);
      onSelectSection(null);
    }
  }, [onSelectSection, onSelectBlock]);

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

  const registerSectionRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
      observerRef.current?.observe(el);
    } else {
      const existing = sectionRefs.current.get(id);
      if (existing) observerRef.current?.unobserve(existing);
      sectionRefs.current.delete(id);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-charcoal">
      {/* Canvas Toolbar */}
      <div className="h-10 border-b border-white/[0.06] flex items-center justify-between px-3 flex-shrink-0 bg-charcoal">
        <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.04] rounded">
          {(['1440', '1280', '1024'] as ViewportSize[]).map((w) => {
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

        <div className="flex items-center gap-1">
          <button onClick={zoomOut} disabled={zoom <= 25} className="p-1 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors" title="Zoom out">
            <ZoomOut size={13} />
          </button>
          <button onClick={resetZoom} className="px-1.5 py-0.5 text-[0.55rem] font-mono text-white/40 hover:text-white/60 rounded hover:bg-white/[0.04] transition-colors min-w-[36px] text-center" title="Reset zoom">
            {zoom}%
          </button>
          <button onClick={zoomIn} disabled={zoom >= 150} className="p-1 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors" title="Zoom in">
            <ZoomIn size={13} />
          </button>
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <button onClick={fitToScreen} className="p-1 text-white/30 hover:text-white/60 rounded transition-colors" title="Fit to screen">
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-obsidian/50" onClick={handleCanvasClick}>
        {viewport !== '1440' && (
          <div className="text-center py-1.5 text-[0.55rem] text-white/20 bg-white/[0.02] border-b border-white/[0.04]">
            Previewing at {viewportWidth}px — {VIEWPORT_DEVICE[viewport]} view
          </div>
        )}
        <div className="min-h-full flex justify-center py-6">
          <div
            className="bg-white overflow-hidden"
            style={{
              width: viewportWidth,
              zoom: zoomFactor,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            {sections.length > 0 ? (
              sections.map((section) => {
                const isMounted = mountedSections.has(section.id);
                const isSelected = selectedSectionId === section.id;

                return (
                  <div
                    key={section.id}
                    data-section-id={section.id}
                    ref={(el) => registerSectionRef(section.id, el)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSection(section.id);
                    }}
                    className={`relative cursor-pointer transition-shadow duration-150 ${
                      isSelected
                        ? 'ring-2 ring-gold/50 ring-offset-2 ring-offset-white'
                        : 'hover:ring-2 hover:ring-gold/20 hover:ring-offset-1 hover:ring-offset-white'
                    }`}
                  >
                    {isMounted ? (
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
                        isPreview={isPreview}
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
                    ) : (
                      <div
                        className="bg-stone/5 flex items-center justify-center border-b border-stone/10"
                        style={{ height: SECTION_PLACEHOLDER_HEIGHT, width: viewportWidth }}
                      >
                        <span className="text-[0.65rem] text-stone/30">{section.section_type}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center" style={{ width: viewportWidth }}>
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

      {/* Focal point overlay */}
      {selectedSectionId && (() => {
        const selected = sections.find(s => s.id === selectedSectionId);
        if (selected && selected.section_type === 'hero-carousel' && onFocalPointChange) {
          return (
            <div className="absolute inset-0 z-30 pointer-events-auto">
              <FocalPointOverlay
                slides={getHeroSlides(selected.content)}
                currentSlideIndex={0}
                onChange={(slideIndex, focalX, focalY) => onFocalPointChange(selected.id, slideIndex, focalX, focalY)}
                isActive={true}
              />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
