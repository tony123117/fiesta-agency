# Phase 31.1 — Layout System Architecture Report

## Status: ARCHITECTURE COMPLETE (No UI changes)

---

## 1. Current Block Architecture

### Data Flow

```
Section (DB)
  └── content: JSONB
        └── blocks: Block[]

Block {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'spacer'
  content: Record<string, unknown>
  sort_order: number
  responsive: {
    desktop: { visible, width, alignment, spacing, stack }
    tablet:  { visible, width, alignment, spacing, stack }
    mobile:  { visible, width, alignment, spacing, stack }
  }
}
```

### Key Files

| File | Role |
|------|------|
| `src/lib/blockTypes.ts` | Block type definitions, createBlock(), type guards |
| `src/lib/blocksService.ts` | Block CRUD operations (add, update, delete, reorder, duplicate) |
| `src/lib/blockPatterns.ts` | Reusable block pattern presets |
| `src/lib/types.ts` | `BlocksContent` interface, `SectionContentMap` |
| `src/components/admin/pages/BlocksSectionEditor.tsx` | Admin block list editor |
| `src/components/admin/pages/BlocksSectionRenderer.tsx` | Admin canvas block rendering |
| `src/components/public/BlocksSectionRenderer.tsx` | Public website block rendering |
| `src/components/public/SectionRenderer.tsx` | Section type dispatch |
| `src/components/admin/pages/VisualCanvas.tsx` | Canvas with viewport switching |
| `src/components/admin/pages/PageBuilder.tsx` | Main page builder orchestrator |

### Current Rendering

All blocks render in a **single vertical stack**:

```tsx
// BlocksSectionRenderer.tsx
<div className="max-w-4xl mx-auto space-y-6">
  {blocks.map((block) => (
    <BlockRenderer block={block} />
  ))}
</div>
```

The `width` property on blocks (`full`, `1/2`, `1/3`, etc.) controls **content width** via CSS classes like `w-full md:w-1/2`, but does **not** create actual side-by-side column layouts. Two blocks with `width: '1/2'` stack vertically at 50% width each — they do not sit next to each other.

---

## 2. Problem with Flat Block Flow

### Limitation 1: No True Multi-Column Layouts

A two-column editorial (image + text side by side) is currently impossible without arbitrary positioning. The `two-column-editorial` block pattern works around this by using two blocks with `width: '1/2'`, but they still stack vertically in the actual rendering.

### Limitation 2: No Structural Hierarchy

Blocks exist as a flat array. There is no concept of:
- Rows that group blocks horizontally
- Columns that hold blocks side by side
- Containers that control spacing and max-width at a higher level

### Limitation 3: No Per-Row Layout Control

Every block is an independent unit. You cannot:
- Set a row to stack on tablet but grid on desktop
- Control the gap between columns in a row
- Align items vertically within a row

### Limitation 4: Responsive is Block-Level Only

Responsive properties exist per-block, but there's no way to control responsive behavior at the row or container level. For example, you cannot say "this entire 2-column row becomes a single column on mobile."

---

## 3. New Layout Hierarchy

```
Section
  └── Container
        └── Row
              ├── Column (holds blocks[])
              └── Column (holds blocks[])
```

### Visual

