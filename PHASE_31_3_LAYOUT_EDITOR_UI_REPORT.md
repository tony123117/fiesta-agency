# Phase 31.3 — Visual Layout Editor UI

**Date**: 2026-09-11
**Status**: ✅ Complete

## Summary

Built the admin UI for visually managing layout containers, rows, and columns. Administrators can now select, inspect, and modify layout elements through controlled visual controls. The canvas updates immediately via the existing `liveContentMap` / `history.updateSections()` architecture. All changes support undo/redo. Legacy flat-block sections continue working unchanged.

## Architecture

### Layout Selection State

Added `LayoutSelection` to PageBuilder:
```typescript
interface LayoutSelection {
  level: 'container' | 'row' | 'column';
  containerId: string;
  rowId?: string;
  columnId?: string;
}
```

Selection priority: Block > Layout > Section. Selecting a block clears layout selection. Selecting a layout element clears block selection.

### Right Panel Inspector

The right panel now shows 3 modes:
1. **BlockInspector** — when a block is selected (existing behavior)
2. **LayoutInspector** — when a container/row/column is selected (new)
3. **SectionEditor** — when section is selected but no block/layout (existing behavior)

### Undo/Redo

All layout operations route through `history.updateSections()` — no parallel undo system. Ctrl+Z/Ctrl+Shift+Z works for every layout change.

## What Was Built

### 1. useLayoutOperations Hook (`src/hooks/useLayoutOperations.ts`)

Core hook providing immutable layout CRUD operations:

| Operation | Description |
|-----------|-------------|
| `addContainer(sectionId)` | Adds a new container with one row → one column |
| `updateContainer(id, patch)` | Updates container settings (maxWidth, padding, gap, visibility) |
| `updateContainerResponsive(id, bp, patch)` | Updates container for specific breakpoint |
| `deleteContainer(sectionId, containerId)` | Removes a container |
| `addRow(sectionId, containerId)` | Adds a new row with one column |
| `updateRow(id, patch)` | Updates row settings (mode, gap, alignment) |
| `updateRowResponsive(id, bp, patch)` | Updates row for specific breakpoint |
| `deleteRow(sectionId, containerId, rowId)` | Removes a row |
| `addColumn(sectionId, containerId, rowId)` | Adds column with smart redistribution |
| `updateColumn(id, patch)` | Updates column settings (width, visibility, alignment) |
| `updateColumnResponsive(id, bp, patch)` | Updates column for specific breakpoint |
| `deleteColumn(sectionId, containerId, rowId, columnId)` | Removes empty column, redistributes widths |
| `canDeleteColumn(...)` | Checks if column can be deleted (must be empty) |
| `hasLayoutContent(sectionId)` | Checks if section uses layout format |

**Smart redistribution**: When adding a column, widths are redistributed to fit the 12-column grid (e.g., 6+6 → 4+4+4). Prevents invalid grid totals.

### 2. LayoutInspector Component (`src/components/admin/pages/LayoutInspector.tsx`)

Right-panel inspector with 3 sub-inspectors:

**ContainerInspector:**
- Max Width: None / SM / MD / LG / XL / Full
- Padding: None / XS / SM / MD / LG / XL
- Gap: None / XS / SM / MD / LG / XL
- Visibility: Visible / Hidden
- Actions: Add Row, Delete

**RowInspector:**
- Layout Mode: Grid / Stack
- Column count + total width display
- Gap: None / XS / SM / MD / LG / XL
- Alignment: Left / Center / Right
- Vertical: Top / Center / Bottom / Stretch
- Visibility: Visible / Hidden
- Actions: Add Row, Delete

**ColumnInspector:**
- Width: 1-12 slider with percentage display (e.g., "6/12 = 50%")
- Visibility: Visible / Hidden
- Alignment: Top / Center / Bottom / Stretch
- Padding: None / XS / SM / MD / LG
- Actions: Add Column (if grid allows), Delete (disabled if contains blocks)

All controls use controlled values — no raw CSS exposure.

### 3. PageNavigator Layout Hierarchy

Extended tree rendering for layout sections:

