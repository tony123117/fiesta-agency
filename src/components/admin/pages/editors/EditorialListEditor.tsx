import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { EditorialListContent, EditorialListItem } from '@/lib/types';

export function EditorialListEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as EditorialListContent;
  const items = data.items || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />

      <FieldGroup title={`Items (${items.length})`}>
        <ListManager
          items={items}
          onChange={(updated) => onChange({ ...data, items: updated })}
          onAdd={() => onChange({ ...data, items: [...items, { id: uid(), number: String(items.length + 1).padStart(2, '0'), title: '', description: '' }] })}
          label="Item"
          renderItem={(item: EditorialListItem, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={item.number} onChange={(e) => update({ number: e.target.value })} placeholder="01" />
                <AdminInput label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <AdminTextarea label="Description" value={item.description || ''} onChange={(e) => update({ description: e.target.value })} rows={2} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
