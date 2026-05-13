import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Testing Methodology',
  description: 'How ProAthletica ranks fitness gear using data, specs, review analysis and editorial benchmarks.',
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
          How we rank gear
        </h1>
        <p className="text-lg leading-8 text-neutral-300">
          Every recommendation must be explainable. We combine large-scale review data, 
          technical specifications, price history, and category-specific editorial benchmarks.
        </p>
      </div>
      <div className="space-y-5 text-neutral-400">
        <p>
          We begin with a category brief: the core problem the product solves, the target athlete, 
          the realistic price band, and which competitors actually matter.
        </p>
        <p>
          We pull and verify public data including current pricing, materials, dimensions, warranty terms, 
          average ratings, and review volume. Where possible we analyze sentiment patterns across thousands of reviews.
        </p>
        <p>
          When independent testing data or hands-on experience is available we disclose it clearly. 
          When it is not, we say so explicitly and rely on transparent, reproducible spec comparison and aggregated customer feedback.
        </p>
        <p>
          Final rankings weigh category fit, durability signals, real-world performance data, 
          price-to-performance ratio, and how clearly the product solves the stated use case.
        </p>
        <p className="font-medium text-white">
          Affiliate relationships do not influence rankings. A product that underperforms or is overpriced will be called out as such.
        </p>
      </div>
      <div className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6 text-sm leading-6 text-neutral-300">
        Need the compliance version? Read the{' '}
        <Link href="/disclosure" className="text-emerald-400 underline underline-offset-4">
          affiliate disclosure
        </Link>{' '}
        or learn more about{' '}
        <Link href="/about" className="text-emerald-400 underline underline-offset-4">
          our approach
        </Link>
        .
      </div>
    </article>
  );
}
