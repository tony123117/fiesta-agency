// ── Layout System Types ──
// Phase 31.1 — Architecture Only
//
// Introduces a structured layout hierarchy:
//   Container → Row → Column → Block
//
// Blocks remain the existing Block type from blockTypes.ts.
// This file defines only the layout container system.

import type { Block, BlockResponsiveBreakpoint } from '@/lib/blockTypes';

// ── Breakpoint (reuses existing terminology) ──

export type LayoutBreakpoint = BlockResponsiveBreakpoint; // 'desktop' | 'tablet' | 'mobile'

// ── Spacing Scale (reuses block spacing) ──

export type LayoutSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Grid Width ──
// Columns use a 12-column grid system.
// A column with width 6 occupies 6/12 = 50% of the row.

export type ColumnWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// ── Horizontal Alignment ──

export type LayoutHorizontalAlignment = 'start' | 'center' | 'end' | 'stretch';

// ── Vertical Alignment ──

export type LayoutVerticalAlignment = 'start' | 'center' | 'end' | 'stretch';

// ── Stack Order (for responsive stacking) ──

export type StackOrder = 'none' | 'first' | 'last' | number;

// ═══════════════════════════════════════════
// RESPONSIVE OVERRIDES
// ═══════════════════════════════════════════

export interface LayoutContainerResponsive {
  visible?: boolean;
  gap?: LayoutSpacing;
  padding?: LayoutSpacing;
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface LayoutRowResponsive {
  visible?: boolean;
  gap?: LayoutSpacing;
  alignment?: LayoutHorizontalAlignment;
  verticalAlignment?: LayoutVerticalAlignment;
  columns?: 'stack' | 'grid'; // stack = vertical, grid = side-by-side
}

export interface LayoutColumnResponsive {
  visible?: boolean;
  width?: ColumnWidth;
  verticalAlignment?: LayoutVerticalAlignment;
  stackOrder?: StackOrder;
  padding?: LayoutSpacing;
}

// ═══════════════════════════════════════════
// LAYOUT ELEMENTS
// ═══════════════════════════════════════════

export interface LayoutContainerResponsiveSet {
  desktop: LayoutContainerResponsive;
  tablet: LayoutContainerResponsive;
  mobile: LayoutContainerResponsive;
}

export interface LayoutRowResponsiveSet {
  desktop: LayoutRowResponsive;
  tablet: LayoutRowResponsive;
  mobile: LayoutRowResponsive;
}

export interface LayoutColumnResponsiveSet {
  desktop: LayoutColumnResponsive;
  tablet: LayoutColumnResponsive;
  mobile: LayoutColumnResponsive;
}

export interface LayoutColumn {
  id: string;
  settings: LayoutColumnResponsiveSet;
  blocks: Block[];
}

export interface LayoutRow {
  id: string;
  settings: LayoutRowResponsiveSet;
  columns: LayoutColumn[];
}

export interface LayoutContainer {
  id: string;
  settings: LayoutContainerResponsiveSet;
  rows: LayoutRow[];
}

// ═══════════════════════════════════════════
// SECTION CONTENT (NEW LAYOUT FORMAT)
// ═══════════════════════════════════════════

export interface LayoutContent {
  layout: {
    containers: LayoutContainer[];
  };
}

// ═══════════════════════════════════════════
// TYPE GUARDS
// ═══════════════════════════════════════════

export function isLayoutContent(
  content: Record<string, unknown> | null | undefined
): content is LayoutContent {
  if (!content || typeof content !== 'object') return false;
  const layout = (content as Record<string, unknown>).layout;
  if (!layout || typeof layout !== 'object') return false;
  const containers = (layout as Record<string, unknown>).containers;
  return Array.isArray(containers);
}

export function isLegacyBlocksContent(
  content: Record<string, unknown> | null | undefined
): boolean {
  if (!content || typeof content !== 'object') return false;
  return Array.isArray((content as Record<string, unknown>).blocks);
}

// ═══════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createLayoutColumn(width: ColumnWidth = 6): LayoutColumn {
  return {
    id: uid(),
    settings: {
      desktop: { visible: true, width },
      tablet: { visible: true },
      mobile: { visible: true },
    },
    blocks: [],
  };
}

export function createLayoutRow(columnWidths: ColumnWidth[] = [6, 6]): LayoutRow {
  return {
    id: uid(),
    settings: {
      desktop: { visible: true, gap: 'md', alignment: 'start', columns: 'grid' },
      tablet: { visible: true, columns: 'grid' },
      mobile: { visible: true, columns: 'stack' },
    },
    columns: columnWidths.map((w) => createLayoutColumn(w)),
  };
}

export function createLayoutContainer(): LayoutContainer {
  return {
    id: uid(),
    settings: {
      desktop: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
      tablet: { visible: true },
      mobile: { visible: true },
    },
    rows: [createLayoutRow()],
  };
}

/** Wrap legacy flat blocks into the layout structure. */
export function wrapLegacyBlocks(blocks: Block[]): LayoutContent {
  const column = createLayoutColumn(12);
  column.blocks = blocks;

  const row = createLayoutRow([12]);
  row.columns = [column];

  const container = createLayoutContainer();
  container.rows = [row];

  return { layout: { containers: [container] } };
}

// ═══════════════════════════════════════════
// CROSS-COLUMN BLOCK DRAG STATE
// ═══════════════════════════════════════════

export interface LayoutBlockDragState {
  /** The block being dragged */
  blockId: string;
  /** Source location */
  sourceSectionId: string;
  sourceContainerId: string;
  sourceRowId: string;
  sourceColumnId: string;
  sourceIndex: number;
  /** Current drop target (null when not hovering a valid target) */
  targetContainerId: string | null;
  targetRowId: string | null;
  targetColumnId: string | null;
  targetIndex: number;
}