```
┌─ Container ─────────────────────────────────────┐
│  ┌─ Row ──────────────────────────────────────┐ │
│  │  ┌─ Column (6/12) ─┐  ┌─ Column (6/12) ─┐ │ │
│  │  │  Block A         │  │  Block B         │ │ │
│  │  │  Block C         │  │  Block D         │ │ │
│  │  └──────────────────┘  └──────────────────┘ │ │
│  └────────────────────────────────────────────┘ │
│  ┌─ Row ──────────────────────────────────────┐ │
│  │  ┌─ Column (4/12) ┐  ┌─ Column (8/12) ───┐│ │
│  │  │  Block E        │  │  Block F           ││ │
│  │  └─────────────────┘  └───────────────────┘│ │
│  └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## 4. Container Model

```typescript
interface LayoutContainer {
  id: string;                          // Stable UUID-like ID
  settings: {
    desktop: {
      visible: boolean;                // Show/hide at desktop
      gap: LayoutSpacing;              // Gap between rows (none | xs | sm | md | lg | xl)
      padding: LayoutSpacing;          // Inner padding
      maxWidth: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    };
    tablet: { ... same shape ... };
    mobile: { ... same shape ... };
  };
  rows: LayoutRow[];
}
```

**Responsibility**: Outermost wrapper. Controls max-width, padding, and visibility at the container level. A container holds one or more rows.

---

## 5. Row Model

```typescript
interface LayoutRow {
  id: string;
  settings: {
    desktop: {
      visible: boolean;
      gap: LayoutSpacing;              // Gap between columns
      alignment: 'start' | 'center' | 'end' | 'stretch';  // Horizontal
      verticalAlignment: 'start' | 'center' | 'end' | 'stretch';  // Vertical
      columns: 'grid' | 'stack';       // grid = side-by-side, stack = vertical
    };
    tablet: { ... same shape ... };
    mobile: { ... same shape, defaults columns: 'stack' ... };
  };
  columns: LayoutColumn[];
}
```

**Responsibility**: Defines a horizontal band. Controls how columns are distributed (grid vs stack), the gap between them, and alignment. On mobile, rows typically switch to `columns: 'stack'`.

---

## 6. Column Model

```typescript
interface LayoutColumn {
  id: string;
  settings: {
    desktop: {
      visible: boolean;
      width: ColumnWidth;              // 1-12 (12-column grid)
      verticalAlignment: 'start' | 'center' | 'end' | 'stretch';
      stackOrder: StackOrder;          // Order when stacked on mobile
      padding: LayoutSpacing;
    };
    tablet: { ... same shape ... };
    mobile: { ... same shape, typically width: 12 ... };
  };
  blocks: Block[];                     // Existing Block type — unchanged
}
```

**Responsibility**: Holds blocks in a vertical stack within a column. Width is expressed as a fraction of 12 (e.g., 6 = 50%, 4 = 33.3%). On mobile, columns typically get `width: 12` and stack vertically.

---

## 7. Block Ownership

```
Container.rows[] → Row.columns[] → Column.blocks[]
```

- A **container** owns rows
- A **row** owns columns
- A **column** owns blocks
- Blocks remain the **existing Block type** from `blockTypes.ts`
- No new block type is created
- Block IDs are preserved during any migration

---

## 8. Responsive Model

### Breakpoints (reused from blockTypes.ts)

| Name | Typical Width | Columns Default |
|------|---------------|-----------------|
| `desktop` | ≥1024px | grid (side-by-side) |
| `tablet` | 768-1023px | grid or stack |
| `mobile` | <768px | stack (vertical) |

### Per-Level Responsive Properties

| Level | Properties |
|-------|-----------|
| Container | visible, gap, padding, maxWidth |
| Row | visible, gap, alignment, verticalAlignment, columns (grid/stack) |
| Column | visible, width, verticalAlignment, stackOrder, padding |
| Block | visible, width, alignment, spacing, stack (existing — unchanged) |

### Responsive Cascade

Hiding a container hides everything inside. Hiding a row hides its columns. Hiding a column hides its blocks. This is handled at render time — the data model stores overrides per-level.

---

## 9. Data Shape Examples

### Example 1: Two-Column Editorial

```json
{
  "layout": {
    "containers": [{
      "id": "c1",
      "settings": {
        "desktop": { "visible": true, "gap": "md", "padding": "md", " maxWidth": "lg" },
        "tablet": { "visible": true },
        "mobile": { "visible": true }
      },
      "rows": [{
        "id": "r1",
        "settings": {
          "desktop": { "visible": true, "gap": "lg", "alignment": "start", "verticalAlignment": "center", "columns": "grid" },
          "tablet": { "visible": true, "columns": "grid" },
          "mobile": { "visible": true, "columns": "stack" }
        },
        "columns": [
          {
            "id": "col1",
            "settings": {
              "desktop": { "visible": true, "width": 5, "verticalAlignment": "center" },
              "tablet": { "visible": true, "width": 6 },
              "mobile": { "visible": true, "width": 12 }
            },
            "blocks": [
              { "id": "b1", "type": "heading", "content": { "text": "Our Story", "level": 2 }, "sort_order": 0, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } },
              { "id": "b2", "type": "text", "content": { "html": "<p>Share the narrative...</p>" }, "sort_order": 1, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } }
            ]
          },
          {
            "id": "col2",
            "settings": {
              "desktop": { "visible": true, "width": 7, "verticalAlignment": "center" },
              "tablet": { "visible": true, "width": 6 },
              "mobile": { "visible": true, "width": 12 }
            },
            "blocks": [
              { "id": "b3", "type": "image", "content": { "src": "...", "alt": "Editorial image" }, "sort_order": 0, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } }
            ]
          }
        ]
      }]
    }]
  }
}
```

### Example 2: Three-Column Features

```json
{
  "layout": {
    "containers": [{
      "id": "c1",
      "settings": { "desktop": { "visible": true, "gap": "md", "padding": "md", "maxWidth": "xl" }, "tablet": {}, "mobile": {} },
      "rows": [{
        "id": "r1",
        "settings": {
          "desktop": { "visible": true, "gap": "lg", "alignment": "stretch", "columns": "grid" },
          "tablet": { "columns": "grid" },
          "mobile": { "columns": "stack" }
        },
        "columns": [
          {
            "id": "col1",
            "settings": { "desktop": { "visible": true, "width": 4 }, "tablet": { "width": 6 }, "mobile": { "width": 12 } },
            "blocks": [{ "id": "b1", "type": "heading", "content": { "text": "Feature One", "level": 4 }, "sort_order": 0, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } }]
          },
          {
            "id": "col2",
            "settings": { "desktop": { "visible": true, "width": 4 }, "tablet": { "width": 6 }, "mobile": { "width": 12 } },
            "blocks": [{ "id": "b2", "type": "heading", "content": { "text": "Feature Two", "level": 4 }, "sort_order": 0, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } }]
          },
          {
            "id": "col3",
            "settings": { "desktop": { "visible": true, "width": 4 }, "tablet": { "width": 12 }, "mobile": { "width": 12 } },
            "blocks": [{ "id": "b3", "type": "heading", "content": { "text": "Feature Three", "level": 4 }, "sort_order": 0, "responsive": { "desktop": { "visible": true }, "tablet": {}, "mobile": {} } }]
          }
        ]
      }]
    }]
  }
}
```

---

## 10. Legacy Compatibility Strategy

### Detection

```typescript
function isLayoutContent(content: Record<string, unknown>): boolean {
  return !!content?.layout && Array.isArray(content.layout.containers);
}

