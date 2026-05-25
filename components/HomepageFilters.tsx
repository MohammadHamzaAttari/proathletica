'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import { StickyCompareBar } from '@/components/StickyCompareBar';
import type { Product } from '@/lib/types';
import { SlidersHorizontal, X } from 'lucide-react';

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
    label: 'Apartments',
    hint: 'Sub-30 sq ft',
    icon: '🏠',
    match: (p) =>
      /compact|foldable|small footprint|space-saving/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
  {
    key: 'budget',
    label: 'Budget',
    hint: 'Under $200',
    icon: '💰',
    match: (p) =>
      /budget|value|affordable|entry|starter/i.test(
        [p.short_title, p.title, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ) || (p.price_cents || 0) <= 20000,
  },
  {
    key: 'heavy-lifters',
    label: 'Heavy Load',
    hint: 'Garage proof',
    icon: '🏋️',
    match: (p) =>
      /heavy|garage|high load|durable|steel|pro/i.test(
        [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean).join(' ')
      ),
  },
  {
    key: 'smart-equipment',
    label: 'Smart Gear',
    hint: 'Connected app',
    icon: '📱',
    match: (p) =>
      /smart|app|bluetooth|connected/i.test(
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pageSize = 12;
  const rawPage = Number.parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const activeFilter = (searchParams.get('focus') as FilterKey) || initialFilter || 'all';
  const activeFilterMeta = FILTERS.find(f => f.key === activeFilter);

  const setFilter = (nextFilter: FilterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilter === 'all') {
      params.delete('focus');
    } else {
      params.set('focus', nextFilter);
    }
    params.delete('page');
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete('page');
    else params.set('page', String(nextPage));
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const filteredProducts = useMemo(() => {
    const filter = FILTERS.find(f => f.key === activeFilter);
    return products.filter(p => (filter ? filter.match(p) : true));
  }, [activeFilter, products]);

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filteredProducts.slice(startIndex, endIndex);

  const selectedProducts = useMemo(
    () => filteredProducts.filter((p) => selectedIds.includes(p.id)),
    [filteredProducts, selectedIds]
  );

  return (
    <div className="space-y-8">

      {/* ── FILTER TABS ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
            <SlidersHorizontal className="w-3 h-3" />
            Filter by training focus
          </div>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-xs font-bold text-trust-blue hover:text-white transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        
        <div
          role="tablist"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(filter.key)}
                className={`group flex flex-col items-start p-4 rounded-inner border transition-all duration-200 ${
                  isActive 
                    ? 'border-data-lime bg-data-lime/10 shadow-[0_0_20px_rgba(198,255,61,0.08)]' 
                    : 'border-white/[0.06] bg-graphite-800 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true">{filter.icon}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-data-lime animate-pulse" />}
                </div>
                <div className={`text-xs font-black uppercase tracking-tight ${isActive ? 'text-data-lime' : 'text-offwhite'}`}>
                  {filter.label}
                </div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                  {filter.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="space-y-8 animate-cardIn">
        {/* Results Metadata */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              Showing
            </span>
            <span className="text-sm font-black text-data-lime tabular-nums">
              {isPending ? '...' : total ? `${startIndex + 1}–${endIndex}` : '0'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              of {filteredProducts.length} picks
            </span>
          </div>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* At a glance Comparison */}
        {filteredProducts.length > 1 && (
          <div className="space-y-4">
            <ComparisonTable
              products={filteredProducts}
              articleSlug={articleSlug}
              title={`${activeFilterMeta?.key === 'all' ? 'All Ranked' : activeFilterMeta?.label || 'Top'} Gear Compared`}
            />
          </div>
        )}

        {/* Product Cards */}
        <ProductGrid
          products={pageItems}
          articleSlug={articleSlug}
          isLoading={isPending}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          showCompareBar={false}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || isPending}
              className="cta-secondary w-auto px-5 text-xs disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Page <span className="text-offwhite tabular-nums">{currentPage}</span> /{' '}
              <span className="text-neutral-400 tabular-nums">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || isPending}
              className="cta-secondary w-auto px-5 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <StickyCompareBar
        selectedProducts={selectedProducts}
        onRemove={(id) => setSelectedIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setSelectedIds([])}
      />
    </div>
  );
}
