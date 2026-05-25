'use client';

import { useMemo, useState, useEffect, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import type { Product } from '@/lib/types';
import { SlidersHorizontal, X, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterKey =
  | 'all'
  | 'small-apartments'
  | 'budget'
  | 'heavy-lifters'
  | 'smart-equipment';

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

const ITEMS_PER_PAGE = 6;

type SortKey = 'rank' | 'price-asc' | 'price-desc' | 'reviews' | 'rating';

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

  // Search, Sort, and Pagination local states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rank');
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilter = (searchParams.get('focus') as FilterKey) || initialFilter || 'all';
  const activeFilterMeta = FILTERS.find((f) => f.key === activeFilter);

  // Reset page to 1 whenever filters, search, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, sortBy]);

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

  // 1. Process Filter + Search + Sort
  const processedProducts = useMemo(() => {
    // A. Filter by Lifestyle Focus
    const filter = FILTERS.find((f) => f.key === activeFilter);
    let list = products.filter((p) => (filter ? filter.match(p) : true));

    // B. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        [p.title, p.short_title, p.brand, p.category, p.editorial_summary, ...(p.best_for_tags || [])]
          .filter(Boolean)
          .some((field) => typeof field === 'string' && field.toLowerCase().includes(q))
      );
    }

    // C. Sort results
    list = [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price_cents || 0) - (b.price_cents || 0);
      if (sortBy === 'price-desc') return (b.price_cents || 0) - (a.price_cents || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // Default: rank (ascending)
      return (a.rank || 999) - (b.rank || 999);
    });

    return list;
  }, [activeFilter, searchQuery, sortBy, products]);

  // 2. Paginate processed products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / ITEMS_PER_PAGE));

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    // Smooth scroll back to top of filter section
    const el = document.getElementById('top-picks');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* ── FILTER & SEARCH CONTROLS BAR ── */}
      <div className="flex flex-col gap-6">
        {/* Row 1: Search & Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dynamic Search Box */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-500" />
            </span>
            <input
              type="text"
              placeholder="Search by keyword, brand, or feature (e.g. barbell, leather, adjustable)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-white/[0.08] bg-black/40 text-sm text-offwhite placeholder-neutral-500 focus:outline-none focus:border-data-lime/45 focus:ring-1 focus:ring-data-lime/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-offwhite"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-neutral-500" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-white/[0.08] bg-black/40 text-sm text-offwhite focus:outline-none focus:border-data-lime/45 focus:ring-1 focus:ring-data-lime/30 transition-all appearance-none cursor-pointer"
            >
              <option value="rank">Sort by Editor Rank</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="reviews">Popularity (Most Reviews)</option>
              <option value="rating">Rating (Highest Rated)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-500">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Row 2: Lifestyle Focus TABS */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              <SlidersHorizontal className="w-3 h-3" />
              Filter by lifestyle focus
            </div>
            {(activeFilter !== 'all' || searchQuery || sortBy !== 'rank') && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                  setSortBy('rank');
                }}
                className="text-xs font-bold text-trust-blue hover:text-white transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          <div role="tablist" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                    <span
                      className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                      aria-hidden="true"
                    >
                      {filter.icon}
                    </span>
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
              {isPending ? '...' : processedProducts.length}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              picks matched
            </span>
          </div>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* At a glance Comparison Table (Limited to top matches in filter for clean UX) */}
        {processedProducts.length > 1 && (
          <div className="space-y-4">
            <ComparisonTable
              products={processedProducts.slice(0, 10)}
              articleSlug={articleSlug}
              title={`${activeFilterMeta?.key === 'all' ? 'All Ranked' : activeFilterMeta?.label || 'Top'} Gear compared`}
            />
            {processedProducts.length > 10 && (
              <p className="text-2xs text-neutral-500 text-center uppercase tracking-widest font-semibold">
                * Comparison matrix displays top 10 ranked products for optimal scannability.
              </p>
            )}
          </div>
        )}

        {/* Product Cards Grid (PAGINATED) */}
        <ProductGrid
          products={paginatedProducts}
          articleSlug={articleSlug}
          isLoading={isPending}
        />

        {/* ── PAGINATION CONTROLS BAR ── */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              Showing page <span className="text-offwhite font-bold">{currentPage}</span> of{' '}
              <span className="text-offwhite font-bold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-white/[0.06] bg-graphite-800 text-neutral-400 hover:text-offwhite hover:border-white/20 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/[0.06] transition"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-data-lime text-black font-black shadow-[0_4px_12px_rgba(198,255,61,0.25)]'
                        : 'border border-white/[0.06] bg-graphite-800 text-neutral-400 hover:text-offwhite hover:border-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-white/[0.06] bg-graphite-800 text-neutral-400 hover:text-offwhite hover:border-white/20 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/[0.06] transition"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}