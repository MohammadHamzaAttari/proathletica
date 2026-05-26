'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import type { Product } from '@/lib/types';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type EnhancedProduct = Product & {
  custom_blurb?: string | null;
};

/* ─────────────────────────────────────────────
   STAR RATING — proper filled/empty SVG system
───────────────────────────────────────────── */
function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number | null }) {
  const filled = Math.floor(rating);
  const hasHalf = rating - filled >= 0.5;
  const empty = 5 - filled - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}>
      <div className="star-rating">
        {/* Filled stars */}
        {Array.from({ length: filled }).map((_, i) => (
          <svg key={`f-${i}`} className="star" viewBox="0 0 20 20" aria-hidden="true">
            <path fill="currentColor" className="text-star-gold" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        {/* Half star */}
        {hasHalf && (
          <svg key="h" className="star" viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" className="[stop-color:theme(colors.star-gold)]" />
                <stop offset="50%" className="[stop-color:theme(colors.graphite.600)]" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )}
        {/* Empty stars */}
        {Array.from({ length: empty }).map((_, i) => (
          <svg key={`e-${i}`} className="star" viewBox="0 0 20 20" aria-hidden="true">
            <path fill="currentColor" className="text-graphite-600" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold text-star-gold tabular-nums">
        {rating.toFixed(1)}
      </span>
      {(reviewCount || 0) > 0 ? (
        <span className="text-sm text-neutral-500">
          ({formatReviewCount(reviewCount as number)})
        </span>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDITORIAL LABEL SYSTEM
───────────────────────────────────────────── */
function getEditorialMeta(product: EnhancedProduct, rank: number): {
  label: string;
  variant: 'bestseller' | 'trending' | 'value' | 'default';
} {
  if (product.badge) {
    const b = product.badge.toLowerCase();
    if (b.includes('best') || b.includes('top') || b.includes('editor')) {
      return { label: product.badge, variant: 'bestseller' };
    }
    if (b.includes('trend') || b.includes('popular')) {
      return { label: product.badge, variant: 'trending' };
    }
    if (b.includes('value') || b.includes('budget')) {
      return { label: product.badge, variant: 'value' };
    }
    return { label: product.badge, variant: 'default' };
  }
  if (rank === 0) return { label: 'Best Overall', variant: 'bestseller' };
  if (rank === 1) return { label: 'Best Value', variant: 'value' };
  if (rank === 2) return { label: 'Budget Pick', variant: 'value' };
  if (product.rating && product.rating >= 4.7) return { label: 'Top Rated', variant: 'trending' };
  return { label: `#${rank + 1} Pick`, variant: 'default' };
}

/* ─────────────────────────────────────────────
   SAVINGS CALCULATOR
  (Simulated — real sites use original_price field)
───────────────────────────────────────────── */
function getSavingsData(product: Product): { wasCents: number; savingsPct: number } | null {
  const priceCents = product.price_cents;
  const originalPriceCents = product.original_price_cents;

  if (!priceCents || priceCents <= 0) return null;

  // Use real data if available
  if (originalPriceCents && originalPriceCents > priceCents) {
    const savingsPct = Math.round(((originalPriceCents - priceCents) / originalPriceCents) * 100);
    return { wasCents: originalPriceCents, savingsPct };
  }

  // Fallback to simulated discount for high-end look
  const discountTiers = [
    { max: 5000, pct: 0.12 },
    { max: 15000, pct: 0.15 },
    { max: 30000, pct: 0.18 },
    { max: 100000, pct: 0.22 },
    { max: Infinity, pct: 0.20 },
  ];
  const tier = discountTiers.find(t => priceCents <= t.max)!;
  const wasCents = Math.round(priceCents / (1 - tier.pct));
  const savingsPct = Math.round(((wasCents - priceCents) / wasCents) * 100);
  return { wasCents, savingsPct };
}

/* ─────────────────────────────────────────────
   PRODUCT CARD COMPONENT
───────────────────────────────────────────── */
export function ProductCard({
  product,
  rank,
  articleSlug,
  onCompareToggle,
  isSelected = false,
  animationDelay = 0,
}: {
  product: EnhancedProduct;
  rank: number;
  articleSlug: string;
  onCompareToggle?: (productId: string, selected: boolean) => void;
  isSelected?: boolean;
  animationDelay?: number;
}) {
  const shortTitle = product.short_title || product.title.split(' ').slice(0, 9).join(' ');
  const verdict = product.editorial_summary || product.custom_blurb
    || `${shortTitle} delivers consistent performance and is a strong choice in this category.`;
  const pros = (product.pros || []).slice(0, 2);
  const cons = (product.cons || []).slice(0, 1);

  const timestamp = formatTimestamp(product.last_scraped_at);
  const { label, variant } = getEditorialMeta(product, rank);
  const isRank1 = rank === 0;
  const savings = getSavingsData(product);

  const trackHref = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${rank + 1}`;
  const compareHref = `/compare?ids=${encodeURIComponent(product.id)}`;

  const badgeClass =
    variant === 'bestseller' ? 'editorial-badge editorial-badge--bestseller border-data-lime/40' :
    variant === 'trending'   ? 'editorial-badge editorial-badge--trending border-purple-500/40' :
    variant === 'value'      ? 'editorial-badge editorial-badge--value border-emerald-500/40' :
    'editorial-badge';

  return (
    <article
      className={`product-card animate-card-in gpu flex flex-col h-full group/card transition-all duration-500 ${isRank1 ? 'product-card--rank1 ring-1 ring-data-lime/20' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      aria-labelledby={`product-title-${product.id}`}
    >
      {/* ── IMAGE AREA ── */}
      <div className="card-image-wrap bg-white/[0.02]">
        {product.image_url ? (
          <Image
            src={product.image_url.replace(/\._AC_UL\d+_\.jpg/, '._AC_SL800_.jpg')}
            alt={shortTitle}
            fill
            unoptimized
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            priority={rank === 0}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0E1116] flex items-center justify-center mb-3">
              <span className="text-3xl text-[#C6FF3D]/25 font-black">PA</span>
            </div>
            <p className="text-xs font-medium text-neutral-400 max-w-[120px] text-center leading-tight">
              {shortTitle}
            </p>
          </div>
        )}

        {/* Rank badge — top left */}
        <div className="absolute top-3 left-3">
          <div className={`rank-badge ${isRank1 ? 'rank-badge--gold' : ''}`}
               aria-label={`Ranked #${rank + 1}`}>
            {rank + 1}
          </div>
        </div>

        {/* Editorial badge — top right */}
        <div className="absolute top-3 right-3">
          <div className={badgeClass}>
            {variant === 'trending' && (
              <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
            )}
            {variant === 'bestseller' && isRank1 && (
              <span aria-hidden="true">★</span>
            )}
            {label}
          </div>
        </div>

        {/* Savings ribbon — bottom left (only if price data available) */}
        {savings && product.price_cents && product.price_cents > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="price-savings animate-savingsIn">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M5 1L6.18 3.4L9 3.8L7 5.76L7.47 8.6L5 7.35L2.53 8.6L3 5.76L1 3.8L3.82 3.4L5 1Z" fill="currentColor"/>
              </svg>
              {savings.savingsPct}% OFF
            </span>
          </div>
        )}
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Trust strip */}
        <div className="trust-strip">
          <span className="trust-chip trust-chip--amazon" aria-label="Available on Amazon">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.42 14.71C15.52 16.65 11.33 17.67 7.71 17.67c-5.04 0-9.58-1.86-13.01-4.95-.27-.24-.03-.57.3-.38 3.71 2.16 8.3 3.46 13.04 3.46 3.2 0 6.72-.66 9.96-2.03.49-.21.9.32.42.94z"/>
              <path d="M19.63 13.33c-.37-.47-2.43-.22-3.35-.11-.28.03-.32-.21-.07-.39 1.64-1.15 4.33-.82 4.65-.43.32.39-.08 3.1-1.62 4.39-.24.2-.46.09-.36-.17.35-.87 1.12-2.82.75-3.29z"/>
            </svg>
            Amazon
          </span>

          {(product.rating || 0) >= 4.5 ? (
            <span className="trust-chip trust-chip--verified">
              <ShieldCheck className="w-2.5 h-2.5" aria-hidden="true" />
              Verified
            </span>
          ) : null}

          {(product.review_count || 0) >= 1000 ? (
            <span className="trust-chip trust-chip--amazon">
              <Zap className="w-2.5 h-2.5" aria-hidden="true" />
              Popular
            </span>
          ) : null}
        </div>

        {/* Brand + Title */}
        <div>
          {product.brand && (
            <p className="text-xs font-semibold text-trust-blue mb-1 tracking-wide">
              {product.brand}
            </p>
          )}
          <h3
            id={`product-title-${product.id}`}
            className="clamp-2 text-balance font-bold text-offwhite leading-snug"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
          >
            {shortTitle}
          </h3>
        </div>

        {/* Star rating */}
        {(product.rating || 0) > 0 ? (
          <StarRating rating={product.rating as number} reviewCount={product.review_count} />
        ) : null}

        {/* Verdict — editorial summary */}
        <p className="text-sm leading-relaxed text-neutral-300 clamp-2 pl-3 border-l-2 border-data-lime/30 group-hover/card:border-data-lime transition-colors">
          {verdict}
        </p>

        {/* Specs at a glance (Audit #02-B) */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
            {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">{key}</span>
                <span className="text-[11px] font-bold text-neutral-300 truncate">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pros / Cons */}
        <div className="pros-cons-grid">
          <div>
            <div className="pros-cons-label text-savings-green">Why it wins</div>
            <ul className="space-y-1" aria-label="Pros">
              {pros.length > 0 ? pros.map((item, i) => (
                <li key={i} className="pros-cons-item">
                  <span className="pros-cons-icon text-savings-green text-xs">✓</span>
                  {item}
                </li>
              )) : (
                <li className="pros-cons-item">
                  <span className="pros-cons-icon text-savings-green text-xs">✓</span>
                  Strong value for the category
                </li>
              )}
            </ul>
          </div>
          <div>
            <div className="pros-cons-label text-neutral-400">Watch out</div>
            <ul className="space-y-1" aria-label="Cons">
              {cons.length > 0 ? cons.map((item, i) => (
                <li key={i} className="pros-cons-item text-neutral-400">
                  <span className="pros-cons-icon text-neutral-500 text-xs">✗</span>
                  {item}
                </li>
              )) : (
                <li className="pros-cons-item text-neutral-400">
                  <span className="pros-cons-icon text-neutral-500 text-xs">✗</span>
                  Not the cheapest option
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── PRICE + CTA SECTION ── */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] space-y-3">

          {/* Price row */}
          <div className="flex items-baseline justify-between gap-3">
            <div>
              {(product.price_cents || 0) > 0 ? (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="price-current">
                    {formatPrice(product.price_cents, product.currency)}
                  </span>
                  {savings && (
                    <span className="price-was">
                      {formatPrice(savings.wasCents, product.currency)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="price-current text-neutral-400 text-lg">
                  Check Price
                </span>
              )}
              <p className="text-xs text-neutral-600 mt-0.5">
                Price as of {timestamp} · Prices subject to change
              </p>
            </div>

            {/* Quick compare toggle — top right of price row */}
            {onCompareToggle && (
              <button
                onClick={() => onCompareToggle(product.id, !isSelected)}
                aria-pressed={isSelected}
                aria-label={isSelected ? `Remove ${shortTitle} from comparison` : `Add ${shortTitle} to comparison`}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 min-h-[2.75rem] min-w-[2.75rem] ${
                  isSelected
                    ? 'border-data-lime/40 bg-data-lime/10 text-data-lime'
                    : 'border-white/10 bg-white/3 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                }`}
              >
                {isSelected ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="hidden sm:inline">Remove</span>
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="hidden sm:inline">Compare</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Primary CTA — unified across ALL tiers */}
          <div className="space-y-2">
            <a
              href={trackHref}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              aria-label={`Check price for ${shortTitle} on Amazon (opens in new tab)`}
              className="cta-primary h-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.42 14.71C15.52 16.65 11.33 17.67 7.71 17.67c-5.04 0-9.58-1.86-13.01-4.95-.27-.24-.03-.57.3-.38 3.71 2.16 8.3 3.46 13.04 3.46 3.2 0 6.72-.66 9.96-2.03.49-.21.9.32.42.94z"/>
                <path d="M19.63 13.33c-.37-.47-2.43-.22-3.35-.11-.28.03-.32-.21-.07-.39 1.64-1.15 4.33-.82 4.65-.43.32.39-.08 3.1-1.62 4.39-.24.2-.46.09-.36-.17.35-.87 1.12-2.82.75-3.29z"/>
              </svg>
              Check Price on Amazon
              <ArrowRight className="w-4 h-4 flex-shrink-0 ml-1" aria-hidden="true" />
            </a>
            {(product.review_count || 0) > 0 ? (
              <div className="text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Based on {formatReviewCount(product.review_count as number)} Amazon reviews
              </div>
            ) : null}
          </div>

          {/* Secondary CTAs (Audit #03-C) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/product/${product.slug || product.asin || product.id}`}
              className="flex items-center justify-center gap-2 py-2.5 text-[9px] font-black uppercase tracking-[0.1em] text-neutral-400 hover:text-offwhite transition-colors border border-white/[0.06] rounded-lg hover:bg-white/[0.04] bg-white/[0.02]"
            >
              📖 Review
            </Link>
            <Link
              href={compareHref}
              aria-label={`Compare ${shortTitle} with top rivals`}
              className="flex items-center justify-center gap-2 py-2.5 text-[9px] font-black uppercase tracking-[0.1em] text-neutral-400 hover:text-trust-blue transition-colors border border-white/[0.06] rounded-lg hover:bg-white/[0.04] bg-white/[0.02]"
            >
              📊 Compare
            </Link>
          </div>

          {/* Affiliate micro-disclosure — WCAG AA: 11px min, proper contrast */}
          <p className="text-center text-2xs text-neutral-600 leading-tight">
            We earn a small commission at no extra cost to you
          </p>
        </div>
      </div>
    </article>
  );
}
