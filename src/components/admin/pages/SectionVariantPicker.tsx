import type { SectionType, Section } from '@/lib/types';
import { getSectionTypeConfig } from '@/lib/sectionTypes';
import { SectionPreviewRenderer } from './SectionPreviewRenderer';

export function SectionVariantPicker({
  type,
  selectedVariant,
  onSelect,
}: {
  type: SectionType;
  selectedVariant: string;
  onSelect: (variantId: string) => void;
}) {
  const config = getSectionTypeConfig(type);

  if (config.variants.length <= 1) return null;

  const previewSection: Section = {
    id: `variant-preview-${type}`,
    page_id: '',
    title: null,
    subtitle: null,
    body: null,
    image_url: null,
    image_alt: null,
    layout: 'default',
    section_type: type,
    content: config.previewContent,
    sort_order: 0,
    published: true,
    created_at: '',
    updated_at: '',
  };

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 mb-3">
        Choose Layout
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {config.variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`text-left group rounded-lg overflow-hidden border transition-all duration-200 ${
              selectedVariant === variant.id
                ? 'border-gold shadow-md shadow-gold/[0.08]'
                : 'border-white/[0.06] hover:border-gold/30'
            }`}
            aria-pressed={selectedVariant === variant.id}
          >
            {/* Variant preview thumbnail */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-obsidian">
              <div
                className="absolute inset-0 origin-top-left"
                style={{ transform: 'scale(0.25)', width: '400%', height: '400%' }}
              >
                <SectionPreviewRenderer section={previewSection} />
              </div>
              {selectedVariant === variant.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#090909" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Variant label */}
            <div className="px-2.5 py-2 bg-charcoal/80">
              <p className={`text-[0.65rem] font-medium transition-colors ${
                selectedVariant === variant.id ? 'text-gold' : 'text-white/50 group-hover:text-ivory'
              }`}>
                {variant.label}
              </p>
              <p className="text-[0.52rem] text-white/20 mt-0.5 line-clamp-1">
                {variant.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
