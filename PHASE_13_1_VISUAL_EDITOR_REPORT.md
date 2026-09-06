# Phase 13.1 — True Visual Live Preview / Interactive Page Canvas

## Root Cause of Styling Discrepancy
The old preview was constrained to **45% of the editor width** (`w-[45%]`), centered with padding, capped by `maxWidth: '100%'`, and wrapped in admin chrome (`bg-obsidian`, borders, rounded corners). It never rendered at actual desktop width — sections were crammed into ~300px, producing a miniature, distorted view.

## What Changed

### New Architecture: 3-Panel Layout
- **Left panel (288px):** Section structure list, drag reorder, visibility, duplicate, delete
- **Center:** Visual Canvas — full-width rendered sections at correct viewport dimensions with CSS transform scaling
- **Right panel (380px, collapsible):** Section editor form (stripped of built-in preview)

### Files Modified
| File | Change |
|------|--------|
| `PageBuilder.tsx` | Replaced 3-col grid with 3-panel flex layout; added `liveContentMap` for real-time canvas updates; wired `onPreview` callback from SectionEditor |
| `SectionEditor.tsx` | Stripped to pure form — removed 45% preview panel, responsive toggle, preview wrapper. Now passes `onPreview` callback for live canvas updates |
| `VisualCanvas.tsx` | **New file.** Full-width canvas at correct viewport dimensions (1440/768/375px) with CSS transform scaling, zoom controls (25-150%), section hover outlines, selection outlines with drag handles, keyboard escape to deselect |
| `FullPagePreview.tsx` | Removed incorrect `baseUrl=""` prop from SectionRenderer |

### Key Features Implemented
1. **Correct viewport rendering** — Sections render at 1440px (desktop), 768px (tablet), 375px (mobile) internally
2. **CSS transform scaling** — `transform: scale(zoom/100)` with `transformOrigin: top center` preserves layout proportions
3. **Zoom controls** — 25%/50%/75%/100%/125%/150% + Fit to Screen auto-calculates zoom to fill container
4. **Responsive viewport toggle** — Desktop/Tablet/Mobile buttons with live width labels
5. **Section selection** — Hover shows gold outline + label; click selects with gold outline + "Editing" badge + drag handle
6. **Canvas drag reorder** — Drag sections by handle to reorder; updates both canvas and section list
7. **Live content tracking** — `liveContentMap` state in PageBuilder; `onPreview` callback from SectionEditor updates canvas instantly on every keystroke without DB writes
8. **Collapsible editor panel** — Right panel can be collapsed to expand canvas; toggle button switches between `PanelRightOpen`/`PanelRightClose`
9. **Canvas background** — White (`bg-white`) inside the scaled canvas, `bg-obsidian/50` surrounding the canvas — matches public site rendering
10. **Hero carousel** — Auto-play runs normally in canvas (controlled by existing `onMouseEnter` pause logic); pause on hover works

### What Was NOT Changed
- All 11 public `SectionRenderer` components (HeroCarousel, CMSBrandStatement, ServicesRenderer, EventsRenderer, PortfolioRenderer, TestimonialsRenderer, FAQRenderer, StatsRenderer, ProcessRenderer, TextImageRenderer, CTARenderer) — **untouched**
- All 11 public page renderers — **untouched**
- Public site routing, CSS, layout — **untouched**
- Admin CMS functionality (CRUD, auth, RLS, publishing) — **untouched**
- Section type definitions, migrations, Supabase config — **untouched**

### Build Verification
- `npx tsc --noEmit`: **0 errors**
- `npx vite build`: **passes** (13s, all chunks code-split correctly)
- Bundle sizes unchanged from Phase 11 baseline

### Architecture Decisions
- **CSS transform scaling** instead of changing width — preserves actual rendering proportions at any zoom level; no layout reflow
- **`liveContentMap` pattern** — maps `sectionId → content` for in-progress edits; merged into canvas sections; cleared on save; avoids mutating history state on every keystroke
- **No Supabase writes on mouse interactions** — all canvas interactions (hover, select, drag, zoom) are local state only
- **SectionRenderer reuse** — VisualCanvas renders the same production components as the public site, ensuring 1:1 visual parity

### Remaining Considerations
- **Focal point direct manipulation** — Not yet implemented (requires image overlay interaction in canvas); hero carousel focal points are set via editor form
- **Live text editing** — Not yet implemented (content editing happens in the right panel editor, not inline on canvas)
- **Section drag reorder** — Visual canvas has drag handles; also works via left panel reorder buttons
