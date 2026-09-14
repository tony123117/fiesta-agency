import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { AboutStoryContent } from '@/lib/types';

export function AboutStoryEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutStoryContent;
  const paragraphs = data.paragraphs || [];
  const update = (fields: Partial<AboutStoryContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => update({ eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      {paragraphs.map((p, i) => (
        <AdminTextarea key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(e) => {
          const updated = [...paragraphs];
          updated[i] = e.target.value;
          update({ paragraphs: updated });
        }} rows={3} />
      ))}
      <AdminTextarea label="Add Paragraph" value="" onChange={(e) => {
        if (e.target.value.trim()) {
          update({ paragraphs: [...paragraphs, e.target.value.trim()] });
        }
      }} rows={2} placeholder="Type and press enter to add" />
      <ImageField label="Image" value={data.image || ''} onChange={(v) => update({ image: v })} />
    </div>
  );
}
