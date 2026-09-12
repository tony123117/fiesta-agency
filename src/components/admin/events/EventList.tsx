import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader, AdminLoading, AdminButton, Toast, EmptyState } from '@/components/admin/AdminUI';
import { EventFilters } from '@/components/admin/events/EventFilters';
import { EventListItem } from '@/components/admin/events/EventListItem';
import { getEvents, deleteEvent, updateEvent, toggleFeatured, duplicateEvent } from '@/lib/eventsService';
import type { EventItem } from '@/lib/types';

export function EventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('event_date_asc');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lastUnderscore = sortBy.lastIndexOf('_');
      const sortField = sortBy.substring(0, lastUnderscore);
      const sortDir = sortBy.substring(lastUnderscore + 1);
      const field = sortField === 'event_date' ? 'event_date' : sortField;
      const ascending = sortDir === 'asc';
      const data = await getEvents(
        { search, status: statusFilter, published: publishedFilter, featured: featuredFilter },
        { field: field as 'created_at' | 'event_date' | 'title', ascending }
      );
      setEvents(data);
    } catch {
      setError('Unable to load events.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, publishedFilter, featuredFilter, sortBy]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setToast('Event deleted');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Delete failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const updated = await updateEvent(id, { published });
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, published: updated.published } : e));
      setToast(published ? 'Event published' : 'Event unpublished');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const updated = await toggleFeatured(id, featured);
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, featured: updated.featured } : e));
    } catch {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicateEvent(id);
      setEvents((prev) => [...prev, dup]);
      setToast('Event duplicated');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Duplicate failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div>
      <PageHeader
        title="Events"
        description="Create, manage and publish Fiesta events."
        action={
          <Link to="/admin/events/new">
            <AdminButton>+ Add Event</AdminButton>
          </Link>
        }
      />

      {loading ? (
        <AdminLoading text="Loading events..." />
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-[0.85rem] text-red-400/70 mb-3">{error}</p>
          <AdminButton variant="secondary" size="sm" onClick={loadEvents}>Try Again</AdminButton>
        </div>
      ) : events.length === 0 && !search && statusFilter === 'all' && publishedFilter === 'all' && featuredFilter === 'all' ? (
        <EmptyState
          title="No events yet"
          subtitle="Create your first Fiesta event to get started."
          action={
            <Link to="/admin/events/new">
              <AdminButton size="sm">+ Add Event</AdminButton>
            </Link>
          }
        />
      ) : (
        <>
          <EventFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            publishedFilter={publishedFilter}
            onPublishedFilterChange={setPublishedFilter}
            featuredFilter={featuredFilter}
            onFeaturedFilterChange={setFeaturedFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Column headers — desktop */}
          <div className="hidden md:flex items-center gap-6 px-2 pb-2 border-b border-white/[0.06] mb-1">
            <div className="w-16 shrink-0" />
            <div className="flex-1 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Event</div>
            <div className="w-20 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Status</div>
            <div className="w-16 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Visible</div>
            <div className="w-6 shrink-0" />
            <div className="w-28 shrink-0 text-right text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Actions</div>
          </div>

          {events.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[0.85rem] text-white/30 mb-1">No matches found.</p>
              <p className="text-[0.7rem] text-white/20">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div>
              {events.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onDelete={handleDelete}
                  onTogglePublished={handleTogglePublished}
                  onToggleFeatured={handleToggleFeatured}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
