import type { CinematicImageContent } from '@/lib/types';

export function CinematicImageRenderer({ content }: { content: unknown }) {
  const data = content as CinematicImageContent;
  if (!data?.image) return null;

  const focalX = data.focal_x ?? 0.5;
  const focalY = data.focal_y ?? 0.5;

  return (
    <section className="relative overflow-hidden" style={{ height: 'clamp(350px, 50vh, 550px)', minHeight: '280px' }}>
      <div className="absolute inset-0">
        <img
          src={data.image}
          alt={data.image_alt || ''}
          className="w-full h-full object-cover"
          style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }}
          loading="lazy"
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(21,21,21,0.3) 0%, rgba(21,21,21,0.2) 50%, rgba(21,21,21,0.4) 100%)' }}
      />
      {data.caption && (
        <div className={`relative z-10 h-full mx-auto max-w-[1440px] px-5 md:px-[4vw] lg:px-[5vw] flex items-end pb-10 md:pb-14 ${data.caption_alignment === 'center' ? 'justify-center text-center' : ''}`}>
          <p className="font-sans text-ivory/80 uppercase text-[0.65rem] tracking-[0.2em]">
            {data.caption}
          </p>
        </div>
      )}
    </section>
  );
}
