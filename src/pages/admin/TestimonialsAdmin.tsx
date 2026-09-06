import { useEffect, useState } from 'react';
import { Trash2, Plus, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminButton, AdminInput, AdminTextarea, AdminToggle, StatusBadge, Toast } from '@/components/admin/AdminUI';
import type { Testimonial } from '@/lib/types';

export function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ client_name: '', quote: '', event_type: '', location: '', image_url: '', published: true });
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems((data || []) as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) {
      await supabase.from('testimonials').update(form).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert(form);
    }
    load(); setShowForm(false); setEditing(null); setForm({ client_name: '', quote: '', event_type: '', location: '', image_url: '', published: true });
    setToast('Saved');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load(); setToast('Deleted'); setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <PageHeader title="TESTIMONIALS" action={<AdminButton onClick={() => { setEditing(null); setForm({ client_name: '', quote: '', event_type: '', location: '', image_url: '', published: true }); setShowForm(true); }}><Plus size={14} /> Add Testimonial</AdminButton>} />

      <div style={{ marginBottom: '1.5rem' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client name..." style={{ width: '100%', maxWidth: '24rem', background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', color: 'white' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.filter(t => t.client_name.toLowerCase().includes(search.toLowerCase())).map((t) => (
          <AdminCard key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <p style={{ fontWeight: 500 }}>{t.client_name}</p>
                {t.event_type && <span style={{ fontSize: '0.75rem', color: '#D6A856' }}>{t.event_type}</span>}
                {t.location && <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.location}</span>}
                <StatusBadge status={t.published ? 'published' : 'draft'} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <AdminButton variant="ghost" size="sm" onClick={() => { setEditing(t); setForm(t); setShowForm(true); }}><Edit size={14} /> Edit</AdminButton>
              <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(t.id)}><Trash2 size={14} style={{ color: '#f87171' }} /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>

      {items.length === 0 && <AdminCard><p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No testimonials yet.</p></AdminCard>}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <AdminCard style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AdminInput label="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
              <AdminTextarea label="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} required />
              <AdminInput label="Event Type" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} />
              <AdminInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <AdminInput label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <AdminToggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <AdminButton variant="ghost" onClick={() => setShowForm(false)}>Cancel</AdminButton>
                <AdminButton type="submit">Save</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
export default TestimonialsAdmin;

