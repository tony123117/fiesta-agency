// ── Floating Block Toolbar ──
// Compact toolbar that appears above a selected block in the canvas.
// Actions: move, duplicate, delete, alignment, text formatting.

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BlockType } from '@/lib/blockTypes';

export interface FloatingBlockToolbarProps {
  blockType: BlockType;
  blockContent: Record<string, unknown>;
  blockId: string;
  sectionId: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdateContent: (content: Record<string, unknown>) => void;
  onOpenInspector?: () => void;
  onImageReplace?: () => void;
  onFocalPoint?: () => void;
  isDragging?: boolean;
}

export function FloatingBlockToolbar({
  blockType,
  blockContent,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onUpdateContent,
  onOpenInspector,
  onImageReplace,
  onFocalPoint,
  isDragging,
}: FloatingBlockToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showLinkInput) linkInputRef.current?.focus();
  }, [showLinkInput]);

  const handleWrapSelection = useCallback((tag: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    try {
      const wrapper = document.createElement(tag);
      range.surroundContents(wrapper);
    } catch {
      // surroundContents fails if selection spans multiple elements — ignore silently
      return;
    }
    sel.removeAllRanges();

    const container = range.commonAncestorContainer;
    const html = container.nodeType === Node.ELEMENT_NODE
      ? (container as HTMLElement).innerHTML
      : container.textContent || '';
    onUpdateContent({ ...blockContent, html });
  }, [blockContent, onUpdateContent]);

  const handleInsertLink = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !linkUrl) return;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString() || linkUrl;

    const a = document.createElement('a');
    a.href = linkUrl;
    a.textContent = selectedText;
    range.deleteContents();
    range.insertNode(a);
    sel.removeAllRanges();

    const container = range.commonAncestorContainer;
    const html = container.nodeType === Node.ELEMENT_NODE
      ? (container as HTMLElement).innerHTML
      : container.textContent || '';
    onUpdateContent({ ...blockContent, html });
    setShowLinkInput(false);
    setLinkUrl('');
  }, [blockContent, linkUrl, onUpdateContent]);

  const alignment = blockContent.alignment as string | undefined;

  const setAlignment = useCallback((align: 'left' | 'center' | 'right') => {
    onUpdateContent({ ...blockContent, alignment: align });
  }, [blockContent, onUpdateContent]);

  if (isDragging) return null;

  return (
    <div
      className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-px bg-charcoal border border-white/[0.08] rounded-lg shadow-xl select-none"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Universal: Move */}
      <ToolbarButton
        onClick={isFirst ? undefined : onMoveUp}
        disabled={isFirst}
        title="Move up"
      >
        <IconChevronUp />
      </ToolbarButton>
      <ToolbarButton
        onClick={isLast ? undefined : onMoveDown}
        disabled={isLast}
        title="Move down"
      >
        <IconChevronDown />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Universal: Duplicate */}
      <ToolbarButton onClick={onDuplicate} title="Duplicate">
        <IconCopy />
      </ToolbarButton>

      {/* Universal: Delete */}
      <ToolbarButton onClick={onDelete} title="Delete" danger>
        <IconTrash />
      </ToolbarButton>

      {/* Universal: Edit (open inspector) */}
      {onOpenInspector && (
        <>
          <ToolbarDivider />
          <ToolbarButton onClick={onOpenInspector} title="Edit">
            <IconPencil />
          </ToolbarButton>
        </>
      )}

      {/* Type-specific: Text formatting */}
      {blockType === 'text' && (
        <>
          <ToolbarDivider />
          <ToolbarButton onClick={() => handleWrapSelection('strong')} title="Bold">
            <IconBold />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleWrapSelection('em')} title="Italic">
            <IconItalic />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Link"
            active={showLinkInput}
          >
            <IconLink />
          </ToolbarButton>
        </>
      )}

      {/* Type-specific: Alignment (text, heading, image, button) */}
      {(blockType === 'text' || blockType === 'heading' || blockType === 'image' || blockType === 'button') && (
        <>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => setAlignment('left')}
            title="Align left"
            active={alignment === 'left'}
          >
            <IconAlignLeft />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setAlignment('center')}
            title="Align center"
            active={alignment === 'center'}
          >
            <IconAlignCenter />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setAlignment('right')}
            title="Align right"
            active={alignment === 'right'}
          >
            <IconAlignRight />
          </ToolbarButton>
        </>
      )}

      {/* Type-specific: Image actions */}
      {blockType === 'image' && (
        <>
          <ToolbarDivider />
          {onImageReplace && (
            <ToolbarButton onClick={onImageReplace} title="Replace image">
              <IconImageReplace />
            </ToolbarButton>
          )}
          {onFocalPoint && (
            <ToolbarButton onClick={onFocalPoint} title="Focal point">
              <IconFocalPoint />
            </ToolbarButton>
          )}
        </>
      )}

      {/* Link input popover */}
      {showLinkInput && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-charcoal border border-white/[0.08] rounded-lg shadow-xl p-2 flex gap-1.5 z-40">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertLink();
              if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
            }}
            placeholder="https://..."
            className="w-48 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-[0.7rem] text-ivory/80 placeholder-white/20 focus:outline-none focus:border-gold/40"
          />
          <button
            onClick={handleInsertLink}
            className="px-2 py-1 text-[0.65rem] font-medium text-gold hover:bg-gold/10 rounded transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

