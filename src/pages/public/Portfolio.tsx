import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { PortfolioProject } from '@/lib/types';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const CATEGORIES = ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'] as const;

const CTA_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80';

const FALLBACK_GALLERY: PortfolioProject[] = [
  { id: 'f1', title: 'Global Leadership Summit', slug: 'global-leadership-summit', category: 'Corporate', description: 'An international corporate summit bringing together industry leaders.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', cover_alt: 'Corporate summit with dramatic stage lighting', gallery: [], published: true, sort_order: 0, created_at: '', updated_at: '' },
  { id: 'f2', title: 'The Williams Wedding', slug: 'the-williams-wedding', category: 'Wedding', description: 'An intimate garden wedding celebration surrounded by nature.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', cover_alt: 'Elegant outdoor wedding ceremony', gallery: [], published: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'f3', title: 'Kigali Music Festival', slug: 'kigali-music-festival', category: 'Concert', description: 'A three-day music festival celebrating African talent.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', cover_alt: 'Live concert with dramatic stage lighting', gallery: [], published: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'f4', title: 'Gala Night Celebration', slug: 'gala-night-celebration', category: 'Private', description: 'A premium private gala evening with live entertainment.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', cover_alt: 'Elegant candlelit gala dinner', gallery: [], published: true, sort_order: 3, created_at: '', updated_at: '' },
  { id: 'f5', title: 'Cultural Heritage Festival', slug: 'cultural-heritage-festival', category: 'Festival', description: 'A vibrant public festival showcasing Rwandan culture.', story: null, year: 2023, cover_image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', cover_alt: 'Outdoor cultural festival with crowds', gallery: [], published: true, sort_order: 4, created_at: '', updated_at: '' },
  { id: 'f6', title: 'Product Launch Event', slug: 'product-launch-event', category: 'Corporate', description: 'A high-impact product launch with immersive brand experience.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', cover_alt: 'Corporate product launch event', gallery: [], published: true, sort_order: 5, created_at: '', updated_at: '' },
  { id: 'f7', title: 'Rooftop Party Night', slug: 'rooftop-party-night', category: 'Private', description: 'An exclusive rooftop celebration under the city lights.', story: null, year: 2024, cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', cover_alt: 'Night rooftop party with DJ and lights', gallery: [], published: true, sort_order: 6, created_at: '', updated_at: '' },
  { id: 'f8', title: 'Wedding in the Hills', slug: 'wedding-in-the-hills', category: 'Wedding', description: 'A breathtaking hillside wedding overlooking the valley.', story: null, year: 2023, cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', cover_alt: 'Hillside wedding venue at sunset', gallery: [], published: true, sort_order: 7, created_at: '', updated_at: '' },
];

/* ─── PORTFOLIO PAGE ─── */

export function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useDocumentMeta({
    title: 'Portfolio | Fiesta Agency Rwanda',
    description: 'Explore our portfolio of events, productions and experiences across Rwanda.',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (data) setProjects(data as PortfolioProject[]);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const displayProjects = projects.length > 0 ? projects : FALLBACK_GALLERY;
  const published = displayProjects.filter((p) => p.cover_image);

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return published;
    const cat = activeFilter.toLowerCase();
    return published.filter((p) => p.category?.toLowerCase() === cat);
  }, [published, activeFilter]);

  const featured = published[0] || null;
  const gallery = filtered.slice(0, 8);
  const secondaryGallery = published.slice(0, 4);

  return (
    <>
      <P01Hero />
      <P02Filter active={activeFilter} onChange={setActiveFilter} />
      <P03Gallery projects={gallery} loading={loading} />
      {featured && <P04Featured project={featured} />}
      <P05DarkGallery projects={secondaryGallery} />
      <P06CTA />
    </>
  );
}

/* ─── 01 — HERO ─── */

function P01Hero() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ backgroundColor: '#090909', overflow: 'hidden' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '1200px',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(90px, 12vw, 160px)',
        paddingBottom: 'clamp(50px, 6vw, 80px)',
      }}>
        <div style={{ display: 'flex', gap: 'clamp(32px, 4vw, 56px)', alignItems: 'flex-start' }}
          className="port-hero-grid"
        >
          {/* Left: Text — 45% */}
          <div style={{ flex: '0 0 45%' }} className="port-hero-text">
            <Reveal delay={0} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
                color: '#D6A54A',
                marginBottom: '20px',
              }}>OUR PORTFOLIO</p>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5vw, 4.125rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F7F4ED',
                whiteSpace: 'pre-line' as const,
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {"MEMORABLE EVENTS.\nLASTING\nIMPRESSIONS."}
              </h1>
            </Reveal>
            <Reveal delay={0.16} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C7C2B9',
                maxWidth: '400px',
              }}>
                A curated collection of our favorite moments, from intimate celebrations to large-scale productions.
              </p>
            </Reveal>
          </div>

          {/* Right: Image — 55% */}
          <Reveal delay={0.12} visible={visible}>
            <div style={{ flex: 1, overflow: 'hidden' }} className="port-hero-img">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Elegant candlelit event venue with warm atmospheric lighting"
                style={{
                  width: '100%',
                  height: 'clamp(300px, 28vw, 360px)',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.04)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="eager"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .port-hero-grid { flex-direction: column !important; }
          .port-hero-text { flex: none !important; width: 100% !important; }
          .port-hero-img { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 02 — FILTER BAR ─── */

function P02Filter({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <section style={{
      backgroundColor: '#F1EDE3',
      borderBottom: '1px solid rgba(20,20,20,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        overflowX: 'auto',
      }}
        className="port-filter-bar"
      >
        <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 36px)', flexShrink: 0 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.14em',
                color: active === cat ? '#D6A54A' : '#77736B',
                borderBottom: active === cat ? '1.5px solid #D6A54A' : '1.5px solid transparent',
                paddingBottom: '2px',
                background: 'none',
                border: 'none',
                borderBottomWidth: '1.5px',
                borderBottomStyle: 'solid',
                borderBottomColor: active === cat ? '#D6A54A' : 'transparent',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 03 — EDITORIAL GALLERY ─── */

function P03Gallery({ projects, loading }: { projects: PortfolioProject[]; loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.04 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#F1EDE3',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', opacity: 0.5 }}
            className="port-gallery-grid"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '4/5' }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 300,
              color: 'rgba(23,23,23,0.25)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              NO PROJECTS FOUND
            </p>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '0.85rem',
              color: '#77736B',
            }}>Try adjusting your filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(12px, 1.5vw, 20px)',
          }}
            className="port-gallery-grid"
          >
            {projects.map((project, i) => (
              <GalleryItem key={project.id} project={project} index={i} visible={visible} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .port-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .port-gallery-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .port-gallery-grid::-webkit-scrollbar { display: none; }
          .port-gallery-grid > * {
            flex: 0 0 75% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function GalleryItem({ project, index, visible }: { project: PortfolioProject; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const aspect = index % 3 === 1 ? '3/4' : index % 3 === 2 ? '4/3' : '4/5';

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s ${E} ${0.08 + index * 0.06}s, transform 0.8s ${E} ${0.08 + index * 0.06}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View project: ${project.title}`}
    >
      {/* Image */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <img
          src={project.cover_image || ''}
          alt={project.cover_alt || project.title}
          style={{
            width: '100%',
            aspectRatio: aspect,
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: `transform 0.7s ${E}`,
          }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(9,9,9,0.15)' : 'rgba(9,9,9,0)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
        }} />
        <ArrowRight
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            color: '#D6A54A',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity 0.4s ${E}, transform 0.4s ${E}`,
          }}
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div style={{ paddingTop: '14px' }}>
        {project.category && (
          <span style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.55rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.18em',
            color: '#D6A54A',
            display: 'block',
            marginBottom: '4px',
          }}>
            {project.category}{project.year ? ` / ${project.year}` : ''}
          </span>
        )}
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
          fontWeight: 400,
          color: '#171717',
          lineHeight: 1.2,
          marginBottom: '4px',
        }}>{project.title}</h3>
        <span style={{
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '0.62rem',
          color: '#77736B',
          letterSpacing: '0.05em',
        }}>
          {project.year || ''}
        </span>
      </div>
    </Link>
  );
}

