import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { AboutValuesContent } from '@/lib/types';

type ValueItem = { id: string; num?: string; title: string; text: string };

export function AboutValuesEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutValuesContent;
  const values = data.values || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />

      <FieldGroup title={`Values (${values.length})`}>
        <ListManager
          items={values}
          onChange={(updated) => onChange({ ...data, values: updated })}
          onAdd={() => onChange({ ...data, values: [...values, { id: uid(), num: String(values.length + 1).padStart(2, '0'), title: '', text: '' }] })}
          label="Value"
          renderItem={(item: ValueItem, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={item.num || ''} onChange={(e) => update({ num: e.target.value })} placeholder="01" />
                <AdminInput label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <AdminTextarea label="Text" value={item.text} onChange={(e) => update({ text: e.target.value })} rows={2} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
