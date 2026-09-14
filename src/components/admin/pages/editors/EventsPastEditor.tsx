import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import type { EventsPastContent } from '@/lib/types';

export function EventsPastEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as EventsPastContent;
  const update = (fields: Partial<EventsPastContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={2} />
    </div>
  );
}
