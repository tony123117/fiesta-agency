import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function DashboardHeader() {
  const { profile } = useAuth();
  const name = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold mb-3">
          OVERVIEW
        </p>
        <h1 className="font-serif font-light text-ivory tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
        >
          Welcome back, {name}.
        </h1>
        <p className="text-[0.85rem] text-white/35 mt-3 max-w-md leading-relaxed">
          Here&apos;s what&apos;s happening across Fiesta.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 bg-gold text-obsidian px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] rounded hover:bg-gold-light transition-colors duration-200"
        >
          + Plan an Event
        </Link>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white/70 transition-colors duration-200"
        >
          View Website <ArrowRight size={12} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
