import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 className="font-serif text-2xl font-light text-ivory">{title}</h1>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-charcoal border border-charcoal-border p-6 ${className}`}>{children}</div>;
}

export function AdminButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: 'bg-gold text-obsidian hover:bg-gold-light',
    outline: 'border border-charcoal-border text-ivory hover:border-gold hover:text-gold',
    danger: 'border border-red-900 text-red-400 hover:bg-red-950/50',
    ghost: 'text-ivory-muted hover:text-ivory',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">
        {label}{required && <span className="text-gold"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none transition-colors"
      />
    </div>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">
        {label}{required && <span className="text-gold"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="w-full bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-ivory-muted mb-2">
        {label}{required && <span className="text-gold"> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-obsidian border border-charcoal-border px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-obsidian">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-charcoal-border'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-obsidian transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
      <span className="text-sm text-ivory">{label}</span>
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-950 text-blue-400 border-blue-900',
    contacted: 'bg-purple-950 text-purple-400 border-purple-900',
    in_progress: 'bg-yellow-950 text-yellow-400 border-yellow-900',
    confirmed: 'bg-green-950 text-green-400 border-green-900',
    completed: 'bg-emerald-950 text-emerald-400 border-emerald-900',
    cancelled: 'bg-red-950 text-red-400 border-red-900',
    upcoming: 'bg-blue-950 text-blue-400 border-blue-900',
    published: 'bg-green-950 text-green-400 border-green-900',
    draft: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };
  const cls = colors[status] || colors.draft;
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider border ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-gold" size={28} />
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center py-20">
      <p className="font-serif text-xl italic text-ivory-muted">{title}</p>
      {subtitle && <p className="text-sm text-ivory-muted/60 mt-3">{subtitle}</p>}
    </div>
  );
}

export function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 text-sm border ${
        type === 'success' ? 'bg-green-950/90 border-green-900 text-green-400' : 'bg-red-950/90 border-red-900 text-red-400'
      }`}
    >
      {message}
    </div>
  );
}
