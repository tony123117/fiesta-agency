# PHASE 13.11.2 — CMS Content Parity Matrix & Architecture Design

## 1. AUDIT VERIFICATION

### Source Files Verified
- `src/pages/public/Home.tsx` (27 lines) — CMS-only, no fallback
- `src/pages/public/About.tsx` (754 lines) — CMS-first with retained fallback
- `src/pages/public/Services.tsx` (1148 lines) — CMS-first with retained fallback + Carousel subcomponent
- `src/pages/public/HowWeWork.tsx` (633 lines) — CMS-first with retained fallback + BTSImage subcomponent
- `src/components/public/SectionRenderer.tsx` (37 lines) — 11 renderers mapped
- `src/lib/sectionTypes.ts` (212 lines) — 11 section type configs
- `src/lib/types.ts` (412 lines) — All content interfaces
- `supabase/migrations/20260901140000_0010_seed_existing_page_sections.sql` (71 lines) — 25 seeded sections

### Gap Verification Result
All 10 reported gaps **confirmed**. No false positives. No missed gaps.

---

## 2. COMPLETE PAGE PARITY MATRIX

### HOME PAGE (Home.tsx)

| # | Section Name | Section Type | CMS Type | CMS Content Populated | Fallback Required | Visual Pattern | Reusable? |
|---|---|---|---|---|---|---|---|
| 1 | Hero | `hero-carousel` | ✅ Existing | ✅ Populated (Phase 13.10) | No | Full-width cinematic hero | Yes |
| 2 | Brand Statement | `brand-statement` | ✅ Existing | ✅ Populated | No | Centered editorial | Yes |
| 3 | Services | `services-editorial` | ✅ Existing | ✅ Populated | No | Service listing | Yes |
| 4 | Featured Work | `portfolio-gallery` | ✅ Existing | ✅ Populated | No | Image grid | Yes |
| 5 | Stats | `stats` | ✅ Existing | ✅ Populated | No | Numbered statistics | Yes |
| 6 | Testimonials | `testimonials` | ✅ Existing | ✅ Populated | No | Client quotes | Yes |
| 7 | Call to Action | `cta` | ✅ Existing | ✅ Populated | No | Cinematic CTA | Yes |

**Coverage: 100% CMS. Fallback removed in Phase 13.10.**

---

### ABOUT PAGE (About.tsx)

| # | Fallback Section | Section Type | CMS Type | CMS Section Exists? | CMS Content Populated? | Structural Gap? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | About Hero | `hero-carousel` | ✅ Existing | ✅ sort_order=0 | ✅ Populated | No | — |
| 2 | Our Story | `brand-statement` | ✅ Existing | ✅ sort_order=1 | ✅ Populated | No | — |
| 3 | Cinematic Image Break | — | ❌ None | ❌ No section | ❌ N/A | **YES** | New type needed |
| 4 | What Fiesta Believes | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `editorial-list` |
| 5 | Mission | `text-image` | ✅ Existing | ✅ sort_order=2 | ✅ Populated | No | — |
| 6 | Vision | `text-image` | ✅ Existing | ✅ sort_order=3 | ✅ Populated | No | — |
| 7 | The Fiesta Approach | `process` | ✅ Existing | ✅ sort_order=4 | ⚠️ Steps empty | No | Populate only |
| 8 | People Behind Fiesta | — | ❌ None | ❌ No section | ❌ N/A | **YES** | New type needed |
| 9 | Final CTA | `cta` | ✅ Existing | ✅ sort_order=7 | ✅ Populated | No | — |

**CMS sections seeded: 8** (hero, brand-statement, text-image×2, process, stats, testimonials, cta)
**Fallback gaps: 3** (cinematic-image-break, editorial-list/beliefs, team-members)

---

### SERVICES PAGE (Services.tsx)

