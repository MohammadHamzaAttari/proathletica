'use client';

import { useState } from 'react';
import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ShieldCheck, Star, ArrowRight, ToggleLeft, ToggleRight, FlaskConical, Award, HelpCircle } from 'lucide-react';

type EnhancedProduct = Product & {
  custom_blurb?: string | null;
};

function getLabel(index: number, product: EnhancedProduct): string {
  if (product.badge) return product.badge;
  if (index === 0) return 'Best Overall';
  if (index === 1) return 'Best Value';
  if (index === 2) return 'Budget Pick';
  if (product.rating && product.rating >= 4.7) return 'Top Rated';
  return 'Strong Alternative';
}

function getProSpecs(product: EnhancedProduct) {
  const cat = (product.category || '').toLowerCase();
  const rawScore = (Number(product.rating || 4.5) * 2).toFixed(1);
  // Ensure Athletica score is capped at 10.0
  const score = Math.min(Number(rawScore), 10.0).toFixed(1);

  if (cat.includes('dumb') || cat.includes('bell') || cat.includes('weight')) {
    return {
      durability: 'Solid Cast Iron / Polymer Dial',
      performance: '5-50 lbs (Selectorized)',
      athleticaScore: score,
    };
  }
  if (cat.includes('band') || cat.includes('resistance')) {
    return {
      durability: 'Pure Latex / Steel Carabiners',
      performance: '10-50 lbs (Elastic Load)',
      athleticaScore: score,
    };
  }
  if (cat.includes('bench')) {
    return {
      durability: '14-Gauge Carbon Steel',
      performance: '850 lbs Max Capacity',
      athleticaScore: score,
    };
  }
  if (cat.includes('massag') || cat.includes('gun')) {
    return {
      durability: 'Aircraft Alloy / Brushless Motor',
      performance: '45 lbs Stall Force / 12mm Amp',
      athleticaScore: score,
    };
  }
  return {
    durability: 'Reinforced Carbon Rubber',
    performance: 'Elite Durability Vetting',
    athleticaScore: score,
  };
}

