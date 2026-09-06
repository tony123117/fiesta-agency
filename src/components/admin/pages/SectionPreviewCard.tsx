import { useMemo } from 'react';
import type { SectionType, Section } from '@/lib/types';
import { getSectionTypeConfig } from '@/lib/sectionTypes';
import { SectionPreviewRenderer } from './SectionPreviewRenderer';

export function SectionPreviewCard({
  type,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  type: SectionType;
  selected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const config = getSectionTypeConfig(type);
  const previewSection = useMemo<Section>(
    () => ({
      id: `preview-${type}`,
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
    }),
    [type, config.previewContent],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`text-left group w-full transition-all duration-200 rounded-lg overflow-hidden border ${
        selected
          ? 'border-gold shadow-lg shadow-gold/[0.08]'
          : 'border-white/[0.06] hover:border-gold/30 hover:shadow-lg hover:shadow-gold/[0.04]'
      }`}
      aria-pressed={selected}
      aria-label={`Add ${config.label} section`}
    >
      {/* Preview area */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-obsidian">
        <div
          className="absolute inset-0 origin-top-left"
          style={{ transform: 'scale(0.3)', width: '333%', height: '333%' }}
        >
          <SectionPreviewRenderer section={previewSection} />
        </div>
        {/* Hover overlay */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          selected ? 'bg-gold/[0.06] opacity-100' : 'bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 group-hover:opacity-100'
        }`} />
        {/* Variant count badge */}
        {config.variants.length > 1 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-obsidian/80 backdrop-blur-sm rounded text-[0.5rem] font-medium text-white/50 border border-white/[0.08]">
            {config.variants.length} layouts
          </div>
        )}
        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#090909" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Label area */}
      <div className="px-3 py-2.5 bg-charcoal/80">
        <p className={`text-[0.72rem] font-medium transition-colors ${
          selected ? 'text-gold' : 'text-white/60 group-hover:text-ivory'
        }`}>
          {config.label}
        </p>
        <p className="text-[0.58rem] text-white/25 mt-0.5 line-clamp-1">
          {config.description}
        </p>
      </div>
    </button>
  );
}
