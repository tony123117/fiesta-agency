import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading, AdminTextarea, StatusBadge, Toast } from '@/components/admin/AdminUI';

const BOOKING_STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'] as const;

interface Booking {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  location: string;
  guest_count: number;
  budget: string;
  message: string;
  notes: string;
  status: string;
  created_at: string;
}

export function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const notesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSaveNotes = useCallback((id: string, notes: string) => {
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => {
      handleSaveNotes(id, notes);
    }, 500);
  }, []);

  const load = async () => {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) {
      setToast('Failed to load bookings');
      setTimeout(() => setToast(null), 3000);
    }
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedBooking) {
      setNotesDraft(selectedBooking.notes || '');
    }
  }, [selectedBooking?.id]);

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      setToast('Failed to update status');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status } : prev));
    }
    setToast(`Status updated to ${status}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, notes } : b)));
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, notes } : prev));
    }
    const { error } = await supabase.from('bookings').update({ notes }).eq('id', id);
    if (error) {
      setToast('Failed to save notes');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = bookings.filter(b => {
    if (search && !b.client_name?.toLowerCase()?.includes(search.toLowerCase()) && !(b.email || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    return true;
  });

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '1.5rem 2.5rem' }}>
      <PageHeader title="BOOKINGS" />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '24rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ width: '100%', background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.5rem 0.5rem 2.5rem', color: 'white' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', color: 'white' }}>
          <option value="All">All</option>
          {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <AdminCard padding={false}>
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Client</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Event Type</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Submitted</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <p style={{ fontWeight: 500 }}>{b.client_name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{b.email}</p>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{b.event_type}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{b.event_date ? new Date(b.event_date).toLocaleDateString() : 'TBA'}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={b.status} /></td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button onClick={() => setSelectedBooking(b)} style={{ background: 'none', border: 'none', color: '#D6A856', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    View <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem', background: '#090909', height: '100%', overflow: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.25rem' }}>{selectedBooking.client_name}</h2>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <StatusBadge status={selectedBooking.status} />
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Email</span> <p>{selectedBooking.email}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Phone</span> <p>{selectedBooking.phone}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Event Type</span> <p>{selectedBooking.event_type}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Preferred Date</span> <p>{selectedBooking.event_date ? new Date(selectedBooking.event_date).toLocaleDateString() : 'TBA'}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Location</span> <p>{selectedBooking.location}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Guests</span> <p>{selectedBooking.guest_count}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Budget</span> <p>{selectedBooking.budget}</p></div>
              <div><span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Submitted</span> <p>{new Date(selectedBooking.created_at).toLocaleString()}</p></div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', marginBottom: '0.5rem' }}>Message</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap' }}>{selectedBooking.message}</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', marginBottom: '0.5rem' }}>Status</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {BOOKING_STATUSES.map(s => (
                  <button key={s} onClick={() => handleStatusChange(selectedBooking.id, s)} style={{ padding: '0.375rem 0.75rem', borderRadius: '50px', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', ...(selectedBooking.status === s ? { background: '#D6A856', color: '#090909' } : { background: 'rgba(255,255,255,0.1)', color: 'white' })} }>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', marginBottom: '0.5rem' }}>Internal Notes</h3>
              <AdminTextarea value={notesDraft} onChange={(e) => { setNotesDraft(e.target.value); debouncedSaveNotes(selectedBooking.id, e.target.value); }} rows={4} placeholder="Add internal notes..." />
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
export default BookingsAdmin;

