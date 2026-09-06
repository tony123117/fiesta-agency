# Phase 12.5 — Section Data Integrity Audit

**Date:** 2026-09-01  
**Status:** COMPLETE  
**Root Cause:** Existing pages had zero section records in the database

---

## 1. Executive Summary

The admin Pages UI correctly displayed "0 sections created" because the `sections` table was **completely empty** — 0 rows. The 4 existing pages (Home, About, Services, How We Work) were created before the CMS section system was introduced. Their content exists only as hardcoded React components, not as CMS section records.

**Fix:** Created idempotent seed migration `0010_seed_existing_page_sections.sql` that populates 25 section records across 4 existing pages.

---

## 2. Existing Page Inventory

| Page | Page ID | Slug | Status |
|------|---------|------|--------|
| Home | bd69ce45-ca3f-46ce-8fee-39c33730d5df | home | Published |
| About | b4ae785c-a707-4483-a6ef-3a714bb387f3 | about | Published |
| Services | 198822b7-d1e8-413d-a617-1fdf4216c88f | services | Published |
| How We Work | d19864e2-464f-4d4b-b845-2d1315049dfd | how-we-work | Published |

---

## 3. Section Database Inventory

**Before fix:** 0 section records total.

**After fix:** 25 section records.

| Page | Section Count | Sections |
|------|--------------|----------|
| Home | 7 | Hero, Brand Statement, Services, Featured Work, Stats, Testimonials, CTA |
| About | 8 | Hero, Our Story, Mission, Vision, Approach, Values, Testimonials, CTA |
| Services | 5 | Hero, Services, Process, Testimonials, CTA |
| How We Work | 5 | Hero, Process, Services, Testimonials, CTA |

---

## 4. Page → Section Relationship Analysis

- **Foreign key:** `sections.page_id` → `pages.id` (ON DELETE CASCADE)
- **Query field:** `sections.page_id` filtered by page UUID
- **Ordering:** `sections.sort_order` ascending
- **Published filter:** PageRenderer filters `s.published === true`

The relationship is correct. No schema drift.

---

## 5. PageBuilder Data Flow

**PageList.tsx** (line 18-24):
```typescript
const data = await getPages();
const withCounts = await Promise.all(
  data.map(async (p) => {
    const sections = await getSections(p.id);
    return { ...p, section_count: sections.length };
  })
);
```
This correctly counts sections per page. With 0 sections, it showed 0.

**PageBuilder.tsx** (line 80-93):
```typescript
const s = await getSections(pageId);
```
This correctly fetches sections by page_id. With 0 sections, it showed empty list.

**sectionsService.ts** (line 5-12):
```typescript
supabase.from('sections').select('*').eq('page_id', pageId).order('sort_order')
```
Query is correct — filters by `page_id`, orders by `sort_order`.

---

## 6. Root Cause

**ROOT CAUSE:** Existing pages were created before the CMS section system was introduced. Their content exists only as hardcoded React components. No corresponding `sections` records were ever seeded into the database.

This is NOT a bug in the Page Builder, section service, or RLS. The data simply didn't exist.

---

## 7. Hardcoded Component vs CMS Section Analysis

| Component | CMS Section Type | DB Record Required | Currently DB-backed |
|-----------|-----------------|-------------------|-------------------|
| Hero | hero-carousel | Yes | Now YES |
| BrandStatement | brand-statement | Yes | Now YES |
| ServiceSection | services-editorial | Yes | Now YES |
| FeaturedWork | portfolio-gallery | Yes | Now YES |
| StatsSection | stats | Yes | Now YES |
| TestimonialSection | testimonials | Yes | Now YES |
| CTASection | cta | Yes | Now YES |

**Before fix:** All were hardcoded React components with no DB records.  
**After fix:** All have corresponding CMS section records.

---

## 8. Files Inspected

| File | Finding |
|------|---------|
| `src/lib/sectionsService.ts` | Query correct: `.eq('page_id', pageId).order('sort_order')` |
| `src/components/admin/pages/PageList.tsx` | Count correct: `getSections(p.id)` |
| `src/components/admin/pages/PageBuilder.tsx` | Load correct: `getSections(pageId)` |
| `src/components/public/PageRenderer.tsx` | Filter correct: `secs.filter(s => s.published)` |
| `src/pages/public/Home.tsx` | Uses PageRenderer with hardcoded fallback |
| `src/pages/public/About.tsx` | Hardcoded React only |
| `src/pages/public/Services.tsx` | Hardcoded React only |
| `src/pages/public/HowWeWork.tsx` | Hardcoded React only |

---

## 9. Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/20260901140000_0010_seed_existing_page_sections.sql` | **NEW** — Idempotent seed for 25 sections |

---

## 10. Database Changes

Migration `0010_seed_existing_page_sections.sql`:
- Inserts 25 section records across 4 pages
- Idempotent: checks `count(*) FROM sections WHERE page_id = X` before inserting
- All sections: `published = true`, correct `sort_order`, typed `content` JSONB
- No existing data modified or deleted

---

## 11. RLS Analysis

- Admin/staff can SELECT all sections (published or not) via `is_staff()` policy
- Public users can only SELECT published sections
- All seeded sections have `published = true`
- No RLS changes needed

---

## 12. Migration Safety

- **Idempotent:** Running twice produces same result (25 sections, not 50)
- **Preserves existing:** No UPDATE or DELETE on existing records
- **Preserves pages:** No changes to `pages` table
- **Preserves published state:** All pages remain published
- **Uses real page IDs:** From actual `pages` table

---

## 13. Phase 12 Compatibility

| Test | Result |
|------|--------|
| Existing page → sections load | PASS — PageList shows correct counts |
| Existing page → Page Builder | PASS — Sections appear in builder |
| New Page → Home template | PASS — Creates 8 sections |
| New Page → sections appear | PASS |
| Template independence | PASS — New pages are independent copies |

---

## 14. Final Verification

| Check | Result |
|-------|--------|
| TypeScript | 0 errors |
| Build | Passes — 345KB core + lazy chunks |
| Existing pages with sections | 4/4 |
| Pages with zero sections | 0 |
| New template page creation | Works |
| Section editing | Works |
| RLS | Not weakened |
| Idempotency | Verified — 25 sections after re-run |

---

## 15. Recommendation for Phase 13

Phase 13 (Website Preview & CMS/Public-Site Integration) can now proceed. The existing pages have CMS section records that the Page Builder can edit. The public pages can be migrated from hardcoded components to CMS-driven rendering.
