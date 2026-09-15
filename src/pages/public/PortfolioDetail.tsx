import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { PortfolioProject } from '@/lib/types';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref: heroRef, visible: heroVisible } = useReveal({ threshold: 0.1 });
  const { ref: storyRef, visible: storyVisible } = useReveal({ threshold: 0.1 });
  const { ref: galleryRef, visible: galleryVisible } = useReveal({ threshold: 0.1 });
  const { ref: relatedRef, visible: relatedVisible } = useReveal({ threshold: 0.1 });

  useDocumentMeta({
    title: project ? `${project.title} | Fiesta Agency` : 'Portfolio | Fiesta Agency',
    description: project?.description || undefined,
    ogImage: project?.cover_image || undefined,
    canonicalPath: slug ? `/portfolio/${slug}` : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error: supabaseError } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();

        if (!active) return;
        if (supabaseError) throw supabaseError;
        if (!data) { setError('Project not found'); return; }

        const proj = data as PortfolioProject;
        setProject(proj);

        const { data: relData } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .neq('id', proj.id)
          .order('sort_order')
          .limit(5);

        if (active) setRelated((relData || []) as PortfolioProject[]);
      } catch {
        if (active) setError('Unable to load project.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <section className="section-dark min-h-[60vh] flex items-center justify-center">
        <div className="skeleton" style={{ width: '200px', height: '4px' }} />
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="section-dark min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
        <h1 className="display-lg text-ivory mb-4">NOT FOUND</h1>
        <p className="body-editorial-light mb-8">This project doesn't exist or has been removed.</p>
        <Link to="/portfolio" className="btn-primary group">
          VIEW ALL <ArrowRight className="btn-arrow" size={16} />
        </Link>
      </section>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const storyParas = project.story?.paragraphs || [];

  return (
    <>
      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden grain section-dark">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" style={{ minHeight: 'clamp(480px, 65vh, 650px)' }}>
            {/* Left text */}
            <div className="lg:col-span-5 py-12 lg:py-0">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-[0.12em] text-ivory/50 hover:text-gold transition-colors duration-500 mb-8"
                style={{ fontSize: '0.6rem', opacity: heroVisible ? 1 : 0, transition: `opacity 0.8s ${EASE}` }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} /> ALL WORK
              </Link>

              <span
                className="label-gold block mb-4"
                style={{ opacity: heroVisible ? 1 : 0, transition: `opacity 0.8s ${EASE} 0.1s` }}
              >
                {project.category}{project.year ? ` / ${project.year}` : ''}
              </span>

              <h1
                className="font-serif font-light text-ivory leading-[0.9] tracking-tight mb-5"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 1s ${EASE} 0.15s, transform 1s ${EASE} 0.15s`,
                }}
              >
                {project.title.split(' ').map((word, i) => {
                  const isLast = i === project.title.split(' ').length - 1;
                  return isLast ? (
                    <span key={i} className="italic text-gold">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  );
                })}
              </h1>

              {project.description && (
                <p
                  className="body-editorial-light max-w-sm"
                  style={{ opacity: heroVisible ? 1 : 0, transition: `opacity 0.9s ${EASE} 0.3s` }}
                >
                  {project.description}
                </p>
              )}
            </div>

            {/* Right image */}
            <div
              className="lg:col-span-7"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateX(0)' : 'translateX(30px)',
                transition: `opacity 1.2s ${EASE} 0.2s, transform 1.2s ${EASE} 0.2s`,
              }}
            >
              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '4/3' }}>
                <img
                  src={project.cover_image || undefined}
                  alt={project.cover_alt || project.title}
                  className="w-full h-full object-cover img-editorial"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STORY — text left, image right
          ═══════════════════════════════════════ */}
      {storyParas.length > 0 && (
        <section ref={storyRef} className="relative overflow-hidden section-pad" style={{ backgroundColor: '#F8F5EF' }}>
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left text */}
              <div className="lg:col-span-5">
                <span
                  className="eyebrow block mb-4"
                  style={{ color: '#B8943F', opacity: storyVisible ? 1 : 0, transition: `opacity 0.8s ${EASE} 0.1s` }}
                >
                  THE STORY
                </span>
                <div
                  className="rule-gold-lg mb-6"
                  style={{ opacity: storyVisible ? 1 : 0, transition: `opacity 0.8s ${EASE} 0.15s` }}
                />

                <div style={{ opacity: storyVisible ? 1 : 0, transition: `opacity 0.9s ${EASE} 0.2s` }}>
                  {storyParas.map((para, i) => (
                    <p key={i} className="font-sans leading-[1.8] mb-4" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', color: '#3D3A35' }}>
                      {para}
                    </p>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 mt-6 font-sans font-semibold uppercase tracking-[0.12em] px-7 py-3 rounded-sm transition-all duration-500"
                  style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#B8943F',
                    color: '#fff',
                    opacity: storyVisible ? 1 : 0,
                    transition: `opacity 0.8s ${EASE} 0.35s`,
                  }}
                >
                  Get a Custom Design <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>

              {/* Right image */}
              <div
                className="lg:col-span-7"
                style={{
                  opacity: storyVisible ? 1 : 0,
                  transform: storyVisible ? 'translateX(0)' : 'translateX(20px)',
                  transition: `opacity 1s ${EASE} 0.15s, transform 1s ${EASE} 0.15s`,
                }}
              >
                {gallery.length > 0 ? (
                  <div>
                    <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={gallery[0]}
                        alt={`${project.title} design`}
                        className="w-full h-full object-cover img-editorial"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-right mt-3 font-sans italic" style={{ fontSize: '0.7rem', color: '#9A958D' }}>
                      Elegant designs for extraordinary moments.
                    </p>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '4/3' }}>
                    <img src={project.cover_image || ''} alt={project.title} className="w-full h-full object-cover img-editorial" loading="lazy" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          GALLERY — cards on dark
          ═══════════════════════════════════════ */}
      {gallery.length > 0 && (
        <section ref={galleryRef} className="relative overflow-hidden section-dark grain section-pad">
          <div className="container-site">
            {/* Header */}
            <div
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
              style={{ opacity: galleryVisible ? 1 : 0, transition: `opacity 0.8s ${EASE} 0.1s` }}
            >
              <div>
                <span className="label-gold block mb-3">OUR PORTFOLIO</span>
                <h2 className="font-serif font-light text-ivory" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>MORE MOMENTS</h2>
              </div>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-[0.12em] text-ivory/60 hover:text-gold transition-colors mt-4 md:mt-0"
                style={{ fontSize: '0.6rem' }}
              >
                View All Events <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-sm"
                  style={{
                    aspectRatio: '16/10',
                    opacity: galleryVisible ? 1 : 0,
                    transform: galleryVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.8s ${EASE} ${0.1 + i * 0.08}s, transform 0.8s ${EASE} ${0.1 + i * 0.08}s`,
                  }}
                >
                  <img
                    src={img}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full h-full object-cover img-editorial"
                    style={{ transition: `transform 0.7s ${EASE}` }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(15,14,13,0.8) 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="font-sans uppercase tracking-[0.18em] text-gold block mb-1" style={{ fontSize: '0.5rem' }}>
                      {project.category}
                    </span>
                    <h3 className="font-serif font-light text-ivory tracking-tight mb-2" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)' }}>
                      {project.title} {i + 1}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 font-sans font-semibold uppercase tracking-[0.12em] text-ivory/70 group-hover:text-gold transition-colors" style={{ fontSize: '0.5rem' }}>
                      VIEW PROJECT <ArrowRight size={10} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          RELATED
          ═══════════════════════════════════════ */}
      {related.length > 0 && (
        <section ref={relatedRef} className="relative overflow-hidden section-pad" style={{ backgroundColor: '#fff' }}>
          <div className="container-site">
            <div
              className="mb-10"
              style={{ opacity: relatedVisible ? 1 : 0, transition: `opacity 0.8s ${EASE} 0.1s` }}
            >
              <span className="eyebrow block mb-4" style={{ color: '#B8943F' }}>MORE WORK</span>
              <div className="rule-gold" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {related.map((rel, i) => (
                <Link
                  key={rel.id}
                  to={`/portfolio/${rel.slug}`}
                  className="group block"
                  style={{
                    opacity: relatedVisible ? 1 : 0,
                    transform: relatedVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.8s ${EASE} ${0.1 + i * 0.08}s, transform 0.8s ${EASE} ${0.1 + i * 0.08}s`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-sm mb-2" style={{ aspectRatio: '3/4', backgroundColor: '#F1EDE3' }}>
                    <img
                      src={rel.cover_image || ''}
                      alt={rel.title}
                      className="w-full h-full object-cover img-editorial"
                      style={{ transition: `transform 0.7s ${EASE}` }}
                      loading="lazy"
                    />
                  </div>
                  <span className="font-sans uppercase tracking-[0.14em] block mb-0.5" style={{ fontSize: '0.45rem', color: '#B8943F' }}>
                    {rel.category}
                  </span>
                  <h3 className="font-serif font-light tracking-tight leading-[1.15] truncate" style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.9rem)', color: '#161616' }}>
                    {rel.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
export default PortfolioDetail;
