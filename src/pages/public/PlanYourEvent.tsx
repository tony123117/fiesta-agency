import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { EVENT_TYPES_FORM } from '@/lib/types';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  preferred_date: string;
  location: string;
  guest_count: string;
  budget_range: string;
  about_event: string;
  referral: string;
}

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 — $15,000',
  '$15,000 — $50,000',
  '$50,000 — $100,000',
  '$100,000+',
  'Prefer not to say',
];

const REFERRALS = ['Instagram', 'Facebook', 'Referral', 'Google Search', 'Event Attended', 'Other'];

export function PlanYourEvent() {
  useDocumentMeta({
    title: 'Plan Your Event — Fiesta Agency',
    description: 'Tell us what you\'re imagining. We\'ll take it from idea to experience.',
  });

  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', phone: '', event_type: '', preferred_date: '',
    location: '', guest_count: '', budget_range: '', about_event: '', referral: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.full_name) e.full_name = 'Required';
    if (!form.email) e.email = 'Required';
    if (!form.event_type) e.event_type = 'Please select';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const { error } = await supabase.from('bookings').insert({
      client_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      event_type: form.event_type,
      event_date: form.preferred_date || null,
      location: form.location || null,
      guest_count: form.guest_count ? parseInt(form.guest_count) : null,
      budget: form.budget_range || null,
      message: form.about_event || null,
      referral: form.referral || null,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return <Confirmation />;
  }

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">Plan Your Event</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              Let's create something unforgettable.
            </h1>
            <p className="mt-8 text-lg text-ivory-muted max-w-2xl leading-relaxed">
              Tell us what you're imagining. We'll take it from idea to experience.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-obsidian">
        <div className="container-lux max-w-3xl">
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Full Name" error={errors.full_name} required>
                  <input className="input-lux" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </Field>
                <Field label="Email" error={errors.email} required>
                  <input type="email" className="input-lux" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Phone">
                  <input className="input-lux" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Event Type" error={errors.event_type} required>
                  <select className="select-lux" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                    <option value="" className="bg-obsidian">Select event type</option>
                    {EVENT_TYPES_FORM.map((t) => <option key={t} value={t} className="bg-obsidian">{t}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Date">
                  <input type="date" className="input-lux" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
                </Field>
                <Field label="Location">
                  <input className="input-lux" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </Field>
                <Field label="Estimated Guest Count">
                  <input type="number" min="0" className="input-lux" value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: e.target.value })} />
                </Field>
                <Field label="Budget Range">
                  <select className="select-lux" value={form.budget_range} onChange={(e) => setForm({ ...form, budget_range: e.target.value })}>
                    <option value="" className="bg-obsidian">Select range</option>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b} className="bg-obsidian">{b}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Tell Us About Your Event">
                <textarea rows={5} className="textarea-lux" value={form.about_event} onChange={(e) => setForm({ ...form, about_event: e.target.value })} />
              </Field>

              <Field label="How Did You Hear About Us?">
                <select className="select-lux" value={form.referral} onChange={(e) => setForm({ ...form, referral: e.target.value })}>
                  <option value="" className="bg-obsidian">Select</option>
                  {REFERRALS.map((r) => <option key={r} value={r} className="bg-obsidian">{r}</option>)}
                </select>
              </Field>

              <div className="pt-4">
                <button type="submit" className="btn-gold" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Begin Your Event'} <ArrowRight size={16} />
                </button>
                {status === 'error' && (
                  <p className="text-red-400 text-sm mt-4">Something went wrong. Please try again or email us directly.</p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-ivory block mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

function Confirmation() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-obsidian pt-20">
      <div className="container-narrow text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold mb-10 animate-fade-in">
          <Check size={32} className="text-gold" />
        </div>
        <h1 className="font-serif text-display md:text-5xl font-light text-ivory mb-6 animate-fade-up">
          Your story has begun.
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mb-8" />
        <p className="text-lg text-ivory-muted max-w-xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Thank you for reaching out to Fiesta. Our team will review your vision and get back to you shortly.
        </p>
      </div>
    </section>
  );
}