function isLegacyBlocksContent(content: Record<string, unknown>): boolean {
  return Array.isArray(content?.blocks);
}
```

### Rendering Path

```
SectionRenderer
  → if section_type === 'blocks':
      → if isLayoutContent(content):
          → LayoutRenderer (new)
      → else if isLegacyBlocksContent(content):
          → BlocksSectionRenderer (existing — unchanged)
      → else:
          → empty state
```

### Key Rules

1. **Existing pages continue rendering** via the legacy `BlocksSectionRenderer`
2. **New pages** can use the layout system via `LayoutRenderer`
3. **Both paths coexist** until all legacy pages are migrated
4. **No breaking changes** to existing data or rendering

---

## 11. Migration Strategy

### Conversion: Legacy → Layout

```
content.blocks[] (flat array)
  ↓ wrapLegacyBlocks()
content.layout.containers[0].rows[0].columns[0].blocks[] (single column, all blocks)
```

The conversion is **deterministic**:
1. Create one container
2. Create one row with a single 12-width column
3. Move all blocks into that column
4. Preserve all block IDs, content, sort_order, and responsive settings

### Reversibility

The conversion is **reversible**:
1. Extract `container.rows[0].columns[0].blocks[]`
2. Reconstruct `content.blocks[]`

### Multi-Column Conversion (Future)

When the user restructures blocks into columns via the layout editor:
1. Blocks are moved between columns (their IDs are preserved)
2. The column width is set by the user
3. Row settings are configured by the user

### Migration Approach

- **No destructive migration** — legacy data stays as-is
- **On-edit conversion** — when a user opens a legacy section in the layout editor, it gets wrapped automatically
- **Save as layout** — the section content is saved in the new format
- **Rollback** — the `unwrapLayoutToBlocks()` function can extract the original blocks

---

## 12. Rendering Pipeline

### Intended Future Pipeline

```
SectionRenderer
  → LayoutRenderer
    → LayoutContainer
      → LayoutRow
        → LayoutColumn
          → BlockRenderer (existing)
```

### During This Phase

```
SectionRenderer (existing — unchanged)
  → BlocksSectionRenderer (existing — unchanged)
