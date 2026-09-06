import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { CTAContent } from '@/lib/types';

export function CTAEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as CTAContent;
  const update = (fields: Partial<CTAContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Button Text" value={data.button_text || ''} onChange={(e) => update({ button_text: e.target.value })} />
        <AdminInput label="Button URL" value={data.button_url || ''} onChange={(e) => update({ button_url: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Secondary Button Text" value={data.secondary_button_text || ''} onChange={(e) => update({ secondary_button_text: e.target.value })} />
        <AdminInput label="Secondary Button URL" value={data.secondary_button_url || ''} onChange={(e) => update({ secondary_button_url: e.target.value })} />
      </div>
      <ImageField label="Background Image" value={data.background_image || ''} onChange={(v) => update({ background_image: v })} />
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => update({ variant: e.target.value as CTAContent['variant'] })}>
        <option value="default">Default</option>
        <option value="full-width">Full Width</option>
        <option value="minimal">Minimal</option>
      </AdminSelect>
    </div>
  );
}
