# Phase 13.5 — Hardcoded Fallback Audit & Source-of-Truth Cleanup

## 13.5.1 Fallback Trace

### Home.tsx
- **Fallback:** 7 imported components (Hero, BrandStatement, ServiceSection, FeaturedWork, StatsSection, TestimonialSection, CTASection)
- **CMS equivalent:** 7 sections (hero-carousel, brand-statement, services-editorial, portfolio-gallery, stats, testimonials, cta)
- **Fallback reachable?** YES — when `hasCmsContent !== true` (loading or no CMS sections)
- **Blank page if removed?** YES — CMS content has empty arrays, many renderers return null
- **Functionality not in CMS:** ServiceSection fetches from `services` table, FeaturedWork fetches from `portfolio_projects`, TestimonialSection fetches from `testimonials` — these data sources are NOT in the CMS sections
- **Decision:** KEEP — fallback contains real data from Supabase tables that CMS sections don't have

### About.tsx
- **Fallback:** 8 inline sections with hardcoded TEAM array, scroll-reveal animations, editorial layouts
- **CMS equivalent:** 8 sections (hero-carousel, brand-statement, text-image×2, process, stats, testimonials, cta)
- **Fallback reachable?** YES
- **Blank page if removed?** PARTIAL — CMS hero/brand-statement/cta render, but process/stats/testimonials return null (empty arrays)
- **Functionality not in CMS:** Cinematic Image Break, What Fiesta Believes (5 principles), People Behind Fiesta (team members) — NO CMS equivalents exist
- **Decision:** KEEP — fallback has 3 sections with no CMS equivalent + real team data + animations

### Services.tsx
- **Fallback:** 11 inline sections with Supabase `services` table fetch, local Carousel component, FALLBACK_SERVICES array
- **CMS equivalent:** 5 sections (hero-carousel, services-editorial, process, testimonials, cta)
- **Fallback reachable?** YES
- **Blank page if removed?** MAJOR — CMS missing 6 sections (Intro, Weddings, Corporate, Celebrations, Production, Carousel, Why Fiesta, Final Statement)
- **Functionality not in CMS:** Service philosophy, individual service deep-dives, image carousel, Why Fiesta principles, final editorial statement
- **Decision:** KEEP — CMS has only 5 of 11 sections; fallback is the complete page

### HowWeWork.tsx
- **Fallback:** 7 inline sections with hardcoded STAGES, DIFFERENTIATORS, BTS_PHOTOS arrays, BTSImage component
- **CMS equivalent:** 5 sections (hero-carousel, process, services-editorial, testimonials, cta)
- **Fallback reachable?** YES
- **Blank page if removed?** PARTIAL — CMS missing Visual Transition and BTS sections; process steps empty
- **Functionality not in CMS:** 5-stage journey with images, 8-item differentiator list, BTS photo gallery
- **Decision:** KEEP — fallback has 2 sections with no CMS equivalent + real process steps + BTS gallery

## 13.5.2 Duplicate Content Sources

| Content | Hardcoded Source | CMS Source | Duplicated? |
|---------|-----------------|------------|-------------|
| Home Hero heading | Hero component | hero-carousel slide headline | YES (different text) |
| Home Brand Statement | BrandStatement component | brand-statement primary_text | YES (different text) |
| About Hero heading | Inline JSX | hero-carousel slide headline | YES (same text: "WE CREATE MORE THAN EVENTS") |
| About Mission | Inline JSX | text-image body | YES (same text) |
| About Vision | Inline JSX | text-image body | YES (same text) |
| Services Hero | Inline JSX | hero-carousel slide | YES (different text) |
| HowWeWork Hero | Inline JSX | hero-carousel slide | YES (different text) |

**Verdict:** Some text is duplicated between hardcoded and CMS (About Mission/Vision are identical). Most headings differ slightly. The duplication is expected during migration — the CMS sections were seeded from the hardcoded content.

## 13.5.3 Final Architecture Decision

**Architecture:**
```
CMS Page (published)
   ↓
Published Sections (filtered)
   ↓
PageRenderer
   ↓
SectionRenderer
   ↓
Public Presentation Components
```

**Fallback logic:**
```
hasCmsContent !== true  →  show hardcoded fallback
hasCmsContent === true  →  show CMS sections
```

**Why fallbacks remain:**
1. CMS sections have empty arrays (services, items, stats, steps, testimonials)
2. CMS sections have empty images
3. About/Services/HowWeWork have sections with NO CMS equivalent
4. Hardcoded fallbacks fetch live data from Supabase tables (services, portfolio, testimonials)
5. Hardcoded fallbacks have scroll-reveal animations and editorial layouts not in CMS renderers

**When fallbacks can be removed:**
1. Admin fills in ALL array data via Page Builder
2. Admin adds images to ALL sections via Page Builder
3. Admin creates CMS equivalents for missing sections (Cinematic Break, What Fiesta Believes, People Behind Fiesta, service deep-dives, BTS gallery)
4. After all above, verify public page matches original design

## 13.5.4 Component Usage Audit

| Component | Used By | Status |
|-----------|---------|--------|
| Hero | Home.tsx fallback | ACTIVE (fallback) |
| BrandStatement | Home.tsx fallback | ACTIVE (fallback) |
| ServiceSection | Home.tsx fallback | ACTIVE (fallback) |
| FeaturedWork | Home.tsx fallback | ACTIVE (fallback) |
| StatsSection | Home.tsx fallback | ACTIVE (fallback) |
| TestimonialSection | Home.tsx fallback | ACTIVE (fallback) |
| CTASection | Home.tsx fallback | ACTIVE (fallback) |
| HeroCarousel | SectionRenderer → hero-carousel | ACTIVE (CMS renderer) |
| CMSBrandStatement | SectionRenderer → brand-statement | ACTIVE (CMS renderer) |
| ServicesRenderer | SectionRenderer → services-editorial | ACTIVE (CMS renderer) |
| EventsRenderer | SectionRenderer → events-editorial | ACTIVE (CMS renderer) |
| PortfolioRenderer | SectionRenderer → portfolio-gallery | ACTIVE (CMS renderer) |
| TestimonialsRenderer | SectionRenderer → testimonials | ACTIVE (CMS renderer) |
| FAQRenderer | SectionRenderer → faq | ACTIVE (CMS renderer) |
| StatsRenderer | SectionRenderer → stats | ACTIVE (CMS renderer) |
| ProcessRenderer | SectionRenderer → process | ACTIVE (CMS renderer) |
| TextImageRenderer | SectionRenderer → text-image | ACTIVE (CMS renderer) |
| CTARenderer | SectionRenderer → cta | ACTIVE (CMS renderer) |

**No orphaned components.** All components are either used in fallbacks or CMS renderers.

## 13.5.5 Deleted Files/Components

NONE. All components are actively used.

## 13.5.6 Intentionally Retained Components

All 7 fallback components (Hero, BrandStatement, ServiceSection, FeaturedWork, StatsSection, TestimonialSection, CTASection) are retained as production fallback content.

All 11 CMS section renderers are retained as the CMS rendering pipeline.

## 13.5.7 Remaining Migration Debt

1. CMS sections need images added via Page Builder
2. CMS sections need array data (services, items, stats, steps, testimonials) filled via Page Builder
3. About needs 3 additional CMS sections created (Cinematic Break, What Fiesta Believes, People Behind Fiesta)
4. Services needs 6 additional CMS sections created
5. HowWeWork needs 2 additional CMS sections created
6. CTA typos need fixing ("Lets" → "Let's")
7. After all above, hardcoded fallbacks can be removed
