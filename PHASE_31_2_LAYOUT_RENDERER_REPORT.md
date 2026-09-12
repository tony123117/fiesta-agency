# Phase 31.2 — Layout Rendering Engine

**Date**: 2026-09-11
**Status**: ✅ Complete

## Summary

Implemented the rendering layer for the new layout architecture (Container → Row → Column → Block). The system detects content format via `isLayoutContent()` and routes accordingly, preserving 100% backward compatibility with the existing legacy flat-block system.

## What Was Built

### 1. LayoutRenderer Component (`src/components/public/LayoutRenderer.tsx`)

Core rendering engine that renders the Container → Row → Column → Block hierarchy.

**Key features:**
- **Render-agnostic** — accepts a `renderBlock` callback so both public and admin renderers can reuse it
- **Responsive** — resolves per-breakpoint settings (desktop/tablet/mobile)
- **Grid-based** — uses CSS Grid for side-by-side columns (`span N` on a 12-col grid)
- **Stack mode** — columns stack vertically on mobile (or when `columns: 'stack'`)
- **Safe fallbacks** — handles missing/malformed data gracefully (null containers, missing settings, empty arrays)
- **Spacing/padding** — resolves layout spacing scale (none/xs/sm/md/lg/xl) to Tailwind gap classes
- **Max width** — resolves container maxWidth (none/sm/md/lg/xl/full) to Tailwind max-w classes
- **Alignment** — horizontal and vertical alignment for rows and columns

**Architecture:**
```
LayoutRenderer
  └─ LayoutContainerRenderer (maxWidth, padding, gap)
       └─ LayoutRowRenderer (grid/stack mode, gap, alignment)
            └─ LayoutColumnRenderer (width, padding, vertical align)
                 └─ renderBlock(block, index) — callback
```

### 2. Public BlocksSectionRenderer Updated

Added layout detection at the top of the component:
- `isLayoutContent(data)` → renders via `LayoutRenderer` with public `BlockRender` as callback
- Otherwise → falls through to existing legacy flat-block rendering
- No changes to legacy rendering path

### 3. Admin BlocksSectionRenderer Updated

Same detection pattern as public:
- `isLayoutContent(data)` → renders via `LayoutRenderer` with admin `BlockRenderer` as callback
- Otherwise → falls through to existing legacy rendering with drag/drop/selection

### 4. Test Suite (`test-layout-rendering.mjs`)

33 tests covering:
- Factory functions (`createLayoutColumn`, `createLayoutRow`, `createLayoutContainer`)
- Type guards (`isLayoutContent`, `isLegacyBlocksContent`)
- `wrapLegacyBlocks` — wrapping legacy blocks into layout format
- Multi-column layouts
- Empty/malformed data safety

**Result: 33/33 passed**

## Files Changed

| File | Action |
|------|--------|
| `src/components/public/LayoutRenderer.tsx` | **Created** — Core layout rendering engine |
| `src/components/public/BlocksSectionRenderer.tsx` | **Modified** — Added layout detection + LayoutRenderer integration |
| `src/components/admin/pages/BlocksSectionRenderer.tsx` | **Modified** — Added layout detection + LayoutRenderer integration |
| `test-layout-rendering.mjs` | **Created** — Unit tests for layout logic |

## Verification

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ Clean |
| Build (`vite build`) | ✅ Clean (17.89s) |
| Dev server | ✅ Running on port 5174 |
| Home page loads | ✅ |
| Admin loads | ✅ |
| Layout unit tests | ✅ 33/33 |
| Existing regression tests | ✅ 7 pass, 0 fail |

## How It Works

### Content Detection

```typescript
// In BlocksSectionRenderer (both public and admin):
if (isLayoutContent(data)) {
  // New layout format — Container → Row → Column → Block
  return <LayoutRenderer content={data} renderBlock={...} />;
}
// Legacy flat-block format — existing behavior unchanged
```

### Layout Data Format

```json
{
  "layout": {
    "containers": [
      {
        "id": "c1",
        "settings": {
          "desktop": { "visible": true, "gap": "md", "padding": "md", "maxWidth": "lg" },
          "tablet": { "visible": true },
          "mobile": { "visible": true }
        },
        "rows": [
          {
            "id": "r1",
            "settings": {
              "desktop": { "visible": true, "gap": "md", "columns": "grid" },
              "mobile": { "visible": true, "columns": "stack" }
            },
            "columns": [
              {
                "id": "col1",
                "settings": { "desktop": { "visible": true, "width": 6 } },
                "blocks": [{ "id": "b1", "type": "heading", "content": {...} }]
              },
              {
                "id": "col2",
                "settings": { "desktop": { "visible": true, "width": 6 } },
                "blocks": [{ "id": "b2", "type": "image", "content": {...} }]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Grid Rendering

For a row with columns `[4, 4, 4]`:
```css
grid-template-columns: span 4 span 4 span 4;  /* 33% each */
```

For a row with columns `[6, 6]`:
```css
grid-template-columns: span 6 span 6;  /* 50% each */
```

On mobile with `columns: 'stack'`:
```css
flex flex-col  /* Vertical stacking */
```

## What This Phase Does NOT Include

- ❌ Editor UI for layout (Phase 31.3)
- ❌ Drag/drop within layout containers (Phase 31.3)
- ❌ Database migrations — layout stored in existing `sections.content` JSONB
- ❌ New database tables
- ❌ Changes to VisualCanvas or SectionNavigator
- ❌ Block inspector changes

## Next Phase

**Phase 31.3** — Layout Editor UI: Build the admin interface for creating/editing layout containers, rows, and columns. Includes:
- Container/Row/Column selection in the section navigator
- Add/remove rows and columns
- Resize columns (width adjustment)
- Move blocks between columns
- Visual grid guides in the canvas
