import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { supabase } from '@/lib/supabase';

interface ContactInfoContent {
  eyebrow?: string;
  heading?: string;
  event_types?: string[];
  email?: string;
  phone?: string;
  address?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  message: string;
}

export function ContactInfo({ content }: { content: unknown }) {
  const data = content as ContactInfoContent;
  const { settings } = useSiteSettings();
  const heading = (data?.heading || "WE'D LOVE\nTO HEAR FROM YOU.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');
  const eventTypes = data?.event_types || ['wedding', 'corporate', 'private', 'gala', 'conference', 'other'];

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
    } catch {
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
    <section style={{
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
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>{data?.eyebrow || 'CONTACT INFO'}</p>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
              {(data?.email || settings?.email) && (
                <a href={`mailto:${data?.email || settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                  <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={16} color="#D6A54A" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>EMAIL</p>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{data?.email || settings.email}</p>
                  </div>
                </a>
              )}
              {(data?.phone || settings?.phone) && (
                <a href={`tel:${data?.phone || settings.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                  <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={16} color="#D6A54A" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>PHONE</p>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{data?.phone || settings.phone}</p>
                  </div>
                </a>
              )}
              {(data?.address || settings?.address) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} color="#D6A54A" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6F6B63', marginBottom: '4px' }}>LOCATION</p>
                    <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', color: '#161616' }}>{data?.address || settings.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{
                  width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                }}>
                  <Instagram size={16} color="#161616" strokeWidth={1.5} />
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{
                  width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                }}>
                  <Facebook size={16} color="#161616" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-side">
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
                  alignSelf: 'flex-start',
                }}
              >
                {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                <Send size={14} strokeWidth={2} />
              </button>
            </form>
          </div>
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
