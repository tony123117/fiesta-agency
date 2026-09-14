import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ListManager, uid } from './EditorHelpers';
import type { HWWProcessContent } from '@/lib/types';

type HWWStep = { num: string; title: string; description: string };

export function HWWProcessEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as HWWProcessContent;
  const steps = data.steps || [];

  return (
    <div className="space-y-6">
      <FieldGroup title={`Steps (${steps.length})`}>
        <ListManager
          items={steps}
          onChange={(updated) => onChange({ ...data, steps: updated })}
          onAdd={() => onChange({ ...data, steps: [...steps, { num: String(steps.length + 1).padStart(2, '0'), title: '', description: '' }] })}
          label="Step"
          renderItem={(step: HWWStep, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Number" value={step.num} onChange={(e) => update({ num: e.target.value })} placeholder="01" />
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
