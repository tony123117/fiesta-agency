# SYSTEM-ARCHITECTURE.md — Fiesta Agency

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client[Client Browser]
        React[React SPA]
        Tailwind[Tailwind CSS]
        DOMPurify[DOMPurify]
    end

    subgraph Supabase[Supabase Platform]
        Auth[Supabase Auth]
        DB[(PostgreSQL)]
        Storage[Supabase Storage]
        RLS[Row Level Security]
    end

    subgraph External[External Services]
        Web3Forms[Web3Forms API]
        GoogleFonts[Google Fonts]
        Unsplash[Image Sources]
    end

    React --> Auth
    React --> DB
    React --> Storage
    React --> Web3Forms
    React --> GoogleFonts
    DOMPurify --> React
    RLS --> DB
    Tailwind --> React
```

---

## Component Architecture

```mermaid
flowchart TD
    App[App.tsx] --> AuthProvider[AuthProvider]
    App --> BrowserRouter[BrowserRouter]
    
    BrowserRouter --> PublicLayout[PublicLayout]
    BrowserRouter --> AdminLayout[AdminLayout]
    BrowserRouter --> AdminLogin[AdminLogin]
    
    PublicLayout --> Navbar[Navbar]
    PublicLayout --> Outlet[Page Outlet]
    PublicLayout --> Footer[Footer]
    PublicLayout --> WhatsApp[WhatsAppButton]
    
    Outlet --> Home
    Outlet --> About
    Outlet --> Services
    Outlet --> Events
    Outlet --> Portfolio
    Outlet --> Contact
    Outlet --> HowWeWork
    Outlet --> EventDetail
    Outlet --> PortfolioDetail
    
    AdminLayout --> Sidebar[Sidebar Navigation]
    AdminLayout --> AdminOutlet[Admin Outlet]
    
    AdminOutlet --> Dashboard
    AdminOutlet --> CMSPageEditor
    AdminOutlet --> PageBuilder
    AdminOutlet --> EventsAdmin
    AdminOutlet --> PortfolioAdmin
    AdminOutlet --> BookingsAdmin
    AdminOutlet --> MediaAdmin
    AdminOutlet --> SettingsAdmin
```

---

## CMS Architecture

```mermaid
flowchart TD
    Page[Page in DB] --> Sections[Sections in DB]
    Sections --> SectionContent[section.content JSON]
    
    SectionContent --> SectionRenderer[SectionRenderer Component]
    SectionRenderer --> RendererMap{section_type mapping}
    
    RendererMap --> HeroCarousel[HeroCarousel]
    RendererMap --> BrandStatement[CMSBrandStatement]
    RendererMap --> Services[ServicesRenderer]
    RendererMap --> Events[EventsRenderer]
    RendererMap --> Portfolio[PortfolioRenderer]
    RendererMap --> Testimonials[TestimonialsRenderer]
    RendererMap --> CTARenderer[CTARenderer]
    RendererMap --> Blocks[BlocksSectionRenderer]
    RendererMap --> OtherRenderers[...42 more renderers]
```

---

## Authentication Architecture

```mermaid
flowchart TD
    Login[Admin Login] --> SupabaseAuth[Supabase Auth]
    SupabaseAuth --> JWT[JWT Token]
    JWT --> Session[Session in localStorage]
    Session --> Profile[Profile from profiles table]
    Profile --> Role{Role Check}
    Role --> Admin[admin - full access]
    Role --> Staff[staff - limited access]
    
    Admin --> ProtectedRoute[ProtectedRoute]
    Staff --> ProtectedRoute
    ProtectedRoute --> AdminPages[Admin Pages]
```

---

## Database Architecture

```mermaid
erDiagram
    pages ||--o{ sections : "has many"
    sections ||--o{ section_type : "typed as"
    
    pages {
        uuid id PK
        text slug UK
        text title
        text description
        boolean published
        text seo_title
        text seo_description
        text og_image_url
    }
    
    sections {
        uuid id PK
        uuid page_id FK
        text section_type
        jsonb content
        int sort_order
        boolean published
        text layout
    }
    
    services {
        uuid id PK
        text title
        text slug UK
        text description
        jsonb details
        text image_url
        int sort_order
        boolean published
    }
    
    events {
        uuid id PK
        text title
        text slug UK
        text category
        date event_date
        text location
        text cover_image
        jsonb gallery
        text status
        boolean featured
    }
    
    portfolio_projects {
        uuid id PK
        text title
        text slug UK
        text category
        text description
        jsonb story
        int year
        text cover_image
        jsonb gallery
    }
    
    testimonials {
        uuid id PK
        text client_name
        text quote
        text event_type
        text location
    }
    
    faqs {
        uuid id PK
        text question
        text answer
        text category
    }
    
    bookings {
        uuid id PK
        text client_name
        text email
        text event_type
        text status
    }
    
    media {
        uuid id PK
        text name
        text storage_path
        text public_url
        text alt_text
    }
    
    site_settings {
        int id PK
        text company_name
        text tagline
        text logo_url
    }
```

---

## Security Architecture

```mermaid
flowchart TD
    Public[Public Visitor] -->|SELECT published| RLS[Row Level Security]
    Authenticated[Authenticated User] -->|SELECT published| RLS
    Staff[Staff Role] -->|SELECT/INSERT/UPDATE/DELETE| RLS
    Admin[Admin Role] -->|SELECT/INSERT/UPDATE/DELETE| RLS
    
    RLS --> Pages[pages table]
    RLS --> Sections[sections table]
    RLS --> Services[services table]
    RLS --> Events[events table]
    RLS --> Portfolio[portfolio_projects table]
    RLS --> Testimonials[testimonials table]
    RLS --> FAQs[faqs table]
    RLS --> Media[media table]
    RLS --> Settings[site_settings table]
    
    Anonymous[Anonymous] -->|INSERT only| Bookings[bookings table]
    Staff -->|SELECT/UPDATE/DELETE| Bookings
```

---

## See Also

- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)
- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md)
- [AUTHENTICATION-AND-SECURITY.md](./AUTHENTICATION-AND-SECURITY.md)
