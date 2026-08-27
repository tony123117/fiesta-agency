import { Reveal } from '@/components/Reveal';

export function BrandStatement() {
  return (
    <section className="py-24 md:py-40 bg-obsidian">
      <div className="container-narrow text-center">
        <Reveal>
          <span className="label-gold mb-8 block">The Philosophy</span>
          <h2 className="font-serif text-display md:text-5xl font-light text-ivory leading-tight text-balance">
            An event shouldn't simply happen.
            <br />
            <span className="italic text-gold">It should be experienced.</span>
          </h2>
          <div className="mt-10 mx-auto w-16 h-px bg-gold" />
          <p className="mt-10 text-lg text-ivory-muted leading-relaxed max-w-2xl mx-auto">
            From lighting and music to space, design, timing and emotion, every element contributes to the atmosphere.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
