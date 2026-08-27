import { type ReactNode, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useSiteSettings } from '@/lib/useSiteSettings';

export function PublicLayout({ children }: { children?: ReactNode }) {
  const { settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </div>
  );
}
