'use client';

import { useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'All', icon: '📊' },
  { id: 'under50', label: 'Under $50', icon: '💰' },
  { id: 'bestvalue', label: "Best Value", icon: '🏆' },
  { id: 'apartment', label: 'Small Spaces', icon: '🏠' },
  { id: 'highestrated', label: 'Highest Rated', icon: '⭐' },
  { id: 'editors', label: "Editor's Pick", icon: '✍️' },
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
    <div className="flex flex-wrap gap-3 pb-8">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilter(filter.id)}
          className={`inline-flex items-center gap-2 rounded-3xl border px-6 py-3 text-sm font-medium transition-all ${
            activeFilter === filter.id
              ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 text-[#C6FF3D]'
              : 'border-white/10 bg-[#161B22] text-neutral-400 hover:border-white/30 hover:text-offwhite'
          }`}
        >
          <span>{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
