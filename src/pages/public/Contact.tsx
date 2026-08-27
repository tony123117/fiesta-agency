import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { supabase } from '@/lib/supabase';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function Contact() {
  useDocumentMeta({
    title: 'Contact — Fiesta Agency',
    description: 'Get in touch with Fiesta Agency.',
  });

  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('bookings').insert({
      client_name: form.name,
      email: form.email,
      event_type: 'Other',
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">Contact</span>
            <h1 className="font-serif text-hero font-light text-ivory text-balance">
              Let's talk.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-obsidian">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-ivory block mb-2">Name</label>
                <input className="input-lux" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label-ivory block mb-2">Email</label>
                <input type="email" className="input-lux" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label-ivory block mb-2">Message</label>
                <textarea rows={4} className="textarea-lux" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn-gold" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'sent' && (
                <p className="text-gold text-sm animate-fade-in">Thank you. We'll be in touch shortly.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
              )}
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={100}>
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-light text-ivory mb-6">Reach us directly.</h2>
                <div className="space-y-4">
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-4 text-ivory-muted hover:text-gold transition-colors">
                      <Mail size={18} className="text-gold" /> {settings.email}
                    </a>
                  )}
                  {settings?.phone && (
                    <p className="flex items-center gap-4 text-ivory-muted">
                      <Phone size={18} className="text-gold" /> {settings.phone}
                    </p>
                  )}
                  {settings?.whatsapp && (
                    <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 text-ivory-muted hover:text-gold transition-colors">
                      <MessageCircle size={18} className="text-gold" /> {settings.whatsapp}
                    </a>
                  )}
                  {settings?.address && (
                    <p className="flex items-center gap-4 text-ivory-muted">
                      <MapPin size={18} className="text-gold" /> {settings.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="pt-8 border-t border-charcoal-border">
                <span className="label-ivory block mb-4">Follow</span>
                <div className="flex gap-4">
                  <a href={settings?.instagram ? `https://instagram.com/${settings.instagram.replace('@', '')}` : '#'} target="_blank" rel="noopener noreferrer" className="text-ivory-muted hover:text-gold transition-colors"><Instagram size={20} /></a>
                  <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-ivory-muted hover:text-gold transition-colors"><Facebook size={20} /></a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
