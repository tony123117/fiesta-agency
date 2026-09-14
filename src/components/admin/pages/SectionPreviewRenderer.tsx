import type { Section } from '@/lib/types';
import { SectionRenderer } from '@/components/public/SectionRenderer';

export function SectionPreviewRenderer({ section }: { section: Section }) {
  return (
    <div className="w-full min-h-[200px] overflow-hidden">
      <SectionRenderer
        section={{
          ...section,
          published: true,
        }}
        isPreview={true}
      />
    </div>
  );
}
