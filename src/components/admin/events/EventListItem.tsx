import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { StatusBadge } from '@/components/admin/AdminUI';
import type { EventItem } from '@/lib/types';

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'UPCOMING',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export function EventListItem({
  event,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
  onDuplicate,
}: {
  event: EventItem;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, published: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDuplicate: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const date = event.event_date ? new Date(event.event_date) : null;
  const day = date ? date.getDate() : null;
  const month = date ? date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() : null;
  const year = date ? date.getFullYear() : null;

  return (
    <div className="group flex items-center gap-4 md:gap-6 py-4 border-b border-white/[0.04] hover:bg-white/[0.015] px-2 -mx-2 transition-colors duration-200">
      {/* Image + Date */}
      <div className="flex items-center gap-3 shrink-0">
        {event.cover_image && !imgError ? (
          <div className="w-12 h-9 md:w-16 md:h-12 overflow-hidden rounded shrink-0">
            <img
              src={event.cover_image}
              alt={event.cover_alt || event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        ) : day ? (
          <div className="w-12 h-9 md:w-16 md:h-12 flex flex-col items-center justify-center border border-white/[0.06] shrink-0">
            <span className="font-serif font-light text-ivory text-sm leading-none">{day}</span>
            <span className="text-[0.45rem] font-semibold tracking-[0.12em] text-white/30 mt-0.5">{month}</span>
          </div>
        ) : (
          <div className="w-12 h-9 md:w-16 md:h-12 flex items-center justify-center border border-white/[0.04] shrink-0">
            <span className="text-[0.5rem] text-white/15">NO IMAGE</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[0.85rem] text-ivory truncate group-hover:text-gold transition-colors duration-200 font-medium">
            {event.title}
          </p>
          {event.featured && (
            <Star size={10} strokeWidth={1.5} className="text-gold shrink-0 fill-gold" />
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[0.65rem] text-white/25">
            {day && month && year ? `${day} ${month} ${year}` : 'Date TBA'}
          </span>
          <span className="text-white/10">·</span>
          <span className="text-[0.65rem] text-white/25 truncate">{event.location || 'Venue TBA'}</span>
          <span className="text-white/10 hidden sm:inline">·</span>
          <span className="text-[0.6rem] text-white/20 hidden sm:inline">{event.category}</span>
        </div>
      </div>

      {/* Status */}
      <div className="shrink-0 hidden md:block">
        <StatusBadge status={STATUS_LABELS[event.status] || event.status} />
      </div>

      {/* Published indicator */}
      <button
        onClick={(e) => { e.stopPropagation(); onTogglePublished(event.id, !event.published); }}
        className="shrink-0 hidden md:flex items-center gap-1.5 px-2 py-1 rounded transition-colors duration-200"
        title={event.published ? 'Published' : 'Draft'}
        aria-label={event.published ? 'Unpublish event' : 'Publish event'}
      >
        {event.published ? (
          <Eye size={12} strokeWidth={1.5} className="text-green-400/60" />
        ) : (
          <EyeOff size={12} strokeWidth={1.5} className="text-white/20" />
        )}
        <span className={`text-[0.55rem] font-semibold uppercase tracking-[0.1em] ${event.published ? 'text-green-400/50' : 'text-white/20'}`}>
          {event.published ? 'LIVE' : 'DRAFT'}
        </span>
      </button>

      {/* Featured toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFeatured(event.id, !event.featured); }}
        className="shrink-0 hidden lg:flex items-center px-1.5 py-1 rounded transition-colors duration-200"
        title={event.featured ? 'Unfeature' : 'Feature'}
        aria-label={event.featured ? 'Remove from featured' : 'Mark as featured'}
      >
        <Star
          size={13}
          strokeWidth={1.5}
          className={event.featured ? 'text-gold fill-gold' : 'text-white/15'}
        />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          to={`/events/${event.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-7 h-7 rounded text-white/20 hover:text-white/50 transition-colors"
          title="Preview on website"
          aria-label="Preview event on public website"
        >
          <Eye size={13} strokeWidth={1.5} />
        </Link>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(event.id); }}
          className="flex items-center justify-center w-7 h-7 rounded text-white/20 hover:text-white/50 transition-colors"
          title="Duplicate event"
          aria-label={`Duplicate ${event.title}`}
        >
          <Copy size={12} strokeWidth={1.5} />
        </button>
        <Link
          to={`/admin/events/${event.id}/edit`}
          className="group/edit inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/30 hover:text-gold transition-colors px-2 py-1.5"
        >
          Edit
          <ArrowRight size={10} strokeWidth={1.5} className="group-hover/edit:translate-x-0.5 transition-transform" />
        </Link>
        <button
          onClick={() => {
            if (confirm(`Delete "${event.title}"?\n\nThis action cannot be undone.`)) {
              onDelete(event.id);
            }
          }}
          className="flex items-center justify-center w-7 h-7 rounded text-white/10 hover:text-red-400/60 transition-colors"
          title="Delete event"
          aria-label={`Delete ${event.title}`}
        >
          <Trash2 size={12} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
