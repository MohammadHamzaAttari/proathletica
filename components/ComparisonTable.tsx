import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ShieldCheck, Star, ArrowRight } from 'lucide-react';

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

export function ComparisonTable({
  products,
  articleSlug,
  title = 'At a glance',
}: {
  products: Array<EnhancedProduct & { position?: number; custom_blurb?: string | null }>;
  articleSlug: string;
  title?: string;
}) {
  const rows = products.slice(0, 4);
  if (rows.length === 0) return null;

  return (
    <section className="product-card p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="editorial-badge editorial-badge--trending mb-3">
            <ShieldCheck className="w-3 h-3" />
            DATA-VERIFIED COMPARISON
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
            {title}
          </h2>
        </div>
        <p className="max-w-xs text-sm text-neutral-400 leading-relaxed">
          Rankings combine verified review data, specs, and price-to-performance analysis from the Athletica Lab.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.06] text-2xs font-black uppercase tracking-[0.15em] text-neutral-500">
              <th className="py-4 pr-6 w-12">Rank</th>
              <th className="py-4 pr-6 w-2/12">Product</th>
              <th className="py-4 pr-6 w-2/12">Best For</th>
              <th className="py-4 pr-8 w-4/12">Verdict & Specs</th>
              <th className="py-4 text-right w-3/12">Price & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map((product, index) => {
              const verdict = product.editorial_summary || product.custom_blurb || 'Excellent category fit with verified performance.';
              const timestamp = formatTimestamp(product.last_scraped_at);
              const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;

              return (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 pr-6 align-top">
                    <div className={`rank-badge ${index === 0 ? 'rank-badge--gold' : ''}`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td className="py-6 pr-6 align-top">
                    <div className="font-bold text-lg text-offwhite leading-tight">{product.short_title || product.title.split(' ').slice(0, 4).join(' ')}</div>
                    <div className="text-xs text-neutral-500 mt-1.5 uppercase tracking-widest font-bold">{getLabel(index, product)}</div>
                    {product.rating && (
                      <div className="mt-4 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                        <span className="text-sm font-black text-offwhite">{product.rating.toFixed(1)}</span>
                        {product.review_count && <span className="text-[10px] text-neutral-600">({formatReviewCount(product.review_count)})</span>}
                      </div>
                    )}
                  </td>
                  <td className="py-6 pr-6 align-top">
                    <div className="flex flex-col gap-3">
                      {(product.best_for_tags || []).slice(0, 3).map((tag) => (
                        <div key={tag} className="text-xs font-bold text-[#3D8BFF] leading-snug">
                          • {tag}
                        </div>
                      ))}
                      {(!product.best_for_tags || product.best_for_tags.length === 0) && (
                        <div className="text-xs font-bold text-[#3D8BFF] leading-snug">• Best in Class</div>
                      )}
                    </div>
                  </td>
                  <td className="py-6 pr-8 text-sm leading-relaxed text-neutral-300 align-top">
                    <div className="line-clamp-3">{verdict}</div>
                    {product.pros?.length ? (
                      <div className="mt-5 flex flex-col gap-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Key Specs / Pros</div>
                        {product.pros.slice(0, 2).map((item) => (
                          <span key={item} className="text-xs text-neutral-400 flex items-start gap-2">
                            <span className="text-[#C6FF3D] mt-0.5">✓</span> <span className="flex-1">{item}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-6 text-right align-top">
                    <div className="text-3xl font-black text-[#C6FF3D] tracking-tighter">
                      {formatPrice(product.price_cents)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest font-bold">as of {timestamp}</div>
                    <a
                      href={href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-neutral-200 transition active:scale-95 shadow-lg"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {rows.map((product, index) => {
          const verdict = product.editorial_summary || product.custom_blurb || 'Excellent category fit.';
          const timestamp = formatTimestamp(product.last_scraped_at);
          const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;

          return (
            <div key={product.id} className="rounded-inner border border-white/[0.06] bg-black/30 p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`rank-badge w-9 h-9 text-xs ${index === 0 ? 'rank-badge--gold' : ''}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-offwhite">{getLabel(index, product)}</div>
                    <div className="text-2xs text-neutral-500 uppercase tracking-widest mt-0.5">{product.brand}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-offwhite">{formatPrice(product.price_cents)}</div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-widest mt-0.5">{timestamp}</div>
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-neutral-200 line-clamp-1">
                {product.short_title || product.title}
              </div>

              <div className="mt-3 text-sm leading-relaxed text-neutral-400 border-l border-white/10 pl-4 py-1">
                {verdict}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                      <span className="text-sm font-black text-offwhite">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-2xs text-neutral-600 uppercase tracking-tighter">
                      {formatReviewCount(product.review_count)} REVIEWS
                    </span>
                  </div>
                )}
                <a
                  href={href}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="cta-primary min-h-[2.75rem] px-5 py-2 text-xs w-auto"
                >
                  VIEW DEAL
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
        <p className="text-2xs text-neutral-600 uppercase tracking-[0.2em] font-bold">
          Updated {formatTimestamp(new Date().toISOString())} • Data-Verified by ProAthletica Lab
        </p>
      </div>
    </section>
  );
}
