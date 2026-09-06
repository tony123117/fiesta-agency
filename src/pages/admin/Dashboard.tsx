import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { RecentBookings } from '@/components/admin/dashboard/RecentBookings';
import { UpcomingEvents } from '@/components/admin/dashboard/UpcomingEvents';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { WebsiteSnapshot } from '@/components/admin/dashboard/WebsiteSnapshot';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';
import { DashboardFooter } from '@/components/admin/dashboard/DashboardFooter';

export function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 md:mb-16">
        {/* Left — Recent Bookings (wider) */}
        <div className="lg:col-span-7">
          <RecentBookings />
        </div>

        {/* Right — Upcoming Events */}
        <div className="lg:col-span-5">
          <UpcomingEvents />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="mb-12 md:mb-16">
        <QuickActions />
      </div>

      {/* ── Website Snapshot ── */}
      <div className="mb-12 md:mb-16">
        <WebsiteSnapshot />
      </div>

      {/* ── Recent Activity ── */}
      <div className="mb-12 md:mb-16">
        <RecentActivity />
      </div>

      {/* ── Footer ── */}
      <DashboardFooter />
    </div>
  );
}

export default Dashboard;

