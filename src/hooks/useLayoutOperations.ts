// ── Layout Operations ──
// Phase 31 — Layout Editing
//
// Pure functions for layout CRUD operations.
// Each function takes sections + params and returns updated sections.
// The caller (PageBuilder) handles history push + state update.

import type { Section } from '@/lib/types';
import type { Block, BlockType } from '@/lib/blockTypes';
import { createBlock, getBlockDefaultContent } from '@/lib/blockTypes';
import type {
  LayoutContent,
  LayoutContainer,
  LayoutRow,
  LayoutColumn,
  ColumnWidth,
} from '@/lib/layoutTypes';
import { isLayoutContent, createLayoutContainer } from '@/lib/layoutTypes';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function getLayoutContent(section: Section): LayoutContent | null {
  const content = section.content as Record<string, unknown> | null;
  if (!content || !isLayoutContent(content)) return null;
  return content as unknown as LayoutContent;
}

function immerLayout(
  sections: Section[],
  sectionId: string,
  recipe: (content: LayoutContent) => LayoutContent
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const layout = getLayoutContent(s);
    if (!layout) return s;
    const next = recipe(layout);
    return { ...s, content: next as unknown as Record<string, unknown> };
  });
}

// ── Selection Types ──

export type LayoutSelectionLevel = 'container' | 'row' | 'column';

export interface LayoutSelection {
  level: LayoutSelectionLevel;
  containerId: string;
  rowId?: string;
  columnId?: string;
}

// ── Container Operations ──

export function addContainer(sections: Section[], sectionId: string): Section[] {
  const container = createLayoutContainer();
  return immerLayout(sections, sectionId, (content) => ({
    layout: { containers: [...content.layout.containers, container] },
  }));
}

export function updateContainer(
  sections: Section[],
  sectionId: string,
  containerId: string,
  patch: Partial<LayoutContainer['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              settings: {
                desktop: { ...c.settings.desktop, ...patch },
                tablet: { ...c.settings.tablet, ...patch },
                mobile: { ...c.settings.mobile, ...patch },
              },
            }
          : c
      ),
    },
  }));
}

export function updateContainerResponsive(
  sections: Section[],
  sectionId: string,
  containerId: string,
  breakpoint: 'desktop' | 'tablet' | 'mobile',
  patch: Partial<LayoutContainer['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              settings: {
                ...c.settings,
                [breakpoint]: { ...c.settings[breakpoint], ...patch },
              },
            }
          : c
      ),
    },
  }));
}

export function deleteContainer(
  sections: Section[],
  sectionId: string,
  containerId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.filter((c) => c.id !== containerId),
    },
  }));
}

// ── Row Operations ──

export function addRow(
  sections: Section[],
  sectionId: string,
  containerId: string
): Section[] {
  const row: LayoutRow = {
    id: uid(),
    settings: {
      desktop: { visible: true, gap: 'md', columns: 'grid' },
      tablet: { visible: true, gap: 'md', columns: 'grid' },
      mobile: { visible: true, gap: 'md', columns: 'stack' },
    },
    columns: [
      {
        id: uid(),
        settings: {
          desktop: { visible: true, width: 12 },
          tablet: { visible: true, width: 12 },
          mobile: { visible: true, width: 12 },
        },
        blocks: [],
      },
    ],
  };

  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId ? { ...c, rows: [...c.rows, row] } : c
      ),
    },
  }));
}

export function updateRow(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  patch: Partial<LayoutRow['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      settings: {
                        desktop: { ...r.settings.desktop, ...patch },
                        tablet: { ...r.settings.tablet, ...patch },
                        mobile: { ...r.settings.mobile, ...patch },
                      },
                    }
                  : r
              ),
            }
          : c
      ),
    },
  }));
}

export function updateRowResponsive(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  breakpoint: 'desktop' | 'tablet' | 'mobile',
  patch: Partial<LayoutRow['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      settings: {
                        ...r.settings,
                        [breakpoint]: { ...r.settings[breakpoint], ...patch },
                      },
                    }
                  : r
              ),
            }
          : c
      ),
    },
  }));
}

