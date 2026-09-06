import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { ProcessContent, ProcessStep } from '@/lib/types';

export function ProcessEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ProcessContent;
  const steps = data.steps || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />

      <FieldGroup title={`Steps (${steps.length})`}>
        <ListManager
          items={steps}
          onChange={(updated) => onChange({ ...data, steps: updated })}
          onAdd={() => onChange({ ...data, steps: [...steps, { id: uid(), number: String(steps.length + 1).padStart(2, '0'), title: '', description: '', image: '' }] })}
          label="Step"
          renderItem={(step: ProcessStep, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={step.number} onChange={(e) => update({ number: e.target.value })} placeholder="01" />
                <AdminInput label="Title" value={step.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <AdminTextarea label="Description" value={step.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
              <ImageField label="Step Image (optional)" value={step.image || ''} onChange={(v) => update({ image: v })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
