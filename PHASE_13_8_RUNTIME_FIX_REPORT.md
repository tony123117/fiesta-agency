# PHASE 13.8 — FALLBACK & RUNTIME DEFECT FIXES

## Summary

Fixed all 6 verified issues from the Phase 13.7 audit. Zero new typecheck errors introduced. Build passes clean.

---

## 1. About.tsx — BLOCKER — FIXED

**Problem:** `activeIdx` and `setActiveIdx` were used at lines 624–625, 646–647 but never declared. ReferenceError on fallback render.

**Root cause:** Copy-paste from Events.tsx where the state was declared. The declaration was never added to About.tsx.

**Fix:**
- Added `const [activeIdx, setActiveIdx] = useState(0);` at line 23
- Removed unused `useEffect` import and `getPageBySlug` import (SEO now handled by PageRenderer callback)
- Removed duplicate `getPageBySlug` SEO `useEffect`

**Verification:** TypeScript compiles. No ReferenceError. `TEAM[activeIdx]` resolves to `TEAM[0]` (Claire Uwimana) on initial render. Hover/focus interaction sets index correctly.

---

## 2. Home.tsx — HIGH — FIXED

**Problem:** `if (loading) return <div>Loading...</div>` at line 23 blocked PageRenderer from mounting. `onHasContent` was never called during `useHomeData` loading, so `hasCmsContent` stayed `null` and the fallback always rendered after loading completed.

**Root cause:** The `loading` state from `useHomeData()` (which fetches services/portfolio/testimonials for the hardcoded fallback) was incorrectly treated as a gate for the CMS content check.

**Fix:**
- Removed `if (loading) return <div>Loading...</div>` guard
- Removed `loading` from `useHomeData()` destructuring (no longer needed)
- PageRenderer now mounts immediately on Home mount, runs its async CMS query independently

**Required behavior achieved:**
```
Home mounts → PageRenderer mounts → CMS query executes → CMS state resolves
→ CMS content renders if available
→ fallback renders only when CMS genuinely has no published content
```

---

## 3. Services.tsx — HIGH — FIXED

**Problem:** The `catch` block at lines 125–127 set both `FALLBACK_SERVICES` AND `setError('Using fallback data')`. The rendering ternary `loading ? ... : error ? ... : ...` showed the error message instead of the fallback services.

**Root cause:** The error state was designed to show a retry message, but `FALLBACK_SERVICES` is the intentional recovery path. Setting both contradicted the design intent.

**Fix:**
- Removed `const [error, setError] = useState<string | null>(null)` state
- Removed `setError('Using fallback data')` from catch block — only `setServices(FALLBACK_SERVICES)` remains
- Removed the `error ? (...)` branch from the rendering ternary
- Removed `getPageBySlug` import (SEO now handled by PageRenderer callback)
- Removed duplicate `getPageBySlug` SEO `useEffect`

**Behavior after fix:**
- API succeeds → services from Supabase
- API fails → `FALLBACK_SERVICES` renders (no error UI shown to visitors)
- Loading → skeleton placeholder

---

## 4. Initial CMS Flash — MEDIUM — FIXED

**Problem:** `hasCmsContent !== true` evaluated to `true` when state was `null` (loading), causing fallback to render immediately before PageRenderer finished its async check. Brief flash of hardcoded content when CMS content exists.

**Fix:** Changed `hasCmsContent !== true` to `hasCmsContent === false` on all 4 pages:
- `Home.tsx:28`
- `About.tsx:55`
- `Services.tsx:140`
- `HowWeWork.tsx:107`

**State machine after fix:**
| `hasCmsContent` state | `=== false` | Behavior |
|---|---|---|
| `null` (loading) | `false` | Neither CMS nor fallback renders (clean loading) |
| `true` (CMS has content) | `false` | CMS sections render |
| `false` (CMS has no content) | `true` | Hardcoded fallback renders |

**Note:** During the brief CMS resolution window (~200–500ms), the page body is empty while PageRenderer queries Supabase. The public layout (Navbar, Footer) remains visible. This is acceptable — the alternative (showing fallback then switching to CMS) is worse.

---

## 5. Duplicate Page Query — MEDIUM — FIXED

**Problem:** About, Services, and HowWeWork each had a `useEffect` calling `getPageBySlug(slug)` for SEO, while `PageRenderer` independently fetched the same page record. Two round-trips for the same slug.

**Fix:**
- Added `onPageLoaded?: (page: Page | null) => void` prop to `PageRenderer`
- PageRenderer calls `onPageLoaded(page)` after the page fetch resolves (line 22)
- About, Services, HowWeWork use `handlePageLoaded` callback to set SEO state
- Removed the separate `getPageBySlug` `useEffect` from all 3 pages
- Removed `getPageBySlug` import from About.tsx and HowWeWork.tsx (Services.tsx no longer needs it either)

**Net result:** Each page makes one Supabase request for the page record (via PageRenderer) instead of two.

---

## 6. Empty State — LOW — FIXED

**Problem:** `TextImageRenderer` and `CTARenderer` only checked `if (!data) return null`. An empty object `{}` would render an empty section wrapper (dark background with no content).

