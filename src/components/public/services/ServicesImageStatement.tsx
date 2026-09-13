import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesImageStatementContent {
  heading?: string;
  description?: string;
  image?: string;
}

const DEFAULT_IMAGE = images.lagoon[5];

export function ServicesImageStatement({ content }: { content: unknown }) {
  const data = content as ServicesImageStatementContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = (data?.heading || "WE TAKE CARE\nOF THE DETAILS.").replace(/\\n/g, '\n');
  const bgImage = data?.image || DEFAULT_IMAGE;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: 'clamp(450px, 55vh, 600px)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(9,9,9,0.45) 0%, rgba(9,9,9,0.35) 40%, rgba(9,9,9,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center"
        style={{
          paddingLeft: 'clamp(24px, 4vw, 40px)',
          paddingRight: 'clamp(24px, 4vw, 40px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: `opacity 0.9s ${EASE} 0.1s, transform 0.9s ${EASE} 0.1s`,
        }}
      >
        <h2
          className="svc-imgstmt-heading"
        >
          {heading}
        </h2>
        {data?.description && (
          <p
            className="svc-imgstmt-body"
          >
            {data.description}
          </p>
        )}
      </div>

      <style>{`
        .svc-imgstmt-heading {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.5rem, 4.5vw, 3.875rem);
          line-height: 0.95;
          font-weight: 400;
          color: #F5F2EA;
          white-space: pre-line;
          max-width: 16ch;
        }
        .svc-imgstmt-body {
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: clamp(0.88rem, 1vw, 0.95rem);
          line-height: 1.7;
          color: rgba(245,242,234,0.65);
          max-width: 400px;
          margin-top: 24px;
        }
      `}</style>
    </section>
  );
}
