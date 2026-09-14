import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import type { EventsCTAContent } from '@/lib/types';

export function EventsCTAEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as EventsCTAContent;
  const update = (fields: Partial<EventsCTAContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Button Text" value={data.button_text || ''} onChange={(e) => update({ button_text: e.target.value })} />
        <AdminInput label="Button URL" value={data.button_url || ''} onChange={(e) => update({ button_url: e.target.value })} />
      </div>
    </div>
  );
}
