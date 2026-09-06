import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminButton, AdminInput, AdminTextarea, AdminToggle, AdminSelect, Toast } from '@/components/admin/AdminUI';

export function CMSPageEditor({ pageSlug }: { pageSlug: string }) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', body: '', image_url: '', image_alt: '', layout: 'default', published: true });
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: p } = await supabase.from('pages').select('*').eq('slug', pageSlug).single();
    if (p) {
      setPage(p);
      const { data: s } = await supabase.from('sections').select('*').eq('page_id', p.id).order('sort_order');
      setSections((s || []) as any[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [pageSlug]);

  const handleSave = async () => {
    const payload = { ...form, page_id: page?.id };
    if (editing) {
      await supabase.from('sections').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('sections').insert(payload);
    }
    load(); setShowForm(false); setEditing(null); setForm({ title: '', subtitle: '', body: '', image_url: '', image_alt: '', layout: 'default', published: true });
    setToast('Saved');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    await supabase.from('sections').delete().eq('id', id);
    load(); setToast('Deleted'); setTimeout(() => setToast(null), 3000);
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const [a, b] = [sections[idx], sections[targetIdx]];
    await Promise.all([
      supabase.from('sections').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('sections').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  };

  const handleTogglePublish = async (section: any) => {
    await supabase.from('sections').update({ published: !section.published }).eq('id', section.id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <PageHeader title={pageSlug.toUpperCase()} action={
        <AdminButton onClick={() => { setEditing(null); setForm({ title: '', subtitle: '', body: '', image_url: '', image_alt: '', layout: 'default', published: true }); setShowForm(true); }}><Plus size={14} /> Add Section</AdminButton>
      } />

      {sections.length === 0 ? (
        <AdminCard><p style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No sections yet. Click "Add Section" to create one.</p></AdminCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map((section, i) => (
            <AdminCard key={section.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto auto', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>0{i + 1}</span>
              <div>
                <p style={{ fontWeight: 500 }}>{section.title}</p>
                {section.subtitle && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{section.subtitle}</p>}
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', ...(section.published ? { color: '#D6A856' } : { color: 'rgba(255,255,255,0.4)' })} }>
                {section.published ? 'Published' : 'Hidden'}
              </span>
              {section.image_url && <img src={section.image_url} alt={section.image_alt} style={{ width: '4rem', height: '2.5rem', objectFit: 'cover' }} />}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AdminButton variant="ghost" size="sm" onClick={() => handleReorder(section.id, 'up')} disabled={i === 0}><ChevronUp size={14} /></AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => handleReorder(section.id, 'down')} disabled={i === sections.length - 1}><ChevronDown size={14} /></AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => { setEditing(section); setForm(section); setShowForm(true); }}><Pencil size={14} /> Edit</AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => handleTogglePublish(section)}>{section.published ? <EyeOff size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <Eye size={14} style={{ color: '#D6A856' }} />}</AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(section.id)}><Trash2 size={14} style={{ color: '#f87171' }} /></AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <AdminCard style={{ width: '100%', maxWidth: '48rem', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Section' : 'New Section'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <AdminInput label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <AdminTextarea label="Body (JSON or text)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} />
              <AdminInput label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <AdminInput label="Image Alt" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} />
              <AdminSelect label="Layout" value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })}>
                <option value="default">Default</option>
                <option value="split">Split</option>
                <option value="full">Full Width</option>
              </AdminSelect>
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
export default CMSPageEditor;

