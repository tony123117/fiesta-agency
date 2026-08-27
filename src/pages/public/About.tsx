import { Reveal } from '@/components/Reveal';
import { CTASection } from '@/components/public/CTASection';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function About() {
  useDocumentMeta({
    title: 'About — Fiesta Agency',
    description: 'Fiesta is a creative experience company that designs, produces and manages unforgettable moments.',
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2608516/pexels-photo-2608516.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Creative team at work"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/40" />
        </div>
        <div className="relative container-lux py-20">
          <Reveal>
            <span className="label-gold mb-6 block">About Fiesta</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              We don't just plan events.
            </h1>
            <p className="mt-6 font-serif text-2xl italic text-gold max-w-2xl">
              We create experiences people remember.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 bg-obsidian">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/8089662/pexels-photo-8089662.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Behind the scenes of creative production"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal>
            <span className="label-gold mb-6 block">Our Philosophy</span>
            <h2 className="font-serif text-display font-light text-ivory mb-8 text-balance">
              An event shouldn't simply happen. It should be experienced.
            </h2>
            <div className="space-y-6 text-ivory-muted leading-relaxed">
              <p>
                Fiesta is a creative experience company. We do not simply organize events — we design, produce and manage moments that live long after the night ends.
              </p>
              <p>
                Lighting, music, space, people, design, timing, emotion and storytelling — every element contributes to the experience. Our job is to make them work together so seamlessly that the result feels inevitable.
              </p>
              <p>
                We bring planning, creative direction, production, design, coordination and execution together under one roof. That is what allows us to turn an idea into an experience.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we believe */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-4 block">What We Believe</span>
            <h2 className="font-serif text-section font-light text-ivory mb-16">
              The principles behind every event.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Every detail matters', text: 'From the first impression to the last song, nothing is too small to matter. The smallest choices often make the biggest difference.' },
              { title: 'Atmosphere is everything', text: 'An event is not a schedule — it is a feeling. We design for emotion first, then build the logistics around it.' },
              { title: 'The experience is the brand', text: 'When guests remember the night, they remember the people who made it. Every event we create carries our name.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <span className="font-serif text-5xl font-light text-gold/30 block mb-4">0{i + 1}</span>
                <h3 className="font-serif text-xl font-normal text-ivory mb-3">{item.title}</h3>
                <p className="text-ivory-muted leading-relaxed text-sm">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 md:py-32 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-4 block">Capabilities</span>
            <h2 className="font-serif text-section font-light text-ivory mb-16">
              What we bring.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-charcoal-border">
            {['Planning', 'Creative Direction', 'Production', 'Design', 'Coordination', 'Execution', 'Experience Design', 'Storytelling'].map((cap, i) => (
              <Reveal key={cap} delay={i * 50}>
                <div className="bg-obsidian p-8 md:p-10 h-full">
                  <span className="font-serif text-3xl font-light text-gold/30 block mb-2">0{i + 1}</span>
                  <p className="text-ivory text-sm uppercase tracking-wide">{cap}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-4 block">The Work</span>
            <h2 className="font-serif text-section font-light text-ivory mb-12">
              A glimpse behind the scenes.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'https://images.pexels.com/photos/8089249/pexels-photo-8089249.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/7335420/pexels-photo-7335420.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/8088372/pexels-photo-8088372.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/11157600/pexels-photo-11157600.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/8088371/pexels-photo-8088371.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/9866568/pexels-photo-9866568.jpeg?auto=compress&cs=tinysrgb&w=800',
            ].map((src, i) => (
              <Reveal key={i}>
                <div className="aspect-square overflow-hidden">
                  <img src={src} alt="Behind the scenes" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-lux" loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
