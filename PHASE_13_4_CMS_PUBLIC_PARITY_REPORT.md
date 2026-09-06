# Phase 13.4 — CMS/Public Visual & Functional Parity

## 13.4.1 CMS Content Audit

### Seeded Sections (25 total)

| Page | Sections | Published | Images Populated | Arrays Populated | Content Quality |
|------|----------|-----------|-----------------|------------------|-----------------|
| Home | 7 | All true | 0/7 (all empty strings) | 0/5 arrays (services, items, stats, testimonials empty) | Headings/descriptions are real copy, not placeholder |
| About | 8 | All true | 0/8 (all empty strings) | 0/3 arrays (steps, stats, testimonials empty) | Headings/descriptions are real copy |
| Services | 5 | All true | 0/5 (all empty strings) | 0/2 arrays (services, steps empty) | Headings/descriptions are real copy |
| HowWeWork | 5 | All true | 0/5 (all empty strings) | 0/2 arrays (steps, services empty) | Headings/descriptions are real copy |

### Content Gaps (CMS vs Hardcoded)

**Home (7 CMS vs 7 hardcoded):**
- Hero: CMS has empty image, hardcoded has cinematic photo
- Services: CMS `services: []`, hardcoded fetches from Supabase `services` table
- Featured Work: CMS `items: []`, hardcoded fetches from Supabase `portfolio_projects` table
- Stats: CMS `stats: []`, hardcoded has inline stats data
- Testimonials: CMS `testimonials: []`, hardcoded fetches from Supabase `testimonials` table

**About (8 CMS vs 8 hardcoded):**
- Hero: CMS has empty image, hardcoded has cinematic photo
- Missing CMS sections: Cinematic Image Break, What Fiesta Believes, People Behind Fiesta
- Mission/Vision: CMS uses text-image (no images), hardcoded has editorial two-column layout with images
- Process/Approach: CMS `steps: []`, hardcoded has 4-stage horizontal progression with images
- Stats/Values: CMS `stats: []`, hardcoded has 5 editorial principles

**Services (5 CMS vs 11 hardcoded):**
- Missing CMS sections: Intro/Philosophy, Weddings, Corporate, Celebrations, Production, Carousel, Why Fiesta, Final Statement
- CMS has only hero + services + process + testimonials + cta
- Hardcoded has 11 sections with full editorial content, images, carousels

**HowWeWork (5 CMS vs 7 hardcoded):**
- Missing CMS sections: Visual Transition, Behind the Scenes
- CMS process `steps: []`, hardcoded has 5 detailed stages with images
- CMS services `services: []`, hardcoded has 8-item differentiator list

### Typos in CMS Content
| Location | Current | Correct |
|----------|---------|---------|
| Home CTA heading | "Let Create Something Together" | "Let's Create Something Together" |
| About CTA heading | "Lets Connect" | "Let's Connect" |
| Services CTA heading | "Lets Discuss Your Project" | "Let's Discuss Your Project" |
| HowWeWork CTA heading | "Lets Create Your Event" | "Let's Create Your Event" |
| About Mission body | "To turn clients ideas" | "To turn clients' ideas" |

## 13.4.2 CMS vs Original Public Design Comparison

**Verdict: CMS sections are SCAFFOLD, not production content.**

The CMS sections define the section TYPE and ORDER but lack:
- All images (empty strings)
- All dynamic data (services, items, stats, steps, testimonials arrays)
- 3 sections on About (Cinematic Break, What Fiesta Believes, People)
- 6 sections on Services (Intro, Weddings, Corporate, Celebrations, Production, Carousel, Why Fiesta, Final Statement)
- 2 sections on HowWeWork (Visual Transition, BTS)

The hardcoded fallbacks contain the actual production content with:
- Real photography (Unsplash URLs)
- Complete editorial copy
- Responsive layouts
- Scroll-reveal animations
- Full visual hierarchy

## 13.4.3 Browser Testing

NOT BROWSER VERIFIED — requires manual testing at 375px, 768px, 1024px, 1440px.

TypeScript compilation: PASS
Build: PASS

## 13.4.4 Live CMS Changes

NOT BROWSER VERIFIED — requires manual testing of edit → save → publish → public verify workflow.

## 13.4.5 Focal Point Verification

NOT BROWSER VERIFIED — requires manual testing of focal point drag → save → reload → public crop verification.

## 13.4.6 Draft/Publish Test

Architecture verified via code inspection:
- PageRenderer checks `page.published` before fetching sections
- Sections filtered by `s.published`
- Unpublished pages → `onHasContent(false)` → fallback shows
- Unpublished sections → filtered out by `secs.filter((s) => s.published)`

NOT BROWSER VERIFIED — requires manual testing.

## 13.4.7 Parity Matrix

| Page | CMS Sections | Original Sections | Content | Visual | Responsive | CMS Source of Truth |
|------|-------------|-------------------|---------|--------|------------|---------------------|
| Home | 7 | 7 | PARTIAL (arrays empty) | PARTIAL (no images) | N/A (not browser tested) | YES (but incomplete) |
| About | 8 | 8 | PARTIAL (3 sections missing from CMS equivalent, arrays empty) | PARTIAL (no images) | N/A | YES (but incomplete) |
| Services | 5 | 11 | PARTIAL (6 sections missing, arrays empty) | PARTIAL (no images) | N/A | YES (but incomplete) |
| HowWeWork | 5 | 7 | PARTIAL (2 sections missing, arrays empty) | PARTIAL (no images) | N/A | YES (but incomplete) |

**Key Finding:** CMS defines the correct section TYPES and ORDER for each page, but the content is scaffold. The hardcoded fallbacks ARE the production content. Both paths must remain until the admin fills in CMS content via the Page Builder.
