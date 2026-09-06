import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { StatsContent, StatItem } from '@/lib/types';

export function StatsEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as StatsContent;
  const stats = data.stats || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => onChange({ ...data, variant: e.target.value })}>
        <option value="default">Default</option>
        <option value="compact">Compact</option>
      </AdminSelect>

      <FieldGroup title={`Stats (${stats.length})`}>
        <ListManager
          items={stats}
          onChange={(updated) => onChange({ ...data, stats: updated })}
          onAdd={() => onChange({ ...data, stats: [...stats, { id: uid(), number: '', label: '' }] })}
          label="Stat"
          renderItem={(item: StatItem, i, update) => (
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Number" value={item.number} onChange={(e) => update({ number: e.target.value })} placeholder="500+" />
              <AdminInput label="Label" value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="EVENTS CREATED" />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
