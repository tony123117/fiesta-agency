# PHASE 34 — Block Content Editing, Duplication, Deletion

## Date: Sep 14, 2026

## Summary

Completed all remaining block-level operations: duplication, deletion, content editing, and legacy flat-block drag support. The FloatingBlockToolbar now works for both layout sections and legacy flat-block sections.

---

## What Was Added

### Block Operations in useLayoutOperations.ts

**Layout sections** (Container → Row → Column → Block):
- `duplicateBlockInLayout(sections, sectionId, blockId)` — Finds block in layout tree, duplicates it with new ID
- `deleteBlockInLayout(sections, sectionId, blockId)` — Finds block in layout tree, removes it
- `updateBlockContentInLayout(sections, sectionId, blockId, content)` — Finds block in layout tree, updates content
- `addBlockToLayout(sections, sectionId, containerId, rowId, columnId, type)` — Adds new block to a specific column

**Legacy flat-block sections** (content.blocks array):
- `duplicateBlockInContent(sections, sectionId, blockId)` — Duplicates block in flat array
- `deleteBlockInContent(sections, sectionId, blockId)` — Removes block from flat array
- `updateBlockContentInContent(sections, sectionId, blockId, content)` — Updates block content in flat array
- `addBlockToContent(sections, sectionId, type)` — Appends new block to flat array
- `moveBlockInContent(sections, sectionId, blockId, direction)` — Moves block up/down in flat array

### PageBuilder Integration

**New state:** None (reuses existing `selectedBlockId`)

**Handlers (now fully implemented):**
- `handleBlockMoveUp(sectionId, blockId)` — Detects layout vs legacy, calls appropriate function
- `handleBlockMoveDown(sectionId, blockId)` — Same pattern
- `handleBlockDuplicate(sectionId, blockId)` — Duplicates block, clears selection
- `handleBlockDelete(sectionId, blockId)` — Deletes block, clears selection
- `handleBlockUpdateContent(sectionId, blockId, content)` — Updates block content

**blockToolbar prop** now passed to VisualCanvas:
```typescript
blockToolbar={selectedBlockId && selectedSectionId ? {
  sectionId: selectedSectionId,
  onBlockMoveUp: handleBlockMoveUp,
  onBlockMoveDown: handleBlockMoveDown,
  onBlockDuplicate: handleBlockDuplicate,
  onBlockDelete: handleBlockDelete,
  onBlockUpdateContent: handleBlockUpdateContent,
} : undefined}
```

### How It Works

1. **Select a block** in canvas → `selectedBlockId` set → blockToolbar appears
2. **FloatingBlockToolbar** shows: Move up/down, Duplicate, Delete, Edit (inspector)
3. **Text blocks**: Bold, Italic, Link formatting via inline selection
4. **All blocks**: Alignment (left/center/right) for heading, text, image, button
5. **Image blocks**: Replace image, focal point controls
6. **Works in both** layout sections AND legacy flat-block sections

---

## Files Modified

| File | Action |
|---|---|
| `src/hooks/useLayoutOperations.ts` | **UPDATED** — Added 10 block CRUD functions (+290 lines) |
| `src/components/admin/pages/PageBuilder.tsx` | **UPDATED** — Wired block toolbar, real handlers |

## Total Line Counts

| File | Before Phase 34 | After |
|---|---|---|
| `useLayoutOperations.ts` | 666 | 956 |
| `PageBuilder.tsx` | 780 | 830 |

---

## Verification

- ✅ `npx tsc --noEmit` — Clean (0 errors)
- ✅ `npx vite build` — Clean (built in 18.51s)
- ✅ PageBuilder chunk: 151KB

---

## Complete Feature List

The PageBuilder now supports:
1. **Section CRUD** — Add, delete, duplicate, reorder, toggle visibility
2. **Section editing** — SectionEditor for content, LayoutInspector for layout properties
3. **Layout structure** — Add/delete containers, rows, columns
4. **Layout properties** — Edit maxWidth, padding, gap, visibility, width, alignment per breakpoint
5. **Cross-column block drag** — Drag blocks between columns in layout sections
6. **Column resize** — Drag to resize adjacent column pairs
7. **Block selection** — Click blocks to select, hover for highlight
8. **Block toolbar** — Floating toolbar with move, duplicate, delete, format
9. **Block content editing** — Inline text formatting (bold, italic, link)
10. **Legacy flat-block support** — All block operations work in non-layout sections
11. **Undo/Redo** — Full history for all operations
12. **Save/Publish** — Batch save to Supabase, publish/unpublish
