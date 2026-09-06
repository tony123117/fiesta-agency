import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Stat {
  num: string;
  label: string;
  supporting: string;
  to: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [upcomingRes, newBookingRes, pastRes, portfolioRes, eventsWithDates] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'upcoming').eq('published', true),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'completed').eq('published', true),
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('events').select('event_date').eq('status', 'upcoming').eq('published', true).order('event_date', { ascending: true }).limit(1),
      ]);

      if (!active) return;

      const upcomingCount = upcomingRes.count || 0;
      const upcomingNext = eventsWithDates.data?.[0]?.event_date;

      let nextEventText = 'No upcoming events';
      if (upcomingCount > 0 && upcomingNext) {
        const diff = Math.ceil((new Date(upcomingNext).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff <= 0) nextEventText = 'Happening today';
        else if (diff === 1) nextEventText = 'Next event tomorrow';
        else nextEventText = `Next event in ${diff} days`;
      }

      const newCount = newBookingRes.count || 0;
      let bookingText = 'No new inquiries';
      if (newCount > 0) bookingText = `${newCount} need${newCount === 1 ? 's' : ''} review`;

      const pastCount = pastRes.count || 0;
      let pastText = 'No completed events';
      if (pastCount > 0) pastText = `${pastCount} total produced`;

      const portfolioCount = portfolioRes.count || 0;
      let portfolioText = 'No projects yet';
      if (portfolioCount > 0) portfolioText = `${portfolioCount} published`;

      setStats([
        { num: String(upcomingCount).padStart(2, '0'), label: 'UPCOMING EVENTS', supporting: nextEventText, to: '/admin/events' },
        { num: String(newCount).padStart(2, '0'), label: 'NEW BOOKINGS', supporting: bookingText, to: '/admin/bookings' },
        { num: String(pastCount).padStart(2, '0'), label: 'PAST EVENTS', supporting: pastText, to: '/admin/events' },
        { num: String(portfolioCount).padStart(2, '0'), label: 'PORTFOLIO ITEMS', supporting: portfolioText, to: '/admin/portfolio' },
      ]);
    })();
    return () => { active = false; };
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] mb-12 md:mb-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-obsidian p-6 md:p-8">
            <div className="h-3 w-8 bg-white/[0.04] rounded mb-4 animate-pulse" />
            <div className="h-8 w-12 bg-white/[0.04] rounded mb-3 animate-pulse" />
            <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] mb-12 md:mb-16">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.to}
          className="group bg-obsidian p-6 md:p-8 transition-colors duration-300 hover:bg-white/[0.015]"
        >
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">
            {stat.label}
          </p>
          <p className="font-serif font-light text-ivory leading-none tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            {stat.num}
          </p>
          <p className="text-[0.7rem] text-white/30 group-hover:text-gold/60 transition-colors duration-300">
            {stat.supporting}
          </p>
        </Link>
      ))}
    </div>
  );
}
