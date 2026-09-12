import { ChevronUp, ChevronDown } from 'lucide-react';
import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { HeroCarouselContent, HeroSlide } from '@/lib/types';

export function HeroCarouselEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as HeroCarouselContent;
  const slides = data.slides || [];

  const addSlide = () => {
    onChange({ ...data, slides: [...slides, {
      id: uid(), image: '', mobile_image: null, eyebrow: '', headline: '', highlight_word: '',
      description: '', cta_text: '', cta_url: '', secondary_cta_text: '',
      secondary_cta_url: '', focal_x: 0.5, focal_y: 0.5,
    }] });
  };

  const moveSlide = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= slides.length) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(i, 1);
    reordered.splice(target, 0, moved);
    onChange({ ...data, slides: reordered });
  };

  return (
    <div className="space-y-6">
      <FieldGroup title={`Slides (${slides.length})`}>
        <ListManager
          items={slides}
          onChange={(updated) => onChange({ ...data, slides: updated })}
          onAdd={addSlide}
          label="Slide"
          renderItem={(slide: HeroSlide, i, update, remove) => (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.55rem] font-semibold text-white/30">Slide {i + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSlide(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-white/20 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move slide up"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    onClick={() => moveSlide(i, 1)}
                    disabled={i === slides.length - 1}
                    className="p-1 text-white/20 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move slide down"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    onClick={remove}
                    className="p-1 text-white/15 hover:text-red-400/60 transition-colors"
                    aria-label="Remove slide"
                  >
                    <span className="text-[0.65rem]">Remove</span>
                  </button>
                </div>
              </div>
              <ImageField label="Desktop Background Image" value={slide.image} onChange={(v) => update({ image: v })} />
              <ImageField label="Mobile Background Image (optional)" value={slide.mobile_image || ''} onChange={(v) => update({ mobile_image: v || null })} />
              <AdminInput label="Eyebrow" value={slide.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} placeholder="e.g. FIESTA AGENCY" />
              <AdminInput label="Headline" value={slide.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="e.g. Moments that live long after the night ends." />
              <AdminInput label="Highlight Word (gold italic)" value={slide.highlight_word || ''} onChange={(e) => update({ highlight_word: e.target.value })} placeholder="e.g. You Make" />
              <AdminTextarea label="Description" value={slide.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="CTA Text" value={slide.cta_text} onChange={(e) => update({ cta_text: e.target.value })} placeholder="Plan Your Event" />
                <AdminInput label="CTA URL" value={slide.cta_url} onChange={(e) => update({ cta_url: e.target.value })} placeholder="/plan-your-event" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Secondary CTA Text" value={slide.secondary_cta_text} onChange={(e) => update({ secondary_cta_text: e.target.value })} />
                <AdminInput label="Secondary CTA URL" value={slide.secondary_cta_url} onChange={(e) => update({ secondary_cta_url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 block mb-1.5">Focal Point X</label>
                  <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={slide.focal_x ?? 0.5}
                    onChange={(e) => update({ focal_x: parseFloat(e.target.value) })}
                    className="w-full accent-gold"
                  />
                  <span className="text-[0.6rem] text-white/20">{Math.round((slide.focal_x ?? 0.5) * 100)}%</span>
                </div>
                <div>
                  <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 block mb-1.5">Focal Point Y</label>
                  <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={slide.focal_y ?? 0.5}
                    onChange={(e) => update({ focal_y: parseFloat(e.target.value) })}
                    className="w-full accent-gold"
                  />
                  <span className="text-[0.6rem] text-white/20">{Math.round((slide.focal_y ?? 0.5) * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
