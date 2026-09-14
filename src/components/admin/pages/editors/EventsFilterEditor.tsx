import { AdminInput } from '@/components/admin/AdminUI';
import type { EventsFilterContent } from '@/lib/types';

export function EventsFilterEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as EventsFilterContent;
  const update = (fields: Partial<EventsFilterContent>) => onChange({ ...data, ...fields });

  const categories = data.categories || [];

  const addCategory = () => update({ categories: [...categories, ''] });
  const updateCategory = (i: number, v: string) => {
    const next = [...categories];
    next[i] = v;
    update({ categories: next });
  };
  const removeCategory = (i: number) => update({ categories: categories.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Categories</label>
        {categories.map((c, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <AdminInput value={c} onChange={(e) => updateCategory(i, e.target.value)} className="flex-1" />
            <button type="button" onClick={() => removeCategory(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addCategory} className="text-xs text-amber-400 hover:text-amber-300">+ Add Category</button>
      </div>
    </div>
  );
}
