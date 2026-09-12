import { AdminInput, AdminToggle } from '@/components/admin/AdminUI';
import { ResponsiveBlockPanel } from './ResponsiveBlockPanel';
import type { ButtonContent, BlockSpacing, Block } from '@/lib/blockTypes';

const SPACING_OPTIONS: { value: BlockSpacing; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

const ICON_PRESETS = [
  '', 'ArrowRight', 'ArrowUpRight', 'ChevronRight', 'ChevronDown',
  'Phone', 'Mail', 'Calendar', 'MapPin', 'Download', 'ExternalLink',
  'Play', 'Pause', 'Star', 'Heart', 'Check', 'Plus', 'Search',
];

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">{label}</label>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 text-[0.65rem] rounded border transition-colors ${
              value === opt.value
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ButtonEditor({
  content,
  onChange,
  responsive,
  onResponsiveChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
  responsive?: Block['responsive'];
  onResponsiveChange?: (r: Block['responsive']) => void;
}) {
  const c = content as unknown as ButtonContent;
  const update = (patch: Partial<ButtonContent>) => onChange({ ...content, ...patch } as Record<string, unknown>);

  return (
    <div className="space-y-4">
      {/* Content */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Content</h4>
        <AdminInput
          label="Button Text"
          name="text"
          value={c.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Click here"
        />
        <AdminInput
          label="URL"
          name="url"
          value={c.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="/contact or https://..."
        />
        <div className="space-y-1.5">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">Icon</label>
          <div className="flex gap-1 flex-wrap">
            {ICON_PRESETS.map((icon) => (
              <button
                key={icon || 'none'}
                onClick={() => update({ icon })}
                className={`px-2 py-1 text-[0.6rem] rounded border transition-colors ${
                  c.icon === icon
                    ? 'bg-gold/15 text-gold border-gold/30'
                    : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
                }`}
                title={icon || 'No icon'}
              >
                {icon ? icon.replace(/([A-Z])/g, ' $1').trim() : 'None'}
              </button>
            ))}
          </div>
        </div>
        <AdminToggle
          label="Open in new tab"
          checked={c.openNewTab}
          onChange={(v) => update({ openNewTab: v })}
        />
      </div>

      {/* Style */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Style</h4>
        <OptionGroup
          label="Variant"
          value={c.variant}
          options={[
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'ghost', label: 'Ghost' },
          ]}
          onChange={(variant) => update({ variant })}
        />
        <OptionGroup
          label="Size"
          value={c.size}
          options={[
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
          ]}
          onChange={(size) => update({ size })}
        />
        <OptionGroup
          label="Alignment"
          value={c.alignment}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
          onChange={(alignment) => update({ alignment })}
        />
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Spacing</h4>
        <OptionGroup
          label="Spacing"
          value={c.spacing}
          options={SPACING_OPTIONS}
          onChange={(spacing) => update({ spacing })}
        />
      </div>

      {/* Responsive */}
      {responsive && onResponsiveChange && (
        <ResponsiveBlockPanel
          responsive={responsive}
          onResponsiveChange={onResponsiveChange}
          showWidth={false}
          showAlignment
          showSpacing
        />
      )}
    </div>
  );
}
