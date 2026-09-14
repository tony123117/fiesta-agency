import { AdminInput } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { AboutClosingContent } from '@/lib/types';

export function AboutClosingEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutClosingContent;
  const update = (fields: Partial<AboutClosingContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="CTA Text" value={data.cta_text || ''} onChange={(e) => update({ cta_text: e.target.value })} />
        <AdminInput label="CTA URL" value={data.cta_url || ''} onChange={(e) => update({ cta_url: e.target.value })} />
      </div>
      <ImageField label="Background Image" value={data.background_image || ''} onChange={(v) => update({ background_image: v })} />
    </div>
  );
}
