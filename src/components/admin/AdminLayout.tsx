import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Briefcase, MessageSquare, HelpCircle,
  Image, Inbox, Settings, FileText, LogOut, Menu, X, Home,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Home CMS', to: '/admin/home', icon: FileText },
  { label: 'About CMS', to: '/admin/about', icon: FileText },
  { label: 'Services CMS', to: '/admin/services', icon: FileText },
  { label: 'How We Work CMS', to: '/admin/how-we-work', icon: FileText },
  { label: 'Events', to: '/admin/events', icon: Calendar },
  { label: 'Portfolio', to: '/admin/portfolio', icon: Briefcase },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquare },
  { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
  { label: 'Media', to: '/admin/media', icon: Image },
  { label: 'Bookings', to: '/admin/bookings', icon: Inbox },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-charcoal border-r border-charcoal-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-5 border-b border-charcoal-border">
          <NavLink to="/admin" className="font-serif text-xl font-medium text-ivory">
            FIESTA <span className="text-gold text-xs font-sans font-normal align-super">CMS</span>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold border-l-2 border-gold'
                    : 'text-ivory-muted hover:text-ivory hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-charcoal-border space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs text-ivory-muted truncate">{profile?.email}</p>
            <p className="text-[10px] text-gold uppercase tracking-wider mt-0.5">{profile?.role}</p>
          </div>
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-ivory-muted hover:text-ivory transition-colors"
          >
            <Home size={16} /> View Site
          </NavLink>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 text-sm text-ivory-muted hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-charcoal-border bg-charcoal">
          <button onClick={() => setSidebarOpen(true)} className="text-ivory">
            <Menu size={22} />
          </button>
          <span className="font-serif text-lg text-ivory">FIESTA CMS</span>
          <button onClick={handleSignOut} className="text-ivory-muted">
            <X size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
