/**
 * Shared block renderer for About sections.
 * Used by each about-* renderer when content contains a `blocks` array.
 * Renders Heading, Text, Image, Button, Spacer blocks with about-specific styling.
 */

import { breakHeading } from '@/lib/breakHeading';
import type { Block, HeadingContent, TextContent, ImageContent, ButtonContent, SpacerContent } from '@/lib/blockTypes';

function HeadingBlock({ block }: { block: Block }) {
  if (!block.content) return null;
  const c = block.content as HeadingContent;
  const text = String(c.text || '').replace(/\\n/g, '\n');
  const heading = breakHeading(text);
  const Tag = (`h${c.level || 2}`) as keyof JSX.IntrinsicElements;

  const sizeMap: Record<number, string> = {
    1: 'clamp(2rem, 4vw, 3.2rem)',
    2: 'clamp(1.75rem, 3.2vw, 2.6rem)',
    3: 'clamp(0.95rem, 1.2vw, 1.1rem)',
    4: '0.85rem',
    5: '0.75rem',
    6: '0.65rem',
  };

  return (
    <Tag
      className={`font-serif font-normal ${c.level === 6 ? 'font-sans uppercase tracking-[0.14em]' : ''}`}
      style={{
        fontSize: sizeMap[c.level || 2] || '1.5rem',
        lineHeight: c.level <= 2 ? '1.0' : '1.4',
        color: c.color || '#151515',
        whiteSpace: 'pre-line',
        textAlign: c.alignment || 'left',
        maxWidth: c.width === 'narrow' ? '400px' : undefined,
      }}
    >
      {heading}
    </Tag>
  );
}

function TextBlock({ block }: { block: Block }) {
  if (!block.content) return null;
  const c = block.content as TextContent;
  return (
    <div
      className="font-sans"
      style={{
        fontSize: 'clamp(0.82rem, 0.9vw, 0.88rem)',
        lineHeight: '1.7',
        color: c.color || '#73706A',
        textAlign: c.alignment || 'left',
        maxWidth: c.width === 'narrow' ? '400px' : undefined,
      }}
      dangerouslySetInnerHTML={{ __html: String(c.html || '') }}
    />
  );
}

function ImageBlock({ block }: { block: Block }) {
  if (!block.content) return null;
  const c = block.content as ImageContent;
  if (!c.src) return null;
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: c.aspectRatio === 'auto' ? undefined : c.aspectRatio || '4/3' }}>
      <img
        src={String(c.src)}
        alt={String(c.alt || '')}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function ButtonBlock({ block }: { block: Block }) {
  if (!block.content) return null;
  const c = block.content as ButtonContent;
  if (!c.text) return null;
  return (
    <div style={{ textAlign: c.alignment || 'left' }}>
      <a
        href={String(c.url || '#')}
        className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.12em] transition-all duration-300 hover:translate-x-1"
        style={{ fontSize: '0.68rem', color: '#D6A54A' }}
      >
        {String(c.text)}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

function SpacerBlock({ block }: { block: Block }) {
  if (!block.content) return null;
  const c = block.content as SpacerContent;
  return <div style={{ height: `${c.height || 48}px` }} />;
}

export function AboutBlocksRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': return <HeadingBlock key={block.id} block={block} />;
          case 'text': return <TextBlock key={block.id} block={block} />;
          case 'image': return <ImageBlock key={block.id} block={block} />;
          case 'button': return <ButtonBlock key={block.id} block={block} />;
          case 'spacer': return <SpacerBlock key={block.id} block={block} />;
          default: return null;
        }
      })}
    </div>
  );
}
