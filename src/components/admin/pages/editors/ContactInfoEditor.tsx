import { AdminInput } from '@/components/admin/AdminUI';
import type { ContactInfoContent } from '@/lib/types';

export function ContactInfoEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ContactInfoContent;
  const update = (fields: Partial<ContactInfoContent>) => onChange({ ...data, ...fields });

  const eventTypes = data.event_types || [];

  const addType = () => update({ event_types: [...eventTypes, ''] });
  const updateType = (i: number, v: string) => {
    const next = [...eventTypes];
    next[i] = v;
    update({ event_types: next });
  };
  const removeType = (i: number) => update({ event_types: eventTypes.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminInput label="Email" type="email" value={data.email || ''} onChange={(e) => update({ email: e.target.value })} placeholder="hello@fiestaagency.example" />
      <AdminInput label="Phone" value={data.phone || ''} onChange={(e) => update({ phone: e.target.value })} placeholder="+1 (555) 000-0000" />
      <AdminInput label="Address" value={data.address || ''} onChange={(e) => update({ address: e.target.value })} placeholder="Design Studio, Lagos · London · Dubai" />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Event Types</label>
        {eventTypes.map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <AdminInput value={t} onChange={(e) => updateType(i, e.target.value)} className="flex-1" />
            <button type="button" onClick={() => removeType(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addType} className="text-xs text-amber-400 hover:text-amber-300">+ Add Event Type</button>
      </div>
    </div>
  );
}
