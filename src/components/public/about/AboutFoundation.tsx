import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutFoundationContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export function AboutFoundation({ content }: { content: unknown }) {
  const data = content as AboutFoundationContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = breakHeading((data?.heading || 'WE TURN IDEAS INTO EXPERIENCES PEOPLE REMEMBER.').replace(/\\n/g, '\n'));
  const body = (data?.body || 'Fiesta takes an initial idea and develops it into a cohesive experience: concept, creative direction, planning, production, and execution — all working together as one vision.').replace(/\\n/g, '\n');

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 'clamp(80px, 10vw, 130px)',
        paddingBottom: 'clamp(80px, 10vw, 130px)',
      }}
    >
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[880px] text-center">
        <p
          className="font-sans uppercase tracking-[0.14em] mb-6"
          style={{
            fontSize: '0.65rem',
            color: '#D6A54A',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.7s ${EASE}, transform 0.7s ${EASE}`,
          }}
        >
          {data?.eyebrow || 'OUR FOUNDATION'}
        </p>
        <h2
          className="font-serif font-normal mb-8"
          style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
            lineHeight: '1.0',
            color: '#151515',
            whiteSpace: 'pre-line',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.8s ${EASE} 0.08s, transform 0.8s ${EASE} 0.08s`,
          }}
        >
          {heading}
        </h2>
        <div
          className="mx-auto mb-8"
          style={{
            width: '40px',
            height: '1.5px',
            backgroundColor: '#D6A54A',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transition: `opacity 0.7s ${EASE} 0.15s, transform 0.7s ${EASE} 0.15s`,
          }}
        />
        <p
          className="font-sans mx-auto"
          style={{
            fontSize: 'clamp(0.82rem, 0.9vw, 0.9rem)',
            lineHeight: '1.7',
            color: '#73706A',
            maxWidth: '600px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.8s ${EASE} 0.2s, transform 0.8s ${EASE} 0.2s`,
          }}
        >
          {body}
        </p>
      </div>
    </section>
  );
}
