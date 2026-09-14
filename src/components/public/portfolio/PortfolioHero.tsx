import { images } from '@/lib/images-supabase';

interface PortfolioHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
}

export function PortfolioHero({ content }: { content: unknown }) {
  const data = content as PortfolioHeroContent;
  const heading = (data?.heading || 'MEMORABLE.\nLASTING\nIMPRESSIONS.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section style={{ backgroundColor: '#090909', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 38%' }}>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: '#D6A54A', marginBottom: 20 }}>
              {data?.eyebrow || 'OUR PORTFOLIO'}
            </p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 0.92, fontWeight: 400, color: '#F8F5EF', marginBottom: 24 }}>
              {parts.length >= 2 ? <>{parts[0]} <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>{parts[1]}</span> {parts[2] || ''}</> : heading}
            </h1>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', lineHeight: 1.65, color: '#C8C2B8', maxWidth: 400 }}>
              {data?.description || 'A curated collection of our most memorable moments.'}
            </p>
          </div>
          <div style={{ width: 400, flexShrink: 0, overflow: 'hidden' }}>
            <img src={data?.image || images.intimate[2]} alt="" style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
