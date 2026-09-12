# FIESTA AGENCY — COMPLETE ADMIN CMS AUDIT

> **Date:** September 8, 2026
> **Model:** MiMo V2.5 Free
> **Scope:** Full forensic audit of every Admin/CMS feature, database, public rendering, security, and architecture.
> **Status:** READ-ONLY AUDIT. No code modified.

---

## EXECUTIVE SUMMARY

Fiesta Agency is a React 18 + Vite + TypeScript SPA backed by Supabase. The admin CMS has a **surprisingly deep implementation** — 15 admin pages, 40+ admin components, a visual page builder with undo/redo, 26 section types, a media library with focal point editing, and a full booking pipeline. However, the system has **critical gaps**: the public-facing Home/Services/Events/Portfolio pages contain massive hardcoded content blocks that ignore CMS data, gallery images in portfolio use blob URLs that break on refresh, the "Forgot Password" button does nothing, `rememberMe` is a dead checkbox, and several features are UI-only with no backend connection. The database schema is solid with proper RLS, but 19 migrations show significant churn (the About page was rewritten 7+ times). The page builder architecture is sound but the public renderers and admin editors are disconnected in critical ways.

**Bottom line:** The admin has ~60% functional coverage. The page builder works. The media library works. Events and services CRUD works. But the public website only partially consumes CMS data — large content blocks remain hardcoded. The portfolio gallery is broken (blob URLs). The booking system lacks delete and debounce. The system is usable for a demo but not production-ready.

---

## PART 1 — ADMIN INFORMATION ARCHITECTURE

### Complete Route Map

| Route | Page Name | Purpose | What User Can See | What User Can Edit | Database Tables | Storage Buckets | Status | Known Problems |
|-------|-----------|---------|-------------------|-------------------|-----------------|-----------------|--------|----------------|
| `/admin/login` | Admin Login | Authenticate | Login form | Email/password | `profiles` (indirect) | None | **PARTIAL** | `rememberMe` unused, Forgot Password non-functional |
| `/admin` | Dashboard | Overview | Stats, bookings, events, quick actions | Nothing (read-only) | `events`, `bookings`, `portfolio_projects`, `services`, `testimonials`, `faqs`, `media` | None | **PARTIAL** | RecentActivity is a stub |
| `/admin/home` | Home CMS | Edit home page sections | Section list, editors, canvas | Section content, ordering, visibility | `pages`, `sections` | `media` | **WORKING** | — |
| `/admin/about` | About CMS | Edit about page sections | Section list, editors, canvas | Section content, ordering, visibility | `pages`, `sections` | `media` | **WORKING** | — |
| `/admin/services` | Services CMS | Manage service entries | Service list, filters, editor | Title, slug, image, description, items, publish, featured | `services` | `media` | **WORKING** | Sort parsing fragile |
| `/admin/how-we-work` | How We Work CMS | Edit how-we-work sections | Section list, editors, canvas | Section content, ordering, visibility | `pages`, `sections` | `media` | **WORKING** | — |
| `/admin/events` | Events List | Manage events | Event list with filters | Search, filter, sort, publish, feature | `events` | `media` | **WORKING** | — |
| `/admin/events/new` | Create Event | Create new event | Event form | All event fields | `events` | `media` | **WORKING** | — |
| `/admin/events/:id/edit` | Edit Event | Edit existing event | Event form with data | All event fields | `events` | `media` | **WORKING** | — |
| `/admin/portfolio` | Portfolio List | Manage portfolio | Project list with filters | Search, filter, delete | `portfolio_projects` | `media` | **PARTIAL** | `copyUrl` dead code, hardcoded categories |
| `/admin/portfolio/new` | Create Portfolio | Create project | Portfolio form | All project fields | `portfolio_projects` | — | **BROKEN** | Gallery uses blob URLs, never uploaded to storage |
| `/admin/portfolio/:id/edit` | Edit Portfolio | Edit project | Portfolio form with data | All project fields | `portfolio_projects` | — | **BROKEN** | Gallery uses blob URLs |
| `/admin/testimonials` | Testimonials | Manage testimonials | Testimonial list + modal form | Name, quote, event type, location, publish | `testimonials` | None | **PARTIAL** | No reorder, no image upload |
| `/admin/faqs` | FAQs | Manage FAQs | FAQ list + modal form | Question, answer, category, publish | `faqs` | None | **PARTIAL** | No search, no reorder |
| `/admin/media` | Media Library | Manage media | Grid, detail panel, upload | Upload, alt text, focal point, delete | `media` | `media` | **WORKING** | — |
| `/admin/pages` | Pages List | Manage pages | Page list with section counts | Create, publish, delete | `pages`, `sections` | None | **WORKING** | N+1 query pattern |
| `/admin/pages/:pageId` | Page Builder | Visual page builder | 3-panel builder with canvas | Sections: add, edit, reorder, delete, duplicate, visibility | `pages`, `sections` | `media` | **WORKING** | — |
| `/admin/bookings` | Bookings | Manage bookings | Booking table + detail panel | View, change status, add notes | `bookings` | None | **PARTIAL** | No delete, notes save on every keystroke, untyped `any` |
| `/admin/settings` | Settings | Global site settings | 6-tab settings form | Identity, nav, contact, social, footer, SEO | `site_settings` | `media` | **WORKING** | Hardcoded Rwanda phone placeholder |

---

## PART 2 — DASHBOARD

### What It Provides Now

| Component | Data Source | Status |
|-----------|------------|--------|
| DashboardHeader | Auth profile (user name) | **REAL DATA** |
| DashboardStats | 5 Supabase queries (events, bookings, portfolio counts) | **REAL DATA** |
| RecentBookings | `bookings` table, last 5 | **REAL DATA** |
| UpcomingEvents | `events` table, upcoming + published | **REAL DATA** |
| QuickActions | Static links | **STATIC** |
| WebsiteSnapshot | 6 count queries across tables | **REAL DATA** |
| RecentActivity | Placeholder text | **STUB — NOT IMPLEMENTED** |
| DashboardFooter | Static "FIESTA CMS" text | **STATIC** |

### Assessment

- **Overview:** 4 stat cards (upcoming events, new bookings, past events, portfolio items) — all real data
- **Statistics:** Real database counts, not hardcoded
- **Bookings:** Last 5 bookings with status badges — real data
- **Events:** Up to 4 upcoming events with cover images — real data
- **Recent Activity:** **NOT IMPLEMENTED** — shows "Activity tracking will appear here."
- **Quick Actions:** 4 static links (Add Event, New Booking, Upload Media, Edit Website)
- **Notifications:** **NOT IMPLEMENTED**
- **Search:** **NOT IMPLEMENTED**

### What It Should Do

- Activity feed (who edited what, when)
- Notifications for new bookings
- Revenue/pipeline metrics
- Quick-edit shortcuts
- Date range filtering

### What Is Missing

- Activity tracking system
- Notification system
- Real-time updates
- Revenue metrics
- Date range controls

---

## PART 3 — AUTHENTICATION

### Architecture

- **Provider:** Supabase Auth (`@supabase/supabase-js`)
- **Context:** `AuthProvider` in `src/lib/auth.tsx`
- **Hook:** `useAuth()` returns `{ session, user, profile, role, loading, signIn, signOut }`
- **Route Guard:** `ProtectedRoute` component checks session, redirects to `/admin/login`
- **Profile Table:** `profiles` linked to `auth.users` via UUID

### What Works

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | **WORKING** | Email/password via `signInWithPassword` |
| Session Persistence | **WORKING** | `persistSession: true` in Supabase client |
| Logout | **WORKING** | Calls `signOut()`, clears state |
| Protected Routes | **WORKING** | `ProtectedRoute` redirects unauthenticated users |
| Profile Fetch | **WORKING** | Fetches from `profiles` table |
| Auto-create Profile | **PARTIAL** | Creates with default `'staff'` role, no error handling on insert failure |
| Role Detection | **WORKING** | Reads `role` from `profiles` table |

### What Is Broken / Not Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Remember Me | **BROKEN** | Checkbox exists in UI, `rememberMe` state captured, but **never passed** to `signIn()` |
| Forgot Password | **BROKEN** | Button exists in UI with **no onClick handler** — completely non-functional |
| Password Reset | **NOT IMPLEMENTED** | No reset flow exists |
| Role-based Access | **MINIMAL** | Only `admin` and `staff` roles defined, but no route-level permission checks — both roles see everything |
| Session Expiry Handling | **NOT VERIFIED** | No explicit handling when session expires mid-use |
| Unauthorized Access | **WORKING** | Redirects to login |
| RLS | **WORKING** | `is_staff()` function checks JWT app_metadata or profiles table |

### Security Notes

- `is_staff()` was toggled between SECURITY DEFINER and SECURITY INVOKER across migrations (final: SECURITY DEFINER with `search_path = public`)
- RLS policies allow public read for published content, staff write for all content
- Bookings allow anonymous INSERT (form submission) but restrict read/update/delete to staff

---

## PART 4 — PAGE MANAGEMENT

### Can the Admin...

