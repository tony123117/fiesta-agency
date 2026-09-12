import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';


import { PageHeader, AdminLoading, AdminInput, AdminTextarea, AdminButton, AdminCard, AdminToggle, Toast } from '@/components/admin/AdminUI';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { getDefaultNavigation, getDefaultFooterGroups, getDefaultFooterCTA, getSiteSettings, updateSiteSettings } from '@/lib/siteSettingsService';
import type { SiteSettings, NavItem, FooterGroup, FooterLink, FooterCTA } from '@/lib/types';
import type { MediaItem } from '@/lib/types';

type Tab = 'identity' | 'navigation' | 'contact' | 'social' | 'footer' | 'seo';

const TABS: { key: Tab; label: string }[] = [
  { key: 'identity', label: 'Site Identity' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social Links' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
];

export function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const [ogPickerOpen, setOgPickerOpen] = useState(false);
  const [footerImagePickerOpen, setFooterImagePickerOpen] = useState(false);

  const load = useCallback(async () => {
    const data = await getSiteSettings();
    if (data) setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await updateSiteSettings(settings);
    if (error) {
      setToast('Save failed: ' + error);
    } else {
      setToast('Settings saved');
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const update = (field: keyof SiteSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) return <AdminLoading />;

  return (
    <div style={{ padding: '0' }}>
      <PageHeader
        title="GLOBAL SETTINGS"
        description="Manage your site-wide content, navigation, and branding"
        action={
          <AdminButton onClick={save} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            Save Changes
          </AdminButton>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 border-b border-white/[0.06]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'text-gold border-gold'
                : 'text-white/40 border-transparent hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-3xl">
        {activeTab === 'identity' && settings && (
          <IdentityTab settings={settings} update={update} logoPickerOpen={logoPickerOpen} setLogoPickerOpen={setLogoPickerOpen} />
        )}
        {activeTab === 'navigation' && settings && (
          <NavigationTab settings={settings} update={update} />
        )}
        {activeTab === 'contact' && settings && (
          <ContactTab settings={settings} update={update} />
        )}
        {activeTab === 'social' && settings && (
          <SocialTab settings={settings} update={update} />
        )}
        {activeTab === 'footer' && settings && (
          <FooterTab settings={settings} update={update} footerImagePickerOpen={footerImagePickerOpen} setFooterImagePickerOpen={setFooterImagePickerOpen} />
        )}
        {activeTab === 'seo' && settings && (
          <SEOTab settings={settings} update={update} ogPickerOpen={ogPickerOpen} setOgPickerOpen={setOgPickerOpen} />
        )}
      </div>

      {/* Media pickers */}
      <MediaPicker
        open={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        onSelect={(items: MediaItem[]) => {
          if (items[0]) update('logo_url', items[0].public_url);
          setLogoPickerOpen(false);
        }}
      />
      <MediaPicker
        open={ogPickerOpen}
        onClose={() => setOgPickerOpen(false)}
        onSelect={(items: MediaItem[]) => {
          if (items[0]) update('og_image_url', items[0].public_url);
          setOgPickerOpen(false);
        }}
      />
      <MediaPicker
        open={footerImagePickerOpen}
        onClose={() => setFooterImagePickerOpen(false)}
        onSelect={(items: MediaItem[]) => {
          if (items[0]) update('footer_hero_image', items[0].public_url);
          setFooterImagePickerOpen(false);
        }}
      />

      {toast && <Toast message={toast} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   IDENTITY TAB
   ═══════════════════════════════════════════════ */
function IdentityTab({ settings, update, setLogoPickerOpen }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
  logoPickerOpen?: boolean;
  setLogoPickerOpen: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Brand</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Company Name" name="company_name" value={settings.company_name} onChange={(e) => update('company_name', e.target.value)} />
          <AdminInput label="Tagline" name="tagline" value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 block mb-1.5">Logo</label>
          <div className="flex items-center gap-4">
            {settings.logo_url && (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-auto object-contain bg-white/[0.04] p-2 rounded" />
            )}
            <AdminButton variant="secondary" size="sm" onClick={() => setLogoPickerOpen(true)}>
              {settings.logo_url ? 'Change Logo' : 'Upload Logo'}
            </AdminButton>
            {settings.logo_url && (
              <AdminButton variant="ghost" size="sm" onClick={() => update('logo_url', null)}>Remove</AdminButton>
            )}
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Navigation CTA Button</h3>
        <AdminToggle label="Show CTA button in navigation" checked={settings.nav_cta_visible ?? true} onChange={(v) => update('nav_cta_visible', v)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AdminInput label="Button Label" name="nav_cta_label" value={settings.nav_cta_label || ''} onChange={(e) => update('nav_cta_label', e.target.value)} placeholder="PLAN YOUR EVENT" />
          <AdminInput label="Button URL" name="nav_cta_url" value={settings.nav_cta_url || ''} onChange={(e) => update('nav_cta_url', e.target.value)} placeholder="/contact" />
        </div>
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NAVIGATION TAB
   ═══════════════════════════════════════════════ */
function NavigationTab({ settings, update }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
}) {
  const nav: NavItem[] = settings.navigation?.length ? settings.navigation : getDefaultNavigation();

  const updateNav = (items: NavItem[]) => {
    update('navigation', items);
  };

  const toggleVisible = (index: number) => {
    const next = [...nav];
    next[index] = { ...next[index], visible: !next[index].visible };
    updateNav(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...nav];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    next.forEach((n, i) => { n.order = i; });
    updateNav(next);
  };

  const moveDown = (index: number) => {
    if (index >= nav.length - 1) return;
    const next = [...nav];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    next.forEach((n, i) => { n.order = i; });
    updateNav(next);
  };

  const addItem = () => {
    const next = [...nav, { label: 'New Link', to: '/', visible: true, order: nav.length }];
    updateNav(next);
  };

  const removeItem = (index: number) => {
    const next = nav.filter((_, i) => i !== index);
    next.forEach((n, i) => { n.order = i; });
    updateNav(next);
  };

  const updateItem = (index: number, field: keyof NavItem, value: unknown) => {
    const next = [...nav];
    next[index] = { ...next[index], [field]: value };
    updateNav(next);
  };

  return (
    <div className="space-y-4">
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50">Navigation Links</h3>
          <AdminButton variant="secondary" size="sm" onClick={addItem}>
            <Plus size={13} /> Add Link
          </AdminButton>
        </div>
        <p className="text-[0.75rem] text-white/30 mb-4">Drag or use arrows to reorder. Toggle visibility to show/hide links.</p>

        <div className="space-y-2">
          {nav.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="text-white/30 hover:text-white/60 disabled:opacity-20" aria-label="Move up">
                  <ChevronUp size={12} />
                </button>
                <button onClick={() => moveDown(i)} disabled={i === nav.length - 1} className="text-white/30 hover:text-white/60 disabled:opacity-20" aria-label="Move down">
                  <ChevronDown size={12} />
                </button>
              </div>
              <input
                value={item.label}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                className="flex-1 min-w-[100px] bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[0.8rem] text-ivory rounded focus:border-gold/40 focus:outline-none"
                placeholder="Label"
              />
              <input
                value={item.to}
                onChange={(e) => updateItem(i, 'to', e.target.value)}
                className="flex-1 min-w-[100px] bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[0.8rem] text-ivory rounded focus:border-gold/40 focus:outline-none"
                placeholder="/path"
              />
              <button
                onClick={() => toggleVisible(i)}
                className={`p-1.5 rounded transition-colors ${item.visible ? 'text-gold' : 'text-white/20'}`}
                aria-label={item.visible ? 'Hide' : 'Show'}
              >
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => removeItem(i)}
                className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                aria-label="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT TAB
   ═══════════════════════════════════════════════ */
function ContactTab({ settings, update }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Email" type="email" name="email" value={settings.email || ''} onChange={(e) => update('email', e.target.value)} />
          <AdminInput label="Phone" name="phone" value={settings.phone || ''} onChange={(e) => update('phone', e.target.value)} />
          <AdminInput label="WhatsApp" name="whatsapp" value={settings.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} placeholder="+250 788 123 456" />
          <AdminInput label="Address" name="address" value={settings.address || ''} onChange={(e) => update('address', e.target.value)} />
        </div>
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL TAB
   ═══════════════════════════════════════════════ */
function SocialTab({ settings, update }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 gap-4">
          <AdminInput label="Instagram URL" name="instagram" value={settings.instagram || ''} onChange={(e) => update('instagram', e.target.value)} placeholder="https://instagram.com/..." />
          <AdminInput label="Facebook URL" name="facebook" value={settings.facebook || ''} onChange={(e) => update('facebook', e.target.value)} placeholder="https://facebook.com/..." />
          <AdminInput label="TikTok URL" name="tiktok" value={settings.tiktok || ''} onChange={(e) => update('tiktok', e.target.value)} placeholder="https://tiktok.com/..." />
        </div>
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER TAB
   ═══════════════════════════════════════════════ */
function FooterTab({ settings, update, setFooterImagePickerOpen }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
  footerImagePickerOpen?: boolean;
  setFooterImagePickerOpen: (v: boolean) => void;
}) {
  const cta: FooterCTA = settings.footer_cta || getDefaultFooterCTA();
  const groups: FooterGroup[] = settings.footer_groups?.length ? settings.footer_groups : getDefaultFooterGroups();

  const updateCTA = (field: keyof FooterCTA, value: unknown) => {
    update('footer_cta', { ...cta, [field]: value });
  };

  const updateGroup = (gi: number, field: keyof FooterGroup, value: unknown) => {
    const next = [...groups];
    next[gi] = { ...next[gi], [field]: value };
    update('footer_groups', next);
  };

  const updateGroupLink = (gi: number, li: number, field: keyof FooterLink, value: unknown) => {
    const next = [...groups];
    const links = [...next[gi].links];
    links[li] = { ...links[li], [field]: value };
    next[gi] = { ...next[gi], links };
    update('footer_groups', next);
  };

  const addGroup = () => {
    const next = [...groups, { title: 'NEW GROUP', visible: true, order: groups.length, links: [] }];
    update('footer_groups', next);
  };

  const removeGroup = (gi: number) => {
    const next = groups.filter((_, i) => i !== gi);
    update('footer_groups', next);
  };

  const addGroupLink = (gi: number) => {
    const next = [...groups];
    const links = [...next[gi].links, { label: 'New Link', to: '/', visible: true }];
    next[gi] = { ...next[gi], links };
    update('footer_groups', next);
  };

  const removeGroupLink = (gi: number, li: number) => {
    const next = [...groups];
    const links = next[gi].links.filter((_, i) => i !== li);
    next[gi] = { ...next[gi], links };
    update('footer_groups', next);
  };

  return (
    <div className="space-y-6">
      {/* Footer CTA */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50">Footer Hero CTA</h3>
          <AdminToggle label="Visible" checked={cta.visible} onChange={(v) => updateCTA('visible', v)} />
        </div>
        <AdminTextarea label="Heading" name="cta_heading" value={cta.heading} onChange={(e) => updateCTA('heading', e.target.value)} rows={2} />
        <AdminTextarea label="Subtext" name="cta_subtext" value={cta.subtext} onChange={(e) => updateCTA('subtext', e.target.value)} rows={3} className="mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AdminInput label="Button Label" name="cta_button_label" value={cta.button_label} onChange={(e) => updateCTA('button_label', e.target.value)} />
          <AdminInput label="Button URL" name="cta_button_url" value={cta.button_url} onChange={(e) => updateCTA('button_url', e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 block mb-1.5">Background Image</label>
          <div className="flex items-center gap-4">
            {settings.footer_hero_image && (
              <img src={settings.footer_hero_image} alt="Footer hero" className="h-16 w-24 object-cover rounded bg-white/[0.04]" />
            )}
            <AdminButton variant="secondary" size="sm" onClick={() => setFooterImagePickerOpen(true)}>
              {settings.footer_hero_image ? 'Change Image' : 'Upload Image'}
            </AdminButton>
            {settings.footer_hero_image && (
              <AdminButton variant="ghost" size="sm" onClick={() => update('footer_hero_image', null)}>Remove</AdminButton>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Footer Link Groups */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50">Footer Link Groups</h3>
          <AdminButton variant="secondary" size="sm" onClick={addGroup}>
            <Plus size={13} /> Add Group
          </AdminButton>
        </div>

        <div className="space-y-4">
          {groups.map((group, gi) => (
            <div key={gi} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded space-y-3">
              <div className="flex items-center gap-3">
                <input
                  value={group.title}
                  onChange={(e) => updateGroup(gi, 'title', e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[0.8rem] text-ivory rounded font-semibold uppercase tracking-wider focus:border-gold/40 focus:outline-none"
                  placeholder="Group Title"
                />
                <button
                  onClick={() => updateGroup(gi, 'visible', !group.visible)}
                  className={`p-1.5 rounded transition-colors ${group.visible ? 'text-gold' : 'text-white/20'}`}
                >
                  {group.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => removeGroup(gi)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-1.5 ml-4">
                {group.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input
                      value={link.label}
                      onChange={(e) => updateGroupLink(gi, li, 'label', e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] px-2 py-1 text-[0.75rem] text-ivory rounded focus:border-gold/40 focus:outline-none"
                      placeholder="Label"
                    />
                    <input
                      value={link.to}
                      onChange={(e) => updateGroupLink(gi, li, 'to', e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] px-2 py-1 text-[0.75rem] text-ivory rounded focus:border-gold/40 focus:outline-none"
                      placeholder="/path"
                    />
                    <button
                      onClick={() => updateGroupLink(gi, li, 'visible', !link.visible)}
                      className={`p-1 transition-colors ${link.visible ? 'text-gold' : 'text-white/20'}`}
                    >
                      {link.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button onClick={() => removeGroupLink(gi, li)} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addGroupLink(gi)}
                  className="flex items-center gap-1 text-[0.7rem] text-gold/60 hover:text-gold transition-colors mt-1"
                >
                  <Plus size={11} /> Add Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Footer Text & Copyright */}
      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Footer Content</h3>
        <AdminTextarea label="Footer Description" name="footer_text" value={settings.footer_text || ''} onChange={(e) => update('footer_text', e.target.value)} rows={3} />
        <AdminInput label="Copyright Text" name="copyright_text" value={settings.copyright_text || ''} onChange={(e) => update('copyright_text', e.target.value)} placeholder="© 2026 Fiesta Events. All Rights Reserved." className="mt-4" />
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SEO TAB
   ═══════════════════════════════════════════════ */
function SEOTab({ settings, update, setOgPickerOpen }: {
  settings: SiteSettings;
  update: (field: keyof SiteSettings, value: unknown) => void;
  ogPickerOpen?: boolean;
  setOgPickerOpen: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Search Engine Optimization</h3>
        <AdminInput label="SEO Title" name="seo_title" value={settings.seo_title || ''} onChange={(e) => update('seo_title', e.target.value)} placeholder="Fiesta Agency — Premium Event Management" />
        <AdminTextarea label="SEO Description" name="seo_description" value={settings.seo_description || ''} onChange={(e) => update('seo_description', e.target.value)} rows={3} className="mt-4" placeholder="Brief description for search engines (150-160 characters recommended)" />
      </AdminCard>

      <AdminCard>
        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white/50 mb-4">Open Graph Image</h3>
        <p className="text-[0.75rem] text-white/30 mb-3">Image shown when your site is shared on social media (1200x630px recommended).</p>
        <div className="flex items-center gap-4">
          {settings.og_image_url && (
            <img src={settings.og_image_url} alt="OG Image" className="h-20 w-36 object-cover rounded bg-white/[0.04]" />
          )}
          <AdminButton variant="secondary" size="sm" onClick={() => setOgPickerOpen(true)}>
            {settings.og_image_url ? 'Change Image' : 'Upload Image'}
          </AdminButton>
          {settings.og_image_url && (
            <AdminButton variant="ghost" size="sm" onClick={() => update('og_image_url', null)}>Remove</AdminButton>
          )}
        </div>
      </AdminCard>
    </div>
  );
}

export default SettingsAdmin;

