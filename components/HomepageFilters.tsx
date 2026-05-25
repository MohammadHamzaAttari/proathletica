'use client';

import { useEffect, useMemo, useState, useTransition, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import { StickyCompareBar } from '@/components/StickyCompareBar';
import type { Product } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const activeFilter = (searchParams.get('focus') as FilterKey) || initialFilter || 'all';
  const searchQuery = (searchParams.get('q') || '').trim();
  const categoryFilter = searchParams.get('category') || 'all';
  const brandFilter = searchParams.get('brand') || 'all';
  const tagParam = searchParams.get('tags') || searchParams.get('tag') || '';
  const tagFilters = tagParam.split(',').map((value) => value.trim()).filter(Boolean);
  const sortBy = searchParams.get('sort') || 'rank';
  const pageSize = Math.max(6, Math.min(24, Number.parseInt(searchParams.get('pageSize') || '9', 10) || 9));
  const pageParam = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  const minPrice = Number.parseInt(searchParams.get('minPrice') || '', 10);
  const maxPrice = Number.parseInt(searchParams.get('maxPrice') || '', 10);
  const minRating = Number.parseFloat(searchParams.get('minRating') || '');

  const activeFilterMeta = FILTERS.find(f => f.key === activeFilter);

  /**
   * FIX: Build the URL from current live searchParams snapshot.
   * We read searchParams inside the callback so we always operate
   * on the latest URL state, even during rapid successive clicks.
   */
  const updateParams = useCallback((updates: Record<string, string | null>, resetPage = true) => {
    // Read a FRESH snapshot of current URL search params.
    // `searchParams` from the hook can be stale within the same
    // render batch when multiple updates fire quickly.
    const current = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : searchParams.toString()
    );

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    // Normalize tag/tags param names
    if (updates.tags !== undefined) current.delete('tag');

    // FIX: Always remove the page param when any non-page filter changes
    // so the user lands on page 1 with fresh results.
    if (resetPage) {
      current.delete('page');
    }

    const query = current.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  const setFilter = (nextFilter: FilterKey) => {
    updateParams({ focus: nextFilter === 'all' ? null : nextFilter });
    trackEvent('homepage_filter', { action: 'focus', value: nextFilter });
  };

  const setPage = useCallback((nextPage: number) => {
    const safePage = Math.max(1, nextPage);
    updateParams({ page: safePage === 1 ? null : String(safePage) }, false);
    trackEvent('homepage_filter', { action: 'pagination', value: safePage });
  }, [updateParams]);

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.category) unique.add(product.category);
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const brandOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.brand) unique.add(product.brand);
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const tagOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      (product.best_for_tags || []).forEach((tag) => unique.add(tag));
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filter = FILTERS.find(f => f.key === activeFilter);
    const query = searchQuery.toLowerCase();
    const minPriceCents = Number.isFinite(minPrice) ? minPrice * 100 : null;
    const maxPriceCents = Number.isFinite(maxPrice) ? maxPrice * 100 : null;
    const ratingFloor = Number.isFinite(minRating) ? minRating : null;
    const hasTags = tagFilters.length > 0;

    return products.filter((product) => {
      if (filter && !filter.match(product)) return false;
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      if (brandFilter !== 'all' && product.brand !== brandFilter) return false;
      if (hasTags && !tagFilters.some((tag) => (product.best_for_tags || []).includes(tag))) return false;
      if (query) {
        const blob = [
          product.title,
          product.short_title,
          product.editorial_summary,
          product.raw_description,
          product.description,
          product.brand,
          product.category,
          ...(product.best_for_tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!blob.includes(query)) return false;
      }
      const priceCents = product.price_cents ?? null;
      if (minPriceCents !== null && (!priceCents || priceCents < minPriceCents)) return false;
      if (maxPriceCents !== null && (!priceCents || priceCents > maxPriceCents)) return false;
      if (ratingFloor !== null && (!product.rating || product.rating < ratingFloor)) return false;
      return true;
    });
  }, [activeFilter, brandFilter, categoryFilter, maxPrice, minPrice, minRating, products, searchQuery, tagFilters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    const byRank = (a: Product, b: Product) => (a.rank || 0) - (b.rank || 0);
    const byPriceAsc = (a: Product, b: Product) => {
      const aPrice = a.price_cents ?? Number.MAX_SAFE_INTEGER;
      const bPrice = b.price_cents ?? Number.MAX_SAFE_INTEGER;
      return aPrice - bPrice;
    };
    const byPriceDesc = (a: Product, b: Product) => {
      const aPrice = a.price_cents ?? 0;
      const bPrice = b.price_cents ?? 0;
      return bPrice - aPrice;
    };
    const byRating = (a: Product, b: Product) => (b.rating || 0) - (a.rating || 0);
    const byReviews = (a: Product, b: Product) => (b.review_count || 0) - (a.review_count || 0);
    const byUpdated = (a: Product, b: Product) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();

    switch (sortBy) {
      case 'price-asc':
        sorted.sort(byPriceAsc);
        break;
      case 'price-desc':
        sorted.sort(byPriceDesc);
        break;
      case 'rating-desc':
        sorted.sort(byRating);
        break;
      case 'reviews-desc':
        sorted.sort(byReviews);
        break;
      case 'newest':
        sorted.sort(byUpdated);
        break;
      default:
        sorted.sort(byRank);
        break;
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const totalResults = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  /**
   * FIX: Derive current page entirely from URL params.
   * Clamp to valid range so stale/out-of-range values are handled gracefully.
   * Removed the `pageOverride` state that caused a race condition:
   *   - When filters changed, updateParams deleted `page` from the URL
   *     but pageOverride kept its old value (e.g. 3).
   *   - resolvedPage = pageOverride ?? pageParam resolved to the stale 3
   *     instead of falling back to 1.
   * Now there is a single source of truth: the URL.
   */
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const pagedProducts = sortedProducts.slice(startIndex, endIndex);

  const rangeStart = totalResults === 0 ? 0 : startIndex + 1;
  const rangeEnd = totalResults === 0 ? 0 : endIndex;

  const paginationPages = useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const activeFilterLabel = [
    activeFilterMeta?.label,
    categoryFilter !== 'all' ? categoryFilter : null,
    brandFilter !== 'all' ? brandFilter : null,
    tagFilters.length > 0 ? tagFilters.join(', ') : null,
    searchQuery ? `"${searchQuery}"` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.has(product.id)),
    [products, selectedIds]
  );

  const updateSelection = (next: Set<string>) => {
    setSelectedIds(new Set(next));
  };

  const toggleTag = (tag: string) => {
    const nextTags = new Set(tagFilters);
    if (nextTags.has(tag)) nextTags.delete(tag);
    else nextTags.add(tag);
    updateParams({ tags: Array.from(nextTags).join(',') });
    trackEvent('homepage_filter', { action: 'tag', value: tag, selected: nextTags.has(tag) });
  };

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
              <X className="w-3 h-3" />
              Reset
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

      {/* ── ADVANCED FILTERS ── */}
      <div className="rounded-card border border-white/[0.06] bg-graphite-800/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Advanced filters</div>
          {(searchQuery || categoryFilter !== 'all' || brandFilter !== 'all' || tagFilters.length > 0 || Number.isFinite(minPrice)
            || Number.isFinite(maxPrice) || Number.isFinite(minRating) || sortBy !== 'rank') && (
            <button
              onClick={() => {
                updateParams({ q: null, category: null, brand: null, tags: null, minPrice: null, maxPrice: null, minRating: null, sort: null });
                trackEvent('homepage_filter', { action: 'clear_all' });
              }}
              className="text-xs font-bold text-trust-blue hover:text-white transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Search
            <input
              type="search"
              placeholder="Search gear, brands, tags"
              value={searchQuery}
              onChange={(event) => updateParams({ q: event.target.value })}
              onBlur={(event) => {
                if (event.target.value.trim()) {
                  trackEvent('homepage_filter', { action: 'search', value: event.target.value.trim() });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchQuery.trim()) {
                  trackEvent('homepage_filter', { action: 'search', value: searchQuery.trim() });
                }
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite placeholder:text-neutral-600 focus:border-data-lime/60 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Category
            <select
              value={categoryFilter}
              onChange={(event) => {
                updateParams({ category: event.target.value });
                trackEvent('homepage_filter', { action: 'category', value: event.target.value });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite focus:border-data-lime/60 focus:outline-none"
            >
              <option value="all">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Brand
            <select
              value={brandFilter}
              onChange={(event) => {
                updateParams({ brand: event.target.value });
                trackEvent('homepage_filter', { action: 'brand', value: event.target.value });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite focus:border-data-lime/60 focus:outline-none"
            >
              <option value="all">All brands</option>
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Min price
            <input
              type="number"
              min={0}
              placeholder="0"
              value={Number.isFinite(minPrice) ? String(minPrice) : ''}
              onChange={(event) => {
                updateParams({ minPrice: event.target.value });
                trackEvent('homepage_filter', { action: 'min_price', value: event.target.value || '0' });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite placeholder:text-neutral-600 focus:border-data-lime/60 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Max price
            <input
              type="number"
              min={0}
              placeholder="600"
              value={Number.isFinite(maxPrice) ? String(maxPrice) : ''}
              onChange={(event) => {
                updateParams({ maxPrice: event.target.value });
                trackEvent('homepage_filter', { action: 'max_price', value: event.target.value || '0' });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite placeholder:text-neutral-600 focus:border-data-lime/60 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Min rating
            <select
              value={Number.isFinite(minRating) ? String(minRating) : 'all'}
              onChange={(event) => {
                updateParams({ minRating: event.target.value === 'all' ? null : event.target.value });
                trackEvent('homepage_filter', { action: 'min_rating', value: event.target.value });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite focus:border-data-lime/60 focus:outline-none"
            >
              <option value="all">Any rating</option>
              <option value="4.8">4.8+ stars</option>
              <option value="4.6">4.6+ stars</option>
              <option value="4.4">4.4+ stars</option>
              <option value="4.2">4.2+ stars</option>
            </select>
          </label>
        </div>

        {tagOptions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Best for tags</span>
              {tagFilters.length > 0 && (
                <button
                  onClick={() => {
                    updateParams({ tags: null });
                    trackEvent('homepage_filter', { action: 'tags_clear' });
                  }}
                  className="text-xs font-bold text-trust-blue hover:text-white transition-colors"
                >
                  Clear tags
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const isActive = tagFilters.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-pill border px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'border-data-lime bg-data-lime/15 text-data-lime' : 'border-white/[0.08] text-neutral-400 hover:border-white/20 hover:text-offwhite'}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => {
                updateParams({ sort: event.target.value });
                trackEvent('homepage_filter', { action: 'sort', value: event.target.value });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite focus:border-data-lime/60 focus:outline-none"
            >
              <option value="rank">Editor rank</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Highest rated</option>
              <option value="reviews-desc">Most reviewed</option>
              <option value="newest">Recently updated</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            Results per page
            <select
              value={String(pageSize)}
              onChange={(event) => {
                updateParams({ pageSize: event.target.value });
                trackEvent('homepage_filter', { action: 'page_size', value: event.target.value });
              }}
              className="h-11 rounded-inner border border-white/[0.08] bg-graphite-900 px-3 text-sm font-semibold text-offwhite focus:border-data-lime/60 focus:outline-none"
            >
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="18">18</option>
            </select>
          </label>
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
              {isPending ? '...' : totalResults}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              of {products.length} picks
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
          products={pagedProducts}
          articleSlug={articleSlug}
          isLoading={isPending}
          emptyFilterLabel={activeFilterLabel || activeFilterMeta?.label}
          rankOffset={startIndex}
          selectedIds={selectedIds}
          onSelectedIdsChange={updateSelection}
          showCompareBar={false}
        />

        <StickyCompareBar
          selectedProducts={selectedProducts}
          onRemove={(id) => {
            const next = new Set(selectedIds);
            next.delete(id);
            updateSelection(next);
          }}
          onClear={() => updateSelection(new Set())}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="relative z-[55] pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-pill border border-white/[0.06] bg-graphite-900/60 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Showing {rangeStart}–{rangeEnd} of {totalResults}
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-9 px-3 rounded-pill border border-white/[0.08] text-xs font-bold uppercase tracking-widest text-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 hover:text-offwhite"
              >
                Prev
              </button>
              <div className="flex items-center gap-1">
                {paginationPages[0] > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      className="h-9 w-9 rounded-full border border-white/[0.08] text-xs font-bold text-neutral-400 hover:border-white/20 hover:text-offwhite"
                    >
                      1
                    </button>
                    <span className="text-xs font-bold text-neutral-500 px-1">...</span>
                  </>
                )}
                {paginationPages.map((pageNumber) => {
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`h-9 w-9 rounded-full border text-xs font-bold ${isActive ? 'border-data-lime bg-data-lime/15 text-data-lime' : 'border-white/[0.08] text-neutral-400 hover:border-white/20 hover:text-offwhite'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {paginationPages[paginationPages.length - 1] < totalPages && (
                  <>
                    <span className="text-xs font-bold text-neutral-500 px-1">...</span>
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className="h-9 w-9 rounded-full border border-white/[0.08] text-xs font-bold text-neutral-400 hover:border-white/20 hover:text-offwhite"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-9 px-3 rounded-pill border border-white/[0.08] text-xs font-bold uppercase tracking-widest text-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 hover:text-offwhite"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