| Action | Status | Details |
|--------|--------|---------|
| Create page | **YES** | Via `CreatePageModal` — multi-step: template selection → configure → create |
| Edit page | **YES** | Via `PageBuilderAdmin` → `PageBuilder` component |
| Delete page | **YES** | Via `PageList` with confirmation dialog |
| Duplicate page | **YES** | Via `pagesService.duplicatePage()` |
| Change title | **YES** | In PageBuilder settings panel |
| Change slug | **YES** | Auto-generated from title, editable |
| Change status | **YES** | Publish/unpublish toggle |
| Save draft | **YES** | Ctrl+S or save button |
| Publish | **YES** | Publish button with confirmation dialog |
| Unpublish | **YES** | Unpublish option in publish dialog |
| Preview | **YES** | Full-page preview overlay with responsive toggle |
| Edit SEO title | **YES** | In PageBuilder settings panel |
| Edit SEO description | **YES** | In PageBuilder settings panel |
| Edit OG image | **YES** | Via MediaPicker in settings panel |
| Set published date | **YES** | Auto-set on first publish |
| Reorder pages | **NO** | No page-level ordering |
| Archive pages | **NO** | Only delete |

### Storage

- Pages stored in `pages` table (id, slug, title, description, published, published_at, seo_*, og_image_url)
- Sections stored in `sections` table (page_id FK, section_type, content JSONB, sort_order, published)

### Template System

7 templates available: Home, Event Landing, Services, Portfolio, About, Contact, Blank — each pre-populates sections.

---

## PART 5 — PAGE BUILDER (CRITICAL)

### Architecture

```
PageBuilderAdmin (thin wrapper)
  └── PageBuilder (939 lines — main orchestrator)
        ├── TopBar (undo/redo, settings, preview, publish)
        ├── Left Panel: Section List (draggable rows)
        ├── Center: VisualCanvas (responsive viewport, zoom, section rendering)
        └── Right Panel: SectionEditor (type-specific editors)
```

### Can the Admin...

| Action | Status | Details |
|--------|--------|---------|
| Add section | **YES** | `AddSectionModal` — grouped by category, variant picker, live preview |
| Remove section | **YES** | Delete button with confirmation |
| Duplicate section | **YES** | Duplicate button per section row |
| Reorder sections | **YES** | Drag-and-drop on canvas + up/down arrows |
| Drag sections | **YES** | HTML5 drag-and-drop on `VisualCanvas` |
| Edit sections | **YES** | Right panel opens type-specific editor |
| Hide sections | **YES** | Visibility toggle per section |
| Publish sections | **YES** | Per-section publish toggle |
| Preview sections | **YES** | `SectionPreviewModal` with responsive viewport |
| Save sections | **YES** | Ctrl+S or save button, saves to Supabase |
| Restore sections | **PARTIAL** | Undo/redo via `usePageHistory` (50-step history) |
| Undo | **YES** | Ctrl+Z / button |
| Redo | **YES** | Ctrl+Shift+Z / button |
| Ctrl+S | **YES** | Keyboard shortcut |
| Responsive preview | **YES** | Desktop (1440px) / Tablet (768px) / Mobile (375px) |
| Variant selection | **YES** | `SectionVariantPicker` for section styles |
| Database persistence | **YES** | Saves via `sectionsService.updateSection()` |
| Browser refresh preservation | **YES** | Data loaded from Supabase on mount |

### Section Editors (16 total)

| Section Type | Editor | Status |
|-------------|--------|--------|
| hero-carousel | `HeroCarouselEditor` | **WORKING** — slides, images, focal points, CTAs |
| brand-statement | `BrandStatementEditor` | **WORKING** — text fields, variant |
| services-editorial | `ServicesEditorialEditor` | **WORKING** — services list with images |
| events-editorial | `EventsEditorialEditor` | **WORKING** — filters, limit, variant |
| portfolio-gallery | `PortfolioGalleryEditor` | **WORKING** — items list |
| testimonials | `TestimonialsEditor` | **WORKING** — testimonials list |
| faq | `FAQEditor` | **WORKING** — questions list |
| stats | `StatsEditor` | **WORKING** — stats list |
| process | `ProcessEditor` | **WORKING** — steps with images |
| text-image | `TextImageEditor` | **WORKING** — text, image, position |
| cta | `CTAEditor` | **WORKING** — buttons, background image |
| editorial-list | `EditorialListEditor` | **WORKING** — numbered items |
| cinematic-image | `CinematicImageEditor` | **WORKING** — images, focal point, caption |
| team-members | `TeamMembersEditor` | **WORKING** — members list |
| image-carousel | `ImageCarouselEditor` | **WORKING** — images list |
| services-hero | — | **NO EDITOR** (not in editor registry) |
| services-featured | — | **NO EDITOR** (not in editor registry) |
| services-directory | — | **NO EDITOR** (not in editor registry) |
| services-philosophy | — | **NO EDITOR** (not in editor registry) |
| services-process | — | **NO EDITOR** (not in editor registry) |
| services-image-statement | — | **NO EDITOR** (not in editor registry) |
| services-cta | — | **NO EDITOR** (not in editor registry) |
| about-intro | — | **NO EDITOR** (not in editor registry) |
| about-story | — | **NO EDITOR** (not in editor registry) |
| about-foundation | — | **NO EDITOR** (not in editor registry) |
| about-values | — | **NO EDITOR** (not in editor registry) |
| about-why | — | **NO EDITOR** (not in editor registry) |
| about-closing | — | **NO EDITOR** (not in editor registry) |

### Key Issue

**15 section types have editors. 13 section types (services-* and about-*) have NO editors in the registry.** This means these sections can be rendered publicly but cannot be edited through the page builder. They can only be managed via raw SQL or the `CMSPageEditor` (which uses a generic JSON body field).

---

## PART 6 — VISUAL PAGE BUILDER TARGET

### Current Architecture Assessment

The current system uses a **section-based architecture**, NOT a block-based architecture.

**Current hierarchy:**
```
Page
  └── Section (typed: hero-carousel, brand-statement, etc.)
        └── Content (JSONB — specific to section type)
```

**Desired hierarchy:**
```
Page
  └── Section
        └── Container
              └── Row
                    └── Column
                          └── Block (heading, text, image, etc.)
```

### Does Current Architecture Support This?

**NO.** The current system has a flat section model with no nesting. Each section type is a monolithic component with its own layout. There is no concept of containers, rows, columns, or individual blocks.

### What Prevents It

1. **No nesting in the data model** — sections are flat rows in the `sections` table
2. **No block system** — content is baked into each section type's JSON schema
3. **No layout engine** — each section renders its own layout internally
4. **Section types are rigid** — you can't put a heading block inside a hero section

### What Can Be Reused

- **PageBuilder shell** (3-panel layout, top bar, canvas) — **REUSABLE**
- **VisualCanvas** (viewport switching, zoom, hover/selection overlays) — **REUSABLE**
- **Section list navigator** (drag-and-drop rows) — **REUSABLE**
- **Undo/redo system** (`usePageHistory`) — **REUSABLE**
- **Save/publish flow** — **REUSABLE**
- **MediaPicker** — **REUSABLE**
- **AdminUI component library** — **REUSABLE**
- **Section renderers** — Partially reusable (could become "section templates")
- **Section editors** — Partially reusable (could become "section preset editors")

### What Should NOT Be Rewritten

- Supabase client and auth system
- Media library and storage setup
- AdminUI component library
- AdminLayout and navigation
- Service layer (eventsService, mediaService, etc.)
- RLS policies
- Database schema (needs extension, not replacement)

---

## PART 7 — DRAG AND DROP

| Feature | Status | Details |
|---------|--------|---------|
| Drag sections | **YES** | HTML5 drag-and-drop on VisualCanvas |
| Reorder sections | **YES** | Drop indicators, sort_order updates |
| Drag blocks | **NO** | No block system exists |
| Reorder blocks | **NO** | No block system exists |
| Move blocks between columns | **NO** | No column/block system |
| Move columns | **NO** | No column system |
| Resize columns | **NO** | No column system |
| Drop indicators | **YES** | Visual drop zone indicators on canvas |
| Nested structures | **NO** | Flat section model only |

---

## PART 8 — CONTENT BLOCK SYSTEM

The current CMS has **NO generic block system**. It has **section types** — each is a monolithic, self-contained component with its own data schema and renderer.

| Block | Exists? | Editor? | Renderer? | Persists? | Responsive? | Draggable? | Styleable? |
|-------|---------|---------|-----------|-----------|-------------|------------|------------|
| Heading | NO (embedded in section types) | — | — | — | — | — | — |
| Paragraph | NO (embedded in section types) | — | — | — | — | — | — |
| Rich Text | NO (but `RichText.tsx` component exists) | — | — | — | — | — | — |
| Image | NO (embedded in section types) | — | — | — | — | — | — |
| Button | NO (embedded in section types) | — | — | — | — | — | — |
| Video | **NO** | — | — | — | — | — | — |
| Divider | **NO** | — | — | — | — | — | — |
| Spacer | **NO** | — | — | — | — | — | — |
| Quote | NO (part of `RichText.tsx`) | — | — | — | — | — | — |
| List | NO (part of `RichText.tsx`) | — | — | — | — | — | — |
| Icon | **NO** | — | — | — | — | — | — |
| Columns | **NO** | — | — | — | — | — | — |
| Container | **NO** | — | — | — | — | — | — |
| Gallery | NO (embedded in section types) | — | — | — | — | — | — |
| Embed | **NO** | — | — | — | — | — | — |

---

## PART 9 — SECTION SYSTEM

### All 26 Section Types

