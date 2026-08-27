import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CTASection } from '@/components/public/CTASection';
import { supabase } from '@/lib/supabase';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { PortfolioProject } from '@/lib/types';

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: project ? `${project.title} — Fiesta Agency` : 'Portfolio — Fiesta Agency',
    description: project?.description || undefined,
    ogImage: project?.cover_image || undefined,
  });

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!active) return;
      if (!data) { navigate('/portfolio', { replace: true }); return; }

      const proj = data as PortfolioProject;
      setProject(proj);

      const { data: relData } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('published', true)
        .neq('id', proj.id)
        .order('sort_order')
        .limit(3);

      if (active) {
        setRelated((relData || []) as PortfolioProject[]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug, navigate]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-obsidian pt-20">
        <div className="container-lux py-20"><div className="h-[60vh] skeleton" /></div>
      </div>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const storyParas = project.story?.paragraphs || [];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.cover_image || ''} alt={project.cover_alt || project.title} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
        </div>
        <div className="relative container-lux pb-16 md:pb-20">
          <Reveal>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-muted hover:text-gold transition-colors mb-6">
              <ArrowLeft size={14} /> All Work
            </Link>
            <div className="label-gold mb-4">
              {project.category}{project.year ? ` • ${project.year}` : ''}
            </div>
            <h1 className="font-serif text-display md:text-7xl font-light text-ivory max-w-3xl text-balance">
              {project.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      {storyParas.length > 0 && (
        <section className="py-20 md:py-28 bg-obsidian">
          <div className="container-narrow">
            <Reveal>
              <div className="space-y-6 text-ivory-muted leading-relaxed text-lg">
                {storyParas.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="pb-20 md:pb-28 bg-obsidian">
          <div className="container-lux space-y-6">
            {gallery.map((img, i) => (
              <Reveal key={i}>
                <div className={`overflow-hidden ${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3] max-w-3xl mx-auto'}`}>
                  <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-lux" loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 md:py-28 bg-charcoal">
          <div className="container-lux">
            <Reveal>
              <h2 className="font-serif text-3xl font-light text-ivory mb-12">Related Work</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel, i) => (
                <Reveal key={rel.id} delay={i * 100}>
                  <Link to={`/portfolio/${rel.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[4/3] mb-4">
                      <img src={rel.cover_image || ''} alt={rel.cover_alt || rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-lux" loading="lazy" />
                    </div>
                    <div className="label-ivory mb-1">{rel.category}{rel.year ? ` • ${rel.year}` : ''}</div>
                    <h3 className="font-serif text-xl font-light text-ivory group-hover:text-gold transition-colors">{rel.title}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-obsidian text-center">
        <div className="container-narrow">
          <Reveal>
            <Link to="/plan-your-event" className="btn-gold">
              Plan Your Event <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
