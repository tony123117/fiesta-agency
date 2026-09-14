import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import type { AboutMissionContent } from '@/lib/types';

export function AboutMissionEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutMissionContent;
  const update = (fields: Partial<AboutMissionContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Body" value={data.body || ''} onChange={(e) => update({ body: e.target.value })} rows={4} />
    </div>
  );
}
