'use client';

import { useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'All Picks', icon: '📊' },
  { id: 'under50', label: 'Under $50', icon: '💰' },
  { id: 'bestvalue', label: "Best Value", icon: '🏆' },
  { id: 'apartment', label: 'Compact', icon: '🏠' },
  { id: 'highestrated', label: 'Highest Rated', icon: '⭐' },
  { id: 'editors', label: "Top Pick", icon: '✍️' },
];

interface QuickFiltersProps {
  onFilterChange?: (filter: string) => void;
}

export function QuickFilters({ onFilterChange }: QuickFiltersProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilter = (id: string) => {
    setActiveFilter(id);
    onFilterChange?.(id);
  };

  return (
    <div className="flex flex-wrap gap-2 pb-8">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilter(filter.id)}
          className={`group inline-flex items-center gap-2 rounded-pill border px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
            activeFilter === filter.id
              ? 'border-data-lime bg-data-lime/10 text-data-lime shadow-[0_0_15px_rgba(198,255,61,0.1)]'
              : 'border-white/[0.08] bg-graphite-800 text-neutral-400 hover:border-white/20 hover:text-offwhite hover:bg-white/[0.03]'
          }`}
        >
          <span className={`text-base transition-transform group-hover:scale-110 ${activeFilter === filter.id ? 'scale-110' : ''}`} aria-hidden="true">
            {filter.icon}
          </span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
