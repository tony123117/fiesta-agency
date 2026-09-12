import { useState, useEffect, useRef } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { Page, Section } from '@/lib/types';
import { SectionRenderer } from '@/components/public/SectionRenderer';

interface FullPagePreviewProps {
  open: boolean;
  page: Page;
  sections: Section[];
  onClose: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function FullPagePreview({ open, page, sections, onClose }: FullPagePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open]);

  if (!open) return null;

  const publishedSections = sections.filter((s) => s.published);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian flex flex-col">
      {/* Preview Header */}
      <div className="h-14 border-b border-stone/10 bg-charcoal flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-warm-white">{page.title}</span>
          <span className="text-xs text-stone/60 bg-stone/10 px-2 py-0.5 rounded">Draft Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Viewport Toggle */}
          <div className="flex items-center bg-charcoal border border-stone/10 rounded-lg p-0.5 mr-3">
            {([
              { key: 'desktop' as const, Icon: Monitor },
              { key: 'tablet' as const, Icon: Tablet },
              { key: 'mobile' as const, Icon: Smartphone },
            ]).map(({ key, Icon }) => (
              <button
                key={key}
                onClick={() => setViewport(key)}
                className={`p-1.5 rounded transition-colors ${
                  viewport === key
                    ? 'bg-gold/10 text-gold'
                    : 'text-stone/50 hover:text-warm-white'
                }`}
                title={key}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone hover:text-warm-white rounded-lg hover:bg-stone/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto flex justify-center bg-obsidian/50 p-6">
        <div
          className="bg-obsidian border border-stone/10 rounded-lg overflow-hidden transition-all duration-300 shadow-2xl"
          style={{
            width: VIEWPORT_WIDTHS[viewport],
            maxWidth: '100%',
            flexShrink: 0,
          }}
        >
          <div className="min-h-[600px]">
            {publishedSections.length > 0 ? (
              publishedSections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-stone/40">
                No published sections to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
