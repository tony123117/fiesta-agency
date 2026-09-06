import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { PortfolioGalleryContent, PortfolioGalleryItem } from '@/lib/types';

export function PortfolioGalleryEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as PortfolioGalleryContent;
  const items = data.items || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />
      <AdminSelect label="Variant" value={data.variant || 'grid'} onChange={(e) => onChange({ ...data, variant: e.target.value })}>
        <option value="grid">Grid</option>
        <option value="masonry">Masonry</option>
      </AdminSelect>

      <FieldGroup title={`Portfolio Items (${items.length})`}>
        <ListManager
          items={items}
          onChange={(updated) => onChange({ ...data, items: updated })}
          onAdd={() => onChange({ ...data, items: [...items, { id: uid(), image: '', title: '', category: '' }] })}
          label="Item"
          renderItem={(item: PortfolioGalleryItem, i, update) => (
            <div className="space-y-3">
              <AdminInput label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <AdminInput label="Category" value={item.category} onChange={(e) => update({ category: e.target.value })} />
              <ImageField label="Image" value={item.image} onChange={(v) => update({ image: v })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
