# Phase 13.6 — Production CMS Integration Hardening

## 13.6.1 Loading States

**Issue found and fixed:** While PageRenderer loads CMS data, `hasCmsContent` was `null`, causing neither CMS content nor fallback to render — blank page flash.

**Fix applied:** Changed condition from `hasCmsContent === false` to `hasCmsContent !== true` in all 4 CMS pages (Home, About, Services, HowWeWork). Now:
- Loading (`null`): fallback shows immediately
- CMS loaded with sections (`true`): CMS content shows, fallback hides
- CMS loaded without sections (`false`): fallback shows

**Files changed:** Home.tsx, About.tsx, Services.tsx, HowWeWork.tsx

## 13.6.2 Error States

PageRenderer catches errors and calls `onHasContent(false)` → fallback shows. This is correct behavior — Supabase failure shows the hardcoded production content.

## 13.6.3 Stale Data

No React Query or caching library is used. PageRenderer fetches fresh data on each mount via `useEffect`. After edit → save → publish, navigating to the public page triggers a fresh fetch. No stale data issue.

## 13.6.4 Public Cache Behavior

- No server-side rendering or static generation
- Client-side fetching on each page load
- Browser cache: standard HTTP caching (Supabase CDN headers)
- No application-level caching for page/section data
- `useSiteSettings` has module-level cache with 5-min TTL (already optimized in Phase 11)

## 13.6.5 Empty States

**Verified via code inspection:**
- HeroCarousel: returns null when slides empty ✓
- ServicesRenderer: returns null when services empty ✓
- StatsRenderer: returns null when stats empty ✓
- ProcessRenderer: returns null when steps empty ✓
- TestimonialsRenderer: falls back to useHomeData(), returns null if both empty ✓
- PortfolioRenderer: falls back to useHomeData(), returns null if both empty ✓
- FAQRenderer: falls back to useHomeData(), returns null if both empty ✓
- EventsRenderer: falls back to useHomeData(), returns null if both empty ✓
- CMSBrandStatement: renders empty section shell if data has empty fields (minor)
- CTARenderer: renders empty dark section shell if data has empty fields (minor)
- TextImageRenderer: renders text-only layout when image empty (acceptable)

## 13.6.6 Media Failure

Section renderers use `<img>` with standard HTML behavior. Missing/broken images show alt text or empty space. No catastrophic failure. No error boundaries needed.

## 13.6.7 Section Ordering

`sort_order` is set by array index in `reorderSections()`. PageRenderer fetches sections ordered by `sort_order`. No duplicate ordering issues.

## 13.6.8 Visibility

**Page level:** PageRenderer checks `page.published` — unpublished pages return `onHasContent(false)`
**Section level:** `secs.filter((s) => s.published)` — unpublished sections filtered out
**Correct behavior:** Unpublished page → fallback; published page with unpublished section → section hidden

## 13.6.9 SEO Safety

Each CMS page fetches `seo_title`, `seo_description`, `og_image_url` from CMS. Falls back to hardcoded defaults if CMS fields empty. `useDocumentMeta` updates `document.title` and meta tags reactively.

**Potential issue:** Client-side navigation may briefly show stale title from previous page. `useDocumentMeta` useEffect cleans up on unmount but doesn't reset title — this is acceptable for SPA behavior.

## 13.6.10 Auth/RLS

**Public RLS:** `SELECT WHERE published = true OR public.is_staff()` — anon users see only published content
**Staff RLS:** Full CRUD on pages/sections
**No weakening:** No public write policies, no draft exposure

## 13.6.11 Database Verification

- Migration 0009 (SEO fields): Applied ✓
- Migration 0010 (seed sections): Applied ✓
- Schema: `pages` (id, slug, title, published, seo_title, seo_description, og_image_url), `sections` (id, page_id, section_type, content, sort_order, published)
- No new migrations needed for Phase 13.4-13.6

## 13.6.12 Performance

**No duplicate requests detected:**
- PageRenderer: 1 query per page load (getPageBySlug + getSections)
- SEO fetch: 1 query per page load (getPageBySlug — may be cached by browser)
- Section renderers: no additional queries (useHomeData fetches once, shared across renderers)

**Minor optimization opportunity:** SEO fetch duplicates the PageRenderer's getPageBySlug call. Could be consolidated, but not critical.

## 13.6.13 Accessibility

- Heading hierarchy: preserved in all section renderers
- Image alt text: CMS content includes `image_alt` fields
- Button labels: all interactive elements have accessible labels
- Keyboard navigation: carousel controls, FAQ accordions, form inputs all keyboard accessible
- Focus states: preserved via Tailwind focus utilities
- Carousel controls: prev/next buttons with aria-labels

## 13.6.14 Security

- No `dangerouslySetInnerHTML` in section renderers
- All content rendered as React elements (XSS-safe)
- Image URLs from Supabase storage (signed URLs for private, public URLs for public)
- No HTML injection risk — content is JSONB, rendered as text/elements

## 13.6.15 Public Route Matrix

| Route | Expected | Actual |
|-------|----------|--------|
| `/` | CMS Home (fallback) | PageRenderer slug="home" + fallback ✓ |
| `/about` | CMS About (fallback) | PageRenderer slug="about" + fallback ✓ |
| `/services` | CMS Services (fallback) | PageRenderer slug="services" + fallback ✓ |
| `/how-we-work` | CMS HowWeWork (fallback) | PageRenderer slug="how-we-work" + fallback ✓ |
| `/events` | Collection-driven | Direct Supabase query ✓ |
| `/portfolio` | Collection-driven | Direct Supabase query ✓ |
| `/contact` | Collection-driven | Direct Supabase query ✓ |
| `*` | NotFound | Catch-all route ✓ |

## 13.6.16 End-to-End Test

NOT BROWSER VERIFIED — requires manual testing of:
- Test A: Edit text → save → publish → public verify
- Test B: Change image → save → publish → public verify
- Test C: Drag focal point → save → reload → verify coordinates → public verify crop
- Test D: Reorder sections → save → publish → public verify order
- Test E: Edit → save draft → public verify old content
- Test F: Unpublish section → public verify hidden
- Test G: Restore production content

## Files Changed (Phase 13.4-13.6)

| File | Change |
|------|--------|
| `src/pages/public/Home.tsx` | Loading fix: `hasCmsContent === false` → `hasCmsContent !== true` |
| `src/pages/public/About.tsx` | Loading fix + CMS-first + SEO |
| `src/pages/public/Services.tsx` | Loading fix + CMS-first + SEO |
| `src/pages/public/HowWeWork.tsx` | Loading fix + CMS-first + SEO |

## Remaining Blockers

NONE — all code changes compile and build successfully.

## Remaining Non-Blockers

1. Browser verification not performed (requires manual testing)
2. CMS sections have empty arrays — admin must fill via Page Builder
3. CMS sections have empty images — admin must add via Page Builder
4. About/Services/HowWeWork missing sections — admin must create via Page Builder
5. CTA typos in CMS content ("Lets" → "Let's")
6. SEO fetch duplicates PageRenderer's getPageBySlug (minor)
