import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getVisibleNavigation } from "@/lib/siteSettingsService";
import type { SiteSettings } from "@/lib/types";

export function Navbar({ settings }: { settings?: SiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = getVisibleNavigation(settings ?? null);
  const brandName = settings?.company_name || "FIESTA";
  const logoUrl = settings?.logo_url;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/[0.06] bg-obsidian/[0.82] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-16 md:h-20 max-w-[1320px] items-center justify-between px-5 md:px-[4vw] lg:px-12"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            aria-label={`${brandName} — Home`}
            className="flex shrink-0 items-center"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-7 md:h-9 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-lg md:text-xl font-normal uppercase tracking-[0.08em] text-ivory">
                {brandName}
              </span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-9">
            {navLinks.map((link) => {
              const active =
                location.pathname === link.to ||
                (link.to !== "/" && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 font-sans text-[0.68rem] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                    active ? "text-gold" : "text-ivory/65 hover:text-gold"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 block h-px w-[18px] bg-gold" />
                  )}
                </Link>
              );
            })}
          </div>

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#D6A64F,#E4C070)] px-5 py-2.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-obsidian shadow-[0_14px_28px_rgba(214,166,79,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C99738]"
          >
            Plan Your Event
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 flex lg:hidden p-2 text-ivory transition-colors duration-200"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        activePath={location.pathname}
        navLinks={navLinks}
        brandName={brandName}
        logoUrl={logoUrl}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  activePath,
  navLinks,
  brandName,
  logoUrl,
}: {
  open: boolean;
  onClose: () => void;
  activePath: string;
  navLinks: { label: string; to: string }[];
  brandName: string;
  logoUrl?: string | null;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusable =
          menuRef.current.querySelectorAll<HTMLElement>("a, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{ backgroundColor: "#090909" }}
      className={`fixed inset-0 z-[60] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(214,166,79,0.12),transparent_25%)] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex h-full flex-col p-5 md:p-8">
        <div className="mb-12 md:mb-16 flex items-center justify-between">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="h-7 w-auto object-contain"
            />
          ) : (
            <span className="font-serif text-base uppercase tracking-[0.06em] text-ivory">
              {brandName}
            </span>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 text-ivory/50 transition-colors duration-200 hover:text-gold"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col justify-center"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link, i) => {
            const active =
              activePath === link.to ||
              (link.to !== "/" && activePath.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
                className={`flex items-baseline gap-4 border-b border-white/[0.05] py-4 md:py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                } ${active ? "text-gold" : "text-ivory/65 hover:text-gold"}`}
              >
                <span className="min-w-[18px] font-serif text-[0.65rem] text-gold/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-2xl md:text-4xl font-light uppercase tracking-[0.02em]">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`flex flex-col gap-5 pt-6 transition-all duration-500 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            to="/contact"
            onClick={onClose}
            className="inline-flex items-center gap-2.5 self-start bg-gold px-7 py-4 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-obsidian"
          >
            Plan Your Event
          </Link>
          <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.12em] text-ivory/25">
            FIESTA AGENCY
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