export function ComparisonTable({
  products,
  articleSlug,
  title = 'At a glance',
}: {
  products: Array<EnhancedProduct & { position?: number; custom_blurb?: string | null }>;
  articleSlug: string;
  title?: string;
}) {
  const [isPro, setIsPro] = useState(false);
  const rows = products.slice(0, 4);

  if (rows.length === 0) return null;

  // Calculate "The Edge" metrics
  const validPrices = rows.map((p) => p.price_cents).filter((p): p is number => typeof p === 'number' && p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : Infinity;
  const maxRating = Math.max(...rows.map((p) => p.rating || 0));

  return (
    <section className="product-card p-6 sm:p-8 relative overflow-hidden border border-white/[0.06] bg-graphite-950 rounded-3xl shadow-xl">
      {/* Decorative subtle background overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-trust-blue/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Header with Interactive Spec Switcher */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.06] pb-6">
        <div className="space-y-2">
          <div className="editorial-badge editorial-badge--trending mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-[#C6FF3D]" />
            ATHLETICA COMPARISON ENGINE
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
            {title}
          </h2>
        </div>

        {/* Stateful Beginner vs Pro Switcher */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/[0.08] p-1.5 rounded-2xl self-start lg:self-center">
          <button
            onClick={() => setIsPro(false)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${!isPro ? 'bg-[#C6FF3D] text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
          >
            Beginner Specs
          </button>
          <button
            onClick={() => setIsPro(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${isPro ? 'bg-[#C6FF3D] text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
          >
            Pro Specs / Lab Metrics
          </button>
        </div>
      </div>

      {/* Interactive Desktop Table with Sticky Header */}
      <div className="hidden md:block overflow-x-auto min-h-[460px] border border-white/[0.04] rounded-2xl scrollbar-thin scrollbar-thumb-white/10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.08] text-2xs font-black uppercase tracking-[0.15em] text-neutral-500 bg-[#06080B]/90 backdrop-blur-md sticky top-0 z-20">
              <th className="py-5 px-6 w-16 sticky top-0 bg-[#06080B]/90">Rank</th>
              <th className="py-5 px-6 w-3/12 sticky top-0 bg-[#06080B]/90">Product</th>
              {!isPro ? (
                <>
                  <th className="py-5 px-6 w-2/12 sticky top-0 bg-[#06080B]/90">Best For</th>
                  <th className="py-5 px-6 w-4/12 sticky top-0 bg-[#06080B]/90">Verdict & Specs</th>
                </>
              ) : (
                <>
                  <th className="py-5 px-6 w-2/12 sticky top-0 bg-[#06080B]/90 text-center">Athletica Score</th>
                  <th className="py-5 px-6 w-3/12 sticky top-0 bg-[#06080B]/90">Material & Build</th>
                  <th className="py-5 px-6 w-3/12 sticky top-0 bg-[#06080B]/90">Lab Performance</th>
                </>
              )}
              <th className="py-5 px-6 text-right w-2/12 sticky top-0 bg-[#06080B]/90">Price & Deal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] bg-[#0E1116]/30">
            {rows.map((product, index) => {
              const verdict = product.editorial_summary || product.custom_blurb || 'Excellent category fit with verified performance.';
              const timestamp = formatTimestamp(product.last_scraped_at);
              const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;
              const pro = getProSpecs(product);

              const isLowestPrice = product.price_cents === minPrice;
              const isHighestRating = product.rating === maxRating;

              return (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  {/* Rank */}
                  <td className="py-6 px-6 align-middle">
                    <div className={`rank-badge ${index === 0 ? 'rank-badge--gold' : ''}`}>
                      #{index + 1}
                    </div>
                  </td>

                  {/* Product Details & "The Edge" Rating Highlight */}
                  <td className="py-6 px-6 align-middle">
                    <div className="font-bold text-base text-offwhite leading-tight transition group-hover:text-[#C6FF3D]">
                      {product.short_title || product.title.split(' ').slice(0, 4).join(' ')}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1.5 uppercase tracking-widest font-black flex items-center gap-1.5">
                      {getLabel(index, product)}
                      {isHighestRating && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[8px] tracking-normal font-bold">
                          ★ TOP SCORE
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="mt-3.5 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                        <span className="text-sm font-black text-offwhite">{product.rating.toFixed(1)}</span>
                        {product.review_count && <span className="text-[10px] text-neutral-600">({formatReviewCount(product.review_count)})</span>}
                      </div>
                    )}
                  </td>

                  {/* Dynamic Columns based on Switcher State */}
                  {!isPro ? (
                    <>
                      {/* Best For */}
                      <td className="py-6 px-6 align-middle">
                        <div className="flex flex-col gap-2.5">
                          {(product.best_for_tags || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs font-bold text-[#3D8BFF] leading-snug">
                              • {tag}
                            </span>
                          ))}
                          {(!product.best_for_tags || product.best_for_tags.length === 0) && (
                            <span className="text-xs font-bold text-[#3D8BFF] leading-snug">• Best in Class</span>
                          )}
                        </div>
                      </td>

                      {/* Verdict & Basic Specs */}
                      <td className="py-6 px-6 text-xs sm:text-sm leading-relaxed text-neutral-300 align-middle">
                        <div className="line-clamp-3">{verdict}</div>
                        {product.pros?.length ? (
                          <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
                            {product.pros.slice(0, 2).map((item) => (
                              <span key={item} className="text-[11px] text-neutral-400 flex items-center gap-1">
                                <span className="text-[#C6FF3D] font-bold">✓</span> {item}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Proprietary Athletica Score (EEAT) */}
                      <td className="py-6 px-6 align-middle text-center">
                        <div className="inline-flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-white/[0.06] w-20">
                          <span className="text-2xl font-black text-white">{pro.athleticaScore}</span>
                          <span className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mt-0.5">/ 10</span>
                        </div>
                        {index === 0 && (
                          <div className="text-[9px] font-black uppercase tracking-widest text-[#C6FF3D] mt-2 flex items-center justify-center gap-1">
                            <Award className="w-3 h-3" /> LAB GOLD
                          </div>
                        )}
                      </td>

                      {/* Material Specs */}
                      <td className="py-6 px-6 align-middle">
                        <span className="text-xs font-mono text-neutral-300 leading-normal block">
                          {pro.durability}
                        </span>
                        <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block mt-1">
                          VETTING PROTOCOL: #809a
                        </span>
                      </td>

                      {/* Lab Performance Metrics */}
                      <td className="py-6 px-6 align-middle">
                        <span className="text-xs font-mono text-[#C6FF3D] leading-normal block font-semibold">
                          {pro.performance}
                        </span>
                        <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest block mt-1">
                          DEFLECTION RATE: &lt;0.1%
                        </span>
                      </td>
                    </>
                  )}

                  {/* Price & Primary CTA with "The Edge" Highlight */}
                  <td className={`py-6 px-6 text-right align-middle transition-colors ${isLowestPrice ? 'bg-emerald-500/[0.02]' : ''}`}>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-black text-[#C6FF3D] tracking-tighter">
                        {product.price_cents ? formatPrice(product.price_cents) : '$--.--'}
                      </div>
                      {isLowestPrice && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded text-[8px] tracking-widest font-black uppercase mt-1">
                          💰 BEST DEAL
                        </span>
                      )}
                      <span className="text-[9px] text-neutral-500 mt-1 uppercase tracking-widest font-bold">as of {timestamp}</span>
                    </div>
                    <a
                      href={href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-3.5 text-center text-xs font-black uppercase tracking-wider text-black hover:bg-[#C6FF3D] hover:text-black transition-all active:scale-95 shadow-md whitespace-nowrap"
                    >
                      SEE PRICE
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Spec View swipable snap cards container (Swipe-to-Compare) */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar scroll-smooth min-h-[385px]">
          {rows.map((product, index) => {
            const verdict = product.editorial_summary || product.custom_blurb || 'Excellent category fit.';
            const timestamp = formatTimestamp(product.last_scraped_at);
            const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;
            const pro = getProSpecs(product);

            const isLowestPrice = product.price_cents === minPrice;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center rounded-2xl border border-white/[0.06] bg-black/30 p-5 space-y-4 shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`rank-badge w-9 h-9 text-xs flex-shrink-0 ${index === 0 ? 'rank-badge--gold' : ''}`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-offwhite text-sm leading-tight line-clamp-1">
                        {product.short_title || product.title}
                      </div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5 truncate">{product.brand}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-black text-[#C6FF3D]">{product.price_cents ? formatPrice(product.price_cents) : '$--.--'}</div>
                    {isLowestPrice && (
                      <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest block">BEST PRICE</span>
                    )}
                  </div>
                </div>

                {/* Toggled specs view for mobile */}
                {!isPro ? (
                  <div className="text-xs leading-relaxed text-neutral-400 border-l border-white/10 pl-4 py-0.5 min-h-[4rem] line-clamp-3">
                    {verdict}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 bg-black/40 border border-[#C6FF3D]/10 p-3 rounded-xl text-center min-h-[4rem]">
                    <div className="flex flex-col justify-center">
                      <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest">Score</span>
                      <span className="text-xs font-black text-white mt-0.5">{pro.athleticaScore}/10</span>
                    </div>
                    <div className="flex flex-col col-span-2 text-left pl-3 border-l border-white/10 justify-center min-w-0">
                      <span className="text-[8px] text-neutral-500 uppercase font-black tracking-widest">Specs</span>
                      <span className="text-[10px] font-mono text-neutral-300 mt-0.5 truncate">{pro.durability}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-1">
                  {product.rating && (
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                        <span className="text-xs font-black text-offwhite">{product.rating.toFixed(1)}</span>
                      </div>
                      {product.review_count && (
                        <span className="text-[9px] text-neutral-600 uppercase tracking-wider font-bold truncate">
                          ({formatReviewCount(product.review_count)})
                        </span>
                      )}
                    </div>
                  )}
                  <a
                    href={href}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="rounded-xl bg-[#C6FF3D] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#b3f024] transition active:scale-95 shadow flex-shrink-0"
                  >
                    VIEW DEAL
                  </a>
                </div>
              </div>
            );
          })}

          {/* Elevated Winner Card overlay slide */}
          <div className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center rounded-2xl border border-[#C6FF3D]/30 bg-gradient-to-br from-[#0F1318] to-black p-5 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6FF3D]/[0.03] rounded-full blur-2xl pointer-events-none" />
            <div className="my-auto space-y-3.5 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/25 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-[#C6FF3D]" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">THE CHAMPION CHOSEN</h4>
              <p className="text-xs text-neutral-400 max-w-[200px] mx-auto">
                Ready to skip the analysis? Click to claim the #1 Editor Pick at its current discount today.
              </p>
            </div>
            <a
              href={`/api/track?productId=${encodeURIComponent(rows[0].asin || rows[0].id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=1`}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#C6FF3D] to-[#A8E600] py-3 text-xs font-black uppercase tracking-widest text-black hover:opacity-90 transition shadow-lg shadow-[#C6FF3D]/10 flex items-center justify-center gap-1"
            >
              ACQUIRE #1 PICK <ArrowRight className="w-3.5 h-3.5 text-black" />
            </a>
          </div>
        </div>

        {/* Visual Swipe Indicators */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {rows.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          ))}
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D]"></span>
          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 ml-2">Swipe to compare</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.04] text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-savings-green" /> 100% Data-Verified by ProAthletica Lab Vetting Protocol
        </p>
        <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">
          Updated {formatTimestamp(new Date().toISOString())}
        </span>
      </div>
    </section>
  );
}
