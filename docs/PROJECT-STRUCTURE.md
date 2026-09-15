# PROJECT-STRUCTURE.md — Fiesta Agency

## Repository Root

```
fiesta-agency/
├── docs/                          # This documentation
├── public/                        # Static assets (robots.txt, sitemap.xml)
├── src/                           # Application source code
├── supabase/                      # Database migrations and config
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.app.json              # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
└── .env                           # Environment variables (not in git)
```

---

## Source Code Structure

```
src/
├── App.tsx                        # Root component with routing
├── main.tsx                       # Entry point (renders App)
├── index.css                      # Global styles, Tailwind imports
├── vite-env.d.ts                  # Vite type declarations
│
├── components/                    # Shared components
│   ├── Navbar.tsx                 # Public navigation bar
│   ├── Footer.tsx                 # Public footer
│   ├── PublicLayout.tsx           # Public page layout wrapper
│   ├── Reveal.tsx                 # Scroll reveal animation wrapper
│   ├── RichText.tsx               # Rich text renderer
│   ├── WhatsAppButton.tsx         # Floating WhatsApp CTA
│   │
│   ├── admin/                     # Admin-specific components
│   │   ├── AdminLayout.tsx        # Admin layout with sidebar
│   │   ├── AdminUI.tsx            # Admin UI primitives (AdminButton, AdminCard, etc.)
│   │   ├── ProtectedRoute.tsx     # Auth route guard
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── events/                # Event list/editor components
│   │   ├── media/                 # Media library components
│   │   ├── pages/                 # Page builder components
│   │   └── services/              # Service editor components
│   │
│   └── public/                    # Public-facing section renderers
│       ├── SectionRenderer.tsx    # Maps section_type → component
│       ├── PageRenderer.tsx       # Fetches and renders CMS pages
│       ├── HeroCarousel.tsx       # Hero carousel section
│       ├── CMSBrandStatement.tsx  # Brand statement section
│       ├── CTARenderer.tsx        # Call-to-action section
│       ├── FAQRenderer.tsx        # FAQ accordion section
│       ├── TestimonialsRenderer.tsx
│       ├── StatsRenderer.tsx
│       ├── ProcessRenderer.tsx
│       ├── TextImageRenderer.tsx
│       ├── EditorialListRenderer.tsx
│       ├── CinematicImageRenderer.tsx
│       ├── TeamMembersRenderer.tsx
│       ├── ImageCarouselRenderer.tsx
│       ├── BlocksSectionRenderer.tsx  # Freeform block editor
│       ├── LayoutRenderer.tsx     # Container/Row/Column layout
│       ├── LegalPageRenderer.tsx  # Privacy/Terms renderer
│       ├── EventsRenderer.tsx     # Events editorial section
│       ├── PortfolioRenderer.tsx  # Portfolio gallery section
│       ├── ServicesRenderer.tsx   # Services editorial section
│       │
│       ├── about/                 # About page sections
│       ├── contact/               # Contact page sections
│       ├── events/                # Events page sections
│       ├── howwe/                 # How We Work page sections
│       ├── portfolio/             # Portfolio page sections
│       └── services/              # Services page sections
│
├── pages/                         # Route-level page components
│   ├── public/                    # Public pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Events.tsx
│   │   ├── EventDetail.tsx
│   │   ├── Portfolio.tsx
│   │   ├── PortfolioDetail.tsx
│   │   ├── HowWeWork.tsx
│   │   ├── Contact.tsx
│   │   ├── PlanYourEvent.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   │
│   └── admin/                     # Admin pages
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       ├── EventsAdmin.tsx
│       ├── EventForm.tsx
│       ├── PortfolioAdmin.tsx
│       ├── PortfolioForm.tsx
│       ├── TestimonialsAdmin.tsx
│       ├── FAQsAdmin.tsx
│       ├── BookingsAdmin.tsx
│       ├── MediaAdmin.tsx
│       ├── SettingsAdmin.tsx
│       ├── CMSPageEditor.tsx
│       ├── ServicesCMSAdmin.tsx
│       ├── PagesAdmin.tsx
│       └── PageBuilderAdmin.tsx
│
├── lib/                           # Utilities, services, types
│   ├── supabase.ts               # Supabase client initialization
│   ├── auth.tsx                   # Auth provider, session, roles
│   ├── types.ts                   # TypeScript interfaces and types
│   ├── sectionTypes.ts            # Section type registry and defaults
│   ├── blockTypes.ts              # Block type definitions
│   ├── layoutTypes.ts             # Layout type definitions
│   ├── pagesService.ts            # Pages CRUD operations
│   ├── sectionsService.ts         # Sections CRUD operations
│   ├── eventsService.ts           # Events CRUD operations
│   ├── servicesService.ts         # Services CRUD operations
│   ├── mediaService.ts            # Media upload/management
│   ├── siteSettingsService.ts     # Site settings read/write
│   ├── blocksService.ts           # Blocks CRUD operations
│   ├── useDocumentMeta.ts         # SEO metadata hook
│   ├── useSiteSettings.ts         # Site settings hook (cached)
│   ├── usePublicData.ts           # Public data fetching hook
│   ├── useReveal.ts               # Scroll reveal hook
│   ├── sanitize.ts                # DOMPurify wrapper
│   ├── slug.ts                    # Slug generation utility
│   ├── images.ts                  # Image URL constants
│   ├── images-supabase.ts         # Supabase-hosted image URLs
│   ├── pageTemplates.ts           # Page template definitions
│   ├── process-data.tsx           # Process step data
│   ├── breakHeading.ts            # Heading split utility
│   └── aboutContentToBlocks.ts    # About content migration helper
│
├── hooks/                         # Custom React hooks
│   ├── useLayoutOperations.ts     # Layout drag/drop operations
│   └── usePrefersReducedMotion.ts # Accessibility preference
│
└── demo/                          # Demo/preview data
    └── sectionPreviews.ts         # Preview content for section editors
```

---

## Key Files Explained

| File | Purpose |
|------|---------|
| `App.tsx` | Defines all routes, lazy-loads pages, wraps in AuthProvider |
| `SectionRenderer.tsx` | Maps 50 section types to their React components |
| `types.ts` | All TypeScript interfaces for the entire application |
| `sectionTypes.ts` | Section type registry with defaults, variants, previews |
| `supabase.ts` | Creates and exports the Supabase client |
| `auth.tsx` | AuthProvider with session management, role checking |
| `useDocumentMeta.ts` | Sets document title, meta tags, OG tags, canonical URL |
| `sanitize.ts` | DOMPurify wrapper for HTML sanitization |
| `pagesService.ts` | CRUD operations for the pages table |
| `sectionsService.ts` | CRUD operations for the sections table |
| `siteSettingsService.ts` | Read/write site settings with defaults |

---

## See Also

- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
