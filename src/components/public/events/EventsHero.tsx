import { images } from '@/lib/images-supabase';

interface EventsHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: string;
}

export function EventsHero({ content }: { content: unknown }) {
  const data = content as EventsHeroContent;
  const heading = (data?.heading || 'EXTRAORDINARY MOMENTS.\nALWAYS.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section style={{ backgroundColor: '#090909', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 45%' }}>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: '#D6A54A', marginBottom: 20 }}>
              {data?.eyebrow || 'OUR EVENTS'}
            </p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 0.92, fontWeight: 400, color: '#F8F5EF', marginBottom: 24, whiteSpace: 'pre-line' }}>
              {parts.length > 1 ? (
                <>{parts[0]} <span style={{ fontStyle: 'italic', color: '#D6A54A' }}>{parts[1]}</span></>
              ) : heading}
            </h1>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', lineHeight: 1.65, color: '#C8C2B8', maxWidth: 390 }}>
              {data?.description || 'From intimate gatherings to large-scale productions, we design and manage events that leave lasting impressions.'}
            </p>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <img
              src={data?.image || images.hero[1]}
              alt={data?.image ? 'Event hero' : 'Elegant event reception'}
              style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
