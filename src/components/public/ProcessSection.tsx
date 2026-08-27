import { Reveal } from '@/components/Reveal';

const STAGES = [
  { num: '01', title: 'Discover', text: "Understand the client's idea, requirements, expectations and vision." },
  { num: '02', title: 'Design', text: 'Turn the idea into a creative concept and experience.' },
  { num: '03', title: 'Plan', text: 'Coordinate logistics, vendors, timelines, budgets and details.' },
  { num: '04', title: 'Produce', text: 'Bring the concept to life.' },
  { num: '05', title: 'Celebrate', text: 'The client gets to experience the result.' },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-obsidian">
      <div className="container-lux">
        <Reveal>
          <div className="mb-16 md:mb-24 text-center">
            <span className="label-gold mb-4 block">The Process</span>
            <h2 className="font-serif text-section font-light text-ivory">
              From Idea to Experience
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-charcoal-border md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-20">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num}>
                <div className={`relative flex items-start gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Number side */}
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="font-serif text-7xl md:text-8xl font-light text-gold/30 block">
                      {stage.num}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 top-4 md:top-6 -translate-x-1/2 w-3 h-3 bg-gold rounded-full ring-4 ring-obsidian z-10" />
                  {/* Text side */}
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-ivory uppercase tracking-wide mb-3">
                      {stage.title}
                    </h3>
                    <p className="text-ivory-muted leading-relaxed max-w-sm">{stage.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
