import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function CTASection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/16935999/pexels-photo-16935999.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxurious banquet setting"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian/70" />
      </div>

      <div className="relative text-center container-narrow">
        <Reveal>
          <span className="label-gold mb-6 block">Fiesta Agency</span>
          <h2 className="font-serif text-display md:text-6xl font-light text-ivory mb-6 text-balance">
            Your moment deserves more.
          </h2>
          <p className="text-lg text-ivory-muted mb-10 max-w-xl mx-auto">
            Let's create something people will remember.
          </p>
          <Link to="/plan-your-event" className="btn-gold">
            Plan Your Event <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
