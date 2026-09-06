import { useState, useMemo } from 'react';
import { X, ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react';
import { SECTION_TYPES } from '@/lib/sectionTypes';
import { getSectionTypeConfig, getPreviewContent } from '@/lib/sectionTypes';
import { SectionPreviewCard } from './SectionPreviewCard';
import { SectionVariantPicker } from './SectionVariantPicker';
import { SectionPreviewRenderer } from './SectionPreviewRenderer';
import type { SectionType, Section } from '@/lib/types';

type PreviewSize = 'desktop' | 'tablet' | 'mobile';

const SIZE_WIDTHS: Record<PreviewSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

const GROUPS = [
  { label: 'FEATURED', types: SECTION_TYPES.filter((s) => s.group === 'featured') },
  { label: 'CONTENT', types: SECTION_TYPES.filter((s) => s.group === 'content') },
  { label: 'CONVERSION', types: SECTION_TYPES.filter((s) => s.group === 'conversion') },
] as const;

export function AddSectionModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: SectionType) => void;
}) {
  const [activeGroup, setActiveGroup] = useState<string>('FEATURED');
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('default');
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');

  if (!open) return null;

  const config = selectedType ? getSectionTypeConfig(selectedType) : null;
  const currentGroup = GROUPS.find((g) => g.label === activeGroup) || GROUPS[0];

  const previewSection = useMemo<Section | null>(() => {
    if (!selectedType) return null;
    return {
      id: 'add-section-preview',
      page_id: '',
      title: null,
      subtitle: null,
      body: null,
      image_url: null,
      image_alt: null,
      layout: 'default',
      section_type: selectedType,
      content: getPreviewContent(selectedType),
      sort_order: 0,
      published: true,
      created_at: '',
      updated_at: '',
    };
  }, [selectedType]);

  const handleBack = () => {
    setSelectedType(null);
    setSelectedVariant('default');
  };

  const handleAdd = () => {
    if (!selectedType) return;
    onSelect(selectedType);
    setSelectedType(null);
    setSelectedVariant('default');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add section"
    >
      <div
        className="w-full max-w-6xl h-[90vh] bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {selectedType && (
              <button
                type="button"
                onClick={handleBack}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label="Back to section list"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="font-serif font-medium text-base tracking-tight text-ivory">
                {selectedType ? config?.label : 'Add Section'}
              </h2>
              <p className="text-[0.65rem] text-white/30 mt-0.5">
                {selectedType
                  ? 'Choose a layout and preview before adding'
                  : 'Choose a section type to add to this page'
                }
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left panel: section picker or variant picker */}
          <div className={`${selectedType ? 'w-80' : 'flex-1'} border-r border-white/[0.06] flex flex-col overflow-hidden transition-all duration-300`}>
            {!selectedType ? (
              <>
                {/* Group tabs */}
                <div className="px-4 pt-4 flex gap-1 shrink-0">
                  {GROUPS.map((group) => (
                    <button
                      key={group.label}
                      onClick={() => setActiveGroup(group.label)}
                      className={`px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] rounded transition-all ${
                        activeGroup === group.label
                          ? 'bg-gold/[0.1] text-gold border border-gold/20'
                          : 'text-white/30 hover:text-white/50 border border-transparent'
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>

                {/* Section grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {currentGroup.types.map((st) => (
                      <SectionPreviewCard
                        key={st.type}
                        type={st.type}
                        onClick={() => {
                          setSelectedType(st.type);
                          setSelectedVariant(st.defaultVariant);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Variant picker + info */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Description */}
                  <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded">
                    <p className="text-[0.7rem] text-white/40">
                      <span className="text-gold/60 font-medium">{config?.label}</span>
                      {' — '}
                      {config?.description}
                    </p>
                  </div>

                  {/* Variant picker */}
                  {config && (
                    <SectionVariantPicker
                      type={selectedType}
                      selectedVariant={selectedVariant}
                      onSelect={setSelectedVariant}
                    />
                  )}

                  {/* Add button (mobile) */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full py-2.5 bg-gold text-obsidian font-semibold uppercase tracking-[0.12em] text-[0.7rem] rounded hover:bg-gold-light transition-colors lg:hidden"
                  >
                    Add Section
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right panel: live preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Preview toolbar */}
            <div className="px-4 py-2 border-b border-white/[0.04] flex items-center justify-between shrink-0">
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/20">
                Live Preview
              </p>
              <div className="flex items-center gap-1 p-0.5 bg-white/[0.04] rounded">
                {(['desktop', 'tablet', 'mobile'] as PreviewSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPreviewSize(size)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[0.55rem] font-medium transition-all ${
                      previewSize === size
                        ? 'bg-gold/10 text-gold'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                    title={size}
                  >
                    {size === 'desktop' && <Monitor size={11} />}
                    {size === 'tablet' && <Tablet size={11} />}
                    {size === 'mobile' && <Smartphone size={11} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 overflow-auto p-5 flex justify-center bg-white/[0.01]">
              {previewSection ? (
                <div
                  className="bg-obsidian rounded overflow-hidden border border-white/[0.04] transition-all duration-300"
                  style={{
                    width: SIZE_WIDTHS[previewSize],
                    maxWidth: '100%',
                  }}
                >
                  <SectionPreviewRenderer section={previewSection} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[0.8rem] text-white/20">Select a section to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="px-5 py-3 border-t border-white/[0.06] flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-[0.7rem] font-medium text-white/40 hover:text-white/60 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-2 bg-gold text-obsidian font-semibold uppercase tracking-[0.12em] text-[0.7rem] rounded hover:bg-gold-light transition-colors"
            >
              Add Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
