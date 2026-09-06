import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';

// Module-level cache — survives component unmount/remount across navigations
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
let inflightPromise: Promise<SiteSettings | null> | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchSettings(): Promise<SiteSettings | null> {
  // Return cache if fresh
  if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedSettings;
  }

  // Deduplicate concurrent requests
  if (inflightPromise) return inflightPromise;

  inflightPromise = (async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      const result = (data as SiteSettings | null) ?? null;
      cachedSettings = result;
      cacheTimestamp = Date.now();
      return result;
    } finally {
      inflightPromise = null;
    }
  })();

  return inflightPromise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    // Initialize from cache if available (instant render on navigation)
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedSettings;
    }
    return null;
  });
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await fetchSettings();
      if (active) {
        setSettings(result);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { settings, loading };
}
