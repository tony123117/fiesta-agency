import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import type { EventsEditorialContent } from '@/lib/types';

export function EventsEditorialEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as EventsEditorialContent;
  const update = (fields: Partial<EventsEditorialContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={2} />
      <AdminInput label="Number of Events" type="number" value={data.limit || 3} onChange={(e) => update({ limit: parseInt(e.target.value) || 3 })} />
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={data.featured_only || false} onChange={(e) => update({ featured_only: e.target.checked })} className="rounded border-white/20" />
        <span className="text-[0.8rem] text-white/60">Featured only</span>
      </label>
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={data.upcoming_only || false} onChange={(e) => update({ upcoming_only: e.target.checked })} className="rounded border-white/20" />
        <span className="text-[0.8rem] text-white/60">Upcoming only</span>
      </label>
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => update({ variant: e.target.value as EventsEditorialContent['variant'] })}>
        <option value="default">Default</option>
        <option value="minimal">Minimal</option>
      </AdminSelect>
      <p className="text-[0.65rem] text-white/20">Events are pulled from the Events CMS. Configure display settings here.</p>
    </div>
  );
}
