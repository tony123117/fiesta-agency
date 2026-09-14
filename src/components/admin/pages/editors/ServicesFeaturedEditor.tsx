import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { ServicesFeaturedContent } from '@/lib/types';

export function ServicesFeaturedEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ServicesFeaturedContent;
  const update = (fields: Partial<ServicesFeaturedContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />
      <ImageField label="Featured Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
      <AdminInput label="Label" value={data.label || ''} onChange={(e) => update({ label: e.target.value })} />
      <AdminTextarea label="Label Text" value={data.label_text || ''} onChange={(e) => update({ label_text: e.target.value })} rows={2} />
      <AdminInput label="Link Text" value={data.link_text || ''} onChange={(e) => update({ link_text: e.target.value })} />
    </div>
  );
}
