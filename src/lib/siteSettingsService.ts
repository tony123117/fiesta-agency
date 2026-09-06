import { supabase } from '@/lib/supabase';
import type { SiteSettings, NavItem, FooterGroup, FooterCTA } from '@/lib/types';

const DEFAULT_NAVIGATION: NavItem[] = [
  { label: 'Home', to: '/', visible: true, order: 0 },
  { label: 'About', to: '/about', visible: true, order: 1 },
  { label: 'Services', to: '/services', visible: true, order: 2 },
  { label: 'Portfolio', to: '/portfolio', visible: true, order: 3 },
  { label: 'Events', to: '/events', visible: true, order: 4 },
  { label: 'How We Work', to: '/how-we-work', visible: true, order: 5 },
  { label: 'Contact', to: '/contact', visible: true, order: 6 },
];

const DEFAULT_FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'PAGES',
    visible: true,
    order: 0,
    links: [
      { label: 'Home', to: '/', visible: true },
      { label: 'About Us', to: '/about', visible: true },
      { label: 'Services', to: '/services', visible: true },
      { label: 'Portfolio', to: '/portfolio', visible: true },
      { label: 'Events', to: '/events', visible: true },
      { label: 'How We Work', to: '/how-we-work', visible: true },
      { label: 'Contact', to: '/contact', visible: true },
    ],
  },
  {
    title: 'OUR SERVICES',
    visible: true,
    order: 1,
    links: [
      { label: 'Weddings & Celebrations', to: '/services', visible: true },
      { label: 'Corporate Events', to: '/services', visible: true },
      { label: 'Private Events', to: '/services', visible: true },
      { label: 'Concerts & Live Shows', to: '/services', visible: true },
      { label: 'Event Production', to: '/services', visible: true },
      { label: 'Décor & Design', to: '/services', visible: true },
    ],
  },
];

const DEFAULT_FOOTER_CTA: FooterCTA = {
  heading: "LET'S CREATE SOMETHING EXTRAORDINARY TOGETHER.",
  subtext: 'From intimate celebrations to large-scale productions, we bring creative direction, planning and execution together under one roof.',
  button_label: 'PLAN YOUR EVENT',
  button_url: '/contact',
  visible: true,
};

export function getDefaultNavigation(): NavItem[] {
  return DEFAULT_NAVIGATION;
}

export function getDefaultFooterGroups(): FooterGroup[] {
  return DEFAULT_FOOTER_GROUPS;
}

export function getDefaultFooterCTA(): FooterCTA {
  return DEFAULT_FOOTER_CTA;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as SiteSettings;
}

export async function updateSiteSettings(
  updates: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...updates }, { onConflict: 'id' });

  if (error) return { error: error.message };
  return { error: null };
}

export function getVisibleNavigation(settings: SiteSettings | null): NavItem[] {
  if (!settings?.navigation?.length) return DEFAULT_NAVIGATION;
  return settings.navigation
    .filter((n) => n.visible)
    .sort((a, b) => a.order - b.order);
}

export function getVisibleFooterGroups(settings: SiteSettings | null): FooterGroup[] {
  if (!settings?.footer_groups?.length) return DEFAULT_FOOTER_GROUPS;
  return settings.footer_groups
    .filter((g) => g.visible)
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      ...group,
      links: group.links.filter((l) => l.visible),
    }));
}

export function getFooterCTA(settings: SiteSettings | null): FooterCTA {
  if (!settings?.footer_cta) return DEFAULT_FOOTER_CTA;
  return settings.footer_cta;
}
