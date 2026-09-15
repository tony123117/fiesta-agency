# ADMIN-DOCUMENTATION.md — Fiesta Agency

## Accessing the Admin

1. Navigate to `/admin/login`
2. Enter email and password
3. Supabase Auth validates credentials
4. Redirected to `/admin` dashboard

Admin routes are protected by `ProtectedRoute` which checks:
- Active Supabase session
- User profile exists in `profiles` table
- User role is `admin` or `staff`

---

## Dashboard

The dashboard (`/admin`) shows:
- **Stats** — Total events, portfolio projects, bookings, testimonials
- **Upcoming Events** — Next 5 events by date
- **Recent Bookings** — Latest 5 booking inquiries
- **Website Snapshot** — Quick links to public pages

---

## Admin Pages

### Page Builder (`/admin/pages/:pageId`)
The visual page builder allows:
- Adding sections from a library of 50 types
- Reordering sections via drag-and-drop
- Toggling section visibility (published/draft)
- Editing section content via type-specific editors
- Previewing sections before publishing
- Undo/redo with keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- Save/publish/unpublish page

### CMS Page Editor (`/admin/home`, `/admin/about`, etc.)
Simplified editor for specific pages:
- Edit existing sections
- Toggle visibility
- Preview on public site
- Reorder sections

### Events Management (`/admin/events`)
- List all events with search and filters
- Create new events (`/admin/events/new`)
- Edit events (`/admin/events/:id/edit`)
- Toggle published/featured status
- Duplicate events
- Delete events (with confirmation)
- Preview on public site

### Portfolio Management (`/admin/portfolio`)
- List all projects with search and filters
- Create new projects (`/admin/portfolio/new`)
- Edit projects (`/admin/portfolio/:id/edit`)
- Toggle published status
- Duplicate projects
- Delete projects (with confirmation)

### Testimonials (`/admin/testimonials`)
- List all testimonials
- Add new testimonials
- Edit client name, quote, event type, location, image
- Reorder via sort order
- Toggle published status
- Delete with confirmation

### FAQs (`/admin/faqs`)
- List all FAQs
- Add new FAQs
- Edit question, answer, category
- Reorder via sort order
- Toggle published status
- Delete with confirmation

### Services (`/admin/services`)
- List all services with order/visibility controls
- Add new services
- Edit title, description, image, featured status
- Reorder services
- Toggle published status

### Bookings (`/admin/bookings`)
- List all booking inquiries
- Filter by status (new, contacted, in_progress, confirmed, completed, cancelled)
- View booking details
- Update status
- Add internal notes
- See submission date and client info

### Media Library (`/admin/media`)
- Grid view of all uploaded media
- Upload new files (drag-and-drop or click)
- Search by name or alt text
- Filter by type (images, videos)
- Sort by date or name
- Edit alt text and focal point
- Delete media (with storage cleanup)
- Copy public URL
- Media picker for selecting images in editors

### Settings (`/admin/settings`)
- Company name, tagline, logo
- Contact info (email, phone, WhatsApp, address)
- Social links (Instagram, Facebook, TikTok)
- Navigation items (add, remove, reorder, toggle visibility)
- Footer link groups (add, remove, reorder)
- Footer CTA (heading, subtext, button)
- SEO defaults (title, description, OG image)
- Copyright text
- Footer hero image

---

## Admin UI Components

The admin uses a custom UI library defined in `AdminUI.tsx`:

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Page title with optional action button |
| `AdminButton` | Styled button (primary, secondary, ghost, danger) |
| `AdminCard` | Card container with optional header |
| `AdminInput` | Text input with label |
| `AdminTextarea` | Textarea with label |
| `AdminSelect` | Dropdown select with label |
| `AdminToggle` | Toggle switch |
| `DataTable` | Sortable data table with columns |
| `Toast` | Notification toast |
| `ConfirmDialog` | Confirmation modal |
| `AdminLoading` | Loading spinner |
| `AdminErrorBoundary` | Error boundary with recovery |

---

## Keyboard Shortcuts (Page Builder)

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Ctrl+S` | Save |

---

## See Also

- [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md)
- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md)
- [MEDIA-DOCUMENTATION.md](./MEDIA-DOCUMENTATION.md)
