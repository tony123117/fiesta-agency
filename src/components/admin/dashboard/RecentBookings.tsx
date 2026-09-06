import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StatusBadge } from '@/components/admin/AdminUI';
import type { Booking } from '@/lib/types';

const STATUS_LABELS: Record<string, string> = {
  new: 'NEW',
  contacted: 'REVIEWING',
  in_progress: 'REVIEWING',
  confirmed: 'CONFIRMED',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (!active) return;
      setBookings((data || []) as Booking[]);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-1.5">
            RECENT BOOKINGS
          </p>
          <h2 className="font-serif font-light text-ivory tracking-tight text-lg">
            Latest inquiries
          </h2>
        </div>
        <Link
          to="/admin/bookings"
          className="group inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold/60 hover:text-gold transition-colors"
        >
          View All
          <ArrowRight size={11} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-white/[0.04]">
              <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
              <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
              <div className="h-3 w-20 bg-white/[0.04] rounded animate-pulse ml-auto" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-12 text-center border border-white/[0.04]">
          <p className="text-[0.8rem] text-white/30 mb-1">No bookings yet.</p>
          <p className="text-[0.7rem] text-white/20">New client inquiries will appear here.</p>
        </div>
      ) : (
        <div>
          {bookings.map((b, i) => (
            <Link
              key={b.id}
              to="/admin/bookings"
              className={`group flex items-center gap-4 py-4 transition-colors duration-200 hover:bg-white/[0.015] px-2 -mx-2 ${
                i < bookings.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.85rem] text-ivory truncate group-hover:text-gold transition-colors duration-200">
                  {b.client_name}
                </p>
              </div>
              <div className="hidden sm:block shrink-0">
                <span className="text-[0.7rem] text-white/30">{b.event_type}</span>
              </div>
              <div className="hidden md:block shrink-0 w-24 text-right">
                <span className="text-[0.7rem] text-white/25">
                  {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="shrink-0">
                <StatusBadge status={STATUS_LABELS[b.status] || b.status} />
              </div>
              <ArrowRight
                size={12}
                strokeWidth={1.5}
                className="shrink-0 text-white/10 group-hover:text-gold/50 transition-all duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
