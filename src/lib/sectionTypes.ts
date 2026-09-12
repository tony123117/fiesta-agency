import type { SectionType, SectionContentMap } from '@/lib/types';
import {
  DEMO_HERO, DEMO_BRAND_STATEMENT, DEMO_SERVICES, DEMO_EVENTS,
  DEMO_PORTFOLIO, DEMO_TESTIMONIALS, DEMO_FAQ, DEMO_STATS,
  DEMO_PROCESS, DEMO_TEXT_IMAGE, DEMO_CTA,
  DEMO_EDITORIAL_LIST, DEMO_CINEMATIC_IMAGE, DEMO_TEAM_MEMBERS, DEMO_IMAGE_CAROUSEL,
} from '@/demo/sectionPreviews';

export interface SectionVariant {
  id: string;
  label: string;
  description: string;
}

export interface SectionTypeConfig {
  type: SectionType;
  label: string;
  description: string;
  group: 'featured' | 'content' | 'conversion';
  icon: string;
  variants: SectionVariant[];
  defaultVariant: string;
  defaultContent: SectionContentMap[SectionType];
  previewContent: SectionContentMap[SectionType];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const SECTION_TYPES: SectionTypeConfig[] = [
  {
    type: 'hero-carousel',
    label: 'Hero Carousel',
    description: 'Large visual introduction with slides',
    group: 'featured',
    icon: 'Image',
    variants: [
      { id: 'default', label: 'Full Width', description: 'Full-viewport hero with background images' },
    ],
    defaultVariant: 'default',
    defaultContent: {
      slides: [{
        id: uid(), image: '', mobile_image: null, image_alt: '', eyebrow: '', headline: '', highlight_word: '',
        description: '', cta_text: '', cta_url: '', secondary_cta_text: '',
        secondary_cta_url: '', focal_x: 0.5, focal_y: 0.5,
      }],
    },
    previewContent: DEMO_HERO,
  },
  {
    type: 'brand-statement',
    label: 'Brand Statement',
    description: 'Large editorial statement',
    group: 'featured',
    icon: 'Quote',
    variants: [
      { id: 'default', label: 'Editorial', description: 'Left-aligned editorial typography' },
      { id: 'centered', label: 'Centered', description: 'Centered with larger type' },
    ],
    defaultVariant: 'default',
    defaultContent: {
      eyebrow: '', primary_text: '', highlighted_text: '', description: '',
      metadata: '', accent_word: '', variant: 'default',
    },
    previewContent: DEMO_BRAND_STATEMENT,
  },
  {
    type: 'services-editorial',
    label: 'Services',
    description: 'Service showcase with images',
    group: 'content',
    icon: 'Briefcase',
    variants: [
      { id: 'default', label: 'Grid', description: '3-column card grid with images' },
      { id: 'compact', label: 'Compact', description: 'Dense grid with minimal spacing' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', description: '', services: [], variant: 'default' },
    previewContent: DEMO_SERVICES,
  },
  {
    type: 'events-editorial',
    label: 'Events',
    description: 'Featured events from the Events CMS',
    group: 'content',
    icon: 'Calendar',
    variants: [
      { id: 'default', label: 'Grid', description: '3-column event cards' },
      { id: 'minimal', label: 'Minimal', description: 'Clean list layout' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', description: '', limit: 3, featured_only: false, upcoming_only: false, variant: 'default' },
    previewContent: DEMO_EVENTS,
  },
  {
    type: 'portfolio-gallery',
    label: 'Portfolio Gallery',
    description: 'Project gallery with images',
    group: 'content',
    icon: 'LayoutGrid',
    variants: [
      { id: 'grid', label: 'Grid', description: 'Uniform grid layout' },
      { id: 'masonry', label: 'Masonry', description: 'Staggered asymmetric layout' },
      { id: 'asymmetric', label: 'Asymmetric', description: 'Editorial 12-col asymmetric layout' },
    ],
    defaultVariant: 'grid',
    defaultContent: { heading: '', description: '', items: [], variant: 'grid' },
    previewContent: DEMO_PORTFOLIO,
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Client quotes and reviews',
    group: 'content',
    icon: 'MessageSquare',
    variants: [
      { id: 'default', label: 'Grid', description: '2-column quote grid' },
      { id: 'carousel', label: 'Carousel', description: 'Single quote carousel' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', description: '', testimonials: [], variant: 'default' },
    previewContent: DEMO_TESTIMONIALS,
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions',
    group: 'content',
    icon: 'HelpCircle',
    variants: [
      { id: 'default', label: 'Accordion', description: 'Expandable question rows' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', description: '', items: [] },
    previewContent: DEMO_FAQ,
  },
  {
    type: 'stats',
    label: 'Stats',
    description: 'Animated number counters',
    group: 'content',
    icon: 'BarChart3',
    variants: [
      { id: 'default', label: 'Grid', description: '4-column stat counters' },
      { id: 'compact', label: 'Compact', description: 'Smaller condensed layout' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', stats: [], variant: 'default' },
    previewContent: DEMO_STATS,
  },
  {
    type: 'process',
    label: 'Process',
    description: 'Step-by-step process showcase',
    group: 'content',
    icon: 'ListOrdered',
    variants: [
      { id: 'default', label: 'Steps', description: 'Numbered steps grid' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: '', description: '', steps: [] },
    previewContent: DEMO_PROCESS,
  },
  {
    type: 'text-image',
    label: 'Text + Image',
    description: 'Text content with image',
    group: 'content',
    icon: 'Columns',
    variants: [
      { id: 'default', label: 'Split', description: 'Text and image side by side' },
      { id: 'split', label: 'Image Left', description: 'Image on left, text on right' },
      { id: 'centered', label: 'Centered', description: 'Centered editorial statement without image' },
    ],
    defaultVariant: 'default',
    defaultContent: { eyebrow: '', heading: '', body: '', image: '', image_alt: '', image_position: 'right', cta_text: '', cta_url: '', variant: 'default' },
    previewContent: DEMO_TEXT_IMAGE,
  },
  {
    type: 'cta',
    label: 'CTA',
    description: 'Call to action / booking',
    group: 'conversion',
    icon: 'MousePointerClick',
    variants: [
      { id: 'default', label: 'Default', description: 'Centered with background image' },
      { id: 'full-width', label: 'Full Width', description: 'Full-bleed background' },
      { id: 'minimal', label: 'Minimal', description: 'Clean text-only layout' },
    ],
    defaultVariant: 'default',
    defaultContent: { eyebrow: '', heading: '', description: '', button_text: '', button_url: '', secondary_button_text: '', secondary_button_url: '', background_image: '', variant: 'default' },
    previewContent: DEMO_CTA,
  },
  {
    type: 'editorial-list',
    label: 'Editorial List',
    description: 'Numbered editorial items with titles and descriptions',
    group: 'content',
    icon: 'ListOrdered',
    variants: [
      { id: 'default', label: 'Default', description: 'Numbered vertical list with 12-col grid layout' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: null, description: null, items: [] },
    previewContent: DEMO_EDITORIAL_LIST,
  },
  {
    type: 'cinematic-image',
    label: 'Cinematic Image',
    description: 'Full-width cinematic image with caption overlay',
    group: 'featured',
    icon: 'Film',
    variants: [
      { id: 'default', label: 'Default', description: 'Full-bleed cinematic image with gradient overlay' },
    ],
    defaultVariant: 'default',
    defaultContent: { image: '', mobile_image: null, image_alt: null, focal_x: 0.5, focal_y: 0.5, caption: null, caption_alignment: 'left' },
    previewContent: DEMO_CINEMATIC_IMAGE,
  },
  {
    type: 'team-members',
    label: 'Team Members',
    description: 'Interactive team showcase with featured image',
    group: 'content',
    icon: 'Users',
    variants: [
      { id: 'default', label: 'Default', description: 'Featured image with interactive member list' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: null, members: [] },
    previewContent: DEMO_TEAM_MEMBERS,
  },
  {
    type: 'image-carousel',
    label: 'Image Carousel',
    description: 'Horizontal scrolling image carousel',
    group: 'content',
    icon: 'GalleryHorizontal',
    variants: [
      { id: 'default', label: 'Default', description: 'Horizontal scroll with snap and navigation' },
    ],
    defaultVariant: 'default',
    defaultContent: { heading: null, description: null, images: [] },
    previewContent: DEMO_IMAGE_CAROUSEL,
  },
  {
    type: 'blocks',
    label: 'Blocks',
    description: 'Visual block editor — heading, text, image, button, spacer',
    group: 'content',
    icon: 'LayoutTemplate',
    variants: [
      { id: 'default', label: 'Default', description: '自由布局 block editor' },
    ],
    defaultVariant: 'default',
    defaultContent: { blocks: [] },
    previewContent: { blocks: [] },
  },
  {
    type: 'services-hero',
    label: 'Services Hero',
    description: 'Large heading with split layout',
    group: 'featured',
    icon: 'Image',
    variants: [{ id: 'default', label: 'Default', description: 'Two-column hero with heading and description' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'OUR SERVICES', heading: "EVERY DETAIL\nCRAFTED TO\nPERFECTION.", description: '' },
    previewContent: { eyebrow: 'OUR SERVICES', heading: "EVERY DETAIL\nCRAFTED TO\nPERFECTION.", description: 'From concept to execution, we offer end-to-end event solutions.' },
  },
  {
    type: 'services-featured',
    label: 'Featured Services',
    description: 'Three flagship service cards',
    group: 'featured',
    icon: 'Star',
    variants: [{ id: 'default', label: 'Default', description: 'Three-column editorial cards' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'WHAT WE DO', heading: "EVENTS\nCRAFTED WITH\nINTENTION.", services: [] },
    previewContent: { eyebrow: 'WHAT WE DO', heading: "EVENTS\nCRAFTED WITH\nINTENTION.", services: [{ id: '1', title: 'EVENT PLANNING', description: 'Full-service event planning.', image: '' }, { id: '2', title: 'CONCERTS &\nLIVE SHOWS', description: 'End-to-end production.', image: '' }, { id: '3', title: 'WEDDINGS &\nCELEBRATIONS', description: 'Beautifully curated celebrations.', image: '' }] },
  },
  {
    type: 'services-directory',
    label: 'Service Directory',
    description: 'Complete service list in two columns',
    group: 'content',
    icon: 'List',
    variants: [{ id: 'default', label: 'Default', description: 'Two-column service rows' }],
    defaultVariant: 'default',
    defaultContent: { heading: '', services: [] },
    previewContent: { heading: '', services: [{ id: '1', number: '04', title: 'CORPORATE EVENTS' }, { id: '2', number: '05', title: 'PRIVATE EVENTS & PARTIES' }, { id: '3', number: '10', title: 'PHOTOGRAPHY & VIDEOGRAPHY' }] },
  },
  {
    type: 'services-philosophy',
    label: 'Service Philosophy',
    description: 'Editorial service explanation',
    group: 'content',
    icon: 'Quote',
    variants: [{ id: 'default', label: 'Default', description: 'Split layout with gold rule' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'THE FIESTA STANDARD', heading: "EVERY EVENT\nDESERVES ITS\nOWN STORY.", body: '' },
    previewContent: { eyebrow: 'THE FIESTA STANDARD', heading: "EVERY EVENT\nDESERVES ITS\nOWN STORY.", body: "We don't believe in copying the same event twice." },
  },
  {
    type: 'services-process',
    label: 'Services Process',
    description: 'Five-stage process flow',
    group: 'content',
    icon: 'GitBranch',
    variants: [{ id: 'default', label: 'Default', description: 'Horizontal/vertical process steps' }],
    defaultVariant: 'default',
    defaultContent: { heading: '', steps: [] },
    previewContent: { heading: '', steps: [{ id: '1', number: '01', title: 'IDEA', description: 'We listen to your vision.' }, { id: '2', number: '02', title: 'CREATIVE', description: 'We develop creative direction.' }, { id: '3', number: '03', title: 'PLANNING', description: 'Every detail is mapped out.' }, { id: '4', number: '04', title: 'PRODUCTION', description: 'We execute with expertise.' }, { id: '5', number: '05', title: 'DELIVERY', description: 'The final experience.' }] },
  },
  {
    type: 'services-image-statement',
    label: 'Image Statement',
    description: 'Full-width image with centered text',
    group: 'featured',
    icon: 'Image',
    variants: [{ id: 'default', label: 'Default', description: 'Cinematic image with overlay text' }],
    defaultVariant: 'default',
    defaultContent: { heading: "WE TAKE CARE\nOF THE DETAILS.", description: '', image: '' },
    previewContent: { heading: "WE TAKE CARE\nOF THE DETAILS.", description: '', image: '' },
  },
  {
    type: 'services-cta',
    label: 'Services CTA',
    description: 'Final call to action',
    group: 'conversion',
    icon: 'ArrowRight',
    variants: [{ id: 'default', label: 'Default', description: 'Full-width image with CTA' }],
    defaultVariant: 'default',
    defaultContent: { heading: "TELL US WHAT\nYOU'RE IMAGINING.", button_text: 'GET IN TOUCH', button_url: '/contact', background_image: '' },
    previewContent: { heading: "TELL US WHAT\nYOU'RE IMAGINING.", button_text: 'GET IN TOUCH', button_url: '/contact', background_image: '' },
  },
  {
    type: 'about-intro',
    label: 'About Intro',
    description: 'White intro with MVV editorial blocks and team portraits',
    group: 'featured',
    icon: 'Image',
    variants: [{ id: 'default', label: 'Default', description: 'White bg, intro+MVV+team' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'ABOUT FIESTA', heading: "WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.", body: '', image: '', image_alt: '', mission: {}, vision: {}, values_intro: {}, team_eyebrow: 'OUR TEAM', team_members: [] },
    previewContent: { eyebrow: 'ABOUT FIESTA', heading: "WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.", body: '', image: '', image_alt: '', mission: { title: 'OUR MISSION', description: 'We turn ideas into well-crafted experiences.' }, vision: { title: 'OUR VISION', description: 'Building a trusted and creative event company.' }, values_intro: { title: 'OUR VALUES', description: 'Creativity. Excellence. Integrity. Passion. Teamwork.' }, team_eyebrow: 'OUR TEAM', team_members: [] },
  },
  {
    type: 'about-story',
    label: 'About Story',
    description: 'Cream editorial story section',
    group: 'content',
    icon: 'BookOpen',
    variants: [{ id: 'default', label: 'Default', description: 'Cream bg, 42/50 split' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'OUR STORY', heading: 'BUILT ON PASSION.\nDRIVEN BY PURPOSE.', body: '', image: '', image_alt: '' },
    previewContent: { eyebrow: 'OUR STORY', heading: 'BUILT ON PASSION.\nDRIVEN BY PURPOSE.', body: 'Founded with a vision to transform the event landscape.', image: '', image_alt: '' },
  },
  {
    type: 'about-foundation',
    label: 'About Foundation',
    description: 'Centered editorial statement',
    group: 'content',
    icon: 'Quote',
    variants: [{ id: 'default', label: 'Default', description: 'White bg, centered editorial' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'WHAT DRIVES US', heading: 'WE TURN IDEAS\nINTO MEMORABLE\nEXPERIENCES.', body: '' },
    previewContent: { eyebrow: 'WHAT DRIVES US', heading: 'WE TURN IDEAS\nINTO MEMORABLE\nEXPERIENCES.', body: 'Fiesta takes an initial idea and develops it into a cohesive experience.' },
  },
  {
    type: 'about-values',
    label: 'About Values',
    description: 'Dark values list with atmospheric image',
    group: 'content',
    icon: 'Heart',
    variants: [{ id: 'default', label: 'Default', description: 'Dark bg, values list left, image right' }],
    defaultVariant: 'default',
    defaultContent: { eyebrow: 'OUR VALUES', heading: 'THE PRINCIPLES\nBEHIND THE\nEXPERIENCE.', values: [], image: '', image_alt: '' },
    previewContent: { eyebrow: 'OUR VALUES', heading: 'THE PRINCIPLES\nBEHIND THE\nEXPERIENCE.', values: [{ id: '1', name: 'CREATIVITY' }, { id: '2', name: 'PASSION' }, { id: '3', name: 'INTEGRITY' }], image: '', image_alt: '' },
  },
  {
    type: 'about-why',
    label: 'About Why',
    description: 'White split layout with editorial points',
    group: 'content',
    icon: 'Sparkles',
    variants: [{ id: 'default', label: 'Default', description: 'White bg, heading left, points right' }],
    defaultVariant: 'default',
    defaultContent: { heading: 'WHY FIESTA?', points: [] },
    previewContent: { heading: 'WHY FIESTA?', points: [{ id: '1', title: 'CREATIVE THINKING', description: 'We approach every event from its own story.' }, { id: '2', title: 'SEAMLESS EXECUTION', description: 'We coordinate the moving parts behind the scenes.' }, { id: '3', title: 'ATTENTION TO DETAIL', description: 'We care about the details guests may never notice.' }] },
  },
  {
    type: 'about-closing',
    label: 'About Closing',
    description: 'Compact cinematic CTA',
    group: 'conversion',
    icon: 'ArrowRight',
    variants: [{ id: 'default', label: 'Default', description: 'Full-width image, dark overlay, compact height' }],
    defaultVariant: 'default',
    defaultContent: { heading: 'YOUR VISION.\nOUR EXPERIENCE.', cta_text: "LET'S CREATE IT", cta_url: '/contact', background_image: '', background_image_alt: '' },
    previewContent: { heading: 'YOUR VISION.\nOUR EXPERIENCE.', cta_text: "LET'S CREATE IT", cta_url: '/contact', background_image: '', background_image_alt: '' },
  },
];

export function getSectionTypeConfig(type: SectionType): SectionTypeConfig {
  return SECTION_TYPES.find((s) => s.type === type) || SECTION_TYPES[0];
}

export function getSectionLabel(type: SectionType): string {
  return getSectionTypeConfig(type).label;
}

export function getDefaultContent<T extends SectionType>(type: T): SectionContentMap[T] {
  return { ...getSectionTypeConfig(type).defaultContent } as SectionContentMap[T];
}

export function getSectionVariants(type: SectionType): SectionVariant[] {
  return getSectionTypeConfig(type).variants;
}

export function getPreviewContent(type: SectionType): SectionContentMap[SectionType] {
  return { ...getSectionTypeConfig(type).previewContent };
}
