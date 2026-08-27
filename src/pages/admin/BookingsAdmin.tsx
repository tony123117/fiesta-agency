import { useEffect, useState } from 'react';
import { Search, X, Mail, Phone, Calendar, MapPin, Users, DollarSign, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, StatusBadge, AdminLoading, EmptyState, AdminButton, AdminTextarea, Toast } from '@/components/admin/AdminUI';
import type { Booking, BookingStatus } from '@/lib/types';
import { BOOKING_STATUSES } from '@/lib/types';

export function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings((data || []) as Booking[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: BookingStatus) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
    setToast('Status updated');
    setTimeout(() => setToast(null), 3000);
  };

  const saveNotes = async () => {
    if (!selected) return;
    await supabase.from('bookings').update({ notes }).eq('id', selected.id);
    setToast('Notes saved');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.client_name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Bookings & Inquiries" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full bg-charcoal border border-charcoal-border pl-10 pr-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="bg-charcoal border border-charcoal-border px-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none cursor-pointer">
          <option value="all" className="bg-charcoal">All Statuses</option>
          {BOOKING_STATUSES.map((s) => <option key={s} value={s} className="bg-charcoal">{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No inquiries yet." subtitle="Booking submissions will appear here." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-border text-left">
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted">Client</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden md:table-cell">Event Type</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden lg:table-cell">Date</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted hidden lg:table-cell">Submitted</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-ivory-muted">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-charcoal-border hover:bg-charcoal transition-colors cursor-pointer" onClick={() => { setSelected(b); setNotes(b.notes || ''); }}>
                  <td className="py-3 px-4">
                    <p className="text-sm text-ivory">{b.client_name}</p>
                    <p className="text-xs text-ivory-muted">{b.email}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden md:table-cell">{b.event_type}</td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden lg:table-cell">
                    {b.event_date ? new Date(b.event_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-sm text-ivory-muted hidden lg:table-cell">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                  <td className="py-3 px-4 text-xs text-gold">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-obsidian/60" />
          <div className="relative w-full max-w-md bg-charcoal border-l border-charcoal-border h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-charcoal border-b border-charcoal-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-ivory">Inquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-ivory-muted hover:text-ivory"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-serif text-xl text-ivory mb-1">{selected.client_name}</h3>
                <StatusBadge status={selected.status} />
              </div>

              <div className="space-y-3">
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                {selected.phone && <DetailRow icon={Phone} label="Phone" value={selected.phone} />}
                <DetailRow icon={MessageCircle} label="Event Type" value={selected.event_type} />
                {selected.event_date && <DetailRow icon={Calendar} label="Preferred Date" value={new Date(selected.event_date).toLocaleDateString()} />}
                {selected.location && <DetailRow icon={MapPin} label="Location" value={selected.location} />}
                {selected.guest_count && <DetailRow icon={Users} label="Guest Count" value={String(selected.guest_count)} />}
                {selected.budget && <DetailRow icon={DollarSign} label="Budget" value={selected.budget} />}
                {selected.referral && <DetailRow icon={MessageCircle} label="Referral" value={selected.referral} />}
              </div>

              {selected.message && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-ivory-muted mb-2">Message</p>
                  <p className="text-sm text-ivory leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Status changer */}
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory-muted mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {BOOKING_STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                        selected.status === s ? 'bg-gold text-obsidian border-gold' : 'border-charcoal-border text-ivory-muted hover:text-ivory hover:border-gold'
                      }`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs uppercase tracking-wider text-ivory-muted mb-2">Internal Notes</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
                  className="w-full bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none resize-none" />
                <div className="mt-2"><AdminButton onClick={saveNotes}>Save Notes</AdminButton></div>
              </div>

              <p className="text-xs text-ivory-muted pt-4 border-t border-charcoal-border">
                Submitted: {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-gold shrink-0" />
      <div>
        <p className="text-xs text-ivory-muted">{label}</p>
        <p className="text-sm text-ivory">{value}</p>
      </div>
    </div>
  );
}