| # | Type | Purpose | Editor? | Renderer? | Variants | CMS Data | Public Rendering | Status |
|---|------|---------|---------|-----------|----------|----------|------------------|--------|
| 1 | `hero-carousel` | Full-viewport hero slideshow | YES | YES | — | YES | YES | **FULLY WORKING** |
| 2 | `brand-statement` | Two-column brand intro | YES | YES | default, centered | YES | YES | **FULLY WORKING** |
| 3 | `services-editorial` | Service cards carousel | YES | YES | default, compact | YES | YES | **FULLY WORKING** |
| 4 | `events-editorial` | Event grid | YES | YES | default, minimal | YES | YES | **FULLY WORKING** |
| 5 | `portfolio-gallery` | Portfolio mosaic | YES | YES | grid, masonry, asymmetric | YES | YES | **FULLY WORKING** |
| 6 | `testimonials` | Testimonial carousel | YES | YES | default, carousel | YES | YES | **FULLY WORKING** |
| 7 | `faq` | FAQ accordion | YES | YES | — | YES | YES | **FULLY WORKING** |
| 8 | `stats` | Statistics bar | YES | YES | default, compact | YES | YES | **FULLY WORKING** |
| 9 | `process` | Process steps | YES | YES | — | YES | YES | **FULLY WORKING** |
| 10 | `text-image` | Text + image layout | YES | YES | default, split, centered | YES | YES | **FULLY WORKING** |
| 11 | `cta` | Call-to-action banner | YES | YES | default, full-width, minimal | YES | YES | **FULLY WORKING** |
| 12 | `editorial-list` | Numbered list | YES | YES | — | YES | YES | **FULLY WORKING** |
| 13 | `cinematic-image` | Full-width image band | YES | YES | — | YES | YES | **FULLY WORKING** |
| 14 | `team-members` | Team grid | YES | YES | — | YES | YES | **FULLY WORKING** |
| 15 | `image-carousel` | Image slideshow | YES | YES | — | YES | YES | **FULLY WORKING** |
| 16 | `services-hero` | Services page hero | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 17 | `services-featured` | Featured services grid | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 18 | `services-directory` | Service directory listing | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 19 | `services-philosophy` | Editorial statement | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 20 | `services-process` | Process timeline | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 21 | `services-image-statement` | Image + text overlay | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 22 | `services-cta` | Services CTA | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 23 | `about-intro` | About page hero | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 24 | `about-story` | Company story | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 25 | `about-foundation` | Mission/vision/values | **NO** | YES | — | YES | YES | **NO EDITOR** |
| 26 | `about-values` | Core values | **NO** | YES | — | YES | YES | **NO EDITOR** |

### Dead Code / Unused

- `SectionNavigator.tsx` — appears unused (PageBuilder has its own section list)
- `SectionThumbnail.tsx` — missing thumbnails for 4 section types (editorial-list, cinematic-image, team-members, image-carousel)

---

## PART 10 — MEDIA LIBRARY

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Upload images | **YES** | Drag-and-drop or click, `MediaUpload` component |
| Upload videos | **YES** | Accepted in upload component |
| Browse media | **YES** | Grid view with thumbnails |
| Search | **YES** | By filename |
| Filter | **YES** | All/Images/Videos toggle |
| Sort | **YES** | By name, date, size |
| Preview | **YES** | Full-screen detail panel |
| Delete | **YES** | With confirmation, deletes from DB + storage |
| Select media | **YES** | `MediaPicker` modal for single/multiple selection |
| Reuse media | **YES** | Pick from library in any MediaPicker context |
| Edit metadata | **YES** | Alt text, focal point |
| Edit focal point | **YES** | Interactive drag editor with rule-of-thirds grid |
| Set alt text | **YES** | In detail panel |
| Set caption | **NO** | No caption field on media items |
| Use in Event Editor | **YES** | Cover image + gallery use MediaPicker |
| Use in Page Builder | **YES** | Section editors use `ImageField` with MediaPicker |
| Use in Portfolio | **NO** | PortfolioForm uses URL input, not MediaPicker |
| Use in Site Settings | **YES** | Logo, OG image, footer images use MediaPicker |

### Supabase Storage

- **Bucket:** `media` (public)
- **Folder convention:** `originals/` prefix for all uploads
- **Public/private:** Public (readable by anyone)
- **URL persistence:** URLs stored in `media.public_url` column — persistent
- **Metadata persistence:** `alt_text`, `focal_x`, `focal_y` stored in DB

### Known Issues

- **No file type/size validation** in `uploadMedia` — any file type accepted
- **No caption field** on media items
- **Portfolio uses blob URLs** — `PortfolioForm` creates `URL.createObjectURL()` for gallery images, which break on page refresh
- **`getImageDimensions` swallows errors** — returns 0,0 on failure
- **`onProgress` callback accepted but never implemented**
- **Sequential uploads** in `uploadMultipleMedia` — could be parallelized

---

## PART 11 — EVENT MANAGEMENT

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Create event | **YES** | Full form with all fields |
| Edit event | **YES** | Loads existing data |
| Delete event | **YES** | With confirmation |
| Duplicate event | **YES** | Auto-generates new slug |
| Publish/Unpublish | **YES** | Toggle |
| Set title | **YES** | Auto-generates slug |
| Set slug | **YES** | Auto-generated, editable |
| Set category | **YES** | Select from predefined categories |
| Set date | **YES** | Date picker |
| Set venue | **YES** | Text input |
| Set description | **YES** | Textarea |
| Set cover image | **YES** | Upload or MediaPicker |
| Set gallery | **YES** | Multiple upload or MediaPicker |
| Set lineup | **YES** | Dynamic list of performer names |
| Set ticket URL | **YES** | URL input |
| Set registration URL | **YES** | URL input |
| Set featured | **YES** | Toggle |
| Set sort order | **YES** | Number input |
| Set status | **YES** | Upcoming/Completed/Cancelled |

### Public Rendering

Events appear on:
- `/events` — grid with category filter, featured event, upcoming/past sections
- `/events/:slug` — detail page with hero, description, lineup, gallery, CTA

**Assessment:** Events CMS is **FULLY WORKING** — admin edits flow through to public site via `eventsService` and `EventsRenderer`.

---

## PART 12 — PORTFOLIO

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Create project | **YES** | Form with all fields |
| Edit project | **YES** | Loads existing data |
| Delete project | **YES** | With confirmation, removes storage files |
| Publish/Unpublish | **YES** | Toggle |
| Set title | **YES** | Auto-generates slug |
| Set slug | **YES** | Auto-generated |
| Set category | **YES** | Select (hardcoded: Concerts, Weddings, Corporate, Festivals, Parties) |
| Set cover image | **YES** | URL input (NOT MediaPicker) |
| Set gallery | **YES** | File upload → **blob URLs** |
| Set description | **YES** | Textarea |
| Set client | **NO** | No client field |
| Set year | **YES** | Number input |
| Set featured | **NO** | No featured toggle |
| Set ordering | **YES** | Sort order input |

### Critical Issues

1. **Gallery images use blob URLs** — `URL.createObjectURL()` creates temporary URLs that are **lost on page refresh** and never uploaded to Supabase storage. The `gallery` field will contain broken blob URLs after save.
2. **Cover image uses URL input** — no MediaPicker integration, must paste URL manually.
3. **Categories are hardcoded** — not fetched from database.
4. **No featured toggle** — unlike events and services.
5. **`copyUrl` function exists but is never called** — dead code.

---

## PART 13 — SERVICES

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Create service | **YES** | Via modal `ServiceEditor` |
| Edit service | **YES** | Loads existing data |
| Delete service | **YES** | With confirmation |
| Duplicate service | **YES** | Auto-generates new slug |
| Reorder | **YES** | Move up/down buttons |
| Publish/Unpublish | **YES** | Toggle |
| Set title | **YES** | Auto-generates slug |
| Set description | **YES** | Textarea |
| Set image | **YES** | Upload or MediaPicker |
| Set category | **NO** | No category field |
| Set CTA | **NO** | No CTA field |
| Set icon | **NO** | No icon field |
| Set featured | **YES** | Toggle |

### Public Rendering

Services appear on:
- `/services` — featured grid, full directory, process steps
- Home page — featured services section
- Page Builder — `services-editorial` section type

**Assessment:** Services CMS is **FULLY WORKING** — admin edits flow to public site. However, some public service content (directory, process steps) remains hardcoded on the Services page.

---

## PART 14 — TESTIMONIALS

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Create | **YES** | Modal form |
| Edit | **YES** | Modal form |
| Delete | **YES** | With confirmation |
| Publish/Unpublish | **YES** | Toggle |
| Reorder | **NO** | No reorder capability |
| Set name | **YES** | `client_name` field |
| Set role | **NO** | No role field |
| Set company | **NO** | No company field |
| Set quote | **YES** | Required field |
| Set image | **YES** | URL input (no MediaPicker) |
| Set rating | **NO** | No rating field |
| Event/project relationship | **NO** | `event_type` is a free text field, not a FK |

### Public Rendering

Testimonials appear via:
- `TestimonialsRenderer` section type (CMS-driven)
- Hardcoded fallbacks on Home and Services pages

**Assessment:** Testimonials are **PARTIALLY CMS-driven**. The section type pulls from Supabase, but the Home and Services pages have hardcoded fallback testimonials that override CMS data when available.

---

