import { ArrowRight } from 'lucide-react';

interface EventsCTAContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
}

export function EventsCTA({ content }: { content: unknown }) {
  const data = content as EventsCTAContent;
  const heading = (data?.heading || 'YOUR EVENT DESERVES\nITS OWN STORY.').replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <section style={{ backgroundColor: '#F1EDE3' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: '#D6A54A', marginBottom: 20 }}>
          {data?.eyebrow || "LET'S CREATE TOGETHER"}
        </p>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 0.95, fontWeight: 400, color: '#161616', marginBottom: 16 }}>
          {parts.length > 1 ? (
            <>{parts[0]} <span style={{ fontStyle: 'italic' }}>{parts[1]}</span></>
          ) : heading}
        </h2>
        <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.88rem', lineHeight: 1.7, color: '#6F6B63', maxWidth: 480, margin: '0 auto 32px' }}>
          {data?.description || 'Let us help you design and execute an event that reflects your vision.'}
        </p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: "'Manrope', system-ui, sans-serif", fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#D6A54A' }}>
          {data?.button_text || 'Book Your Event'}
          <ArrowRight size={16} strokeWidth={2} />
        </span>
      </div>
    </section>
  );
}
