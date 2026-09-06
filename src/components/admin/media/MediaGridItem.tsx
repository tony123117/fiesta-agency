import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { formatFileSize, isImageMime } from '@/lib/mediaService';
import type { MediaItem } from '@/lib/types';

export function MediaGridItem({
  item,
  selected,
  onSelect,
  onOpen,
  onDelete,
}: {
  item: MediaItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isImage = isImageMime(item.mime_type);

  return (
    <div
      className={`group relative aspect-[4/3] rounded overflow-hidden cursor-pointer transition-all duration-200 ${
        selected
          ? 'ring-2 ring-gold ring-offset-2 ring-offset-obsidian'
          : 'ring-1 ring-white/[0.06] hover:ring-white/[0.15]'
      }`}
      role="button"
      tabIndex={0}
      aria-selected={selected}
      aria-label={`${item.name}${selected ? ' (selected)' : ''}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(item); } }}
    >
      {/* Image */}
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
          <span className="text-[0.55rem] text-white/20 uppercase tracking-wider">
            {item.mime_type?.split('/')[1] || 'file'}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <p className="text-[0.7rem] text-white truncate mb-1">{item.name}</p>
        <p className="text-[0.55rem] text-white/50">
          {item.width && item.height ? `${item.width}×${item.height}` : ''}{' '}
          {item.size_bytes ? formatFileSize(item.size_bytes) : ''}
        </p>
      </div>

      {/* Selection indicator */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
          selected
            ? 'bg-gold text-obsidian'
            : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 hover:bg-white/20'
        }`}
        aria-label={selected ? `Deselect ${item.name}` : `Select ${item.name}`}
      >
        <Check size={12} strokeWidth={2} />
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500/60 hover:text-white transition-all duration-200"
        aria-label={`Delete ${item.name}`}
      >
        <Trash2 size={10} strokeWidth={1.5} />
      </button>

      {/* Alt indicator */}
      {!item.alt_text && isImage && (
        <div className="absolute bottom-2 left-2">
          <span className="text-[0.45rem] uppercase tracking-wider text-amber-400/70 bg-black/50 px-1.5 py-0.5 rounded">
            No alt
          </span>
        </div>
      )}
    </div>
  );
}
