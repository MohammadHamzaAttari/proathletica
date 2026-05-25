'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { StickyCompareBar } from './StickyCompareBar';

type EnhancedProduct = Product & {
  short_title?: string | null;
  editorial_summary?: string | null;
  position?: number;
  custom_blurb?: string | null;
};

/* ─────────────────────────────────────────────
   SKELETON CARD — shown during hydration
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[#161B22]"
      aria-hidden="true"
      role="presentation"
    >
      {/* Image skeleton */}
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />

      {/* Body skeleton */}
      <div className="p-5 space-y-4">
        {/* Trust strip */}
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-12 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>

        {/* Stars */}
        <div className="skeleton h-4 w-32 rounded" />

        {/* Verdict */}
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>

        {/* Pros/cons box */}
        <div className="rounded-[0.875rem] border border-white/[0.04] bg-black/20 p-3.5 space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>

        {/* Price + CTA */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-[3.25rem] w-full rounded-[0.875rem]" />
          <div className="skeleton h-[2.75rem] w-full rounded-[0.75rem]" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ filterLabel }: { filterLabel?: string }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             className="text-neutral-600" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <div>
        <p className="font-bold text-neutral-300">No products found</p>
        <p className="text-sm text-neutral-500 mt-1">
          {filterLabel
            ? `No products match "${filterLabel}" yet. Try a different filter.`
            : 'Products are loading. Check back soon.'}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT GRID COMPONENT
───────────────────────────────────────────── */
export function ProductGrid({
  products,
  articleSlug,
  isLoading = false,
  emptyFilterLabel,
  selectedIds,
  onSelectedIdsChange,
  showCompareBar = true,
}: {
  products: EnhancedProduct[];
  articleSlug: string;
  isLoading?: boolean;
  emptyFilterLabel?: string;
  selectedIds?: string[];
  onSelectedIdsChange?: (value: string[] | ((prev: string[]) => string[])) => void;
  showCompareBar?: boolean;
}) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const effectiveSelectedIds = selectedIds ?? internalSelectedIds;
  const setSelectedIds = onSelectedIdsChange ?? setInternalSelectedIds;

  const selectedIdSet = useMemo(() => new Set(effectiveSelectedIds), [effectiveSelectedIds]);
  const selectedProducts = products.filter(p => selectedIdSet.has(p.id));

  const toggleCompare = (productId: string, selected: boolean) => {
    setSelectedIds(prev => {
      const prevIds = Array.isArray(prev) ? prev : [];
      if (selected) {
        const without = prevIds.filter((id) => id !== productId);
        const next = [...without, productId];
        return next.length > 4 ? next.slice(next.length - 4) : next;
      }
      return prevIds.filter((id) => id !== productId);
    });
  };

  const clearCompare = () => setSelectedIds([]);

  /* ── Stagger animation delay: 60ms per card, max 360ms ── */
  const staggerDelay = (index: number) => Math.min(index * 60, 360);

  return (
    <>
      {/* Grid */}
      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
        role="list"
        aria-label="Product recommendations"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          /* Skeleton placeholders */
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} role="listitem">
              <SkeletonCard />
            </div>
          ))
        ) : products.length === 0 ? (
          <EmptyState filterLabel={emptyFilterLabel} />
        ) : (
          products.map((product, index) => (
            <div key={product.id} role="listitem" className="h-full">
              <ProductCard
                product={product}
                rank={index}
                articleSlug={articleSlug}
                onCompareToggle={toggleCompare}
                isSelected={selectedIdSet.has(product.id)}
                animationDelay={staggerDelay(index)}
              />
            </div>
          ))
        )}
      </div>

      {/* Compare bar — portal-level sticky overlay */}
      {showCompareBar && (
        <StickyCompareBar
          selectedProducts={selectedProducts}
          onRemove={(id) => toggleCompare(id, false)}
          onClear={clearCompare}
        />
      )}
    </>
  );
}