// ── Toolbar primitives ──

function ToolbarButton({
  onClick,
  disabled,
  title,
  active,
  danger,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  active?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
        disabled
          ? 'text-white/15 cursor-not-allowed'
          : danger
          ? 'text-white/40 hover:text-red-400 hover:bg-red-400/10'
          : active
          ? 'text-gold bg-gold/10'
          : 'text-white/40 hover:text-ivory/80 hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-4 bg-white/[0.08] mx-0.5" />;
}

// ── Inline SVG icons (14×14, stroke-based, no dependencies) ──

function IconChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.75L7 5.25l3.5 3.5" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 5.25L7 8.75l3.5-3.5" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="7" height="7" rx="1" />
      <path d="M9 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h2" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4.5h9" />
      <path d="M5 4.5V3a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1.5" />
      <path d="M3.5 4.5l.5 7.5a1 1 0 001 .5h4a1 1 0 001-.5l.5-7.5" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 2.5l3 3L5 12H2v-3L8.5 2.5z" />
    </svg>
  );
}

function IconBold() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2.5h3.5a2 2 0 010 4H4v-4z" />
      <path d="M4 6.5h4a2 2 0 010 4H4v-4z" />
    </svg>
  );
}

function IconItalic() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 2.5h5" />
      <path d="M3.5 11.5h5" />
      <path d="M8.5 2.5l-3 9" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a3 3 0 004.24.24l1.5-1.5a3 3 0 00-4.24-4.24L7.5 3.76" />
      <path d="M8 6a3 3 0 00-4.24-.24L2.26 7.26a3 3 0 004.24 4.24L8 8" />
    </svg>
  );
}

function IconAlignLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 3h10" />
      <path d="M2 6h7" />
      <path d="M2 9h10" />
      <path d="M2 12h5" />
    </svg>
  );
}

function IconAlignCenter() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 3h10" />
      <path d="M3.5 6h7" />
      <path d="M2 9h10" />
      <path d="M4.5 12h5" />
    </svg>
  );
}

function IconAlignRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 3h10" />
      <path d="M5 6h7" />
      <path d="M2 9h10" />
      <path d="M7 12h5" />
    </svg>
  );
}

function IconImageReplace() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="11" height="9" rx="1" />
      <circle cx="5" cy="6" r="1" />
      <path d="M1.5 10l3-3 2 2 2.5-2.5L12.5 10" />
    </svg>
  );
}

function IconFocalPoint() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7" cy="7" r="3" />
      <circle cx="7" cy="7" r="0.5" fill="currentColor" />
      <path d="M7 1v2.5" />
      <path d="M7 10.5V13" />
      <path d="M1 7h2.5" />
      <path d="M10.5 7H13" />
    </svg>
  );
}
