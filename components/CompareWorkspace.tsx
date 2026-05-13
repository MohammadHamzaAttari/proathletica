'use client';

import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';

type SortKey = 'rank' | 'price' | 'rating' | 'title';

function titleFor(product: Product) {
  return product.short_title || product.title;
}

function compareNumber(a: number | null | undefined, b: number | null | undefined, direction: 'asc' | 'desc') {
  const left = a ?? (direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
  const right = b ?? (direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
  return direction === 'asc' ? left - right : right - left;
}

function specValue(product: Product, key: keyof NonNullable<Product['specs']>) {
  return product.specs?.[key] || 'Not listed';
}

export function CompareWorkspace({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = (searchParams.get('sort') as SortKey) || 'rank';
  const ids = searchParams.get('ids')?.split(',').map((id) => id.trim()).filter(Boolean) || [];

  const sortedProducts = useMemo<Product[]>(() => {
    const items = [...products];
    if (sortBy === 'price') return items.sort((a, b) => compareNumber(a.price_cents, b.price_cents, 'asc'));
    if (sortBy === 'rating') return items.sort((a, b) => compareNumber(a.rating, b.rating, 'desc'));
    if (sortBy === 'title') return items.sort((a, b) => titleFor(a).localeCompare(titleFor(b)));
    return items;
  }, [products, sortBy]);

  const rows = [
    { key: 'price', label: 'Price', render: (product: Product) => (product.price_cents ? `$${(product.price_cents / 100).toFixed(0)}` : 'Not listed') },
    { key: 'rating', label: 'Rating', render: (product: Product) => (product.rating ? product.rating.toFixed(1) : '—') },
    { key: 'best_for', label: 'Best for', render: (product: Product) => (product.best_for_tags || []).slice(0, 3).join(' · ') || 'Not listed' },
    { key: 'adjustability', label: 'Adjustability', render: (product: Product) => specValue(product, 'adjustability') },
    { key: 'materials', label: 'Materials', render: (product: Product) => specValue(product, 'materials') },
    { key: 'warranty', label: 'Warranty', render: (product: Product) => specValue(product, 'warranty') },
    { key: 'dimensions', label: 'Dimensions', render: (product: Product) => specValue(product, 'dimensions') },
    { key: 'weight', label: 'Weight', render: (product: Product) => specValue(product, 'weight') },
  ] as const;

  const updateQuery = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    router.replace(`/compare${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const removeProduct = (id: string) => {
    const nextIds = ids.filter((value) => value !== id);
    updateQuery({ ids: nextIds.join(',') || null });
  };

  const strongestPrice = Math.min(...sortedProducts.map((product) => product.price_cents || Number.POSITIVE_INFINITY));
  const strongestRating = Math.max(...sortedProducts.map((product) => product.rating || Number.NEGATIVE_INFINITY));

  if (sortedProducts.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-[#161B22] p-8 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C6FF3D]">Compare picks</div>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter text-white">Select products to compare</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
            Use the compare tray on category and article pages to add products here. This page stays shareable and keeps the comparison state in the URL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-2xl bg-[#FF6B1A] px-6 py-3 text-sm font-black uppercase tracking-widest text-black">
              Browse homepage
            </Link>
            <Link href="/categories" className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-widest text-white">
              Browse categories
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#C6FF3D]/30 bg-[#C6FF3D]/10 px-4 py-1 text-xs font-black tracking-[0.18em] text-[#C6FF3D]">
            PERSISTENT COMPARISON
          </div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">Compare selected gear</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
            Side-by-side specs, fit tags, and editorial notes persist in the URL so you can share or reopen the comparison later.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['rank', 'price', 'rating', 'title'] as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => updateQuery({ sort: key })}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${sortBy === key ? 'bg-[#C6FF3D]/10 text-[#C6FF3D]' : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
            >
              Sort {key}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => updateQuery({ ids: null })}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-neutral-300 hover:text-white"
        >
          Clear selections
        </button>
        <Link href="/categories" className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6B1A] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black hover:bg-[#ff8a4d]">
          Add more products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#0E1116] shadow-2xl">
        <div className="overflow-auto">
          <table className="hidden min-w-[960px] w-full border-collapse text-left lg:table">
            <thead>
              <tr className="border-b border-white/10 text-xs font-black uppercase tracking-widest text-neutral-400">
                <th className="py-5 pl-6 pr-6 w-40">Attribute</th>
                {sortedProducts.map((product) => (
                  <th key={product.id} className="py-5 pr-6 align-bottom">
                    <div className="max-w-[180px] space-y-2">
                      <div className="text-lg font-black text-white">{product.short_title || product.title}</div>
                      <div className="text-[10px] text-neutral-500">{(product.best_for_tags || []).slice(0, 2).join(' · ') || 'Selected pick'}</div>
                      <button onClick={() => removeProduct(product.id)} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400 hover:text-white">
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row) => (
                <tr key={row.key}>
                  <td className="py-5 pl-6 pr-6 text-xs font-black uppercase tracking-[0.18em] text-neutral-500">{row.label}</td>
                  {sortedProducts.map((product) => {
                    const value = row.render(product);
                    const highlightPrice = row.key === 'price' && product.price_cents === strongestPrice;
                    const highlightRating = row.key === 'rating' && product.rating === strongestRating;
                    return (
                      <td key={`${row.key}-${product.id}`} className={`py-5 pr-6 align-top text-sm ${highlightPrice || highlightRating ? 'text-[#C6FF3D]' : 'text-neutral-200'}`}>
                        <div className={highlightPrice || highlightRating ? 'font-black' : ''}>{value}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-4 p-4 lg:hidden">
            {sortedProducts.map((product) => (
              <article key={product.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-white">{product.short_title || product.title}</div>
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#C6FF3D]">{(product.best_for_tags || []).slice(0, 2).join(' · ') || 'Selected pick'}</div>
                  </div>
                  <button onClick={() => removeProduct(product.id)} className="rounded-full border border-white/10 p-2 text-neutral-400 hover:text-white" aria-label={`Remove ${product.title}`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  {rows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-4 border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                      <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">{row.label}</dt>
                      <dd className="max-w-[60%] text-right text-neutral-200">{row.render(product)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-4 sm:px-6">
          <div className="text-xs text-neutral-500">
            Best price: ${((strongestPrice === Number.POSITIVE_INFINITY ? 0 : strongestPrice) / 100).toFixed(0)} · Best rating: {strongestRating === Number.NEGATIVE_INFINITY ? '—' : strongestRating.toFixed(1)}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-300">
            <SlidersHorizontal className="h-3 w-3" /> URL persisted
          </div>
        </div>
      </div>
    </section>
  );
}