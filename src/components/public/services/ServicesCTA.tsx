import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface ServicesCTAContent {
  heading?: string;
  button_text?: string;
  button_url?: string;
  background_image?: string;
}

const DEFAULT_IMAGE = images.hero[1];

export function ServicesCTA({ content }: { content: unknown }) {
  const data = content as ServicesCTAContent;
  const { ref: sectionRef, visible } = useReveal({ threshold: 0.1 });

  const heading = (data?.heading || "TELL US WHAT\nYOU'RE IMAGINING.").replace(/\\n/g, '\n');
  const bgImage = data?.background_image || DEFAULT_IMAGE;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: 'clamp(420px, 50vh, 520px)' }}
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
          background: 'linear-gradient(180deg, rgba(9,9,9,0.5) 0%, rgba(9,9,9,0.4) 40%, rgba(9,9,9,0.65) 100%)',
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
        <h2 className="svc-cta-heading">{heading}</h2>

        <Link
          to={data?.button_url || '/contact'}
          className="group svc-cta-btn"
        >
          {data?.button_text || 'GET IN TOUCH'}
          <ArrowRight
            className="svc-cta-arrow"
            size={16}
            aria-hidden="true"
          />
        </Link>
      </div>

      <style>{`
        .svc-cta-heading {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.75rem, 4.5vw, 4.25rem);
          line-height: 0.95;
          font-weight: 400;
          color: #F5F2EA;
          white-space: pre-line;
          max-width: 16ch;
        }
        .svc-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          font-family: 'Manrope', system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #D6A54A;
          transition: color 0.3s ease;
        }
        .svc-cta-btn:hover {
          color: #B88A32;
        }
        .svc-cta-arrow {
          width: 16px;
          height: 16px;
          stroke-width: 2;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .svc-cta-btn:hover .svc-cta-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
