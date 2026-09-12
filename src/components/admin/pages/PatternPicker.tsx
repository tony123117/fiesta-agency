// ── Pattern Picker ──
// Modal for selecting and inserting reusable block patterns.
// Each insertion creates independent copies with fresh IDs.

import { useState } from 'react';
import { X, Layout, Columns3, Image, Quote, Grid3X3, ArrowRight } from 'lucide-react';
import { BLOCK_PATTERNS, type BlockPattern } from '@/lib/blockPatterns';

const CATEGORY_CONFIG: Record<BlockPattern['category'], { label: string; icon: typeof Layout }> = {
  hero: { label: 'Hero', icon: Layout },
  editorial: { label: 'Editorial', icon: Columns3 },
  features: { label: 'Features', icon: Grid3X3 },
  social: { label: 'Social', icon: Quote },
  gallery: { label: 'Gallery', icon: Image },
  conversion: { label: 'Conversion', icon: ArrowRight },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as BlockPattern['category'][];

export function PatternPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (pattern: BlockPattern) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<BlockPattern['category']>('hero');

  if (!open) return null;

  const filtered = BLOCK_PATTERNS.filter((p) => p.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Insert pattern"
    >
      <div
        className="w-full max-w-3xl bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="font-serif font-medium text-base tracking-tight text-ivory">
              Insert Pattern
            </h2>
            <p className="text-[0.65rem] text-white/30 mt-0.5">
              Pre-designed block layouts. Each insertion creates an independent copy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="px-5 pt-3 flex gap-1 border-b border-white/[0.06]">
          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] rounded-t transition-all ${
                  isActive
                    ? 'bg-white/[0.04] text-gold border-b-2 border-gold'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                <Icon size={12} />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Pattern grid */}
        <div className="p-5 overflow-y-auto max-h-[50vh]">
          {filtered.length === 0 ? (
            <p className="text-[0.7rem] text-white/30 text-center py-8">No patterns in this category.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => { onSelect(pattern); onClose(); }}
                  className="group text-left p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:border-gold/30 hover:bg-gold/[0.03] transition-all"
                >
                  {/* Pattern preview — block type icons */}
                  <div className="flex items-center gap-1 mb-3">
                    {pattern.blocks().slice(0, 6).map((block, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded bg-white/[0.06] border border-white/[0.08] flex items-center justify-center"
                      >
                        <span className="text-[0.4rem] font-mono text-white/30 uppercase">
                          {block.type === 'heading' ? 'H' : block.type === 'text' ? 'T' : block.type === 'image' ? 'I' : block.type === 'button' ? 'B' : 'S'}
                        </span>
                      </div>
                    ))}
                    {pattern.blocks().length > 6 && (
                      <span className="text-[0.45rem] text-white/20">+{pattern.blocks().length - 6}</span>
                    )}
                  </div>
                  <h3 className="text-[0.75rem] font-medium text-ivory/80 group-hover:text-ivory transition-colors mb-1">
                    {pattern.name}
                  </h3>
                  <p className="text-[0.6rem] text-white/30 leading-relaxed">
                    {pattern.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
