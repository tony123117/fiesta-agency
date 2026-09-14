import { useReveal } from '@/lib/useReveal';
import type { LegalPageContent } from '@/lib/types';

const E = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function LegalPageRenderer({ content }: { content: unknown }) {
  const data = content as LegalPageContent;
  const { ref, visible } = useReveal({ threshold: 0.05 });

  const eyebrow = (data?.eyebrow as string) || 'Legal';
  const heading = (data?.heading as string) || '';
  const sections = data?.sections?.length ? data.sections : [];

  if (!heading && sections.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 pb-20"
      style={{ backgroundColor: '#090909' }}
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 md:px-[4vw]">
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.9s ${E}, transform 0.9s ${E}`,
        }}>
          <span
            className="font-sans uppercase tracking-[0.2em] block mb-4"
            style={{ fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)', color: '#D6A54A' }}
          >
            {eyebrow}
          </span>

          <h1
            className="font-serif font-light tracking-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.1', color: '#F8F5EF' }}
          >
            {heading}
          </h1>

          <div className="space-y-6" style={{ fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: '1.8', color: 'rgba(111,107,99,0.7)' }}>
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-serif text-xl mt-8 mb-4" style={{ color: '#F8F5EF' }}>
                  {section.heading}
                </h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
