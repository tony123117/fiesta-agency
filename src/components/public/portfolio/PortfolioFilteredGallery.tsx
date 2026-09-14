import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import type { PortfolioFilteredGalleryContent, PortfolioProject } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const DEFAULT_CATEGORIES = ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'];

export function PortfolioFilteredGallery({ content }: { content: unknown }) {
  const data = content as PortfolioFilteredGalleryContent;
  const { ref: sectionRef, visible: sectionVisible } = useReveal({ threshold: 0.04 });
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = data?.categories?.length ? data.categories : DEFAULT_CATEGORIES;
  const maxProjects = data?.max_projects || 9;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: result } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (!cancelled && result) setProjects(result as PortfolioProject[]);
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const published = useMemo(() => projects.filter((p) => p.cover_image), [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return published;
    const cat = activeFilter.toLowerCase();
    return published.filter((p) => p.category?.toLowerCase() === cat);
  }, [published, activeFilter]);

  const gallery = filtered.slice(0, maxProjects);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#F1EDE3',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      {/* Filter Bar */}
      <div style={{
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
                onClick={() => setActiveFilter(cat)}
                style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.14em',
                  color: activeFilter === cat ? '#D6A54A' : '#77736B',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeFilter === cat ? '1.5px solid #D6A54A' : '1.5px solid transparent',
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
      </div>

      {/* Gallery Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
        paddingTop: 'clamp(40px, 5vw, 60px)',
      }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', opacity: 0.5 }}
            className="port-gallery-grid"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '4/5' }} />
            ))}
          </div>
        ) : gallery.length === 0 ? (
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
            {gallery.map((project, i) => (
              <GalleryItem key={project.id} project={project} index={i} visible={sectionVisible} />
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
        transition: `opacity 0.8s ${EASE} ${0.08 + index * 0.06}s, transform 0.8s ${EASE} ${0.08 + index * 0.06}s`,
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
            transition: `transform 0.7s ${EASE}`,
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
            transition: `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`,
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

export default PortfolioFilteredGallery;
