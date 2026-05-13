import { formatPrice, formatReviewCount, formatTimestamp } from '@/lib/format';
import { buildEditorialBenchmark } from '@/lib/editorial';
import type { Product } from '@/lib/types';

type RankedProduct = Product & { position?: number; custom_blurb?: string | null };

function pickLabel(index: number, product: Product) {
  if (index === 0) return 'Best overall';
  if (index === 1) return 'Best value';
  if (index === 2) return 'Budget pick';
  if (product.rating && product.rating >= 4.7) return 'Top rated';
  return 'Strong alternative';
}

function signals(product: Product) {
  const parts = [
    product.badge,
    product.rating ? `${product.rating.toFixed(1)} rating` : null,
    product.review_count ? `${formatReviewCount(product.review_count)} reviews` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : 'Editorial fit';
}

export function ComparisonTable({
  products,
  articleSlug,
  title = 'At a glance',
}: {
  products: RankedProduct[];
  articleSlug: string;
  title?: string;
}) {
  const rows = products.slice(0, 4);
  if (rows.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-emerald-500/15 bg-neutral-900/30 p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Comparison
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
            {title}
          </h2>
        </div>
        <p className="max-w-md text-sm text-neutral-400">
          Rankings combine price, ratings, review volume, category fit, and editorial analysis.
        </p>
      </div>
      
      {/* Mobile: Card layout (fixes Audit #1 mobile UX) */}
      <div className="block md:hidden space-y-6">
        {rows.map((product, index) => {
          const note = product.custom_blurb || buildEditorialBenchmark(product, index);
          const timestamp = formatTimestamp(product.last_scraped_at || product.updated_at);
          const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;
          
          return (
            <div key={product.id} className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-emerald-400 font-black text-xl">#{index + 1}</div>
                  <div className="font-black text-lg text-white mt-1">{pickLabel(index, product)}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">{formatPrice(product.price_cents, product.currency)}</div>
                  <div className="text-[10px] text-neutral-500">as of {timestamp}</div>
                </div>
              </div>
              
              <div className="font-medium text-white mb-3 text-[15px]">{product.title}</div>
              <div className="text-sm text-neutral-400 mb-4">{signals(product)}</div>
              <div className="text-sm text-neutral-300 mb-6 leading-relaxed">{note}</div>
              
              <a
                href={href}
                rel="sponsored nofollow noopener noreferrer"
                className="block w-full text-center rounded-2xl bg-[#FF9900] py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-[#ffaa1f]"
              >
                Check Price on Amazon
              </a>
              <div className="text-center text-[10px] text-neutral-600 mt-3">
                Affiliate link — commission may be earned
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <th className="py-4 pr-6">Rank</th>
              <th className="py-4 pr-6">Pick</th>
              <th className="py-4 pr-6">Signals</th>
              <th className="py-4 pr-8 w-2/5">Takeaway</th>
              <th className="py-4 pr-6">Price</th>
              <th className="py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product, index) => {
              const note = product.custom_blurb || buildEditorialBenchmark(product, index);
              const timestamp = formatTimestamp(product.last_scraped_at || product.updated_at);
              const href = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;
              
              return (
                <tr key={product.id} className="border-b border-white/5 align-top last:border-b-0 hover:bg-white/5">
                  <td className="py-6 pr-6 text-2xl font-black text-emerald-400">#{index + 1}</td>
                  <td className="py-6 pr-6">
                    <div className="font-black text-lg text-white">{pickLabel(index, product)}</div>
                    <div className="text-sm text-neutral-400 mt-1.5 pr-4">{product.title}</div>
                  </td>
                  <td className="py-6 pr-6 text-sm text-neutral-400">{signals(product)}</td>
                  <td className="py-6 pr-8 text-sm leading-relaxed text-neutral-300">{note}</td>
                  <td className="py-6 pr-6">
                    <div className="font-black text-xl text-emerald-400">
                      {formatPrice(product.price_cents, product.currency)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">as of {timestamp}</div>
                  </td>
                  <td className="py-6">
                    <a
                      href={href}
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-[#FF9900] px-7 py-3 text-sm font-black uppercase tracking-wider text-black hover:bg-[#ffaa1f]"
                    >
                      Check on Amazon
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-neutral-500">
        Prices shown are live at time of last scrape. See our{' '}
        <a href="/methodology" className="underline underline-offset-4 hover:text-white">
          testing methodology
        </a>{' '}
        for full details.
      </p>
    </section>
  );
}