export function deleteRow(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? { ...c, rows: c.rows.filter((r) => r.id !== rowId) }
          : c
      ),
    },
  }));
}

// ── Column Operations ──

export function addColumn(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) => {
                if (r.id !== rowId) return r;
                const existingTotal = r.columns.reduce(
                  (sum, col) => sum + (col.settings.desktop.width || 6), 0
                );
                const newWidth: ColumnWidth = Math.min(12 - existingTotal, Math.floor(12 / (r.columns.length + 1))) as ColumnWidth;
                if (newWidth < 1) return r;

                const newCol: LayoutColumn = {
                  id: uid(),
                  settings: {
                    desktop: { visible: true, width: newWidth },
                    tablet: { visible: true, width: 12 },
                    mobile: { visible: true, width: 12 },
                  },
                  blocks: [],
                };

                const totalCols = r.columns.length + 1;
                const targetWidth = Math.floor(12 / totalCols);
                const remainder = 12 - targetWidth * totalCols;

                const redistributed = [...r.columns, newCol].map((col, i) => {
                  const w = i < remainder ? targetWidth + 1 : targetWidth;
                  return {
                    ...col,
                    settings: {
                      ...col.settings,
                      desktop: { ...col.settings.desktop, width: w as ColumnWidth },
                    },
                  };
                });

                return { ...r, columns: redistributed };
              }),
            }
          : c
      ),
    },
  }));
}

export function updateColumn(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  columnId: string,
  patch: Partial<LayoutColumn['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((col) =>
                        col.id === columnId
                          ? {
                              ...col,
                              settings: {
                                desktop: { ...col.settings.desktop, ...patch },
                                tablet: { ...col.settings.tablet, ...patch },
                                mobile: { ...col.settings.mobile, ...patch },
                              },
                            }
                          : col
                      ),
                    }
                  : r
              ),
            }
          : c
      ),
    },
  }));
}

export function updateColumnResponsive(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  columnId: string,
  breakpoint: 'desktop' | 'tablet' | 'mobile',
  patch: Partial<LayoutColumn['settings']['desktop']>
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((col) =>
                        col.id === columnId
                          ? {
                              ...col,
                              settings: {
                                ...col.settings,
                                [breakpoint]: { ...col.settings[breakpoint], ...patch },
                              },
                            }
                          : col
                      ),
                    }
                  : r
              ),
            }
          : c
      ),
    },
  }));
}

export function deleteColumn(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  columnId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows
                .map((r) => {
                  if (r.id !== rowId) return r;
                  const target = r.columns.find((col) => col.id === columnId);
                  if (!target) return r;
                  if (target.blocks && target.blocks.length > 0) return r;

                  const remaining = r.columns.filter((col) => col.id !== columnId);
                  if (remaining.length === 0) return null;

                  const totalCols = remaining.length;
                  const targetWidth = Math.floor(12 / totalCols);
                  const remainder = 12 - targetWidth * totalCols;

                  const redistributed = remaining.map((col, i) => {
                    const w = i < remainder ? targetWidth + 1 : targetWidth;
                    return {
                      ...col,
                      settings: {
                        ...col.settings,
                        desktop: { ...col.settings.desktop, width: w as ColumnWidth },
                      },
                    };
                  });

                  return { ...r, columns: redistributed };
                })
                .filter(Boolean) as LayoutRow[],
            }
          : c
      ),
    },
  }));
}

// ── Helpers ──

export function canDeleteColumn(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  columnId: string
): boolean {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return false;
  const layout = getLayoutContent(section);
  if (!layout) return false;
  const container = layout.layout.containers.find((c) => c.id === containerId);
  if (!container) return false;
  const row = container.rows.find((r) => r.id === rowId);
  if (!row) return false;
  const column = row.columns.find((col) => col.id === columnId);
  return !!column && (!column.blocks || column.blocks.length === 0);
}

export function hasLayoutContent(sections: Section[], sectionId: string): boolean {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return false;
  return getLayoutContent(section) !== null;
}

