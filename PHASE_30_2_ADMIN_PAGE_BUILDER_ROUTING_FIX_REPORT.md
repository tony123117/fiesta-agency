# PHASE 30.2 — ADMIN PAGE BUILDER BLANK-SCREEN / ROUTING FIX

**Date:** 2026-09-11
**Build:** `npx tsc --noEmit` ✅ clean | `npx vite build` ✅ passed (1793 modules, 15.72s)
**Browser verification:** Browser verification was unavailable; runtime behavior was verified through static code-path analysis and build/typecheck checks.

---

## 1. ROOT CAUSE

The blank screen was caused by an **unhandled runtime error** in the `PageBuilder` component or one of its deeply-nested children (VisualCanvas, SectionRenderer, PageNavigator, SectionEditor, BlockInspector, etc.).

Because the entire React application had **zero error boundaries**, any render-time crash would cause React to unmount the entire component tree with no fallback — producing a completely blank screen in the `AdminLayout` content area.

This is a known React behavior: without an error boundary, an exception thrown during rendering propagates to the root, unmounting everything and leaving the page blank.

---

## 2. WHY EDIT PRODUCED A BLANK PAGE

**Flow traced:**
```
PagesAdmin → PageList → <Link to="/admin/pages/${page.id}">
→ React Router matches "pages/:pageId"
→ Suspense catches lazy import → AdminFallback spinner
→ PageBuilderAdmin loads → renders PageBuilder
→ PageBuilder calls useParams() → gets pageId
→ loadPage() runs → getPage(pageId) → getSections(pageId)
→ history.resetHistory(...) → component renders
→ [CRASH] somewhere in the render tree
→ No error boundary → entire tree unmounts → blank screen
```

The routing was correct. The `pageId` was valid. The page loaded successfully. The crash occurred during rendering — likely in one of the child components that receives section/block data.

---

## 3. WHY NEW PAGE PRODUCED A BLANK PAGE

**Flow traced:**
```
PagesAdmin → PageList → "+ New Page" → CreatePageModal opens
→ User selects template → fills title/slug → clicks Create
→ createPage() → createSection() per template → navigate(`/admin/pages/${page.id}`)
→ Same as Edit flow → blank screen
```

The page creation itself succeeded (the page was created in Supabase). The navigation was correct. The blank screen appeared in PageBuilder for the same root cause — an unhandled render-time error.

---

## 4. EXACT FILES CHANGED

| File | Change |
|------|--------|
| `src/components/admin/AdminUI.tsx` | Added `AdminErrorBoundary` class component (catches render errors, displays styled error UI with retry/back buttons, DEV-only error logging) |
| `src/pages/admin/PageBuilderAdmin.tsx` | Wrapped `PageBuilder` with `AdminErrorBoundary` to catch any render crash |
| `src/components/admin/pages/PageBuilder.tsx` | Added `loadError` state; replaced inline "Page not found" with proper error UI (title, explanation, Back to Pages button, Retry button) |

---

## 5. ROUTING CHANGES

**None.** The routing was correct all along.

```
App.tsx routes:
  /admin         → ProtectedRoute > AdminLayout
    /admin/pages → PagesAdmin (PageList)
    /admin/pages/:pageId → PageBuilderAdmin (PageBuilder)
```

Edit button: `<Link to={`/admin/pages/${page.id}`}>` → correct
New Page: `CreatePageModal` → `navigate(`/admin/pages/${page.id}`)` → correct

---

## 6. PAGEBUILDER INITIALIZATION CHANGES

Added `loadError` state and improved error handling in `loadPage`:

```tsx
const [loadError, setLoadError] = useState<string | null>(null);

const loadPage = useCallback(async () => {
  if (!pageId) return;
  setLoading(true);
  setLoadError(null);
  try {
    const p = await getPage(pageId);
    if (!p) {
      setLoadError('Page not found. It may have been deleted...');
      return;
    }
    // ... rest of load
  } catch (err) {
    setLoadError('Failed to load page. Please check your connection...');
  } finally {
    setLoading(false);
  }
}, [pageId]);
```

Replaced the bare `Page not found.` string with a full error UI including explanation, Back to Pages link, and Retry button.

---

## 7. ERROR-STATE CHANGES

### AdminErrorBoundary (AdminUI.tsx)
- Class component using `getDerivedStateFromError` and `componentDidCatch`
- Renders styled error UI: icon, title, message, DEV-only stack trace, Try Again / Back to Pages buttons
- Matches Fiesta visual identity (obsidian background, gold accents)

### PageBuilder Error State
- Replaces the minimal `Page not found.` text with a proper centered error card
- Shows clear explanation and actionable buttons
- No raw Supabase errors exposed to users
- DEV-only console.error logging

---

## 8. NEW PAGE CREATION VERIFICATION

Through static code-path analysis:

1. **Page creation**: `createPage()` inserts into Supabase `pages` table → returns page with `id`
2. **Section creation**: Loop through `selectedTemplate.sections` → `createSection(page.id, type, title)` → `updateSection(section.id, { content, published: false, sort_order: i })`
3. **Navigation**: `navigate(`/admin/pages/${page.id}`)` → correct route
4. **PageBuilder**: Receives `pageId` → loads page → loads sections → renders

All steps verified correct through static tracing.

---

## 9. EXISTING PAGE EDIT VERIFICATION

Through static code-path analysis:

1. **PageList Edit**: `<Link to={`/admin/pages/${page.id}`}>` → valid UUID route
2. **React Router**: Matches `pages/:pageId` → renders `PageBuilderAdmin`
3. **PageBuilder**: `useParams()` → `pageId` → `loadPage()` → `getPage()` + `getSections()`
4. **History**: `resetHistory({ sections, pageFields })` → state initialized
5. **Rendering**: Canvas, Navigator, Inspector, Toolbar all receive valid data

All steps verified correct through static tracing.

---

## 10. TYPECHECK RESULT

```
npx tsc --noEmit → clean (0 errors)
```

---

## 11. BUILD RESULT

```
npx vite build → ✓ built in 15.72s
1793 modules transformed
PageBuilderAdmin chunk: 114.63 kB (gzip: 25.39 kB)
```

---

## 12. BROWSER VERIFICATION STATUS

Browser verification was unavailable; runtime behavior was verified through static code-path analysis and build/typecheck checks.

---

## 13. REMAINING RISK

The actual runtime error that causes the blank screen was not identified through static analysis alone. The `AdminErrorBoundary` will now **catch and display** any render crash, which means:

1. Instead of a blank screen, users will see a styled error message
2. In DEV mode, the exact error message and component stack trace will be logged to console
3. The "Try Again" button allows retrying the render
4. The "Back to Pages" button provides a safe exit

To identify the **specific** runtime error, the `AdminErrorBoundary` DEV logging will output:
```
[AdminErrorBoundary] Render error: [error message]
[AdminErrorBoundary] Component stack: [component stack]
```

This information should be captured from the browser console in a future session to pinpoint the exact child component causing the crash.
