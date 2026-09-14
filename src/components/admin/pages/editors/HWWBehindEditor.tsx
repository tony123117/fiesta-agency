import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { HWWBehindContent } from '@/lib/types';

export function HWWBehindEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as HWWBehindContent;
  const images = data.images || [];
  const update = (fields: Partial<HWWBehindContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => update({ description: e.target.value })} rows={3} />

      <FieldGroup title={`Behind the Scenes Images (${images.length})`}>
        <ListManager
          items={images}
          onChange={(updated) => onChange({ ...data, images: updated })}
          onAdd={() => onChange({ ...data, images: [...images, uid()] })}
          label="Image"
          renderItem={(item: string, i, update) => (
            <ImageField label={`Image ${i + 1}`} value={item} onChange={(v) => update(v)} />
          )}
        />
      </FieldGroup>
    </div>
  );
}
