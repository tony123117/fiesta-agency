import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { AboutIntroContent } from '@/lib/types';

export function AboutHeroEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutIntroContent;
  const update = (fields: Partial<AboutIntroContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Body" value={data.body || ''} onChange={(e) => update({ body: e.target.value })} rows={3} />
      <ImageField label="Primary Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
      <ImageField label="Secondary Image" value={data.image2 || ''} onChange={(v) => update({ image2: v })} />
    </div>
  );
}
