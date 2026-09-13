import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutClosingContent {
  heading?: string;
  cta_text?: string;
  cta_url?: string;
  background_image?: string;
  background_image_alt?: string;
}

export function AboutClosing({ content }: { content: unknown }) {
  const data = content as AboutClosingContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = breakHeading((data?.heading || 'YOUR VISION. OUR EXPERIENCE.').replace(/\\n/g, '\n'));
  const image = data?.background_image || images.bts[4];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: 'clamp(220px, 28vh, 320px)' }}
    >
      <img
        src={image}
        alt={data?.background_image_alt || 'Cinematic event experience'}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />
      <div
        className="relative z-10 text-center px-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
        }}
      >
        <h2
          className="font-serif font-normal mb-5"
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
            lineHeight: '1.05',
            color: '#F5F2EA',
            whiteSpace: 'pre-line',
          }}
        >
          {heading}
        </h2>
        <a
          href={data?.cta_url || '/contact'}
          className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.12em] transition-all duration-300 hover:translate-x-1"
          style={{ fontSize: '0.68rem', color: '#D6A54A' }}
        >
          {data?.cta_text || "LET'S CREATE IT"}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
