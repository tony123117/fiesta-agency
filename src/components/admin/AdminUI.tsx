import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/* ══════════════════════════════════════════════════
   SIDEBAR CONTEXT
   ══════════════════════════════════════════════════ */
interface SidebarContextValue {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useAdminSidebar must be used within SidebarProvider');
  return ctx;
}

/* ══════════════════════════════════════════════════
   PAGE HEADER
   ══════════════════════════════════════════════════ */
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="font-serif font-medium text-xl tracking-tight text-ivory">{title}</h1>
        {description && <p className="text-[0.8rem] text-white/40 mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN CARD
   ══════════════════════════════════════════════════ */
export function AdminCard({
  children,
  padding = true,
  className = '',
  ...props
}: {
  children: ReactNode;
  padding?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-charcoal border border-white/[0.06] rounded-lg ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN BUTTON
   ══════════════════════════════════════════════════ */
export function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.12em] transition-all duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:opacity-40 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-gold text-obsidian hover:bg-gold-light shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(214,166,79,0.3)]',
    secondary: 'bg-white/[0.06] text-white/70 border border-white/[0.1] hover:bg-white/[0.1] hover:text-white hover:border-white/[0.2]',
    ghost: 'bg-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.04]',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[0.6rem]',
    md: 'px-4 py-2 text-[0.65rem]',
    lg: 'px-6 py-2.5 text-[0.7rem]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="w-3.5 h-3.5 border-[1.5px] border-current/30 border-t-current rounded-full animate-spin" />}
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN INPUT
   ══════════════════════════════════════════════════ */
export function AdminInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  disabled,
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white/[0.04] border px-3 py-2.5 text-[0.85rem] text-ivory rounded transition-colors duration-200 placeholder:text-white/20 focus:outline-none disabled:opacity-40 ${
          error
            ? 'border-red-500/40 focus:border-red-500/60'
            : 'border-white/[0.08] focus:border-gold/40'
        }`}
        {...props}
      />
      {error && <p className="text-[0.7rem] text-red-400">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN TEXTAREA
   ══════════════════════════════════════════════════ */
export function AdminTextarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required,
  placeholder,
  disabled,
  error,
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white/[0.04] border px-3 py-2.5 text-[0.85rem] text-ivory rounded transition-colors duration-200 placeholder:text-white/20 focus:outline-none disabled:opacity-40 resize-y font-sans ${
          error
            ? 'border-red-500/40 focus:border-red-500/60'
            : 'border-white/[0.08] focus:border-gold/40'
        }`}
        {...props}
      />
      {error && <p className="text-[0.7rem] text-red-400">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN SELECT
   ══════════════════════════════════════════════════ */
export function AdminSelect({
  label,
  name,
  value,
  onChange,
  children,
  required,
  disabled,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-[0.85rem] text-ivory rounded transition-colors duration-200 focus:border-gold/40 focus:outline-none cursor-pointer disabled:opacity-40 appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN TOGGLE
   ══════════════════════════════════════════════════ */
export function AdminToggle({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
          checked ? 'bg-gold' : 'bg-white/[0.12]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-[0.8rem] text-white/70">{label}</span>
    </label>
  );
}

/* ══════════════════════════════════════════════════
   STATUS BADGE
   ══════════════════════════════════════════════════ */
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  contacted: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  quoted: { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-400' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400' },
  published: { bg: 'bg-green-500/10', text: 'text-green-400' },
  draft: { bg: 'bg-white/[0.06]', text: 'text-white/40' },
  upcoming: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  past: { bg: 'bg-white/[0.06]', text: 'text-white/40' },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || { bg: 'bg-white/[0.06]', text: 'text-white/40' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.12em] ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN TABLE
   ══════════════════════════════════════════════════ */
export function AdminTable({
  columns,
  data,
  onRowClick,
  emptyTitle = 'No data',
  emptySubtitle = 'There are no items to display.',
}: {
  columns: { key: string; label: string; render?: (item: any) => ReactNode; className?: string }[];
  data: any[];
  onRowClick?: (item: any) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <div className="overflow-x-auto -mx-5 lg:-mx-6">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 lg:px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/30 ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={item.id || i}
              className={`border-b border-white/[0.04] transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-white/[0.02]' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-5 lg:px-6 py-3 text-[0.8rem] text-white/60 ${col.className || ''}`}>
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN MODAL
   ══════════════════════════════════════════════════ */
export function AdminModal({
  open,
  onClose,
  title,
  children,
  maxWidth = '32rem',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl max-h-[85vh] flex flex-col"
        style={{ maxWidth }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-serif font-medium text-base tracking-tight text-ivory">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ADMIN DROPDOWN
   ══════════════════════════════════════════════════ */
export function AdminDropdown({
  trigger,
  items,
  align = 'right',
}: {
  trigger: ReactNode;
  items: { label: string; onClick: () => void; danger?: boolean }[];
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-1 z-50 min-w-[10rem] bg-charcoal border border-white/[0.08] rounded-lg shadow-xl py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[0.8rem] transition-colors ${
                item.danger
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════════ */
export function EmptyState({
  title = 'No items',
  subtitle = 'There are no items to display yet.',
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
        <div className="w-5 h-5 border border-white/[0.1] rounded" />
      </div>
      <p className="text-[0.85rem] font-medium text-white/50 mb-1">{title}</p>
      <p className="text-[0.75rem] text-white/30 mb-4">{subtitle}</p>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LOADING STATE
   ══════════════════════════════════════════════════ */
export function AdminLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-[1.5px] border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="text-[0.65rem] text-white/30 uppercase tracking-[0.2em]">{text}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ERROR STATE
   ══════════════════════════════════════════════════ */
export function ErrorState({
  title = 'Something went wrong',
  subtitle = 'An unexpected error occurred.',
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-red-400 text-lg">!</span>
      </div>
      <p className="text-[0.85rem] font-medium text-white/50 mb-1">{title}</p>
      <p className="text-[0.75rem] text-white/30 mb-4">{subtitle}</p>
      {onRetry && (
        <AdminButton variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </AdminButton>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════ */
export function Toast({ message, onClose }: { message: string; onClose?: () => void }) {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex items-center gap-3 bg-charcoal border border-white/[0.08] px-4 py-3 rounded-lg shadow-xl">
      <span className="text-[0.8rem] text-white/70">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-white/30 hover:text-white/60" aria-label="Dismiss">
          <X size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SEARCH INPUT
   ══════════════════════════════════════════════════ */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] pl-9 pr-3 py-2 text-[0.8rem] text-ivory rounded transition-colors placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
      />
    </div>
  );
}
