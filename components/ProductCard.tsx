import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { buildEditorialBenchmark } from '@/lib/editorial';
import { formatPrice, formatReviewCount, formatTimestamp, upgradeAmazonImage } from '@/lib/format';
import type { Product } from '@/lib/types';

/**
 * FIXED: 
 * - Amazon orange CTA (#FF9900) per audit #3
 * - "Check Price on Amazon" text + micro-disclosure
 * - Timestamp for compliance (Audit #4)
 * - Improved Image with better sizing to reduce CLS
 * - Uses upgradeAmazonImage for higher-res sources
 */

export function ProductCard({
  product,
  rank,
  articleSlug,
}: {
  product: Product & { custom_blurb?: string | null };
  rank: number;
  articleSlug: string;
}) {
  const blurb = product.custom_blurb || buildEditorialBenchmark(product, rank);
  const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${rank + 1}`;
  const timestamp = formatTimestamp(product.last_scraped_at || product.updated_at);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/40">
      <div className="relative flex aspect-square items-center justify-center bg-white p-6">
        {product.image_url ? (
          <Image
            src={upgradeAmazonImage(product.image_url)}
            alt={product.title}
            width={420}
            height={420}
            className="h-full w-full object-contain transition-transform hover:scale-105"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={rank < 3}
          />
        ) : (
          <div className="text-sm font-bold text-neutral-500">No image available</div>
        )}
        <span className="absolute right-6 top-6 rounded-2xl bg-black/80 px-3 py-1.5 text-xs font-black text-white shadow">
          #{rank + 1}
        </span>
      </div>
      <div className="space-y-5 p-7">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-400">
          {product.badge || (rank === 0 ? "Editor's Choice" : 'Strong Pick')}
        </div>
        <h3 className="text-[21px] font-black leading-tight tracking-[-0.02em] text-white">
          {product.title}
        </h3>
        {(product.rating || product.review_count) ? (
          <div className="flex items-center gap-4 text-sm text-neutral-300">
            {product.rating ? (
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
            {product.review_count ? (
              <span>{formatReviewCount(product.review_count)} reviews</span>
            ) : null}
          </div>
        ) : null}
        <p className="text-[15px] leading-relaxed text-neutral-400">{blurb}</p>
        
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-neutral-500">Current price</div>
              <div className="text-3xl font-black tracking-tighter text-emerald-400">
                {formatPrice(product.price_cents, product.currency)}
              </div>
              <div className="mt-1 text-[10px] text-neutral-500">
                as of {timestamp} • Prices change
              </div>
              <div className="mt-2 text-[10px] text-neutral-600">
                Affiliate link — we may earn a commission
              </div>
            </div>
            <a
              href={href}
              rel="sponsored nofollow noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2.5 rounded-2xl bg-[#FF9900] px-7 py-3.5 text-sm font-black uppercase tracking-[0.02em] text-black shadow-lg hover:bg-[#ffaa1f] active:scale-[0.985]"
            >
              Check Price on Amazon
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
