import { useState, useEffect } from 'react';
import { AdminButton, AdminInput, AdminTextarea, AdminToggle, Toast } from '@/components/admin/AdminUI';
import { ImageField } from '@/components/admin/pages/editors/EditorHelpers';
import { createService, updateService } from '@/lib/servicesService';
import { generateSlug } from '@/lib/slug';
import type { Service } from '@/lib/types';

interface ServiceEditorProps {
  service: Service | null;
  onSaved: (service: Service) => void;
  onClosed: () => void;
}

export function ServiceEditor({ service, onSaved, onClosed }: ServiceEditorProps) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    details: { items: [] as string[] },
    image_url: '',
    image_alt: '',
    published: true,
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!!service);

  useEffect(() => {
    if (service) {
      setForm({
        title: service.title,
        slug: service.slug,
        description: service.description || '',
        details: service.details || { items: [] },
        image_url: service.image_url || '',
        image_alt: service.image_alt || '',
        published: service.published,
        featured: service.featured || false,
      });
    } else {
      setForm({
        title: '',
        slug: '',
        description: '',
        details: { items: [] },
        image_url: '',
        image_alt: '',
        published: true,
        featured: false,
      });
    }
    setErrors({});
    setSlugTouched(!!service);
  }, [service]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (service) {
        const updated = await updateService(service.id, form);
        onSaved(updated);
      } else {
        const created = await createService(form);
        onSaved(created);
      }
    } catch {
      setToast('Failed to save service');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif font-medium text-base tracking-tight text-ivory">
          {service ? 'Edit Service' : 'New Service'}
        </h2>
        <p className="text-[0.7rem] text-white/30 mt-1">
          {service ? 'Update the service details below.' : 'Fill in the details to create a new service.'}
        </p>
      </div>

      <div className="space-y-4">
        <AdminInput
          label="Title"
          name="title"
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            setForm((f) => ({
              ...f,
              title,
              ...(!slugTouched ? { slug: generateSlug(title) } : {}),
            }));
          }}
          required
          placeholder="e.g. Event Production"
          error={errors.title}
        />

        <AdminInput
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }}
          required
          placeholder="event-production"
          error={errors.slug}
        />

        <AdminTextarea
          label="Short Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Brief description of this service..."
        />

        <ImageField
          label="Cover Image"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
        />

        {form.image_url && (
          <AdminInput
            label="Image Alt Text"
            name="image_alt"
            value={form.image_alt}
            onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
            placeholder="Describe the image for accessibility..."
          />
        )}

        <div className="space-y-3">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
            Service Items
          </label>
          <div className="space-y-2">
            {form.details.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[0.55rem] text-white/20 w-4">{i + 1}.</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const items = [...form.details.items];
                    items[i] = e.target.value;
                    setForm({ ...form, details: { items } });
                  }}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-[0.8rem] text-ivory rounded transition-colors focus:border-gold/40 focus:outline-none"
                  placeholder="Service item..."
                />
                <AdminButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const items = form.details.items.filter((_, j) => j !== i);
                    setForm({ ...form, details: { items } });
                  }}
                  className="text-red-400/60 hover:text-red-400"
                >
                  Remove
                </AdminButton>
              </div>
            ))}
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => setForm({ ...form, details: { items: [...form.details.items, ''] } })}
            >
              + Add Item
            </AdminButton>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <AdminToggle
            label="Published"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
          <AdminToggle
            label="Featured"
            checked={form.featured}
            onChange={(v) => setForm({ ...form, featured: v })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
        <AdminButton variant="ghost" onClick={onClosed}>Cancel</AdminButton>
        <AdminButton onClick={handleSave} loading={saving}>
          {saving ? 'Saving...' : service ? 'Save Changes' : 'Create Service'}
        </AdminButton>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
