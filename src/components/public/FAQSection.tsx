import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import type { FAQ } from '@/lib/types';

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const published = faqs.filter((f) => f.published).sort((a, b) => a.sort_order - b.sort_order);
  const [open, setOpen] = useState<number | null>(0);

  if (published.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-obsidian">
      <div className="container-narrow">
        <Reveal>
          <span className="label-gold mb-4 block">Questions</span>
          <h2 className="font-serif text-section font-light text-ivory mb-16">
            Frequently asked.
          </h2>
        </Reveal>

        <div className="space-y-0">
          {published.map((faq, i) => (
            <Reveal key={faq.id}>
              <div className="border-t border-charcoal-border last:border-b">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className={`font-serif text-lg md:text-xl transition-colors duration-300 ${open === i ? 'text-gold' : 'text-ivory group-hover:text-gold'}`}>
                    {faq.question}
                  </span>
                  <span className="shrink-0 ml-6 text-gold">
                    {open === i ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-lux ${open === i ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-ivory-muted leading-relaxed pr-12">{faq.answer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
