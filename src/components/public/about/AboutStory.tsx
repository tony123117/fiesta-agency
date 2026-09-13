import { useReveal } from '@/lib/useReveal';
import { breakHeading } from '@/lib/breakHeading';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface AboutStoryContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
}

export function AboutStory({ content }: { content: unknown }) {
  const data = content as AboutStoryContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = breakHeading((data?.heading || 'BUILT ON PASSION. DRIVEN BY PURPOSE.').replace(/\\n/g, '\n'));
  const body = (data?.body || 'Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.').replace(/\\n/g, '\n');
  const image = data?.image || images.behind[2];

  const paragraphs = body.split('\n\n');

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        backgroundColor: '#F5F2EA',
        paddingTop: 'clamp(70px, 9vw, 120px)',
        paddingBottom: 'clamp(70px, 9vw, 120px)',
      }}
    >
      <div className="mx-auto px-5 md:px-[4vw] lg:px-[5vw] max-w-[1280px]">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* Left: Text — 42% */}
          <div
            className="w-full lg:w-[42%] shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
            }}
          >
            <p
              className="font-sans uppercase tracking-[0.14em] mb-4"
              style={{ fontSize: '0.65rem', color: '#B88A32' }}
            >
              {data?.eyebrow || 'OUR STORY'}
            </p>
            <h2
              className="font-serif font-normal mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
                lineHeight: '1.0',
                color: '#151515',
                maxWidth: '380px',
                whiteSpace: 'pre-line',
              }}
            >
              {heading}
            </h2>
            <div
              className="mb-6"
              style={{ width: '50px', height: '1.5px', backgroundColor: '#D6A54A' }}
            />
            <div
              className="font-sans"
              style={{
                fontSize: 'clamp(0.82rem, 0.9vw, 0.88rem)',
                lineHeight: '1.7',
                color: '#73706A',
                maxWidth: '400px',
              }}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-4' : ''}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Image — 50% */}
          <div
            className="w-full lg:w-[50%]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(26px)',
              transition: `opacity 0.9s ${EASE} 0.12s, transform 0.9s ${EASE} 0.12s`,
            }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={image}
                alt={data?.image_alt || 'Event production'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
