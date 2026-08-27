import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Service, EventItem, PortfolioProject, Testimonial, FAQ } from '@/lib/types';

interface HomeData {
  services: Service[];
  events: EventItem[];
  portfolio: PortfolioProject[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
}

export function useHomeData(): HomeData {
  const [data, setData] = useState<Omit<HomeData, 'loading' | 'error'>>({
    services: [], events: [], portfolio: [], testimonials: [], faqs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [servicesRes, eventsRes, portfolioRes, testimonialsRes, faqsRes] = await Promise.all([
        supabase.from('services').select('*').eq('published', true).order('sort_order'),
        supabase.from('events').select('*').eq('published', true).order('sort_order'),
        supabase.from('portfolio_projects').select('*').eq('published', true).order('sort_order'),
        supabase.from('testimonials').select('*').eq('published', true).order('sort_order'),
        supabase.from('faqs').select('*').eq('published', true).order('sort_order'),
      ]);

      if (!active) return;

      if (servicesRes.error || eventsRes.error || portfolioRes.error || testimonialsRes.error || faqsRes.error) {
        setError('Unable to load content. Please try again.');
      }

      setData({
        services: (servicesRes.data || []) as Service[],
        events: (eventsRes.data || []) as EventItem[],
        portfolio: (portfolioRes.data || []) as PortfolioProject[],
        testimonials: (testimonialsRes.data || []) as Testimonial[],
        faqs: (faqsRes.data || []) as FAQ[],
      });
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { ...data, loading, error };
}
