import { AdminInput } from '@/components/admin/AdminUI';
import { ImageField } from './EditorHelpers';
import type { ContactCTAContent } from '@/lib/types';

export function ContactCTAEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ContactCTAContent;
  const update = (fields: Partial<ContactCTAContent>) => onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => update({ heading: e.target.value })} />
      <ImageField label="Background Image" value={data.background_image || ''} onChange={(v) => update({ background_image: v })} />
    </div>
  );
}
