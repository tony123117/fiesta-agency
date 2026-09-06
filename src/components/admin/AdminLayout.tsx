import { useEffect, useCallback } from 'react';
import { Link, useLocation, Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Image, MessageSquare, HelpCircle,
  Briefcase, Inbox, Settings, LogOut, Menu, X, FileText, Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useAdminSidebar } from '@/components/admin/AdminUI';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Pages', to: '/admin/pages', icon: FileText },
  { label: 'Services', to: '/admin/services', icon: Briefcase },
  { label: 'Events', to: '/admin/events', icon: Calendar },
  { label: 'Portfolio', to: '/admin/portfolio', icon: Image },
  { label: 'Team', to: '/admin/team', icon: Users },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquare },
  { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
  { label: 'Bookings', to: '/admin/bookings', icon: Inbox },
  { label: 'Media', to: '/admin/media', icon: Image },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { session, profile, signOut, loading } = useAuth();
  const location = useLocation();
  const { isOpen, setIsOpen } = useAdminSidebar();

  const closeSidebar = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSidebar();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidebar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-obsidian">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-caption text-white/30 uppercase tracking-[0.2em]">Loading</span>
        </div>
      </div>
    );
  }

  const currentPage = NAV_ITEMS.find((i) => {
    if (i.end) return location.pathname === i.to;
    return location.pathname.startsWith(i.to);
  });

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-60 bg-charcoal border-r border-white/[0.06]">
        <SidebarContent
          navItems={NAV_ITEMS}
          profile={profile}
          signOut={signOut}
          currentPath={location.pathname}
        />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-charcoal border-r border-white/[0.06] flex flex-col lg:hidden transition-transform duration-300 ease-lux ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/[0.06]">
          <Link to="/admin" className="font-serif font-medium text-lg tracking-tight text-ivory" onClick={closeSidebar}>
            FIESTA
          </Link>
          <button
            onClick={closeSidebar}
            className="flex items-center justify-center w-8 h-8 rounded text-white/40 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <SidebarContent
          navItems={NAV_ITEMS}
          profile={profile}
          signOut={signOut}
          currentPath={location.pathname}
          onNavClick={closeSidebar}
        />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* ── Top header ── */}
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 lg:px-6 bg-charcoal/80 backdrop-blur-md border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded text-white/50 hover:text-white lg:hidden transition-colors"
              aria-label="Open sidebar"
              aria-expanded={isOpen}
              aria-controls="admin-sidebar"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="font-serif font-medium text-sm tracking-tight text-ivory">
                {currentPage?.label || 'Admin'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <span className="text-caption font-semibold text-white/50 uppercase">
                    {(profile.full_name || profile.email || '?')[0]}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.7rem] font-medium text-white/70 leading-tight">
                    {profile.full_name || profile.email}
                  </span>
                  <span className="text-[0.6rem] text-white/30 uppercase tracking-wider leading-tight">
                    {profile.role}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] rounded transition-all"
              aria-label="Sign out"
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 max-w-[1400px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SIDEBAR CONTENT
   ══════════════════════════════════════════════════ */
function SidebarContent({
  navItems,
  profile,
  signOut,
  currentPath,
  onNavClick,
}: {
  navItems: typeof NAV_ITEMS;
  profile: { full_name?: string | null; email?: string; role?: string } | null;
  signOut: () => Promise<void>;
  currentPath: string;
  onNavClick?: () => void;
}) {
  return (
    <>
      {/* Brand — desktop only */}
      <div className="hidden lg:flex items-center h-14 px-5 border-b border-white/[0.06]">
        <Link to="/admin" className="font-serif font-medium text-lg tracking-tight text-ivory">
          FIESTA
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Admin navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map((item) => {
            const isActive = item.end
              ? currentPath === item.to
              : currentPath.startsWith(item.to) && item.to !== '/admin';

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-[0.8rem] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gold/[0.08] text-gold'
                      : 'text-white/45 hover:text-white/70 hover:bg-white/[0.03]'
                  }`}
                  end={item.end}
                >
                  <item.icon size={16} strokeWidth={1.5} className={isActive ? 'text-gold' : ''} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.06] p-3">
        {profile && (
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
              <span className="text-[0.6rem] font-semibold text-white/50 uppercase">
                {(profile.full_name || profile.email || '?')[0]}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[0.7rem] font-medium text-white/60 truncate leading-tight">
                {profile.full_name || profile.email}
              </span>
              <span className="text-[0.55rem] text-white/25 uppercase tracking-wider leading-tight">
                {profile.role}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => { signOut(); onNavClick?.(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-[0.8rem] font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition-all"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </>
  );
}
