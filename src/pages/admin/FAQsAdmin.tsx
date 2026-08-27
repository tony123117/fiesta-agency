import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle, StatusBadge, AdminLoading, EmptyState, Toast } from '@/components/admin/AdminUI';
import type { FAQ } from '@/lib/types';

export function FAQsAdmin() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    setItems((data || []) as FAQ[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    load();
    setToast('FAQ deleted');
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="FAQs" action={
        <AdminButton onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={14} /> Add FAQ</AdminButton>
      } />

      {items.length === 0 ? (
        <EmptyState title="No FAQs yet." />
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="bg-charcoal border border-charcoal-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-ivory font-medium mb-1">{f.question}</p>
                  <p className="text-sm text-ivory-muted">{f.answer}</p>
                  <p className="text-xs text-gold mt-2 uppercase tracking-wider">{f.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {f.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(f); setShowForm(true); }} className="text-ivory-muted hover:text-gold p-1"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(f.id)} className="text-ivory-muted hover:text-red-400 p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <FAQForm item={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function FAQForm({ item, onClose, onSaved }: { item: FAQ | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    question: item?.question || '', answer: item?.answer || '', category: item?.category || 'General',
    published: item?.published ?? true, sort_order: item?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (item) {
      await supabase.from('faqs').update(form).eq('id', item.id);
    } else {
      await supabase.from('faqs').insert(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-charcoal border border-charcoal-border p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-ivory">{item ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button onClick={onClose} className="text-ivory-muted hover:text-ivory"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput label="Question" value={form.question} onChange={(v) => setForm({ ...form, question: v })} required />
          <AdminTextarea label="Answer" value={form.answer} onChange={(v) => setForm({ ...form, answer: v })} rows={4} required />
          <AdminInput label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
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
