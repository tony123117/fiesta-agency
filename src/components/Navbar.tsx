import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Events', to: '/events' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'How We Work', to: '/how-we-work' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-lux ${
          scrolled
            ? 'bg-obsidian/90 backdrop-blur-md border-b border-charcoal-border'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="container-lux flex items-center justify-between h-16 md:h-20">
          {/* Left: wordmark */}
          <Link to="/" className="font-serif text-xl md:text-2xl font-medium tracking-wide text-ivory hover:text-gold transition-colors duration-300">
            FIESTA
          </Link>

          {/* Center: nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? 'text-gold' : 'text-ivory/80 hover:text-ivory'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA */}
          <div className="hidden lg:block">
            <Link to="/plan-your-event" className="btn-gold">
              Plan Your Event
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-ivory p-2 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-obsidian" />
      <div className="relative flex flex-col h-full px-6 pt-6">
        <div className="flex items-center justify-between mb-16">
          <span className="font-serif text-2xl text-ivory">FIESTA</span>
          <button onClick={onClose} className="text-ivory p-2 -mr-2" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="group flex items-baseline gap-4 py-4 border-b border-charcoal-border transition-all duration-500"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="label-gold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
              <span className="font-serif text-3xl font-light text-ivory group-hover:text-gold transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        <Link to="/plan-your-event" onClick={onClose} className="btn-gold mt-12 self-start">
          Plan Your Event
        </Link>
      </div>
    </div>
  );
}