| # | Fallback Section | Section Type | CMS Type | CMS Section Exists? | CMS Content Populated? | Structural Gap? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | Services Hero | `hero-carousel` | ✅ Existing | ✅ sort_order=0 | ✅ Populated | No | — |
| 2 | Introduction / Philosophy | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 3 | Services Overview (6 items) | `services-editorial` | ✅ Existing | ✅ sort_order=1 | ✅ Populated | No | — |
| 4 | Featured: Weddings | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 5 | Corporate Events | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 6 | Private Celebrations | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 7 | Event Production | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 8 | Image Carousel | — | ❌ None | ❌ No section | ❌ N/A | **YES** | `image-carousel` type |
| 9 | Why Fiesta (4 principles) | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `editorial-list` |
| 10 | Final Statement | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `text-image` (no image) |
| 11 | Final CTA | `cta` | ✅ Existing | ✅ sort_order=4 | ✅ Populated | No | — |

**CMS sections seeded: 5** (hero, services-editorial, process, testimonials, cta)
**Missing CMS sections: 4** (intro text-image, weddings, corporate, celebrations, production — all text-image)
**Fallback gaps: 3** (image-carousel, editorial-list/why-fiesta, text-image/final-statement)

---

### HOW WE WORK PAGE (HowWeWork.tsx)

| # | Fallback Section | Section Type | CMS Type | CMS Section Exists? | CMS Content Populated? | Structural Gap? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | Cinematic Hero | `hero-carousel` | ✅ Existing | ✅ sort_order=0 | ✅ Populated | No | — |
| 2 | Introduction (The Fiesta Method) | `text-image` | ✅ Existing | ⚠️ Not seeded | ❌ N/A | No | Add section + populate |
| 3 | The Journey (5 stages) | `process` | ✅ Existing | ✅ sort_order=1 | ⚠️ Steps empty | No | Populate only |
| 4 | Visual Transition | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `cinematic-image` |
| 5 | What Makes It Different (8 items) | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `editorial-list` |
| 6 | Behind the Scenes Gallery | — | ❌ None | ❌ No section | ❌ N/A | **YES** | Reuse `portfolio-gallery` variant |
| 7 | Final CTA | `cta` | ✅ Existing | ✅ sort_order=4 | ✅ Populated | No | — |

**CMS sections seeded: 5** (hero, process, services-editorial, testimonials, cta)
**Missing CMS sections: 1** (intro text-image)
**Fallback gaps: 3** (cinematic-image, editorial-list, portfolio-gallery/asymmetric)

---

## 3. GAP CLASSIFICATION SUMMARY

| Gap ID | Fallback Section | Page(s) | Classification | Proposed CMS Type |
|---|---|---|---|---|
| G1 | Cinematic Image Break | About | **NEW REUSABLE TYPE** | `cinematic-image` |
| G2 | Visual Transition | How We Work | **NEW REUSABLE TYPE** | `cinematic-image` (same type) |
| G3 | What Fiesta Believes (5 items) | About | **NEW REUSABLE TYPE** | `editorial-list` |
| G4 | Why Fiesta (4 items) | Services | **NEW REUSABLE TYPE** | `editorial-list` (same type) |
| G5 | What Makes It Different (8 items) | How We Work | **NEW REUSABLE TYPE** | `editorial-list` (same type) |
| G6 | People Behind Fiesta | About | **NEW REUSABLE TYPE** | `team-members` |
| G7 | Image Carousel | Services | **NEW REUSABLE TYPE** | `image-carousel` |
| G8 | Behind the Scenes Gallery | How We Work | **EXISTING TYPE + EXTENSION** | `portfolio-gallery` (add `asymmetric` variant) |
| G9 | Final Statement | Services | **EXISTING TYPE** | `text-image` (image=null) |
| G10 | Missing text-image sections | Services (×4), How We Work (×1) | **EXISTING TYPE — populate only** | `text-image` |

---

## 4. REUSABLE PATTERN ANALYSIS

### 4A. CINEMATIC IMAGE PATTERN

**Occurrences:**
- About.tsx L275-310 — Cinematic Image Break
- HowWeWork.tsx L360-395 — Visual Transition

