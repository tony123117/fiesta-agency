# PUBLIC-PAGES.md — Fiesta Agency

## Page List

| Route | Page | Sections |
|-------|------|----------|
| `/` | Home | hero-carousel, brand-statement, services-editorial, events-editorial, portfolio-gallery, testimonials, stats, cta |
| `/about` | About | about-intro, about-story, about-mission, about-values, about-team, about-closing |
| `/services` | Services | services-hero, services-featured, services-cards, stats, services-process, testimonials, faq, services-cta |
| `/events` | Events | events-hero, events-filter, events-featured, events-upcoming, events-past, events-cta, faq |
| `/portfolio` | Portfolio | portfolio-hero, portfolio-filtered-gallery, portfolio-featured |
| `/how-we-work` | How We Work | hww-hero, hww-intro, hww-process, hww-behind, hww-why, hww-cta |
| `/contact` | Contact | contact-hero, contact-info, contact-location, contact-cta, faq |
| `/events/:slug` | Event Detail | Dynamic event page with gallery |
| `/portfolio/:slug` | Portfolio Detail | Dynamic project page with story |
| `/privacy` | Privacy | Legal page renderer |
| `/terms` | Terms | Legal page renderer |
| `*` | Not Found | 404 page |

---

## CMS-Hybrid Pattern

Each public page uses a hybrid approach:

1. **Fetches CMS data** from Supabase (pages, sections, collections)
2. **Passes data as props** to existing inline components
3. **Falls back to hardcoded values** when CMS data is missing

This means:
- Content can be updated via the admin UI
- Design remains consistent and controlled by code
- Pages work even if CMS data is missing

---

## SEO

Each page sets its own metadata via the `useDocumentMeta` hook:

```typescript
useDocumentMeta({
  title: 'Services | Fiesta Agency',
  description: 'Comprehensive event management services...',
  canonicalPath: '/services',
  ogImage: '/og-services.jpg',
});
```

The hook sets:
- `document.title`
- `meta[name="description"]`
- `meta[property="og:title"]`
- `meta[property="og:description"]`
- `meta[property="og:image"]`
- `meta[property="og:site_name"]`
- `meta[property="og:type"]`
- `meta[property="og:url"]`
- `link[rel="canonical"]`

---

## Dynamic Pages

### Event Detail (`/events/:slug`)
- Fetches event by slug from Supabase
- Shows cover image, title, details, gallery, lineup
- Related events shown at bottom

### Portfolio Detail (`/portfolio/:slug`)
- Fetches project by slug from Supabase
- Shows cover image, title, details, story, gallery
- Related projects shown at bottom

---

## Shared Elements

All public pages share:
- **Navbar** — Fixed navigation with scroll effects
- **Footer** — Company info, nav links, social links, copyright
- **WhatsApp Button** — Floating CTA button
- **Scroll-to-top** — Automatic on route change

---

## See Also

- [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
- [SEO-DOCUMENTATION.md](./SEO-DOCUMENTATION.md)