## PART 15 — FAQ

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Create | **YES** | Modal form |
| Edit | **YES** | Modal form |
| Delete | **YES** | With confirmation |
| Publish/Unpublish | **YES** | Toggle |
| Reorder | **NO** | No reorder capability |
| Set question | **YES** | Required |
| Set answer | **YES** | Required |
| Set category | **YES** | Defaults to "General" |
| Set visibility | **YES** | Publish toggle |

### Public Rendering

FAQs appear via:
- `FAQRenderer` section type (CMS-driven)
- Hardcoded fallbacks on Home page

**Assessment:** FAQs are **PARTIALLY CMS-driven**. The section type pulls from Supabase, but the Home page has hardcoded fallback FAQs.

---

## PART 16 — BOOKINGS

### Form Submission Flow

```
Contact.tsx form
  ↓ (validation: name, email, message required)
  ↓ (supabase.from('contact_submissions').insert(...))
  ↓
??? — THE TABLE IS `contact_submissions`, NOT `bookings`!
```

### Critical Finding

The **Contact form** submits to a `contact_submissions` table (NOT `bookings`). The **BookingsAdmin** reads from the `bookings` table. These are **TWO DIFFERENT TABLES** with different schemas.

**Contact form fields:** name, email, phone, event_type, event_date, message
**Bookings table fields:** client_name, email, phone, event_type, event_date, location, guest_count, budget, message, referral, status, notes

**This means:** Contact form submissions may NOT appear in the Bookings admin unless there's a trigger or migration that copies data between tables. This is **NOT VERIFIED** in the codebase.

### Admin Bookings Capabilities

| Action | Status | Details |
|--------|--------|---------|
| View bookings | **YES** | Table with search/filter |
| Search | **YES** | By client name/email |
| Filter by status | **YES** | Dropdown |
| Update status | **YES** | 6 status buttons |
| Add notes | **YES** | Textarea — **BUT saves on every keystroke (no debounce)** |
| Delete | **NO** | No delete capability |
| Export | **NO** | No export functionality |
| Respond | **NO** | No response mechanism |
| Archive | **NO** | No archive functionality |

### Dead Fields in Booking Type

The `Booking` type defines fields that may never be populated:
- `referral` — no form field maps to this
- `location` — contact form doesn't have this
- `guest_count` — contact form doesn't have this
- `budget` — contact form doesn't have this

---

## PART 17 — SITE SETTINGS

### CMS-Controlled Settings

| Setting | Editable? | Persisted? | Used Publicly? |
|---------|-----------|------------|----------------|
| Company name | YES | YES | YES (Navbar, Footer) |
| Tagline | YES | YES | NOT VERIFIED |
| Logo URL | YES (MediaPicker) | YES | YES (Navbar, Footer) |
| Email | YES | YES | YES (Contact page, Footer) |
| Phone | YES | YES | YES (Footer, WhatsApp) |
| WhatsApp | YES | YES | YES (WhatsApp button) |
| Address | YES | YES | YES (Footer) |
| Instagram | YES | YES | YES (WhatsApp widget) |
| Facebook | YES | YES | YES (WhatsApp widget) |
| TikTok | YES | YES | YES (WhatsApp widget) |
| SEO title | YES | YES | YES (`useDocumentMeta`) |
| SEO description | YES | YES | YES (`useDocumentMeta`) |
| OG image | YES (MediaPicker) | YES | NOT VERIFIED |
| Footer text | YES | YES | YES (Footer) |
| Navigation items | YES | YES | YES (Navbar) |
| Footer link groups | YES | YES | YES (Footer) |
| Footer CTA | YES | YES | YES (Footer) |
| Copyright text | YES | YES | YES (Footer) |
| Nav CTA label | YES | YES | YES (Navbar) |
| Nav CTA URL | YES | YES | YES (Navbar) |
| Nav CTA visible | YES | YES | YES (Navbar) |
| Footer hero image | YES (MediaPicker) | YES | YES (Footer) |

### Hardcoded Values

- WhatsApp default phone: `+250 788 123 456` (Rwanda)
- Copyright placeholder: `© 2026 Fiesta Events. All Rights Reserved.`
- Default navigation items: 7 hardcoded links
- Default footer groups: 2 hardcoded groups
- Default footer CTA: hardcoded heading/subtext

---

## PART 18 — NAVIGATION

### Admin Capabilities

| Action | Status | Details |
|--------|--------|---------|
| Add navigation item | **YES** | Dynamic list in Settings |
| Delete | **YES** | Remove button |
| Rename | **YES** | Edit label |
| Change URL | **YES** | Edit `to` field |
| Reorder | **YES** | Up/down arrows |
| Hide/show | **YES** | Visibility toggle |
| External link | **YES** | Any URL |
| Internal link | **YES** | Any path |
| CTA | **YES** | Separate CTA settings (label, URL, visibility) |

### Public Navbar

The public `Navbar.tsx` reads navigation from `useSiteSettings()` → `getVisibleNavigation(settings)`. It correctly displays CMS-controlled navigation items with active state highlighting.

**Assessment:** Navigation is **FULLY CMS-DRIVEN**.

---

## PART 19 — FOOTER

### Admin Capabilities

| Setting | Editable? | Persisted? |
|---------|-----------|------------|
| Logo | YES (via site settings) | YES |
| Description | YES (`footer_text`) | YES |
| Quick links | YES (footer_groups) | YES |
| Service links | YES (footer_groups) | YES |
| Social links | YES (Instagram, Facebook, TikTok) | YES |
| Contact info | YES (email, phone, address) | YES |
| CTA | YES (footer_cta) | YES |
| Background image | YES (MediaPicker) | YES |
| Copyright | YES | YES |

### Public Footer

The `Footer.tsx` reads all data from `useSiteSettings()` → `getVisibleFooterGroups()`, `getFooterCTA()`. Correctly renders CMS-controlled footer content.

**Assessment:** Footer is **FULLY CMS-DRIVEN**.

---

## PART 20 — SEO

| Feature | Implemented? | CMS-Controlled? | Used Publicly? |
|---------|-------------|-----------------|----------------|
| Page SEO title | YES | YES (PageBuilder settings) | YES (`useDocumentMeta`) |
| Page SEO description | YES | YES (PageBuilder settings) | YES (`useDocumentMeta`) |
| Page OG image | YES | YES (MediaPicker) | PARTIAL (set in DOM, not verified rendering) |
| Site SEO title | YES | YES (Settings) | YES (`useDocumentMeta`) |
| Site SEO description | YES | YES (Settings) | YES (`useDocumentMeta`) |
| Site OG image | YES | YES (MediaPicker) | PARTIAL |
| Canonical URLs | **NO** | — | — |
| Robots.txt | **NO** | — | — |
| Sitemap | **NO** | — | — |
| Structured data | **NO** | — | — |
| `og:type` | **NO** | — | — |
| `og:url` | **NO** | — | — |
| Twitter cards | **NO** | — | — |

---

## PART 21 — PUBLISHING SYSTEM

### Architecture

- **Pages:** `published` boolean + `published_at` timestamp
- **Sections:** `published` boolean (per-section)
- **Events:** `published` boolean + `status` (upcoming/completed/cancelled)
- **Services:** `published` boolean + `featured` boolean
- **Portfolio:** `published` boolean
- **Testimonials:** `published` boolean
- **FAQs:** `published` boolean

### Behavior

| Scenario | Behavior |
|----------|----------|
| Page unpublished | Not rendered by `PageRenderer` on public site |
| Section unpublished | `SectionRenderer` returns `null` for unpublished sections |
| Page published | `published_at` set to current time on first publish |
| Section visibility | Toggle in PageBuilder — sections can be hidden without deleting |
| Draft sections | Can exist alongside published sections on same page |
| Preview | Shows unpublished sections in admin preview overlay |
| Public site | Only shows published sections |

### Issues

- `unpublishPage` doesn't clear `published_at` — minor inconsistency
- No draft/published status distinction in the UI (just a toggle)
- No scheduled publishing
- No version history (only undo/redo in session)

---

## PART 22 — PREVIEW SYSTEM

| Preview Type | Status | Details |
|-------------|--------|---------|
| Section preview | **YES** | `SectionPreviewModal` with responsive viewport |
| Section variant preview | **YES** | `SectionVariantPicker` with scaled thumbnails |
| Full-page preview | **YES** | `FullPagePreview` overlay, filters to published sections |
| Responsive preview | **YES** | Desktop (1440px) / Tablet (768px) / Mobile (375px) |
| Public preview | **NO** | No public preview URL |

### Inconsistencies

- `FullPagePreview` only shows published sections — if you're editing unpublished content, you can't preview it in context
- Preview uses `SectionRenderer` (same as public) — **consistent**
- `SectionPreviewCard` renders at 30% scale — may not accurately represent actual layout

---

## PART 23 — RESPONSIVE ADMIN

### Static Analysis

The admin uses a combination of Tailwind responsive utilities and fixed layouts. Based on code analysis:

| Breakpoint | Assessment |
|-----------|------------|
| 360px | **LIKELY BROKEN** — sidebar may not collapse properly, forms may overflow |
| 390px | **LIKELY BROKEN** — same issues as 360px |
| 414px | **LIKELY BROKEN** — mobile sidebar overlay should work, but form layouts may break |
| 768px | **LIKELY WORKING** — tablet breakpoint, sidebar collapses |
| 1024px | **WORKING** — desktop layout kicks in |
| 1280px | **WORKING** — full admin layout |
| 1440px | **WORKING** — optimal admin layout |

### Known Issues

