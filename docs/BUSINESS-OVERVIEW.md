# BUSINESS-OVERVIEW.md — Fiesta Agency

## Company Context

Fiesta Agency is a creative event agency that designs, produces, and manages events across multiple cities. The company handles weddings, corporate events, private celebrations, concerts, and large-scale productions.

The website serves as the company's primary digital presence and lead generation tool.

---

## Market Positioning

Fiesta operates in the premium/luxury event segment. The brand competes on:

- **Creative direction** — not just planning, but designing the entire experience
- **Production quality** — technical capability (staging, lighting, sound, broadcast)
- **Attention to detail** — every element is considered and intentional
- **Multi-city operation** — ability to handle events across different locations

---

## Operational Workflow

```
Inquiry Received (website form + Web3Forms email)
      ↓
Booking Recorded (Supabase bookings table)
      ↓
Admin Reviews (BookingsAdmin dashboard)
      ↓
Status Updated (new → contacted → in_progress → confirmed)
      ↓
Event Planned & Produced (offline process)
      ↓
Event Completed
      ↓
Portfolio Updated (admin adds project to portfolio)
      ↓
Testimonial Collected (admin adds to testimonials)
      ↓
Website Updated (new content showcases the work)
```

---

## Content Workflow

### Public Content
Content on the public website comes from two sources:

1. **CMS-controlled content** — Pages, sections, ordering, visibility, metadata, collection records (events, portfolio, testimonials, FAQs) — all managed through the admin
2. **Code-controlled design** — Visual system, component design, layout, typography, colors, animations — all defined in React components and Tailwind

### Admin Content Management
Administrators can:
- Edit page sections through the visual page builder
- Reorder sections by dragging
- Toggle section visibility
- Edit section content (text, images, settings)
- Add/remove/reorder sections on pages
- Manage events (CRUD with images, gallery, metadata)
- Manage portfolio projects (CRUD with stories, galleries)
- Manage testimonials (add, edit, reorder)
- Manage FAQs (add, edit, categorize)
- Track bookings (status updates, notes)
- Upload and organize media
- Configure site settings (company info, navigation, footer, SEO)

---

## Revenue Model

The website supports Fiesta's revenue by:
- Attracting prospective clients through search and social
- Showcasing past work to build credibility
- Converting visitors into booking inquiries
- Enabling the team to manage content without developer costs

---

## See Also

- [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md)
- [PRODUCT-DOCUMENTATION.md](./PRODUCT-DOCUMENTATION.md)
- [USER-FLOWS.md](./USER-FLOWS.md)
