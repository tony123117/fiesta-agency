import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getVisibleNavigation } from '@/lib/siteSettingsService';
import type { SiteSettings } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ─── NAVBAR ─── */

export function Navbar({ settings }: { settings?: SiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  const navLinks = getVisibleNavigation(settings ?? null);
  const brandName = settings?.company_name || 'FIESTA';
  const logoUrl = settings?.logo_url;

  // All public pages have dark heroes — always use light navbar
  const isDark = true;

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* ── DESKTOP + MOBILE HEADER ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrolled
            ? 'rgba(9,9,9,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background-color 350ms ease, backdrop-filter 350ms ease, border-color 350ms ease',
        }}
      >
        <nav
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            paddingLeft: 'clamp(20px, 4vw, 48px)',
            paddingRight: 'clamp(20px, 4vw, 48px)',
            height: 'clamp(64px, 7vw, 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label={`${brandName} — Home`}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                style={{ height: 'clamp(28px, 3.5vw, 38px)', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <span
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: '#F8F5EF',
                }}
              >
                {brandName}
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="nav-desktop-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(20px, 2.5vw, 36px)',
          }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    fontFamily: '"Manrope", system-ui, sans-serif',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    color: active ? '#D6A54A' : 'rgba(248,245,239,0.65)',
                    transition: 'color 250ms ease',
                    position: 'relative' as const,
                    padding: '4px 0',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#D6A54A'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'rgba(248,245,239,0.65)'; }}
                >
                  {link.label}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '18px',
                      height: '1px',
                      backgroundColor: '#D6A54A',
                      display: 'block',
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA button */}
          <Link
            to="/contact"
            className="nav-desktop-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.12em',
              color: '#090909',
              backgroundColor: '#D6A54A',
              textDecoration: 'none',
              border: 'none',
              transition: 'background-color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C99738'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D6A54A'; }}
          >
            PLAN YOUR EVENT
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#F8F5EF',
              cursor: 'pointer',
              padding: '8px',
              marginRight: '-8px',
              transition: 'color 250ms ease',
            }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        prefersReducedMotion={prefersReducedMotion}
        activePath={location.pathname}
        navLinks={navLinks}
        brandName={brandName}
        logoUrl={logoUrl}
      />

      {/* ── RESPONSIVE ── */}
      <style>{`
        .nav-desktop-links { display: flex !important; }
        .nav-desktop-cta { display: inline-flex !important; }
        .nav-mobile-btn { display: none !important; }
        @media (max-width: 1023px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-cta { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ─── MOBILE MENU ─── */

function MobileMenu({ open, onClose, prefersReducedMotion, activePath, navLinks, brandName, logoUrl }: {
  open: boolean;
  onClose: () => void;
  prefersReducedMotion: boolean;
  activePath: string;
  navLinks: { label: string; to: string }[];
  brandName: string;
  logoUrl: string | null;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>('a, button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus first link on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const dur = prefersReducedMotion ? '0ms' : '450ms';

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: '#090909',
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: `opacity ${dur} ${EASE}`,
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(20px, 5vw, 32px)',
        paddingTop: 'clamp(20px, 5vw, 32px)',
      }}>
        {/* Header: brand + close */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(40px, 8vw, 64px)',
        }}>
          <span style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: '#F8F5EF',
          }}>
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              brandName
            )}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(248,245,239,0.5)',
              cursor: 'pointer',
              padding: '8px',
              transition: 'color 250ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.5)'; }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} aria-label="Mobile navigation">
          {navLinks.map((link, i) => {
            const active = activePath === link.to ||
              (link.to !== '/' && activePath.startsWith(link.to));
            return (
              <Link
                ref={i === 0 ? firstLinkRef : undefined}
                key={link.to}
                to={link.to}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '16px',
                  padding: 'clamp(14px, 3vw, 20px) 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none',
                  color: active ? '#D6A54A' : 'rgba(248,245,239,0.65)',
                  transition: 'color 250ms ease',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateX(0)' : 'translateX(24px)',
                  transitionProperty: 'opacity, transform, color',
                  transitionDuration: dur,
                  transitionTimingFunction: EASE,
                  transitionDelay: prefersReducedMotion ? '0ms' : `${i * 50}ms`,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#D6A54A'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'rgba(248,245,239,0.65)'; }}
              >
                <span style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: '0.65rem',
                  fontWeight: 400,
                  color: 'rgba(214,165,74,0.45)',
                  minWidth: '18px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase' as const,
                }}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingTop: '24px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity ${dur} ${EASE} ${prefersReducedMotion ? '0ms' : '350ms'}, transform ${dur} ${EASE} ${prefersReducedMotion ? '0ms' : '350ms'}`,
        }}>
          <Link
            to="/contact"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 28px',
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.14em',
              color: '#090909',
              backgroundColor: '#D6A54A',
              textDecoration: 'none',
              border: 'none',
              alignSelf: 'flex-start',
            }}
          >
            PLAN YOUR EVENT
          </Link>
          <span style={{
            fontFamily: '"Manrope", system-ui, sans-serif',
            fontSize: '0.6rem',
            fontWeight: 500,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.12em',
            color: 'rgba(248,245,239,0.25)',
          }}>
            FIESTA AGENCY
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── HOOKS ─── */

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

export default Navbar;
