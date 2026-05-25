'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QuickFilters } from '@/components/QuickFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { StickyCompareBar } from '@/components/StickyCompareBar';
import type { Product } from '@/lib/types';
import { Search } from 'lucide-react';

type FilterKey = 'all' | 'under50' | 'bestvalue' | 'apartment' | 'highestrated' | 'editors';
type SortKey = 'rank' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';

function clampInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function textBlob(product: Product) {
  return [
    product.short_title,
    product.title,
    product.brand,
    product.category,
    product.subcategory,
    product.description,
    product.raw_description,
    product.editorial_summary,
    product.keyword,
    ...(product.best_for_tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function CategoryProductList({
  products,
  articleSlug,
  pageSize = 18,
}: {
  products: Product[];
  articleSlug: string;
  pageSize?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilter = (searchParams.get('filter') as FilterKey) || 'all';
  const activeSort = (searchParams.get('sort') as SortKey) || 'rank';
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const page = clampInt(searchParams.get('page'), 1);

  const [searchValue, setSearchValue] = useState(q);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const setFilter = (next: FilterKey) =>
    updateParams((params) => {
      if (next === 'all') params.delete('filter');
      else params.set('filter', next);
      params.delete('page');
    });

  const setSort = (next: SortKey) =>
    updateParams((params) => {
      if (next === 'rank') params.delete('sort');
      else params.set('sort', next);
      params.delete('page');
    });

  const setPage = (nextPage: number) =>
    updateParams((params) => {
      if (nextPage <= 1) params.delete('page');
      else params.set('page', String(nextPage));
    });

  const applySearch = () =>
    updateParams((params) => {
      const next = searchValue.trim();
      if (!next) params.delete('q');
      else params.set('q', next);
      params.delete('page');
    });

  const filteredProducts = useMemo(() => {
    let items = products;

    if (q) {
      items = items.filter((p) => textBlob(p).includes(q));
    }

    if (activeFilter === 'under50') {
      items = items.filter((p) => (p.price_cents ?? Number.POSITIVE_INFINITY) <= 5000);
    } else if (activeFilter === 'bestvalue') {
      items = items.filter((p) => {
        const badge = (p.badge || '').toLowerCase();
        if (badge.includes('value')) return true;
        const priceOk = (p.price_cents ?? Number.POSITIVE_INFINITY) <= 20000;
        const ratingOk = (p.rating ?? 0) >= 4.5;
        const reviewsOk = (p.review_count ?? 0) >= 500;
        return priceOk && ratingOk && reviewsOk;
      });
    } else if (activeFilter === 'apartment') {
      items = items.filter((p) =>
        /compact|foldable|small footprint|space-saving/i.test(
          [p.short_title, p.title, p.raw_description, p.editorial_summary, ...(p.best_for_tags || [])]
            .filter(Boolean)
            .join(' ')
        )
      );
    } else if (activeFilter === 'editors') {
      items = items.filter((p) => {
        const badge = (p.badge || '').toLowerCase();
        return Boolean(p.is_featured) || badge.includes('editor') || badge.includes('best overall') || badge.includes('top pick');
      });
    }

    const sortKey: SortKey = activeFilter === 'highestrated' ? 'rating-desc' : activeSort;

    const sorted = [...items];
    if (sortKey === 'price-asc') {
      sorted.sort((a, b) => (a.price_cents ?? Number.POSITIVE_INFINITY) - (b.price_cents ?? Number.POSITIVE_INFINITY));
    } else if (sortKey === 'price-desc') {
      sorted.sort((a, b) => (b.price_cents ?? Number.NEGATIVE_INFINITY) - (a.price_cents ?? Number.NEGATIVE_INFINITY));
    } else if (sortKey === 'rating-desc') {
      sorted.sort((a, b) => (b.rating ?? Number.NEGATIVE_INFINITY) - (a.rating ?? Number.NEGATIVE_INFINITY));
    } else if (sortKey === 'title-asc') {
      sorted.sort((a, b) => (a.short_title || a.title).localeCompare(b.short_title || b.title));
    } else {
      sorted.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    }

    return sorted;
  }, [products, q, activeFilter, activeSort]);

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
    <div className="space-y-10">
      {/* Controls */}
      <div className="grid gap-6">
        <form
          className="flex flex-col sm:flex-row gap-3 sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            applySearch();
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search within this category…"
              className="w-full rounded-2xl border border-white/[0.08] bg-graphite-800 px-11 py-3 text-sm text-offwhite placeholder:text-neutral-600 outline-none focus:border-data-lime/40"
              aria-label="Search products"
            />
          </div>
          <button type="submit" className="cta-primary h-12 px-6 w-full sm:w-auto" disabled={isPending}>
            Search
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <QuickFilters value={activeFilter} onFilterChange={(next) => setFilter(next as FilterKey)} />

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Showing <span className="text-data-lime tabular-nums">{total ? `${startIndex + 1}–${endIndex}` : '0'}</span> of{' '}
              <span className="text-offwhite tabular-nums">{isPending ? '…' : total}</span>
            </div>

            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Sort
              <select
                value={activeFilter === 'highestrated' ? 'rating-desc' : activeSort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-inner border border-white/[0.08] bg-graphite-800 px-3 py-2 text-xs font-bold text-offwhite"
              >
                <option value="rank">Rank</option>
                <option value="rating-desc">Rating</option>
                <option value="price-asc">Price (Low)</option>
                <option value="price-desc">Price (High)</option>
                <option value="title-asc">Title (A–Z)</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
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

