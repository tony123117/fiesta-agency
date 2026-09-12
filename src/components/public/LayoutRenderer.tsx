// ── Layout Renderer ──
// Phase 31.2 — Layout Rendering Engine
// Phase 31.3 — Admin layout selection overlays
// Phase 31.4 — Cross-column block drag & drop
//
// Renders the Container → Row → Column → Block hierarchy.
// Uses a renderBlock callback so both public and admin can reuse this.
// Handles responsive breakpoints and safe fallbacks for malformed data.
// When layoutSelection is provided (admin mode), renders selection outlines.
// When layoutDragState is provided, renders drop indicators for cross-column drag.

import { useRef, useCallback, useMemo, type ReactNode } from 'react';
import type {
  LayoutContent,
  LayoutContainer,
  LayoutRow,
  LayoutColumn,
  LayoutSpacing,
  LayoutBreakpoint,
  LayoutHorizontalAlignment,
  LayoutVerticalAlignment,
} from '@/lib/layoutTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';
import { getBlockLabel } from '@/lib/blockTypes';
import type { Block } from '@/lib/blockTypes';

// ═══════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════

interface ColumnResizeState {
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
}

export interface LayoutRendererProps {
  content: LayoutContent;
  viewport?: LayoutBreakpoint;
  renderBlock: (block: { id: string; type: string; content: Record<string, unknown>; responsive?: Record<string, unknown> }, index: number) => ReactNode;
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  sectionId?: string;
  // Cross-column drag
  layoutDragState?: LayoutBlockDragState | null;
  onBlockDragStart?: (sectionId: string, blockId: string, containerId: string, rowId: string, columnId: string, index: number) => void;
  onBlockDragOver?: (containerId: string, rowId: string, columnId: string, index: number) => void;
  onBlockDrop?: () => void;
  onBlockDragEnd?: () => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
  // Column resize
  columnResizeState?: ColumnResizeState | null;
  onColumnResizeStart?: (sectionId: string, containerId: string, rowId: string, colId1: string, colId2: string, width1: number, width2: number, viewport: 'desktop' | 'tablet' | 'mobile') => void;
  onColumnResizeMove?: (width1: number, width2: number) => void;
  onColumnResizeCommit?: () => void;
  onColumnResizeCancel?: () => void;
}

// ═══════════════════════════════════════════
// MAIN RENDERER
// ═══════════════════════════════════════════

export function LayoutRenderer({
  content,
  viewport = 'desktop',
  renderBlock,
  layoutSelection,
  onSelectLayout,
  sectionId,
  layoutDragState,
  onBlockDragStart,
  onBlockDragOver,
  onBlockDrop,
  onBlockDragEnd,
  selectedBlockId,
  onSelectBlock,
  hoveredBlockId,
  onHoverBlock,
  columnResizeState,
  onColumnResizeStart,
  onColumnResizeMove,
  onColumnResizeCommit,
}: LayoutRendererProps) {
  const containers = content?.layout?.containers;

  if (!Array.isArray(containers) || containers.length === 0) {
    return null;
  }

  return (
    <>
      {containers.map((container) => (
        <LayoutContainerRenderer
          key={container.id}
          container={container}
          viewport={viewport}
          renderBlock={renderBlock}
          layoutSelection={layoutSelection}
          onSelectLayout={onSelectLayout}
          sectionId={sectionId}
          layoutDragState={layoutDragState}
          onBlockDragStart={onBlockDragStart}
          onBlockDragOver={onBlockDragOver}
          onBlockDrop={onBlockDrop}
          onBlockDragEnd={onBlockDragEnd}
          selectedBlockId={selectedBlockId}
          onSelectBlock={onSelectBlock}
          hoveredBlockId={hoveredBlockId}
          onHoverBlock={onHoverBlock}
          columnResizeState={columnResizeState}
          onColumnResizeStart={onColumnResizeStart}
          onColumnResizeMove={onColumnResizeMove}
          onColumnResizeCommit={onColumnResizeCommit}
        />
      ))}
    </>
  );
}

// ═══════════════════════════════════════════
// CONTAINER
// ═══════════════════════════════════════════

