import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useReveal } from '@/lib/useReveal';
import { images } from '@/lib/images-supabase';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function NotFound() {
  useDocumentMeta({
    title: 'Page Not Found | Fiesta Agency',
    description: 'The page you are looking for does not exist.',
  });

  const { ref: heroRef, visible: heroVisible } = useReveal({ threshold: 0.1 });

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#090909' }}
    >
      <div className="absolute inset-0">
        <img
          src={images.intimate[6]}
          alt="Elegant event atmosphere"
          className="w-full h-full object-cover"
          style={{ opacity: 0.15 }}
          loading="eager"
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(9,9,9,0.8) 0%, rgba(9,9,9,0.95) 100%)',
        }}
      />

      <div className="relative z-10 text-center px-5 md:px-[4vw] lg:px-[5vw]">
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.9s ${EASE}, transform 0.9s ${EASE}`,
          }}
        >
          <span
            className="font-serif font-light text-ivory/20 block mb-4 md:mb-6"
            style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', lineHeight: '0.7', letterSpacing: '-0.03em' }}
          >
            404
          </span>

          <h1
            className="font-serif font-light text-ivory tracking-tight mb-6 md:mb-8"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.1' }}
          >
            PAGE NOT FOUND
          </h1>

          <p
            className="font-sans text-stone/60 mb-10 md:mb-12 max-w-md mx-auto"
            style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: '1.7' }}
          >
            The page you're looking for doesn't exist or has been moved.
            It might be a temporary issue — or perhaps the moment has passed.
          </p>

          <Link
            to="/"
            className="btn-primary group inline-flex items-center gap-3"
          >
            BACK TO HOME
            <ArrowRight className="btn-arrow w-5 h-5 stroke-2" size={16} aria-hidden="true" />
          </Link>
        </div>

        <div
          className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: `opacity 0.8s ${EASE} 0.6s`,
          }}
          aria-hidden="true"
        >
          <span className="label-muted text-[0.55rem]">SCROLL</span>
          <div className="w-[1px] h-8 bg-white/10 relative overflow-hidden">
            <span className="absolute left-0 top-0 w-full bg-gold" style={{ height: '40%', animation: 'pulseSlow 3s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
export default NotFound;