- `AdminLayout` uses responsive sidebar with overlay — should work on mobile
- `EventEditor` uses two-column layout — may stack poorly on small screens
- `SettingsAdmin` tabs may not scroll properly on mobile
- `BookingsAdmin` table may overflow on mobile
- PageBuilder 3-panel layout likely unusable on mobile (intentional — builder is desktop-only)

---

## PART 24 — ERROR HANDLING

| Operation | Toast? | Inline Error? | Validation? | Loading State? | Retry? | Silent Failure? |
|-----------|--------|---------------|-------------|----------------|--------|-----------------|
| Login | YES | YES (error banner) | YES | YES (spinner) | NO | NO |
| Add Section | YES | NO | NO | NO | NO | NO |
| Save | YES | NO | NO | YES (indicator) | NO | NO |
| Delete | YES (confirm) | NO | NO | NO | NO | NO |
| Publish | YES (confirm dialog) | NO | NO | YES (publishing state) | NO | NO |
| Upload | YES | NO | NO | YES (per-file) | NO | NO |
| Create event | YES | NO | YES (required fields) | YES (spinner) | NO | NO |
| Update settings | YES | NO | NO | YES (loading) | NO | NO |
| Fetch data | YES (on error) | NO | NO | YES (loading) | NO | YES (some catch blocks are empty) |

### Issues

- Many `catch` blocks are empty (`catch { /* silent */ }`)
- No error logging or reporting service
- No retry mechanisms anywhere
- No optimistic updates

---

## PART 25 — LOADING / EMPTY STATES

| Admin Area | Loading State | Empty State | Error State |
|------------|--------------|-------------|-------------|
| Dashboard | YES (child components) | YES (per component) | NO |
| Events List | YES | YES (with CTA) | YES (with retry) |
| Event Form | YES (edit mode) | NO | YES (not found toast) |
| Portfolio List | YES | YES (with CTA) | NO |
| Portfolio Form | YES (edit mode) | NO | YES (not found toast) |
| Testimonials | YES | YES | YES (toast) |
| FAQs | YES | YES | YES (toast) |
| Bookings | YES | NO explicit | YES (toast) |
| Media Library | YES | YES | YES (toast) |
| Settings | YES | NO (defaults always exist) | YES (toast) |
| Pages List | YES | YES (with CTA) | NO |
| Page Builder | YES | YES (no sections message) | YES (toast) |
| Services | YES | YES (with CTA) | YES (with retry) |

---

## PART 26 — DATABASE MAP

### Tables

| Table | Purpose | Key Columns | RLS |
|-------|---------|-------------|-----|
| `profiles` | User profiles | id (FK auth.users), email, full_name, role, avatar_url | Own read/update, staff read all |
| `pages` | CMS pages | id, slug, title, description, published, published_at, seo_*, og_image_url | Public read published, staff all |
| `sections` | Page sections | id, page_id (FK), section_type, content (JSONB), title, subtitle, body, image_url, layout, sort_order, published | Public read published, staff all |
| `services` | Service catalog | id, title, slug, description, details (JSONB), image_url, sort_order, published, featured | Public read published, staff all |
| `events` | Event records | id, title, slug, category, event_date, location, cover_image, gallery (JSONB), lineup (JSONB), status, featured, published, sort_order | Public read published, staff all |
| `portfolio_projects` | Portfolio items | id, title, slug, category, description, story (JSONB), year, cover_image, gallery (JSONB), sort_order, published | Public read published, staff all |
| `testimonials` | Client quotes | id, client_name, quote, event_type, location, image_url, published, sort_order | Public read published, staff all |
| `faqs` | FAQ entries | id, question, answer, category, published, sort_order | Public read published, staff all |
| `bookings` | Event inquiries | id, client_name, email, phone, event_type, event_date, location, guest_count, budget, message, referral, status, notes | Anon insert, staff read/update/delete |
| `media` | Media library | id, name, storage_path, public_url, mime_type, size_bytes, width, height, alt_text, focal_x, focal_y | Public read, staff all |
| `site_settings` | Global config (single row) | id=1, company_name, tagline, logo_url, email, phone, social links, navigation (JSONB), footer_groups (JSONB), footer_cta (JSONB), seo_*, og_image_url | Public read, staff all |

### Storage

| Bucket | Public | Purpose |
|--------|--------|---------|
| `media` | YES | All uploaded media files |

### Functions

| Function | Purpose | Security |
|----------|---------|----------|
| `is_staff()` | Check if user has admin/staff role | SECURITY DEFINER |
| `handle_updated_at()` | Auto-set updated_at on row changes | SECURITY INVOKER |

### Indexes

- `idx_sections_type` on `sections.section_type`
- `idx_services_featured` partial on `services(featured)` where featured = true

---

## PART 27 — DATA FLOW

### Events

```
Admin creates event
  → EventEditor (form)
  → eventsService.createEvent()
  → Supabase insert into `events` table
  → EventsRenderer (public) reads `events` where published=true
  → Public /events page displays
```

### Page Sections

```
Admin adds section in PageBuilder
  → AddSectionModal (select type + variant)
  → sectionsService.createSection()
  → Supabase insert into `sections` table
  → Admin edits content in SectionEditor
  → sectionsService.updateSection()
  → Supabase update `sections` content JSONB
  → Public PageRenderer fetches sections by page slug
  → SectionRenderer dispatches to type-specific renderer
  → Public page displays
```

### Media

```
Admin uploads in MediaLibrary
  → MediaUpload (drag-and-drop)
  → mediaService.uploadMedia()
  → Supabase Storage upload to `media` bucket
  → mediaService inserts record into `media` table
  → Public URL stored in `public_url` column
  → Admin picks in MediaPicker
  → URL passed to section content or settings
  → Public renderer displays image
```

### Site Settings

```
Admin edits in SettingsAdmin
  → Form fields (6 tabs)
  → siteSettingsService.updateSiteSettings()
  → Supabase upsert into `site_settings` (id=1)
  → useSiteSettings() hook fetches (cached 5min)
  → Navbar, Footer, WhatsAppButton consume
  → Public layout displays
```

### Bookings (BROKEN FLOW)

```
Public user fills Contact form
  → Contact.tsx form
  → Supabase insert into `contact_submissions` table (???)
  → BookingsAdmin reads from `bookings` table
  → DISCONNECT: these may be different tables
```

---

## PART 28 — HARDCODED CONTENT

### HARDCODED BUT SHOULD BE CMS

| Content | Location | Notes |
|---------|----------|-------|
| Home page hero slides | `Home.tsx` (H01Hero) | Hardcoded headlines, images, CTAs |
| Home page stats (4 items) | `Home.tsx` (H05Stats) | 200+, 8, 5K+, 100% — hardcoded |
| Home page testimonials (3) | `Home.tsx` (H06Testimonials) | Hardcoded names, quotes, images |
| Home page CTA background | `Home.tsx` (H07CTA) | Hardcoded Unsplash URL |
| Services page directory | `Services.tsx` (DIRECTORY_LEFT/RIGHT) | 9 hardcoded services |
| Services page process steps | `Services.tsx` (PROCESS_STEPS) | 5 hardcoded steps |
| Services page stats | `Services.tsx` | Duplicated from Home |
| Services page testimonials | `Services.tsx` | Duplicated from Home |
| Events page fallback events | `Events.tsx` (FALLBACK_EVENTS) | 8 hardcoded events |
| Events page CTA image | `Events.tsx` | Hardcoded Unsplash URL |
| Portfolio page fallback gallery | `Portfolio.tsx` (FALLBACK_GALLERY) | 8 hardcoded projects |
| Portfolio page CTA image | `Portfolio.tsx` | Hardcoded Unsplash URL |
| How We Work page — ALL content | `HowWeWork.tsx` | 100% hardcoded |
| About page — ALL content | `About.tsx` | 100% hardcoded (despite CMS sections existing) |
| Contact page event types | `Contact.tsx` | Hardcoded dropdown options |
| All CTA background images | Multiple files | Hardcoded Unsplash URLs |
| All fallback images | Multiple files | Hardcoded Unsplash URLs |

### HARDCODED AND SHOULD REMAIN STATIC

| Content | Location | Notes |
|---------|----------|-------|
| 404 page text | `NotFound.tsx` | Static error page |
| Admin loading fallbacks | `App.tsx` | Loading spinners |
| Login page branding | `AdminLogin.tsx` | "FIESTA" text |

### UNKNOWN

| Content | Location | Notes |
|---------|----------|-------|
| WhatsApp default message | `WhatsAppButton.tsx` | Could be CMS-controlled |
| Footer legal links (Privacy, Terms) | `Footer.tsx` | Currently hardcoded |

---

## PART 29 — DEAD / UNUSED CODE

### Unused Components

| File | Reason |
|------|--------|
| `SectionNavigator.tsx` | PageBuilder has its own section list — this appears unused |
| `src/components/sections/` | Empty directory — no files |

### Dead Code in Files

| File | Dead Code |
|------|-----------|
| `PortfolioAdmin.tsx` | `copyUrl` function defined but never called in JSX |
| `PortfolioForm.tsx` | `handleReorder` for gallery items missing |
| `TextImageRenderer.tsx` | Line 35: `${imageOnLeft ? '' : ''}` — empty ternary |
| `ServicesRenderer.tsx` | Line 213: `.ServicesTrack` CSS selector targets non-existent class |
| `AboutValues.tsx` | "+" icon rotates but has no click handler — decorative only |

