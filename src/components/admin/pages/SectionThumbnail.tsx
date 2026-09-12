import type { SectionType } from '@/lib/types';

const thumbnails: Partial<Record<SectionType, React.ReactNode>> = {
  'hero-carousel': (
    <div className="w-full h-full bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 to-charcoal/80" />
      <div className="absolute inset-x-3 bottom-3">
        <div className="h-[3px] w-8 bg-gold/60 mb-1.5" />
        <div className="h-[6px] w-3/4 bg-ivory/40 rounded-sm mb-1" />
        <div className="h-[6px] w-1/2 bg-ivory/20 rounded-sm mb-2" />
        <div className="h-[4px] w-10 bg-gold/40 rounded-sm" />
      </div>
      <div className="absolute bottom-3 right-3 flex gap-1">
        <div className="w-2 h-2 rounded-full border border-ivory/30" />
        <div className="w-2 h-2 rounded-full bg-gold/60" />
      </div>
    </div>
  ),
  'brand-statement': (
    <div className="w-full h-full bg-warm-ivory flex flex-col items-center justify-center px-3">
      <div className="h-[3px] w-6 bg-gold/40 mb-2" />
      <div className="h-[5px] w-4/5 bg-charcoal/15 rounded-sm mb-1" />
      <div className="h-[5px] w-3/5 bg-gold/20 rounded-sm mb-2" />
      <div className="h-[3px] w-2/3 bg-charcoal/10 rounded-sm" />
    </div>
  ),
  'services-editorial': (
    <div className="w-full h-full bg-obsidian px-2 pt-2">
      <div className="h-[4px] w-1/2 bg-ivory/20 rounded-sm mb-1" />
      <div className="grid grid-cols-3 gap-1 flex-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-charcoal/60 rounded-sm overflow-hidden">
            <div className="h-2/3 bg-gold/10" />
            <div className="p-1">
              <div className="h-[3px] w-3/4 bg-ivory/20 rounded-sm mb-0.5" />
              <div className="h-[2px] w-full bg-ivory/10 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  'events-editorial': (
    <div className="w-full h-full bg-charcoal px-2 pt-2">
      <div className="h-[4px] w-1/2 bg-ivory/20 rounded-sm mb-1" />
      <div className="grid grid-cols-3 gap-1 flex-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-obsidian/60 rounded-sm overflow-hidden">
            <div className="h-2/3 bg-gold/8" />
            <div className="p-1">
              <div className="h-[2px] w-1/2 bg-gold/20 rounded-sm mb-0.5" />
              <div className="h-[3px] w-3/4 bg-ivory/20 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  'portfolio-gallery': (
    <div className="w-full h-full bg-obsidian px-2 pt-2">
      <div className="h-[4px] w-1/2 bg-ivory/20 rounded-sm mb-1" />
      <div className="grid grid-cols-3 gap-1 flex-1">
        <div className="bg-charcoal/60 rounded-sm aspect-[3/4]" />
        <div className="bg-charcoal/60 rounded-sm aspect-[3/4]" />
        <div className="bg-charcoal/60 rounded-sm aspect-[3/4]" />
      </div>
    </div>
  ),
  'testimonials': (
    <div className="w-full h-full bg-warm-ivory px-2 pt-2">
      <div className="h-[4px] w-1/2 bg-charcoal/10 rounded-sm mb-1.5" />
      <div className="grid grid-cols-2 gap-1.5 flex-1">
        {[0, 1].map((i) => (
          <div key={i} className="border-l-2 border-gold/30 pl-1.5">
            <div className="h-[3px] w-full bg-charcoal/8 rounded-sm mb-1" />
            <div className="h-[3px] w-3/4 bg-charcoal/8 rounded-sm mb-1.5" />
            <div className="h-[2px] w-1/2 bg-charcoal/10 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  ),
  'faq': (
    <div className="w-full h-full bg-charcoal px-2 pt-2">
      <div className="h-[4px] w-1/2 bg-ivory/20 rounded-sm mb-1.5 mx-auto" />
      <div className="space-y-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between border-b border-white/[0.04] pb-1">
            <div className="h-[3px] w-3/4 bg-ivory/15 rounded-sm" />
            <div className="w-1.5 h-1.5 border border-ivory/20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  ),
  'stats': (
    <div className="w-full h-full bg-obsidian flex items-center justify-center">
      <div className="grid grid-cols-4 gap-1.5 w-full px-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-[6px] w-3/4 mx-auto bg-gold/20 rounded-sm mb-1" />
            <div className="h-[2px] w-full mx-auto bg-ivory/10 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  ),
  'process': (
    <div className="w-full h-full bg-warm-ivory flex items-center justify-center">
      <div className="grid grid-cols-5 gap-1 w-full px-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="h-[4px] w-3/4 mx-auto bg-gold/20 rounded-sm mb-0.5" />
            <div className="h-[3px] w-full mx-auto bg-charcoal/8 rounded-sm mb-0.5" />
            <div className="h-[2px] w-full mx-auto bg-charcoal/5 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  ),
  'text-image': (
    <div className="w-full h-full bg-obsidian grid grid-cols-2 gap-1 p-2">
      <div className="flex flex-col justify-center">
        <div className="h-[3px] w-6 bg-gold/30 rounded-sm mb-1" />
        <div className="h-[4px] w-full bg-ivory/20 rounded-sm mb-0.5" />
        <div className="h-[4px] w-3/4 bg-ivory/15 rounded-sm mb-1" />
        <div className="h-[2px] w-full bg-ivory/8 rounded-sm mb-0.5" />
        <div className="h-[2px] w-2/3 bg-ivory/8 rounded-sm" />
      </div>
      <div className="bg-charcoal/60 rounded-sm" />
    </div>
  ),
  'cta': (
    <div className="w-full h-full bg-obsidian flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
      <div className="relative text-center px-2">
        <div className="h-[3px] w-6 mx-auto bg-gold/30 rounded-sm mb-1.5" />
        <div className="h-[5px] w-4/5 mx-auto bg-ivory/20 rounded-sm mb-1" />
        <div className="h-[5px] w-3/5 mx-auto bg-ivory/15 rounded-sm mb-2" />
        <div className="flex gap-1 justify-center">
          <div className="h-[4px] w-10 bg-gold/40 rounded-sm" />
          <div className="h-[4px] w-10 bg-ivory/10 rounded-sm" />
        </div>
      </div>
    </div>
  ),
};

export function SectionThumbnail({ type }: { type: SectionType }) {
  return (
    <div className="w-full aspect-[4/3] rounded overflow-hidden border border-white/[0.04]">
      {thumbnails[type] ?? (
        <div className="w-full h-full bg-charcoal/40 flex items-center justify-center text-[10px] text-white/20">
          {type}
        </div>
      )}
    </div>
  );
}
