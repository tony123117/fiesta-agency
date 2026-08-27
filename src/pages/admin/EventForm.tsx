import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  PageHeader, AdminButton, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminLoading, Toast,
} from '@/components/admin/AdminUI';
import type { EventItem, EventStatus } from '@/lib/types';

const CATEGORIES = ['Wedding', 'Celebration', 'Corporate', 'Private', 'Production'];
const STATUSES: EventStatus[] = ['upcoming', 'completed', 'cancelled'];

export function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: 'Wedding', event_date: '',
    location: '', cover_image: '', cover_alt: '', status: 'upcoming' as EventStatus,
    featured: false, published: true, sort_order: 0,
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
      if (data) {
        const ev = data as EventItem;
        setForm({
          title: ev.title, slug: ev.slug, description: ev.description || '', category: ev.category,
          event_date: ev.event_date || '', location: ev.location || '', cover_image: ev.cover_image || '',
          cover_alt: ev.cover_alt || '', status: ev.status, featured: ev.featured,
          published: ev.published, sort_order: ev.sort_order,
        });
        setGallery(Array.isArray(ev.gallery) ? ev.gallery : []);
      }
      setLoading(false);
    })();
  }, [id]);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      event_date: form.event_date || null,
      gallery,
    };

    if (isEdit) {
      const { error } = await supabase.from('events').update(payload).eq('id', id!);
      setToast({ message: error ? 'Update failed' : 'Event updated', type: error ? 'error' : 'success' });
    } else {
      const { error } = await supabase.from('events').insert(payload);
      if (error) {
        setToast({ message: 'Create failed', type: 'error' });
      } else {
        navigate('/admin/events');
        return;
      }
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const addGalleryItem = () => {
    if (galleryInput) { setGallery([...gallery, galleryInput]); setGalleryInput(''); }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <PageHeader title={isEdit ? 'Edit Event' : 'New Event'} action={
        <button onClick={() => navigate('/admin/events')}>
          <AdminButton variant="outline"><ArrowLeft size={14} /> Back</AdminButton>
        </button>
      } />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: isEdit ? form.slug : slugify(v) })} required />
        <AdminInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <AdminSelect label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as EventStatus })}
            options={STATUSES.map((s) => ({ value: s, label: s }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Event Date" value={form.event_date} onChange={(v) => setForm({ ...form, event_date: v })} type="date" />
          <AdminInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        </div>
        <AdminInput label="Cover Image URL" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} />
        <AdminInput label="Cover Alt Text" value={form.cover_alt} onChange={(v) => setForm({ ...form, cover_alt: v })} />

        {/* Gallery */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">Gallery Images</label>
          <div className="flex gap-2 mb-3">
            <input
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
            />
            <button type="button" onClick={addGalleryItem} className="px-3 py-2 bg-charcoal border border-charcoal-border text-ivory hover:border-gold transition-colors">
              <Plus size={16} />
            </button>
          </div>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-obsidian/80 text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Sort Order" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" />
        </div>

        <div className="flex gap-6">
          <AdminToggle label="Featured" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
          <AdminToggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
        </div>

        <div className="flex gap-3 pt-4">
          <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}</AdminButton>
          <button onClick={() => navigate('/admin/events')}>
            <AdminButton variant="ghost">Cancel</AdminButton>
          </button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
