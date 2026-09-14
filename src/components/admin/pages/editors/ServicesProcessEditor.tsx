import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { ServicesProcessContent } from '@/lib/types';

type StepItem = { id: string; number: string; title: string; description: string };

export function ServicesProcessEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ServicesProcessContent;
  const steps = data.steps || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />

      <FieldGroup title={`Steps (${steps.length})`}>
        <ListManager
          items={steps}
          onChange={(updated) => onChange({ ...data, steps: updated })}
          onAdd={() => onChange({ ...data, steps: [...steps, { id: uid(), number: String(steps.length + 1).padStart(2, '0'), title: '', description: '' }] })}
          label="Step"
          renderItem={(step: StepItem, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={step.number} onChange={(e) => update({ number: e.target.value })} placeholder="01" />
                <AdminInput label="Title" value={step.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <AdminTextarea label="Description" value={step.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
