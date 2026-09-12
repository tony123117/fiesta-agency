/**
 * Adapter functions to convert About section content into blocks format.
 *
 * Each function takes the typed content of an About section and returns
 * an array of Block objects that can be rendered by BlocksSectionRenderer.
 *
 * The original about-* renderers remain as fallback — these adapters
 * allow gradual migration to the blocks system without losing visual design.
 */

import { createBlock } from '@/lib/blockTypes';
import type { Block, HeadingContent, TextContent, ImageContent, ButtonContent, SpacerContent } from '@/lib/blockTypes';

// ── AboutIntro ──

export function aboutIntroToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    eyebrow?: string;
    heading?: string;
    body?: string;
    image?: string;
    image_alt?: string;
    mission?: { icon?: string; title?: string; description?: string };
    vision?: { icon?: string; title?: string; description?: string };
    values_intro?: { icon?: string; title?: string; description?: string };
    team_eyebrow?: string;
    team_members?: Array<{ id: string; name: string; role: string; image?: string }>;
  };

  const blocks: Block[] = [];
  let order = 0;

  // Eyebrow
  if (data.eyebrow) {
    const b = createBlock('heading', order++);
    b.content = { text: data.eyebrow, level: 6, alignment: 'left', color: '#D6A54A', width: 'full', spacing: 'sm' } as HeadingContent;
    blocks.push(b);
  }

  // Heading
  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 1, alignment: 'left', color: '#151515', width: 'full', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  // Body
  if (data.body) {
    const b = createBlock('text', order++);
    b.content = { html: `<p>${data.body.replace(/\\n/g, '</p><p>')}</p>`, alignment: 'left', color: '#73706A', width: 'narrow', spacing: 'md' } as TextContent;
    blocks.push(b);
  }

  // Hero image
  if (data.image) {
    const b = createBlock('image', order++);
    b.content = { src: data.image, alt: data.image_alt || 'Luxury event experience', caption: '', width: 'full', alignment: 'center', borderRadius: 0, aspectRatio: 'auto', focalPoint: null, link: '', spacing: 'md' } as ImageContent;
    blocks.push(b);
  }

  // Spacer before MVV
  const spacer1 = createBlock('spacer', order++);
  spacer1.content = { height: 48 } as SpacerContent;
  blocks.push(spacer1);

  // Mission/Vision/Values as text blocks
  for (const item of [data.mission, data.vision, data.values_intro].filter(Boolean)) {
    if (item?.title) {
      const b = createBlock('heading', order++);
      b.content = { text: item.title, level: 3, alignment: 'left', color: '#151515', width: 'full', spacing: 'sm' } as HeadingContent;
      blocks.push(b);
    }
    if (item?.description) {
      const b = createBlock('text', order++);
      b.content = { html: `<p>${item.description}</p>`, alignment: 'left', color: '#73706A', width: 'full', spacing: 'md' } as TextContent;
      blocks.push(b);
    }
  }

  return blocks;
}

// ── AboutStory ──

export function aboutStoryToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    eyebrow?: string;
    heading?: string;
    body?: string;
    image?: string;
    image_alt?: string;
  };

  const blocks: Block[] = [];
  let order = 0;

  if (data.eyebrow) {
    const b = createBlock('heading', order++);
    b.content = { text: data.eyebrow, level: 6, alignment: 'left', color: '#B88A32', width: 'full', spacing: 'sm' } as HeadingContent;
    blocks.push(b);
  }

  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 2, alignment: 'left', color: '#151515', width: 'narrow', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  if (data.body) {
    const paragraphs = data.body.replace(/\\n/g, '\n').split('\n\n');
    const b = createBlock('text', order++);
    b.content = { html: paragraphs.map((p) => `<p>${p}</p>`).join(''), alignment: 'left', color: '#73706A', width: 'narrow', spacing: 'md' } as TextContent;
    blocks.push(b);
  }

  if (data.image) {
    const b = createBlock('image', order++);
    b.content = { src: data.image, alt: data.image_alt || 'Event production', caption: '', width: 'full', alignment: 'center', borderRadius: 0, aspectRatio: '4/3', focalPoint: null, link: '', spacing: 'md' } as ImageContent;
    blocks.push(b);
  }

  return blocks;
}

// ── AboutFoundation ──

