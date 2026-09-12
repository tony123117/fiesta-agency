import { useState, useEffect, useRef } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { Section } from '@/lib/types';
import { SectionPreviewRenderer } from './SectionPreviewRenderer';

type PreviewSize = 'desktop' | 'tablet' | 'mobile';

const SIZE_CONFIG: Record<PreviewSize, { width: string; label: string }> = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: '768px', label: 'Tablet' },
  mobile: { width: '390px', label: 'Mobile' },
};

export function SectionPreviewModal({
  open,
  onClose,
  section,
  title,
}: {
  open: boolean;
  onClose: () => void;
  section: Section;
  title?: string;
}) {
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Section preview'}
    >
      <div
        className="w-full max-w-6xl max-h-[90vh] bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif font-medium text-sm tracking-tight text-ivory">
              {title || 'Section Preview'}
            </h2>
            <p className="text-[0.6rem] text-white/25 mt-0.5">
              Preview how this section will appear on the page
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Responsive toggle */}
            <div className="flex items-center gap-1 p-0.5 bg-white/[0.04] rounded">
              {(Object.keys(SIZE_CONFIG) as PreviewSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPreviewSize(size)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[0.6rem] font-medium transition-all ${
                    previewSize === size
                      ? 'bg-gold/10 text-gold'
                      : 'text-white/30 hover:text-white/50'
                  }`}
                  title={SIZE_CONFIG[size].label}
                >
                  {size === 'desktop' && <Monitor size={12} />}
                  {size === 'tablet' && <Tablet size={12} />}
                  {size === 'mobile' && <Smartphone size={12} />}
                  <span className="hidden sm:inline">{SIZE_CONFIG[size].label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/30 hover:text-white/60 transition-colors"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto p-5 flex justify-center">
          <div
            className="bg-obsidian rounded overflow-hidden border border-white/[0.04] transition-all duration-300"
            style={{
              width: SIZE_CONFIG[previewSize].width,
              maxWidth: '100%',
            }}
          >
            <SectionPreviewRenderer section={section} />
          </div>
        </div>
      </div>
    </div>
  );
}
