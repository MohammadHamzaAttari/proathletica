'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import type { Product } from '@/lib/types';

type FilterKey = 'all' | 'small-apartments' | 'budget' | 'heavy-lifters' | 'smart-equipment' | 'compact-gear';

const FILTERS: Array<{
  key: FilterKey;
  label: string;
  hint: string;
  match: (product: Product) => boolean;
}> = [
  {
    key: 'all',
    label: 'All picks',
    hint: 'Everything currently loaded',
    match: () => true,
  },
  {
    key: 'small-apartments',
    label: 'Best for Small Apartments',
    hint: 'Space-saving gear first',
    match: (product) => /compact|foldable|small footprint|space-saving/i.test([
      product.short_title,
      product.title,
      product.raw_description,
      product.editorial_summary,
      ...(product.best_for_tags || []),
    ].filter(Boolean).join(' ')),
  },
  {
    key: 'budget',
    label: 'Best Budget Picks',
    hint: 'Value-first buys',
    match: (product) => /budget|value|affordable|entry|starter/i.test([
      product.short_title,
      product.title,
      product.editorial_summary,
      ...(product.best_for_tags || []),
    ].filter(Boolean).join(' ')) || (product.price_cents || 0) <= 20000,
  },
  {
    key: 'heavy-lifters',
    label: 'Best for Heavy Lifters',
    hint: 'Higher-load, sturdier gear',
    match: (product) => /heavy|garage|high load|durable|steel|pro/i.test([
      product.short_title,
      product.title,
      product.raw_description,
      product.editorial_summary,
      ...(product.best_for_tags || []),
    ].filter(Boolean).join(' ')),
  },
  {
    key: 'smart-equipment',
    label: 'Best Smart Equipment',
    hint: 'Connected training systems',
    match: (product) => /smart|app|bluetooth|connected/i.test([
      product.short_title,
      product.title,
      product.raw_description,
      product.editorial_summary,
      ...(product.best_for_tags || []),
    ].filter(Boolean).join(' ')),
  },
  {
    key: 'compact-gear',
    label: 'Best Compact Gear',
    hint: 'Low-footprint utilities',
    match: (product) => /compact|portable|foldable|space-saving|small footprint/i.test([
      product.short_title,
      product.title,
      product.raw_description,
      product.editorial_summary,
      ...(product.best_for_tags || []),
    ].filter(Boolean).join(' ')),
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
  const activeFilter = (searchParams.get('focus') as FilterKey) || initialFilter || 'all';

  const setFilter = (nextFilter: FilterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilter === 'all') {
      params.delete('focus');
    } else {
      params.set('focus', nextFilter);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    const filter = FILTERS.find((entry) => entry.key === activeFilter);
    return products.filter((product) => (filter ? filter.match(product) : true));
  }, [activeFilter, products]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setFilter(filter.key)}
              className={`rounded-full border px-4 py-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-[#C6FF3D]/30 bg-[#C6FF3D]/10 text-[#C6FF3D] shadow-[0_0_0_1px_rgba(198,255,61,0.2)]'
                  : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.18em]">{filter.label}</div>
              <div className="mt-0.5 text-[10px] font-medium text-neutral-500">{filter.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-white/5 bg-white/5 p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C6FF3D]">Filtered product rail</div>
            <div className="mt-1 text-sm text-neutral-400">
              Showing {filteredProducts.length} of {products.length} products.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500 hover:text-white"
          >
            Reset
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-8 overflow-hidden rounded-[1.5rem] border border-white/5 bg-black/20 p-4">
              <ComparisonTable products={filteredProducts} articleSlug={articleSlug} title="At a glance" />
            </div>
            <ProductGrid products={filteredProducts} articleSlug={articleSlug} />
          </>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 p-10 text-center text-neutral-400">
            No products match this filter yet.
          </div>
        )}
      </div>
    </div>
  );
}