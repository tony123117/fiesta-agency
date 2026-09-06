import { useEffect, useState, useCallback } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { PageHeader, AdminLoading, AdminButton, EmptyState, Toast } from '@/components/admin/AdminUI';
import { MediaGridItem } from './MediaGridItem';
import { MediaUpload } from './MediaUpload';
import { MediaDetail } from './MediaDetail';
import { getMedia, deleteMedia } from '@/lib/mediaService';
import type { MediaItem } from '@/lib/types';

type FilterType = 'all' | 'images' | 'videos';
type SortType = 'newest' | 'oldest' | 'name';

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedia({ search, type: filter, sort });
      setItems(data);
    } catch {
      setError('Unable to load media.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, sort]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}"?\n\nThis file will be permanently removed from storage.`)) return;
    try {
      await deleteMedia(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setToast('Media deleted');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Delete failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUploaded = (newItems: MediaItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
  };

  const handleDetailUpdated = (updated: MediaItem) => {
    setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    setDetailItem(updated);
  };

  const handleDetailDeleted = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const imageCount = items.filter((i) => i.mime_type?.startsWith('image/')).length;
  const videoCount = items.filter((i) => i.mime_type?.startsWith('video/')).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold mb-0.5">MEDIA</p>
          <h1 className="font-serif font-medium text-xl tracking-tight text-ivory">Media Library</h1>
          <p className="text-[0.8rem] text-white/40 mt-1">Manage the visual assets used across Fiesta.</p>
        </div>
        <div className="shrink-0">
          <MediaUpload onUploaded={handleUploaded} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or alt text..."
            className="w-full bg-white/[0.04] border border-white/[0.08] pl-9 pr-3 py-2 text-[0.8rem] text-ivory rounded transition-colors placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
          <FilterButton active={filter === 'images'} onClick={() => setFilter('images')}>Images ({imageCount})</FilterButton>
          <FilterButton active={filter === 'videos'} onClick={() => setFilter('videos')}>Videos ({videoCount})</FilterButton>
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-[0.7rem] text-white/60 rounded cursor-pointer focus:border-gold/40 focus:outline-none transition-colors hover:border-white/[0.15] appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A→Z</option>
        </select>
      </div>

      {/* Selection count */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 py-2 px-3 bg-gold/[0.05] border border-gold/20 rounded">
          <span className="text-[0.75rem] text-gold">{selectedIds.size} selected</span>
          <button onClick={() => setSelectedIds(new Set())} className="text-[0.65rem] text-white/30 hover:text-white/60">Clear selection</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <AdminLoading text="Loading media..." />
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-[0.85rem] text-red-400/70 mb-3">{error}</p>
          <AdminButton variant="secondary" size="sm" onClick={loadMedia}>Try Again</AdminButton>
        </div>
      ) : items.length === 0 && !search && filter === 'all' ? (
        <EmptyState
          title="No media yet"
          subtitle="Upload your first image to start building the Fiesta media library."
          action={<MediaUpload onUploaded={handleUploaded} />}
        />
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[0.85rem] text-white/30 mb-1">No matches found.</p>
          <p className="text-[0.7rem] text-white/20">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <MediaGridItem
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              onSelect={handleToggleSelect}
              onOpen={setDetailItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {detailItem && (
        <MediaDetail
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onDeleted={handleDetailDeleted}
          onUpdated={handleDetailUpdated}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] rounded transition-all duration-200 ${
        active
          ? 'bg-gold/10 text-gold border border-gold/20'
          : 'text-white/40 border border-white/[0.08] hover:border-white/[0.15] hover:text-white/60'
      }`}
    >
      {children}
    </button>
  );
}
