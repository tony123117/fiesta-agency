import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, StatusBadge, AdminLoading, EmptyState } from '@/components/admin/AdminUI';
import type { PortfolioProject } from '@/lib/types';

export function PortfolioAdmin() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('portfolio_projects').select('*').order('sort_order');
    setProjects((data || []) as PortfolioProject[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('portfolio_projects').delete().eq('id', id);
    load();
  };

  const filtered = projects.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Portfolio" action={
        <Link to="/admin/portfolio/new"><AdminButton><Plus size={14} /> New Project</AdminButton></Link>
      } />

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-charcoal border border-charcoal-border pl-10 pr-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No projects yet." subtitle="Create your first portfolio project." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-charcoal border border-charcoal-border group">
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.cover_image && <img src={p.cover_image} alt="" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link to={`/admin/portfolio/${p.id}/edit`}>
                    <button className="p-2 bg-obsidian/80 text-gold hover:text-ivory transition-colors"><Pencil size={16} /></button>
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-obsidian/80 text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ivory-muted uppercase tracking-wider">{p.category}{p.year ? ` • ${p.year}` : ''}</span>
                  {p.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                </div>
                <h3 className="font-serif text-lg text-ivory">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
