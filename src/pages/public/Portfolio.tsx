import { useEffect, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { PortfolioGrid } from '@/components/public/PortfolioGrid';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { PortfolioProject } from '@/lib/types';

export function Portfolio() {
  useDocumentMeta({
    title: 'Portfolio — Fiesta Agency',
    description: 'A collection of moments, spaces and experiences designed by Fiesta.',
  });

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('portfolio_projects').select('*').eq('published', true).order('sort_order');
      setProjects((data || []) as PortfolioProject[]);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">The Work</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              The Work
            </h1>
            <p className="mt-8 text-lg text-ivory-muted max-w-2xl leading-relaxed">
              A collection of moments, spaces and experiences designed by Fiesta.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-obsidian">
        <div className="container-lux">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-96 skeleton" />)}
            </div>
          ) : projects.length === 0 ? (
            <Reveal>
              <div className="text-center py-20">
                <p className="font-serif text-2xl italic text-ivory-muted">The story is about to begin.</p>
                <p className="text-ivory-muted mt-4">Portfolio projects will appear here once they're published.</p>
              </div>
            </Reveal>
          ) : (
            <PortfolioGrid projects={projects} />
          )}
        </div>
      </section>
    </>
  );
}
