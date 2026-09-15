# PHASE 31 — Layout Editing System

## Date: Sep 14, 2026

## Summary

Integrated the layout editing system into the rebuilt PageBuilder. Converted `useLayoutOperations` from a hook with old-history dependencies into a module of pure functions. Wired layout selection, CRUD operations, and the LayoutInspector into the PageBuilder's right panel.

---

## What Changed

### 1. `useLayoutOperations.ts` — Hook → Pure Functions

**Before:** A React hook wrapping pure functions in `useCallback`, requiring `sections` + `onSectionsUpdate` callback from the old PageBuilder history system.

**After:** A module of pure functions. Each takes `sections` as first param and returns updated `sections`. No React dependency. Caller handles history + state.

```typescript
// Before (hook pattern)
const { addContainer } = useLayoutOperations({ sections, onSectionsUpdate });

// After (pure function pattern)
import { addContainer } from '@/hooks/useLayoutOperations';
const updated = addContainer(sections, sectionId);
```

**Functions exported:**
- `addContainer`, `updateContainer`, `updateContainerResponsive`, `deleteContainer`
- `addRow`, `updateRow`, `updateRowResponsive`, `deleteRow`
- `addColumn`, `updateColumn`, `updateColumnResponsive`, `deleteColumn`
- `canDeleteColumn`, `hasLayoutContent`, `findLayoutPath`
- Types: `LayoutSelection`, `LayoutSelectionLevel`

### 2. `LayoutInspector.tsx` — Cleaned Up

- Removed `_onUpdateContainer`, `_onUpdateRow`, `_onUpdateColumn` unused params (was causing eslint warnings)
- Removed `_container` param from `RowInspector` and `ColumnInspector` sub-components
- Added `ArrowLeft` icon import for back navigation

### 3. `PageBuilder.tsx` — Layout Integration

**New state:**
```typescript
const [layoutSelection, setLayoutSelection] = useState<LayoutSelection | null>(null);
const [activeViewport, setActiveViewport] = useState<BlockResponsiveBreakpoint>('desktop');
```

**New operations (via `applyLayoutUpdate` helper):**
- `layoutOps.addContainer(sectionId)`
- `layoutOps.updateContainer(sectionId, containerId, patch)`
- `layoutOps.updateContainerResponsive(sectionId, containerId, bp, patch)`
- `layoutOps.deleteContainer(sectionId, containerId)`
- `layoutOps.addRow(sectionId, containerId)`
- `layoutOps.updateRow(sectionId, containerId, rowId, patch)`
- `layoutOps.updateRowResponsive(sectionId, containerId, rowId, bp, patch)`
- `layoutOps.deleteRow(sectionId, containerId, rowId)`
- `layoutOps.addColumn(sectionId, containerId, rowId)`
- `layoutOps.updateColumn(sectionId, containerId, rowId, columnId, patch)`
- `layoutOps.updateColumnResponsive(sectionId, containerId, rowId, columnId, bp, patch)`
- `layoutOps.deleteColumn(sectionId, containerId, rowId, columnId)`

**Right panel logic:**
- If `layoutSelection` is set → shows `LayoutInspector`
- Otherwise → shows `SectionEditor` (existing behavior)
- Clicking canvas clears layout selection

**VisualCanvas props added:**
- `layoutSelection`, `onSelectLayout`, `activeViewport`, `onViewportChange`

---

## How It Works

1. **Click a section** in the list or canvas → shows SectionEditor in right panel
2. **Section has layout content** → LayoutRenderer in canvas shows selection outlines (clickable)
3. **Click a container/row/column** in canvas → `layoutSelection` set → right panel switches to LayoutInspector
4. **LayoutInspector** shows controls for selected element (maxWidth, padding, gap, visibility, width, alignment)
5. **Viewport tabs** (Desktop/Tablet/Mobile) switch the responsive breakpoint being edited
6. **Add Container/Row/Column** buttons create new layout elements
7. **Delete** removes empty elements (columns with blocks cannot be deleted)
8. **All operations** push to undo history and mark page as unsaved

---

## Files Modified

| File | Action |
|---|---|
| `src/hooks/useLayoutOperations.ts` | **REWRITTEN** — Hook → pure functions (702 → 430 lines) |
| `src/components/admin/pages/LayoutInspector.tsx` | **CLEANED** — Removed unused params, fixed imports |
| `src/components/admin/pages/PageBuilder.tsx` | **UPDATED** — Added layout state, operations, inspector |

## Files NOT Modified

- `layoutTypes.ts` — Type definitions untouched
- `VisualCanvas.tsx` — Already passes layout props through
- `BlocksSectionRenderer.tsx` (admin) — Already renders LayoutRenderer with selection
- `LayoutRenderer.tsx` — Already handles admin mode (selection outlines, drop indicators)
- `SectionRenderer.tsx` — Already passes layout props to BlocksSectionRenderer
- All section renderers, editors, services, types, routes — Untouched

---

## Verification

- ✅ `npx tsc --noEmit` — Clean (0 errors)
- ✅ `npx vite build` — Clean (built in 16.66s)
- ✅ PageBuilder chunk: 145KB (was 129KB before layout integration)
- ✅ No changes to public site components
- ✅ No changes to database schema or services

---

## What's NOT Included (Future Work)

1. **Cross-column block drag-and-drop** — `moveBlockAcrossColumns` and `reorderBlockInColumn` functions exist in the pure functions module but are not wired to PageBuilder yet
2. **Column resize** — `resizeColumnPair` function exists but not wired
3. **Block-level editing within layout columns** — VisualCanvas passes `selectedBlockId` and `onSelectBlock` but the block inspector is not connected in PageBuilder yet
4. **Layout-aware section types** — Currently only `blocks` section type supports layout content. Other section types (hero, services, etc.) use fixed layouts.

---

## Risk Assessment

- **Zero risk to public site** — No public components modified
- **Zero risk to other admin pages** — Only PageBuilder + LayoutInspector + useLayoutOperations touched
- **Low risk to page builder** — Layout operations are additive; existing SectionEditor still works for non-layout sections
- **Rollback available** — Git commit `3ae04ee` contains pre-layout state
