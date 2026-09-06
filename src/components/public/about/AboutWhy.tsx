import { useReveal } from '@/lib/useReveal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutWhyContent {
  heading?: string;
  points?: Array<{ id: string; title: string; description: string }>;
}

export function AboutWhy({ content }: { content: unknown }) {
  const data = content as AboutWhyContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = (data?.heading || 'WHY FIESTA?').replace(/\\n/g, '\n');
  const points = data?.points?.length
    ? data.points
    : [
        { id: '1', title: 'CREATIVE THINKING', description: 'We approach every event from its own story.' },
        { id: '2', title: 'SEAMLESS EXECUTION', description: 'We coordinate the moving parts behind the scenes.' },
        { id: '3', title: 'ATTENTION TO DETAIL', description: 'We care about the details guests may never notice, but always feel.' },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 'clamp(70px, 9vw, 120px)',
        paddingBottom: 'clamp(70px, 9vw, 120px)',
      }}
    >
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Left: Heading — 40% */}
          <div
            className="w-full lg:w-[40%] shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
            }}
          >
            <h2
              className="font-serif font-normal"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: '1.0',
                color: '#151515',
              }}
            >
              {heading}
            </h2>
          </div>

          {/* Right: Points — 55% */}
          <div
            className="w-full lg:w-[55%]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${EASE} 0.1s, transform 0.8s ${EASE} 0.1s`,
            }}
          >
            {points.map((point, i) => (
              <div
                key={point.id}
                className="flex gap-5 md:gap-7"
                style={{
                  borderTop: '1px solid rgba(20,20,20,0.1)',
                  paddingTop: 'clamp(20px, 2.5vw, 32px)',
                  paddingBottom: 'clamp(20px, 2.5vw, 32px)',
                }}
              >
                <span
                  className="font-sans shrink-0"
                  style={{ fontSize: '0.6rem', color: '#D6A54A', paddingTop: '3px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="font-serif font-normal mb-2"
                    style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', color: '#151515' }}
                  >
                    {point.title}
                  </h3>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)',
                      lineHeight: '1.65',
                      color: '#73706A',
                      maxWidth: '380px',
                    }}
                  >
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