export function findLayoutPath(
  sections: Section[],
  sectionId: string,
  containerId?: string,
  rowId?: string,
  columnId?: string
): { container?: LayoutContainer; row?: LayoutRow; column?: LayoutColumn } {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return {};
  const layout = getLayoutContent(section);
  if (!layout) return {};

  const container = layout.layout.containers.find((c) => c.id === containerId);
  if (!container || !rowId) return { container };
  const row = container.rows.find((r) => r.id === rowId);
  if (!row || !columnId) return { container, row };
  const column = row.columns.find((col) => col.id === columnId);
  return { container, row, column };
}

// ── Cross-column block movement ──

export function moveBlockAcrossColumns(
  sections: Section[],
  sectionId: string,
  blockId: string,
  sourceContainerId: string,
  sourceRowId: string,
  sourceColumnId: string,
  targetContainerId: string,
  targetRowId: string,
  targetColumnId: string,
  targetIndex: number
): Section[] {
  return immerLayout(sections, sectionId, (content) => {
    const targetContainer = content.layout.containers.find((c) => c.id === targetContainerId);
    if (!targetContainer) return content;
    const targetRow = targetContainer.rows.find((r) => r.id === targetRowId);
    if (!targetRow) return content;
    const targetColumn = targetRow.columns.find((col) => col.id === targetColumnId);
    if (!targetColumn) return content;

    let movedBlock: Block | null = null;

    const newContainers = content.layout.containers.map((c) => {
      if (c.id !== sourceContainerId) return c;
      return {
        ...c,
        rows: c.rows.map((r) => {
          if (r.id !== sourceRowId) return r;
          return {
            ...r,
            columns: r.columns.map((col) => {
              if (col.id !== sourceColumnId) return col;
              const blockIndex = col.blocks.findIndex((b) => b.id === blockId);
              if (blockIndex === -1) return col;
              movedBlock = col.blocks[blockIndex];
              const newBlocks = [...col.blocks];
              newBlocks.splice(blockIndex, 1);
              return { ...col, blocks: newBlocks };
            }),
          };
        }),
      };
    });

    if (!movedBlock) return content;

    return {
      layout: {
        containers: newContainers.map((c) => {
          if (c.id !== targetContainerId) return c;
          return {
            ...c,
            rows: c.rows.map((r) => {
              if (r.id !== targetRowId) return r;
              return {
                ...r,
                columns: r.columns.map((col) => {
                  if (col.id !== targetColumnId) return col;
                  const newBlocks = [...col.blocks];
                  const insertAt = Math.min(targetIndex, newBlocks.length);
                  newBlocks.splice(insertAt, 0, movedBlock!);
                  return { ...col, blocks: newBlocks };
                }),
              };
            }),
          };
        }),
      },
    };
  });
}

// ── Same-column block reorder ──
// direction: -1 = up, 1 = down

export function reorderBlockInColumn(
  sections: Section[],
  sectionId: string,
  blockId: string,
  direction: -1 | 1
): Section[] {
  return immerLayout(sections, sectionId, (content) => {
    // Find the block's column
    for (const container of content.layout.containers) {
      for (const row of container.rows) {
        for (const col of row.columns) {
          const fromIndex = col.blocks.findIndex((b) => b.id === blockId);
          if (fromIndex === -1) continue;
          const toIndex = fromIndex + direction;
          if (toIndex < 0 || toIndex >= col.blocks.length) return content;
          const newBlocks = [...col.blocks];
          const [moved] = newBlocks.splice(fromIndex, 1);
          newBlocks.splice(toIndex, 0, moved);
          return {
            layout: {
              containers: content.layout.containers.map((c) => {
                if (c.id !== container.id) return c;
                return {
                  ...c,
                  rows: c.rows.map((r) => {
                    if (r.id !== row.id) return r;
                    return {
                      ...r,
                      columns: r.columns.map((col2) => {
                        if (col2.id !== col.id) return col2;
                        return { ...col2, blocks: newBlocks };
                      }),
                    };
                  }),
                };
              }),
            },
          };
        }
      }
    }
    return content;
  });
}

