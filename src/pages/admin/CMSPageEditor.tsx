import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminButton, AdminInput, AdminTextarea, AdminToggle, AdminSelect, Toast, ConfirmDialog } from '@/components/admin/AdminUI';

interface CMSPage {
  id: string;
  slug: string;
  title: string;
}

interface CMSSection {
  id: string;
  page_id: string;
  title: string;
  subtitle: string;
  body: string;
  image_url: string;
  image_alt: string;
  layout: string;
  published: boolean;
  sort_order: number;
}

export function CMSPageEditor({ pageSlug }: { pageSlug: string }) {
  const [page, setPage] = useState<CMSPage | null>(null);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CMSSection | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', body: '', image_url: '', image_alt: '', layout: 'default', published: true });
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const load = async () => {
    setLoading(true);
    const { data: p, error: pageError } = await supabase.from('pages').select('*').eq('slug', pageSlug).maybeSingle();
    if (pageError || !p) {
      setToast(pageError?.message || 'Page not found');
      setLoading(false);
      return;
    }
    setPage(p);
    const { data: s } = await supabase.from('sections').select('*').eq('page_id', p.id).order('sort_order');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSections((s || []) as any[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [pageSlug]);

  const handleSave = async () => {
    const payload = { ...form, page_id: page?.id };
    let result;
    if (editing) {
      result = await supabase.from('sections').update(payload).eq('id', editing.id);
    } else {
      result = await supabase.from('sections').insert(payload);
    }
    if (result.error) {
      setToast('Failed to save');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load(); setShowForm(false); setEditing(null); setForm({ title: '', subtitle: '', body: '', image_url: '', image_alt: '', layout: 'default', published: true });
    setToast('Saved');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ open: false, id: '' });
    const { error } = await supabase.from('sections').delete().eq('id', id);
    if (error) {
      setToast('Failed to delete');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load(); setToast('Deleted'); setTimeout(() => setToast(null), 3000);
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const [a, b] = [sections[idx], sections[targetIdx]];
    const results = await Promise.all([
      supabase.from('sections').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('sections').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    if (results.some(r => r.error)) {
      setToast('Failed to reorder');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTogglePublish = async (section: any) => {
    const { error } = await supabase.from('sections').update({ published: !section.published }).eq('id', section.id);
    if (error) {
      setToast('Failed to toggle publish');
      setTimeout(() => setToast(null), 3000);
      return;
    }
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
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: '' })}
      />
      {toast && <Toast message={toast} />}
    </div>
  );
}
export default CMSPageEditor;