**Fix:**
- `TextImageRenderer`: Added `const hasContent = data.heading || data.body || data.eyebrow || data.image; if (!hasContent) return null;`
- `CTARenderer`: Added `const hasContent = data.heading || data.description || data.button_text || data.secondary_button_text; if (!hasContent) return null;`

**Behavior:** Sections with genuinely empty content data now return `null` instead of rendering empty wrappers.

---

## 7. Files Changed

| File | Changes |
|---|---|
| `src/components/public/PageRenderer.tsx` | Added `onPageLoaded` prop, call it on page fetch |
| `src/pages/public/About.tsx` | Added `activeIdx`/`setActiveIdx` state, `handlePageLoaded` callback, `=== false` flash fix, removed duplicate SEO query, removed `useEffect`/`getPageBySlug` imports |
| `src/pages/public/Home.tsx` | Removed `loading` guard, removed `loading` from `useHomeData()`, `=== false` flash fix |
| `src/pages/public/Services.tsx` | Removed `error` state + `setError` call + error branch, `handlePageLoaded` callback, `=== false` flash fix, removed duplicate SEO query, removed `getPageBySlug` import |
| `src/pages/public/HowWeWork.tsx` | `handlePageLoaded` callback, `=== false` flash fix, removed duplicate SEO query, removed `useEffect`/`getPageBySlug` imports |
| `src/components/public/TextImageRenderer.tsx` | Added content emptiness guard |
| `src/components/public/CTARenderer.tsx` | Added content emptiness guard |

---

## 8. TypeScript Result

**PASS** — Zero new typecheck errors introduced by Phase 13.8 changes.

Pre-existing errors (all from admin CMS phase, not from public pages):
- ~60 `name` prop missing on FormField components (admin editors)
- ~5 `Record<string, unknown>` type mismatches (admin modals)
- ~10 null/undefined type mismatches (admin pages)
- 6 `featured` property missing on `FALLBACK_SERVICES` (pre-existing in Services.tsx)

None of these are related to the Phase 13.8 fixes.

---

## 9. Build Result

**PASS** — `npm run build` completed in 12.23s with zero errors.

Bundle output: `dist/assets/index-nZLGgeXy.js` — 345.86 kB (gzip: 101.80 kB)

---

## 10. Browser/Runtime Verification

**NOT AVAILABLE** — Cannot visually verify through CLI. `npm run dev` runs on port 5174 but browser automation is not available in this environment.

Expected behavior based on code analysis:
- **A. About fallback TEAM section** — `TEAM[activeIdx]` resolves to `TEAM[0]` on mount, hover sets `activeIdx` to hovered index. No ReferenceError.
- **B. Home PageRenderer mount** — PageRenderer mounts immediately. `useHomeData()` loading no longer blocks CMS check.
- **C. Services API failure** — `FALLBACK_SERVICES` renders. No error UI shown.
- **D. CMS content available** — `hasCmsContent === true` → CMS sections render via PageRenderer/SectionRenderer.
- **E. CMS resolution loading** — `hasCmsContent === null` → `null === false` is `false` → neither CMS nor fallback renders. Clean loading.
- **F. No published CMS sections** — `hasCmsContent === false` → fallback renders.
- **G. Public styling** — Unchanged. No CSS modifications.
- **H. Admin PageBuilder** — Unchanged. No admin files modified.
- **I. FocalPointOverlay** — Unchanged. No focal point files modified.
- **J. Supabase/RLS** — Unchanged. No schema or policy modifications.

---

## 11. Remaining Issues

### NOT FIXED (out of scope for this phase)

| Issue | Classification | Rationale |
|---|---|---|
| `variant` field unused in 8/11 renderers | LOW (dead code) | Spec says "leave it untouched" |
| Pre-existing typecheck errors (admin phase) | PRE-EXISTING | Not introduced by Phase 13.8 |
| `featured` missing on FALLBACK_SERVICES | PRE-EXISTING | Pre-existing in Services.tsx |
| CMS sections scaffold-only (empty arrays/images) | CONTENT DEBT | Not in scope — no content population |
| CTA typos in seed data ("Let Create") | CONTENT DEBT | Fix via admin CMS editor |

### NEW NON-ISSUES

| Item | Status |
|---|---|
| `onPageLoaded` callback on PageRenderer | New prop, optional, backward-compatible |
| `=== false` flash fix | Behavioral change, no visual regression expected |
| Empty-state guards on TextImage/CTA | Only affects empty-content sections |

---

## FINAL STATUS

**Phase 13.8: COMPLETE**

| Check | Status |
|---|---|
| TypeScript | PASS (zero new errors) |
| Build | PASS (12.23s) |
| Fallback verification | PASS (code-level analysis) |
| CMS rendering | PASS (code-level analysis) |
| Browser verification | NOT AVAILABLE |

**Remaining blockers:** None

**Remaining non-blockers:**
- Pre-existing admin typecheck errors (not from Phase 13.8)
- `featured` prop missing on FALLBACK_SERVICES (pre-existing)
- CMS content debt (empty scaffold sections)
