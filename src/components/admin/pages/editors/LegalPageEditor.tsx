import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import type { LegalPageContent } from '@/lib/types';

export function LegalPageEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as LegalPageContent;
  const update = (fields: Partial<LegalPageContent>) => onChange({ ...data, ...fields });

  const sections = data.sections || [];

  const addSection = () => update({ sections: [...sections, { heading: '', content: '' }] });
  const updateSection = (i: number, field: 'heading' | 'content', v: string) => {
    const next = [...sections];
    next[i] = { ...next[i], [field]: v };
    update({ sections: next });
  };
  const removeSection = (i: number) => update({ sections: sections.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Page Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Content Sections</label>
        {sections.map((s, i) => (
          <div key={i} className="border border-white/10 rounded p-3 mb-3 space-y-2">
            <AdminInput label={`Section ${i + 1} Heading`} value={s.heading} onChange={(e) => updateSection(i, 'heading', e.target.value)} />
            <AdminTextarea label="Content" value={s.content} onChange={(e) => updateSection(i, 'content', e.target.value)} rows={4} />
            <button type="button" onClick={() => removeSection(i)} className="text-red-400 hover:text-red-300 text-xs">Remove Section</button>
          </div>
        ))}
        <button type="button" onClick={addSection} className="text-xs text-amber-400 hover:text-amber-300">+ Add Section</button>
      </div>
    </div>
  );
}
