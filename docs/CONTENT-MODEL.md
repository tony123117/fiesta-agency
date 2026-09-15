# CONTENT-MODEL.md — Fiesta Agency

## Core Entities

```
┌─────────────────────────────────────────────────┐
│                     Page                         │
│  slug, title, description, published, SEO       │
│  navigation: [{label, href, order, visible}]    │
│  footer: [{label, href, group}]                 │
└──────────────────┬──────────────────────────────┘
                   │ has many
┌──────────────────▼──────────────────────────────┐
│                   Section                        │
│  section_type, content (JSON), sort_order        │
│  published, layout, title, subtitle, body        │
│  image_url, image_alt                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  Collection                     │
│  services, events, portfolio, testimonials, faqs │
│  Each has: title, slug, published, sort_order    │
│  Each has: type-specific fields                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                 Site Settings                    │
│  Single row: company_name, logo, contact info    │
│  Social links, navigation, footer config         │
│  SEO defaults                                    │
└─────────────────────────────────────────────────┘
```

---

## Page → Sections Relationship

Each page has many sections. Sections are ordered by `sort_order`. Sections can be published/unpublished independently of the page.

---

## Section Content JSON

Each section type has a specific content structure defined in `sectionTypes.ts`. Examples:

```json
// hero-carousel
{
  "slides": [
    {
      "title": "Fiesta",
      "subtitle": "Your Vision, Our Craft",
      "media": { "type": "image", "image_url": "..." }
    }
  ],
  "cta_primary": { "label": "Explore Our Universe", "href": "/about" },
  "cta_secondary": { "label": "Get In Touch", "href": "/contact" }
}

// services-editorial
{
  "heading": "Services",
  "subtext": "Comprehensive event management",
  "items": [
    {
      "label": "CONCEPT DEVELOPMENT",
      "title": "Ideation & Concept",
      "text": "Creative direction...",
      "media": { "type": "image", "image_url": "..." }
    }
  ],
  "cta": { "label": "Explore Our Services", "href": "/services" }
}

// blocks (freeform)
{
  "blocks": [
    { "type": "heading", "content": { "text": "...", "level": 2 } },
    { "type": "paragraph", "content": { "text": "..." } },
    { "type": "image", "content": { "url": "...", "alt": "..." } }
  ]
}
```

---

## Media Model

Media is a library of uploaded files. Each media record has:
- A reference to a file in Supabase Storage
- Alt text for accessibility
- Focal point for responsive cropping
- MIME type and dimensions

Media can be referenced by:
- Section `image_url`
- Section `content` JSON (e.g., slide images, service images)
- Event `cover_image` and `gallery`
- Portfolio `cover_image` and `gallery`
- Settings `logo_url`, `og_image_url`

---

## Navigation Model

Navigation items are stored in `site_settings.navigation` as a JSON array:

```json
[
  { "label": "About", "href": "/about", "order": 1, "visible": true },
  { "label": "Services", "href": "/services", "order": 2, "visible": true }
]
```

---

## Footer Model

Footer content is stored in `site_settings`:
- `footer_groups` — Array of link groups with title and links
- `footer_cta` — Call-to-action with heading, subtext, button
- `copyright_text` — Copyright notice
- `footer_hero_image` — Background image for footer area

---

## See Also

- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md)
- [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md)
- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md)
