'use client';

import { ArrowRight, SlidersHorizontal, X, LayoutGrid } from 'lucide-react';
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
    { key: 'dimensions', label: 'Dimensions', render: (item: CompareItem) => item.specs?.dimensions || 'Not listed' },
    { key: 'weight', label: 'Weight', render: (item: CompareItem) => item.specs?.weight || 'Not listed' },
  ] as const;

  if (!isVisible || selectedProducts.length === 0) return null;

  const compareRoute = `/compare?ids=${selectedProducts.slice(0, 4).map((product) => encodeURIComponent(product.id)).join(',')}`;
  const strongestPrice = Math.min(...selectedProducts.map((product) => product.price_cents || Number.POSITIVE_INFINITY));
  const strongestRating = Math.max(...selectedProducts.map((product) => product.rating || Number.NEGATIVE_INFINITY));

  return (
    <>
      {/* ── STICKY BAR ── */}
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <div className="glass shadow-card-hover rounded-card border-white/10 px-4 py-3 sm:px-6 sm:py-4 pointer-events-auto flex items-center gap-6 max-w-6xl w-full animate-cardIn">
          
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="editorial-badge editorial-badge--trending whitespace-nowrap">
              <LayoutGrid className="w-3 h-3" />
              COMPARE ({selectedProducts.length}/4)
            </div>
          </div>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {selectedProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="group relative flex-shrink-0 w-12 h-12 rounded-inner border border-white/10 bg-white p-1">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="h-full w-full object-contain" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-black text-neutral-400 bg-neutral-100">PA</div>
                )}
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {selectedProducts.length < 4 && (
              <div className="w-12 h-12 rounded-inner border border-dashed border-white/20 flex items-center justify-center text-neutral-500 text-lg">+</div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="cta-secondary min-h-[2.75rem] w-auto border-transparent bg-white/5 hover:bg-white/10"
            >
              Clear
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cta-primary min-h-[2.75rem] px-6 w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Compare Side-by-Side</span>
              <span className="sm:hidden">Compare</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#0A0D12]/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-7xl max-h-[90vh] glass-card rounded-card overflow-hidden flex flex-col shadow-2xl animate-cardIn">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="section-eyebrow">Smart Comparison</div>
                <h3 className="text-xl font-bold text-offwhite mt-1">Side-by-Side Analysis</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center gap-3">
              <span className="text-2xs font-black uppercase tracking-widest text-neutral-500 mr-2">Sort by</span>
              {(['rank', 'price', 'rating', 'title'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`filter-pill ${sortBy === key ? 'filter-pill--active' : ''} px-4 py-1.5`}
                >
                  <span className="filter-pill__label text-[10px]">{key}</span>
                </button>
              ))}
              <div className="ml-auto text-2xs font-bold text-neutral-600 uppercase tracking-[0.1em] hidden md:block">
                {selectedProducts.length} items loaded into laboratory matrix
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-6">
              <div className="min-w-[800px]">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-[#0E1116] py-4 pr-8 border-b border-white/10 text-2xs font-black uppercase tracking-widest text-neutral-500 z-10">Specs</th>
                      {sortedProducts.map((p) => (
                        <th key={p.id} className="py-4 pr-8 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-inner border border-white/10 bg-white p-1 flex-shrink-0">
                              <img src={p.image_url || ''} className="h-full w-full object-contain" alt="" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-offwhite truncate">{toTitle(p)}</div>
                              <div className="text-[10px] font-bold text-data-lime uppercase tracking-widest">{p.rating} ★</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {comparisonRows.map((row) => (
                      <tr key={row.key} className="group">
                        <td className="sticky left-0 bg-[#0E1116] py-5 pr-8 text-2xs font-black uppercase tracking-[0.15em] text-neutral-500 z-10 group-hover:text-neutral-300 transition-colors">
                          {row.label}
                        </td>
                        {sortedProducts.map((p) => {
                          const val = row.render(p);
                          const isBestPrice = row.key === 'price' && p.price_cents === strongestPrice;
                          const isBestRating = row.key === 'rating' && p.rating === strongestRating;
                          return (
                            <td key={`${row.key}-${p.id}`} className="py-5 pr-8 text-sm align-top">
                              <div className={`${isBestPrice || isBestRating ? 'text-data-lime font-black' : 'text-neutral-300'}`}>
                                {val}
                                {(isBestPrice || isBestRating) && <span className="ml-1.5 text-[9px] uppercase tracking-widest">BEST</span>}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <p className="text-xs text-neutral-500">Side-by-side data powered by Athletica AI Aggregator</p>
              <div className="flex items-center gap-3">
                <button onClick={onClear} className="cta-secondary min-h-[2.5rem] px-4 w-auto text-xs">Reset All</button>
                <Link href={compareRoute} className="cta-primary min-h-[2.5rem] px-6 w-auto text-xs">
                  Full Page Comparison
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
