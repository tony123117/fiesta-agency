import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { FAQContent, FAQItem } from '@/lib/types';

export function FAQEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as FAQContent;
  const items = data.items || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />

      <FieldGroup title="Questions">
        <ListManager
          items={items}
          onChange={(updated) => onChange({ ...data, items: updated })}
          onAdd={() => onChange({ ...data, items: [...items, { id: uid(), question: '', answer: '' }] })}
          label="Question"
          renderItem={(item: FAQItem, i, update) => (
            <div className="space-y-3">
              <AdminInput label="Question" value={item.question} onChange={(e) => update({ question: e.target.value })} />
              <AdminTextarea label="Answer" value={item.answer} onChange={(e) => update({ answer: e.target.value })} rows={3} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
