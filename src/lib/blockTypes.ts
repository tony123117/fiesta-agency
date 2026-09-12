// ── Block Type Definitions ──
// Blocks live inside sections.content.blocks as JSONB.
// No new database tables — extends the existing sections.content JSONB field.

export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'spacer';

export type BlockResponsiveBreakpoint = 'desktop' | 'tablet' | 'mobile';

export interface BlockResponsiveOverrides {
  visible?: boolean;
  width?: BlockWidth;
  alignment?: 'left' | 'center' | 'right';
  spacing?: BlockSpacing;
  stack?: boolean;
}

export interface BlockResponsive {
  desktop: BlockResponsiveOverrides;
  tablet: BlockResponsiveOverrides;
  mobile: BlockResponsiveOverrides;
}

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, unknown>;
  sort_order: number;
  responsive: BlockResponsive;
}

// ── Per-block content types ──

export type BlockSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BlockWidth = 'full' | '1/2' | '1/3' | '2/3' | '1/4';
export type BlockAspectRatio = 'auto' | '16:9' | '4:3' | '1:1' | '3:4';

export interface HeadingContent {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment: 'left' | 'center' | 'right';
  color: string;
  width: BlockWidth;
  spacing: BlockSpacing;
}

export interface TextContent {
  html: string;
  alignment: 'left' | 'center' | 'right';
  color: string;
  width: BlockWidth;
  spacing: BlockSpacing;
}

export interface ImageContent {
  src: string;
  alt: string;
  caption: string;
  width: BlockWidth;
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
  aspectRatio: BlockAspectRatio;
  focalPoint: { x: number; y: number } | null;
  link: string;
  spacing: BlockSpacing;
}

export interface ButtonContent {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  alignment: 'left' | 'center' | 'right';
  openNewTab: boolean;
  icon: string;
  spacing: BlockSpacing;
}

export interface SpacerContent {
  height: number;
}

// ── Block content map ──

export type BlockContentMap = {
  heading: HeadingContent;
  text: TextContent;
  image: ImageContent;
  button: ButtonContent;
  spacer: SpacerContent;
};

// ── Block type config ──

export interface BlockTypeConfig {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  defaultContent: Record<string, unknown>;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const BLOCK_TYPES: BlockTypeConfig[] = [
  {
    type: 'heading',
    label: 'Heading',
    description: 'Title or heading text',
    icon: 'Type',
    defaultContent: {
      text: 'Heading',
      level: 2,
      alignment: 'left',
      color: '',
      width: 'full',
      spacing: 'md',
    } satisfies HeadingContent,
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Paragraph or rich text',
    icon: 'AlignLeft',
    defaultContent: {
      html: '<p>Enter your text here.</p>',
      alignment: 'left',
      color: '',
      width: 'full',
      spacing: 'md',
    } satisfies TextContent,
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Image with caption',
    icon: 'Image',
    defaultContent: {
      src: '',
      alt: '',
      caption: '',
      width: 'full',
      alignment: 'center',
      borderRadius: 0,
      aspectRatio: 'auto',
      focalPoint: null,
      link: '',
      spacing: 'md',
    } satisfies ImageContent,
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action button',
    icon: 'MousePointerClick',
    defaultContent: {
      text: 'Click here',
      url: '/',
      variant: 'primary',
      size: 'md',
      alignment: 'left',
      openNewTab: false,
      icon: '',
      spacing: 'md',
    } satisfies ButtonContent,
  },
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Empty space between blocks',
    icon: 'ArrowUpDown',
    defaultContent: {
      height: 48,
    } satisfies SpacerContent,
  },
];

// ── Helper functions ──

export function getBlockTypeConfig(type: BlockType): BlockTypeConfig {
  return BLOCK_TYPES.find((b) => b.type === type) || BLOCK_TYPES[0];
}

export function getBlockDefaultContent(type: BlockType): Record<string, unknown> {
  return { ...getBlockTypeConfig(type).defaultContent };
}

export function createBlock(type: BlockType, sortOrder: number = 0): Block {
  return {
    id: uid(),
    type,
    content: getBlockDefaultContent(type),
    sort_order: sortOrder,
    responsive: {
      desktop: { visible: true },
      tablet: {},
      mobile: {},
    },
  };
}

export function resolveBlockContent(
  block: Block,
  viewport: BlockResponsiveBreakpoint,
): Record<string, unknown> {
  if (!block.content) return {};
  if (viewport === 'desktop') return block.content;
  const overrides = block.responsive?.[viewport];
  if (!overrides || Object.keys(overrides).length === 0) return block.content;
  return { ...block.content, ...overrides };
}

export function isBlockVisible(
  block: Block,
  viewport: BlockResponsiveBreakpoint,
): boolean {
  const overrides = block.responsive?.[viewport];
  if (!overrides || overrides.visible === undefined) return true;
  return overrides.visible;
}

export function getBlockLabel(type: BlockType): string {
  return getBlockTypeConfig(type).label;
}

// ── Content type guard helpers ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHeadingContent(content: Record<string, any>): content is HeadingContent {
  return 'text' in content && 'level' in content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTextContent(content: Record<string, any>): content is TextContent {
  return 'html' in content && 'alignment' in content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isImageContent(content: Record<string, any>): content is ImageContent {
  return 'src' in content && 'alt' in content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isButtonContent(content: Record<string, any>): content is ButtonContent {
  return 'text' in content && 'url' in content && 'variant' in content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSpacerContent(content: Record<string, any>): content is SpacerContent {
  return 'height' in content;
}
