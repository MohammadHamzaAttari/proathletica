'use client';

import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface CompareItem {
  id: string;
  short_title?: string | null;
  title: string;
  image_url?: string | null;
  price_cents?: number | null;
  rating?: number | null;
  editorial_summary?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
  best_for_tags?: string[] | null;
  specs?: Record<string, string> | null;
}

type SortKey = 'rank' | 'price' | 'rating' | 'title';

function toTitle(product: CompareItem) {
  return product.short_title || product.title;
}

function compareNumber(a: number | null | undefined, b: number | null | undefined, direction: 'asc' | 'desc') {
  const left = a ?? (direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
  const right = b ?? (direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
  return direction === 'asc' ? left - right : right - left;
}

function pickSpec(product: CompareItem, key: string) {
  const value = product.specs?.[key];
  if (value) return value;

  if (key === 'adjustability') {
    if (/adjust|selecttech|dial|selector/i.test([toTitle(product), product.editorial_summary, ...(product.best_for_tags || [])].filter(Boolean).join(' '))) {
      return 'Adjustable';
    }
    return 'Fixed';
  }

  if (key === 'materials') {
    if (/steel|metal|iron|aluminum|rubber|neoprene|nylon/i.test([toTitle(product), product.editorial_summary, ...(product.pros || []), ...(product.cons || [])].filter(Boolean).join(' '))) {
      return 'Mixed materials';
    }
    return 'Not listed';
  }

  if (key === 'warranty') {
    return product.specs?.warranty || 'Not listed';
  }

  return 'Not listed';
}

export function StickyCompareBar({
  selectedProducts,
  onRemove,
  onClear,
}: {
  selectedProducts: CompareItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rank');

  useEffect(() => {
    setIsVisible(selectedProducts.length >= 2);
  }, [selectedProducts.length]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const sortedProducts = useMemo(() => {
    const items = [...selectedProducts];
    if (sortBy === 'price') return items.sort((a, b) => compareNumber(a.price_cents, b.price_cents, 'asc'));
    if (sortBy === 'rating') return items.sort((a, b) => compareNumber(a.rating, b.rating, 'desc'));
    if (sortBy === 'title') return items.sort((a, b) => toTitle(a).localeCompare(toTitle(b)));
    return items;
  }, [selectedProducts, sortBy]);

  const comparisonRows = [
    { key: 'price', label: 'Price', render: (item: CompareItem) => `$${((item.price_cents || 0) / 100).toFixed(0)}` },
    { key: 'rating', label: 'Rating', render: (item: CompareItem) => (item.rating ? item.rating.toFixed(1) : '—') },
    { key: 'best_for', label: 'Best for', render: (item: CompareItem) => (item.best_for_tags || []).slice(0, 3).join(' · ') || 'Not listed' },
    { key: 'adjustability', label: 'Adjustability', render: (item: CompareItem) => pickSpec(item, 'adjustability') },
    { key: 'materials', label: 'Materials', render: (item: CompareItem) => pickSpec(item, 'materials') },
    { key: 'warranty', label: 'Warranty', render: (item: CompareItem) => pickSpec(item, 'warranty') },
    { key: 'dimensions', label: 'Dimensions', render: (item: CompareItem) => item.specs?.dimensions || 'Not listed' },
    { key: 'weight', label: 'Weight', render: (item: CompareItem) => item.specs?.weight || 'Not listed' },
  ] as const;

  if (!isVisible || selectedProducts.length === 0) return null;

  const handleCompare = () => {
    setIsModalOpen(true);
  };

  const compareRoute = `/compare?ids=${selectedProducts.slice(0, 4).map((product) => encodeURIComponent(product.id)).join(',')}`;

  const strongestPrice = Math.min(...selectedProducts.map((product) => product.price_cents || Number.POSITIVE_INFINITY));
  const strongestRating = Math.max(...selectedProducts.map((product) => product.rating || Number.NEGATIVE_INFINITY));

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#C6FF3D]/30 bg-[#0E1116]/95 p-4 shadow-2xl backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[#C6FF3D]/10 px-5 py-2 text-sm font-black tracking-widest text-[#C6FF3D]">
            COMPARE
          </div>
          <div className="text-sm text-neutral-400">
            {selectedProducts.length}/4 selected
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-[10px] font-black text-neutral-400">P</div>
              )}
              <button
                onClick={() => onRemove(product.id)}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {selectedProducts.length < 4 && (
            <div className="h-11 w-11 rounded-2xl border border-dashed border-white/30 flex items-center justify-center text-xs text-neutral-500">
              +
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-neutral-400 hover:text-white transition"
          >
            Clear
          </button>
          <Link
            href={compareRoute}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/5"
          >
            Full compare
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={handleCompare}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6B1A] px-8 py-3 font-black uppercase tracking-widest text-black text-sm hover:bg-[#ff8a4d] transition"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Compare ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Compare products">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0E1116] shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C6FF3D]">Side-by-side comparison</div>
                <div className="mt-1 text-sm text-neutral-400">Sort and compare the selected products without leaving the page.</div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/10 p-2 text-neutral-400 hover:text-white"
                aria-label="Close compare modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                {(['rank', 'price', 'rating', 'title'] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${sortBy === key ? 'bg-[#C6FF3D]/10 text-[#C6FF3D]' : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    Sort {key}
                  </button>
                ))}
                <div className="ml-auto text-xs font-medium text-neutral-500">
                  Best price: ${((strongestPrice === Number.POSITIVE_INFINITY ? 0 : strongestPrice) / 100).toFixed(0)} · Best rating: {strongestRating === Number.NEGATIVE_INFINITY ? '—' : strongestRating.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="max-h-[calc(90vh-180px)] overflow-auto px-5 py-5 sm:px-6">
              <div className="hidden min-w-[920px] lg:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-black uppercase tracking-widest text-neutral-400">
                      <th className="py-4 pr-6 w-40">Attribute</th>
                      {sortedProducts.map((product) => (
                        <th key={product.id} className="py-4 pr-6 align-bottom">
                          <div className="max-w-[180px]">
                            <div className="text-sm font-black text-white">{product.short_title || product.title}</div>
                            <div className="mt-1 text-[10px] text-neutral-500">{product.best_for_tags?.slice(0, 2).join(' · ') || 'Selected pick'}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {comparisonRows.map((row) => (
                      <tr key={row.key}>
                        <td className="py-5 pr-6 text-xs font-black uppercase tracking-[0.18em] text-neutral-500">{row.label}</td>
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
              </div>

              <div className="space-y-4 lg:hidden">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-white">{product.short_title || product.title}</div>
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#C6FF3D]">{product.best_for_tags?.[0] || 'Selected pick'}</div>
                      </div>
                      <button onClick={() => onRemove(product.id)} className="rounded-full border border-white/10 p-2 text-neutral-400 hover:text-white" aria-label={`Remove ${product.title}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <dl className="mt-4 space-y-3 text-sm">
                      {comparisonRows.map((row) => (
                        <div key={row.key} className="flex items-center justify-between gap-4 border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
                          <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">{row.label}</dt>
                          <dd className="max-w-[60%] text-right text-neutral-200">{row.render(product)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-6">
              <div className="text-xs text-neutral-500">
                Compare selected products side-by-side with prices, ratings, and fit tags.
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onClear} className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-neutral-400 hover:text-white">
                  Clear
                </button>
                <Link href={compareRoute} className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6B1A] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-black hover:bg-[#ff8a4d]">
                  Open full compare <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
