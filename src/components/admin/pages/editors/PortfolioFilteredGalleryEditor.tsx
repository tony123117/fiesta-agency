import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminUI';
import type { PortfolioFilteredGalleryContent } from '@/lib/types';

export function PortfolioFilteredGalleryEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as PortfolioFilteredGalleryContent;
  const categories = data.categories || ['ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'];

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading (optional)" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description (optional)" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />
      <AdminSelect label="Layout Variant" value={data.variant || 'grid'} onChange={(e) => onChange({ ...data, variant: e.target.value })}>
        <option value="grid">Grid</option>
        <option value="masonry">Masonry</option>
      </AdminSelect>
      <AdminInput label="Max Projects" type="number" value={String(data.max_projects || 9)} onChange={(e) => onChange({ ...data, max_projects: parseInt(e.target.value) || 9 })} />
      <div>
        <label className="block text-xs font-medium text-stone mb-2">Categories (comma-separated)</label>
        <AdminInput
          value={categories.join(', ')}
          onChange={(e) => onChange({ ...data, categories: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
        />
        <p className="text-xs text-stone/50 mt-1">Default: ALL, CORPORATE, PRIVATE, WEDDINGS, CONCERTS, FESTIVALS</p>
      </div>
    </div>
  );
}
