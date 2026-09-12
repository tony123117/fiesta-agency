// ── Reusable Block Patterns ──
// Pre-defined block layouts that create independent copies.
// Each pattern returns fresh Block instances with unique IDs.
// Editing a created pattern does NOT modify the original.

import type { Block, BlockType } from '@/lib/blockTypes';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeBlock(type: BlockType, content: Record<string, unknown>, sort_order: number): Block {
  return {
    id: uid(),
    type,
    content,
    sort_order,
    responsive: {
      desktop: { visible: true },
      tablet: {},
      mobile: {},
    },
  };
}

// ── Pattern Definition ──

export interface BlockPattern {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'editorial' | 'features' | 'social' | 'gallery' | 'conversion';
  blocks: () => Block[];
}

// ── Pattern Registry ──

export const BLOCK_PATTERNS: BlockPattern[] = [
  {
    id: 'hero-cta',
    name: 'Hero + CTA',
    description: 'Large heading with supporting text and a call-to-action button.',
    category: 'hero',
    blocks: () => [
      makeBlock('spacer', { height: 32 }, 0),
      makeBlock('heading', {
        text: 'Your Headline Here',
        level: 1,
        alignment: 'center',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('text', {
        html: '<p>A compelling subheadline that explains your value proposition and draws the reader in.</p>',
        alignment: 'center',
        color: '',
        width: '2/3',
        spacing: 'md',
      }, 2),
      makeBlock('button', {
        text: 'Get Started',
        url: '/contact',
        variant: 'primary',
        size: 'lg',
        alignment: 'center',
        openNewTab: false,
        icon: '',
        spacing: 'lg',
      }, 3),
      makeBlock('spacer', { height: 32 }, 4),
    ],
  },

  {
    id: 'two-column-editorial',
    name: 'Two Column Editorial',
    description: 'Side-by-side image and text for storytelling layouts.',
    category: 'editorial',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('heading', {
        text: 'Our Story',
        level: 2,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('text', {
        html: '<p>Share the narrative behind your brand. This two-column layout pairs a striking image with your editorial copy for maximum impact.</p>',
        alignment: 'left',
        color: '',
        width: '1/2',
        spacing: 'md',
      }, 2),
      makeBlock('image', {
        src: '',
        alt: 'Editorial image',
        caption: '',
        width: '1/2',
        alignment: 'right',
        borderRadius: 0,
        aspectRatio: '4:3',
        focalPoint: null,
        link: '',
        spacing: 'md',
      }, 3),
      makeBlock('spacer', { height: 24 }, 4),
    ],
  },

  {
    id: 'image-text',
    name: 'Image + Text',
    description: 'Full-width image above a text block with heading.',
    category: 'editorial',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('image', {
        src: '',
        alt: 'Feature image',
        caption: '',
        width: 'full',
        alignment: 'center',
        borderRadius: 0,
        aspectRatio: '16:9',
        focalPoint: null,
        link: '',
        spacing: 'sm',
      }, 1),
      makeBlock('heading', {
        text: 'Image Feature',
        level: 3,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'xs',
      }, 2),
      makeBlock('text', {
        html: '<p>Describe this image and its significance. Use this pattern for visual storytelling where the image leads the narrative.</p>',
        alignment: 'left',
        color: '',
        width: '2/3',
        spacing: 'md',
      }, 3),
      makeBlock('spacer', { height: 24 }, 4),
    ],
  },

  {
    id: 'three-column-features',
    name: 'Three Column Features',
    description: 'Three feature blocks with headings and descriptions.',
    category: 'features',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('heading', {
        text: 'What We Offer',
        level: 2,
        alignment: 'center',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('heading', {
        text: 'Feature One',
        level: 4,
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'xs',
      }, 2),
      makeBlock('text', {
        html: '<p>Describe your first key feature. Keep it concise and focused on the benefit to the user.</p>',
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 3),
      makeBlock('heading', {
        text: 'Feature Two',
        level: 4,
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'xs',
      }, 4),
      makeBlock('text', {
        html: '<p>Describe your second key feature. Highlight what makes it different from the competition.</p>',
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 5),
      makeBlock('heading', {
        text: 'Feature Three',
        level: 4,
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'xs',
      }, 6),
      makeBlock('text', {
        html: '<p>Describe your third key feature. Focus on the outcome or result the user will achieve.</p>',
        alignment: 'center',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 7),
      makeBlock('spacer', { height: 24 }, 8),
    ],
  },

  {
    id: 'testimonial-grid',
    name: 'Testimonial Grid',
    description: 'Heading with a grid of client testimonial quotes.',
    category: 'social',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('heading', {
        text: 'What Our Clients Say',
        level: 2,
        alignment: 'center',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('text', {
        html: '<blockquote><p>"An exceptional experience from start to finish. They understood our vision and delivered beyond expectations."</p><footer>— Client Name, Company</footer></blockquote>',
        alignment: 'left',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 2),
      makeBlock('text', {
        html: '<blockquote><p>"Professional, creative, and detail-oriented. The results speak for themselves."</p><footer>— Client Name, Company</footer></blockquote>',
        alignment: 'left',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 3),
      makeBlock('text', {
        html: '<blockquote><p>"A true partner in our growth. Their work has transformed how our clients perceive us."</p><footer>— Client Name, Company</footer></blockquote>',
        alignment: 'left',
        color: '',
        width: '1/3',
        spacing: 'md',
      }, 4),
      makeBlock('spacer', { height: 24 }, 5),
    ],
  },

  {
    id: 'editorial-list',
    name: 'Editorial List',
    description: 'Numbered or bulleted list of items with headings and descriptions.',
    category: 'editorial',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('heading', {
        text: 'Our Process',
        level: 2,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('heading', {
        text: '01 — Discovery',
        level: 4,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'xs',
      }, 2),
      makeBlock('text', {
        html: '<p>We begin by understanding your goals, audience, and competitive landscape to inform our strategy.</p>',
        alignment: 'left',
        color: '',
        width: '2/3',
        spacing: 'md',
      }, 3),
      makeBlock('heading', {
        text: '02 — Design',
        level: 4,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'xs',
      }, 4),
      makeBlock('text', {
        html: '<p>Our team creates visual concepts and prototypes that bring your brand story to life.</p>',
        alignment: 'left',
        color: '',
        width: '2/3',
        spacing: 'md',
      }, 5),
      makeBlock('heading', {
        text: '03 — Deliver',
        level: 4,
        alignment: 'left',
        color: '',
        width: 'full',
        spacing: 'xs',
      }, 6),
      makeBlock('text', {
        html: '<p>We launch with precision and provide ongoing support to ensure lasting success.</p>',
        alignment: 'left',
        color: '',
        width: '2/3',
        spacing: 'md',
      }, 7),
      makeBlock('spacer', { height: 24 }, 8),
    ],
  },

  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Grid of images with captions for portfolio or showcase layouts.',
    category: 'gallery',
    blocks: () => [
      makeBlock('spacer', { height: 24 }, 0),
      makeBlock('heading', {
        text: 'Gallery',
        level: 2,
        alignment: 'center',
        color: '',
        width: 'full',
        spacing: 'sm',
      }, 1),
      makeBlock('image', {
        src: '',
        alt: 'Gallery image 1',
        caption: 'Image caption',
        width: '1/2',
        alignment: 'left',
        borderRadius: 0,
        aspectRatio: '4:3',
        focalPoint: null,
        link: '',
        spacing: 'sm',
      }, 2),
      makeBlock('image', {
        src: '',
        alt: 'Gallery image 2',
        caption: 'Image caption',
        width: '1/2',
        alignment: 'right',
        borderRadius: 0,
        aspectRatio: '4:3',
        focalPoint: null,
        link: '',
        spacing: 'sm',
      }, 3),
      makeBlock('image', {
        src: '',
        alt: 'Gallery image 3',
        caption: 'Image caption',
        width: '1/2',
        alignment: 'left',
        borderRadius: 0,
        aspectRatio: '4:3',
        focalPoint: null,
        link: '',
        spacing: 'sm',
      }, 4),
      makeBlock('image', {
        src: '',
        alt: 'Gallery image 4',
        caption: 'Image caption',
        width: '1/2',
        alignment: 'right',
        borderRadius: 0,
        aspectRatio: '4:3',
        focalPoint: null,
        link: '',
        spacing: 'sm',
      }, 5),
      makeBlock('spacer', { height: 24 }, 6),
    ],
  },

  {
    id: 'statement-cta',
    name: 'Statement + CTA',
    description: 'Bold statement text with a call-to-action button below.',
    category: 'conversion',
    blocks: () => [
      makeBlock('spacer', { height: 32 }, 0),
      makeBlock('heading', {
        text: 'Ready to Get Started?',
        level: 2,
        alignment: 'center',
        color: '',
        width: '2/3',
        spacing: 'sm',
      }, 1),
      makeBlock('text', {
        html: '<p>Let\'s create something extraordinary together. Reach out today and let\'s start the conversation.</p>',
        alignment: 'center',
        color: '',
        width: '1/2',
        spacing: 'md',
      }, 2),
      makeBlock('button', {
        text: 'Contact Us',
        url: '/contact',
        variant: 'primary',
        size: 'lg',
        alignment: 'center',
        openNewTab: false,
        icon: '',
        spacing: 'lg',
      }, 3),
      makeBlock('spacer', { height: 32 }, 4),
    ],
  },
];

// ── Helpers ──

export function getPatternById(id: string): BlockPattern | undefined {
  return BLOCK_PATTERNS.find((p) => p.id === id);
}

export function getPatternsByCategory(category: BlockPattern['category']): BlockPattern[] {
  return BLOCK_PATTERNS.filter((p) => p.category === category);
}

/** Create independent copies of a pattern's blocks with fresh IDs. */
export function instantiatePattern(pattern: BlockPattern): Block[] {
  return pattern.blocks().map((block, i) => ({
    ...block,
    id: uid(),
    sort_order: i,
    content: { ...block.content },
    responsive: {
      desktop: { ...block.responsive.desktop },
      tablet: { ...block.responsive.tablet },
      mobile: { ...block.responsive.mobile },
    },
  }));
}