### Duplicate Code

| Pattern | Files | Notes |
|---------|-------|-------|
| `Reveal` component | `Reveal.tsx` + inline in every public page file | Each page defines its own identical `Reveal` helper |
| `useIntro` hook | `Home.tsx`, `Services.tsx` | Identical hook defined twice |
| `STATS` data | `Home.tsx`, `Services.tsx` | Copy-pasted stats array |
| `TESTIMONIALS` data | `Home.tsx`, `Services.tsx` | Copy-pasted testimonials array |
| `CTA_IMAGE` | `Home.tsx`, `Services.tsx`, `Events.tsx`, `Portfolio.tsx` | Same hardcoded URL in 4 files |
| `<style>` tags per instance | `ServicesFeatured.tsx`, `ServicesDirectory.tsx` | Duplicate style blocks per component instance |

### Unused Imports/Props

- `useReveal` hook exists in both `src/lib/useReveal.ts` AND `src/components/Reveal.tsx` (two separate implementations)

---

## PART 30 — SECURITY

### Authentication

| Check | Status |
|-------|--------|
| Supabase Auth | **WORKING** |
| Session persistence | **YES** (localStorage) |
| Protected admin routes | **YES** (ProtectedRoute) |
| RLS on all tables | **YES** |
| Staff-only write access | **YES** (via `is_staff()`) |
| Public read for published content | **YES** |
| Storage policies | **YES** (public read, staff write) |

### Security Risks

| Risk | Severity | Details |
|------|----------|---------|
| `is_staff()` SECURITY DEFINER | MEDIUM | Function runs with elevated privileges — could be exploited if JWT is manipulated |
| No rate limiting on contact form | MEDIUM | Anonymous INSERT on `contact_submissions` (or `bookings`) — spam risk |
| No CAPTCHA | MEDIUM | Contact form vulnerable to bots |
| No file type validation on upload | HIGH | Any file type can be uploaded to `media` bucket |
| No file size limit enforcement | MEDIUM | Client-side only — no server-side validation |
| `dangerouslySetInnerHTML` | NOT FOUND | No usage detected — good |
| URL handling | LOW | External links use `target="_blank"` with `rel="noopener noreferrer"` — good |
| `.env` committed to repo | **YES** | Contains Supabase URL and anon key — should be in `.gitignore` |
| No CSRF protection | LOW | Supabase handles this via JWT |
| Inline styles with user content | LOW | Some renderers use `style` props with CMS data — limited XSS surface |

---

## PART 31 — PERMISSIONS

### Current System

**Two roles defined:** `admin` and `staff`

**Reality:** There is **NO functional difference** between `admin` and `staff`. Both roles can:
- Access all admin routes
- Edit all content
- Delete all content
- Change settings
- Manage media

**No route-level permission checks** exist. The only check is authentication (logged in or not).

**No permission hierarchy:**
- No Super Admin
- No Editor role
- No Viewer role
- No role-based UI hiding

---

## PART 32 — CURRENT ADMIN SIDEBAR

| Label | Route | Purpose | Functionality | DB System | Status |
|-------|-------|---------|---------------|-----------|--------|
| Dashboard | `/admin` | Overview | Stats, recent bookings, events | Multiple | **PARTIAL** (activity stub) |
| Pages | `/admin/pages` | CMS pages | Page list, create, build | `pages`, `sections` | **WORKING** |
| Services | `/admin/services` | Service catalog | CRUD, reorder, featured | `services` | **WORKING** |
| Events | `/admin/events` | Events | CRUD, filter, featured | `events` | **WORKING** |
| Portfolio | `/admin/portfolio` | Portfolio projects | CRUD, filter | `portfolio_projects` | **BROKEN** (gallery) |
| Team | `/admin/about` (redirects to About CMS) | Team/about content | Section editing | `pages`, `sections` | **WORKING** |
| Testimonials | `/admin/testimonials` | Client quotes | CRUD | `testimonials` | **PARTIAL** (no reorder) |
| FAQs | `/admin/faqs` | FAQ entries | CRUD | `faqs` | **PARTIAL** (no reorder) |
| Bookings | `/admin/bookings` | Inquiries | View, status, notes | `bookings` | **PARTIAL** (no delete) |
| Media | `/admin/media` | Media library | Upload, manage, pick | `media`, storage | **WORKING** |
| Settings | `/admin/settings` | Global settings | 6-tab form | `site_settings` | **WORKING** |

---

## PART 33 — WHAT THE ADMIN SHOULD EVENTUALLY BE

```
ADMIN
│
├── Dashboard
│   ├── Stats (real data) ✓
│   ├── Recent Activity (IMPLEMENT)
│   ├── Quick Actions ✓
│   ├── Upcoming Events ✓
│   ├── Recent Bookings ✓
│   └── Notifications (IMPLEMENT)
│
├── Content
│   ├── Pages (CMS pages with builder) ✓
│   ├── Navigation (in Settings) ✓
│   └── Site Content (global blocks — NEW)
│
├── Page Builder ✓ (needs block system upgrade)
│   ├── Sections (existing)
│   ├── Containers (NEW)
│   ├── Rows (NEW)
│   ├── Columns (NEW)
│   └── Blocks (NEW)
│
├── Events ✓
├── Portfolio ⚠️ (fix gallery)
├── Services ✓
├── Media ✓
├── Testimonials ⚠️ (add reorder)
├── FAQs ⚠️ (add reorder)
├── Bookings ⚠️ (add delete, fix contact flow)
│
├── Settings ✓
│   ├── Site Identity ✓
│   ├── Navigation ✓
│   ├── Contact ✓
│   ├── Social Links ✓
│   ├── Footer ✓
│   └── SEO ✓
│
└── System (NOT IMPLEMENTED)
    ├── Users
    ├── Roles
    └── Activity Log
```

---

## PART 34 — FEATURE MATRIX

| Feature | Current | Status | Database | Public Connection | Missing | Priority |
|---------|---------|--------|----------|-------------------|---------|----------|
| Admin Login | YES | PARTIAL | profiles | — | Forgot password, remember me | P1 |
| Dashboard Stats | YES | WORKING | events, bookings, portfolio | — | Activity feed | P2 |
| Page CRUD | YES | WORKING | pages, sections | YES | — | — |
| Section Add | YES | WORKING | sections | YES | — | — |
| Section Edit | YES | WORKING | sections | YES | 13 section types have no editor | P1 |
| Section Reorder | YES | WORKING | sections | YES | — | — |
| Section Delete | YES | WORKING | sections | YES | — | — |
| Section Duplicate | YES | WORKING | sections | YES | — | — |
| Section Visibility | YES | WORKING | sections | YES | — | — |
| Section Preview | YES | WORKING | — | YES | — | — |
| Undo/Redo | YES | WORKING | — | — | — | — |
| Ctrl+S Save | YES | WORKING | — | — | — | — |
| Responsive Preview | YES | WORKING | — | — | — | — |
| Variant Selection | YES | WORKING | — | — | — | — |
| Block System | NO | NOT IMPLEMENTED | — | — | Entire block architecture | P3 |
| Drag Sections | YES | WORKING | — | — | — | — |
| Drag Blocks | NO | NOT IMPLEMENTED | — | — | Block drag-and-drop | P3 |
| Media Upload | YES | WORKING | media, storage | YES | File validation | P2 |
| Media Picker | YES | WORKING | media | — | — | — |
| Focal Point | YES | WORKING | media | YES | — | — |
| Media Caption | NO | NOT IMPLEMENTED | — | — | Caption field | P3 |
| Event CRUD | YES | WORKING | events | YES | — | — |
| Event Gallery | YES | WORKING | events | YES | — | — |
| Portfolio CRUD | YES | BROKEN | portfolio_projects | BROKEN | Gallery blob URLs, MediaPicker | P0 |
| Service CRUD | YES | WORKING | services | PARTIAL | Category, icon, CTA | P2 |
| Testimonial CRUD | YES | PARTIAL | testimonials | YES | Reorder, image upload, role/company | P2 |
| FAQ CRUD | YES | PARTIAL | faqs | YES | Reorder, search | P2 |
| Booking View | YES | PARTIAL | bookings | — | Delete, export, debounce notes | P1 |
| Contact Form → Bookings | UNCLEAR | UNKNOWN | contact_submissions? | UNKNOWN | Flow verification needed | P0 |
| Site Settings | YES | WORKING | site_settings | YES | — | — |
| Navigation CMS | YES | WORKING | site_settings | YES | — | — |
| Footer CMS | YES | WORKING | site_settings | YES | — | — |
| SEO (pages) | YES | PARTIAL | pages | YES | Canonical, sitemap, robots | P2 |
| SEO (site) | YES | PARTIAL | site_settings | PARTIAL | og:type, og:url, Twitter cards | P2 |
| Publishing | YES | WORKING | multiple | YES | Scheduled publishing | P3 |
| Page Preview | YES | WORKING | — | — | Public preview URL | P3 |
| Authentication | YES | PARTIAL | profiles | — | Forgot password, roles | P1 |
| RLS | YES | WORKING | — | — | — | — |
| Activity Log | NO | NOT IMPLEMENTED | — | — | Track admin actions | P3 |
| User Management | NO | NOT IMPLEMENTED | — | — | Multi-user, roles | P3 |
| Export | NO | NOT IMPLEMENTED | — | — | CSV/PDF export | P3 |

