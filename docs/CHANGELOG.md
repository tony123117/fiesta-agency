# CHANGELOG.md — Fiesta Agency

## Version History

### Phase 36+ (Latest)
- Fixed mobile navbar background color
- Fixed TypeScript config deprecation
- Fixed contact form preview
- Fixed events preview spacing
- Added FAQ renderer to services, events, contact pages
- Added contact email/phone/address editable in PageBuilder
- Added admin sidebar collapse (persisted in localStorage)
- Added booking dual-save (Web3Forms + Supabase)
- Fixed Web3Forms API key (4996 → 4096)

### Pre-Launch Fixes
- Enhanced `useDocumentMeta` with canonicalPath, og:site_name, og:type, og:url
- Added canonical URL tag to all 14 public pages
- Created `public/robots.txt` and `public/sitemap.xml`
- Installed `dompurify` and `@types/dompurify`
- Created `src/lib/sanitize.ts` (DOMPurify wrapper)
- Applied sanitization to `BlocksSectionRenderer` and `BlockRenderer`
- Removed debug console.log statements from Contact and ContactInfo
- Removed fire-and-forget .catch() logging

### Phase 36.1
- Responsive testing: 56/56 tests pass across 7 viewports
- Fidelity audit: All 7 public pages verified against reference

### Earlier Phases
- Complete admin UI with 19 admin pages
- CMS page builder with 50 section types
- Event and portfolio management
- Testimonial and FAQ management
- Media library with upload and management
- Site settings with navigation and footer
- Contact form with Web3Forms integration
- Supabase backend with RLS
- Authentication and role-based access
- Public pages with CMS-hybrid rendering
- Responsive design across all viewports

---

## Production Status

| Metric | Value |
|--------|-------|
| Version | 3.10.0 |
| Score | 9.2/10 |
| Verdict | ✅ READY WITH MINOR FIXES |
| Last Audit | September 2026 |

---

## See Also

- [FINAL_PRODUCTION_AUDIT_REPORT.md](../FINAL_PRODUCTION_AUDIT_REPORT.md)
