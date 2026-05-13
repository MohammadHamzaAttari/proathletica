'use client';

import { useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import type { Product } from '@/lib/types';

type FilterKey =
  | 'all'
  | 'small-apartments'
  | 'budget'
  | 'heavy-lifters'
  | 'smart-equipment'
  | 'compact-gear';

const FILTERS: Array<{
  key: FilterKey;
  label: string;
  hint: string;
  icon: string;
  match: (product: Product) => boolean;
}> = [
  {
    key: 'all',
    label: 'All Picks',
    hint: 'Full ranked list',
    icon: '⚡',
    match: () => true,
  },
  {
    key: 'small-apartments',
    label: 'Small Apartments',
    hint: 'Space-saving gear',
    icon: '🏠',
    match: (p) =>
      /compact|foldable|small footprint|space-saving/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
  {
    key: 'budget',
    label: 'Budget Picks',
    hint: 'Best value buys',
    icon: '💰',
    match: (p) =>
      /budget|value|affordable|entry|starter/i.test(
        [p.short_title, p.title, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ) || (p.price_cents || 0) <= 20000,
  },
  {
    key: 'heavy-lifters',
    label: 'Heavy Lifters',
    hint: 'High-load equipment',
    icon: '🏋️',
    match: (p) =>
      /heavy|garage|high load|durable|steel|pro/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
  {
    key: 'smart-equipment',
    label: 'Smart Equipment',
    hint: 'Connected training',
    icon: '📱',
    match: (p) =>
      /smart|app|bluetooth|connected/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
  {
    key: 'compact-gear',
    label: 'Compact Gear',
    hint: 'Portable & light',
    icon: '🎒',
    match: (p) =>
      /compact|portable|foldable|space-saving|small footprint/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
];

export function HomepageFilters({
  products,
  articleSlug,
  initialFilter = 'all',
}: {
  products: Product[];
  articleSlug: string;
  initialFilter?: FilterKey;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilter = (searchParams.get('focus') as FilterKey) || initialFilter || 'all';
  const activeFilterMeta = FILTERS.find(f => f.key === activeFilter);

  const setFilter = (nextFilter: FilterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilter === 'all') {
      params.delete('focus');
    } else {
      params.set('focus', nextFilter);
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const filteredProducts = useMemo(() => {
    const filter = FILTERS.find(f => f.key === activeFilter);
    return products.filter(p => (filter ? filter.match(p) : true));
  }, [activeFilter, products]);

  return (
    <div className="space-y-6">

      {/* ── FILTER PILL ROW ── */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="filtered-products-panel"
              onClick={() => setFilter(filter.key)}
              className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
            >
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">{filter.icon}</span>
                <span className="filter-pill__label">{filter.label}</span>
              </span>
              <span className="filter-pill__hint">{filter.hint}</span>
            </button>
          );
        })}
      </div>

      {/* ── RESULTS PANEL ── */}
      <div
        id="filtered-products-panel"
        role="tabpanel"
        aria-label={`Products filtered by: ${activeFilterMeta?.label || 'All'}`}
        className="space-y-6"
      >
        {/* Results header */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3">
            {/* Count badge */}
            <span
              className={`inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full text-xs font-black tabular-nums transition-all duration-300 ${
                isPending
                  ? 'bg-white/5 text-neutral-500'
                  : 'bg-data-lime/10 text-data-lime border border-data-lime/20'
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {isPending ? '…' : filteredProducts.length}
            </span>
            <span className="text-sm text-neutral-400">
              {filteredProducts.length === products.length
                ? 'products ranked'
                : `of ${products.length} products`}
            </span>
          </div>

          {/* Reset — only shown when filter is active */}
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors duration-150 focus-ring rounded px-2 py-1"
              aria-label="Clear filter and show all products"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Clear filter
            </button>
          )}
        </div>

        {/* Comparison at-a-glance table */}
        {filteredProducts.length > 1 && (
          <div className="overflow-hidden rounded-[1.25rem] border border-white/[0.05] bg-black/20">
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <span className="section-eyebrow">At a Glance</span>
            </div>
            <div className="p-4">
              <ComparisonTable
                products={filteredProducts}
                articleSlug={articleSlug}
                title=""
              />
            </div>
          </div>
        )}

        {/* Product cards grid */}
        <ProductGrid
          products={filteredProducts}
          articleSlug={articleSlug}
          isLoading={isPending}
          emptyFilterLabel={activeFilterMeta?.label}
        />
      </div>
    </div>
  );
}