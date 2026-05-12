import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Testing Methodology',
  description: 'How ProAthletica evaluates fitness gear, ranks products, and labels recommendations.',
  canonical: '/methodology',
});

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-8">
      <div className="space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Editorial process
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
          Testing methodology
        </h1>
        <p className="text-lg leading-8 text-neutral-300">
          We publish fitness gear recommendations only when we can explain why a product earned its
          place, what the tradeoffs are, and what evidence supports the ranking.
        </p>
      </div>

      <div className="space-y-5 text-neutral-400">
        <p>
          Every guide starts with a category brief: what problem the product solves, who it is for,
          the price band it sits in, and which competitors matter most.
        </p>
        <p>
          We then verify the public facts that can be checked directly, including price, materials,
          specs, ratings, review volume, dimensions, and warranty language when it is available.
        </p>
        <p>
          When hands-on testing is available, we call it out explicitly. When it is not, we say so and
          rely on transparent spec comparison instead of pretending to have used the item.
        </p>
        <p>
          Rankings are based on a mix of category fit, durability signals, price-to-performance, and
          how clearly the product solves the use case described in the guide.
        </p>
        <p>
          Affiliate links do not change a recommendation. If a product is weak, overpriced, or
          overhyped, we say that plainly.
        </p>
      </div>

      <div className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6 text-sm leading-6 text-neutral-300">
        Need the compliance version? Read the <Link href="/disclosure" className="text-emerald-400 underline underline-offset-4">affiliate disclosure</Link> or learn more <Link href="/about" className="text-emerald-400 underline underline-offset-4">about the site</Link>.
      </div>
    </article>
  );
}