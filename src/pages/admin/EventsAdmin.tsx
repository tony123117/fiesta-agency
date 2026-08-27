import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, StatusBadge, AdminLoading, EmptyState } from '@/components/admin/AdminUI';
import type { EventItem } from '@/lib/types';

const CATEGORIES = ['All', 'Wedding', 'Celebration', 'Corporate', 'Private', 'Production'];

export function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('sort_order');
    setEvents((data || []) as EventItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await supabase.from('events').delete().eq('id', id);
    load();
  };

  const filtered = events.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || e.category === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader
        title="Events"
        action={
          <Link to="/admin/events/new">
            <AdminButton><Plus size={14} /> Create Event</AdminButton>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-charcoal border border-charcoal-border pl-10 pr-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-charcoal border border-charcoal-border px-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none cursor-pointer"
        >
          {CATEGORIES.map((c) => <option key={c} value={c} className="bg-charcoal">{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="No events found." subtitle="Create your first event to get started." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-border text-left">
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted">Title</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden md:table-cell">Category</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden lg:table-cell">Date</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden lg:table-cell">Location</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted">Status</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event.id} className="border-b border-charcoal-border hover:bg-charcoal transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {event.cover_image && <img src={event.cover_image} alt="" className="w-10 h-10 object-cover" />}
                      <div>
                        <p className="text-sm text-ivory">{event.title}</p>
                        {event.featured && <span className="text-[10px] text-gold uppercase tracking-wider">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden md:table-cell">{event.category}</td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden lg:table-cell">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden lg:table-cell">{event.location || '—'}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={event.status} />
                      {event.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/events/${event.id}/edit`}>
                        <button className="text-ivory-muted hover:text-gold transition-colors p-1"><Pencil size={16} /></button>
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="text-ivory-muted hover:text-red-400 transition-colors p-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
