// ── Blocks Section Renderer (Public) ──
// Renders blocks on the public website.
// Supports both legacy flat-block format and new layout (Container → Row → Column → Block) format.
// Detects format via content.layout vs content.blocks and routes accordingly.

import type { Block, HeadingContent, TextContent, ImageContent, ButtonContent, SpacerContent, BlockResponsiveBreakpoint } from '@/lib/blockTypes';
import { getBlockLabel, isBlockVisible, resolveBlockContent } from '@/lib/blockTypes';
import { FloatingBlockToolbar } from '../admin/pages/blocks/FloatingBlockToolbar';
import { LayoutRenderer } from './LayoutRenderer';

import { isLayoutContent, type LayoutContent } from '@/lib/layoutTypes';

export interface BlocksSectionRendererToolbarProps {
  sectionId?: string;
  onBlockMoveUp?: (sectionId: string, blockId: string) => void;
  onBlockMoveDown?: (sectionId: string, blockId: string) => void;
  onBlockDuplicate?: (sectionId: string, blockId: string) => void;
  onBlockDelete?: (sectionId: string, blockId: string) => void;
  onBlockUpdateContent?: (sectionId: string, blockId: string, content: Record<string, unknown>) => void;
  onOpenBlockInspector?: () => void;
  onImageReplace?: (sectionId: string, blockId: string) => void;
  onFocalPoint?: (sectionId: string, blockId: string) => void;
}

interface BlocksSectionRendererProps {
  content: unknown;
  selectedBlockId?: string | null;
  hoveredBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  onHoverBlock?: (id: string | null) => void;
  toolbar?: BlocksSectionRendererToolbarProps;
  blockDragSectionId?: string | null;
  blockDragBlockId?: string | null;
  viewport?: BlockResponsiveBreakpoint;
}

