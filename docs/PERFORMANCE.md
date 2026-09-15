# PERFORMANCE.md — Fiesta Agency

## Build Output

| Chunk | Size | Purpose |
|-------|------|---------|
| index.js | 68 kB | Core app, routing |
| SectionRenderer.js | 153 kB | All 50 section renderers |
| PageBuilder.js | 152 kB | Admin page builder |
| supabase.js | 126 kB | Supabase client |
| vendor.js | 165 kB | React, React DOM, React Router |

Total: ~664 kB (before gzip)

---

## Code Splitting

All page components are lazy-loaded via `React.lazy()`. This means:
- Initial bundle loads quickly
- Page-specific code loads on demand
- Admin code is separate from public code

---

## Performance Features

| Feature | Status |
|---------|--------|
| Lazy loading | ✅ |
| Image optimization | ⚠️ Manual (alt text, focal point) |
| CSS purging | ✅ (Tailwind) |
| Gzip compression | ⚠️ Hosting provider |
| CDN | ⚠️ Hosting provider |
| Caching | ⚠️ Hosting provider |

---

## Optimization Opportunities

- Image compression before upload
- Implement next-gen formats (WebP, AVIF)
- Add loading="lazy" to images
- Consider code splitting SectionRenderer further
- Implement service worker for offline support

---

## See Also

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