---

## PART 35 — PRIORITY CLASSIFICATION

### P0 — System Fundamentally Broken

1. **Portfolio gallery uses blob URLs** — Images are never uploaded to Supabase storage. Gallery breaks on page refresh. All portfolio gallery data is lost.
2. **Contact form → Bookings flow unverified** — Contact form may insert into `contact_submissions` while BookingsAdmin reads from `bookings`. If these are different tables, no bookings ever appear in admin.

### P1 — Major CMS Functionality Missing or Broken

3. **Forgot Password** — Button exists but has no handler. Non-functional.
4. **Remember Me** — Checkbox exists but value is never passed to sign-in. Non-functional.
5. **13 section types have no editor** — services-hero, services-featured, services-directory, services-philosophy, services-process, services-image-statement, services-cta, about-intro, about-story, about-foundation, about-values, about-why, about-closing — these sections can only be edited via raw SQL or the generic JSON body field in CMSPageEditor.
6. **Bookings have no delete** — Admins cannot remove bookings.
7. **Bookings notes save on every keystroke** — No debounce, floods Supabase with updates.
8. **Home page is 80% hardcoded** — Hero, stats, testimonials, CTA images all hardcoded despite CMS sections existing.
9. **About page is 100% hardcoded** — Despite 8 CMS sections being seeded in the database, the public About.tsx renders entirely hardcoded content.
10. **How We Work page is 100% hardcoded** — No CMS integration at all.
11. **Services page directory/process/stats/testimonials are hardcoded** — Only the featured services section uses CMS data.

### P2 — Important Improvement

12. **Testimonials have no reorder** — Admins cannot change display order.
13. **FAQs have no reorder** — Admins cannot change display order.
14. **FAQs have no search** — Unlike testimonials, no search functionality.
15. **Portfolio categories are hardcoded** — Not fetched from database.
16. **No file type/size validation on upload** — Any file can be uploaded.
17. **SEO incomplete** — Missing canonical URLs, sitemap, robots.txt, og:type, og:url.
18. **Media has no caption field** — Only alt text and focal point.
19. **No error logging** — Silent catch blocks throughout.
20. **Dashboard RecentActivity is a stub** — Shows placeholder text.
21. **Service CMS missing category/icon/CTA fields** — Limited editing capability.
22. **Portfolio cover image uses URL input** — Should use MediaPicker.

### P3 — Nice to Have

23. **Block-based page builder** — Current section-based system works but limits flexibility.
24. **Activity log** — Track who edited what.
25. **User management** — Multi-user with role hierarchy.
26. **Scheduled publishing** — Publish at a future date.
27. **Public preview URLs** — Share preview links.
28. **Export** — CSV/PDF for bookings.
29. **Media captions** — Additional metadata field.
30. **Counter animation in stats** — Currently cosmetic only.

---

## PART 36 — WHAT WE SHOULD NOT BUILD

### Unnecessary Complexity to Avoid

| Feature | Why Not |
|---------|---------|
| **Custom WebSockets** | Supabase Realtime is available if needed — don't build a custom notification system |
| **Microservices** | This is a single-page app with Supabase — keep it that way |
| **Custom auth system** | Supabase Auth is working — extend it, don't replace it |
| **Multiple database schemas** | Current single-schema approach is fine for this scale |
| **Custom image processing** | Supabase Storage + client-side is sufficient |
| **Block-level history** | The current section-level undo/redo is sufficient for v1 |
| **Real-time collaboration** | Single-admin system — no need for Google Docs-style collab |
| **Custom CSS editor** | Tailwind + inline styles + section variants cover all needs |
| **Full Gutenberg clone** | The section-based builder is simpler and sufficient for this use case |
| **Custom analytics** | Use Google Analytics or Plausible — don't build analytics into the CMS |
| **Email system** | Use a third-party service — don't build email into the CMS |
| **Custom workflow engine** | Booking status buttons are sufficient — no need for a BPM system |

---

## PART 37 — PAGE BUILDER SPECIFICATION

### Target Visual Builder Architecture

```
Canvas (VisualCanvas — REUSE)
  └── Section (existing — REUSE)
        └── Container (NEW — optional wrapper)
              └── Row (NEW — horizontal grouping)
                    └── Column (NEW — vertical splitting)
                          └── Block (NEW — individual content unit)
```

### Blocks to Implement

| Block | Properties | Editor |
|-------|-----------|--------|
| Heading | text, level (h1-h6), alignment, color | Inline edit + inspector |
| Text | content (rich text), alignment | Inline edit + inspector |
| Rich Text | content (JSON), formatting | Inline edit + toolbar |
| Image | src, alt, focal point, caption, link | MediaPicker + inspector |
| Button | text, url, style, size, icon | Inspector panel |
| Video | src, poster, autoplay | Inspector panel |
| Divider | style, width, color, spacing | Inspector panel |
| Spacer | height | Inspector panel |
| Quote | text, author, source | Inline edit + inspector |
| List | items, ordered, style | Inline edit + inspector |
| Icon | name, size, color | Icon picker + inspector |
| Gallery | images, columns, layout | MediaPicker + inspector |
| Embed | url, type | Inspector panel |

### Inspector Panel

Right sidebar that shows properties for the selected block/section. Context-sensitive — changes based on what's selected.

### Toolbar

Floating toolbar that appears above selected blocks with common actions: bold, italic, alignment, link, delete, move.

### Navigator

Tree view in left panel showing: Page → Sections → Containers → Rows → Columns → Blocks. Click to select, drag to reorder.

### Responsive Controls

Per-block visibility: show/hide on desktop/tablet/mobile. Per-block sizing: width, padding, margin at each breakpoint.

### Inline Editing

Click-to-edit on text blocks. Double-click to enter edit mode. Escape to exit. Auto-save on blur.

### Save / Autosave

- Autosave every 30 seconds
- Manual save with Ctrl+S
- Save indicator in top bar (saved/saving/unsaved/failed)
- Draft auto-saved, explicit publish action required

### Patterns

Pre-built section templates that can be inserted with one click: "Hero + CTA", "3-Column Features", "Testimonial Grid", etc.

---

## PART 38 — WORDPRESS COMPARISON

| Capability | Fiesta Current | WordPress/Gutenberg Target | Gap |
|-----------|---------------|---------------------------|-----|
| Page creation | Templates + sections | Blank canvas + blocks | Medium — Fiesta is more structured |
| Section management | Full CRUD with editors | Full CRUD with blocks | Small — comparable |
| Block system | NO | YES (core blocks + custom) | Large — no block architecture |
| Drag and drop | Sections only | Sections + blocks + columns | Large — no nesting |
| Inline editing | NO (inspector panel only) | YES (click-to-edit) | Medium |
| Media library | Full (upload, pick, focal point) | Full (upload, pick, edit) | Small — comparable |
| Reusable patterns | Templates (7) | Patterns (unlimited) | Medium |
| Theme system | Hardcoded design | Theme + Global Styles | Large — no theme architecture |
| Plugin ecosystem | None | Unlimited | Not applicable |
| User roles | 2 (admin/staff, no difference) | 5+ (admin/editor/author/contributor/subscriber) | Large |
| Revision history | Undo/redo (50 steps, session only) | Full revision history (persistent) | Large |
| Scheduling | NO | YES | Medium |
| Frontend editing | NO | Partial (FSE themes) | Not needed |
| SEO plugins | Basic (title, description) | Yoast/RankMath | Large — but basic is sufficient |
| Performance | Vite bundle (fast) | Varies by theme/plugin | Fiesta wins |
| Security | Supabase RLS + auth | Varies | Fiesta wins (Supabase is solid) |
| Learning curve | Low (custom UI) | Medium (Gutenberg has steep curve) | Fiesta wins |

---

## PART 39 — USER WORKFLOW

### Pages

```
Admin logs in
  → Dashboard
  → Pages
  → Select page (e.g., Home)
  → Page Builder opens
  → Add Section (choose type + variant)
  → Edit section content (right panel)
  → Reorder sections (drag)
  → Preview (responsive toggle)
  → Save Draft (Ctrl+S)
  → Publish
  → Public website updates
```

### Events

```
Admin logs in
  → Dashboard
  → Events
  → "Add Event"
  → Fill form (title, category, date, venue, description, cover, gallery, lineup)
  → Save & Publish
  → Public /events page shows new event
```

### Portfolio

```
Admin logs in
  → Dashboard
  → Portfolio
  → "Add Project"
  → Fill form (title, category, year, cover, gallery, description, story)
  → ⚠️ Gallery images use blob URLs — WILL BREAK ON REFRESH
  → Save
  → ⚠️ Gallery data may be lost
```

### Services

```
Admin logs in
  → Dashboard
  → Services
  → "Add Service"
  → Fill form (title, description, image, items, publish, featured)
  → Save
  → Service appears in admin list
  → ⚠️ Only "featured" services show on public site
  → ⚠️ Service directory on /services is hardcoded
```

### Media

```
Admin logs in
  → Dashboard
  → Media
  → Upload images (drag-and-drop)
  → Edit alt text, focal point
  → Use in any MediaPicker context (events, settings, page builder)
```

### Settings

```
Admin logs in
  → Dashboard
  → Settings
  → Edit tabs (Identity, Navigation, Contact, Social, Footer, SEO)
  → Save
  → Public navbar, footer, contact info update
```

---

## PART 40 — FINAL REPORT

