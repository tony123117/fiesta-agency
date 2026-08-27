import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle, StatusBadge, AdminLoading, EmptyState, Toast } from '@/components/admin/AdminUI';
import type { Testimonial } from '@/lib/types';

export function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems((data || []) as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
    setToast('Testimonial deleted');
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = items.filter((t) => !search || t.client_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Testimonials" action={
        <AdminButton onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={14} /> Add Testimonial</AdminButton>
      } />

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search testimonials..."
          className="w-full bg-charcoal border border-charcoal-border pl-10 pr-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No testimonials yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="bg-charcoal border border-charcoal-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-serif text-lg italic text-ivory mb-2">"{t.quote}"</p>
                  <p className="text-sm text-gold">{t.client_name}</p>
                  <p className="text-xs text-ivory-muted">{t.event_type}{t.location && ` • ${t.location}`}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {t.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(t); setShowForm(true); }} className="text-ivory-muted hover:text-gold p-1"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-ivory-muted hover:text-red-400 p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TestimonialForm
          item={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function TestimonialForm({ item, onClose, onSaved }: { item: Testimonial | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    client_name: item?.client_name || '', quote: item?.quote || '', event_type: item?.event_type || '',
    location: item?.location || '', image_url: item?.image_url || '', published: item?.published ?? true,
    sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (item) {
      await supabase.from('testimonials').update(form).eq('id', item.id);
    } else {
      await supabase.from('testimonials').insert(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-charcoal border border-charcoal-border p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-ivory">{item ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onClose} className="text-ivory-muted hover:text-ivory"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput label="Client Name" value={form.client_name} onChange={(v) => setForm({ ...form, client_name: v })} required />
          <AdminTextarea label="Quote" value={form.quote} onChange={(v) => setForm({ ...form, quote: v })} rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Event Type" value={form.event_type} onChange={(v) => setForm({ ...form, event_type: v })} />
            <AdminInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
          <AdminInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminToggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
          <div className="flex gap-3 pt-2">
            <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</AdminButton>
            <button onClick={onClose}><AdminButton variant="ghost">Cancel</AdminButton></button>
          </div>
        </form>
      </div>
    </div>
  );
}
