# CMS-DOCUMENTATION.md — Fiesta Agency

## Architecture Overview

The CMS is built directly on Supabase tables. There is no separate CMS framework — the admin UI interacts with the database through service functions, and the public website reads the same data through Supabase queries.

### Key Concept: Content vs Design

The CMS controls **content**. The code controls **design**.

| CMS Controls | Code Controls |
|-------------|--------------|
| Page titles and descriptions | Visual layout of each section |
| Section ordering | Typography and colors |
| Section visibility (published/draft) | Component design |
| Section content (text, images, settings) | Responsive behavior |
| SEO metadata | Animations and transitions |
| Collection records (events, portfolio, etc.) | Navigation design |
| Media references | Footer design |
| Site settings | Button styles |

This means an administrator can change *what* content appears on a page and in what order, but the *visual design* of each section type is defined in React components.

---

## Data Model

```
Page (1) ──→ (N) Sections
  │               │
  │               └── section_type determines which renderer is used
  │               └── content JSON holds all section-specific data
  │
  ├── seo_title, seo_description, og_image_url
  └── published, slug
```

### Pages Table
Each page has a unique slug, title, description, and SEO fields.

### Sections Table
Each section belongs to a page, has a `section_type`, a `content` JSON column, a `sort_order`, and a `published` flag.

---

## How Content Flows

```
1. Admin creates/edits section in PageBuilder
2. Section content saved to Supabase sections table
3. Public page fetches sections via getSections(pageId)
4. Sections filtered by published=true, ordered by sort_order
5. Each section passed to SectionRenderer
6. SectionRenderer maps section_type → React component
7. Component receives section.content as props
8. Component renders with fallback values for missing fields
```

---

## Section Types (50 total)

See [SECTION-SYSTEM.md](./SECTION-SYSTEM.md) for the complete list.

---

## CMS Pages

| Admin Route | Page Slug | Sections Managed |
|------------|-----------|-----------------|
| `/admin/home` | `home` | hero-carousel, brand-statement, services-editorial, events-editorial, portfolio-gallery, testimonials, stats, cta |
| `/admin/about` | `about` | about-intro, about-story, about-mission, about-values, about-team, about-closing |
| `/admin/services` | `services` | services-hero, services-featured, services-cards, stats, services-process, testimonials, faq, services-cta |
| `/admin/how-we-work` | `how-we-work` | hww-hero, hww-intro, hww-process, hww-behind, hww-why, hww-cta |
| `/admin/events` | `events` | events-hero, events-filter, events-featured, events-upcoming, events-past, events-cta, faq |
| `/admin/portfolio` | `portfolio` | portfolio-hero, portfolio-filtered-gallery, portfolio-featured |
| `/admin/contact` | `contact` | contact-hero, contact-info, contact-location, contact-cta, faq |

---

## Collection Management

In addition to page sections, the CMS manages these collections directly:

| Collection | Admin Page | Database Table |
|-----------|-----------|---------------|
| Events | EventsAdmin | `events` |
| Portfolio Projects | PortfolioAdmin | `portfolio_projects` |
| Testimonials | TestimonialsAdmin | `testimonials` |
| FAQs | FAQsAdmin | `faqs` |
| Services | ServicesCMSAdmin | `services` |
| Bookings | BookingsAdmin | `bookings` |
| Media | MediaAdmin | `media` |
| Site Settings | SettingsAdmin | `site_settings` |

---

## Publishing Model

Every publishable entity has a `published` boolean:
- **Pages**: `published` controls whether the page is publicly visible
- **Sections**: `published` controls whether the section renders on the public site
- **Events**: `published` controls visibility in the public events listing
- **Portfolio**: `published` controls visibility in the public portfolio
- **Testimonials**: `published` controls visibility in testimonial sections
- **FAQs**: `published` controls visibility in FAQ sections
- **Services**: `published` controls visibility in service listings

---

## Preview System

The admin includes a preview system:
- **Section Preview Modal** — Shows how a section will look on the public site
- **Full Page Preview** — Renders the entire page with all sections in a modal
- **Visual Canvas** — Drag-and-drop block editor for the `blocks` section type

---

## See Also

- [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md)
- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md)
- [CONTENT-MODEL.md](./CONTENT-MODEL.md)
