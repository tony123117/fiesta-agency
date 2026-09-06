import type { ProcessContent } from '@/lib/types';

export function ProcessRenderer({ content }: { content: unknown }) {
  const data = content as ProcessContent;
  const steps = data?.steps || [];

  if (steps.length === 0) return null;

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-site">
        {data?.heading && <h2 className="section text-ivory mb-4 text-center">{data.heading}</h2>}
        {data?.description && <p className="text-body-lg text-stone mb-12 text-center max-w-2xl mx-auto">{data.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              {step.image && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <p className="hero text-gold/30 mb-2">{step.number}</p>
              <h3 className="font-serif text-ivory text-lg mb-2">{step.title}</h3>
              {step.description && <p className="text-body-sm text-stone">{step.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
