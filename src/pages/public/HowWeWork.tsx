import { Reveal } from '@/components/Reveal';
import { ProcessSection } from '@/components/public/ProcessSection';
import { CTASection } from '@/components/public/CTASection';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function HowWeWork() {
  useDocumentMeta({
    title: 'How We Work — Fiesta Agency',
    description: 'From idea to experience: discover, design, plan, produce, celebrate.',
  });

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-obsidian">
        <div className="container-lux">
          <Reveal>
            <span className="label-gold mb-6 block">How We Work</span>
            <h1 className="font-serif text-hero font-light text-ivory max-w-3xl text-balance">
              From idea to experience.
            </h1>
            <p className="mt-8 text-lg text-ivory-muted max-w-2xl leading-relaxed">
              Every event moves through five stages — from the first conversation to the moment the client experiences the result.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSection />
      <CTASection />
    </>
  );
}
