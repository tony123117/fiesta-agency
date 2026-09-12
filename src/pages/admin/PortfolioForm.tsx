import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { PageHeader, AdminLoading, AdminInput, AdminTextarea, AdminSelect, AdminButton, AdminToggle, Toast } from '@/components/admin/AdminUI';
import type { PortfolioProject } from '@/lib/types';

export function PortfolioForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const galleryRef = useRef<HTMLInputElement>(null);
  const [project, setProject] = useState<Partial<PortfolioProject>>({
    title: '', slug: '', description: '', category: 'Concerts', year: new Date().getFullYear(),
    cover_image: '', cover_alt: '', sort_order: 0, published: true, story: { paragraphs: [] }, gallery: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    supabase.from('portfolio_projects').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setToast('Project not found');
      } else {
        setProject(data as PortfolioProject);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = project.slug || generateSlug(project.title || '');
    const payload = { ...project, slug };

    if (isEdit) {
      const { error } = await supabase.from('portfolio_projects').update(payload).eq('id', id);
      if (error) { setToast('Save failed'); setSaving(false); setTimeout(() => setToast(null), 3000); return; }
      setToast('Project updated');
    } else {
      const { error } = await supabase.from('portfolio_projects').insert(payload);
      if (error) { setToast('Create failed'); setSaving(false); setTimeout(() => setToast(null), 3000); return; }
      navigate('/admin/portfolio', { replace: true });
      return;
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <AdminLoading />;

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const ext = file.name.split('.').pop();
        const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('media').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      } catch {
        setToast(`Failed to upload ${file.name}`);
      }
    }
    if (newUrls.length > 0) {
      setProject((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...newUrls] }));
    }
    setUploadingGallery(false);
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', maxWidth: '56rem', margin: '0 auto' }}>
      <PageHeader title={isEdit ? 'EDIT PROJECT' : 'NEW PROJECT'} action={<Link to="/admin/portfolio"><ArrowLeft size={16} /></Link>} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AdminInput label="Title" name="title" value={project.title} onChange={(e) => {
          const title = e.target.value;
          setProject((prev) => ({ ...prev, title, ...(!slugTouched ? { slug: generateSlug(title) } : {}) }));
        }} required />
        <AdminInput label="Slug" name="slug" value={project.slug || ''} onChange={(e) => { setSlugTouched(true); setProject({ ...project, slug: e.target.value }); }} required placeholder="auto-generated-from-title" />
        <AdminTextarea label="Description" name="description" value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} rows={4} />
        <AdminSelect label="Category" name="category" value={project.category} onChange={(e) => setProject({ ...project, category: e.target.value })}>
          <option value="Concerts">Concerts</option>
          <option value="Weddings">Weddings</option>
          <option value="Corporate">Corporate</option>
          <option value="Festivals">Festivals</option>
          <option value="Parties">Parties</option>
        </AdminSelect>
        <AdminInput label="Year" type="number" name="year" value={project.year} onChange={(e) => setProject({ ...project, year: parseInt(e.target.value) || new Date().getFullYear() })} />
        <AdminInput label="Cover Image URL" name="cover_image" value={project.cover_image} onChange={(e) => setProject({ ...project, cover_image: e.target.value })} />
        <AdminInput label="Cover Alt Text" name="cover_alt" value={project.cover_alt} onChange={(e) => setProject({ ...project, cover_alt: e.target.value })} />
        <AdminInput label="Sort Order" type="number" name="sort_order" value={project.sort_order} onChange={(e) => setProject({ ...project, sort_order: parseInt(e.target.value) || 0 })} />
        <AdminToggle label="Published" checked={project.published} onChange={(v) => setProject({ ...project, published: v })} />

        <div>
          <label style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Story Paragraphs</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.story?.paragraphs?.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                <textarea value={p} onChange={(e) => { const arr = [...(project.story?.paragraphs || [])]; arr[i] = e.target.value; setProject({ ...project, story: { paragraphs: arr } }); }} style={{ flex: 1, background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', color: 'white', minHeight: '4rem', resize: 'vertical' }} />
                <button type="button" onClick={() => { const arr = [...(project.story?.paragraphs || [])]; arr.splice(i, 1); setProject({ ...project, story: { paragraphs: arr } }); }} style={{ background: '#f87171', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setProject({ ...project, story: { paragraphs: [...(project.story?.paragraphs || []), ''] } })} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px dashed rgba(255,255,255,0.3)', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Add Paragraph</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Gallery</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.gallery?.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'cover' }} />
                <button type="button" onClick={() => setProject({ ...project, gallery: (project.gallery || []).filter((_, j) => j !== i) })} style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: '#f87171', color: 'white', border: 'none', borderRadius: '50%', width: '1.25rem', height: '1.25rem' }}>×</button>
              </div>
            ))}
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => {
              if (!e.target.files) return;
              handleGalleryUpload(e.target.files);
            }} />
            <button type="button" onClick={() => galleryRef.current?.click()} disabled={uploadingGallery} style={{ width: '5rem', height: '5rem', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer', opacity: uploadingGallery ? 0.5 : 1 }}>
              {uploadingGallery ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Add Image'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <AdminButton type="submit" disabled={saving}>{saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : (isEdit ? 'Save Changes' : 'Create Project')}</AdminButton>
          <Link to="/admin/portfolio"><AdminButton variant="ghost">Cancel</AdminButton></Link>
        </div>
      </form>
      {toast && <Toast message={toast} />}
    </div>
  );
}
export default PortfolioForm;

