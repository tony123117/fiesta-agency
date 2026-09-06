import { AdminInput } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField } from './EditorHelpers';
import type { CinematicImageContent } from '@/lib/types';

export function CinematicImageEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as CinematicImageContent;

  return (
    <div className="space-y-6">
      <FieldGroup title="Image">
        <ImageField label="Background Image" value={data.image || ''} onChange={(v) => onChange({ ...data, image: v })} />
        <ImageField label="Mobile Image (optional)" value={data.mobile_image || ''} onChange={(v) => onChange({ ...data, mobile_image: v })} />
        <AdminInput label="Alt Text" value={data.image_alt || ''} onChange={(e) => onChange({ ...data, image_alt: e.target.value })} />
      </FieldGroup>

      <FieldGroup title="Focal Point">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">Horizontal ({Math.round((data.focal_x ?? 0.5) * 100)}%)</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={data.focal_x ?? 0.5}
            onChange={(e) => onChange({ ...data, focal_x: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">Vertical ({Math.round((data.focal_y ?? 0.5) * 100)}%)</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={data.focal_y ?? 0.5}
            onChange={(e) => onChange({ ...data, focal_y: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Caption">
        <AdminInput label="Caption Text" value={data.caption || ''} onChange={(e) => onChange({ ...data, caption: e.target.value })} placeholder="Optional editorial caption" />
        <div className="space-y-2">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">Caption Alignment</label>
          <div className="flex gap-2">
            {(['left', 'center'] as const).map((align) => (
              <button
                key={align}
                onClick={() => onChange({ ...data, caption_alignment: align })}
                className={`px-3 py-1.5 text-[0.7rem] rounded border transition-colors ${
                  data.caption_alignment === align
                    ? 'border-gold/50 text-gold bg-gold/10'
                    : 'border-white/[0.08] text-white/40 hover:text-white/60'
                }`}
              >
                {align === 'left' ? 'Left' : 'Center'}
              </button>
            ))}
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}
