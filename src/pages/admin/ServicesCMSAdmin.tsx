import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle, AdminLoading, EmptyState, Toast } from '@/components/admin/AdminUI';
import type { Service } from '@/lib/types';

export function ServicesCMSAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices((data || []) as Service[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
    setToast('Service deleted');
    setTimeout(() => setToast(null), 3000);
  };

  const move = async (svc: Service, dir: 'up' | 'down') => {
    const idx = services.findIndex((s) => s.id === svc.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const swap = services[swapIdx];
    await Promise.all([
      supabase.from('services').update({ sort_order: swap.sort_order }).eq('id', svc.id),
      supabase.from('services').update({ sort_order: svc.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Services CMS" action={
        <AdminButton onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={14} /> Add Service</AdminButton>
      } />

      {services.length === 0 ? (
        <EmptyState title="No services yet." />
      ) : (
        <div className="space-y-3">
          {services.map((s, i) => (
            <div key={s.id} className="bg-charcoal border border-charcoal-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  {s.image_url && <img src={s.image_url} alt="" className="w-16 h-16 object-cover" />}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gold">0{i + 1}</span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${s.published ? 'text-green-400 border-green-900' : 'text-zinc-400 border-zinc-800'}`}>
                        {s.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-ivory font-medium">{s.title}</p>
                    <p className="text-xs text-ivory-muted mt-1 line-clamp-2">{s.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => move(s, 'up')} disabled={i === 0} className="text-ivory-muted hover:text-gold p-1 disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button onClick={() => move(s, 'down')} disabled={i === services.length - 1} className="text-ivory-muted hover:text-gold p-1 disabled:opacity-30"><ArrowDown size={14} /></button>
                  <button onClick={() => { setEditing(s); setShowForm(true); }} className="text-ivory-muted hover:text-gold p-1"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-ivory-muted hover:text-red-400 p-1"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ServiceForm item={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function ServiceForm({ item, onClose, onSaved }: { item: Service | null; onClose: () => void; onSaved: () => void }) {
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const [form, setForm] = useState({
    title: item?.title || '', slug: item?.slug || '', description: item?.description || '',
    image_url: item?.image_url || '', image_alt: item?.image_alt || '',
    published: item?.published ?? true, sort_order: item?.sort_order ?? 0,
  });
  const [items, setItems] = useState<string[]>(item?.details?.items || []);
  const [itemInput, setItemInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title), details: { items } };
    if (item) {
      await supabase.from('services').update(payload).eq('id', item.id);
    } else {
      await supabase.from('services').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-charcoal border border-charcoal-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-ivory">{item ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="text-ivory-muted hover:text-ivory"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: item ? form.slug : slugify(v) })} required />
          <AdminInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
          <AdminInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminInput label="Image Alt Text" value={form.image_alt} onChange={(v) => setForm({ ...form, image_alt: v })} />

          {/* Items list */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">Service Items</label>
            <div className="flex gap-2 mb-2">
              <input value={itemInput} onChange={(e) => setItemInput(e.target.value)} placeholder="Add item..."
                className="flex-1 bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none" />
              <button type="button" onClick={() => { if (itemInput) { setItems([...items, itemInput]); setItemInput(''); } }}
                className="px-3 py-2 bg-charcoal border border-charcoal-border text-ivory hover:border-gold transition-colors"><Plus size={16} /></button>
            </div>
            {items.length > 0 && (
              <ul className="space-y-1">
                {items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between bg-obsidian border border-charcoal-border px-3 py-2">
                    <span className="text-sm text-ivory">{it}</span>
                    <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-300"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
