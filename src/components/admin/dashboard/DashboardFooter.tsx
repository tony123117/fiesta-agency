import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function DashboardFooter() {
  return (
    <div className="mt-16 md:mt-20 pt-6 border-t border-white/[0.04]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/15">
            FIESTA CMS
          </p>
          <p className="text-[0.6rem] text-white/10 mt-0.5">
            System operational
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[0.55rem] text-white/10">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-[0.55rem] text-white/15 hover:text-gold/40 transition-colors"
          >
            View website <ArrowRight size={9} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
