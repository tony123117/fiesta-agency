import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { HWWIntroContent } from '@/lib/types';

export function HWWIntroEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as HWWIntroContent;
  const update = (fields: Partial<HWWIntroContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />
      <ImageField label="Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Link Text" value={data.link_text || ''} onChange={(e) => update({ link_text: e.target.value })} />
        <AdminInput label="Link URL" value={data.link_url || ''} onChange={(e) => update({ link_url: e.target.value })} />
      </div>
    </div>
  );
}
