import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { ImageCarouselContent, CarouselImage } from '@/lib/types';

export function ImageCarouselEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ImageCarouselContent;
  const images = data.images || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />

      <FieldGroup title={`Images (${images.length})`}>
        <ListManager
          items={images}
          onChange={(updated) => onChange({ ...data, images: updated })}
          onAdd={() => onChange({ ...data, images: [...images, { id: uid(), src: '', alt: '' }] })}
          label="Image"
          renderItem={(img: CarouselImage, i, update) => (
            <div className="space-y-3">
              <ImageField label="Image" value={img.src || ''} onChange={(v) => update({ src: v })} />
              <AdminInput label="Alt Text" value={img.alt || ''} onChange={(e) => update({ alt: e.target.value })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
