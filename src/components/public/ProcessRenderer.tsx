interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

interface ProcessContent {
  eyebrow?: string;
  heading?: string;
  steps: ProcessStep[];
}

export function ProcessRenderer({ content }: { content: unknown }) {
  const data = content as ProcessContent;
  const steps = data?.steps || [];
  if (steps.length === 0) return null;

  return (
    <section className="bg-obsidian border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-[4vw] md:py-28 lg:px-12">
        {(data.eyebrow || data.heading) && (
          <div className="mb-14 max-w-[560px]">
            {data.eyebrow && <span className="label-gold mb-4 block">{data.eyebrow}</span>}
            {data.heading && (
              <h2 className="font-serif font-light text-ivory leading-[1.05]" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                {data.heading}
              </h2>
            )}
          </div>
        )}

        <div className="flex gap-10 overflow-x-auto snap-x snap-mandatory pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, i) => (
            <div key={step.id} className="snap-start shrink-0 w-[260px] md:w-[300px]">
              <span className="block font-serif font-light text-gold leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="h-px w-full bg-white/10 mb-6" />
              <h3 className="font-serif font-light text-ivory text-xl mb-3">{step.title}</h3>
              <p className="text-ivory/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessRenderer;