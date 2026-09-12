// ── Blocks Section Renderer (Admin Canvas) ──
// Renders a section containing blocks in the admin canvas preview.
// Supports both legacy flat-block format and new layout (Container → Row → Column → Block) format.
// Detects format via content.layout vs content.blocks and routes accordingly.

import { useRef, useCallback } from 'react';
import { getBlockLabel } from '@/lib/blockTypes';
import { BlockRenderer } from './blocks/BlockRenderer';

import { LayoutRenderer } from '@/components/public/LayoutRenderer';
import { isLayoutContent, type LayoutContent } from '@/lib/layoutTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';

interface AdminBlocksRendererProps {
  content: unknown;
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
  sectionId?: string;
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

export function BlocksSectionRenderer({
  content,
  selectedBlockId,
  hoveredBlockId,
  onSelectBlock,
  onHoverBlock,
  blockDragSectionId,
  blockDragBlockId,
  blockDropTargetSectionId,
  blockDropTargetIndex,
  onBlockDragStart,
  onBlockDragOver,
  onBlockDrop,
  onBlockDragEnd,
  sectionId,
  layoutSelection,
  onSelectLayout,
  layoutDragState,
  onLayoutBlockDragStart,
  onLayoutBlockDragOver,
  onLayoutBlockDrop,
  onLayoutBlockDragEnd,
  columnResizeState,
  onColumnResizeStart,
  onColumnResizeMove,
  onColumnResizeCommit,
  onColumnResizeCancel,
}: AdminBlocksRendererProps) {
  const data = content as {
    blocks?: Array<{
      id: string;
      type?: string;
      content?: Record<string, unknown>;
      responsive?: { desktop?: { visible?: boolean } };
    }>;
  };
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const blocks = data?.blocks;
  const hasCanvasInteraction = !!(onSelectBlock || onHoverBlock);
  const isBlockDragging = !!(blockDragSectionId && blockDragBlockId);
  const isThisSectionDragging = blockDragSectionId === sectionId;

  const handleBlockMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isThisSectionDragging && onBlockDragOver && sectionId) {
      const rect = blockRefs.current.get(blocks?.[index]?.id)?.getBoundingClientRect();
      if (rect) {
        const midY = rect.top + rect.height / 2;
        const insertIndex = e.clientY < midY ? index : index + 1;
        onBlockDragOver(sectionId, Math.min(insertIndex, blocks?.length ?? 0));
      }
    }
  }, [isThisSectionDragging, onBlockDragOver, sectionId, blocks]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isThisSectionDragging && onBlockDrop) {
      onBlockDrop();
    }
  }, [isThisSectionDragging, onBlockDrop]);

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      blockRefs.current.set(id, el);
    } else {
      blockRefs.current.delete(id);
    }
  }, []);

  // ── New layout format: Container → Row → Column → Block ──
  if (isLayoutContent(data)) {
    return (
      <div className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <LayoutRenderer
            content={data as unknown as LayoutContent}
            viewport="desktop"
            renderBlock={(block) => (
              <BlockRenderer block={block as never} />
            )}
            layoutSelection={layoutSelection}
            onSelectLayout={onSelectLayout}
            sectionId={sectionId}
            layoutDragState={layoutDragState}
            onBlockDragStart={onLayoutBlockDragStart}
            onBlockDragOver={onLayoutBlockDragOver}
            onBlockDrop={onLayoutBlockDrop}
            onBlockDragEnd={onLayoutBlockDragEnd}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            hoveredBlockId={hoveredBlockId}
            onHoverBlock={onHoverBlock}
            columnResizeState={columnResizeState}
            onColumnResizeStart={onColumnResizeStart}
            onColumnResizeMove={onColumnResizeMove}
            onColumnResizeCommit={onColumnResizeCommit}
            onColumnResizeCancel={onColumnResizeCancel}
          />
        </div>
      </div>
    );
  }

  // ── Legacy flat-block format ──
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return (
      <div className="py-16 text-center bg-white/[0.02]">
        <p className="text-[0.8rem] text-stone/40">Empty section — add blocks to build content</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {blocks.map((block, index) => {
          if (!block.responsive?.desktop?.visible) return null;

          if (hasCanvasInteraction) {
            const isSelected = block.id === selectedBlockId;
            const isHovered = block.id === hoveredBlockId;
            const isDragSource = isThisSectionDragging && blockDragBlockId === block.id;

            // Drop indicator: show before this block if dropping at this index
            const showDropBefore = isBlockDragging && isThisSectionDragging
              && blockDropTargetSectionId === sectionId
              && blockDropTargetIndex === index;

            return (
              <div key={block.id}>
                {/* Drop indicator — before */}
                {showDropBefore && (
                  <div className="h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(214,166,79,0.5)] -mt-3 mb-3 transition-all" />
                )}

                <div
                  ref={(el) => setBlockRef(block.id, el)}
                  data-block-id={block.id}
                  draggable
                  className={`relative group/block transition-all ${
                    isDragSource
                      ? 'opacity-40 scale-[0.98]'
                      : isSelected
                      ? 'ring-2 ring-gold ring-offset-2 ring-offset-white'
                      : isHovered
                      ? 'ring-1 ring-gold/40 ring-offset-1 ring-offset-white'
                      : ''
                  }`}
                  onMouseDown={handleBlockMouseDown}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock?.(block.id);
                  }}
                  onMouseEnter={() => onHoverBlock?.(block.id)}
                  onMouseLeave={() => onHoverBlock?.(null)}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    if (onBlockDragStart && sectionId) {
                      onBlockDragStart(sectionId, block.id, index);
                    }
                  }}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onDragEnd={() => onBlockDragEnd?.()}
                >
                  {/* Block type label */}
                  {(isHovered || isSelected) && (
                    <div className="absolute -top-6 left-0 z-20 pointer-events-none">
                      <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
                        isSelected
                          ? 'bg-gold text-obsidian'
                          : 'bg-charcoal/80 text-gold/80 border border-gold/20'
                      }`}>
                        {getBlockLabel(block.type as 'heading' | 'text' | 'image' | 'button' | 'spacer')}
                      </span>
                    </div>
                  )}

                  {/* Drag handle for selected block */}
                  {isSelected && !isDragSource && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          if (onBlockDragStart && sectionId) {
                            onBlockDragStart(sectionId, block.id, index);
                          }
                        }}
                        className="w-5 h-3 bg-charcoal/90 border border-gold/30 rounded flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gold/20 transition-colors"
                        title="Drag to reorder"
                      >
                        <svg width="10" height="6" viewBox="0 0 10 6" className="text-gold/60">
                          <circle cx="2" cy="1" r="0.8" fill="currentColor" />
                          <circle cx="5" cy="1" r="0.8" fill="currentColor" />
                          <circle cx="8" cy="1" r="0.8" fill="currentColor" />
                          <circle cx="2" cy="4" r="0.8" fill="currentColor" />
                          <circle cx="5" cy="4" r="0.8" fill="currentColor" />
                          <circle cx="8" cy="4" r="0.8" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Resize/move affordances for selected block */}
                  {isSelected && !isDragSource && (
                    <>
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-gold/60 rounded-l cursor-ns-resize z-10" />
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-gold/60 rounded-r cursor-ns-resize z-10" />
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-6 h-2 bg-gold/60 rounded-t cursor-ew-resize z-10" />
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-6 h-2 bg-gold/60 rounded-b cursor-ew-resize z-10" />
                    </>
                  )}

                  <BlockRenderer block={block as never} />
                </div>

                {/* Drop indicator — after last block */}
                {index === blocks.length - 1 && isBlockDragging && isThisSectionDragging
                  && blockDropTargetSectionId === sectionId
                  && blockDropTargetIndex === blocks.length && (
                  <div className="h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(214,166,79,0.5)] mt-3 transition-all" />
                )}
              </div>
            );
          }

          return (
            <div key={block.id}>
              <BlockRenderer block={block as never} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
