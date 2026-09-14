interface ContactInfoContent {
  eyebrow?: string;
  heading?: string;
  event_types?: string[];
}

export function ContactInfo({ content }: { content: unknown }) {
  const data = content as ContactInfoContent;
  const heading = (data?.heading || "WE'D LOVE\nTO HEAR FROM YOU.").replace(/\\n/g, '\n');
  const parts = heading.split('\n');

  return (
    <div>
      <p style={{
        fontFamily: "'Manrope', system-ui, sans-serif",
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        fontWeight: 600,
        color: '#D6A54A',
        marginBottom: '20px',
      }}>{data?.eyebrow || 'CONTACT INFO'}</p>
      <h2 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
        lineHeight: 0.95,
        fontWeight: 400,
        color: '#161616',
        whiteSpace: 'pre-line' as const,
        marginBottom: '32px',
      }}>
        {parts.length > 1 ? <>{parts[0]} <span style={{ fontStyle: 'italic' }}>{parts.slice(1).join('\n')}</span></> : heading}
      </h2>
    </div>
  );
}
