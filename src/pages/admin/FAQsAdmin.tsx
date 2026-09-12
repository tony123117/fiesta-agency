import { useEffect, useState } from 'react';
import { Trash2, Plus, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminButton, AdminInput, AdminTextarea, AdminToggle, StatusBadge, Toast, ConfirmDialog } from '@/components/admin/AdminUI';
import type { FAQ } from '@/lib/types';

export function FAQsAdmin() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', published: true });
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const load = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    setItems((data || []) as FAQ[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    let result;
    if (editing) {
      result = await supabase.from('faqs').update(form).eq('id', editing.id);
    } else {
      result = await supabase.from('faqs').insert(form);
    }
    if (result.error) {
      setToast('Failed to save');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load(); setShowForm(false); setEditing(null); setForm({ question: '', answer: '', category: 'General', published: true });
    setToast('Saved');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ open: false, id: '' });
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) {
      setToast('Failed to delete');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load(); setToast('Deleted'); setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <PageHeader title="FAQS" action={<AdminButton onClick={() => { setEditing(null); setForm({ question: '', answer: '', category: 'General', published: true }); setShowForm(true); }}><Plus size={14} /> Add FAQ</AdminButton>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((f) => (
          <AdminCard key={f.id}>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', fontSize: '1.125rem' }}>{f.question}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>{f.answer}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.625rem', color: '#D6A856' }}>{f.category}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AdminButton variant="ghost" size="sm" onClick={() => { setEditing(f); setForm(f); setShowForm(true); }}><Edit size={14} /> Edit</AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(f.id)}><Trash2 size={14} style={{ color: '#f87171' }} /></AdminButton>
                <StatusBadge status={f.published ? 'published' : 'draft'} />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {items.length === 0 && <AdminCard><p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No FAQs yet.</p></AdminCard>}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <AdminCard style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AdminInput label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
              <AdminTextarea label="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} required />
              <AdminInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <AdminToggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <AdminButton variant="ghost" onClick={() => setShowForm(false)}>Cancel</AdminButton>
                <AdminButton type="submit">Save</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: '' })}
      />
      {toast && <Toast message={toast} />}
    </div>
  );
}
export default FAQsAdmin;

