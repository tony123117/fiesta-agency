import { SECTION_TYPES } from '@/lib/sectionTypes';
import type { Section } from '@/lib/types';

interface SectionNavigatorProps {
  sections: Section[];
  activeSectionIndex: number | null;
  onSelect: (index: number) => void;
}

function getSectionLabel(section: Section): string {
  if (section.title) return section.title;
  const config = SECTION_TYPES.find((s) => s.type === section.section_type);
  return config?.label || section.section_type || 'Section';
}

export default function SectionNavigator({ sections, activeSectionIndex, onSelect }: SectionNavigatorProps) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-1">
      <h3 className="text-[11px] font-semibold text-stone/60 uppercase tracking-widest mb-2 px-1">
        Sections
      </h3>
      {sections.map((section, index) => {
        const isActive = index === activeSectionIndex;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(index)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
              isActive
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-stone hover:text-warm-white hover:bg-charcoal/50'
            }`}
          >
            <span className="text-[10px] font-mono text-stone/50 w-4 text-right">{index + 1}</span>
            <span className="truncate text-xs font-medium">{getSectionLabel(section)}</span>
            {!section.published && (
              <span className="text-[9px] bg-stone/10 text-stone/60 px-1.5 py-0.5 rounded ml-auto">
                Draft
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