// ── Column resize (adjacent pair) ──

export function resizeColumnPair(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  colId1: string,
  colId2: string,
  newWidth1: number,
  newWidth2: number,
  viewport: 'desktop' | 'tablet' | 'mobile'
): Section[] {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return sections;
  const layout = getLayoutContent(section);
  if (!layout) return sections;
  const container = layout.layout.containers.find((c) => c.id === containerId);
  if (!container) return sections;
  const row = container.rows.find((r) => r.id === rowId);
  if (!row) return sections;
  const c1 = row.columns.find((c) => c.id === colId1);
  const c2 = row.columns.find((c) => c.id === colId2);
  if (!c1 || !c2) return sections;

  const existingW1 = c1.settings[viewport]?.width ?? 6;
  const existingW2 = c2.settings[viewport]?.width ?? 6;
  const pairTotal = existingW1 + existingW2;

  const clamped1 = Math.max(1, Math.min(pairTotal - 1, newWidth1)) as ColumnWidth;
  const clamped2 = Math.max(1, Math.min(pairTotal - 1, pairTotal - clamped1)) as ColumnWidth;
  if (clamped1 + clamped2 !== pairTotal) return sections;

  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) =>
        c.id === containerId
          ? {
              ...c,
              rows: c.rows.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((col) => {
                        if (col.id === colId1) {
                          return {
                            ...col,
                            settings: {
                              ...col.settings,
                              [viewport]: { ...col.settings[viewport], width: clamped1 },
                            },
                          };
                        }
                        if (col.id === colId2) {
                          return {
                            ...col,
                            settings: {
                              ...col.settings,
                              [viewport]: { ...col.settings[viewport], width: clamped2 },
                            },
                          };
                        }
                        return col;
                      }),
                    }
                  : r
              ),
            }
          : c
      ),
    },
  }));
}

// ═══════════════════════════════════════════
// BLOCK OPERATIONS (LAYOUT SECTIONS)
// ═══════════════════════════════════════════

export function duplicateBlockInLayout(
  sections: Section[],
  sectionId: string,
  blockId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => {
    for (const container of content.layout.containers) {
      for (const row of container.rows) {
        for (const col of row.columns) {
          const idx = col.blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) continue;
          const original = col.blocks[idx];
          const dup: Block = {
            ...original,
            id: uid(),
            content: { ...original.content },
            responsive: JSON.parse(JSON.stringify(original.responsive)),
          };
          const newBlocks = [...col.blocks];
          newBlocks.splice(idx + 1, 0, dup);
          return {
            layout: {
              containers: content.layout.containers.map((c) => {
                if (c.id !== container.id) return c;
                return {
                  ...c,
                  rows: c.rows.map((r) => {
                    if (r.id !== row.id) return r;
                    return {
                      ...r,
                      columns: r.columns.map((col2) => {
                        if (col2.id !== col.id) return col2;
                        return { ...col2, blocks: newBlocks };
                      }),
                    };
                  }),
                };
              }),
            },
          };
        }
      }
    }
    return content;
  });
}

export function deleteBlockInLayout(
  sections: Section[],
  sectionId: string,
  blockId: string
): Section[] {
  return immerLayout(sections, sectionId, (content) => {
    for (const container of content.layout.containers) {
      for (const row of container.rows) {
        for (const col of row.columns) {
          const idx = col.blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) continue;
          const newBlocks = col.blocks.filter((b) => b.id !== blockId);
          return {
            layout: {
              containers: content.layout.containers.map((c) => {
                if (c.id !== container.id) return c;
                return {
                  ...c,
                  rows: c.rows.map((r) => {
                    if (r.id !== row.id) return r;
                    return {
                      ...r,
                      columns: r.columns.map((col2) => {
                        if (col2.id !== col.id) return col2;
                        return { ...col2, blocks: newBlocks };
                      }),
                    };
                  }),
                };
              }),
            },
          };
        }
      }
    }
    return content;
  });
}

