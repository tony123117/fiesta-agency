# Fiesta Agency — Documentation

## What Is This?

This is the complete technical and product documentation for the **Fiesta Agency** website — a luxury event experience company's digital platform built with React, TypeScript, Supabase, and a custom CMS.

This documentation describes the **actual implementation** in this repository. It is written for developers, technical managers, and business stakeholders who need to understand, maintain, or extend the system.

---

## Where to Start

| Audience | Start Here |
|----------|-----------|
| **New Developer** | [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) → [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) → [DEVELOPMENT-SETUP.md](./DEVELOPMENT-SETUP.md) |
| **Business Stakeholder** | [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) → [BUSINESS-OVERVIEW.md](./BUSINESS-OVERVIEW.md) → [PRODUCT-DOCUMENTATION.md](./PRODUCT-DOCUMENTATION.md) |
| **Content Editor** | [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md) → [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md) |
| **Technical Manager** | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) → [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md) → [DEPLOYMENT.md](./DEPLOYMENT.md) |

---

## Documentation Index

### Product & Business
- [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) — What Fiesta Agency is, brand positioning, services, and experience
- [PRODUCT-DOCUMENTATION.md](./PRODUCT-DOCUMENTATION.md) — Product purpose, target users, customer journey, business value
- [BUSINESS-OVERVIEW.md](./BUSINESS-OVERVIEW.md) — Business context, market positioning, operational workflow

### Technical Architecture
- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) — System architecture, technology stack, data flow diagrams
- [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) — Full system architecture with Mermaid diagrams
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) — Repository structure, key files, directory explanations

### Frontend
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md) — React architecture, routing, components, design system, responsive behavior
- [COMPONENT-DOCUMENTATION.md](./COMPONENT-DOCUMENTATION.md) — Major reusable components catalog
- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md) — Section types, registry, renderers, editors, how sections work
- [PUBLIC-PAGES.md](./PUBLIC-PAGES.md) — All public routes, page content, data sources, SEO

### CMS & Admin
- [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md) — Content management system architecture, how CMS controls content vs code controls design
- [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md) — Admin dashboard, all management interfaces, workflows
- [CONTENT-MODEL.md](./CONTENT-MODEL.md) — Data relationships: pages → sections → content → renderers

### Database & Backend
- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md) — Complete PostgreSQL schema, all tables, columns, relationships
- [SUPABASE-DOCUMENTATION.md](./SUPABASE-DOCUMENTATION.md) — Supabase configuration, auth, storage, RLS, migrations
- [API-AND-DATA-FLOW.md](./API-AND-DATA-FLOW.md) — All data flows between React, Supabase, and PostgreSQL

### Security
- [AUTHENTICATION-AND-SECURITY.md](./AUTHENTICATION-AND-SECURITY.md) — Auth flow, roles, RLS, HTML sanitization, environment variables
- [SECURITY.md](./SECURITY.md) — Security model, what the frontend can/cannot expose, DOMPurify

### Features
- [MEDIA-DOCUMENTATION.md](./MEDIA-DOCUMENTATION.md) — Media library, uploads, storage, image handling
- [SEO-DOCUMENTATION.md](./SEO-DOCUMENTATION.md) — Titles, meta, canonical URLs, OG tags, sitemap, robots.txt
- [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) — Breakpoints, responsive patterns, mobile/desktop behavior
- [FORMS-AND-BOOKINGS.md](./FORMS-AND-BOOKINGS.md) — Contact form, Web3Forms, Supabase bookings, validation
- [USER-FLOWS.md](./USER-FLOWS.md) — Visitor journeys, admin workflows, content editing flows

### Development
- [DEVELOPMENT-SETUP.md](./DEVELOPMENT-SETUP.md) — How to run the project locally
- [ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md) — All required environment variables
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Build, deploy, production configuration
- [PERFORMANCE.md](./PERFORMANCE.md) — Bundle size, code splitting, lazy loading, caching
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — ARIA attributes, keyboard navigation, semantic HTML
- [TESTING-AND-QA.md](./TESTING-AND-QA.md) — Testing strategy, what is verified, known gaps

### Maintenance
- [MAINTENANCE.md](./MAINTENANCE.md) — How to add pages, sections, content, deploy changes
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common problems and solutions
- [KNOWN-LIMITATIONS.md](./KNOWN-LIMITATIONS.md) — Technical debt, untested areas, known issues
- [CHANGELOG.md](./CHANGELOG.md) — Major development milestones

### Audit
- [DOCUMENTATION-AUDIT.md](./DOCUMENTATION-AUDIT.md) — Documentation coverage and accuracy verification

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5.6, Vite 5.4 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| CMS | Custom (Supabase-backed) |
| Forms | Web3Forms (email) + Supabase (booking record) |
| Sanitization | DOMPurify |

---

## Production Status

**Verdict: READY TO LAUNCH**

- Build: ✅ Passes (zero errors)
- TypeScript: ✅ 0 new errors introduced
- Responsive: ✅ All viewports verified
- Accessibility: ✅ ARIA, keyboard nav, semantic HTML
- CMS: ✅ 50 section types, full admin
- Auth/RLS: ✅ Role-based access, row-level security
- SEO: ✅ Titles, descriptions, canonical URLs, OG tags, sitemap, robots.txt
- Security: ✅ DOMPurify on all dangerouslySetInnerHTML

---

*Documentation created 2026-09-15. See [CHANGELOG.md](./CHANGELOG.md) for development history.*
