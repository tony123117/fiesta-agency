import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import type { BrandStatementContent } from '@/lib/types';

export function BrandStatementEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as BrandStatementContent;
  const update = (fields: Partial<BrandStatementContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} placeholder="THE FIESTA APPROACH" />
      <AdminInput label="Primary Text" value={data.primary_text || ''} onChange={(e) => update({ primary_text: e.target.value })} placeholder="WE DON'T JUST PLAN EVENTS." />
      <AdminInput label="Highlighted Text" value={data.highlighted_text || ''} onChange={(e) => update({ highlighted_text: e.target.value })} placeholder="WE CREATE EXPERIENCES PEOPLE REMEMBER." />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={4} />
      <AdminInput label="Metadata" value={data.metadata || ''} onChange={(e) => update({ metadata: e.target.value })} placeholder="RWANDA — EVENTS / ENTERTAINMENT / PRODUCTION" />
      <AdminInput label="Accent Word" value={data.accent_word || ''} onChange={(e) => update({ accent_word: e.target.value })} placeholder="REMEMBER" />
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => update({ variant: e.target.value as BrandStatementContent['variant'] })}>
        <option value="default">Default</option>
        <option value="centered">Centered</option>
      </AdminSelect>
    </div>
  );
}
