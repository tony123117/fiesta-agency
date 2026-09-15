import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { supabase } from '@/lib/supabase';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';
import type { PortfolioProject, Section } from '@/lib/types';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

const CATEGORIES = ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'] as const;

const FALLBACK_GALLERY: PortfolioProject[] = [
  {
    id: 'f1', title: 'The Modern Black-Tie Affair', slug: 'the-modern-black-tie-affair', category: 'Private',
    description: 'A monochrome gala with sculptural florals and a striking quartet.',
    story: null, year: 2024, cover_image: images.blacktie[0], cover_alt: 'Elegant black-tie gala with candlelit tables',
    gallery: [], published: true, sort_order: 0, created_at: '', updated_at: '',
  },
  {
    id: 'f2', title: 'A Night of New Beginnings', slug: 'a-night-of-new-beginnings', category: 'Concert',
    description: 'An unforgettable evening of live music and celebration.',
    story: null, year: 2024, cover_image: images.hero[2], cover_alt: 'Concert with dramatic stage lighting',
    gallery: [], published: true, sort_order: 1, created_at: '', updated_at: '',
  },
  {
    id: 'f3', title: 'An Intimate Celebration', slug: 'an-intimate-celebration', category: 'Private',
    description: 'A private gathering designed with warmth and elegance.',
    story: null, year: 2024, cover_image: images.intimate[0], cover_alt: 'Intimate celebration with warm lighting',
    gallery: [], published: true, sort_order: 2, created_at: '', updated_at: '',
  },
  {
    id: 'f4', title: 'The Lagoon Garden Celebration', slug: 'the-lagoon-garden-celebration', category: 'Wedding',
    description: 'A breathtaking garden wedding surrounded by nature.',
    story: null, year: 2024, cover_image: images.lagoon[0], cover_alt: 'Garden celebration with lush greenery',
    gallery: [], published: true, sort_order: 3, created_at: '', updated_at: '',
  },
  {
    id: 'f5', title: 'Kigali Rooftop Gala', slug: 'kigali-rooftop-gala', category: 'Corporate',
    description: 'A premium rooftop gala with panoramic city views.',
    story: null, year: 2024, cover_image: images.garden[0], cover_alt: 'Rooftop gala with city skyline',
    gallery: [], published: true, sort_order: 4, created_at: '', updated_at: '',
  },
  {
    id: 'f6', title: 'Serena Lakeside Wedding', slug: 'serena-lakeside-wedding', category: 'Wedding',
    description: 'A stunning lakeside ceremony at sunset.',
    story: null, year: 2024, cover_image: images.serena[0], cover_alt: 'Lakeside wedding at golden hour',
    gallery: [], published: true, sort_order: 5, created_at: '', updated_at: '',
  },
  {
    id: 'f7', title: 'Amahoto Stadium Concert', slug: 'amahoto-stadium-concert', category: 'Concert',
    description: 'A large-scale stadium concert with world-class production.',
    story: null, year: 2024, cover_image: images.hero[3], cover_alt: 'Stadium concert with dramatic lighting',
    gallery: [], published: true, sort_order: 6, created_at: '', updated_at: '',
  },
  {
    id: 'f8', title: 'The Garden City Launch', slug: 'the-garden-city-launch', category: 'Corporate',
    description: 'A high-impact product launch with immersive brand experience.',
    story: null, year: 2024, cover_image: images.garden[1], cover_alt: 'Corporate launch event',
    gallery: [], published: true, sort_order: 7, created_at: '', updated_at: '',
  },
];

/* ─── PORTFOLIO PAGE ─── */

export function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useDocumentMeta({
    title: 'Portfolio | Fiesta Agency Rwanda',
    description: 'Explore our portfolio of events, productions and experiences across Rwanda.',
    canonicalPath: '/portfolio',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [projectsRes, pageRes] = await Promise.all([
          supabase.from('portfolio_projects').select('*').eq('published', true).order('sort_order'),
          getPageBySlug('portfolio'),
        ]);
        if (cancelled) return;
        if (projectsRes.data) setProjects(projectsRes.data as PortfolioProject[]);
        if (pageRes) {
          const secs = await getSections(pageRes.id);
          if (!cancelled) setSections(secs.filter((s: Section) => s.published));
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const get = (type: string) => sections.find(s => s.section_type === type)?.content || {};

  const filterContent = get('portfolio-filtered-gallery');
  const featuredContent = get('portfolio-featured');

  const displayProjects = projects.length > 0 ? projects : FALLBACK_GALLERY;
  const published = displayProjects.filter((p) => p.cover_image);

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return published;
    const cat = activeFilter.toLowerCase();
    return published.filter((p) => p.category?.toLowerCase() === cat);
  }, [published, activeFilter]);

  const featured = published[0] || null;
  const gallery = filtered.slice(0, 9);

  return (
    <>
      <P01Hero content={get('portfolio-hero')} />
      <P02Filter active={activeFilter} onChange={setActiveFilter} content={filterContent} />
      <P03Gallery projects={gallery} loading={loading} />
      {featured && <P04Featured project={featured} content={featuredContent} />}
    </>
  );
}

