import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Events', to: '/events' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'How We Work', to: '/how-we-work' },
    { label: 'Plan Your Event', to: '/plan-your-event' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer className="bg-obsidian border-t border-charcoal-border">
      <div className="container-lux py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-ivory mb-4">FIESTA</h2>
            <p className="font-serif text-lg italic text-ivory-muted max-w-sm leading-relaxed">
              {settings?.footer_text || 'Moments that live long after the night ends.'}
            </p>
            <div className="flex gap-4 mt-8">
              <a href={settings?.instagram ? `https://instagram.com/${settings.instagram.replace('@', '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="text-ivory-muted hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer"
                className="text-ivory-muted hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                target="_blank" rel="noopener noreferrer"
                className="text-ivory-muted hover:text-gold transition-colors" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-4">
            <span className="label-ivory mb-6 block">Navigation</span>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ivory/70 hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <span className="label-ivory mb-6 block">Contact</span>
            <ul className="space-y-3 text-sm text-ivory/70">
              {settings?.email && <li><a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors">{settings.email}</a></li>}
              {settings?.phone && <li className="hover:text-gold transition-colors">{settings.phone}</li>}
              {settings?.address && <li className="text-ivory-muted">{settings.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-charcoal-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory-muted tracking-wide">© 2026 Fiesta Agency</p>
          <div className="flex gap-6 text-xs text-ivory-muted">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
