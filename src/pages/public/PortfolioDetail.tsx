import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { PortfolioProject } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref: heroRef, visible: heroVisible } = useReveal({ threshold: 0.1 });
  const { ref: storyRef, visible: storyVisible } = useReveal({ threshold: 0.15 });
  const { ref: galleryRef, visible: galleryVisible } = useReveal({ threshold: 0.15 });
  const { ref: relatedRef, visible: relatedVisible } = useReveal({ threshold: 0.15 });
  const { ref: ctaRef, visible: ctaVisible } = useReveal({ threshold: 0.15 });

  useDocumentMeta({
    title: project ? `${project.title} | Fiesta Agency` : 'Portfolio | Fiesta Agency',
    description: project?.description || undefined,
    ogImage: project?.cover_image || undefined,
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
        if (!data) {
          setError('Project not found');
          return;
        }

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
        }
      } catch {
        if (active) setError('Unable to load project. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#090909' }}>
        <div className="skeleton" style={{ width: '200px', height: '4px', borderRadius: '2px' }} />
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-5" style={{ backgroundColor: '#090909' }}>
        <h1 className="font-serif font-light text-ivory tracking-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          PROJECT NOT FOUND
        </h1>
        <p className="font-sans text-stone-muted mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/portfolio" className="btn-primary group">
          VIEW ALL PROJECTS
          <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const storyParas = project.story?.paragraphs || [];

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — Cover image with back link
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ height: 'clamp(55vh, 70vh, 650px)', minHeight: '450px' }}
      >
        <div className="absolute inset-0">
          <img
            src={project.cover_image || undefined}
            alt={project.cover_alt || project.title}
            className="w-full h-full object-cover"
            style={{
              transform: heroVisible ? 'scale(1)' : 'scale(1.05)',
              transition: `transform 1.2s ${EASE}`,
            }}
            loading="eager"
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(9,9,9,0.4) 0%, rgba(9,9,9,0.15) 35%, rgba(9,9,9,0.25) 65%, rgba(9,9,9,0.85) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(9,9,9,0.55) 0%, transparent 45%, transparent 55%, rgba(9,9,9,0.45) 100%)',
          }}
        />

        <div className="relative h-full mx-auto max-w-[1440px] px-5 md:px-[4vw] lg:px-[5vw]">
          <div className="h-full flex flex-col justify-end pb-[80px] md:pb-[100px] lg:pb-[120px]">
            <div className="max-w-[800px]">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-[0.12em] text-ivory/70 hover:text-gold transition-colors duration-300 mb-6 md:mb-8"
                style={{
                  fontSize: '0.6rem',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
                }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
                ALL WORK
              </Link>

              <span
                className="label-gold block mb-4 md:mb-5"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
                }}
              >
                {project.category}{project.year ? ` / ${project.year}` : ''}
              </span>

              <h1
                className="font-serif font-light text-ivory leading-[0.9] tracking-tight text-balance"
                style={{
                  fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.9s ${EASE} 0.2s, transform 0.9s ${EASE} 0.2s`,
                }}
              >
                {project.title}
              </h1>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: `opacity 0.8s ${EASE} 0.5s`,
          }}
          aria-hidden="true"
        >
          <span className="label-muted text-[0.55rem]">SCROLL</span>
          <div className="w-[1px] h-8 bg-white/15 relative overflow-hidden">
            <span className="absolute left-0 top-0 w-full bg-gold" style={{ height: '40%', animation: 'pulseSlow 3s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STORY
          ═══════════════════════════════════════════ */}
      {storyParas.length > 0 && (
        <section
          ref={storyRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#151515', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div className="max-w-3xl">
              <div
                style={{
                  opacity: storyVisible ? 1 : 0,
                  transform: storyVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
                }}
              >
                <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                  THE STORY
                </p>
                <div className="w-16 h-[2px] bg-gold mb-8" />
                <div className="font-sans text-ivory leading-[1.85]" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
                  {storyParas.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          GALLERY
          ═══════════════════════════════════════════ */}
      {gallery.length > 0 && (
        <section
          ref={galleryRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#090909', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div
              className="mb-10 md:mb-14"
              style={{
                opacity: galleryVisible ? 1 : 0,
                transform: galleryVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
              }}
            >
              <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                GALLERY
              </p>
              <h2 className="font-serif font-light tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#F5F2EA', lineHeight: '1.1' }}>
                MORE MOMENTS
              </h2>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
              style={{
                opacity: galleryVisible ? 1 : 0,
                transform: galleryVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
              }}
            >
              {gallery.map((img, i) => (
                <div key={i} className="group relative overflow-hidden" style={{ aspectRatio: '4/3', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <img
                    src={img}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: 'scale(1)',
                      transition: `transform 0.7s ${EASE}`,
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100" style={{ background: 'rgba(21,21,21,0.5)', transition: 'opacity 0.4s ease' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          RELATED WORK
          ═══════════════════════════════════════════ */}
      {related.length > 0 && (
        <section
          ref={relatedRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: '#151515', padding: 'clamp(80px, 10vw, 140px) 0' }}
        >
          <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1440px]">
            <div
              className="mb-10 md:mb-14"
              style={{
                opacity: relatedVisible ? 1 : 0,
                transform: relatedVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
              }}
            >
              <p className="font-sans font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '0.7rem', color: '#D6A64F' }}>
                RELATED WORK
              </p>
              <h2 className="font-serif font-light tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#F5F2EA', lineHeight: '1.1' }}>
                SIMILAR PROJECTS
              </h2>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              style={{
                opacity: relatedVisible ? 1 : 0,
                transform: relatedVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
              }}
            >
              {related.map((rel, i) => (
                <Link key={rel.id} to={`/portfolio/${rel.slug}`} className="group block">
                  <div className="relative overflow-hidden" style={{ borderRadius: '6px', aspectRatio: '4/5', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,242,234,0.06)', transition: `border-color 0.4s ${EASE}, transform 0.4s ${EASE}, box-shadow 0.4s ${EASE}` }}>
                    <img
                      src={rel.cover_image || undefined}
                      alt={rel.cover_alt || rel.title}
                      className="w-full h-full object-cover"
                      style={{
                        transform: 'scale(1)',
                        transition: `transform 0.7s ${EASE}`,
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(21,21,21,0) 50%, rgba(21,21,21,0.65) 100%)' }} />
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ padding: '20px 18px 16px' }}>
                      <span className="font-sans uppercase tracking-[0.18em] text-gold block mb-1" style={{ fontSize: '0.55rem' }}>
                        {rel.category}{rel.year ? ` / ${rel.year}` : ''}
                      </span>
                      <h3 className="font-serif font-light text-ivory tracking-tight" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', lineHeight: '1.2' }}>
                        {rel.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden"
        style={{ height: 'clamp(400px, 55vh, 500px)' }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80"
            alt="Elegant celebration with dramatic lighting"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(21,21,21,0.45) 0%, rgba(21,21,21,0.6) 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5 md:px-[4vw] lg:px-[5vw]">
          <p className="font-sans font-semibold uppercase tracking-[0.22em] mb-5 md:mb-6" style={{ fontSize: '0.7rem', color: '#D6A64F', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s` }}>
            WANT SOMETHING LIKE THIS?
          </p>
          <div className="mb-6 md:mb-8" style={{ width: '32px', height: '2px', backgroundColor: '#D6A64F', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'scaleX(1)' : 'scaleX(0)', transition: `opacity 0.7s ${EASE} 0.2s, transform 0.7s ${EASE} 0.2s` }} />
          <h2 className="font-serif font-light tracking-tight leading-[0.9] max-w-2xl" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EA', opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.9s ${EASE} 0.2s, transform 0.9s ${EASE} 0.2s` }}>
            LET'S CREATE
            <br />
            <span className="text-gradient-gold">YOUR EXPERIENCE</span>
          </h2>
          <Link to="/contact" className="btn-primary group mt-8 md:mt-10" style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.8s ${EASE} 0.3s, transform 0.8s ${EASE} 0.3s` }}>
            START PLANNING
            <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
export default PortfolioDetail;

