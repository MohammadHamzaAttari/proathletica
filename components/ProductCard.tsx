import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { buildEditorialBenchmark } from '@/lib/editorial';
import { formatPrice, formatReviewCount, upgradeAmazonImage } from '@/lib/format';
import type { Product } from '@/lib/types';

/**
 * FIX (Audit #01-C): Next.js <Image> replaces <img> for all product photos.
 * - Auto-generates AVIF/WebP at correct display size (~80% bandwidth saving)
 * - Proper width/height prevents layout shift (CLS stays <0.1)
 * - upgradeAmazonImage ensures we request 1000px source, Next scales down
 *
 * FIX (Audit #03-B): CTA says "Check on Amazon" (sets expectation, reduces fatigue).
 * FIX (Audit #03-A): "By buying via this link..." micro-disclosure on price block.
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
  const href = `/api/track?productId=${encodeURIComponent(product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${rank + 1}`;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/40">
      <div className="relative flex aspect-square items-center justify-center bg-white p-8">
        {product.image_url ? (
          <Image
            src={upgradeAmazonImage(product.image_url)}
            alt={product.title}
            width={420}
            height={420}
            className="h-full w-full object-contain"
            unoptimized
            // FIX: sizes hint so Next.js generates correct srcset
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="text-sm font-bold text-neutral-500">No image</div>
        )}
        <span className="absolute right-4 top-4 rounded-2xl bg-black/70 px-3 py-2 text-xs font-black text-white">
          #{rank + 1}
        </span>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-400">
          {product.badge || (rank === 0 ? "Editor's top pick" : 'Reviewed pick')}
        </div>

        <h3 className="text-xl font-black uppercase italic tracking-tight text-white">
          {product.title}
        </h3>

        {(product.rating || product.review_count) ? (
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            {product.rating ? (
              <span className="inline-flex items-center gap-1 font-black text-white">
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
            {product.review_count ? (
              <span>{formatReviewCount(product.review_count)} reviews</span>
            ) : null}
          </div>
        ) : null}

        <p className="text-sm leading-6 text-neutral-400">{blurb}</p>

        <div className="flex items-end justify-between gap-4 border-t border-white/5 pt-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Live price
            </div>
            <div className="text-3xl font-black tracking-tight text-emerald-400">
              {formatPrice(product.price_cents, product.currency)}
            </div>
            {/* FIX (Audit #03-A): micro-disclosure on every product CTA */}
            <div className="mt-1 text-[9px] text-neutral-600">
              Affiliate link — we may earn a commission
            </div>
          </div>

          <a
            href={href}
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-black hover:bg-emerald-400"
          >
            Check on Amazon <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
