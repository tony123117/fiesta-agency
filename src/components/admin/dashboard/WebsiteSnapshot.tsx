import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SnapshotItem {
  label: string;
  count: number | null;
  to: string;
}

export function WebsiteSnapshot() {
  const [items, setItems] = useState<SnapshotItem[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [servicesRes, portfolioRes, eventsRes, testimonialsRes, faqsRes, mediaRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('faqs').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('media').select('id', { count: 'exact', head: true }),
      ]);

      if (!active) return;

      setItems([
        { label: 'Services', count: servicesRes.count, to: '/admin/services' },
        { label: 'Portfolio', count: portfolioRes.count, to: '/admin/portfolio' },
        { label: 'Events', count: eventsRes.count, to: '/admin/events' },
        { label: 'Testimonials', count: testimonialsRes.count, to: '/admin/testimonials' },
        { label: 'FAQs', count: faqsRes.count, to: '/admin/faqs' },
        { label: 'Media Files', count: mediaRes.count, to: '/admin/media' },
      ]);
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-1.5">
            WEBSITE
          </p>
          <h2 className="font-serif font-light text-ivory tracking-tight text-lg">
            Your website at a glance
          </h2>
        </div>
      </div>

      {items ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white/[0.04]">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group bg-obsidian p-4 md:p-5 text-center transition-colors duration-200 hover:bg-white/[0.015]"
            >
              <p className="font-serif font-light text-ivory text-xl leading-none mb-2 group-hover:text-gold transition-colors duration-200">
                {item.count !== null ? String(item.count).padStart(2, '0') : '--'}
              </p>
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/25">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white/[0.04]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-obsidian p-4 md:p-5">
              <div className="h-5 w-8 bg-white/[0.04] rounded mx-auto mb-2 animate-pulse" />
              <div className="h-2 w-12 bg-white/[0.04] rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Link
          to="/admin/home"
          className="group inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/20 hover:text-gold/60 transition-colors"
        >
          Manage Content <ArrowRight size={10} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
