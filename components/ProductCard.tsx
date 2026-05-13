import Image from 'next/image';
import { ArrowRight, Plus, Star, X } from 'lucide-react';
import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import type { Product } from '@/lib/types';

type EnhancedProduct = Product & {
  custom_blurb?: string | null;
};

function getEditorialLabel(product: EnhancedProduct, rank: number): string {
  if (product.badge) return product.badge;
  if (rank === 0) return "Best Overall";
  if (rank === 1) return "Best Value";
  if (rank === 2) return "Budget Pick";
  if (product.rating && product.rating >= 4.7) return "Top Rated";
  return "Strong Alternative";
}

function getCTATier(rank: number, badge?: string | null): 'tier1' | 'tier2' | 'tier3' {
  if (rank === 0 || (badge && (badge.includes('Best') || badge.includes('Top')))) return 'tier1';
  if (rank < 10) return 'tier2';
  return 'tier3';
}

export function ProductCard({
  product,
  rank,
  articleSlug,
  onCompareToggle,
  isSelected = false,
}: {
  product: EnhancedProduct;
  rank: number;
  articleSlug: string;
  onCompareToggle?: (productId: string, selected: boolean) => void;
  isSelected?: boolean;
}) {
  const shortTitle = product.short_title || product.title.split(' ').slice(0, 8).join(' ');
  const verdict = product.editorial_summary || product.custom_blurb || 
    `${shortTitle} offers strong performance with clear tradeoffs in this category.`;
  
  const timestamp = formatTimestamp(product.last_scraped_at);
  const tier = getCTATier(rank, product.badge);
  const label = getEditorialLabel(product, rank);
  
  const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${rank + 1}`;

  const handleCompare = () => {
    onCompareToggle?.(product.id, !isSelected);
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#161B22] transition-all hover:-translate-y-2 hover:border-[#C6FF3D]/30">
      {/* Image area with fallback */}
      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url.replace('._AC_UL320_.jpg', '._AC_SL800_.jpg')}
            alt={shortTitle}
            width={420}
            height={420}
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={rank < 4}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#0E1116] flex items-center justify-center mb-4">
              <span className="text-4xl text-[#C6FF3D]/30 font-black">PA</span>
            </div>
            <div className="text-xs font-medium text-neutral-400 max-w-[140px]">{shortTitle}</div>
          </div>
        )}

        {/* Rank badge */}
        <div className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-2xl bg-black font-black text-[#C6FF3D] shadow-xl ring-2 ring-[#C6FF3D]/20">
          {rank + 1}
        </div>

        {/* Editorial label */}
        <div className="absolute top-5 right-5 rounded-2xl bg-black/90 px-4 py-1 text-xs font-black tracking-wider text-[#C6FF3D]">
          {label}
        </div>

        {/* Compare checkbox */}
        {onCompareToggle && (
          <button
            onClick={handleCompare}
            className={`absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-2xl border transition-all ${
              isSelected 
                ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 text-[#C6FF3D]' 
                : 'border-white/30 bg-black/70 hover:border-white/60'
            }`}
          >
            {isSelected ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="p-7 space-y-6">
        <div>
          <h3 className="line-clamp-2 text-[21px] font-black leading-tight tracking-[-0.02em] text-offwhite">
            {shortTitle}
          </h3>
          {product.brand && (
            <p className="mt-1.5 text-sm text-[#3D8BFF] font-medium">{product.brand}</p>
          )}
        </div>

        {/* Rating */}
        {(product.rating || product.review_count) && (
          <div className="flex items-center gap-5">
            {product.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-[#C6FF3D] text-[#C6FF3D]" />
                <span className="font-semibold text-lg text-offwhite">{product.rating.toFixed(1)}</span>
              </div>
            )}
            {product.review_count && product.review_count > 0 && (
              <div className="text-sm text-neutral-400">
                {formatReviewCount(product.review_count)} reviews
              </div>
            )}
          </div>
        )}

        {/* Editor's Verdict - Critical fix for Problem 2 */}
        <div className="text-[15px] leading-relaxed text-neutral-300 line-clamp-3 border-l-2 border-[#C6FF3D]/40 pl-4">
          {verdict}
        </div>

        {/* Price + CTA */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs tracking-widest text-neutral-500">LIVE PRICE</div>
              <div className="text-4xl font-black text-[#C6FF3D] tracking-tighter">
                {formatPrice(product.price_cents, product.currency)}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                as of {timestamp}
              </div>
            </div>

            {tier === 'tier1' ? (
              /* Tier 1 - Large prominent CTA (Best Overall / Best Value) */
              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="flex-shrink-0 group-hover:scale-105 transition-transform bg-[#FF6B1A] hover:bg-[#ff8a4d] text-black font-black uppercase tracking-[0.04em] px-8 py-5 rounded-2xl text-sm flex items-center gap-3 shadow-2xl shadow-[#FF6B1A]/40"
              >
                SEE TODAY&apos;S PRICE
                <ArrowRight className="h-5 w-5" />
              </a>
            ) : tier === 'tier2' ? (
              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="flex-shrink-0 rounded-2xl border border-white/30 bg-white/5 px-7 py-4 font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
              >
                Check Price →
              </a>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="text-sm text-neutral-400 hover:text-offwhite underline underline-offset-4 transition-colors"
              >
                See price
              </a>
            )}
          </div>

          <div className="text-center mt-4 text-[10px] text-neutral-600">
            We may earn a small commission • Price you pay is the same
          </div>
        </div>
      </div>
    </article>
  );
}
