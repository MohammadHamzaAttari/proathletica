'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import { StickyCompareBar } from '@/components/StickyCompareBar';
import type { Product } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { X, Search as SearchIcon, Filter, ChevronDown } from 'lucide-react';

type FilterKey =
  | 'all'
  | 'small-apartments'
  | 'budget'
  | 'heavy-lifters'
  | 'smart-equipment'
  | 'compact-gear';

/**
 * Helper: build a searchable text blob from product fields.
 * Memoized callers should use this consistently.
 */
function productBlob(p: Product): string {
  return [
    p.short_title,
    p.title,
    p.raw_description,
    p.editorial_summary,
    p.description,
    p.brand,
    p.category,
    ...(p.best_for_tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Helper: test if blob contains ANY of the given phrases as whole-word or
 * word-start matches. Uses word boundaries so "app" doesn't match "apple".
 */
function hasWord(blob: string, words: string[]): boolean {
  return words.some((w) => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}`, 'i').test(blob);
  });
}

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
    hint: 'Compact & portable',
    icon: '🏠',
    match: (p) => {
      const blob = productBlob(p);
      // Broad but precise: compact/folding/portable/small/home-friendly
      return hasWord(blob, [
        'compact',
        'foldable',
        'folding',
        'fold',
        'portable',
        'lightweight',
        'small footprint',
        'space-saving',
        'space saving',
        'under desk',
        'travel',
        'stowable',
        'easy storage',
        'quiet',
        'silent',
      ]);
    },
  },
  {
    key: 'budget',
    label: 'Budget',
    hint: 'Under $100',
    icon: '💰',
    match: (p) => {
      // PRIMARY: price-based — under $100 is a true budget filter
      if (p.price_cents && p.price_cents > 0 && p.price_cents <= 10000) return true;
      // SECONDARY: explicit budget/value keywords in title or tags only (not summaries)
      const titleBlob = [
        p.short_title,
        p.title,
        ...(p.best_for_tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hasWord(titleBlob, ['budget', 'affordable', 'entry level', 'starter']);
    },
  },
  {
    key: 'heavy-lifters',
    label: 'Heavy Load',
    hint: 'Garage & pro',
    icon: '🏋️',
    match: (p) => {
      const blob = productBlob(p);
      // Precise: avoid matching "pro" in brand names or "durable" in generic copy
      return (
        hasWord(blob, [
          'heavy duty',
          'heavy-duty',
          'heavyweight',
          'power rack',
          'powerlifting',
          'olympic bar',
          'garage gym',
          'squat rack',
          'commercial grade',
          'commercial-grade',
          'power cage',
        ]) ||
        // Category-based match for heavy lifting categories
        /(powerlifting|weightlifting|crossfit|strength)/i.test(p.category || '') ||
        // High weight capacity is a strong signal
        /\b\d{3,}\s*lb/i.test(blob)
      );
    },
  },
  {
    key: 'smart-equipment',
    label: 'Smart Gear',
    hint: 'App & Bluetooth',
    icon: '📱',
    match: (p) => {
      const blob = productBlob(p);
      // Precise: require actual smart/connected features
      return hasWord(blob, [
        'smart',
        'bluetooth',
        'wifi-enabled',
        'app-connected',
        'app controlled',
        'app-controlled',
        'voice control',
        'heart rate monitor',
        'fitness tracker',
        'garmin',
        'wahoo',
        'connected fitness',
        'digital display',
        'led display',
        'lcd display',
        'peloton',
      ]);
    },
  },
];

/**
 * Clean a raw tag slug for display in the UI.
 * Converts "boxing-&-mma" → "Boxing & MMA", "home-gym" → "Home Gym"
 */
function cleanTagName(tag: string): string {
  return tag
    .replace(/-&-/g, ' & ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
   * Build URL from live browser search params to avoid stale reads.
   */
  const updateParams = useCallback((updates: Record<string, string | null>, resetPage = true) => {
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

    if (updates.tags !== undefined) current.delete('tag');

    if (resetPage) {
      current.delete('page');
    }

    const query = current.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  const setFilter = useCallback((nextFilter: FilterKey) => {
    updateParams({ focus: nextFilter === 'all' ? null : nextFilter });
    trackEvent('homepage_filter', { action: 'focus', value: nextFilter });
  }, [updateParams]);

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
        const blob = productBlob(product).toLowerCase();
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
   * Single source of truth: URL page param, clamped to valid range.
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
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const activeFilterLabel = [
    activeFilterMeta?.label,
    categoryFilter !== 'all' ? categoryFilter : null,
    brandFilter !== 'all' ? brandFilter : null,
    tagFilters.length > 0 ? tagFilters.map(cleanTagName).join(', ') : null,
    searchQuery ? `"${searchQuery}"` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const POPULAR_TAGS = useMemo(() => [
    'small-apartments',
    'budget',
    'heavy-lifters',
    'smart-equipment',
    'compact-gear',
  ], []);

  const toggleTag = useCallback((tag: string) => {
    const nextTags = new Set(tagFilters);
    if (nextTags.has(tag)) nextTags.delete(tag);
    else nextTags.add(tag);
    updateParams({ tags: Array.from(nextTags).join(',') });
    trackEvent('homepage_filter', { action: 'tag', value: tag, selected: nextTags.has(tag) });
  }, [tagFilters, updateParams]);

  const activeChips = useMemo(() => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];

    if (activeFilter !== 'all') {
      chips.push({
        label: `Focus: ${activeFilterMeta?.label}`,
        onRemove: () => setFilter('all'),
      });
    }
    if (categoryFilter !== 'all') {
      chips.push({
        label: `Category: ${categoryFilter}`,
        onRemove: () => updateParams({ category: 'all' }),
      });
    }
    if (brandFilter !== 'all') {
      chips.push({
        label: `Brand: ${brandFilter}`,
        onRemove: () => updateParams({ brand: 'all' }),
      });
    }
    tagFilters.forEach((tag) => {
      chips.push({
        label: cleanTagName(tag),
        onRemove: () => toggleTag(tag),
      });
    });
    if (Number.isFinite(minPrice)) {
      chips.push({
        label: `Min: $${minPrice}`,
        onRemove: () => updateParams({ minPrice: null }),
      });
    }
    if (Number.isFinite(maxPrice)) {
      chips.push({
        label: `Max: $${maxPrice}`,
        onRemove: () => updateParams({ maxPrice: null }),
      });
    }
    if (searchQuery) {
      chips.push({
        label: `"${searchQuery}"`,
        onRemove: () => updateParams({ q: null }),
      });
    }

    return chips;
  }, [activeFilter, activeFilterMeta, categoryFilter, brandFilter, tagFilters, minPrice, maxPrice, searchQuery, updateParams, setFilter, toggleTag]);

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.has(product.id)),
    [products, selectedIds]
  );

  const updateSelection = (next: Set<string>) => {
    setSelectedIds(new Set(next));
  };

  const renderFilterContent = () => (
    <div className="space-y-8">
      {/* ── SEARCH (Mobile only) ── */}
      <div className="lg:hidden space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Search</div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="search"
            placeholder="Search gear..."
            value={searchQuery}
            onChange={(e) => updateParams({ q: e.target.value })}
            className="h-10 w-full rounded-lg border border-white/10 bg-graphite-900 pl-9 pr-3 text-xs text-offwhite focus:border-data-lime/50 focus:outline-none"
          />
        </div>
      </div>

      {/* ── FOCUS FILTERS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Training Focus</div>
          {activeFilter !== 'all' && (
            <button onClick={() => setFilter('all')} className="text-[10px] font-bold text-trust-blue">Reset</button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => {
                  setFilter(filter.key);
                  setIsMobileFiltersOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-data-lime bg-data-lime/10 text-data-lime'
                    : 'border-white/[0.06] bg-graphite-800 text-offwhite hover:border-white/20'
                }`}
              >
                <span className="text-xl">{filter.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-tight">{filter.label}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{filter.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CATEGORY ── */}
      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Category</div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => updateParams({ category: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-graphite-900 px-4 text-xs font-bold text-offwhite focus:border-data-lime/50 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* ── PRICE RANGE ── */}
      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Price Range</div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={Number.isFinite(minPrice) ? String(minPrice) : ''}
            onChange={(e) => updateParams({ minPrice: e.target.value })}
            className="h-10 rounded-lg border border-white/10 bg-graphite-900 px-3 text-xs text-offwhite focus:border-data-lime/50 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max $"
            value={Number.isFinite(maxPrice) ? String(maxPrice) : ''}
            onChange={(e) => updateParams({ maxPrice: e.target.value })}
            className="h-10 rounded-lg border border-white/10 bg-graphite-900 px-3 text-xs text-offwhite focus:border-data-lime/50 focus:outline-none"
          />
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Brands</div>
        <div className="relative">
          <select
            value={brandFilter}
            onChange={(e) => updateParams({ brand: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-graphite-900 px-4 text-xs font-bold text-offwhite focus:border-data-lime/50 focus:outline-none"
          >
            <option value="all">All Brands</option>
            {brandOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* ── TAGS ── */}
      {tagOptions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Best For</div>
            {tagFilters.length > 0 && (
              <button onClick={() => updateParams({ tags: null })} className="text-[10px] font-bold text-trust-blue">Clear</button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(showAllTags ? tagOptions : tagOptions.slice(0, 20)).map((tag) => {
              const isActive = tagFilters.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isActive ? 'border-data-lime bg-data-lime/15 text-data-lime' : 'border-white/10 text-neutral-500 hover:text-offwhite'
                  }`}
                >
                  {cleanTagName(tag)}
                </button>
              );
            })}
          </div>
          {tagOptions.length > 20 && (
            <button onClick={() => setShowAllTags(!showAllTags)} className="text-[10px] font-bold text-trust-blue">
              {showAllTags ? 'Show less' : `+ ${tagOptions.length - 20} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* ── SIDEBAR FILTERS (Desktop) ── */}
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-data-lime" />
          <h2 className="text-sm font-black uppercase tracking-widest text-offwhite">Refine Picks</h2>
        </div>
        {renderFilterContent()}
      </aside>

      <div className="flex-1 w-full space-y-8 min-w-0">
        {/* ── COMPACT TOP BAR ── */}
        <div className="sticky top-20 z-30 filter-bar">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="search"
              placeholder="Search gear, brands, or goals..."
              value={searchQuery}
              onChange={(e) => updateParams({ q: e.target.value })}
              className="h-10 w-full rounded-lg border border-white/10 bg-graphite-900/50 pl-9 pr-3 text-xs text-offwhite focus:border-data-lime/50 focus:outline-none"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="h-10 appearance-none rounded-lg border border-white/10 bg-graphite-900/50 pl-3 pr-8 text-xs font-bold text-offwhite focus:border-data-lime/50 focus:outline-none"
            >
              <option value="rank">Editor Rank</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="reviews-desc">Most Reviewed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500 pointer-events-none" />
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-lg bg-data-lime text-black font-black uppercase tracking-widest text-[10px] hover:shadow-glow-lime transition-all"
          >
            <Filter className="w-3 h-3" />
            <span>Filters</span>
          </button>
        </div>

        {/* ── POPULAR GOALS ── */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mr-2">Popular Goals:</span>
          {POPULAR_TAGS.map((tag) => {
            const isActive = tagFilters.includes(tag) || activeFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  if (FILTERS.some(f => f.key === tag)) {
                     setFilter(tag as FilterKey);
                  } else {
                     toggleTag(tag);
                  }
                }}
                className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight transition-all ${
                  isActive
                    ? 'border-data-lime bg-data-lime/15 text-data-lime'
                    : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-offwhite'
                }`}
              >
                {cleanTagName(tag)}
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE CHIPS ── */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mr-1">Active:</span>
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.onRemove}
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-data-lime/30 bg-data-lime/5 text-[10px] font-bold text-data-lime hover:border-data-lime hover:bg-data-lime/10 transition-all"
              >
                {chip.label}
                <X className="w-3 h-3 text-data-lime/50 group-hover:text-data-lime" />
              </button>
            ))}
            <button
              onClick={() => updateParams({
                focus: null,
                category: null,
                brand: null,
                tags: null,
                q: null,
                minPrice: null,
                maxPrice: null
              })}
              className="text-[10px] font-bold text-neutral-500 hover:text-offwhite transition-colors underline underline-offset-4"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── MOBILE/DRAWER FILTER ── */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-[100] flex justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-[90%] max-w-sm bg-graphite-950 shadow-2xl p-6 overflow-y-auto border-r border-white/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="text-lg font-black uppercase tracking-tighter text-offwhite">Advanced Filters</div>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-neutral-400 hover:text-offwhite">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {renderFilterContent()}
                <div className="sticky bottom-0 mt-10 pt-4 bg-graphite-950/80 backdrop-blur-md">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full h-14 rounded-xl bg-data-lime text-black font-black uppercase tracking-widest text-sm shadow-glow-lime"
                  >
                    Apply & Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── RESULTS ── */}
        <div className="space-y-8 w-full">
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

          {/* At a glance Comparison - MOVED BELOW PRODUCT CARDS per user request */}
          {filteredProducts.length > 1 && (
            <div className="space-y-4 py-8 border-t border-white/[0.06]">
              <ComparisonTable
                products={filteredProducts.slice(0, 10)}
                articleSlug={articleSlug}
                title={`${activeFilterMeta?.key === 'all' ? 'All Ranked' : activeFilterMeta?.label || 'Top'} Gear Compared`}
              />
            </div>
          )}

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
                        className={`h-9 w-9 rounded-full border text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? 'border-data-lime bg-data-lime/20 text-data-lime shadow-[0_0_15px_rgba(198,255,61,0.3)] scale-110 z-10'
                            : 'border-white/[0.08] text-neutral-400 hover:border-data-lime/30 hover:text-offwhite hover:shadow-[0_0_10px_rgba(198,255,61,0.1)]'
                        }`}
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
    </div>
  );
}
