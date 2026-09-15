# FRONTEND-DOCUMENTATION.md — Fiesta Agency

## Application Entry

The application starts at `src/main.tsx`, which renders `App.tsx` inside `<StrictMode>`.

`App.tsx` wraps everything in:
1. `<AuthProvider>` — Supabase session management
2. `<BrowserRouter>` — React Router
3. `<Suspense>` — Loading fallbacks for lazy-loaded pages

---

## Routing

All routes are defined in `App.tsx`. Pages are lazy-loaded via `React.lazy()`.

### Public Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Home | Homepage with hero, services, events, testimonials |
| `/about` | About | Agency story, mission, values, team |
| `/services` | Services | Service showcase with details |
| `/events` | Events | Filterable event gallery |
| `/events/:slug` | EventDetail | Individual event page |
| `/portfolio` | Portfolio | Filterable project gallery |
| `/portfolio/:slug` | PortfolioDetail | Individual project page with story |
| `/how-we-work` | HowWeWork | Five-phase process |
| `/contact` | Contact | Contact form and info |
| `/plan-your-event` | PlanYourEvent | Alias for Contact |
| `/privacy` | Privacy | Privacy policy |
| `/terms` | Terms | Terms and conditions |
| `*` | NotFound | 404 page |

### Admin Routes
All admin routes are wrapped in `<ProtectedRoute>` and `<AdminLayout>`.

| Path | Component | Purpose |
|------|-----------|---------|
| `/admin/login` | AdminLogin | Login page |
| `/admin` | Dashboard | Overview dashboard |
| `/admin/home` | CMSPageEditor | Home page CMS |
| `/admin/about` | CMSPageEditor | About page CMS |
| `/admin/services` | ServicesCMSAdmin | Services management |
| `/admin/how-we-work` | CMSPageEditor | How We Work CMS |
| `/admin/events` | EventsAdmin | Events list |
| `/admin/events/new` | EventForm | Create event |
| `/admin/events/:id/edit` | EventForm | Edit event |
| `/admin/portfolio` | PortfolioAdmin | Portfolio list |
| `/admin/portfolio/new` | PortfolioForm | Create project |
| `/admin/portfolio/:id/edit` | PortfolioForm | Edit project |
| `/admin/testimonials` | TestimonialsAdmin | Testimonials management |
| `/admin/faqs` | FAQsAdmin | FAQs management |
| `/admin/media` | MediaAdmin | Media library |
| `/admin/pages` | PagesAdmin | Pages list |
| `/admin/pages/:pageId` | PageBuilderAdmin | Visual page builder |
| `/admin/bookings` | BookingsAdmin | Booking inquiries |
| `/admin/settings` | SettingsAdmin | Site settings |

---

## Layout System

### Public Layout (`PublicLayout.tsx`)
- Fixed navbar at top
- Main content area
- Footer at bottom
- WhatsApp floating button
- Scroll-to-top on route change
- Dark obsidian background

### Admin Layout (`AdminLayout.tsx`)
- Collapsible sidebar (desktop: toggle, mobile: overlay)
- Sticky header with user info and sign out
- Main content area with max-width constraint
- Sidebar state persisted in localStorage

---

## Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `obsidian` | `#090909` | Primary background |
| `charcoal` | `#1a1a1a` | Card/panel backgrounds |
| `gold` | `#D6A64F` | Accent, CTAs, highlights |
| `ivory` | `#F5F0E8` | Headings, light text |
| `stone` | `#A89F91` | Body text |
| `cream` | `#FAF8F5` | Light backgrounds |

### Typography
| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display headings | Fraunces (serif) | 300-400 | clamp(2rem, 5vw, 4.5rem) |
| Section headings | Fraunces (serif) | 300-400 | clamp(1.5rem, 3vw, 3rem) |
| Body text | Manrope (sans) | 300-400 | 0.875rem - 1rem |
| Labels/eyebrows | Manrope (sans) | 600-700 | 0.6rem - 0.7rem, uppercase, tracking-widest |
| Buttons | Manrope (sans) | 600-700 | 0.65rem - 0.75rem, uppercase |

### Spacing Pattern
```
Section padding: py-20 md:py-28 lg:py-36
Horizontal: px-5 md:px-[4vw] lg:px-12
Container max-width: max-w-[1320px]
```

### Button Styles
- **Primary**: Gold gradient background, dark text, hover lift
- **Outline**: Border only, text color, hover fill
- **Ghost**: No background, text only

---

## Component Architecture

### Public Components
Components are organized by page/feature:
- `public/about/` — About page sections
- `public/contact/` — Contact page sections
- `public/events/` — Events page sections
- `public/howwe/` — How We Work sections
- `public/portfolio/` — Portfolio page sections
- `public/services/` — Services page sections

### Admin Components
- `admin/AdminUI.tsx` — AdminButton, AdminCard, AdminInput, AdminTextarea, AdminToggle, AdminSelect, DataTable, Toast, ConfirmDialog, PageHeader, AdminLoading, AdminErrorBoundary
- `admin/pages/` — PageBuilder, SectionEditor, AddSectionModal, VisualCanvas, MediaPicker, BlockRenderers
- `admin/media/` — MediaLibrary, MediaUpload, MediaDetail, MediaGridItem, MediaPicker, FocalPointEditor

---

## Animations

The site uses CSS transitions and the Intersection Observer API (via `useReveal` hook) for scroll-triggered reveal animations. No animation library is used.

Key animation pattern:
```typescript
const { ref, visible } = useReveal({ threshold: 0.1 });
// Element fades in and translates up when visible
style={{
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(30px)',
  transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s ...'
}}
```

---

## State Management

The application uses React's built-in state management:
- `useState` for local component state
- `useCallback` and `useMemo` for memoization
- `useEffect` for side effects and data fetching
- No Redux, Zustand, or other external state library
- Supabase client handles session persistence

---

## See Also

- [COMPONENT-DOCUMENTATION.md](./COMPONENT-DOCUMENTATION.md)
- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md)
- [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md)
- [PUBLIC-PAGES.md](./PUBLIC-PAGES.md)