/* ─── 04 — FEATURED PROJECT ─── */

function P04Featured({ project }: { project: PortfolioProject }) {
  const { ref, visible } = useReveal({ threshold: 0.08 });

  return (
    <section ref={ref} style={{
      backgroundColor: '#FFFFFF',
      paddingTop: 'clamp(80px, 10vw, 140px)',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="port-featured-grid"
        >
          {/* Left: Image — 55% */}
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }} className="port-featured-img">
              <img
                src={project.cover_image || ''}
                alt={project.cover_alt || project.title}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  objectFit: 'cover',
                  display: 'block',
                  transform: visible ? 'scale(1)' : 'scale(1.03)',
                  transition: `transform 1.2s ${E}`,
                }}
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Right: Text — 40% */}
          <div className="port-featured-text">
            <Reveal delay={0.12} visible={visible}>
              {project.category && (
                <span style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.15em',
                  color: '#D6A54A',
                  display: 'block',
                  marginBottom: '16px',
                }}>
                  {project.category}{project.year ? ` / ${project.year}` : ''}
                </span>
              )}
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#171717',
                whiteSpace: 'pre-line' as const,
                marginBottom: '20px',
              }}>
                {project.title}
              </h2>
              {project.description && (
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                  lineHeight: 1.7,
                  color: '#77736B',
                  marginBottom: '32px',
                  maxWidth: '400px',
                }}>
                  {project.description}
                </p>
              )}
              <Link
                to={`/portfolio/${project.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  color: '#D6A54A',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B8862D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
              >
                VIEW PROJECT
                <ArrowRight size={14} strokeWidth={2} style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .port-featured-grid { grid-template-columns: 55% 1fr !important; gap: 48px !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── 05 — SECONDARY DARK GALLERY ─── */

function P05DarkGallery({ projects }: { projects: PortfolioProject[] }) {
  const { ref, visible } = useReveal({ threshold: 0.06 });

  if (projects.length === 0) return null;

  return (
    <section ref={ref} style={{
      backgroundColor: '#090909',
      paddingTop: 'clamp(80px, 10vw, 140px)',
      paddingBottom: 'clamp(80px, 10vw, 140px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <Reveal delay={0} visible={visible}>
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <p style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
              color: '#D6A54A',
              marginBottom: '20px',
            }}>MORE WORK</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 0.95,
              fontWeight: 400,
              color: '#F7F4ED',
            }}>BEHIND THE SCENES.</h2>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(8px, 1vw, 16px)',
        }}
          className="port-dark-grid"
        >
          {projects.map((project, i) => (
            <DarkGalleryItem key={project.id} project={project} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .port-dark-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .port-dark-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding-bottom: 16px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .port-dark-grid::-webkit-scrollbar { display: none; }
          .port-dark-grid > * {
            flex: 0 0 70% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

function DarkGalleryItem({ project, index, visible }: { project: PortfolioProject; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ${E} ${0.1 + index * 0.08}s, transform 0.8s ${E} ${0.1 + index * 0.08}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View project: ${project.title}`}
    >
      <img
        src={project.cover_image || ''}
        alt={project.cover_alt || project.title}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: `transform 0.7s ${E}`,
        }}
        loading="lazy"
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(9,9,9,0) 0%, rgba(9,9,9,0.3) 100%)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        pointerEvents: 'none',
      }}>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
          fontWeight: 400,
          color: '#F7F4ED',
          lineHeight: 1.2,
          opacity: hovered ? 1 : 0.85,
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: `opacity 0.4s ${E}, transform 0.4s ${E}`,
        }}>{project.title}</h3>
      </div>
    </Link>
  );
}

/* ─── 06 — CINEMATIC CTA ─── */

function P06CTA() {
  const { ref, visible } = useReveal({ threshold: 0.1 });

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={CTA_IMAGE}
          alt="Elegant outdoor celebration with warm atmospheric lighting"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        paddingLeft: 'clamp(24px, 4vw, 40px)',
        paddingRight: 'clamp(24px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s ${E} 0.1s, transform 0.9s ${E} 0.1s`,
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F7F4ED',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>
          {"LET'S CREATE\nSOMETHING\nEXTRAORDINARY."}
        </h2>

        <Link
          to="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '32px',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.14em',
            color: '#D6A54A',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#B8862D'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
        >
          GET IN TOUCH
          <ArrowRight size={16} strokeWidth={2} style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </Link>
      </div>
    </section>
  );
}

/* ─── REVEAL HELPER ─── */

function Reveal({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.8s ${E} ${delay}s, transform 0.8s ${E} ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default Portfolio;
