import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { HWWWhyContent } from '@/lib/types';

type PrincipleItem = { num: string; title: string; text: string };

export function HWWWhyEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as HWWWhyContent;
  const principles = data.principles || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />

      <FieldGroup title={`Principles (${principles.length})`}>
        <ListManager
          items={principles}
          onChange={(updated) => onChange({ ...data, principles: updated })}
          onAdd={() => onChange({ ...data, principles: [...principles, { num: String(principles.length + 1).padStart(2, '0'), title: '', text: '' }] })}
          label="Principle"
          renderItem={(item: PrincipleItem, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={item.num} onChange={(e) => update({ num: e.target.value })} placeholder="01" />
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
