import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminLoading, Toast } from '@/components/admin/AdminUI';
import type { PortfolioProject } from '@/lib/types';

const CATEGORIES = ['Wedding', 'Celebration', 'Corporate', 'Private', 'Production'];

export function PortfolioForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    title: '', slug: '', category: 'Wedding', description: '', year: '',
    cover_image: '', cover_alt: '', published: true, sort_order: 0,
  });
  const [storyParas, setStoryParas] = useState<string[]>([]);
  const [storyInput, setStoryInput] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('portfolio_projects').select('*').eq('id', id).maybeSingle();
      if (data) {
        const p = data as PortfolioProject;
        setForm({
          title: p.title, slug: p.slug, category: p.category, description: p.description || '',
          year: p.year ? String(p.year) : '', cover_image: p.cover_image || '', cover_alt: p.cover_alt || '',
          published: p.published, sort_order: p.sort_order,
        });
        setStoryParas(p.story?.paragraphs || []);
        setGallery(Array.isArray(p.gallery) ? p.gallery : []);
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
      year: form.year ? parseInt(form.year) : null,
      story: { paragraphs: storyParas },
      gallery,
    };

    if (isEdit) {
      const { error } = await supabase.from('portfolio_projects').update(payload).eq('id', id!);
      setToast({ message: error ? 'Update failed' : 'Project updated', type: error ? 'error' : 'success' });
    } else {
      const { error } = await supabase.from('portfolio_projects').insert(payload);
      if (!error) { navigate('/admin/portfolio'); return; }
      setToast({ message: 'Create failed', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <PageHeader title={isEdit ? 'Edit Project' : 'New Project'} action={
        <button onClick={() => navigate('/admin/portfolio')}>
          <AdminButton variant="outline"><ArrowLeft size={14} /> Back</AdminButton>
        </button>
      } />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: isEdit ? form.slug : slugify(v) })} required />
        <AdminInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <AdminInput label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} type="number" />
        </div>
        <AdminInput label="Cover Image URL" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} />
        <AdminInput label="Cover Alt Text" value={form.cover_alt} onChange={(v) => setForm({ ...form, cover_alt: v })} />

        {/* Story paragraphs */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">Story Paragraphs</label>
          <div className="flex gap-2 mb-3">
            <textarea
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              placeholder="Add a story paragraph..."
              rows={2}
              className="flex-1 bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none resize-none"
            />
            <button type="button" onClick={() => { if (storyInput) { setStoryParas([...storyParas, storyInput]); setStoryInput(''); } }}
              className="px-3 py-2 bg-charcoal border border-charcoal-border text-ivory hover:border-gold transition-colors self-start">
              <Plus size={16} />
            </button>
          </div>
          {storyParas.length > 0 && (
            <div className="space-y-2">
              {storyParas.map((para, i) => (
                <div key={i} className="flex gap-2 bg-obsidian border border-charcoal-border p-3">
                  <p className="flex-1 text-sm text-ivory-muted">{para.slice(0, 100)}{para.length > 100 ? '...' : ''}</p>
                  <button type="button" onClick={() => setStoryParas(storyParas.filter((_, j) => j !== i))}
                    className="text-red-400 hover:text-red-300 shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">Gallery Images</label>
          <div className="flex gap-2 mb-3">
            <input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Paste image URL..."
              className="flex-1 bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none" />
            <button type="button" onClick={() => { if (galleryInput) { setGallery([...gallery, galleryInput]); setGalleryInput(''); } }}
              className="px-3 py-2 bg-charcoal border border-charcoal-border text-ivory hover:border-gold transition-colors">
              <Plus size={16} />
            </button>
          </div>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover" />
                  <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-obsidian/80 text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Sort Order" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} type="number" />
        </div>
        <AdminToggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} />

        <div className="flex gap-3 pt-4">
          <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}</AdminButton>
          <button onClick={() => navigate('/admin/portfolio')}><AdminButton variant="ghost">Cancel</AdminButton></button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