export function BlocksSectionRenderer({ content, selectedBlockId, hoveredBlockId, onSelectBlock, onHoverBlock, toolbar, blockDragSectionId, blockDragBlockId, viewport = 'desktop' }: BlocksSectionRendererProps) {
  const data = content as { blocks?: Block[] };

  // ── New layout format: Container → Row → Column → Block ──
  if (isLayoutContent(data)) {
    return (
      <LayoutRenderer
        content={data as unknown as LayoutContent}
        viewport={viewport}
        renderBlock={(block) => {
          if (!isBlockVisible(block as Block, viewport)) return null;
          const resolvedContent = resolveBlockContent(block as Block, viewport);
          return <BlockRender block={block as Block} resolvedContent={resolvedContent} />;
        }}
      />
    );
  }

  // ── Legacy flat-block format ──
  const blocks = data?.blocks;

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const hasCanvasInteraction = !!(onSelectBlock || onHoverBlock);
  const isBlockDragging = !!(blockDragSectionId && blockDragBlockId);

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {blocks.map((block, index) => {
          if (!isBlockVisible(block, viewport)) return null;

          const resolvedContent = resolveBlockContent(block, viewport);

          if (hasCanvasInteraction) {
            const isSelected = block.id === selectedBlockId;
            const isHovered = block.id === hoveredBlockId;

            return (
              <div
                key={block.id}
                data-block-id={block.id}
                className={`relative group/block transition-all ${
                  isSelected
                    ? 'ring-2 ring-gold ring-offset-2 ring-offset-white'
                    : isHovered
                    ? 'ring-1 ring-gold/40 ring-offset-1 ring-offset-white'
                    : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock?.(block.id);
                }}
                onMouseEnter={() => onHoverBlock?.(block.id)}
                onMouseLeave={() => onHoverBlock?.(null)}
              >
                {/* Block type label */}
                {(isHovered || isSelected) && (
                  <div className="absolute -top-6 left-0 z-20 pointer-events-none">
                    <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-semibold tracking-wide uppercase ${
                      isSelected
                        ? 'bg-gold text-obsidian'
                        : 'bg-charcoal/80 text-gold/80 border border-gold/20'
                    }`}>
                      {getBlockLabel(block.type)}
                    </span>
                  </div>
                )}

                {/* Floating toolbar — above block */}
                {isSelected && !isBlockDragging && toolbar && toolbar.sectionId && (
                  <FloatingBlockToolbar
                    blockType={block.type}
                    blockContent={block.content}
                    blockId={block.id}
                    sectionId={toolbar.sectionId}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    onMoveUp={() => toolbar.onBlockMoveUp?.(toolbar.sectionId!, block.id)}
                    onMoveDown={() => toolbar.onBlockMoveDown?.(toolbar.sectionId!, block.id)}
                    onDuplicate={() => toolbar.onBlockDuplicate?.(toolbar.sectionId!, block.id)}
                    onDelete={() => toolbar.onBlockDelete?.(toolbar.sectionId!, block.id)}
                    onUpdateContent={(c) => toolbar.onBlockUpdateContent?.(toolbar.sectionId!, block.id, c)}
                    onOpenInspector={toolbar.onOpenBlockInspector}
                    onImageReplace={block.type === 'image' ? () => toolbar.onImageReplace?.(toolbar.sectionId!, block.id) : undefined}
                    onFocalPoint={block.type === 'image' ? () => toolbar.onFocalPoint?.(toolbar.sectionId!, block.id) : undefined}
                    isDragging={isBlockDragging}
                  />
                )}

                {/* Resize/move affordances for selected block */}
                {isSelected && (
                  <>
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-gold/60 rounded-l cursor-ns-resize z-10" />
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-gold/60 rounded-r cursor-ns-resize z-10" />
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-6 h-2 bg-gold/60 rounded-t cursor-ew-resize z-10" />
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-6 h-2 bg-gold/60 rounded-b cursor-ew-resize z-10" />
                  </>
                )}

                <BlockRender block={block} resolvedContent={resolvedContent} />
              </div>
            );
          }

          return (
            <div key={block.id}>
              <BlockRender block={block} resolvedContent={resolvedContent} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockRender({ block, resolvedContent }: { block: Block; resolvedContent: Record<string, unknown> }) {
  switch (block.type) {
    case 'heading':
      return <PublicHeadingBlock content={resolvedContent as unknown as HeadingContent} />;
    case 'text':
      return <PublicTextBlock content={resolvedContent as unknown as TextContent} />;
    case 'image':
      return <PublicImageBlock content={resolvedContent as unknown as ImageContent} />;
    case 'button':
      return <PublicButtonBlock content={resolvedContent as unknown as ButtonContent} />;
    case 'spacer':
      return <PublicSpacerBlock content={resolvedContent as unknown as SpacerContent} />;
    default:
      return null;
  }
}

function PublicHeadingBlock({ content }: { content: HeadingContent }) {
  if (!content) return null;
  const sizeClasses: Record<number, string> = {
    1: 'text-hero font-serif font-medium tracking-tight',
    2: 'text-display font-serif font-medium tracking-tight',
    3: 'text-section font-serif font-medium',
    4: 'text-subsection font-serif font-medium',
    5: 'text-lg font-serif font-medium',
    6: 'text-base font-serif font-medium',
  };

  const widthClasses: Record<string, string> = {
    'full': 'w-full',
    '2/3': 'w-full md:w-2/3',
    '1/2': 'w-full md:w-1/2',
    '1/3': 'w-full md:w-1/3',
    '1/4': 'w-full md:w-1/4',
  };

  const alignClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const spacingClasses: Record<string, string> = {
    none: '',
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-10',
    xl: 'mb-16',
  };

  const Tag = `h${content.level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={`${sizeClasses[content.level] || sizeClasses[2]} ${widthClasses[content.width] || 'w-full'} ${alignClasses[content.alignment] || ''} ${spacingClasses[content.spacing] || ''}`}
      style={{ color: content.color || undefined }}
    >
      {content.text}
    </Tag>
  );
}

function PublicTextBlock({ content }: { content: TextContent }) {
  if (!content) return null;
  const widthClasses: Record<string, string> = {
    'full': 'w-full',
    '2/3': 'w-full md:w-2/3',
    '1/2': 'w-full md:w-1/2',
    '1/3': 'w-full md:w-1/3',
    '1/4': 'w-full md:w-1/4',
  };

  const spacingClasses: Record<string, string> = {
    none: '',
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-10',
    xl: 'mb-16',
  };

  return (
    <div
      className={`text-body-lg leading-relaxed text-stone ${widthClasses[content.width] || 'w-full'} ${spacingClasses[content.spacing] || ''}`}
      style={{
        textAlign: content.alignment,
        color: content.color || undefined,
      }}
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}

function PublicImageBlock({ content }: { content: ImageContent }) {
  if (!content || !content.src) return null;

  const widthClass: Record<string, string> = {
    'full': 'w-full',
    '1/2': 'w-full md:w-1/2',
    '1/3': 'w-full md:w-1/3',
    '2/3': 'w-full md:w-2/3',
    '1/4': 'w-full md:w-1/4',
  };

  const alignClass: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const spacingClasses: Record<string, string> = {
    none: '',
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-10',
    xl: 'mb-16',
  };

  return (
    <figure className={`${widthClass[content.width] || 'w-full'} ${alignClass[content.alignment] || ''} ${spacingClasses[content.spacing] || ''}`}>
      <img
        src={content.src}
        alt={content.alt}
        className="w-full h-auto"
        style={{ borderRadius: content.borderRadius ? `${content.borderRadius}px` : undefined }}
        loading="lazy"
      />
      {content.caption && (
        <figcaption className="mt-3 text-caption text-stone-muted italic">{content.caption}</figcaption>
      )}
    </figure>
  );
}

function PublicButtonBlock({ content }: { content: ButtonContent }) {
  if (!content) return null;
  const variantClasses: Record<string, string> = {
    primary: 'bg-gold text-obsidian hover:bg-gold-light font-semibold',
    secondary: 'border border-gold text-gold hover:bg-gold/10 font-semibold',
    ghost: 'text-gold hover:text-gold-light font-semibold underline underline-offset-4',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-5 py-2.5 text-body-sm',
    md: 'px-7 py-3.5 text-body',
    lg: 'px-9 py-4 text-body-lg',
  };

  const alignClass: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const spacingClasses: Record<string, string> = {
    none: '',
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-10',
    xl: 'mb-16',
  };

  return (
    <div className={`flex ${alignClass[content.alignment] || ''} ${spacingClasses[content.spacing] || ''}`}>
      <a
        href={content.url}
        target={content.openNewTab ? '_blank' : undefined}
        rel={content.openNewTab ? 'noopener noreferrer' : undefined}
        className={`inline-block uppercase tracking-[0.15em] rounded-btn transition-colors ${variantClasses[content.variant] || variantClasses.primary} ${sizeClasses[content.size] || sizeClasses.md}`}
      >
        {content.text}
      </a>
    </div>
  );
}

function PublicSpacerBlock({ content }: { content: SpacerContent }) {
  if (!content) return null;
  return <div style={{ height: `${content.height}px` }} />;
}