function LayoutContainerRenderer({
  container,
  viewport,
  renderBlock,
  layoutSelection,
  onSelectLayout,
  sectionId,
  layoutDragState,
  onBlockDragStart,
  onBlockDragOver,
  onBlockDrop,
  onBlockDragEnd,
  selectedBlockId,
  onSelectBlock,
  hoveredBlockId,
  onHoverBlock,
  columnResizeState,
  onColumnResizeStart,
  onColumnResizeMove,
  onColumnResizeCommit,
}: {
  container: LayoutContainer;
  viewport: LayoutBreakpoint;
  renderBlock: LayoutRendererProps['renderBlock'];
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  sectionId?: string;
  layoutDragState?: LayoutBlockDragState | null;
  onBlockDragStart?: LayoutRendererProps['onBlockDragStart'];
  onBlockDragOver?: LayoutRendererProps['onBlockDragOver'];
  onBlockDrop?: LayoutRendererProps['onBlockDrop'];
  onBlockDragEnd?: LayoutRendererProps['onBlockDragEnd'];
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
  columnResizeState?: LayoutRendererProps['columnResizeState'];
  onColumnResizeStart?: LayoutRendererProps['onColumnResizeStart'];
  onColumnResizeMove?: LayoutRendererProps['onColumnResizeMove'];
  onColumnResizeCommit?: LayoutRendererProps['onColumnResizeCommit'];
}) {
  const settings = container.settings?.[viewport] ?? {};
  if (settings.visible === false) return null;

  const gap = resolveSpacing(settings.gap ?? 'md');
  const padding = resolveSpacing(settings.padding ?? 'md');
  const maxWidth = resolveMaxWidth(settings.maxWidth ?? 'lg');

  const isContainerSelected = layoutSelection?.level === 'container' && layoutSelection.containerId === container.id;
  const isAdminMode = !!layoutSelection || !!onSelectLayout;

  return (
    <div
      // FIX: container now actually stacks its rows (flex flex-col) with the
      // gap applied as a real Tailwind class, instead of passing a class
      // name ("gap-4") into `style={{ gap }}`, which is invalid CSS and was
      // silently doing nothing.
      className={`mx-auto flex w-full flex-col ${maxWidth} ${padding} ${gap} ${
        isAdminMode ? 'relative group/layout' : ''
      } ${isContainerSelected ? 'ring-2 ring-gold ring-offset-1 ring-offset-white' : ''}`}
      onClick={(e) => {
        if (isAdminMode && onSelectLayout) {
          e.stopPropagation();
          onSelectLayout({ level: 'container', containerId: container.id });
        }
      }}
    >
      {/* Container label — admin only */}
      {isAdminMode && (
        <div className={`absolute -top-5 left-0 z-20 pointer-events-none transition-opacity ${
          isContainerSelected ? 'opacity-100' : 'opacity-0 group-hover/layout:opacity-100'
        }`}>
          <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
            isContainerSelected
              ? 'bg-gold text-obsidian'
              : 'bg-charcoal/80 text-gold/80 border border-gold/20'
          }`}>
            Container
          </span>
        </div>
      )}

      {Array.isArray(container.rows) &&
        container.rows.map((row) => (
          <LayoutRowRenderer
            key={row.id}
            row={row}
            container={container}
            viewport={viewport}
            renderBlock={renderBlock}
            layoutSelection={layoutSelection}
            onSelectLayout={onSelectLayout}
            sectionId={sectionId}
            layoutDragState={layoutDragState}
            onBlockDragStart={onBlockDragStart}
            onBlockDragOver={onBlockDragOver}
            onBlockDrop={onBlockDrop}
            onBlockDragEnd={onBlockDragEnd}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            hoveredBlockId={hoveredBlockId}
            onHoverBlock={onHoverBlock}
            // FIX: these five were being swallowed here before — Container
            // received them but never forwarded them to Row, so column
            // resize handles never actually worked.
            columnResizeState={columnResizeState}
            onColumnResizeStart={onColumnResizeStart}
            onColumnResizeMove={onColumnResizeMove}
            onColumnResizeCommit={onColumnResizeCommit}
          />
        ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// ROW
// ═══════════════════════════════════════════

function LayoutRowRenderer({
  row,
  container,
  viewport,
  renderBlock,
  layoutSelection,
  onSelectLayout,
  sectionId,
  layoutDragState,
  onBlockDragStart,
  onBlockDragOver,
  onBlockDrop,
  onBlockDragEnd,
  selectedBlockId,
  onSelectBlock,
  hoveredBlockId,
  onHoverBlock,
  columnResizeState,
  onColumnResizeStart,
  onColumnResizeMove,
  onColumnResizeCommit,
}: {
  row: LayoutRow;
  container: LayoutContainer;
  viewport: LayoutBreakpoint;
  renderBlock: LayoutRendererProps['renderBlock'];
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  sectionId?: string;
  layoutDragState?: LayoutBlockDragState | null;
  onBlockDragStart?: LayoutRendererProps['onBlockDragStart'];
  onBlockDragOver?: LayoutRendererProps['onBlockDragOver'];
  onBlockDrop?: LayoutRendererProps['onBlockDrop'];
  onBlockDragEnd?: LayoutRendererProps['onBlockDragEnd'];
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
  columnResizeState?: LayoutRendererProps['columnResizeState'];
  onColumnResizeStart?: LayoutRendererProps['onColumnResizeStart'];
  onColumnResizeMove?: LayoutRendererProps['onColumnResizeMove'];
  onColumnResizeCommit?: LayoutRendererProps['onColumnResizeCommit'];
}) {
  const settings = row.settings?.[viewport] ?? {};

  const gap = resolveSpacing(settings.gap ?? 'md');
  const columnsMode = settings.columns ?? 'grid';
  const alignment = resolveHorizontalAlignment(settings.alignment ?? 'start');
  const verticalAlign = resolveVerticalAlignment(settings.verticalAlignment ?? 'start');

  const isRowSelected = layoutSelection?.level === 'row' && layoutSelection.rowId === row.id;
  const isAdminMode = !!layoutSelection || !!onSelectLayout;

  const columns = useMemo(() => Array.isArray(row.columns) ? row.columns : [], [row.columns]);

  const resizeRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ startX: number; colIdx: number; w1: number; w2: number } | null>(null);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, colIdx: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onColumnResizeStart || !sectionId) return;
    const col1 = columns[colIdx];
    const col2 = columns[colIdx + 1];
    if (!col1 || !col2) return;
    const w1 = col1.settings?.[viewport]?.width ?? 6;
    const w2 = col2.settings?.[viewport]?.width ?? 6;
    const pairTotal = w1 + w2;
    resizeStartRef.current = { startX: e.clientX, colIdx, w1, w2 };
    onColumnResizeStart(sectionId, container.id, row.id, col1.id, col2.id, w1, w2, viewport as 'desktop' | 'tablet' | 'mobile');

    const handleMove = (me: MouseEvent) => {
      if (!resizeStartRef.current || !onColumnResizeMove || !resizeRef.current) return;
      const gridWidth = resizeRef.current.getBoundingClientRect().width;
      const pixelsPerUnit = gridWidth / 12;
      const delta = Math.round((me.clientX - resizeStartRef.current.startX) / pixelsPerUnit);
      const newW1 = Math.max(1, Math.min(pairTotal - 1, resizeStartRef.current.w1 + delta));
      const newW2 = pairTotal - newW1;
      onColumnResizeMove(newW1, newW2);
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      resizeStartRef.current = null;
      onColumnResizeCommit?.();
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp, { once: true });
  }, [columns, viewport, sectionId, container.id, row.id, onColumnResizeStart, onColumnResizeMove, onColumnResizeCommit]);

  if (settings.visible === false) return null;

  // Stack mode → single column, all columns render vertically
  if (columnsMode === 'stack') {
    return (
      <div
        className={`flex flex-col ${gap} ${isAdminMode ? 'relative group/row' : ''} ${isRowSelected ? 'ring-1 ring-blue-400/50 ring-offset-1 ring-offset-white' : ''}`}
        style={{ alignItems: alignment }}
        onClick={(e) => {
          if (isAdminMode && onSelectLayout) {
            e.stopPropagation();
            onSelectLayout({ level: 'row', containerId: container.id, rowId: row.id });
          }
        }}
      >
        {isAdminMode && (
          <div className={`absolute -top-5 left-0 z-20 pointer-events-none transition-opacity ${
            isRowSelected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'
          }`}>
            <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
              isRowSelected
                ? 'bg-blue-400 text-obsidian'
                : 'bg-charcoal/80 text-blue-400/80 border border-blue-400/20'
            }`}>
              Row
            </span>
          </div>
        )}
        {Array.isArray(row.columns) &&
          row.columns.map((col) => (
            <LayoutColumnRenderer
              key={col.id}
              column={col}
              row={row}
              container={container}
              viewport={viewport}
              renderBlock={renderBlock}
              layoutSelection={layoutSelection}
              onSelectLayout={onSelectLayout}
              sectionId={sectionId}
              layoutDragState={layoutDragState}
              onBlockDragStart={onBlockDragStart}
              onBlockDragOver={onBlockDragOver}
              onBlockDrop={onBlockDrop}
              onBlockDragEnd={onBlockDragEnd}
              selectedBlockId={selectedBlockId}
              onSelectBlock={onSelectBlock}
              hoveredBlockId={hoveredBlockId}
              onHoverBlock={onHoverBlock}
            />
          ))}
      </div>
    );
  }

  // Use live resize widths if actively resizing this row
  const isResizingThisRow = columnResizeState?.sectionId === sectionId
    && columnResizeState?.containerId === container.id
    && columnResizeState?.rowId === row.id;

  const displayColumns = isResizingThisRow && columnResizeState
    ? columns.map((col) => {
        if (col.id === columnResizeState.colId1) {
          return { ...col, _displayWidth: columnResizeState.currentWidth1 };
        }
        if (col.id === columnResizeState.colId2) {
          return { ...col, _displayWidth: columnResizeState.currentWidth2 };
        }
        return col;
      })
    : columns;

  const displayGridTemplate = displayColumns.map((col) => {
    const w = (col as { _displayWidth?: number })._displayWidth ?? col.settings?.[viewport]?.width ?? 6;
    return `span ${w}`;
  }).join(' ');

  return (
    <div
      ref={resizeRef}
      className={`relative ${gap} ${verticalAlign} ${isAdminMode ? 'group/row' : ''} ${isRowSelected ? 'ring-1 ring-blue-400/50 ring-offset-1 ring-offset-white' : ''}`}
      style={{ display: 'grid', gridTemplateColumns: displayGridTemplate }}
      onClick={(e) => {
        if (isAdminMode && onSelectLayout) {
          e.stopPropagation();
          onSelectLayout({ level: 'row', containerId: container.id, rowId: row.id });
        }
      }}
    >
      {isAdminMode && (
        <div className={`absolute -top-5 left-0 z-20 pointer-events-none transition-opacity ${
          isRowSelected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'
        }`}>
          <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
            isRowSelected
              ? 'bg-blue-400 text-obsidian'
              : 'bg-charcoal/80 text-blue-400/80 border border-blue-400/20'
          }`}>
            Row
          </span>
        </div>
      )}
      {Array.isArray(displayColumns) &&
        displayColumns.map((col, colIdx) => {
          const origCol = columns[colIdx];
          if (!origCol) return null;
          return (
            <div key={origCol.id} className="relative">
              <LayoutColumnRenderer
                column={origCol}
                row={row}
                container={container}
                viewport={viewport}
                renderBlock={renderBlock}
                layoutSelection={layoutSelection}
                onSelectLayout={onSelectLayout}
                sectionId={sectionId}
                layoutDragState={layoutDragState}
                onBlockDragStart={onBlockDragStart}
                onBlockDragOver={onBlockDragOver}
                onBlockDrop={onBlockDrop}
                onBlockDragEnd={onBlockDragEnd}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                hoveredBlockId={hoveredBlockId}
                onHoverBlock={onHoverBlock}
              />
              {/* Resize handle between adjacent columns */}
              {isAdminMode && colIdx < displayColumns.length - 1 && (
                <div
                  className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize z-30 group/resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, colIdx)}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-white/10 group-hover/resize:bg-gold/60 group-hover/resize:h-12 transition-all rounded-full" />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

// ═══════════════════════════════════════════
// COLUMN
// ═══════════════════════════════════════════

function LayoutColumnRenderer({
  column,
  row,
  container,
  viewport,
  renderBlock,
  layoutSelection,
  onSelectLayout,
  sectionId,
  layoutDragState,
  onBlockDragStart,
  onBlockDragOver,
  onBlockDrop,
  onBlockDragEnd,
  selectedBlockId,
  onSelectBlock,
  hoveredBlockId,
  onHoverBlock,
}: {
  column: LayoutColumn;
  row: LayoutRow;
  container: LayoutContainer;
  viewport: LayoutBreakpoint;
  renderBlock: LayoutRendererProps['renderBlock'];
  layoutSelection?: LayoutSelection | null;
  onSelectLayout?: (selection: LayoutSelection | null) => void;
  sectionId?: string;
  layoutDragState?: LayoutBlockDragState | null;
  onBlockDragStart?: LayoutRendererProps['onBlockDragStart'];
  onBlockDragOver?: LayoutRendererProps['onBlockDragOver'];
  onBlockDrop?: LayoutRendererProps['onBlockDrop'];
  onBlockDragEnd?: LayoutRendererProps['onBlockDragEnd'];
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  hoveredBlockId?: string | null;
  onHoverBlock?: (id: string | null) => void;
}) {
  const settings = column.settings?.[viewport] ?? {};

  const padding = resolveSpacing(settings.padding ?? 'none');
  const verticalAlign = resolveVerticalAlignment(settings.verticalAlignment ?? 'start');

  const isColumnSelected = layoutSelection?.level === 'column' && layoutSelection.columnId === column.id;
  const isAdminMode = !!layoutSelection || !!onSelectLayout;
  const width = settings.width || 6;

  const isDragSource = layoutDragState?.sourceColumnId === column.id;
  const isDragTarget = layoutDragState?.targetColumnId === column.id && !isDragSource;
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!layoutDragState || !onBlockDragOver || !sectionId) return;

    const blocks = column.blocks;
    let insertIndex = blocks.length;

    for (let i = 0; i < blocks.length; i++) {
      const blockEl = blockRefs.current.get(blocks[i].id);
      if (blockEl) {
        const rect = blockEl.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          insertIndex = i;
          break;
        }
      }
    }

    onBlockDragOver(container.id, row.id, column.id, insertIndex);
  }, [layoutDragState, onBlockDragOver, sectionId, column.blocks, container.id, row.id, column.id]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!layoutDragState || !onBlockDrop) return;
    onBlockDrop();
  }, [layoutDragState, onBlockDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement;
    if (related && e.currentTarget.contains(related)) return;
  }, []);

  if (settings.visible === false) return null;

  const getShowDropBefore = (index: number) => {
    if (!layoutDragState || !isDragTarget) return false;
    return layoutDragState.targetIndex === index;
  };

  const showDropAtEnd = isDragTarget && layoutDragState && layoutDragState.targetIndex >= column.blocks.length;

  return (
    <div
      className={`flex flex-col gap-4 ${padding} ${verticalAlign} ${isAdminMode ? 'relative group/col min-h-[2rem]' : ''} ${isColumnSelected ? 'ring-1 ring-green-400/50 ring-offset-1 ring-offset-white' : ''} ${isDragTarget ? 'ring-2 ring-gold/40 ring-offset-1 ring-offset-white' : ''}`}
      onClick={(e) => {
        if (isAdminMode && onSelectLayout) {
          e.stopPropagation();
          onSelectLayout({ level: 'column', containerId: container.id, rowId: row.id, columnId: column.id });
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragEnter={(e) => { e.preventDefault(); }}
    >
      {isAdminMode && (
        <div className={`absolute -top-5 left-0 z-20 pointer-events-none transition-opacity ${
          isColumnSelected ? 'opacity-100' : 'opacity-0 group-hover/col:opacity-100'
        }`}>
          <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
            isColumnSelected
              ? 'bg-green-400 text-obsidian'
              : 'bg-charcoal/80 text-green-400/80 border border-green-400/20'
          }`}>
            Col {width}/12
          </span>
        </div>
      )}

      {isAdminMode && column.blocks.length === 0 && (
        <div
          className={`flex items-center justify-center min-h-[3rem] border rounded text-[0.6rem] transition-colors ${
            isDragTarget
              ? 'border-gold/50 bg-gold/[0.05] text-gold/60'
              : 'border-dashed border-white/[0.08] text-white/20'
          }`}
        >
          {isDragTarget ? 'Drop here' : 'Empty column'}
        </div>
      )}

      {Array.isArray(column.blocks) &&
        column.blocks.map((block, i) => {
          const blockIsSelected = selectedBlockId === block.id;
          const blockIsHovered = hoveredBlockId === block.id;
          const isDragSourceBlock = isDragSource && layoutDragState?.blockId === block.id;

          return (
            <div key={block.id}>
              {getShowDropBefore(i) && (
                <div className="h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(214,166,79,0.5)] -mt-2 mb-2 transition-all" />
              )}

              <div
                ref={(el) => { if (el) blockRefs.current.set(block.id, el); else blockRefs.current.delete(block.id); }}
                data-block-id={block.id}
                data-column-id={column.id}
                data-row-id={row.id}
                data-container-id={container.id}
                draggable
                className={`relative group/block transition-all ${
                  isDragSourceBlock
                    ? 'opacity-40 scale-[0.98]'
                    : blockIsSelected
                    ? 'ring-2 ring-gold ring-offset-2 ring-offset-white'
                    : blockIsHovered
                    ? 'ring-1 ring-gold/40 ring-offset-1 ring-offset-white'
                    : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock?.(block.id);
                }}
                onMouseEnter={() => onHoverBlock?.(block.id)}
                onMouseLeave={() => onHoverBlock?.(null)}
                onDragStart={(e) => {
                  e.stopPropagation();
                  if (onBlockDragStart && sectionId) {
                    onBlockDragStart(sectionId, block.id, container.id, row.id, column.id, i);
                  }
                }}
                onDragEnd={() => onBlockDragEnd?.()}
              >
                {(blockIsHovered || blockIsSelected) && !isDragSourceBlock && (
                  <div className="absolute -top-6 left-0 z-20 pointer-events-none">
                    <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
                      blockIsSelected
                        ? 'bg-gold text-obsidian'
                        : 'bg-charcoal/80 text-gold/80 border border-gold/20'
                    }`}>
                      {getBlockLabel(block.type as Block['type'])}
                    </span>
                  </div>
                )}

                {blockIsSelected && !isDragSourceBlock && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        if (onBlockDragStart && sectionId) {
                          onBlockDragStart(sectionId, block.id, container.id, row.id, column.id, i);
                        }
                      }}
                      className="w-5 h-3 bg-charcoal/90 border border-gold/30 rounded flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gold/20 transition-colors"
                      title="Drag to reorder or move to another column"
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

                {renderBlock(block as unknown as Parameters<typeof renderBlock>[0], i)}
              </div>

              {i === column.blocks.length - 1 && showDropAtEnd && (
                <div className="h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(214,166,79,0.5)] mt-2 transition-all" />
              )}
            </div>
          );
        })}
    </div>
  );
}

// ═══════════════════════════════════════════
// SPACING HELPERS
// ═══════════════════════════════════════════

function resolveSpacing(spacing: LayoutSpacing): string {
  const map: Record<LayoutSpacing, string> = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  return map[spacing] ?? 'gap-4';
}

function resolveMaxWidth(maxWidth: string): string {
  const map: Record<string, string> = {
    none: '',
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };
  return map[maxWidth] ?? 'max-w-6xl';
}

function resolveHorizontalAlignment(alignment: LayoutHorizontalAlignment): string {
  const map: Record<LayoutHorizontalAlignment, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch',
  };
  return map[alignment] ?? 'justify-start';
}

function resolveVerticalAlignment(alignment: LayoutVerticalAlignment): string {
  const map: Record<LayoutVerticalAlignment, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  return map[alignment] ?? 'items-start';
}