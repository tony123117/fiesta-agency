# KNOWN-LIMITATIONS.md — Fiesta Agency

## Current Limitations

| Area | Limitation | Impact |
|------|-----------|--------|
| Testing | No automated test suite | Risk of regressions |
| TypeScript | 114 pre-existing errors | Type safety gaps |
| Linting | 31 pre-existing warnings | Code quality |
| SEO | No structured data (JSON-LD) | Reduced search visibility |
| SEO | No sitemap from CMS data | Manual updates needed |
| SEO | No automatic 301 redirects | URL changes break links |
| Analytics | No analytics integration | No usage data |
| Performance | No image compression | Larger file sizes |
| Performance | No CDN configuration | Slower global delivery |
| Accessibility | No WCAG audit | Potential barriers |
| Accessibility | No skip-to-content link | Keyboard navigation |
| CMS | Page preview in modal only | Limited preview |
| CMS | No real-time updates | Manual refresh needed |
| Auth | No password reset flow | Manual intervention needed |
| Auth | No email verification | Manual account creation |
| Media | No image transformation | Manual optimization |
| Media | No video support | Limited media types |
| Internationalization | No i18n support | English only |
| Offline | No service worker | No offline support |

---

## Dynamic Pages

Dynamic detail pages (`/events/:slug`, `/portfolio/:slug`) require populated Supabase data to function correctly. Code structure is confirmed correct, but content must exist in the database.

---

## Production Domain

`robots.txt` and `sitemap.xml` reference `https://fiestaagency.com`. If deploying to a different domain, these files must be updated.

---

## See Also

- [TESTING-AND-QA.md](./TESTING-AND-QA.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
