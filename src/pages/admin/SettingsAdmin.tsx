import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminButton, AdminInput, AdminTextarea, AdminLoading, Toast } from '@/components/admin/AdminUI';
import type { SiteSettings } from '@/lib/types';

export function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      setSettings(data as SiteSettings | null);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('site_settings').update({
      company_name: settings.company_name, tagline: settings.tagline, logo_url: settings.logo_url,
      email: settings.email, phone: settings.phone, whatsapp: settings.whatsapp, address: settings.address,
      instagram: settings.instagram, facebook: settings.facebook, tiktok: settings.tiktok,
      seo_title: settings.seo_title, seo_description: settings.seo_description, footer_text: settings.footer_text,
    }).eq('id', 1);
    setSaving(false);
    setToast(error ? 'Save failed' : 'Settings saved');
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !settings) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <PageHeader title="Site Settings" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Company Name" value={settings.company_name} onChange={(v) => setSettings({ ...settings, company_name: v })} />
          <AdminInput label="Tagline" value={settings.tagline} onChange={(v) => setSettings({ ...settings, tagline: v })} />
        </div>
        <AdminInput label="Logo URL" value={settings.logo_url || ''} onChange={(v) => setSettings({ ...settings, logo_url: v })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Email" value={settings.email || ''} onChange={(v) => setSettings({ ...settings, email: v })} />
          <AdminInput label="Phone" value={settings.phone || ''} onChange={(v) => setSettings({ ...settings, phone: v })} />
          <AdminInput label="WhatsApp" value={settings.whatsapp || ''} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
          <AdminInput label="Address" value={settings.address || ''} onChange={(v) => setSettings({ ...settings, address: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminInput label="Instagram" value={settings.instagram || ''} onChange={(v) => setSettings({ ...settings, instagram: v })} />
          <AdminInput label="Facebook" value={settings.facebook || ''} onChange={(v) => setSettings({ ...settings, facebook: v })} />
          <AdminInput label="TikTok" value={settings.tiktok || ''} onChange={(v) => setSettings({ ...settings, tiktok: v })} />
        </div>
        <AdminInput label="SEO Title" value={settings.seo_title || ''} onChange={(v) => setSettings({ ...settings, seo_title: v })} />
        <AdminTextarea label="SEO Description" value={settings.seo_description || ''} onChange={(v) => setSettings({ ...settings, seo_description: v })} rows={2} />
        <AdminTextarea label="Footer Text" value={settings.footer_text || ''} onChange={(v) => setSettings({ ...settings, footer_text: v })} rows={2} />
        <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</AdminButton>
      </form>
      {toast && <Toast message={toast} />}
    </div>
  );
}