**Visual Behavior (both instances):**
- Full-width, full-bleed image section
- Height: `clamp(350px, 50vh, 550px)` (About) / `clamp(350px, 50vh, 500px)` (HowWeWork)
- Absolute-positioned background image with `object-cover`
- Dark gradient overlay (linear-gradient with rgba(8-11,10,11, 0.2-0.4))
- Caption text positioned at bottom-left (About: `items-end pb-10`) or centered (HowWeWork: `items-center justify-center text-center`)
- Caption is editorial serif or sans-serif, uppercase, small size
- Parallax-like zoom animation on scroll (`scale(1.05)` → `scale(1)`)

**Content Requirements:**
```
image: string (required)
mobile_image: string | null
image_alt: string | null
focal_x: number (0-1)
focal_y: number (0-1)
caption: string | null
caption_alignment: 'left' | 'center'
height: 'short' | 'medium' | 'tall' (mapped to clamp values)
overlay_opacity: number (0-1)
```

**Verdict: One reusable `cinematic-image` type covers both.**

---

### 4B. EDITORIAL NUMBERED LIST PATTERN

**Occurrences:**
- About.tsx L316-398 — What Fiesta Believes (5 items, ivory bg → dark bg)
- Services.tsx L854-946 — Why Fiesta (4 items, ivory bg)
- HowWeWork.tsx L401-465 — What Makes It Different (8 items, dark bg)

**Visual Behavior (all instances):**
- Section heading (optional eyebrow + heading)
- Vertical list of numbered items
- Each item: number + title + optional description
- Divider lines between items (`border-top/bottom`)
- Numbers styled as large decorative serif at 30-50% gold opacity
- Items spaced with `clamp()` padding

**Content Requirements:**
```
heading: string | null
description: string | null
items: Array<{
  number: string (auto-padded, e.g. "01")
  title: string
  description: string | null
}>
variant: 'default' | 'compact'
```

**Key Difference from `process`:**
- `process` is a 5-column centered grid with small 16x16 circular images
- `editorial-list` is a full-width vertical list with 12-col grid per item (number | title | description)
- Different layout model entirely — `process` cannot represent this

**Verdict: New `editorial-list` type required.**

---

### 4C. TEAM MEMBERS PATTERN

**Occurrence:** About.tsx L578-680 — People Behind Fiesta

**Visual Behavior:**
- Section heading (eyebrow + heading)
- Two-column layout: 6 + 6 on 12-col grid
- Left: Large featured image (aspect 4/5) that swaps on hover/focus
- Right: Vertical list of team members with dividers
  - Each member: role title + bio text + arrow indicator
  - On hover/focus: `setActiveIdx(i)` swaps featured image
  - Tab-accessible (`tabIndex={0}`, `role="button"`)

**Content Requirements:**
```
heading: string | null
members: Array<{
  name: string
  role: string
  image: string
  bio: string | null
}>
```

**Why not `portfolio-gallery`:**
- Portfolio is a grid of images with titles
- Team is an interactive list with image-swap behavior
- Fundamentally different interaction model

**Verdict: New `team-members` type required.**

---

### 4D. IMAGE CAROUSEL PATTERN

**Occurrence:** Services.tsx L818-1145 — Image Carousel (with Carousel subcomponent)

**Visual Behavior:**
- Section heading (eyebrow + heading)
- Horizontal scrollable track with snap
- Images: `clamp(280px, 40vw, 520px)` width, 3:4 aspect ratio
- Navigation: left/right arrow buttons
- Scroll state: canPrev/canNext tracking
- Smooth scroll with `scrollBy({ behavior: 'smooth' })`

**Content Requirements:**
```
heading: string | null
description: string | null
images: Array<{
  src: string
  alt: string | null
}>
```

**Why not `portfolio-gallery`:**
- Portfolio uses fixed grid/masonry layout
- Carousel uses horizontal scroll with snap and navigation controls
- Different interaction model

**Verdict: New `image-carousel` type required.**

---

### 4E. ASYMMETRIC GALLERY PATTERN

**Occurrence:** HowWeWork.tsx L471-540 — Behind the Scenes Gallery

**Visual Behavior:**
- Section heading (eyebrow + description)
- 3-row asymmetric grid using 12-col system:
  - Row 1: 7 + 5
  - Row 2: 5 + 7
  - Row 3: 4 + 8
- Images fill their containers with `object-cover`
- Hover effect: `group-hover:scale-[1.04]`

**Can `portfolio-gallery` support this?**
- `portfolio-gallery` currently has `grid` and `masonry` variants
- Neither produces the specific 7+5 / 5+7 / 4+8 asymmetric pattern
- However, a new `asymmetric` variant could implement this

**Verdict: Extend `portfolio-gallery` with `asymmetric` variant.**

---

### 4F. CENTERED EDITORIAL STATEMENT PATTERN

**Occurrence:** Services.tsx L952-986 — Final Statement

**Visual Behavior:**
- Dark obsidian background
- Large centered serif heading with gold italic accent
- Gold divider line below (animated scale)
- No image, no CTA, no body text

**Can `text-image` handle this?**
- `text-image` with `image = null` already renders only text
- But it uses a 2-col grid layout, not centered
- Need to verify if the renderer handles centered layout

**Current `text-image` behavior with no image:**
- Renders a `lg:grid-cols-2` with the text taking one column
- Text is left-aligned within its column
- NOT centered across the full width

**Solution: Add `centered` variant to `text-image`**

**Verdict: Extend `text-image` with `centered` variant.**

---

## 5. PROPOSED SECTION TYPES

| Type | Status | Pages Using | Reason |
|---|---|---|---|
| `editorial-list` | **NEW** | About, Services, HowWe Work | Numbered vertical list — different layout from `process` |
| `cinematic-image` | **NEW** | About, How We Work | Full-width cinematic image with caption — different from `text-image` |
| `team-members` | **NEW** | About | Interactive team showcase with image swap — different from `portfolio-gallery` |
| `image-carousel` | **NEW** | Services | Horizontal scrolling carousel — different from `portfolio-gallery` |
| `portfolio-gallery` | **EXTEND** | How We Work | Add `asymmetric` variant for BTS gallery |
| `text-image` | **EXTEND** | Services | Add `centered` variant for statement sections |

---

## 6. SECTION SCHEMA DESIGN

### 6A. `editorial-list` — NEW

```typescript
interface EditorialListItem {
  id: string;
  number: string;    // Auto-padded: "01", "02", etc.
  title: string;
  description: string | null;
}

interface EditorialListContent {
  heading: string | null;
  description: string | null;
  items: EditorialListItem[];
}
```

**Required fields:** `items`
**Optional fields:** `heading`, `description`
**Array:** `items` (min 1, no max)
**Image fields:** None
**Focal-point fields:** None
**Validation rules:**
  - `items` must be non-empty array
  - Each item must have `title`
  - `number` auto-generated from index if empty
**Empty-state:** Render nothing if `items` is empty
**Responsive:** Single column on all breakpoints

---

### 6B. `cinematic-image` — NEW

```typescript
interface CinematicImageContent {
  image: string;
  mobile_image: string | null;
  image_alt: string | null;
  focal_x: number;         // 0-1, default 0.5
  focal_y: number;         // 0-1, default 0.5
  caption: string | null;
  caption_alignment: 'left' | 'center';  // default 'left'
}
```

**Required fields:** `image`
**Optional fields:** `mobile_image`, `image_alt`, `caption`, `caption_alignment`
**Array fields:** None
**Image fields:** `image`, `mobile_image`
**Focal-point fields:** `focal_x`, `focal_y`
**Validation rules:**
  - `image` must be non-empty URL
  - `focal_x` and `focal_y` clamped to 0-1
**Empty-state:** Render nothing if `image` is empty
**Responsive:** Full-width on all breakpoints; height uses `clamp(350px, 50vh, 550px)`

---

### 6C. `team-members` — NEW

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string | null;
}

interface TeamMembersContent {
  heading: string | null;
  members: TeamMember[];
}
```

**Required fields:** `members`
**Optional fields:** `heading`
**Array:** `members` (min 1, no max)
**Image fields:** `members[].image`
**Focal-point fields:** None
**Validation rules:**
  - `members` must be non-empty array
  - Each member must have `name`, `role`, `image`
  - First member is default featured
**Empty-state:** Render nothing if `members` is empty
**Responsive:** 2-col on desktop (6+6), stacked on mobile (image above list)

---

### 6D. `image-carousel` — NEW

```typescript
interface CarouselImage {
  id: string;
  src: string;
  alt: string | null;
}

