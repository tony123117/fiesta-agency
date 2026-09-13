import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

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
  useDocumentMeta({
    title: 'Contact | Fiesta Agency Rwanda',
    description: 'Get in touch with Fiesta to plan your next event.',
  });

  return (
    <>
      <C01Hero />
      <C02Form />
      <C03Location />
      <C04CTA />
    </>
  );
}

/* ─── 01 — HERO ─── */

function C01Hero() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ backgroundColor: '#090909', overflow: 'hidden' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(90px, 12vw, 160px)',
        paddingBottom: 'clamp(50px, 6vw, 80px)',
      }}>
        <div style={{ display: 'flex', gap: 'clamp(32px, 4vw, 56px)', alignItems: 'flex-start' }}
          className="contact-hero-grid"
        >
          <div style={{ flex: '0 0 45%' }} className="contact-hero-text">
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>GET IN TOUCH</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                whiteSpace: 'pre-line' as const,
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {"LET'S MAKE\nYOUR NEXT EVENT\nEXTRAORDINARY."}
              </h1>
            </Reveal>
            <Reveal delay={0.14} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C8C2B8',
                maxWidth: '390px',
                marginBottom: '32px',
              }}>
                Whether you have a clear vision or just the beginning of an idea, we&apos;re here to help bring it to life. Let&apos;s start a conversation.
              </p>
            </Reveal>
            <Reveal delay={0.2} visible={visible}>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#D6A54A' }} />
            </Reveal>
          </div>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ flex: 1, overflow: 'hidden' }} className="contact-hero-img">
              <img
                src={images.hero[6]}
                alt="Elegant event setup with warm lighting"
                style={{
                  width: '100%',
                  height: 'clamp(300px, 28vw, 340px)',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .contact-hero-grid { flex-direction: column !important; }
          .contact-hero-text { flex: none !important; width: 100% !important; }
          .contact-hero-img { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — FORM + INFO ─── */

function C02Form() {
  const { ref, visible } = useReveal({ threshold: 0.06 });
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', eventType: '', date: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        event_type: formData.eventType || null,
        event_date: formData.date || null,
        message: formData.message,
      });
      if (error) throw error;
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
              }}>CONTACT INFO</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
              whiteSpace: 'pre-line' as const,
              marginBottom: '32px',
            }}>{"WE'D LOVE\nTO HEAR FROM YOU."}</h2>
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
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="private">Private Party</option>
                    <option value="gala">Gala Dinner</option>
                    <option value="conference">Conference</option>
                    <option value="other">Other</option>
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

/* ─── 03 — LOCATION ─── */

function C03Location() {
  const { ref, visible } = useReveal({ threshold: '0.08' });
  const { settings } = useSiteSettings();

  return (
    <section ref={ref} style={{
      backgroundColor: '#FFFFFF',
      paddingTop: 'clamp(80px, 10vw, 130px)',
      paddingBottom: 'clamp(80px, 10vw, 130px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="contact-location-grid"
        >
          <div className="contact-location-text">
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>VISIT US</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#161616',
              whiteSpace: 'pre-line' as const,
              marginBottom: '20px',
            }}>{"OUR\nOFFICE."}</h2>
            </Reveal>

            <Reveal delay={0.12} visible={visible}>
              {settings?.address && (
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
                  lineHeight: 1.75,
                  color: '#6F6B63',
                  marginBottom: '24px',
                }}>{settings.address}</p>
              )}
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.88rem, 1vw, 0.94rem)',
                lineHeight: 1.75,
                color: '#6F6B63',
                marginBottom: '24px',
              }}>
                We welcome visits by appointment. Reach out to schedule a meeting at our office to discuss your event in person.
              </p>
              <div style={{ width: '32px', height: '1.5px', backgroundColor: '#D6A54A' }} />
            </Reveal>
          </div>

          <Reveal delay={0.1} visible={visible}>
            <div style={{
              overflow: 'hidden',
              backgroundColor: '#F1EDE3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '16/10',
            }}>
              <img
                src={images.process[2]}
                alt="Map showing Fiesta Agency office location in Kigali"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: 0.6,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .contact-location-grid { grid-template-columns: 38% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 04 — CTA ─── */

function C04CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={images.intimate[5]}
          alt="Beautiful outdoor celebration setup with ambient lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        paddingLeft: 'clamp(24px, 4vw, 40px)',
        paddingRight: 'clamp(24px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s ${E} 0.1s, transform 0.9s ${E} 0.1s`,
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"READY TO START?\nWE'RE ALL EARS."}
        </h2>
      </div>
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
