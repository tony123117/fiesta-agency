import { AdminInput } from '@/components/admin/AdminUI';
import { ResponsiveBlockPanel } from './ResponsiveBlockPanel';
import type { HeadingContent, BlockWidth, BlockSpacing, Block } from '@/lib/blockTypes';

const WIDTH_OPTIONS: { value: BlockWidth; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: '2/3', label: '2/3' },
  { value: '1/2', label: '1/2' },
  { value: '1/3', label: '1/3' },
  { value: '1/4', label: '1/4' },
];

const SPACING_OPTIONS: { value: BlockSpacing; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

function OptionGroup<T extends string | number>({
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
export function HeadingEditor({
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
  const c = content as unknown as HeadingContent;
  const update = (patch: Partial<HeadingContent>) => onChange({ ...content, ...patch } as Record<string, unknown>);

  return (
    <div className="space-y-4">
      {/* Content */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Content</h4>
        <AdminInput
          label="Text"
          name="text"
          value={c.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter heading"
        />
        <OptionGroup
          label="Level"
          value={c.level}
          options={[
            { value: 1 as const, label: 'H1' },
            { value: 2 as const, label: 'H2' },
            { value: 3 as const, label: 'H3' },
            { value: 4 as const, label: 'H4' },
            { value: 5 as const, label: 'H5' },
            { value: 6 as const, label: 'H6' },
          ]}
          onChange={(level) => update({ level })}
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
        <AdminInput
          label="Color"
          name="color"
          value={c.color}
          onChange={(e) => update({ color: e.target.value })}
          placeholder="e.g. #D6A64F or inherit"
        />
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Layout</h4>
        <OptionGroup
          label="Width"
          value={c.width}
          options={WIDTH_OPTIONS}
          onChange={(width) => update({ width })}
        />
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
          showWidth
          showAlignment
          showSpacing
        />
      )}
    </div>
  );
}
