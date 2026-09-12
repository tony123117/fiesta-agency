import { useState } from 'react';
import { AdminInput } from '@/components/admin/AdminUI';
import { ImageField } from '../editors/EditorHelpers';
import { ResponsiveBlockPanel } from './ResponsiveBlockPanel';
import type { ImageContent, BlockWidth, BlockSpacing, BlockAspectRatio, Block } from '@/lib/blockTypes';

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

const ASPECT_OPTIONS: { value: BlockAspectRatio; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: '16:9', label: '16:9' },
  { value: '4:3', label: '4:3' },
  { value: '1:1', label: '1:1' },
  { value: '3:4', label: '3:4' },
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

function FocalPointEditor({
  src,
  focalPoint,
  onChange,
}: {
  src: string;
  focalPoint: { x: number; y: number } | null;
  onChange: (fp: { x: number; y: number } | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const pos = focalPoint || { x: 50, y: 50 };

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  if (!src) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">Focal Point</label>
        {focalPoint && (
          <button
            onClick={() => onChange(null)}
            className="text-[0.55rem] text-white/30 hover:text-white/50 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <div
        className="relative w-full h-24 rounded overflow-hidden cursor-crosshair border border-white/[0.08]"
        onMouseDown={(e) => { setDragging(true); handleInteraction(e); }}
        onMouseMove={(e) => { if (dragging) handleInteraction(e); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <img src={src} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      </div>
      <p className="text-[0.5rem] text-white/20">Click to set the focal point for cropping</p>
    </div>
  );
}

export function ImageEditor({
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
  const c = content as unknown as ImageContent;
  const update = (patch: Partial<ImageContent>) => onChange({ ...content, ...patch } as Record<string, unknown>);

  return (
    <div className="space-y-4">
      {/* Media */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Media</h4>
        <ImageField
          label="Image"
          value={c.src}
          onChange={(src) => update({ src })}
        />
        <AdminInput
          label="Alt Text"
          name="alt"
          value={c.alt}
          onChange={(e) => update({ alt: e.target.value })}
          placeholder="Describe the image"
        />
        <AdminInput
          label="Caption"
          name="caption"
          value={c.caption}
          onChange={(e) => update({ caption: e.target.value })}
          placeholder="Optional caption"
        />
        <FocalPointEditor
          src={c.src}
          focalPoint={c.focalPoint}
          onChange={(focalPoint) => update({ focalPoint })}
        />
        <AdminInput
          label="Link URL"
          name="link"
          value={c.link}
          onChange={(e) => update({ link: e.target.value })}
          placeholder="/page or https://..."
        />
      </div>

      {/* Display */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Display</h4>
        <OptionGroup
          label="Width"
          value={c.width}
          options={WIDTH_OPTIONS}
          onChange={(width) => update({ width })}
        />
        <OptionGroup
          label="Aspect Ratio"
          value={c.aspectRatio}
          options={ASPECT_OPTIONS}
          onChange={(aspectRatio) => update({ aspectRatio })}
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
          label="Border Radius"
          name="borderRadius"
          type="number"
          value={String(c.borderRadius)}
          onChange={(e) => update({ borderRadius: Number(e.target.value) })}
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
          showWidth
          showAlignment
          showSpacing
        />
      )}
    </div>
  );
}