/* ─── 01 — HERO ─── */

function P01Hero({ content }: { content: Record<string, unknown> }) {
  const { ref, visible } = useReveal({ threshold: 0.1 });
  const c = content as { eyebrow?: string; heading?: string; description?: string; image?: string; image_alt?: string };
  const eyebrow = (c?.eyebrow || 'OUR PORTFOLIO');
  const heading = (c?.heading || 'MEMORABLE.\nLASTING\nIMPRESSIONS.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');
  const description = (c?.description || 'A curated collection of our most memorable moments, from intimate celebrations to large-scale productions.');
  const image = c?.image || images.intimate[2];

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: '#090909',
        overflow: 'hidden',
      }}
    >
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
          <div style={{ flex: '0 0 38%' }} className="port-hero-text">
            <Reveal delay={0} visible={visible}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '1.5px', backgroundColor: '#D6A54A' }} />
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  color: '#D6A54A',
                }}>{eyebrow}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08} visible={visible}>
              <h1 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 0.92,
                fontWeight: 400,
                color: '#F8F5EF',
                maxWidth: '520px',
                marginBottom: '24px',
              }}>
                {parts[0]}{' '}
                <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>{parts.slice(1).join(' ')}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.82rem, 0.95vw, 0.94rem)',
                lineHeight: 1.65,
                color: '#C8C2B8',
                maxWidth: '400px',
              }}>
                {description}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} visible={visible}>
            <div style={{ width: '400px', flexShrink: 0, overflow: 'hidden' }} className="port-hero-img">
              <img
                src={image}
                alt={c?.image_alt || "Elegant candlelit event venue with warm atmospheric lighting"}
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

function P02Filter({ active, onChange, content }: { active: string; onChange: (c: string) => void; content: Record<string, unknown> }) {
  const c = content as { categories?: string[] };
  const categories = c?.categories?.length ? c.categories : [...CATEGORIES];
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
        height: '56px',
        overflowX: 'auto',
      }}
        className="port-filter-bar"
      >
        <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 36px)', flexShrink: 0 }}>
          {categories.map((cat) => (
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
                background: 'none',
                border: 'none',
                borderBottom: active === cat ? '1.5px solid #D6A54A' : '1.5px solid transparent',
                paddingBottom: '2px',
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

/* ─── 03 — GALLERY ─── */

function P03Gallery({ projects, loading }: { projects: PortfolioProject[]; loading: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.04 });

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: '#F1EDE3',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            }}>NO PROJECTS FOUND</p>
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

function GalleryItem({ project, index, visible }: {
  project: PortfolioProject;
  index: number;
  visible: boolean;
}) {
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

      <div style={{ paddingTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {project.category && (
            <span style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '0.55rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.18em',
              color: '#D6A54A',
            }}>{project.category}</span>
          )}
          {project.year && (
            <span style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '0.55rem',
              color: '#77736B',
            }}>— {project.year}</span>
          )}
        </div>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
          fontWeight: 400,
          color: '#171717',
          lineHeight: 1.2,
        }}>{project.title}</h3>
      </div>
    </Link>
  );
}

/* ─── 04 — FEATURED PROJECT ─── */

function P04Featured({ project, content }: { project: PortfolioProject; content: Record<string, unknown> }) {
  const { ref, visible } = useReveal({ threshold: 0.08 });
  const c = content as { eyebrow?: string; heading?: string; description?: string; button_text?: string; button_url?: string };
  const eyebrow = (c?.eyebrow || 'FEATURED PROJECT');

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
          className="port-featured-grid"
        >
          <Reveal delay={0} visible={visible}>
            <div style={{ overflow: 'hidden' }}>
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

          <div className="port-featured-text">
            <Reveal delay={0.12} visible={visible}>
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.15em',
                color: '#D6A54A',
                display: 'block',
                marginBottom: '16px',
              }}>{eyebrow}</p>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                lineHeight: 0.95,
                fontWeight: 400,
                color: '#171717',
                marginBottom: '20px',
              }}>{project.title}</h2>
              {project.description && (
                <p style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                  lineHeight: 1.7,
                  color: '#77736B',
                  marginBottom: '32px',
                  maxWidth: '400px',
                }}>{project.description}</p>
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
                View Project
                <ArrowRight size={14} strokeWidth={2} />
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

/* ─── REVEAL HELPER ─── */

function Reveal({ children, delay = 0, visible }: {
  children: React.ReactNode;
  delay?: number;
  visible: boolean;
}) {
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
