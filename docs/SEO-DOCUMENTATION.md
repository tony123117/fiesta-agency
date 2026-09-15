# SEO-DOCUMENTATION.md — Fiesta Agency

## Implementation

SEO is handled through the `useDocumentMeta` hook, which sets all standard meta tags per page.

---

## Meta Tags Set Per Page

| Tag | Source |
|-----|--------|
| `title` | `useDocumentMeta({ title })` |
| `meta[name="description"]` | `useDocumentMeta({ description })` |
| `meta[property="og:title"]` | Same as title |
| `meta[property="og:description"]` | Same as description |
| `meta[property="og:image"]` | `ogImage` parameter |
| `meta[property="og:site_name"]` | `'Fiesta Agency'` |
| `meta[property="og:type"]` | `'website'` |
| `meta[property="og:url"]` | `'https://fiestaagency.com' + canonicalPath` |
| `link[rel="canonical"]` | `'https://fiestaagency.com' + canonicalPath` |

---

## Static SEO Files

- `public/robots.txt` — Allows all crawlers, points to sitemap
- `public/sitemap.xml` — Lists all 10 public routes with lastmod dates

---

## CMS-Managed SEO

Pages in the database have SEO fields:
- `seo_title` — Custom title tag
- `seo_description` — Custom meta description
- `og_image_url` — Custom OG image

These are available but the `useDocumentMeta` hook currently uses hardcoded values per page. CMS SEO integration is optional.

---

## SEO Best Practices Followed

- Unique title and description per page
- Canonical URLs to prevent duplicate content
- Open Graph tags for social sharing
- Semantic HTML structure
- Alt text on images
- Descriptive URLs (slugs)

---

## Known SEO Limitations

- No structured data (JSON-LD)
- No sitemap generation from CMS data
- No automatic 301 redirects
- No page-level analytics tracking

---

## See Also

- [PUBLIC-PAGES.md](./PUBLIC-PAGES.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
