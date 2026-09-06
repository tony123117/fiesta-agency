import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Music, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { getVisibleFooterGroups, getFooterCTA } from '@/lib/siteSettingsService';
import type { SiteSettings } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const FALLBACK_CTA_HEADING = "READY TO CREATE SOMETHING\nEXTRAORDINARY?";
const FALLBACK_CTA_SUBTEXT = 'From intimate celebrations to large-scale productions, we bring creative direction, planning and execution together under one roof.';

/* ─── FOOTER ─── */

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
      {/* ═══ 01 — CINEMATIC CTA ═══ */}
      {footerCTA.visible && (
        <FooterCTA
          headingLines={headingLines}
          subtext={ctaSubtext}
          buttonLabel={ctaButtonLabel}
          buttonUrl={ctaButtonUrl}
          heroImage={heroImage}
        />
      )}

      {/* ═══ 02 — MAIN FOOTER ═══ */}
      <footer style={{ backgroundColor: '#090909', color: '#F8F5EF' }}>
        <div style={{
          maxWidth: '1320px',
          margin: '0 auto',
          paddingLeft: 'clamp(20px, 4vw, 48px)',
          paddingRight: 'clamp(20px, 4vw, 48px)',
        }}>
          {/* Main content grid */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(32px, 4vw, 56px)',
            paddingTop: 'clamp(60px, 8vw, 100px)',
            paddingBottom: 'clamp(48px, 6vw, 72px)',
          }}>
            {/* Col 1: Brand */}
            <div className="footer-brand">
              <Link to="/" aria-label={`${brandName} — Home`} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
                {logoUrl ? (
                  <img src={logoUrl} alt={brandName} style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                ) : (
                  <span style={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    color: '#F8F5EF',
                  }}>
                    {brandName}
                  </span>
                )}
              </Link>
              <p style={{
                fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: '0.78rem',
                lineHeight: 1.75,
                color: 'rgba(248,245,239,0.4)',
                maxWidth: '260px',
                marginBottom: '24px',
              }}>
                {settings?.footer_text || 'Creating extraordinary events that leave lasting impressions.'}
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{
                    width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: 'rgba(248,245,239,0.4)',
                    transition: 'border-color 250ms ease, color 250ms ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(214,165,74,0.4)'; e.currentTarget.style.color = '#D6A54A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(248,245,239,0.4)'; }}
                  >
                    <Instagram size={14} strokeWidth={1.5} />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{
                    width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: 'rgba(248,245,239,0.4)',
                    transition: 'border-color 250ms ease, color 250ms ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(214,165,74,0.4)'; e.currentTarget.style.color = '#D6A54A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(248,245,239,0.4)'; }}
                  >
                    <Facebook size={14} strokeWidth={1.5} />
                  </a>
                )}
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{
                    width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: 'rgba(248,245,239,0.4)',
                    transition: 'border-color 250ms ease, color 250ms ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(214,165,74,0.4)'; e.currentTarget.style.color = '#D6A54A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(248,245,239,0.4)'; }}
                  >
                    <Music size={14} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>

            {/* Col 2+: Dynamic footer groups */}
            {footerGroups.map((group, gi) => (
              <div key={group.title} className="footer-group">
                <span style={{
                  fontFamily: '"Manrope", system-ui, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.16em',
                  color: 'rgba(248,245,239,0.3)',
                  display: 'block',
                  marginBottom: '20px',
                }}>
                  {group.title}
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.links.map((link) => (
                    <li key={link.label} style={{ marginBottom: '10px' }}>
                      <Link
                        to={link.to}
                        style={{
                          fontFamily: '"Manrope", system-ui, sans-serif',
                          fontSize: '0.8rem',
                          color: 'rgba(248,245,239,0.45)',
                          textDecoration: 'none',
                          lineHeight: 1.7,
                          transition: 'color 250ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.45)'; }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div className="footer-contact">
              <span style={{
                fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.16em',
                color: 'rgba(248,245,239,0.3)',
                display: 'block',
                marginBottom: '20px',
              }}>
                CONTACT
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={12} strokeWidth={1.5} style={{ color: 'rgba(214,165,74,0.4)', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontFamily: '"Manrope", system-ui, sans-serif', fontSize: '0.78rem', color: 'rgba(248,245,239,0.4)', lineHeight: 1.65 }}>
                      {address}
                    </span>
                  </div>
                )}
                {phone && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Phone size={12} strokeWidth={1.5} style={{ color: 'rgba(214,165,74,0.4)', marginTop: '3px', flexShrink: 0 }} />
                    <a href={`tel:${phone.replace(/\s/g, '')}`} style={{
                      fontFamily: '"Manrope", system-ui, sans-serif', fontSize: '0.78rem', color: 'rgba(248,245,239,0.4)',
                      textDecoration: 'none', lineHeight: 1.65, transition: 'color 250ms ease',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.4)'; }}
                    >
                      {phone}
                    </a>
                  </div>
                )}
                {email && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Mail size={12} strokeWidth={1.5} style={{ color: 'rgba(214,165,74,0.4)', marginTop: '3px', flexShrink: 0 }} />
                    <a href={`mailto:${email}`} style={{
                      fontFamily: '"Manrope", system-ui, sans-serif', fontSize: '0.78rem', color: 'rgba(248,245,239,0.4)',
                      textDecoration: 'none', lineHeight: 1.65, transition: 'color 250ms ease',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.4)'; }}
                    >
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

          {/* ═══ 03 — BOTTOM LEGAL BAR ═══ */}
          <div className="footer-legal" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'clamp(20px, 2.5vw, 28px)',
            paddingBottom: 'clamp(20px, 2.5vw, 28px)',
          }}>
            <p style={{
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: '0.58rem',
              color: 'rgba(248,245,239,0.2)',
              letterSpacing: '0.1em',
            }}>
              {settings?.copyright_text || '© 2026 Fiesta Agency. All Rights Reserved.'}
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/privacy" style={{
                fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: '0.58rem',
                color: 'rgba(248,245,239,0.2)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'color 250ms ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(214,165,74,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.2)'; }}
              >
                Privacy Policy
              </Link>
              <Link to="/terms" style={{
                fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: '0.58rem',
                color: 'rgba(248,245,239,0.2)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'color 250ms ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(214,165,74,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,245,239,0.2)'; }}
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE ── */}
      <style>{`
        .footer-grid { grid-template-columns: 1.4fr repeat(3, 1fr) !important; }
        .footer-brand { grid-column: span 1; }
        .footer-group { grid-column: span 1; }
        .footer-contact { grid-column: span 1; }
        @media (max-width: 1023px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          .footer-brand { grid-column: span 2; }
          .footer-contact { grid-column: span 2; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-brand { grid-column: span 1; }
          .footer-contact { grid-column: span 1; }
          .footer-legal { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
        }
      `}</style>
    </>
  );
}

/* ─── FOOTER CTA SECTION ─── */

function FooterCTA({ headingLines, subtext, buttonLabel, buttonUrl, heroImage }: {
  headingLines: string[];
  subtext: string;
  buttonLabel: string;
  buttonUrl: string;
  heroImage: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', height: 'clamp(300px, 40vh, 400px)', minHeight: '280px' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src={heroImage}
          alt="Elegant event celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.7) 100%)',
      }} />
      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: 'clamp(24px, 5vw, 48px)',
        paddingRight: 'clamp(24px, 5vw, 48px)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center' as const,
          gap: '20px',
          maxWidth: '640px',
        }}>
          <h2 style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            fontWeight: 400,
            lineHeight: 1.0,
            color: '#F8F5EF',
            whiteSpace: 'pre-line' as const,
          }}>
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p style={{
            fontFamily: '"Manrope", system-ui, sans-serif',
            fontSize: 'clamp(0.78rem, 0.9vw, 0.88rem)',
            lineHeight: 1.7,
            color: 'rgba(248,245,239,0.55)',
            maxWidth: '440px',
          }}>
            {subtext}
          </p>
          <Link
            to={buttonUrl}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '4px',
              padding: '14px 32px',
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.14em',
              color: '#090909',
              backgroundColor: '#D6A54A',
              textDecoration: 'none',
              border: 'none',
              transition: 'background-color 250ms ease',
              ...(hovered ? { backgroundColor: '#C99738' } : {}),
            }}
          >
            {buttonLabel}
            <ArrowRight size={14} strokeWidth={2} style={{
              transition: 'transform 250ms ease',
              transform: hovered ? 'translateX(3px)' : 'translateX(0)',
            }} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Footer;