```

The `LayoutRenderer` component is **not implemented** in this phase. The type definitions and compatibility strategy are established here. Implementation belongs to Phase 32+.

---

## 13. Persistence Strategy

### Storage Location

Layout data lives inside the **existing** `sections.content` JSONB column. No new database tables.

### Why

- The existing `content` JSONB already holds `blocks[]` for the blocks section type
- Adding `layout` as a sibling key to `blocks` keeps the schema backward-compatible
- Supabase JSONB supports partial updates, so layout changes don't require full-section rewrites
- No RLS changes needed — the existing section-level policies cover it

### JSONB Shape

```
sections.content = {
  // Legacy (still valid):
  "blocks": [ ... ]

  // New layout format (alternative):
  "layout": {
    "containers": [ ... ]
  }
}
```

### Detection at Read Time

```typescript
// In blocksService.ts or a new layoutService.ts
function getSectionBlocks(content: Record<string, unknown>): Block[] {
  if (isLayoutContent(content)) {
    // Extract blocks from the first column of the first row of the first container
    return content.layout.containers[0]?.rows[0]?.columns[0]?.blocks ?? [];
  }
  if (isLegacyBlocksContent(content)) {
    return content.blocks as Block[];
  }
  return [];
}
```

---

## 14. Type Safety Strategy

### New File: `src/lib/layoutTypes.ts`

Contains all layout-related type definitions:
- `LayoutContainer`, `LayoutRow`, `LayoutColumn`
- `LayoutContainerResponsive`, `LayoutRowResponsive`, `LayoutColumnResponsive`
- `ColumnWidth` (1-12)
- `LayoutSpacing`, `LayoutHorizontalAlignment`, `LayoutVerticalAlignment`
- Type guards: `isLayoutContent()`, `isLegacyBlocksContent()`
- Factory functions: `createLayoutContainer()`, `createLayoutRow()`, `createLayoutColumn()`
- Migration helper: `wrapLegacyBlocks()`

### Type Guards

- `isLayoutContent()` — detects new format
- `isLegacyBlocksContent()` — detects old format
- Both return `false` for malformed/unknown data (no crashes)

### Block Types Unchanged

The existing `Block` type from `blockTypes.ts` is reused without modification. Block type guards remain authoritative.

---

## 15. Undo/Redo Implications

The existing `usePageHistory` hook stores `sections: Section[]` in its history stack. Since layout data lives inside `section.content`, undo/redo naturally captures layout changes.

No changes to the undo/redo system are needed for this phase.

---

## 16. Save/Publish Implications

The existing save flow in `PageBuilder.tsx` persists `section.content` via `updateSection()`. Since layout data is inside `content`, the save flow works unchanged.

No changes to the save/publish system are needed for this phase.

---

## 17. Backward Compatibility Risks

| Risk | Mitigation |
|------|-----------|
| Legacy sections stop rendering | Both `isLayoutContent()` and `isLegacyBlocksContent()` are checked; legacy falls through to existing renderer |
| Malformed layout data crashes editor | Type guards return `false` for unknown shapes; empty state shown |
| Block IDs lost during migration | `wrapLegacyBlocks()` preserves all block IDs; conversion is deterministic |
| JSONB queries break | No schema changes; `content` remains JSONB |
| Existing block patterns break | Patterns return `Block[]`; they can be wrapped into layout format without changes |

---

## 18. Files Created/Modified

### Created

| File | Description |
|------|-------------|
| `src/lib/layoutTypes.ts` | Layout type definitions, type guards, factory functions |

### Modified

| File | Change |
|------|--------|
| `PHASE_31_1_LAYOUT_ARCHITECTURE_REPORT.md` | This report |

### Not Modified (by design)

| File | Reason |
|------|--------|
| `src/lib/blockTypes.ts` | Block types unchanged |
| `src/lib/blocksService.ts` | Block CRUD unchanged |
| `src/lib/types.ts` | No new section types in this phase |
| `src/components/admin/pages/PageBuilder.tsx` | No UI changes |
| `src/components/admin/pages/VisualCanvas.tsx` | No UI changes |
| `src/components/admin/pages/BlocksSectionEditor.tsx` | No UI changes |
| `src/components/admin/pages/BlocksSectionRenderer.tsx` | No UI changes |
| `src/components/public/BlocksSectionRenderer.tsx` | No UI changes |
| `src/components/public/SectionRenderer.tsx` | No UI changes |

---

## Next Phases (Not Implemented Here)

- **Phase 32**: LayoutRenderer component (renders container → row → column → block)
- **Phase 33**: Layout editor UI (visual row/column management)
- **Phase 34**: Column resizing, drag between columns
- **Phase 35**: Legacy page migration tool
- **Phase 36**: Public renderer integration
