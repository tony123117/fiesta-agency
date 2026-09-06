import { Search, ChevronDown } from 'lucide-react';

interface ServiceFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  publishedFilter: string;
  onPublishedFilterChange: (v: string) => void;
  featuredFilter: string;
  onFeaturedFilterChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
}

export function ServiceFilters({
  search, onSearchChange,
  publishedFilter, onPublishedFilterChange,
  featuredFilter, onFeaturedFilterChange,
  sortBy, onSortChange,
}: ServiceFiltersProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search services..."
          className="w-full bg-white/[0.04] border border-white/[0.08] pl-9 pr-3 py-2 text-[0.8rem] text-ivory rounded transition-colors placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          value={publishedFilter}
          onChange={onPublishedFilterChange}
          options={[
            { value: 'all', label: 'All Visibility' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ]}
        />
        <SelectFilter
          value={featuredFilter}
          onChange={onFeaturedFilterChange}
          options={[
            { value: 'all', label: 'All Services' },
            { value: 'featured', label: 'Featured' },
            { value: 'not_featured', label: 'Not Featured' },
          ]}
        />

        <div className="hidden sm:block w-px h-5 bg-white/[0.06] mx-1" />

        <SelectFilter
          value={sortBy}
          onChange={onSortChange}
          options={[
            { value: 'sort_order_asc', label: 'Order ↑' },
            { value: 'sort_order_desc', label: 'Order ↓' },
            { value: 'created_at_desc', label: 'Newest First' },
            { value: 'created_at_asc', label: 'Oldest First' },
            { value: 'title_asc', label: 'A → Z' },
            { value: 'title_desc', label: 'Z → A' },
          ]}
        />
      </div>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white/[0.04] border border-white/[0.08] pl-3 pr-7 py-1.5 text-[0.7rem] text-white/60 rounded cursor-pointer focus:border-gold/40 focus:outline-none transition-colors hover:border-white/[0.15]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
    </div>
  );
}
