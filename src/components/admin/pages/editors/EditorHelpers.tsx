import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { MediaPicker } from '@/components/admin/media';

export function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25">{title}</h3>
      {children}
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">{label}</label>
      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-32 object-cover rounded" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded">
            <button
              onClick={() => setShowPicker(true)}
              className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-[0.7rem] text-white rounded border border-white/20 hover:bg-white/20 transition-colors"
            >
              Replace
            </button>
            <button
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm text-[0.7rem] text-red-300 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full h-24 border border-dashed border-white/[0.08] rounded flex items-center justify-center gap-2 hover:border-gold/30 transition-colors"
        >
          <span className="text-[0.7rem] text-white/25">Choose Image</span>
        </button>
      )}
      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(items) => { if (items[0]) onChange(items[0].public_url); }}
        mode="single"
      />
    </div>
  );
}

export function ListManager<T extends { id: string }>({
  items,
  onChange,
  onAdd,
  renderItem,
  label,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  onAdd: () => void;
  renderItem: (item: T, index: number, update: (fields: Partial<T>) => void, remove: () => void) => React.ReactNode;
  label: string;
}) {
  const handleUpdate = (index: number, fields: Partial<T>) => {
    const updated = items.map((item, i) => i === index ? { ...item, ...fields } : item);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="border border-white/[0.06] rounded p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.55rem] font-semibold text-white/20">{i + 1}</span>
            <button onClick={() => handleRemove(i)} className="text-white/15 hover:text-red-400/60 transition-colors" aria-label={`Remove ${label} ${i + 1}`}>
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
          {renderItem(item, i, (fields) => handleUpdate(i, fields), () => handleRemove(i))}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="w-full py-2 border border-dashed border-white/[0.08] rounded flex items-center justify-center gap-2 text-[0.7rem] text-white/25 hover:text-gold hover:border-gold/30 transition-colors"
      >
        <Plus size={12} strokeWidth={1.5} /> Add {label}
      </button>
    </div>
  );
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
