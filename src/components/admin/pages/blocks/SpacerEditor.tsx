import { AdminInput } from '@/components/admin/AdminUI';
import { ResponsiveBlockPanel } from './ResponsiveBlockPanel';
import type { Block } from '@/lib/blockTypes';

export function SpacerEditor({
  content,
  onChange,
  responsive,
  onResponsiveChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
  responsive?: Block['responsive'];
  onResponsiveChange?: (r: Block['responsive']) => void;
}) {
  const height = (content.height as number) || 48;

  return (
    <div className="space-y-4">
      {/* Dimensions */}
      <div className="space-y-3">
        <h4 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">Dimensions</h4>
        <AdminInput
          label="Height"
          name="height"
          type="number"
          value={String(height)}
          onChange={(e) => onChange({ ...content, height: Number(e.target.value) })}
        />
        <div className="flex gap-1 flex-wrap">
          {[16, 24, 32, 48, 64, 80, 96, 128].map((h) => (
            <button
              key={h}
              onClick={() => onChange({ ...content, height: h })}
              className={`px-2 py-1 text-[0.6rem] rounded border transition-colors ${
                height === h
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : 'text-white/30 border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              {h}px
            </button>
          ))}
        </div>
      </div>

      {/* Responsive */}
      {responsive && onResponsiveChange && (
        <ResponsiveBlockPanel
          responsive={responsive}
          onResponsiveChange={onResponsiveChange}
          showWidth={false}
          showAlignment={false}
          showSpacing={false}
          showStack={false}
        />
      )}
    </div>
  );
}
