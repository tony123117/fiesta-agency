import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Music, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { getVisibleFooterGroups, getFooterCTA } from '@/lib/siteSettingsService';
import type { SiteSettings } from '@/lib/types';

const FALLBACK_CTA_HEADING = 'READY TO CREATE SOMETHING\nEXTRAORDINARY?';
const FALLBACK_CTA_SUBTEXT = 'From intimate celebrations to large-scale productions, we bring creative direction, planning and execution together under one roof.';

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const brandName = settings?.company_name || 'FIESTA';
  const logoUrl = settings?.logo_url;
  const email = settings?.email || 'hello@fiestaagency.com';
  const phone = settings?.phone || '+250 788 123 456';
  const address = settings?.address || 'Kigali, Rwanda';
  const instagram = settings?.instagram;
  const facebook = settings?.facebook;
  const tiktok = settings?.tiktok;

  const footerGroups = getVisibleFooterGroups(settings);
  const footerCTA = getFooterCTA(settings);
  const heroImage = settings?.footer_hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80';

  const ctaHeading = footerCTA.heading || FALLBACK_CTA_HEADING;
  const ctaSubtext = footerCTA.subtext || FALLBACK_CTA_SUBTEXT;
  const ctaButtonLabel = footerCTA.button_label || 'PLAN YOUR EVENT';
  const ctaButtonUrl = footerCTA.button_url || '/contact';
  const headingLines = ctaHeading.split('\n');

  return (
    <>
      {footerCTA.visible && (
        <FooterCTA
          headingLines={headingLines}
          subtext={ctaSubtext}
          buttonLabel={ctaButtonLabel}
          buttonUrl={ctaButtonUrl}
          heroImage={heroImage}
        />
      )}

      <footer className="bg-obsidian text-ivory">
        <div className="mx-auto max-w-[1320px] px-5 md:px-[4vw] lg:px-12">
          <div className="grid grid-cols-1 gap-9 py-14 sm:grid-cols-2 md:gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-14 lg:py-24">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" aria-label={`${brandName} — Home`} className="mb-5 inline-block">
                {logoUrl ? (
                  <img src={logoUrl} alt={brandName} className="h-8 w-auto object-contain" />
                ) : (
                  <span className="font-serif text-2xl md:text-3xl font-normal uppercase tracking-[0.04em] text-ivory">
                    {brandName}
                  </span>
                )}
              </Link>
              <p className="mb-6 max-w-[260px] font-sans text-[0.78rem] leading-[1.75] text-ivory/40">
                {settings?.footer_text || 'Creating extraordinary events that leave lasting impressions.'}
              </p>
              <div className="flex gap-2.5">
                {instagram && <SocialLink href={instagram} label="Instagram"><Instagram size={14} strokeWidth={1.5} /></SocialLink>}
                {facebook && <SocialLink href={facebook} label="Facebook"><Facebook size={14} strokeWidth={1.5} /></SocialLink>}
                {tiktok && <SocialLink href={tiktok} label="TikTok"><Music size={14} strokeWidth={1.5} /></SocialLink>}
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <FooterHeading>{group.title}</FooterHeading>
                <ul className="m-0 list-none p-0">
                  {group.links.map((link) => (
                    <li key={link.label} className="mb-2.5">
                      <Link
                        to={link.to}
                        className="font-sans text-[0.8rem] leading-[1.7] text-ivory/45 transition-colors duration-200 hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-1">
              <FooterHeading>Contact</FooterHeading>
              <div className="flex flex-col gap-3.5">
                {address && (
                  <ContactLine icon={<MapPin size={12} strokeWidth={1.5} />}>
                    <span className="font-sans text-[0.78rem] leading-[1.65] text-ivory/40">{address}</span>
                  </ContactLine>
                )}
                {phone && (
                  <ContactLine icon={<Phone size={12} strokeWidth={1.5} />}>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="font-sans text-[0.78rem] leading-[1.65] text-ivory/40 transition-colors duration-200 hover:text-gold"
                    >
                      {phone}
                    </a>
                  </ContactLine>
                )}
                {email && (
                  <ContactLine icon={<Mail size={12} strokeWidth={1.5} />}>
                    <a
                      href={`mailto:${email}`}
                      className="font-sans text-[0.78rem] leading-[1.65] text-ivory/40 transition-colors duration-200 hover:text-gold"
                    >
                      {email}
                    </a>
                  </ContactLine>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-[0.58rem] tracking-[0.1em] text-ivory/20">
              {settings?.copyright_text || '© 2026 Fiesta Agency. All Rights Reserved.'}
            </p>
            <div className="flex gap-5">
              <Link to="/privacy" className="font-sans text-[0.58rem] tracking-[0.1em] text-ivory/20 transition-colors duration-200 hover:text-gold/50">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-sans text-[0.58rem] tracking-[0.1em] text-ivory/20 transition-colors duration-200 hover:text-gold/50">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-5 block font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/30">
      {children}
    </span>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border border-white/10 text-ivory/40 transition-colors duration-200 hover:border-gold/40 hover:text-gold"
    >
      {children}
    </a>
  );
}

function ContactLine({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-[3px] shrink-0 text-gold/40">{icon}</span>
      {children}
    </div>
  );
}

function FooterCTA({ headingLines, subtext, buttonLabel, buttonUrl, heroImage }: {
  headingLines: string[];
  subtext: string;
  buttonLabel: string;
  buttonUrl: string;
  heroImage: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="relative overflow-hidden" style={{ height: 'clamp(300px, 40vh, 400px)', minHeight: '280px' }}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Elegant event celebration with warm atmospheric lighting"
          className="block h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-12">
        <div className="flex max-w-[640px] flex-col items-center gap-5 text-center">
          <h2 className="whitespace-pre-line font-serif font-light leading-none text-ivory" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}>
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="max-w-[440px] font-sans text-ivory/55 leading-[1.7]" style={{ fontSize: 'clamp(0.78rem, 0.9vw, 0.88rem)' }}>
            {subtext}
          </p>
          <Link
            to={buttonUrl}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="mt-1 inline-flex items-center gap-2.5 bg-gold px-8 py-3.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-obsidian transition-colors duration-200 hover:bg-[#C99738]"
          >
            {buttonLabel}
            <ArrowRight size={14} strokeWidth={2} className={`transition-transform duration-200 ${hovered ? 'translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Footer;