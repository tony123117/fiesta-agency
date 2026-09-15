import { useState, useEffect, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useReveal } from '@/lib/useReveal';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import { supabase } from '@/lib/supabase';
import type { Section } from '@/lib/types';
import { SectionRenderer } from '@/components/public/SectionRenderer';
import { FAQRenderer } from '@/components/public/FAQRenderer';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  message: string;
}

/* ─── CONTACT PAGE ─── */

export function Contact() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);

  useDocumentMeta({
    title: 'Contact | Fiesta Agency Rwanda',
    description: 'Get in touch with Fiesta to plan your next event.',
    canonicalPath: '/contact',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getPageBySlug('contact');
        if (cancelled || !page) { setLoaded(true); return; }
        const secs = await getSections(page.id);
        if (cancelled) return;
        setSections(secs.filter((s: Section) => s.published));
      } catch {
        // CMS unavailable — show nothing
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const get = (type: string) => sections.find(s => s.section_type === type)?.content || {};

  const heroSection = sections.find(s => s.section_type === 'contact-hero');
  const infoSection = sections.find(s => s.section_type === 'contact-info');
  const locationSection = sections.find(s => s.section_type === 'contact-location');
  const ctaSection = sections.find(s => s.section_type === 'contact-cta');

  if (!loaded) return null;

  return (
    <>
      {heroSection && <SectionRenderer section={heroSection} />}
      {infoSection && (
        <ContactFormSection content={infoSection.content} />
      )}
      {locationSection && <SectionRenderer section={locationSection} />}
      <FAQRenderer content={get('faq')} />
      {ctaSection && <SectionRenderer section={ctaSection} />}
    </>
  );
}

/* ─── FORM + INFO SECTION ─── */

function ContactFormSection({ content }: { content: Record<string, unknown> }) {
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const { settings } = useSiteSettings();
  const c = content as { eyebrow?: string; heading?: string; event_types?: string[] };
  const eyebrow = (c?.eyebrow || 'CONTACT INFO');
  const heading = (c?.heading || "WE'D LOVE\nTO HEAR FROM YOU.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');
  const eventTypes = c?.event_types || ['wedding', 'corporate', 'private', 'gala', 'conference', 'other'];

  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', eventType: '', date: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'd6b77b68-0673-4096-b358-2c45019787a4',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          event_type: formData.eventType || undefined,
          event_date: formData.date || undefined,
          message: formData.message,
          subject: `[Fiesta Contact] ${formData.name} - ${formData.eventType || 'General Inquiry'}`,
          from_name: 'Fiesta Agency Contact Form',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('Failed to send');

      // Fire-and-forget: save to bookings table after successful email
      void supabase.from('bookings').insert({
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        event_type: formData.eventType || 'General Inquiry',
        event_date: formData.date || null,
        location: '',
        guest_count: 0,
        budget: '',
        message: formData.message,
        status: 'new',
      });

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', eventType: '', date: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: '0.85rem',
    color: '#161616',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: '#6F6B63',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(48px, 6vw, 80px)' }}
          className="contact-form-grid"
        >
          {/* Left: Contact info */}
          <div className="contact-info">
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>{eyebrow}</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#161616',
                whiteSpace: 'pre-line' as const,
                marginBottom: '32px',
              }}>
                {parts[0]}{' '}
                <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12} visible={visible}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={16} color="#D6A54A" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>EMAIL</p>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{settings.email}</p>
                    </div>
                  </a>
                )}
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={16} color="#D6A54A" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>PHONE</p>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{settings.phone}</p>
                    </div>
                  </a>
                )}
                {settings?.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={16} color="#D6A54A" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>LOCATION</p>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{settings.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2} visible={visible}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{
                    width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'border-color 0.3s ease',
                  }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D6A54A'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}>
                    <Instagram size={16} color="#161616" strokeWidth={1.5} />
                  </a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{
                    width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'border-color 0.3s ease',
                  }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D6A54A'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}>
                    <Facebook size={16} color="#161616" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <Reveal delay={0.1} visible={visible} className="contact-form-side">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="contact-field-row">
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>NAME *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                    placeholder="Your name"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>EMAIL *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="contact-field-row">
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PHONE</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={inputStyle}
                    placeholder="+250..."
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>EVENT TYPE</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}
                  >
                    <option value="">Select type</option>
                    {eventTypes.map((t: string) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>PREFERRED DATE</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>MESSAGE *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '100px' }}
                  placeholder="Tell us about your event..."
                />
              </div>

              {status === 'success' && (
                <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.85rem', color: '#2D7D46' }}>
                  Thank you! We&apos;ll be in touch within 24 hours.
                </p>
              )}
              {status === 'error' && (
                <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.85rem', color: '#C0392B' }}>
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '8px',
                  padding: '16px 32px',
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  color: '#F8F5EF',
                  backgroundColor: '#090909',
                  border: 'none',
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  transition: 'background-color 0.3s ease, opacity 0.3s ease',
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={(e) => { if (status !== 'sending') e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#090909'; }}
              >
                {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                <Send size={14} strokeWidth={2} />
              </button>
            </form>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .contact-form-grid { grid-template-columns: 38% 1fr !important; }
          .contact-field-row { display: flex !important; gap: 24px !important; }
        }
        @media (max-width: 1023px) {
          .contact-field-row { display: flex !important; gap: 16px !important; }
        }
        @media (max-width: 640px) {
          .contact-field-row { flex-direction: column !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── REVEAL HELPER ─── */

function Reveal({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.8s ${E} ${delay}s, transform 0.8s ${E} ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default Contact;
