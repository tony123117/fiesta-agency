// ── Responsive Block Panel ──
// Shared responsive override controls for all block editors.
// Three tabs (Desktop / Tablet / Mobile) with visibility, width, alignment, spacing.

import { useState } from 'react';
import { AdminToggle } from '@/components/admin/AdminUI';
import type { Block, BlockWidth, BlockSpacing, BlockResponsiveOverrides } from '@/lib/blockTypes';

type TabKey = 'desktop' | 'tablet' | 'mobile';

const BREAKPOINT_TABS: { key: TabKey; label: string }[] = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
];

const WIDTH_OPTIONS: { value: BlockWidth; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: '2/3', label: '2/3' },
  { value: '1/2', label: '1/2' },
  { value: '1/3', label: '1/3' },
  { value: '1/4', label: '1/4' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
] as const;

const SPACING_OPTIONS: { value: BlockSpacing; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

interface ResponsiveBlockPanelProps {
  responsive: Block['responsive'];
  onResponsiveChange: (r: Block['responsive']) => void;
  showWidth?: boolean;
  showAlignment?: boolean;
  showSpacing?: boolean;
  showStack?: boolean;
}

export function ResponsiveBlockPanel({
  responsive,
  onResponsiveChange,
  showWidth = true,
  showAlignment = true,
  showSpacing = true,
  showStack = false,
}: ResponsiveBlockPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('desktop');

  const update = (tab: TabKey, patch: Partial<BlockResponsiveOverrides>) => {
    onResponsiveChange({
      ...responsive,
      [tab]: { ...responsive[tab], ...patch },
    });
  };

  const current = responsive[activeTab] || {};
  const desktop = responsive.desktop || {};
  const isVisible = activeTab === 'desktop' ? (current.visible ?? true) : (current.visible ?? true);
  const hasOverrides = activeTab !== 'desktop' && (
    current.visible !== undefined ||
    current.width !== undefined ||
    current.alignment !== undefined ||
    current.spacing !== undefined ||
    current.stack !== undefined
  );

  return (
    <div className="space-y-3">
      <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">
        Responsive
      </h4>

      {/* Breakpoint tabs */}
      <div className="flex gap-0.5 bg-white/[0.03] rounded-md p-0.5">
        {BREAKPOINT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-1.5 text-[0.6rem] font-medium rounded transition-colors ${
              activeTab === tab.key
                ? 'bg-gold/15 text-gold'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="space-y-3 pt-1">
        {/* Visibility */}
        <AdminToggle
          label="Visible"
          checked={isVisible}
          onChange={(v) => update(activeTab, { visible: v })}
        />

        {activeTab !== 'desktop' && hasOverrides && (
          <button
            onClick={() => onResponsiveChange({
              ...responsive,
              [activeTab]: {},
            })}
            className="text-[0.55rem] text-white/25 hover:text-white/40 transition-colors"
          >
            Reset to desktop
          </button>
        )}

        {/* Width override */}
        {showWidth && (
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
              Width {activeTab !== 'desktop' && current.width === undefined && (
                <span className="normal-case tracking-normal text-white/20 ml-1">(inherits desktop)</span>
              )}
            </label>
            <div className="flex gap-1 flex-wrap">
              {WIDTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update(activeTab, { width: opt.value })}
                  className={`px-2 py-1 text-[0.6rem] rounded border transition-colors ${
                    (activeTab === 'desktop' ? desktop.width : current.width) === opt.value
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Alignment override */}
        {showAlignment && (
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
              Alignment {activeTab !== 'desktop' && current.alignment === undefined && (
                <span className="normal-case tracking-normal text-white/20 ml-1">(inherits desktop)</span>
              )}
            </label>
            <div className="flex gap-1">
              {ALIGNMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update(activeTab, { alignment: opt.value })}
                  className={`flex-1 py-1.5 text-[0.6rem] rounded border transition-colors ${
                    (activeTab === 'desktop' ? desktop.alignment : current.alignment) === opt.value
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacing override */}
        {showSpacing && (
          <div className="space-y-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
              Spacing {activeTab !== 'desktop' && current.spacing === undefined && (
                <span className="normal-case tracking-normal text-white/20 ml-1">(inherits desktop)</span>
              )}
            </label>
            <div className="flex gap-1 flex-wrap">
              {SPACING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update(activeTab, { spacing: opt.value })}
                  className={`px-2 py-1 text-[0.6rem] rounded border transition-colors ${
                    (activeTab === 'desktop' ? desktop.spacing : current.spacing) === opt.value
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stack toggle (mobile) */}
        {showStack && activeTab === 'mobile' && (
          <AdminToggle
            label="Stack vertically"
            checked={current.stack ?? true}
            onChange={(v) => update('mobile', { stack: v })}
          />
        )}
      </div>
    </div>
  );
}
