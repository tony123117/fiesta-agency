import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import type { PortfolioFeaturedContent } from '@/lib/types';

export function PortfolioFeaturedEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as PortfolioFeaturedContent;

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading (optional — defaults to first project title)" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      <AdminTextarea label="Description (optional — defaults to first project description)" value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} />
      <AdminInput label="Button Text" value={data.button_text || ''} onChange={(e) => onChange({ ...data, button_text: e.target.value })} />
      <AdminInput label="Button URL (optional — defaults to first project link)" value={data.button_url || ''} onChange={(e) => onChange({ ...data, button_url: e.target.value })} />
      <p className="text-xs text-stone/50">This section automatically displays the first published portfolio project. Override heading/description/button if needed.</p>
    </div>
  );
}
