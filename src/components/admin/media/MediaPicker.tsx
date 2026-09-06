import { useEffect, useState, useCallback } from 'react';
import { Search, Upload, X, Check } from 'lucide-react';
import { AdminButton, Toast } from '@/components/admin/AdminUI';
import { MediaUpload } from './MediaUpload';
import { getMedia, uploadMedia, formatFileSize, isImageMime } from '@/lib/mediaService';
import type { MediaItem } from '@/lib/types';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
  mode?: 'single' | 'multiple';
  value?: MediaItem | MediaItem[];
}

export function MediaPicker({ open, onClose, onSelect, mode = 'single', value }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize selection from value
  useEffect(() => {
    if (!open) return;
    const ids = new Set<string>();
    if (mode === 'single' && value && !Array.isArray(value)) {
      ids.add(value.id);
    } else if (Array.isArray(value)) {
      value.forEach((v) => ids.add(v.id));
    }
    setSelectedIds(ids);
  }, [open, value, mode]);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMedia({ search, type: 'all', sort: 'newest' });
      setItems(data);
    } catch {
      setToast('Failed to load media');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (open) loadMedia();
  }, [open, loadMedia]);

  const handleToggle = (id: string) => {
    if (mode === 'single') {
      setSelectedIds(new Set([id]));
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const handleConfirm = () => {
    const selected = items.filter((i) => selectedIds.has(i.id));
    onSelect(selected);
    onClose();
  };

  const handleUploaded = (newItems: MediaItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
    // Auto-select uploaded items
    if (mode === 'single' && newItems.length > 0) {
      setSelectedIds(new Set([newItems[0].id]));
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        newItems.forEach((i) => next.add(i.id));
        return next;
      });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Select media"
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-serif font-medium text-base tracking-tight text-ivory">
              {mode === 'single' ? 'Select Image' : 'Select Images'}
            </h2>
            <p className="text-[0.7rem] text-white/30 mt-0.5">
              {items.length} media items · {selectedIds.size} selected
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60" aria-label="Close">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full bg-white/[0.04] border border-white/[0.08] pl-9 pr-3 py-2 text-[0.8rem] text-ivory rounded transition-colors placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
            />
          </div>
          <AdminButton variant="secondary" size="sm" onClick={() => setShowUpload(!showUpload)} className="gap-1.5 shrink-0">
            <Upload size={11} strokeWidth={1.5} /> Upload
          </AdminButton>
        </div>

        {/* Upload panel */}
        {showUpload && (
          <div className="px-5 py-3 border-b border-white/[0.04]">
            <MediaUpload onUploaded={(items) => { handleUploaded(items); setShowUpload(false); }} />
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-[1.5px] border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[0.85rem] text-white/30 mb-3">No media found.</p>
              <AdminButton variant="secondary" size="sm" onClick={() => setShowUpload(true)}>Upload First Image</AdminButton>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {items.map((item) => (
                <PickerItem
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  onSelect={() => handleToggle(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="text-[0.75rem] text-white/40 hover:text-white/60 transition-colors">
            Cancel
          </button>
          <AdminButton onClick={handleConfirm} disabled={selectedIds.size === 0}>
            {selectedIds.size > 0 ? `Select ${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''}` : 'Select'}
          </AdminButton>
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}

function PickerItem({
  item,
  selected,
  onSelect,
}: {
  item: MediaItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isImage = isImageMime(item.mime_type);

  return (
    <div
      className={`relative aspect-square rounded overflow-hidden cursor-pointer transition-all duration-200 ${
        selected
          ? 'ring-2 ring-gold ring-offset-1 ring-offset-charcoal'
          : 'ring-1 ring-white/[0.06] hover:ring-white/[0.15]'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-selected={selected}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {isImage && !imgError ? (
        <img
          src={item.public_url}
          alt={item.alt_text || item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
          <span className="text-[0.5rem] text-white/20 uppercase">{item.mime_type?.split('/')[1] || 'file'}</span>
        </div>
      )}

      {/* Selected check */}
      {selected && (
        <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
            <Check size={14} strokeWidth={2.5} className="text-obsidian" />
          </div>
        </div>
      )}

      {/* Hover info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
        <p className="text-[0.6rem] text-white truncate">{item.name}</p>
      </div>
    </div>
  );
}
