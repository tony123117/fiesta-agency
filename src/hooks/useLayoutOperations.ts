// ── Layout Operations Hook ──
// Phase 31.3 — Layout Editing
//
// Provides immutable layout CRUD operations that route through
// the existing PageBuilder history system for undo/redo support.

import { useCallback } from 'react';
import type { Section } from '@/lib/types';
import type {
  LayoutContent,
  LayoutContainer,
  LayoutRow,
  LayoutColumn,
  ColumnWidth,

} from '@/lib/layoutTypes';
import { isLayoutContent } from '@/lib/layoutTypes';

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

interface UseLayoutOperationsProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSectionsUpdate: (sections: Section[]) => void;
}

export function useLayoutOperations({
  sections,
  onSectionsUpdate,
}: UseLayoutOperationsProps) {
  // ── Container Operations ──

  const addContainer = useCallback((sectionId: string) => {
    const col: LayoutColumn = {
      id: uid(),
      settings: {
        desktop: { visible: true, width: 12 },
        tablet: { visible: true, width: 12 },
        mobile: { visible: true, width: 12 },
      },
      blocks: [],
    };
    const row: LayoutRow = {
      id: uid(),
      settings: {
        desktop: { visible: true, gap: 'md', columns: 'grid' },
        tablet: { visible: true, gap: 'md', columns: 'grid' },
        mobile: { visible: true, gap: 'md', columns: 'stack' },
      },
      columns: [col],
    };
    const container: LayoutContainer = {
      id: uid(),
      settings: {
        desktop: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
        tablet: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
        mobile: { visible: true, gap: 'md', padding: 'md', maxWidth: 'full' },
      },
      rows: [row],
    };

    const updated = immerLayout(sections, sectionId, (content) => ({
      layout: { containers: [...content.layout.containers, container] },
    }));
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateContainer = useCallback((
    sectionId: string,
    containerId: string,
    patch: Partial<LayoutContainer['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateContainerResponsive = useCallback((
    sectionId: string,
    containerId: string,
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    patch: Partial<LayoutContainer['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const deleteContainer = useCallback((sectionId: string, containerId: string) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
      layout: {
        containers: content.layout.containers.filter((c) => c.id !== containerId),
      },
    }));
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  // ── Row Operations ──

  const addRow = useCallback((sectionId: string, containerId: string) => {
    const col: LayoutColumn = {
      id: uid(),
      settings: {
        desktop: { visible: true, width: 12 },
        tablet: { visible: true, width: 12 },
        mobile: { visible: true, width: 12 },
      },
      blocks: [],
    };
    const row: LayoutRow = {
      id: uid(),
      settings: {
        desktop: { visible: true, gap: 'md', columns: 'grid' },
        tablet: { visible: true, gap: 'md', columns: 'grid' },
        mobile: { visible: true, gap: 'md', columns: 'stack' },
      },
      columns: [col],
    };

    const updated = immerLayout(sections, sectionId, (content) => ({
      layout: {
        containers: content.layout.containers.map((c) =>
          c.id === containerId ? { ...c, rows: [...c.rows, row] } : c
        ),
      },
    }));
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateRow = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    patch: Partial<LayoutRow['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateRowResponsive = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    patch: Partial<LayoutRow['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const deleteRow = useCallback((sectionId: string, containerId: string, rowId: string) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
      layout: {
        containers: content.layout.containers.map((c) =>
          c.id === containerId
            ? { ...c, rows: c.rows.filter((r) => r.id !== rowId) }
            : c
        ),
      },
    }));
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  // ── Column Operations ──

  const addColumn = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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

                  // Redistribute widths to fit 12-col grid
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateColumn = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    columnId: string,
    patch: Partial<LayoutColumn['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const updateColumnResponsive = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    columnId: string,
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    patch: Partial<LayoutColumn['settings']['desktop']>
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  const deleteColumn = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    columnId: string
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
                    const hasBlocks = target.blocks && target.blocks.length > 0;
                    if (hasBlocks) return r; // Don't silently delete blocks

                    const remaining = r.columns.filter((col) => col.id !== columnId);
                    if (remaining.length === 0) return null; // Delete row if empty

                    // Redistribute widths
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  // ── Find helpers ──

  const findLayoutPath = useCallback((
    sectionId: string,
    containerId?: string,
    rowId?: string,
    columnId?: string
  ): { container?: LayoutContainer; row?: LayoutRow; column?: LayoutColumn } => {
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
  }, [sections]);

  const canDeleteColumn = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    columnId: string
  ): boolean => {
    const { column } = findLayoutPath(sectionId, containerId, rowId, columnId);
    return !!column && (!column.blocks || column.blocks.length === 0);
  }, [findLayoutPath]);

  const hasLayoutContent = useCallback((sectionId: string): boolean => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return false;
    return getLayoutContent(section) !== null;
  }, [sections]);

  // ── Cross-column block movement ──

  const moveBlockAcrossColumns = useCallback((
    sectionId: string,
    blockId: string,
    sourceContainerId: string,
    sourceRowId: string,
    sourceColumnId: string,
    targetContainerId: string,
    targetRowId: string,
    targetColumnId: string,
    targetIndex: number
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => {
      // Validate target exists before removing from source
      const targetContainer = content.layout.containers.find((c) => c.id === targetContainerId);
      if (!targetContainer) return content;
      const targetRow = targetContainer.rows.find((r) => r.id === targetRowId);
      if (!targetRow) return content;
      const targetColumn = targetRow.columns.find((col) => col.id === targetColumnId);
      if (!targetColumn) return content;

      // Find and remove block from source column
      let movedBlock: LayoutColumn['blocks'][number] | null = null;

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

      // Insert block into target column
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  // ── Same-column reorder ──

  const reorderBlockInColumn = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    columnId: string,
    blockId: string,
    toIndex: number
  ) => {
    const updated = immerLayout(sections, sectionId, (content) => ({
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
                  const fromIndex = col.blocks.findIndex((b) => b.id === blockId);
                  if (fromIndex === -1 || fromIndex === toIndex) return col;
                  const newBlocks = [...col.blocks];
                  const [moved] = newBlocks.splice(fromIndex, 1);
                  const insertAt = Math.min(toIndex, newBlocks.length);
                  newBlocks.splice(insertAt, 0, moved);
                  return { ...col, blocks: newBlocks };
                }),
              };
            }),
          };
        }),
      },
    }));
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  // ── Column resize ──

  const resizeColumnPair = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    colId1: string,
    colId2: string,
    newWidth1: ColumnWidth,
    newWidth2: ColumnWidth,
    viewport: 'desktop' | 'tablet' | 'mobile'
  ) => {
    // Find existing column widths to determine the actual pair total
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const layout = getLayoutContent(section);
    if (!layout) return;
    const container = layout.layout.containers.find((c) => c.id === containerId);
    if (!container) return;
    const row = container.rows.find((r) => r.id === rowId);
    if (!row) return;
    const col1 = row.columns.find((c) => c.id === colId1);
    const col2 = row.columns.find((c) => c.id === colId2);
    if (!col1 || !col2) return;

    const existingW1 = col1.settings[viewport]?.width ?? 6;
    const existingW2 = col2.settings[viewport]?.width ?? 6;
    const pairTotal = existingW1 + existingW2;

    const clamped1 = Math.max(1, Math.min(pairTotal - 1, newWidth1)) as ColumnWidth;
    const clamped2 = Math.max(1, Math.min(pairTotal - 1, pairTotal - clamped1)) as ColumnWidth;
    if (clamped1 + clamped2 !== pairTotal) return;

    const updated = immerLayout(sections, sectionId, (content) => ({
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
    onSectionsUpdate(updated);
  }, [sections, onSectionsUpdate]);

  return {
    addContainer,
    updateContainer,
    updateContainerResponsive,
    deleteContainer,
    addRow,
    updateRow,
    updateRowResponsive,
    deleteRow,
    addColumn,
    updateColumn,
    updateColumnResponsive,
    deleteColumn,
    findLayoutPath,
    canDeleteColumn,
    hasLayoutContent,
    moveBlockAcrossColumns,
    reorderBlockInColumn,
    resizeColumnPair,
  };
}
