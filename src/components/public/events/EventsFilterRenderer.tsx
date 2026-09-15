import type { EventsFilterContent } from '@/lib/types';

interface EventsFilterRendererProps {
  content: unknown;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function EventsFilterRenderer({ content, activeCategory, onCategoryChange }: EventsFilterRendererProps) {
  const data = content as EventsFilterContent;
  const categories = data?.categories?.length ? data.categories : ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'];

  return (
    <section style={{
      backgroundColor: '#F8F5EF',
      paddingTop: 'clamp(40px, 5vw, 60px)',
      paddingBottom: 'clamp(40px, 5vw, 60px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 40px)',
        paddingRight: 'clamp(24px, 5vw, 40px)',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              style={{
                padding: '8px 16px',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                border: activeCategory === cat ? '1px solid #090909' : '1px solid rgba(20,20,20,0.12)',
                backgroundColor: activeCategory === cat ? '#090909' : 'transparent',
                color: activeCategory === cat ? '#F8F5EF' : '#6F6B63',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Manrope', system-ui, sans-serif",
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
