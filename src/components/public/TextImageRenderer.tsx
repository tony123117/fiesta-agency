import { Link } from 'react-router-dom';
import type { TextImageContent } from '@/lib/types';

export function TextImageRenderer({ content }: { content: unknown }) {
  const data = content as TextImageContent;
  if (!data) return null;

  const hasContent = data.heading || data.body || data.eyebrow || data.image;
  if (!hasContent) return null;

  const variant = data.variant || 'default';

  if (variant === 'centered') {
    return (
      <section className="section-pad bg-obsidian">
        <div className="container-narrow text-center">
          {data.eyebrow && <p className="eyebrow text-gold mb-4">{data.eyebrow}</p>}
          {data.heading && <h2 className="section text-ivory mb-6">{data.heading}</h2>}
          {data.body && <p className="text-body-lg text-stone whitespace-pre-line max-w-2xl mx-auto">{data.body}</p>}
          {data.cta_text && (
            <Link to={data.cta_url || '#'} className="btn-primary mt-8 inline-block">
              {data.cta_text}
            </Link>
          )}
        </div>
      </section>
    );
  }

  const imageOnLeft = data.image_position === 'left';

  return (
    <section className="section-pad bg-obsidian">
      <div className="container-site">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageOnLeft ? '' : ''}`}>
          <div className={imageOnLeft ? 'lg:order-2' : ''}>
            {data.eyebrow && <p className="eyebrow text-gold mb-4">{data.eyebrow}</p>}
            {data.heading && <h2 className="section text-ivory mb-6">{data.heading}</h2>}
            {data.body && <p className="text-body-lg text-stone whitespace-pre-line">{data.body}</p>}
            {data.cta_text && (
              <Link to={data.cta_url || '#'} className="btn-primary mt-8 inline-block">
                {data.cta_text}
              </Link>
            )}
          </div>
          {data.image && (
            <div className={`${imageOnLeft ? 'lg:order-1' : ''}`}>
              <img src={data.image} alt={data.image_alt || ''} className="w-full rounded-lg object-cover aspect-[4/3]" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
