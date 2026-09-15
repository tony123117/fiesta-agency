# PHASE 32 + 33 — Cross-Column Drag, Column Resize, Block Editing

## Date: Sep 14, 2026

## Summary

Wired cross-column block drag-and-drop, column resize, and block-level editing into the PageBuilder. All three features were already implemented in `LayoutRenderer.tsx` and `useLayoutOperations.ts` — the work was connecting them to PageBuilder's state and passing props through VisualCanvas.

---

## Phase 32: Cross-Column Block Drag + Column Resize

### What was added to PageBuilder

**New state:**
```typescript
const [layoutDragState, setLayoutDragState] = useState<LayoutBlockDragState | null>(null);
const [columnResizeState, setColumnResizeState] = useState<{...} | null>(null);
```

**New handlers:**
- `handleLayoutBlockDragStart` — Initiates drag, sets source location
- `handleLayoutBlockDragOver` — Updates target location on hover
- `handleLayoutBlockDrop` — Calls `moveBlockAcrossColumns` to move block between columns
- `handleLayoutBlockDragEnd` — Cleans up drag state
- `handleColumnResizeStart` — Begins resize, captures initial widths
- `handleColumnResizeMove` — Updates preview widths during drag
- `handleColumnResizeCommit` — Calls `resizeColumnPair` to persist new widths
- `handleColumnResizeCancel` — Discards resize, resets state

**New functions in useLayoutOperations.ts:**
- `moveBlockAcrossColumns(sections, sectionId, blockId, source*, target*)` — Moves a block from one column to another
- `reorderBlockInColumn(sections, sectionId, blockId, direction)` — Moves block up/down within same column
- `resizeColumnPair(sections, sectionId, containerId, rowId, colId1, colId2, w1, w2, viewport)` — Resizes two adjacent columns while maintaining 12-col grid

**Props passed to VisualCanvas:**
```
layoutDragState, onLayoutBlockDragStart, onLayoutBlockDragOver,
onLayoutBlockDrop, onLayoutBlockDragEnd,
columnResizeState, onColumnResizeStart, onColumnResizeMove,
onColumnResizeCommit, onColumnResizeCancel
```

VisualCanvas → SectionRenderer → BlocksSectionRenderer → LayoutRenderer (all already supported these props)

---

## Phase 33: Block-Level Editing

### What was added to PageBuilder

**New state:**
```typescript
const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
```

**Props passed to VisualCanvas:**
```
selectedBlockId, onSelectBlock, hoveredBlockId, onHoverBlock
```

VisualCanvas → SectionRenderer → BlocksSectionRenderer → LayoutRenderer (all already supported these props)

**Block toolbar handlers (stub implementations):**
- `handleBlockMoveUp` — Calls `reorderBlockInColumn(s, sectionId, blockId, -1)`
- `handleBlockMoveDown` — Calls `reorderBlockInColumn(s, sectionId, blockId, 1)`
- `handleBlockDuplicate` — Stub (TODO)
- `handleBlockDelete` — Stub (TODO)
- `handleBlockUpdateContent` — Stub (TODO)

### How it works:
1. Click a block in the canvas → `selectedBlockId` set → block gets gold ring highlight
2. Hover a block → `hoveredBlockId` set → block gets subtle ring
3. Selected block shows drag handle + resize affordances
4. Click canvas empty area → clears block selection
5. Click a different section → clears block selection

---

## Files Modified

| File | Action |
|---|---|
| `src/components/admin/pages/PageBuilder.tsx` | **UPDATED** — Added drag, resize, block selection state + handlers |
| `src/hooks/useLayoutOperations.ts` | **UPDATED** — Added `moveBlockAcrossColumns`, `reorderBlockInColumn`, `resizeColumnPair` (+200 lines) |

## Files NOT Modified

- `LayoutRenderer.tsx` — Already had full support for all props
- `VisualCanvas.tsx` — Already passed all props through
- `BlocksSectionRenderer.tsx` (admin) — Already passed all props to LayoutRenderer
- `SectionRenderer.tsx` — Already passed all props to BlocksSectionRenderer
- `LayoutInspector.tsx` — No changes needed
- All other files — Untouched

---

## Verification

- ✅ `npx tsc --noEmit` — Clean (0 errors)
- ✅ `npx vite build` — Clean (built in 19.67s)
- ✅ PageBuilder chunk: 149KB (was 145KB before this phase)
- ✅ useLayoutOperations: 664 lines (was 468 lines, +196 for block/resize functions)

---

## What's Complete Now

The PageBuilder now has:
1. **Section CRUD** — Add, delete, duplicate, reorder, toggle visibility
2. **Section editing** — SectionEditor for content, LayoutInspector for layout properties
3. **Layout structure** — Add/delete containers, rows, columns
4. **Layout properties** — Edit maxWidth, padding, gap, visibility, width, alignment per breakpoint
5. **Cross-column block drag** — Drag blocks between columns in the same section
6. **Column resize** — Drag to resize adjacent column pairs
7. **Block selection** — Click blocks to select, hover for highlight
8. **Undo/Redo** — Full history for all operations
9. **Save/Publish** — Batch save to Supabase, publish/unpublish

---

## Remaining TODOs (Low Priority)

1. **Block content editing** — `handleBlockUpdateContent` is stubbed. Would need a BlockInspector panel.
2. **Block duplication** — `handleBlockDuplicate` is stubbed.
3. **Block deletion** — `handleBlockDelete` is stubbed.
4. **Drag-and-drop within legacy flat-block sections** — Only works in layout sections currently.
