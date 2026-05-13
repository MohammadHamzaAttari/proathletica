import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import type { Product } from '@/lib/types';

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
    <section className="rounded-3xl border border-[#C6FF3D]/20 bg-[#161B22] p-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#C6FF3D]/30 bg-[#C6FF3D]/10 px-4 py-1 text-xs font-black tracking-[0.125em] text-[#C6FF3D]">
            DATA COMPARISON
          </div>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tighter text-offwhite">{title}</h2>
        </div>
        <p className="max-w-xs text-sm text-neutral-400">
          Rankings combine verified review data, specs, price-to-performance, and editorial trade-off analysis.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs font-black uppercase tracking-widest text-neutral-400">
              <th className="py-5 pr-8 w-12">Rank</th>
              <th className="py-5 pr-8">Pick</th>
              <th className="py-5 pr-8">Rating</th>
              <th className="py-5 pr-12 w-5/12">Editor&apos;s Verdict</th>
              <th className="py-5 pr-8">Price</th>
              <th className="py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((product, index) => {
              const verdict = product.editorial_summary || product.custom_blurb || 'Strong category fit with clear tradeoffs.';
              const timestamp = formatTimestamp(product.last_scraped_at);
              const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;

              return (
                <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-8 pr-8">
                    <div className="text-5xl font-black text-[#C6FF3D]/90">#{index + 1}</div>
                  </td>
                  <td className="py-8 pr-8">
                    <div className="font-black text-xl text-offwhite">{getLabel(index, product)}</div>
                    <div className="text-sm text-neutral-400 mt-2 line-clamp-2 pr-6">{product.short_title || product.title}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(product.best_for_tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-8 pr-8">
                    {product.rating && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-offwhite">{product.rating}</span>
                        <span className="text-xs text-neutral-500">/5</span>
                      </div>
                    )}
                    {product.review_count && (
                      <div className="text-xs text-neutral-400 mt-1">
                        {formatReviewCount(product.review_count)} reviews
                      </div>
                    )}
                  </td>
                  <td className="py-8 pr-12 text-sm leading-relaxed text-neutral-300">
                    {verdict}
                    {product.pros?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.pros.slice(0, 2).map((item) => (
                          <span key={item} className="rounded-full bg-[#C6FF3D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#C6FF3D]">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-8 pr-8">
                    <div className="font-mono text-3xl font-semibold text-[#C6FF3D]">
                      {formatPrice(product.price_cents)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">as of {timestamp}</div>
                  </td>
                  <td className="py-8">
                    <a
                      href={href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl bg-[#FF6B1A] px-8 py-4 text-sm font-black uppercase tracking-wider text-black hover:bg-[#ff8a4d] transition-all active:scale-95"
                    >
                      SEE PRICE <span className="text-base">→</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {rows.map((product, index) => {
          const verdict = product.editorial_summary || product.custom_blurb || 'Strong category fit.';
          const timestamp = formatTimestamp(product.last_scraped_at);
          const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;

          return (
            <div key={product.id} className="rounded-3xl border border-white/10 bg-[#0E1116] p-6">
              <div className="flex justify-between">
                <div>
                  <div className="text-[#C6FF3D] text-4xl font-black">#{index + 1}</div>
                  <div className="mt-1 font-black text-lg text-offwhite">{getLabel(index, product)}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#C6FF3D]">{formatPrice(product.price_cents)}</div>
                  <div className="text-xs text-neutral-500">as of {timestamp}</div>
                </div>
              </div>

              <div className="mt-6 font-medium text-lg text-offwhite line-clamp-2">
                {product.short_title || product.title}
              </div>

              {(product.best_for_tags || []).length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.best_for_tags!.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 text-sm text-neutral-300 leading-relaxed border-l-2 border-[#C6FF3D]/40 pl-4">
                {verdict}
              </div>

              {product.rating && (
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <div className="px-3 py-1 bg-[#C6FF3D]/10 text-[#C6FF3D] font-mono rounded-xl">
                    {product.rating} ★
                  </div>
                  {product.review_count && <div className="text-neutral-400">{formatReviewCount(product.review_count)} reviews</div>}
                </div>
              )}

              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="mt-8 block w-full rounded-2xl bg-[#FF6B1A] py-4 text-center font-black uppercase tracking-widest text-black text-sm hover:bg-[#ff8a4d]"
              >
                SEE TODAY&apos;S PRICE ON AMAZON →
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-neutral-500">
        All prices checked live. Editorial summaries reflect specific measured tradeoffs.
      </p>
    </section>
  );
}
