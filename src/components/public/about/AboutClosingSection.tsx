import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ClosingContent {
  heading?: string;
  cta_text?: string;
  cta_url?: string;
  background_image?: string;
  background_image_alt?: string;
}

export function AboutClosingSection({ content }: { content: Record<string, unknown> }) {
  const c = content as ClosingContent;
  const { ref, visible } = useReveal({ threshold: 0.1 });

  const heading = (c.heading || 'READY TO CREATE\nSOMETHING EXTRAORDINARY?').replace(/\\n/g, '\n');
  const ctaText = c.cta_text || 'GET IN TOUCH';
  const ctaUrl = c.cta_url || '/contact';
  const bgImage = c.background_image || images.hero[5];
  const bgAlt = c.background_image_alt || 'Elegant outdoor celebration with warm atmospheric lighting';

  return (
    <section ref={ref} style={{
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(300px, 40vh, 400px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={bgImage}
          alt={bgAlt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.65) 100%)',
      }} />
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center' as const,
        paddingLeft: 'clamp(24px, 4vw, 40px)', paddingRight: 'clamp(24px, 4vw, 40px)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s ${E} 0.1s, transform 0.9s ${E} 0.1s`,
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          lineHeight: 0.95,
          fontWeight: 400,
          color: '#F8F5EF',
          whiteSpace: 'pre-line' as const,
          maxWidth: '16ch',
        }}>{heading}</h2>
        <Link
          to={ctaUrl}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '32px',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '0.7rem', fontWeight: 600,
            textTransform: 'uppercase' as const, letterSpacing: '0.14em',
            color: '#D6A54A', textDecoration: 'none', transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#B8862D'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#D6A54A'; }}
        >
          {ctaText}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