export function updateBlockContentInLayout(
  sections: Section[],
  sectionId: string,
  blockId: string,
  newContent: Record<string, unknown>
): Section[] {
  return immerLayout(sections, sectionId, (content) => {
    for (const container of content.layout.containers) {
      for (const row of container.rows) {
        for (const col of row.columns) {
          const idx = col.blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) continue;
          const newBlocks = [...col.blocks];
          newBlocks[idx] = { ...newBlocks[idx], content: newContent };
          return {
            layout: {
              containers: content.layout.containers.map((c) => {
                if (c.id !== container.id) return c;
                return {
                  ...c,
                  rows: c.rows.map((r) => {
                    if (r.id !== row.id) return r;
                    return {
                      ...r,
                      columns: r.columns.map((col2) => {
                        if (col2.id !== col.id) return col2;
                        return { ...col2, blocks: newBlocks };
                      }),
                    };
                  }),
                };
              }),
            },
          };
        }
      }
    }
    return content;
  });
}

export function addBlockToLayout(
  sections: Section[],
  sectionId: string,
  containerId: string,
  rowId: string,
  columnId: string,
  type: BlockType
): Section[] {
  const block = createBlock(type);
  return immerLayout(sections, sectionId, (content) => ({
    layout: {
      containers: content.layout.containers.map((c) => {
        if (c.id !== containerId) return c;
        return {
          ...c,
          rows: c.rows.map((r) => {
            if (r.id !== rowId) return r;
            return {
              ...r,
              columns: r.columns.map((col) => {
                if (col.id !== columnId) return col;
                return { ...col, blocks: [...col.blocks, block] };
              }),
            };
          }),
        };
      }),
    },
  }));
}

// ═══════════════════════════════════════════
// BLOCK OPERATIONS (LEGACY FLAT-BLOCK SECTIONS)
// ═══════════════════════════════════════════

function getBlocksFromSection(section: Section): Block[] {
  const content = section.content as Record<string, unknown> | null;
  if (!content || !Array.isArray(content.blocks)) return [];
  return content.blocks as Block[];
}

function setBlocksForSection(section: Section, blocks: Block[]): Section {
  return {
    ...section,
    content: { ...(section.content as Record<string, unknown>), blocks },
  };
}

export function addBlockToContent(
  sections: Section[],
  sectionId: string,
  type: BlockType
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const blocks = getBlocksFromSection(s);
    const block = createBlock(type, blocks.length);
    return setBlocksForSection(s, [...blocks, block]);
  });
}

export function duplicateBlockInContent(
  sections: Section[],
  sectionId: string,
  blockId: string
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const blocks = getBlocksFromSection(s);
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return s;
    const original = blocks[idx];
    const dup: Block = {
      ...original,
      id: uid(),
      content: { ...original.content },
      responsive: JSON.parse(JSON.stringify(original.responsive)),
    };
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, dup);
    return setBlocksForSection(s, newBlocks);
  });
}

export function deleteBlockInContent(
  sections: Section[],
  sectionId: string,
  blockId: string
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const blocks = getBlocksFromSection(s);
    return setBlocksForSection(s, blocks.filter((b) => b.id !== blockId));
  });
}

export function updateBlockContentInContent(
  sections: Section[],
  sectionId: string,
  blockId: string,
  newContent: Record<string, unknown>
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const blocks = getBlocksFromSection(s);
    const newBlocks = blocks.map((b) =>
      b.id === blockId ? { ...b, content: newContent } : b
    );
    return setBlocksForSection(s, newBlocks);
  });
}

export function moveBlockInContent(
  sections: Section[],
  sectionId: string,
  blockId: string,
  direction: -1 | 1
): Section[] {
  return sections.map((s) => {
    if (s.id !== sectionId) return s;
    const blocks = getBlocksFromSection(s);
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return s;
    const toIdx = idx + direction;
    if (toIdx < 0 || toIdx >= blocks.length) return s;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(idx, 1);
    newBlocks.splice(toIdx, 0, moved);
    return setBlocksForSection(s, newBlocks);
  });
}
