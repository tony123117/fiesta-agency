import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { supabase } from '@/lib/supabase';
import type { PortfolioFeaturedContent, PortfolioProject } from '@/lib/types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function PortfolioFeatured({ content }: { content: unknown }) {
  const data = content as PortfolioFeaturedContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });
  const [project, setProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: result } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('sort_order')
          .limit(1)
          .single();
        if (!cancelled && result) setProject(result as PortfolioProject);
      } catch { /* silent */ }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!project) return null;

  const eyebrow = data?.eyebrow || 'FEATURED PROJECT';
  const heading = data?.heading || project.title;
  const description = data?.description || project.description || '';
  const buttonText = data?.button_text || 'View Project';
  const buttonUrl = data?.button_url || `/portfolio/${project.slug}`;

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
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
          }}>
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
                  transition: `transform 1.2s ${EASE}`,
                }}
                loading="lazy"
              />
            </div>
          </div>

          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.9s ${EASE} 0.12s, transform 0.9s ${EASE} 0.12s`,
          }}>
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
            }}>{heading}</h2>
            {description && (
              <p style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
                lineHeight: 1.7,
                color: '#77736B',
                marginBottom: '32px',
                maxWidth: '400px',
              }}>{description}</p>
            )}
            <Link
              to={buttonUrl}
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
              {buttonText}
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
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

export default PortfolioFeatured;
