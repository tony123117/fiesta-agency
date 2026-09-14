import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { ContactLocationContent } from '@/lib/types';

export function ContactLocationEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ContactLocationContent;
  const update = (fields: Partial<ContactLocationContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />
      <ImageField label="Map / Location Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
    </div>
  );
}
