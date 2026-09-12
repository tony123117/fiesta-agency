import type { Block, HeadingContent, TextContent, ImageContent, ButtonContent, SpacerContent } from '@/lib/blockTypes';

// ── Block Renderer (Admin Canvas Preview) ──
// Renders a block for the admin canvas. Used in VisualCanvas and block preview.

export function BlockRenderer({ block }: { block: Block }) {
  if (!block.responsive?.desktop?.visible) return null;

  switch (block.type) {
    case 'heading':
      return <HeadingBlock content={block.content as unknown as HeadingContent} />;
    case 'text':
      return <TextBlock content={block.content as unknown as TextContent} />;
    case 'image':
      return <ImageBlock content={block.content as unknown as ImageContent} />;
    case 'button':
      return <ButtonBlock content={block.content as unknown as ButtonContent} />;
    case 'spacer':
      return <SpacerBlock content={block.content as unknown as SpacerContent} />;
    default:
      return null;
  }
}

function HeadingBlock({ content }: { content: HeadingContent }) {
  const Tag = `h${content.level}` as keyof JSX.IntrinsicElements;
  const sizeClasses: Record<number, string> = {
    1: 'text-[2.5rem] leading-[1.1] tracking-tight',
    2: 'text-[2rem] leading-[1.15] tracking-tight',
    3: 'text-[1.5rem] leading-[1.2]',
    4: 'text-[1.25rem] leading-[1.3]',
    5: 'text-[1rem] leading-[1.4]',
    6: 'text-[0.875rem] leading-[1.4]',
  };

  return (
    <Tag
      className={`font-serif font-medium ${sizeClasses[content.level] || sizeClasses[2]}`}
      style={{
        textAlign: content.alignment,
        color: content.color || undefined,
      }}
    >
      {content.text || 'Empty heading'}
    </Tag>
  );
}

function TextBlock({ content }: { content: TextContent }) {
  return (
    <div
      className="prose prose-sm max-w-none"
      style={{ textAlign: content.alignment, color: content.color || undefined }}
      dangerouslySetInnerHTML={{ __html: content.html || '<p>Empty text</p>' }}
    />
  );
}

function ImageBlock({ content }: { content: ImageContent }) {
  if (!content.src) {
    return (
      <div className="bg-white/[0.04] border border-dashed border-white/[0.1] rounded flex items-center justify-center h-32 text-white/20 text-[0.75rem]">
        No image selected
      </div>
    );
  }

  const widthClass: Record<string, string> = {
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    '1/4': 'w-1/4',
  };

  const alignClass: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <figure className={`${widthClass[content.width] || 'w-full'} ${alignClass[content.alignment] || ''}`}>
      <img
        src={content.src}
        alt={content.alt}
        className="w-full h-auto"
        style={{ borderRadius: content.borderRadius ? `${content.borderRadius}px` : undefined }}
        loading="lazy"
      />
      {content.caption && (
        <figcaption className="mt-2 text-[0.75rem] text-stone/60 italic">{content.caption}</figcaption>
      )}
    </figure>
  );
}

function ButtonBlock({ content }: { content: ButtonContent }) {
  const variantClasses: Record<string, string> = {
    primary: 'bg-gold text-obsidian hover:bg-gold-light',
    secondary: 'bg-transparent border border-gold text-gold hover:bg-gold/10',
    ghost: 'bg-transparent text-gold hover:text-gold-light',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-[0.75rem]',
    md: 'px-6 py-3 text-[0.85rem]',
    lg: 'px-8 py-4 text-[1rem]',
  };

  const alignClass: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex ${alignClass[content.alignment] || ''}`}>
      <a
        href={content.url || '#'}
        target={content.openNewTab ? '_blank' : undefined}
        rel={content.openNewTab ? 'noopener noreferrer' : undefined}
        className={`inline-block font-semibold uppercase tracking-[0.1em] rounded transition-colors ${variantClasses[content.variant] || variantClasses.primary} ${sizeClasses[content.size] || sizeClasses.md}`}
        onClick={(e) => e.preventDefault()}
      >
        {content.text || 'Button'}
      </a>
    </div>
  );
}

function SpacerBlock({ content }: { content: SpacerContent }) {
  return (
    <div
      className="w-full border border-dashed border-white/[0.06] bg-white/[0.01]"
      style={{ height: `${content.height}px` }}
    >
      <div className="h-full flex items-center justify-center text-[0.55rem] text-white/10">
        {content.height}px
      </div>
    </div>
  );
}
