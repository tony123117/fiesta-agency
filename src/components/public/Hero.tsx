import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-end">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/37975399/pexels-photo-37975399.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxurious event setting with ambient lighting and elegant decor"
          className="w-full h-full object-cover animate-slow-zoom"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container-lux pb-20 md:pb-28 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <span className="block w-12 h-px bg-gold origin-left animate-draw-line" style={{ animationDelay: '0.4s' }} />
            <span className="label-gold">Fiesta Agency</span>
          </div>

          <h1 className="font-serif text-hero font-light text-ivory text-balance animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            Moments that live long after the night ends.
          </h1>

          <p className="mt-6 font-serif text-xl md:text-2xl italic text-ivory-muted animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            Unforgettable celebrations.
          </p>

          <p className="mt-6 text-base md:text-lg text-ivory/70 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
            We design, produce and manage extraordinary events where every detail becomes part of the experience.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '1s', opacity: 0 }}>
            <Link to="/plan-your-event" className="btn-gold">
              Plan Your Event <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="btn-outline">
              Explore Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '1.4s', opacity: 0 }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-ivory-muted">Scroll to Experience</span>
        <span className="block w-px h-10 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}