### A. CURRENT ADMIN MAP

15 admin pages, 40+ components, 15 section editors, 6 service files, 1 hook, 17 lib files. The admin is a comprehensive CRUD interface with a visual page builder, media library, and global settings.

### B. CURRENT CAPABILITIES

- Full event CRUD with gallery, lineup, status
- Full service CRUD with featured toggle and reorder
- Visual page builder with 26 section types (15 editable)
- Media library with upload, focal point, alt text
- Global settings (identity, nav, contact, social, footer, SEO)
- Booking management with status and notes
- Testimonial and FAQ management
- Site-wide publishing controls
- Responsive preview in builder
- Undo/redo in page builder

### C. BROKEN FEATURES

1. Portfolio gallery — blob URLs, never persisted
2. Contact form → bookings flow — unverified/disconnected
3. Forgot Password — non-functional button
4. Remember Me — non-functional checkbox
5. Home page — 80% hardcoded despite CMS sections
6. About page — 100% hardcoded despite CMS sections
7. How We Work — 100% hardcoded
8. Services directory/process — hardcoded
9. ServicesRenderer scrollbar-hiding CSS — broken selector
10. Bookings notes — saves on every keystroke

### D. PARTIALLY IMPLEMENTED FEATURES

- Dashboard (activity feed stub)
- Testimonials (no reorder, no image upload)
- FAQs (no reorder, no search)
- Bookings (no delete, no export)
- SEO (basic fields only)
- Publishing (no scheduling)
- 13 section types (render but can't be edited)
- Media (no caption, no file validation)

### E. MISSING FEATURES

- Block-based page builder
- Activity log
- User management / role hierarchy
- Scheduled publishing
- Public preview URLs
- Export (CSV/PDF)
- Sitemap / robots.txt
- Canonical URLs
- Password reset
- Rate limiting on forms

### F. DATABASE MAP

11 tables, 1 storage bucket, 2 functions, ~15 indexes. Solid schema with proper RLS. 19 migrations show significant churn (About page rewritten 7+ times). Single-row settings pattern is simple but limits future multi-site support.

### G. DATA FLOW MAP

Events, services, media, and settings have clean data flows from admin → service → Supabase → public renderer. Portfolio has a broken flow (blob URLs). Contact form → bookings flow is uncertain. About/Home/HowWeWork pages bypass the CMS entirely.

### H. PUBLIC/CMS CONNECTION MAP

| Page | CMS-Connected | Hardcoded |
|------|---------------|-----------|
| Home | Services, Portfolio | Hero, Stats, Testimonials, CTA |
| About | NOTHING | Everything |
| Services | Featured services | Directory, Process, Stats, Testimonials |
| Events | Events data | Fallback events, CTA image |
| Portfolio | Portfolio data | Fallback gallery, CTA image |
| How We Work | NOTHING | Everything |
| Contact | Site settings (partial) | Event types, CTA image |
| Event Detail | Event data | CTA image |
| Portfolio Detail | Portfolio data | CTA image |

### I. PAGE BUILDER AUDIT

The page builder is the strongest part of the CMS. 3-panel layout, 15 section editors, drag-and-drop reorder, responsive preview, undo/redo, save/publish flow. The architecture is sound but limited by the section-based model (no blocks, no nesting).

### J. MEDIA AUDIT

Media library is fully functional. Upload, browse, search, filter, delete, focal point, alt text. Integration with page builder and event editor. Portfolio is the exception — uses blob URLs instead of MediaPicker.

### K. EVENTS AUDIT

Events management is fully functional. CRUD, gallery, lineup, status, featured, publish/unpublish. Public rendering is clean. Only issue: fallback data in Events.tsx.

### L. PORTFOLIO AUDIT

Portfolio is partially functional. CRUD works but gallery images use blob URLs that break on refresh. Cover image uses URL input instead of MediaPicker. Categories are hardcoded. No featured toggle.

### M. SERVICES AUDIT

Services management is fully functional. CRUD, reorder, featured, publish. Public rendering uses CMS data for featured section but the directory and process sections remain hardcoded.

### N. BOOKINGS AUDIT

Bookings are partially functional. View, search, filter, status update, notes. No delete. Notes save on every keystroke. Contact form → bookings flow is uncertain.

### O. SETTINGS AUDIT

Settings are fully functional. 6 tabs covering all site configuration. Navigation, footer, contact, social, SEO — all CMS-controlled and consumed publicly.

### P. AUTH AUDIT

Authentication works but has gaps. Login, logout, session persistence, protected routes all work. Forgot password and remember me are broken. No role-based access control beyond authentication.

### Q. SEO AUDIT

Basic SEO only. Page title, description, OG image are CMS-controlled. Missing: canonical URLs, sitemap, robots.txt, og:type, og:url, Twitter cards, structured data.

### R. SECURITY AUDIT

Generally solid. Supabase RLS, storage policies, auth all properly configured. Risks: no file validation on uploads, no rate limiting on forms, .env committed to repo, `is_staff()` uses SECURITY DEFINER.

### S. RESPONSIVE AUDIT

Admin layout is responsive but mobile experience is limited. Builder is desktop-only (intentional). Forms and tables may overflow on small screens. Static analysis only — no browser testing performed.

### T. HARDCODED CONTENT AUDIT

Massive amounts of hardcoded content on public pages. Home, About, HowWeWork are 80-100% hardcoded. Services, Events, Portfolio have hardcoded fallbacks. All CTA background images are hardcoded Unsplash URLs.

### U. DEAD CODE AUDIT

- `SectionNavigator.tsx` — unused
- `src/components/sections/` — empty directory
- `copyUrl` in PortfolioAdmin — never called
- `Reveal`/`useReveal` — duplicated across multiple files
- `STATS`, `TESTIMONIALS`, `CTA_IMAGE` — copy-pasted across 4+ files
- `<style>` tags duplicated per component instance in services renderers

### V. TARGET ADMIN ARCHITECTURE

See Part 33. The current structure is close. Key additions needed: activity log, user management, block-based page builder.

### W. TARGET PAGE BUILDER ARCHITECTURE

See Part 37. The section-based system should be extended with containers, rows, columns, and blocks — not replaced.

### X. PRIORITY ROADMAP

**P0 (Fix immediately):**
1. Portfolio gallery blob URLs → upload to Supabase Storage
2. Verify/fix contact form → bookings flow

**P1 (Fix soon):**
3. Forgot Password implementation
4. Remember Me implementation
5. Create editors for 13 missing section types
6. Bookings: add delete, debounce notes
7. Wire Home/About/HowWeWork/Services pages to CMS data

**P2 (Important improvements):**
8. Testimonial reorder
9. FAQ reorder + search
10. File validation on upload
11. SEO completeness
12. Dashboard activity feed
13. Portfolio MediaPicker integration
14. Error logging

**P3 (Future enhancements):**
15. Block-based page builder
16. Activity log
17. User management
18. Scheduled publishing
19. Export functionality

---

## FINAL QUESTION

### "BASED ON THE ACTUAL CODEBASE, WHAT CAN THE FIESTA ADMIN CURRENTLY DO, WHAT CAN IT NOT DO, WHAT IS BROKEN, AND WHAT WOULD YOU RECOMMEND WE BUILD NEXT?"

**What the admin CAN do:**
The admin is a functional CMS that can manage events (full CRUD with gallery, lineup, status), services (CRUD with reorder and featured), media (upload, browse, focal point, alt text), global settings (6 tabs covering all site config), and pages via a visual builder with 15 editable section types, undo/redo, responsive preview, and drag-and-drop. Bookings can be viewed and managed. Testimonials and FAQs can be created and edited. The page builder architecture is genuinely impressive — 3-panel layout, live canvas, type-specific editors, variant selection.

**What the admin CANNOT do:**
It cannot manage the About, Home, HowWeWork, or Services pages through the CMS — these are 80-100% hardcoded in React components despite CMS sections being seeded in the database. 13 of 26 section types have no editor and can only be modified via raw SQL. There is no block-based editing, no inline editing, no nested layouts. Portfolio gallery is broken (blob URLs). The contact form may not connect to the bookings admin. There is no password reset, no role hierarchy, no activity log, no export, no scheduling.

**What is BROKEN:**
1. Portfolio gallery images are lost on page refresh (blob URLs)
2. Contact form → bookings flow is potentially disconnected
3. Forgot Password button does nothing
4. Remember Me checkbox does nothing
5. Home/About/HowWeWork pages ignore CMS data entirely
6. Bookings notes save on every keystroke (spamming database)
7. ServicesRenderer has broken CSS selector
8. Bookings have no delete functionality

**What to build next (in order):**
1. **Fix portfolio gallery** — upload images to Supabase Storage instead of blob URLs (P0)
2. **Verify contact → bookings flow** — ensure form submissions appear in admin (P0)
3. **Wire public pages to CMS data** — Home, About, HowWeWork, Services should render CMS content, not hardcoded content (P1)
4. **Create editors for all 26 section types** — the 13 missing editors need to be built (P1)
5. **Fix auth gaps** — implement forgot password and remember me (P1)
6. **Add booking delete and debounce** — basic CRUD completeness (P1)
7. **Then** build the block-based page builder system (P2-P3)

---

*End of audit. Total files analyzed: 90+. Total migration files: 19. Total components: 60+. Total service files: 8. Total hooks: 4. Total pages: 26 (11 public, 15 admin).*
