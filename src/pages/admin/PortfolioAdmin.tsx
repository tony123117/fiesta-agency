import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminButton, EmptyState, Toast, ConfirmDialog } from '@/components/admin/AdminUI';
import type { PortfolioProject } from '@/lib/types';

const CATEGORIES = ['All', 'Concerts', 'Weddings', 'Corporate', 'Festivals', 'Parties'] as const;
type Filter = typeof CATEGORIES[number];

export function PortfolioAdmin() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; item: PortfolioProject | null }>({ open: false, item: null });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('portfolio_projects').select('*').order('sort_order');
    setProjects((data || []) as PortfolioProject[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (item: PortfolioProject) => {
    setDeleteConfirm({ open: true, item });
  };

  const confirmDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;
    setDeleteConfirm({ open: false, item: null });
    const storagePath = item.cover_image?.split('/storage/v1/object/public/media/')[1];
    if (storagePath) {
      const { error: storageError } = await supabase.storage.from('media').remove([storagePath]);
      if (storageError && import.meta.env.DEV) console.error('Failed to remove storage file:', storageError);
    }
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', item.id);
    if (error) {
      setToast('Failed to delete project');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    load();
    setToast('Project deleted');
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'All' && p.category !== filter) return false;
    return true;
  });

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <PageHeader title="PORTFOLIO" action={<Link to="/admin/portfolio/new"><AdminButton><Plus size={14} /> Create Project</AdminButton></Link>} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
            style={{ width: '100%', background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.5rem 0.5rem 2.5rem', color: 'white', fontSize: '0.875rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {CATEGORIES.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.5rem 1rem', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: '50px', ...(filter === f ? { background: '#D6A856', color: '#090909' } : { background: '#1E1E1E', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' })} }>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No portfolio projects yet." subtitle="Create your first project to showcase your work." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: '1rem' }}>
          {filtered.map((p) => (
            <AdminCard key={p.id} style={{ position: 'relative' }}>
              <img src={p.cover_image} alt={p.title} style={{ width: '100%', height: '8rem', objectFit: 'cover', marginBottom: '0.75rem' }} />
              <span style={{ fontSize: '0.5625rem', color: '#D6A856' }}>{p.category}{p.year ? ` • ${p.year}` : ''}</span>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.125rem', marginTop: '0.25rem' }}>{p.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to={`/admin/portfolio/${p.id}/edit`} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.25rem' }}>Edit</Link>
                <button onClick={() => handleDelete(p)} style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: '#f87171', color: 'white', border: 'none', borderRadius: '0.25rem' }}>Delete</button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete project"
        message={`Are you sure you want to delete "${deleteConfirm.item?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, item: null })}
      />
      {toast && <Toast message={toast} />}
    </div>
  );
}
export default PortfolioAdmin;

