import type { EditorialListContent } from '@/lib/types';

export function EditorialListRenderer({ content }: { content: unknown }) {
  const data = content as EditorialListContent;
  const items = data?.items || [];

  if (items.length === 0) return null;

  return (
    <section className="section-pad bg-obsidian">
      <div className="container-site">
        {data?.heading && <h2 className="section text-ivory mb-4">{data.heading}</h2>}
        {data?.description && <p className="text-body-lg text-stone mb-12 max-w-2xl">{data.description}</p>}
        <div className="border-t border-ivory/[0.08]">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="border-b border-ivory/[0.08] py-6 md:py-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="font-serif font-light text-gold/40 block text-2xl md:text-3xl leading-none">
                    {item.number || String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif font-light text-ivory tracking-tight text-lg md:text-xl leading-tight">
                    {item.title}
                  </h3>
                </div>
                {item.description && (
                  <div className="md:col-span-7">
                    <p className="text-body-sm text-stone leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