interface ImageCarouselContent {
  heading: string | null;
  description: string | null;
  images: CarouselImage[];
}
```

**Required fields:** `images`
**Optional fields:** `heading`, `description`
**Array:** `images` (min 1, no max)
**Image fields:** `images[].src`
**Focal-point fields:** None
**Validation rules:**
  - `images` must be non-empty array
  - Each image must have `src`
**Empty-state:** Render nothing if `images` is empty
**Responsive:** Horizontal scroll on all breakpoints; image width `clamp(280px, 40vw, 520px)`

---

### 6E. `portfolio-gallery` — EXTEND (add `asymmetric` variant)

**No schema change.** Add variant to `sectionTypes.ts`:

```typescript
{
  variants: [
    { id: 'grid', label: 'Grid' },
    { id: 'masonry', label: 'Masonry' },
    { id: 'asymmetric', label: 'Asymmetric' },  // NEW
  ]
}
```

**Renderer change:** When `variant === 'asymmetric'`, render the 3-row 7+5/5+7/4+8 layout instead of grid/masonry.

---

### 6F. `text-image` — EXTEND (add `centered` variant)

**No schema change.** Add variant to `sectionTypes.ts`:

```typescript
{
  variants: [
    { id: 'default', label: 'Split' },
    { id: 'split', label: 'Image Left' },
    { id: 'centered', label: 'Centered' },  // NEW
  ]
}
```

**Renderer change:** When `variant === 'centered'`:
- Full-width centered text (no 2-col grid)
- Text centered horizontally
- No image rendered even if present
- Gold divider animation below heading

---

## 7. RENDERER REQUIREMENTS

### 7A. `editorial-list` Renderer

**Content schema:** `EditorialListContent`
**Desktop:** Full-width section. Optional heading + description. Vertical list of items, each in a 12-col grid: `col-span-1` (number) + `col-span-4` (title) + `col-span-7` (description). Divider lines between items.
**Tablet:** Same layout, reduced padding.
**Mobile:** Stacked: number above title above description.
**Animation:** Staggered reveal on scroll (each item fades in with delay).
**Empty state:** Render nothing.

---

### 7B. `cinematic-image` Renderer

**Content schema:** `CinematicImageContent`
**Desktop:** Full-width section, `clamp(350px, 50vh, 550px)` height. Absolute background image with `object-cover` and `objectPosition` from focal points. Dark gradient overlay. Caption positioned at bottom.
**Tablet:** Same, full-width.
**Mobile:** Use `mobile_image` if available, else `image`. Same layout.
**Animation:** Subtle zoom on scroll (`scale(1.05)` → `scale(1)`).
**Empty state:** Render nothing.

---

### 7C. `team-members` Renderer

**Content schema:** `TeamMembersContent`
**Desktop:** 12-col grid: `col-span-6` (featured image) + `col-span-6` (member list). Image aspect 4:5. List items with hover/focus to swap featured image. Tab-accessible.
**Tablet:** Same layout.
**Mobile:** Featured image above, member list below. Tap to select member.
**Animation:** Image crossfade on member change. Staggered list reveal.
**Empty state:** Render nothing.

---

### 7D. `image-carousel` Renderer

**Content schema:** `ImageCarouselContent`
**Desktop:** Optional heading + description. Horizontal scroll track with snap. Images at `clamp(280px, 40vw, 520px)` width, 3:4 aspect. Left/right navigation buttons.
**Tablet:** Same, images slightly smaller.
**Mobile:** Same, images at min width 280px.
**Animation:** Smooth scroll. Fade-in on reveal.
**Empty state:** Render nothing.

---

### 7E. `portfolio-gallery` (asymmetric variant)

**Desktop:** 3-row asymmetric grid: Row 1 (7+5), Row 2 (5+7), Row 3 (4+8). Images fill containers with `object-cover`. Hover zoom.
**Tablet:** Stacked or 2-col equal.
**Mobile:** Single column.
**Animation:** Staggered reveal. Hover scale.

---

### 7F. `text-image` (centered variant)

**Desktop:** Full-width centered text. No image column. Heading centered with gold divider below. Body text centered. Max-width `860px`.
**Tablet:** Same.
**Mobile:** Same with reduced padding.
**Animation:** Standard reveal.
**Empty state:** Render nothing.

---

## 8. ADMIN EDITOR REQUIREMENTS

### 8A. `editorial-list` Editor

- Heading input
- Description textarea
- Reorderable item list (drag + up/down arrows)
- Per-item fields:
  - Number input (auto-padded, read-only or editable)
  - Title input
  - Description textarea
- Add/remove item buttons

### 8B. `cinematic-image` Editor

- Image picker (MediaPicker) — required
- Mobile image picker (MediaPicker) — optional
- Alt text input
- Focal point sliders (X/Y, 0-1)
- Caption input
- Caption alignment selector (left/center)

### 8C. `team-members` Editor

- Heading input
- Reorderable member list (drag + up/down arrows)
- Per-member fields:
  - Name input
  - Role input
  - Image picker (MediaPicker) — required
  - Description textarea
- Add/remove member buttons

### 8D. `image-carousel` Editor

- Heading input
- Description textarea
- Reorderable image list (drag + up/down arrows)
- Per-image fields:
  - Image picker (MediaPicker) — required
  - Alt text input
- Add/remove image buttons

### 8E. `portfolio-gallery` (asymmetric variant)

- No new editor fields. Existing editor works. Just add variant option.

### 8F. `text-image` (centered variant)

- No new editor fields. Existing editor works. Just add variant option.

---

## 9. DATABASE STRATEGY

### Migration Approach

**Create one new migration:** `20260902000000_0012_add_cms_sections_and_types.sql`

**Step 1: Update `SectionType` enum** (if using enum) or just rely on the string type in the `section_type` column. The current schema uses `text DEFAULT 'text-image'` for `section_type`, so no enum change needed — new types work immediately.

**Step 2: Add new section records for missing sections**

| Page | New Section Title | Section Type | sort_order |
|---|---|---|---|
| About | Cinematic Break | `cinematic-image` | 2 (after brand-statement) |
| About | Our Beliefs | `editorial-list` | 4 (after vision) |
| About | Team | `team-members` | 7 (before CTA) |
| Services | Introduction | `text-image` | 1 (after hero) |
| Services | Weddings | `text-image` | 3 (after services-editorial) |
| Services | Corporate | `text-image` | 4 |
| Services | Celebrations | `text-image` | 5 |
| Services | Production | `text-image` | 6 |
| Services | Visual Moments | `image-carousel` | 7 |
| Services | Why Fiesta | `editorial-list` | 8 |
| Services | Statement | `text-image` | 9 |
| How We Work | Introduction | `text-image` | 1 (after hero) |
| How We Work | Visual Transition | `cinematic-image` | 3 (after process) |
| How We Work | Differentiators | `editorial-list` | 4 |
| How We Work | Behind the Scenes | `portfolio-gallery` | 5 |

**Step 3: Populate content for all new sections**

Each UPDATE uses the `content` jsonb field with production data from the fallback source files.

**Step 4: Update existing sections with empty data**

- About process: populate `steps` array with 4 steps from fallback
- Services process: populate `steps` array with 5 steps from HowWeWork STAGES
- HowWeWork process: populate `steps` array with 5 steps from STAGES

**Step 5: Renumber `sort_order` for all affected pages**

After adding new sections, renumber all section sort_orders for each page to ensure correct rendering order.

### RLS

No changes needed. Existing RLS policies (`public.is_staff()`) already allow staff to write sections. Anon key has SELECT only — which is correct.

### No duplicate pages
All new sections go into existing page records. No new pages created.

### No hardcoded UUIDs in new sections
New sections get auto-generated UUIDs from Supabase.

---

## 10. CONTENT MIGRATION MAPPING

### About Page

| CMS Section Title | sort_order | Source | Source Lines |
|---|---|---|---|
| Hero | 0 | About.tsx TEAM constant / hero area | L59-161 |
| Our Story | 1 | About.tsx brand statement area | L163-269 |
| Cinematic Break | 2 | **NEW** — About.tsx cinematic image break | L275-310 |
| Our Beliefs | 4 | **NEW** — About.tsx "What Fiesta Believes" | L316-398 |
| Mission | 2 (renumber) | About.tsx mission block | L412-439 |
| Vision | 3 (renumber) | About.tsx vision block | L443-469 |
| Approach | 4 (renumber) | About.tsx approach — STAGES from HowWeWork | L479-571 |
| Values | 5 (renumber) | Stats from fallback (populate) | — |
| Team | 7 | **NEW** — About.tsx TEAM constant | L11-17, L578-680 |
| Testimonials | 6 (renumber) | Existing, populate | — |
| Call to Action | 8 (renumber) | About.tsx CTA | L686-747 |

### Services Page

| CMS Section Title | sort_order | Source | Source Lines |
|---|---|---|---|
| Hero | 0 | Services.tsx hero area | L141-228 |
| Introduction | 1 | **NEW** — Services.tsx intro area | L234-324 |
| Services Overview | 2 | Existing services-editorial | — |
| Weddings | 3 | **NEW** — Services.tsx weddings block | L457-535 |
| Corporate | 4 | **NEW** — Services.tsx corporate block | L541-627 |
| Celebrations | 5 | **NEW** — Services.tsx celebrations block | L633-718 |
| Production | 6 | **NEW** — Services.tsx production block | L724-812 |
| Visual Moments | 7 | **NEW** — Services.tsx carousel | L818-1145 |
| Why Fiesta | 8 | **NEW** — Services.tsx why fiesta | L854-946 |
| Statement | 9 | **NEW** — Services.tsx final statement | L952-986 |
| Call to Action | 10 | Existing CTA | — |

### How We Work Page

| CMS Section Title | sort_order | Source | Source Lines |
|---|---|---|---|
| Hero | 0 | HowWeWork.tsx hero | L111-185 |
| Introduction | 1 | **NEW** — HowWeWork.tsx intro | L191-277 |
| Process | 2 | Existing process — populate STAGES | L283-354 |
| Visual Transition | 3 | **NEW** — HowWeWork.tsx transition | L360-395 |
| Differentiators | 4 | **NEW** — HowWeWork.tsx differentiators | L401-465 |
| Behind the Scenes | 5 | **NEW** — HowWeWork.tsx BTS gallery | L471-540 |
| Call to Action | 6 | Existing CTA | — |

---

## 11. FALLBACK REMOVAL REQUIREMENTS

### About Fallback Removal Requires:
- [x] Hero (`hero-carousel` — populated)
- [x] Our Story (`brand-statement` — populated)
- [ ] Cinematic Break (`cinematic-image` — **needs creation + population**)
- [ ] Our Beliefs (`editorial-list` — **needs creation + population**)
- [x] Mission (`text-image` — populated)
- [x] Vision (`text-image` — populated)
- [ ] Approach (`process` — **needs steps populated**)
- [ ] Values (`stats` — **needs stats populated**)
- [ ] Team (`team-members` — **needs creation + population**)
- [ ] Testimonials (`testimonials` — **needs populated**)
- [x] CTA (`cta` — populated)

**About requires:** 5 new sections created + 4 existing sections populated + 3 new section types implemented

### Services Fallback Removal Requires:
- [x] Hero (`hero-carousel` — populated)
- [ ] Introduction (`text-image` — **needs creation + population**)
- [x] Services Overview (`services-editorial` — populated)
- [ ] Weddings (`text-image` — **needs creation + population**)
- [ ] Corporate (`text-image` — **needs creation + population**)
- [ ] Celebrations (`text-image` — **needs creation + population**)
- [ ] Production (`text-image` — **needs creation + population**)
- [ ] Visual Moments (`image-carousel` — **needs creation + population**)
- [ ] Why Fiesta (`editorial-list` — **needs creation + population**)
- [ ] Statement (`text-image` centered — **needs creation + population**)
- [x] CTA (`cta` — populated)

**Services requires:** 9 new sections created + 1 new section type implemented + 1 type extended

### How We Work Fallback Removal Requires:
- [x] Hero (`hero-carousel` — populated)
- [ ] Introduction (`text-image` — **needs creation + population**)
- [ ] Process (`process` — **needs steps populated**)
- [ ] Visual Transition (`cinematic-image` — **needs creation + population**)
- [ ] Differentiators (`editorial-list` — **needs creation + population**)
- [ ] Behind the Scenes (`portfolio-gallery` asymmetric — **needs variant + population**)
- [x] CTA (`cta` — populated)

**How We Work requires:** 4 new sections created + 1 existing populated + 1 type extended

---

## 12. RISKS & TRADEOFFS

### Risk: Process vs Editorial-List Confusion
The `process` type already exists and shows numbered items. However, its visual layout (5-column centered grid with 16x16 circular images) is fundamentally different from the editorial-list pattern (full-width vertical list with 12-col grid). Using `process` for editorial-list content would be a visual compromise. **Recommendation: Create `editorial-list` as a distinct type.**

### Risk: Text-Image Centered Variant
The `centered` variant for `text-image` is a significant layout change (from 2-col to full-width centered). This is acceptable because:
1. The variant system already exists but is unused
2. The renderer already handles `image = null`
3. The visual difference is purely layout, not content model

### Risk: Image Carousel vs Portfolio Gallery
The carousel and portfolio-gallery have different interaction models (horizontal scroll vs grid). Creating a separate `image-carousel` type is cleaner than overloading `portfolio-gallery`. **Recommendation: Separate type.**

### Risk: Team Members Scope
The team-members section is only used on About. However, it's a genuinely different content model (interactive list with image swap) that may be reused on other pages in the future. **Recommendation: Create as reusable type.**

### Tradeoff: Number of New Types
Adding 4 new section types (editorial-list, cinematic-image, team-members, image-carousel) brings the total from 11 to 15. This is manageable because:
- Each type serves a distinct, reusable content model
- The admin editor system already supports adding new types via the registry
- The SectionRenderer already supports dynamic type mapping

---

## 13. RECOMMENDED IMPLEMENTATION ORDER

| Step | Action | Depends On | Files Changed |
|---|---|---|---|
| 1 | Add `editorial-list` type + renderer + editor | Nothing | types.ts, sectionTypes.ts, SectionRenderer.tsx, SectionEditorRegistry.tsx, new renderer, new editor |
| 2 | Add `cinematic-image` type + renderer + editor | Nothing | Same pattern |
| 3 | Add `team-members` type + renderer + editor | Nothing | Same pattern |
| 4 | Add `image-carousel` type + renderer + editor | Nothing | Same pattern |
| 5 | Extend `portfolio-gallery` with `asymmetric` variant | Nothing | sectionTypes.ts, PortfolioRenderer.tsx |
| 6 | Extend `text-image` with `centered` variant | Nothing | sectionTypes.ts, TextImageRenderer.tsx |
| 7 | Create migration `0012_*` — add all new section records | Steps 1-6 complete | supabase/migrations/ |
| 8 | Populate all CMS content via migration | Step 7 | Migration file |
| 9 | Verify CMS rendering matches fallback visual | Step 8 | None (browser test) |
| 10 | Remove About.tsx fallback | Step 9 verified | About.tsx |
| 11 | Remove Services.tsx fallback | Step 9 verified | Services.tsx |
| 12 | Remove HowWeWork.tsx fallback | Step 9 verified | HowWeWork.tsx |
| 13 | Clean up unused imports and constants | Steps 10-12 | About.tsx, Services.tsx, HowWeWork.tsx |
| 14 | Run build + typecheck | All steps | — |
| 15 | Write PHASE_13_11_3_CMS_COVERAGE_REPORT.md | Step 14 | — |

**Estimated sections to create:** 14 new section records
**Estimated sections to update:** 4 existing (populate empty content)
**New section types:** 4
**Extended types:** 2

---

PHASE 13.11.2: COMPLETE
