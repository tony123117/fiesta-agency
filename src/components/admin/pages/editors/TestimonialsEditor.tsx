import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { TestimonialsContent, TestimonialItem } from '@/lib/types';

export function TestimonialsEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as TestimonialsContent;
  const items = data.testimonials || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => onChange({ ...data, variant: e.target.value })}>
        <option value="default">Default</option>
        <option value="carousel">Carousel</option>
      </AdminSelect>

      <FieldGroup title={`Testimonials (${items.length})`}>
        <ListManager
          items={items}
          onChange={(updated) => onChange({ ...data, testimonials: updated })}
          onAdd={() => onChange({ ...data, testimonials: [...items, { id: uid(), quote: '', client_name: '', event_type: '', location: '', image_url: '' }] })}
          label="Testimonial"
          renderItem={(item: TestimonialItem, i, update) => (
            <div className="space-y-3">
              <AdminTextarea label="Quote" value={item.quote} onChange={(e) => update({ quote: e.target.value })} rows={3} />
              <AdminInput label="Client Name" value={item.client_name} onChange={(e) => update({ client_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Event Type" value={item.event_type} onChange={(e) => update({ event_type: e.target.value })} />
                <AdminInput label="Location" value={item.location} onChange={(e) => update({ location: e.target.value })} />
              </div>
              <ImageField label="Client Image (optional)" value={item.image_url} onChange={(v) => update({ image_url: v })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
