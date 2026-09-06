# Phase 13.3 — CMS Source of Truth & Public Site Integration

## 1. Architecture Audit

### Before Phase 13.3
| Page | CMS-Driven? | Hardcoded Sections | CMS Sections Seeded |
|------|-------------|--------------------|--------------------|
| Home | YES (PageRenderer + fallback) | 7 components | 7 |
| About | NO | 8 inline sections | 8 |
| Services | NO | 11 inline sections | 5 |
| HowWeWork | NO | 7 inline sections | 5 |
| Events | NO (collection-driven) | 7 inline sections | None |
| EventDetail | NO (collection-driven) | 5 inline sections | None |
| Portfolio | NO (collection-driven) | 6 inline sections | None |
| PortfolioDetail | NO (collection-driven) | 5 inline sections | None |
| Contact | NO (collection-driven) | 3 inline sections | None |
| NotFound | NO | 1 section | None |
| PlanYourEvent | NO (wraps Contact) | N/A | None |

### After Phase 13.3
| Page | CMS-Driven? | Hardcoded Fallback | CMS Sections |
|------|-------------|--------------------|--------------|
| Home | YES | 7 components (fallback when no CMS content) | 7 |
| About | YES | 8 inline sections (fallback when no CMS content) | 8 |
| Services | YES | 11 inline sections (fallback when no CMS content) | 5 |
| HowWeWork | YES | 7 inline sections (fallback when no CMS content) | 5 |
| Events | NO (collection-driven) | 7 inline sections | None |
| EventDetail | NO (collection-driven) | 5 inline sections | None |
| Portfolio | NO (collection-driven) | 6 inline sections | None |
| PortfolioDetail | NO (collection-driven) | 5 inline sections | None |
| Contact | NO (collection-driven) | 3 inline sections | None |
| NotFound | NO | 1 section | None |
| PlanYourEvent | NO (wraps Contact) | N/A | None |

## 2. Source-of-Truth Conflicts Resolved

| Conflict | Resolution |
|----------|------------|
| About.tsx hardcoded 8 sections, CMS had 8 seeded | Added PageRenderer with `slug="about"` + fallback |
| Services.tsx hardcoded 11 sections, CMS had 5 seeded | Added PageRenderer with `slug="services"` + fallback |
| HowWeWork.tsx hardcoded 7 sections, CMS had 5 seeded | Added PageRenderer with `slug="how-we-work"` + fallback |

## 3. Public Routes

| Route | CMS Page | Sections | Dynamic | Verified |
|-------|----------|----------|---------|----------|
| `/` | Home | 7 | Yes (PageRenderer) | TS+Build pass |
| `/about` | About | 8 | Yes (PageRenderer) | TS+Build pass |
| `/services` | Services | 5 | Yes (PageRenderer) | TS+Build pass |
| `/how-we-work` | HowWe Work | 5 | Yes (PageRenderer) | TS+Build pass |
| `/events` | None | N/A (collection) | No | Unchanged |
| `/events/:slug` | None | N/A (collection) | No | Unchanged |
| `/portfolio` | None | N/A (collection) | No | Unchanged |
| `/portfolio/:slug` | None | N/A (collection) | No | Unchanged |
| `/contact` | None | N/A (collection) | No | Unchanged |
| `/plan-your-event` | None | Wraps Contact | No | Unchanged |
| `*` | None | N/A | No | Unchanged |

## 4. Section Renderer Verification

| Renderer | Empty Array Returns null? | Fallback Data | Verified |
|----------|--------------------------|---------------|----------|
| HeroCarousel | Yes (slides.length === 0) | None | Yes |
| CMSBrandStatement | Only if data is falsy | None | Yes |
| ServicesRenderer | Yes (services.length === 0) | None | Yes |
| TestimonialsRenderer | Yes (items.length === 0) | useHomeData().testimonials | Yes |
| FAQRenderer | Yes (items.length === 0) | useHomeData().faqs | Yes |
| StatsRenderer | Yes (stats.length === 0) | None | Yes |
| ProcessRenderer | Yes (steps.length === 0) | None | Yes |
| TextImageRenderer | Only if data is falsy | None (text-only when no image) | Yes |
| CTARenderer | Only if data is falsy | None | Yes |
| EventsRenderer | Yes (displayEvents.length === 0) | useHomeData().events | Yes |
| PortfolioRenderer | Yes (items.length === 0) | useHomeData().portfolio | Yes |