```
▾ Hero Section
   ▾ Container
      ▾ Row
         ▾ Column 6/12
            Heading: Welcome
            Text: Event planning...
         ▾ Column 6/12
            Image (set)
   ▾ Container
      ▾ Row
         ▾ Column 12/12
            Button: Learn More
```

Each level has distinct visual identity:
- Container: Gold box icon
- Row: Blue rows icon
- Column: Green columns icon (with width label)
- Block: Type-specific icon

All levels are clickable to select that element.

### 4. Canvas Visual Overlays (Admin-Only)

Layout elements show admin-only overlays in the canvas:
- **Container**: Gold ring when selected, gold label on hover
- **Row**: Blue ring when selected, blue label on hover
- **Column**: Green ring when selected, green label on hover (shows "Col N/12")
- **Empty columns**: Dashed border placeholder

These overlays are **admin-only** — never appear on the public site.

### 5. PageBuilder Integration

- Added `layoutSelection` state
- Wired `useLayoutOperations` hook with `history.updateSections()`
- Right panel shows `LayoutInspector` when layout element selected
- `PageNavigator` receives `layoutSelection` and `onSelectLayout`
- `VisualCanvas` receives and passes through layout selection
- `SectionRenderer` passes layout props to `BlocksSectionRenderer`

## Files Changed

| File | Action |
|------|--------|
| `src/hooks/useLayoutOperations.ts` | **Created** — Layout CRUD hook |
| `src/components/admin/pages/LayoutInspector.tsx` | **Created** — Right-panel inspector |
| `src/components/admin/pages/PageBuilder.tsx` | **Modified** — Layout state + hook wiring |
| `src/components/admin/pages/PageNavigator.tsx` | **Modified** — Layout hierarchy tree |
| `src/components/admin/pages/VisualCanvas.tsx` | **Modified** — Pass layout selection through |
| `src/components/admin/pages/BlocksSectionRenderer.tsx` | **Modified** — Accept layout selection props |
| `src/components/public/SectionRenderer.tsx` | **Modified** — Pass layout props through |
| `src/components/public/LayoutRenderer.tsx` | **Modified** — Admin selection overlays |

## Verification

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ Clean |
| Build (`vite build`) | ✅ Clean (15.17s) |
| Regression tests | ✅ 7 pass, 0 fail |
| Home page loads | ✅ |
| Dev server | ✅ Running |

## How It Works

### Selection Flow

1. Click container/row/column in canvas → `onSelectLayout(selection)` → sets `layoutSelection` in PageBuilder
2. LayoutInspector renders with appropriate controls
3. User changes a value → `onUpdateContainer/Row/Column(patch)` → `layoutOps.updateContainer(...)` → `immerLayout()` creates new content → `history.updateSections()` → undo history updated → canvas re-renders immediately

### Content Mutation (Immutable)

```typescript
// Inside useLayoutOperations:
const immerLayout(sections, sectionId, (content) => ({
  layout: {
    containers: content.layout.containers.map((c) =>
      c.id === containerId ? { ...c, settings: { ... } } : c
    ),
  },
}));
// Returns new sections array → passed to history.updateSections()
```

### Smart Column Redistribution

When adding a column to a row with `[6, 6]`:
1. Total width = 12, adding 1 column = 3 columns
2. Target width = floor(12/3) = 4
3. Result: `[4, 4, 4]`

When deleting an empty column from `[4, 4, 4]`:
1. Remaining = 2 columns
2. Target width = floor(12/2) = 6
3. Result: `[6, 6]`

## What This Phase Does NOT Include

- ❌ Cross-column block drag/drop (Phase 31.4)
- ❌ Column resize handles (drag to resize)
- ❌ Freeform X/Y positioning
- ❌ Database migrations
- ❌ Changes to existing block editors
- ❌ Multi-select

## Next Phase

**Phase 31.4** — Cross-Column Block Drag/Drop: Allow blocks to be moved between columns within the same section. Includes:
- Drag block from one column to another
- Visual drop indicators between columns
- Block reorder within columns continues working
- Smart column detection for drop targets
