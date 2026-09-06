import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQContent } from '@/lib/types';
import { useHomeData } from '@/lib/usePublicData';

export function FAQRenderer({ content }: { content: unknown }) {
  const data = content as FAQContent;
  const { faqs } = useHomeData();
  const [openId, setOpenId] = useState<string | null>(null);

  const items = data?.items?.length ? data.items : (faqs || []).slice(0, 7).map((f) => ({
    id: f.id, question: f.question, answer: f.answer,
  }));

  if (items.length === 0) return null;

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-narrow">
        {data?.heading && <h2 className="section text-ivory mb-4 text-center">{data.heading}</h2>}
        {data?.description && <p className="text-body-lg text-stone mb-12 text-center">{data.description}</p>}
        <div className="divide-y divide-white/[0.06]">
          {items.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between py-5 text-left"
                aria-expanded={openId === item.id}
              >
                <span className="text-body text-ivory pr-4">{item.question}</span>
                <ChevronDown size={18} className={`text-stone shrink-0 transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`} />
              </button>
              {openId === item.id && (
                <div className="pb-5">
                  <p className="text-body-sm text-stone leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