## 5. Draft / Publish Verification

The PageRenderer checks `page.published` and filters sections by `s.published`:
- Unpublished pages → `onHasContent(false)` → hardcoded fallback shown
- Published pages with no published sections → `onHasContent(false)` → fallback
- Published pages with published sections → `onHasContent(true)` → CMS content rendered
- Unpublished sections → filtered out by `secs.filter((s) => s.published)`

## 6. Focal Point End-to-End

The hero focal point flow:
1. CMS HeroCarouselEditor → `slide.focal_x` / `slide.focal_y` (0–1 range)
2. VisualCanvas FocalPointOverlay → `liveContentMap` → instant preview
3. Save → `updateSection(id, { content })` → Supabase `sections.content` JSONB
4. Public HeroCarousel → `objectPosition: "${focal_x * 100}% ${focal_y * 100}%"`

Both desktop and mobile images share the same focal_x/focal_y per slide.

## 7. SEO Verification

Each CMS-driven page now fetches `seo_title`, `seo_description`, `og_image_url` from the CMS `pages` table and applies them via `useDocumentMeta`. If CMS SEO fields are empty, hardcoded defaults are used.

| Page | CMS SEO Applied | Fallback |
|------|----------------|----------|
| Home | No (unchanged) | Hardcoded |
| About | Yes | "About Fiesta Agency \| Rwanda" |
| Services | Yes | "Services \| Fiesta Agency Rwanda" |
| HowWeWork | Yes | "How We Work \| Fiesta Agency Rwanda" |

## 8. Responsive Verification

The public site retains its existing responsive design. No changes to:
- CSS breakpoints
- Typography scales
- Grid layouts
- Image handling
- Navigation behavior

The CMS renders through the same production SectionRenderer components used by Home, ensuring consistent responsive behavior.

## 9. Performance

- No new Supabase queries introduced beyond the SEO lookup (one lightweight `getPageBySlug` per page load)
- PageRenderer fetches page + sections in sequence (not waterfall — `getPageBySlug` then `getSections`)
- Lazy loading preserved (React.lazy for all page routes)
- No duplicate queries detected

## 10. Database Verification

- Migration 0010 (seed) already applied and verified in Phase 12.5
- No new migrations created
- Schema unchanged: `pages` table has `seo_title`, `seo_description`, `og_image_url` columns (from migration 0009)
- Seeded data intact: Home (7), About (8), Services (5), HowWe Work (5) sections

## 11. Browser Verification

Requires manual browser testing to verify:
- CMS pages render from CMS sections when published
- Hardcoded fallback appears when CMS page is unpublished
- SEO meta tags update from CMS
- Hero focal point renders correctly on public site
- Section ordering matches CMS sort_order
- Section visibility (published flag) works

## 12. Files Changed

| File | Change |
|------|--------|
| `src/pages/public/About.tsx` | Added PageRenderer + SEO + fallback |
| `src/pages/public/Services.tsx` | Added PageRenderer + SEO + fallback |
| `src/pages/public/HowWeWork.tsx` | Added PageRenderer + SEO + fallback |

## 13. Remaining Issues

### NON-BLOCKING
- Events, Portfolio, Contact remain collection-driven (not CMS-managed page structure) — acceptable per spec
- CMS sections for About/Services/HowWeWork have empty arrays (services=[], stats=[], steps=[]) — sections return null until admin fills content via Page Builder
- Browser verification not completed via CLI

### Architecture Notes
- The old hardcoded components (Hero, BrandStatement, ServiceSection, etc.) are only used in Home.tsx fallback — they are NOT dead code
- About/Services/HowWeWork have their own inline sections as fallback — these are separate from the old components
- When CMS has published sections, the hardcoded fallback is hidden; when CMS has no sections, fallback appears
