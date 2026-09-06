import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { TextImageContent } from '@/lib/types';

export function TextImageEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as TextImageContent;
  const update = (fields: Partial<TextImageContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Body" value={data.body || ''} onChange={(e) => update({ body: e.target.value })} rows={5} />
      <ImageField label="Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
      <AdminInput label="Image Alt Text" value={data.image_alt || ''} onChange={(e) => update({ image_alt: e.target.value })} placeholder="Descriptive text for image" />
      <AdminSelect label="Image Position" value={data.image_position || 'right'} onChange={(e) => update({ image_position: e.target.value as TextImageContent['image_position'] })}>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </AdminSelect>
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="CTA Text" value={data.cta_text || ''} onChange={(e) => update({ cta_text: e.target.value })} />
        <AdminInput label="CTA URL" value={data.cta_url || ''} onChange={(e) => update({ cta_url: e.target.value })} />
      </div>
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => update({ variant: e.target.value as TextImageContent['variant'] })}>
        <option value="default">Default</option>
        <option value="split">Split</option>
      </AdminSelect>
    </div>
  );
}
