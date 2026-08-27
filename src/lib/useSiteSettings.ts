import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (active) {
        setSettings(data as SiteSettings | null);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { settings, loading };
}
