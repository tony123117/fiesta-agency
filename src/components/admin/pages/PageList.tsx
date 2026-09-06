import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
import { PageHeader, AdminLoading, AdminButton, EmptyState, Toast } from '@/components/admin/AdminUI';
import { getPages, deletePage, publishPage, unpublishPage } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import CreatePageModal from './CreatePageModal';
import type { Page, Section } from '@/lib/types';

export function PageList() {
  const [pages, setPages] = useState<(Page & { section_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPages();
      const withCounts = await Promise.all(
        data.map(async (p) => {
          const sections = await getSections(p.id);
          return { ...p, section_count: sections.length };
        })
      );
      setPages(withCounts);
    } catch {
      setToast('Failed to load pages');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  const handleTogglePublish = async (page: Page) => {
    try {
      if (page.published) {
        await unpublishPage(page.id);
        setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, published: false } : p));
        setToast('Page unpublished');
      } else {
        await publishPage(page.id);
        setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, published: true } : p));
        setToast('Page published');
      }
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (page: Page) => {
    if (!confirm(`Delete "${page.title}"?\n\nAll sections will be removed.`)) return;
    try {
      await deletePage(page.id);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      setToast('Page deleted');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Delete failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <AdminLoading text="Loading pages..." />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold mb-0.5">PAGES</p>
          <h1 className="font-serif font-medium text-xl tracking-tight text-ivory">Pages</h1>
          <p className="text-[0.8rem] text-white/40 mt-1">Manage the structure and content of your public website.</p>
        </div>
        <AdminButton onClick={() => setShowCreateModal(true)}>+ New Page</AdminButton>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          title="No pages yet"
          subtitle="Create your first page to start building the website."
          action={<AdminButton size="sm" onClick={() => setShowCreateModal(true)}>+ New Page</AdminButton>}
        />
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="hidden md:flex items-center gap-4 px-3 pb-2 border-b border-white/[0.06]">
            <div className="flex-1 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Page</div>
            <div className="w-20 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Status</div>
            <div className="w-20 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Sections</div>
            <div className="w-24 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20 text-right">Actions</div>
          </div>

          {pages.map((page) => (
            <div key={page.id} className="group flex items-center gap-4 py-4 px-3 border-b border-white/[0.04] hover:bg-white/[0.015] -mx-3 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-[0.85rem] text-ivory font-medium truncate group-hover:text-gold transition-colors">
                  {page.title}
                </p>
                <p className="text-[0.65rem] text-white/25">/{page.slug}</p>
              </div>

              <button
                onClick={() => handleTogglePublish(page)}
                className="w-20 shrink-0 flex items-center gap-1.5"
                aria-label={page.published ? 'Unpublish page' : 'Publish page'}
              >
                <span className={`w-2 h-2 rounded-full ${page.published ? 'bg-green-400/60' : 'bg-white/15'}`} />
                <span className={`text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${page.published ? 'text-green-400/50' : 'text-white/20'}`}>
                  {page.published ? 'LIVE' : 'DRAFT'}
                </span>
              </button>

              <div className="w-20 shrink-0 text-[0.7rem] text-white/30">
                {page.section_count} section{page.section_count !== 1 ? 's' : ''}
              </div>

              <div className="w-24 shrink-0 flex items-center justify-end gap-1">
                <Link
                  to={`/admin/pages/${page.id}`}
                  className="group/edit inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/30 hover:text-gold transition-colors px-2 py-1.5"
                >
                  Edit
                </Link>
                <Link
                  to={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded text-white/20 hover:text-white/50 transition-colors"
                  title="Preview on website"
                  aria-label="Preview page on public website"
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} />}

      <CreatePageModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
