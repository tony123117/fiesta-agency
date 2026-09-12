import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ACTIONS = [
  { label: 'Add Event', to: '/admin/events/new', primary: true },
  { label: 'New Booking', to: '/admin/bookings', primary: false },
  { label: 'Upload Media', to: '/admin/media', primary: false },
  { label: 'Edit Website', to: '/admin/pages', primary: false },
];

export function QuickActions() {
  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">
        QUICK ACTIONS
      </p>
      <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`group flex items-center justify-between p-4 md:p-5 transition-colors duration-200 ${
              action.primary
                ? 'bg-gold/[0.06] hover:bg-gold/[0.1]'
                : 'bg-obsidian hover:bg-white/[0.015]'
            }`}
          >
            <span className={`text-[0.75rem] font-medium ${action.primary ? 'text-gold' : 'text-white/50 group-hover:text-white/70'} transition-colors duration-200`}>
              {action.label}
            </span>
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className={`${action.primary ? 'text-gold/50' : 'text-white/15'} group-hover:text-gold/60 transition-all duration-300 group-hover:translate-x-0.5`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
