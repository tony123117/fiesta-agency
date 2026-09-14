import { useReveal } from '@/lib/useReveal';
import type { EventsUpcomingContent } from '@/lib/types';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function EventsUpcomingRenderer({ content }: { content: unknown }) {
  const data = content as EventsUpcomingContent;
  const { ref, visible } = useReveal({ threshold: 0.08 });

  const eyebrow = (data?.eyebrow as string) || 'UPCOMING EVENTS';
  const heading = (data?.heading as string) || "WHAT'S COMING UP";
  const description = (data?.description as string) || '';

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 0.7s ${E}, transform 0.7s ${E}`,
    }}>
      <p style={{
        fontFamily: "'Manrope', system-ui, sans-serif",
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        fontWeight: 600,
        color: '#D6A54A',
        marginBottom: '16px',
      }}>{eyebrow}</p>
      <h2 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
        lineHeight: 0.95,
        fontWeight: 400,
        color: '#090909',
        marginBottom: description ? '12px' : 0,
      }}>{heading}</h2>
      {description && <p style={{
        fontFamily: "'Manrope', system-ui, sans-serif",
        fontSize: 'clamp(0.85rem, 1vw, 0.94rem)',
        lineHeight: 1.7,
        color: '#6F6B63',
        maxWidth: '520px',
      }}>{description}</p>}
    </div>
  );
}
