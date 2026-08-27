import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, MessageSquare, HelpCircle, Image, Inbox, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminCard, AdminLoading } from '@/components/admin/AdminUI';

interface Stats {
  totalBookings: number;
  newBookings: number;
  upcomingEvents: number;
  pastEvents: number;
  portfolioProjects: number;
  testimonials: number;
  faqs: number;
  mediaCount: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [bookings, newB, upcoming, past, portfolio, testimonials, faqs, media] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming').eq('published', true),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('published', true),
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
        supabase.from('media').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalBookings: bookings.count || 0,
        newBookings: newB.count || 0,
        upcomingEvents: upcoming.count || 0,
        pastEvents: past.count || 0,
        portfolioProjects: portfolio.count || 0,
        testimonials: testimonials.count || 0,
        faqs: faqs.count || 0,
        mediaCount: media.count || 0,
      });

      const { data: recent } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentBookings(recent || []);
    })();
  }, []);

  if (!stats) return <AdminLoading />;

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Inbox, to: '/admin/bookings' },
    { label: 'New Bookings', value: stats.newBookings, icon: Inbox, to: '/admin/bookings' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, to: '/admin/events' },
    { label: 'Past Events', value: stats.pastEvents, icon: Calendar, to: '/admin/events' },
    { label: 'Portfolio Projects', value: stats.portfolioProjects, icon: Briefcase, to: '/admin/portfolio' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, to: '/admin/testimonials' },
    { label: 'FAQs', value: stats.faqs, icon: HelpCircle, to: '/admin/faqs' },
    { label: 'Media Items', value: stats.mediaCount, icon: Image, to: '/admin/media' },
  ];

  const quickActions = [
    { label: 'Create Event', to: '/admin/events/new' },
    { label: 'Create Portfolio Project', to: '/admin/portfolio/new' },
    { label: 'View Bookings', to: '/admin/bookings' },
    { label: 'Manage Homepage', to: '/admin/home' },
  ];

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Dashboard" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <AdminCard className="hover:border-gold/40 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <stat.icon size={18} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-light text-ivory">{stat.value}</p>
              <p className="text-xs text-ivory-muted uppercase tracking-wider mt-1">{stat.label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="text-xs uppercase tracking-wider text-ivory-muted mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="inline-flex items-center gap-2 bg-charcoal border border-charcoal-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:border-gold hover:text-gold transition-colors"
            >
              <Plus size={14} /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-wider text-ivory-muted">Recent Inquiries</h2>
          <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-xs text-gold hover:gap-2 transition-all">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <AdminCard><p className="text-ivory-muted text-sm text-center py-4">No inquiries yet.</p></AdminCard>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <Link key={b.id} to="/admin/bookings">
                <div className="flex items-center justify-between bg-charcoal border border-charcoal-border px-4 py-3 hover:border-gold/30 transition-colors">
                  <div>
                    <p className="text-sm text-ivory">{b.client_name}</p>
                    <p className="text-xs text-ivory-muted">{b.event_type} • {b.email}</p>
                  </div>
                  <span className="text-xs text-ivory-muted">{new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
