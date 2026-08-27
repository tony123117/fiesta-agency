import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle, AdminLoading, EmptyState, Toast } from '@/components/admin/AdminUI';
import type { Section, Page } from '@/lib/types';

export function CMSPageEditor({ pageSlug, pageTitle }: { pageSlug: string; pageTitle: string }) {
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Section | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: pageData } = await supabase.from('pages').select('*').eq('slug', pageSlug).maybeSingle();
    setPage(pageData as Page | null);
    if (pageData) {
      const { data: secData } = await supabase.from('sections').select('*').eq('page_id', pageData.id).order('sort_order');
      setSections((secData || []) as Section[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [pageSlug]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    await supabase.from('sections').delete().eq('id', id);
    load();
    setToast('Section deleted');
    setTimeout(() => setToast(null), 3000);
  };

  const moveSection = async (section: Section, dir: 'up' | 'down') => {
    const idx = sections.findIndex((s) => s.id === section.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const swap = sections[swapIdx];
    await Promise.all([
      supabase.from('sections').update({ sort_order: swap.sort_order }).eq('id', section.id),
      supabase.from('sections').update({ sort_order: section.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  const togglePublish = async (section: Section) => {
    await supabase.from('sections').update({ published: !section.published }).eq('id', section.id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title={pageTitle} action={
        <AdminButton onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={14} /> Add Section</AdminButton>
      } />

      {sections.length === 0 ? (
        <EmptyState title="No sections yet." subtitle="Add content sections to build this page." />
      ) : (
        <div className="space-y-3">
          {sections.map((s, i) => (
            <div key={s.id} className="bg-charcoal border border-charcoal-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {s.published ? (
                      <span className="text-[10px] uppercase tracking-wider text-green-400 border border-green-900 px-2 py-0.5">Published</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 border border-zinc-800 px-2 py-0.5">Hidden</span>
                    )}
                  </div>
                  {s.title && <p className="text-sm text-ivory font-medium">{s.title}</p>}
                  {s.subtitle && <p className="text-xs text-ivory-muted mt-1">{s.subtitle}</p>}
                  {s.image_url && <img src={s.image_url} alt="" className="w-24 h-16 object-cover mt-2" />}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveSection(s, 'up')} disabled={i === 0} className="text-ivory-muted hover:text-gold p-1 disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button onClick={() => moveSection(s, 'down')} disabled={i === sections.length - 1} className="text-ivory-muted hover:text-gold p-1 disabled:opacity-30"><ArrowDown size={14} /></button>
                  <button onClick={() => togglePublish(s)} className="text-ivory-muted hover:text-gold p-1"><Pencil size={14} /></button>
                  <button onClick={() => { setEditing(s); setShowForm(true); }} className="text-ivory-muted hover:text-gold p-1"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-ivory-muted hover:text-red-400 p-1"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && page && (
        <SectionForm
          pageId={page.id}
          section={editing}
          sortOrder={editing ? editing.sort_order : sections.length}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function SectionForm({ pageId, section, sortOrder, onClose, onSaved }: {
  pageId: string; section: Section | null; sortOrder: number; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: section?.title || '', subtitle: section?.subtitle || '',
    image_url: section?.image_url || '', image_alt: section?.image_alt || '',
    layout: section?.layout || 'default', published: section?.published ?? true,
    sort_order: section?.sort_order ?? sortOrder,
  });
  const [bodyText, setBodyText] = useState(
    section?.body ? JSON.stringify(section.body, null, 2) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let body = null;
    if (bodyText) {
      try { body = JSON.parse(bodyText); } catch { body = { text: bodyText }; }
    }
    const payload = { ...form, page_id: pageId, body };

    if (section) {
      await supabase.from('sections').update(payload).eq('id', section.id);
    } else {
      await supabase.from('sections').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-charcoal border border-charcoal-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-ivory">{section ? 'Edit Section' : 'Add Section'}</h2>
          <button onClick={onClose} className="text-ivory-muted hover:text-ivory"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <AdminInput label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
          <AdminTextarea label="Body (JSON or plain text)" value={bodyText} onChange={setBodyText} rows={5} />
          <AdminInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminInput label="Image Alt Text" value={form.image_alt} onChange={(v) => setForm({ ...form, image_alt: v })} />
          <AdminInput label="Layout" value={form.layout} onChange={(v) => setForm({ ...form, layout: v })} />
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
