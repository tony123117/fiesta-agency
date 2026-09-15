# PROJECT-OVERVIEW.md — Fiesta Agency

## What Fiesta Agency Is

Fiesta Agency is a luxury event experience company that designs, produces, and manages weddings, celebrations, corporate events, and premium experiences. The company operates across multiple cities and handles events ranging from intimate candlelit dinners for thirty to large-scale stadium productions for thousands.

The Fiesta Agency website is the company's digital presence — a public-facing showcase of their work, services, and brand, combined with a full content management system that allows the team to update content, manage bookings, and control the website without code changes.

---

## Brand Positioning

Fiesta positions itself as a premium, editorial-quality event agency. The brand language is cinematic, refined, and detail-obsessed. The website reflects this through:

- **Dark luxury aesthetic** — deep obsidian backgrounds with gold (#D6A64F) accents
- **Editorial typography** — serif headings (Fraunces) paired with clean sans-serif body text (Manrope)
- **Full-bleed imagery** — large-format event photography with careful composition
- **Understated interaction** — subtle reveal animations, no flashy effects
- **Confident copy** — direct, authoritative, no filler

The tagline is: *"Moments that live long after the night ends."*

---

## Event Services

Fiesta handles the full spectrum of event experiences:

| Service | Description |
|---------|------------|
| Event Planning | End-to-end planning from concept through execution |
| Event Production | Staging, lighting, sound, technical planning, live execution |
| Weddings & Celebrations | Bespoke weddings and milestone celebrations |
| Corporate Events | Product launches, conferences, awards, brand experiences |
| Private Events | Intimate gatherings and customized experiences |

---

## What the Website Shows

### Public Website

The public website presents:

- **Home** — Hero carousel, brand statement, services, events, testimonials, stats, CTA
- **About** — Agency story, mission, values, team, closing CTA
- **Services** — Service showcase with hero, featured services, cards, process, testimonials, FAQ
- **Events** — Filterable event gallery (upcoming/past), individual event detail pages
- **Portfolio** — Filterable project gallery, individual project detail pages with stories
- **How We Work** — Five-phase process: discovery, design, planning, production, experience
- **Contact / Plan Your Event** — Contact form, location info, FAQ
- **Privacy / Terms** — Legal pages

### Admin CMS

The admin system provides:

- Dashboard with stats, upcoming events, recent bookings
- Page management with visual page builder
- Section ordering, visibility, content editing
- Event CRUD with images, gallery, lineup, ticket URLs
- Portfolio CRUD with stories, galleries, categories
- Testimonial management
- FAQ management
- Booking management with status tracking
- Media library with upload, focal point, alt text
- Site settings (company info, navigation, footer, SEO)

---

## The Experience

A visitor to the Fiesta website encounters:

1. **Arrival** — Full-screen hero with cinematic event photography
2. **Exploration** — Scroll through services, events, portfolio, testimonials
3. **Connection** — Learn about the agency, process, and team
4. **Action** — Submit a booking inquiry through the contact form
5. **Follow-through** — Booking stored in Supabase, email sent via Web3Forms

An administrator encounters:

1. **Login** — Email/password authentication via Supabase Auth
2. **Dashboard** — Overview of events, bookings, stats
3. **Content editing** — Visual page builder with section management
4. **Collection management** — Events, portfolio, testimonials, FAQs
5. **Media** — Upload, organize, and reference images
6. **Settings** — Company info, navigation, footer, SEO configuration

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| React + TypeScript | Type safety, component architecture, ecosystem |
| Supabase | Auth + database + storage in one platform, rapid development |
| Tailwind CSS | Utility-first styling, consistent design system, small production CSS |
| Custom CMS | Full control over content model, no third-party CMS dependency |
| Vite | Fast development, optimized builds, native ESM |
| Web3Forms | Simple form-to-email without backend email server |

---

## See Also

- [PRODUCT-DOCUMENTATION.md](./PRODUCT-DOCUMENTATION.md)
- [BUSINESS-OVERVIEW.md](./BUSINESS-OVERVIEW.md)
- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)