export function aboutFoundationToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    eyebrow?: string;
    heading?: string;
    body?: string;
  };

  const blocks: Block[] = [];
  let order = 0;

  if (data.eyebrow) {
    const b = createBlock('heading', order++);
    b.content = { text: data.eyebrow, level: 6, alignment: 'center', color: '#D6A54A', width: 'full', spacing: 'sm' } as HeadingContent;
    blocks.push(b);
  }

  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 2, alignment: 'center', color: '#151515', width: 'narrow', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  if (data.body) {
    const b = createBlock('text', order++);
    b.content = { html: `<p>${data.body.replace(/\\n/g, '</p><p>')}</p>`, alignment: 'center', color: '#73706A', width: 'narrow', spacing: 'md' } as TextContent;
    blocks.push(b);
  }

  return blocks;
}

// ── AboutValues ──

export function aboutValuesToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    eyebrow?: string;
    heading?: string;
    values?: Array<{ id: string; name?: string }>;
    image?: string;
    image_alt?: string;
  };

  const blocks: Block[] = [];
  let order = 0;

  if (data.eyebrow) {
    const b = createBlock('heading', order++);
    b.content = { text: data.eyebrow, level: 6, alignment: 'left', color: '#D6A54A', width: 'full', spacing: 'sm' } as HeadingContent;
    blocks.push(b);
  }

  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 2, alignment: 'left', color: '#F5F2EA', width: 'narrow', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  // Values as text list
  const values = data.values?.length ? data.values : [];
  if (values.length > 0) {
    const b = createBlock('text', order++);
    const items = values.map((v, i) => `<p>${String(i + 1).padStart(2, '0')} ${v.name || ''}</p>`).join('');
    b.content = { html: items, alignment: 'left', color: '#F5F2EA', width: 'full', spacing: 'md' } as TextContent;
    blocks.push(b);
  }

  if (data.image) {
    const b = createBlock('image', order++);
    b.content = { src: data.image, alt: data.image_alt || 'Luxury event setup', caption: '', width: 'full', alignment: 'center', borderRadius: 0, aspectRatio: '4/3', focalPoint: null, link: '', spacing: 'md' } as ImageContent;
    blocks.push(b);
  }

  return blocks;
}

// ── AboutWhy ──

export function aboutWhyToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    heading?: string;
    points?: Array<{ id: string; title: string; description: string }>;
  };

  const blocks: Block[] = [];
  let order = 0;

  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 2, alignment: 'left', color: '#151515', width: 'narrow', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  const points = data.points?.length ? data.points : [];
  for (const point of points) {
    if (point.title) {
      const b = createBlock('heading', order++);
      b.content = { text: `${point.title}`, level: 3, alignment: 'left', color: '#151515', width: 'full', spacing: 'sm' } as HeadingContent;
      blocks.push(b);
    }
    if (point.description) {
      const b = createBlock('text', order++);
      b.content = { html: `<p>${point.description}</p>`, alignment: 'left', color: '#73706A', width: 'full', spacing: 'md' } as TextContent;
      blocks.push(b);
    }
  }

  return blocks;
}

// ── AboutClosing ──

export function aboutClosingToBlocks(content: Record<string, unknown>): Block[] {
  const data = content as {
    heading?: string;
    cta_text?: string;
    cta_url?: string;
    background_image?: string;
    background_image_alt?: string;
  };

  const blocks: Block[] = [];
  let order = 0;

  if (data.background_image) {
    const b = createBlock('image', order++);
    b.content = { src: data.background_image, alt: data.background_image_alt || 'Cinematic event experience', caption: '', width: 'full', alignment: 'center', borderRadius: 0, aspectRatio: 'auto', focalPoint: null, link: '', spacing: 'none' } as ImageContent;
    blocks.push(b);
  }

  if (data.heading) {
    const b = createBlock('heading', order++);
    b.content = { text: data.heading.replace(/\\n/g, '\n'), level: 2, alignment: 'center', color: '#F5F2EA', width: 'narrow', spacing: 'md' } as HeadingContent;
    blocks.push(b);
  }

  if (data.cta_text) {
    const b = createBlock('button', order++);
    b.content = { text: data.cta_text, url: data.cta_url || '/contact', variant: 'primary', size: 'md', alignment: 'center', openNewTab: false, icon: '', spacing: 'md' } as ButtonContent;
    blocks.push(b);
  }

  return blocks;
}

// ── Master adapter ──

export function aboutContentToBlocks(
  sectionType: string,
  content: Record<string, unknown>
): Block[] {
  switch (sectionType) {
    case 'about-intro': return aboutIntroToBlocks(content);
    case 'about-story': return aboutStoryToBlocks(content);
    case 'about-foundation': return aboutFoundationToBlocks(content);
    case 'about-values': return aboutValuesToBlocks(content);
    case 'about-why': return aboutWhyToBlocks(content);
    case 'about-closing': return aboutClosingToBlocks(content);
    default: return [];
  }
}
