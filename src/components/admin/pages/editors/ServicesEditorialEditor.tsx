import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { ServicesEditorialContent, ServiceItem } from '@/lib/types';

export function ServicesEditorialEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ServicesEditorialContent;
  const services = data.services || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />
      <AdminSelect label="Variant" value={data.variant || 'default'} onChange={(e) => onChange({ ...data, variant: e.target.value })}>
        <option value="default">Default</option>
        <option value="compact">Compact</option>
      </AdminSelect>

      <FieldGroup title={`Services (${services.length})`}>
        <ListManager
          items={services}
          onChange={(updated) => onChange({ ...data, services: updated })}
          onAdd={() => onChange({ ...data, services: [...services, { id: uid(), title: '', slug: '', description: '', image_url: '', image_alt: '', featured: false }] })}
          label="Service"
          renderItem={(svc: ServiceItem, i, update) => (
            <div className="space-y-3">
              <AdminInput label="Title" value={svc.title} onChange={(e) => update({ title: e.target.value })} />
              <AdminInput label="Slug" value={svc.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="auto-generated from title" />
              <AdminTextarea label="Description" value={svc.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
              <ImageField label="Image" value={svc.image_url} onChange={(v) => update({ image_url: v })} />
              <AdminInput label="Image Alt Text" value={svc.image_alt} onChange={(e) => update({ image_alt: e.target.value })} placeholder="Descriptive text for image" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={svc.featured}
                  onChange={(e) => update({ featured: e.target.checked })}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                />
                <span className="text-[0.7rem] text-white/50">Featured service</span>
              </label>
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
