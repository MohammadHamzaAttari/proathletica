import Link from 'next/link';
import { formatPrice, formatReviewCount } from '@/lib/format';
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
  const parts = [product.badge, product.rating ? `${product.rating.toFixed(1)} rating` : null, product.review_count ? `${formatReviewCount(product.review_count)} reviews` : null].filter(Boolean);
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
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Comparison
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        <p className="max-w-xl text-sm text-neutral-400">
          We rank these picks using listed price, visible ratings, review counts, category fit, and
          the editorial notes attached to each product.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <th className="py-3 pr-4">Rank</th>
              <th className="py-3 pr-4">Pick</th>
              <th className="py-3 pr-4">Signals</th>
              <th className="py-3 pr-4">Takeaway</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product, index) => {
              const note = product.custom_blurb || buildEditorialBenchmark(product, index);
              const href = `/api/track?productId=${encodeURIComponent(product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=${index + 1}`;

              return (
                <tr key={product.id} className="border-b border-white/5 align-top last:border-b-0">
                  <td className="py-4 pr-4 text-sm font-black text-emerald-400">#{index + 1}</td>
                  <td className="py-4 pr-4">
                    <div className="font-black uppercase italic tracking-tight text-white">
                      {pickLabel(index, product)}
                    </div>
                    <div className="mt-1 text-sm text-neutral-400">{product.title}</div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-neutral-400">{signals(product)}</td>
                  <td className="py-4 pr-4 text-sm leading-6 text-neutral-300">{note}</td>
                  <td className="py-4 pr-4 text-sm font-black text-white">
                    {formatPrice(product.price_cents, product.currency)}
                  </td>
                  <td className="py-4 pr-0">
                    <Link
                      href={href}
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20"
                    >
                      Check price
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Methodology details live on the <Link href="/methodology" className="underline underline-offset-4">testing methodology</Link> page.
      </p>
    </section>
  );
}