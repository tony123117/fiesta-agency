# SECTION-SYSTEM.md — Fiesta Agency

## Overview

The section system is the heart of the CMS. Each page is composed of ordered sections, each of a specific type. The `section_type` determines which React component renders the section.

---

## How It Works

```
1. Section has a section_type (e.g., "hero-carousel")
2. SectionRenderer maps type → component (e.g., HeroCarousel)
3. Component receives section.content as props
4. Component renders with fallback defaults for missing fields
```

---

## Section Renderer

`src/components/public/SectionRenderer.tsx` is the central dispatcher:

```typescript
case 'hero-carousel': return <HeroCarousel {...props} />;
case 'brand-statement': return <CMSBrandStatement {...props} />;
case 'services-editorial': return <ServicesRenderer {...props} />;
// ... 50 total mappings
default: return <BlocksSectionRenderer {...props} />;
```

---

## All 50 Section Types

| Section Type | Component | Purpose |
|-------------|-----------|---------|
| `hero-carousel` | HeroCarousel | Multi-slide hero with media |
| `brand-statement` | CMSBrandStatement | Agency tagline with media |
| `services-editorial` | ServicesRenderer | Editorial service showcase |
| `services-hero` | ServicesHero | Services page hero |
| `services-featured` | ServicesFeatured | Featured services |
| `services-cards` | ServicesCards | Service card grid |
| `services-process` | ServicesProcess | Service process steps |
| `services-cta` | ServicesCTA | Services call-to-action |
| `events-editorial` | EventsRenderer | Editorial event showcase |
| `events-hero` | EventsHero | Events page hero |
| `events-filter` | EventsFilter | Category filter |
| `events-featured` | EventsFeatured | Featured event |
| `events-upcoming` | EventsUpcoming | Upcoming events list |
| `events-past` | EventsPast | Past events list |
| `events-cta` | EventsCTA | Events call-to-action |
| `portfolio-gallery` | PortfolioRenderer | Portfolio gallery |
| `portfolio-hero` | PortfolioHero | Portfolio page hero |
| `portfolio-filtered-gallery` | PortfolioFilteredGallery | Filtered portfolio |
| `portfolio-featured` | PortfolioFeatured | Featured projects |
| `portfolio-cta` | PortfolioCTA | Portfolio call-to-action |
| `contact-hero` | ContactHero | Contact page hero |
| `contact-info` | ContactInfo | Contact form and info |
| `contact-location` | ContactLocation | Location display |
| `contact-cta` | ContactCTA | Contact call-to-action |
| `hww-hero` | HWWHero | How We Work hero |
| `hww-intro` | HWWIntro | How We Work intro |
| `hww-process` | HWWProcess | Process timeline |
| `hww-behind` | HWWBehind | Behind the scenes |
| `hww-why` | HWWWhy | Why choose us |
| `hww-cta` | HWWCTA | How We Work CTA |
| `about-intro` | AboutIntro | About intro |
| `about-story` | AboutStory | Agency story |
| `about-mission` | AboutMission | Mission statement |
| `about-values` | AboutValues | Core values |
| `about-team` | AboutTeam | Team members |
| `about-closing` | AboutClosing | About closing |
| `testimonials` | TestimonialsRenderer | Client quotes |
| `stats` | StatsRenderer | Statistics display |
| `process` | ProcessRenderer | Process timeline |
| `cta` | CTARenderer | Call-to-action |
| `faq` | FAQRenderer | FAQ accordion |
| `text-image` | TextImageRenderer | Text with image |
| `editorial-list` | EditorialListRenderer | Editorial list |
| `cinematic-image` | CinematicImageRenderer | Full-width image |
| `team-members` | TeamMembersRenderer | Team grid |
| `image-carousel` | ImageCarouselRenderer | Image carousel |
| `blocks` | BlocksSectionRenderer | Freeform block editor |
| `layout` | LayoutRenderer | Container/Row/Column |
| `legal-page` | LegalPageRenderer | Legal content |

---

## Section Content Structure

Each section type defines its own content structure in `sectionTypes.ts`. The structure determines what fields the admin editor shows and what data the public renderer receives.

---

## Block Types (within `blocks` section)

The `blocks` section type supports freeform content blocks:

| Block Type | Purpose |
|-----------|---------|
| `heading` | H1-H6 heading |
| `paragraph` | Text paragraph |
| `image` | Image with alt text |
| `video` | Video embed |
| `quote` | Blockquote |
| `list` | Ordered/unordered list |
| `code` | Code block |
| `divider` | Horizontal rule |
| `columns` | Multi-column layout |
| `spacer` | Vertical spacing |

---

## Layout System

The `layout` section type provides structural containers:

| Layout Type | Purpose |
|------------|---------|
| `container` | Max-width wrapper |
| `row` | Horizontal flex container |
| `column` | Vertical flex column |
| `grid` | CSS Grid layout |
| `split` | Two-column split |
| `hero` | Hero-style full-width |
| `section` | Section wrapper with padding |
| `card` | Card container |
| `stack` | Vertical stack with gap |

---

## See Also

- [CMS-DOCUMENTATION.md](./CMS-DOCUMENTATION.md)
- [CONTENT-MODEL.md](./CONTENT-MODEL.md)
- [COMPONENT-DOCUMENTATION.md](./COMPONENT-DOCUMENTATION.md)
