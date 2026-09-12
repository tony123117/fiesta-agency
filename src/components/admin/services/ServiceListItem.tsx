import { ChevronUp, ChevronDown, Star, Eye, EyeOff } from 'lucide-react';
import { AdminButton, AdminDropdown, StatusBadge } from '@/components/admin/AdminUI';
import type { Service } from '@/lib/types';

interface ServiceListItemProps {
  service: Service;
  index: number;
  totalCount: number;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePublished: (id: string, published: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function ServiceListItem({
  service,
  index,
  totalCount,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublished,
  onToggleFeatured,
  onMoveUp,
  onMoveDown,
}: ServiceListItemProps) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
      {/* Drag handle / Order number */}
      <div className="w-8 shrink-0 text-center">
        <span className="text-[0.6rem] font-semibold text-white/25">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Image thumbnail */}
      <div className="w-12 h-8 shrink-0 rounded overflow-hidden bg-white/[0.04]">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.image_alt || service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[0.45rem] text-white/15 uppercase">No img</span>
          </div>
        )}
      </div>

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-medium text-ivory truncate">{service.title}</p>
        <p className="text-[0.7rem] text-white/30 truncate max-w-md">
          {service.description || 'No description'}
        </p>
      </div>

      {/* Status badges */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <StatusBadge status={service.published ? 'published' : 'draft'} />
        {service.featured && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.12em] bg-gold/10 text-gold">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
      </div>

      {/* Quick toggles */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={() => onTogglePublished(service.id, !service.published)}
          title={service.published ? 'Unpublish' : 'Publish'}
        >
          {service.published ? <Eye size={13} /> : <EyeOff size={13} />}
        </AdminButton>
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={() => onToggleFeatured(service.id, !service.featured)}
          title={service.featured ? 'Unfeature' : 'Feature'}
          className={service.featured ? 'text-gold' : ''}
        >
          <Star size={13} fill={service.featured ? 'currentColor' : 'none'} />
        </AdminButton>
      </div>

      {/* Reorder */}
      <div className="hidden md:flex flex-col shrink-0">
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={() => onMoveUp(service.id)}
          disabled={index === 0}
          className="px-1"
        >
          <ChevronUp size={12} />
        </AdminButton>
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={() => onMoveDown(service.id)}
          disabled={index === totalCount - 1}
          className="px-1"
        >
          <ChevronDown size={12} />
        </AdminButton>
      </div>

      {/* Actions dropdown */}
      <div className="shrink-0">
        <AdminDropdown
          trigger={
            <AdminButton variant="ghost" size="sm">Actions</AdminButton>
          }
          items={[
            { label: 'Edit', onClick: () => onEdit(service) },
            { label: 'Duplicate', onClick: () => onDuplicate(service.id) },
            { label: service.published ? 'Unpublish' : 'Publish', onClick: () => onTogglePublished(service.id, !service.published) },
            { label: service.featured ? 'Unfeature' : 'Feature', onClick: () => onToggleFeatured(service.id, !service.featured) },
            { label: 'Delete', onClick: () => onDelete(service.id), danger: true },
          ]}
        />
      </div>
    </div>
  );
}
