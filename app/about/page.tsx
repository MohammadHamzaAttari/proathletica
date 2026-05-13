import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'About Us',
  description: 'How ProAthletica uses real customer data, specs, and AI analysis to rank fitness equipment.',
  canonical: '/about',
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        About ProAthletica
      </h1>
      <p className="text-lg leading-8 text-neutral-300">
        ProAthletica delivers data-driven fitness gear recommendations using thousands of verified customer reviews,
        technical specifications, and structured AI analysis.
      </p>
      <div className="space-y-5 text-neutral-400">
        <p>
          We focus on real-world performance signals: durability indicators, price-to-performance ratio, 
          review sentiment patterns, and category-specific tradeoffs. Rankings are never influenced by affiliate commissions.
        </p>
        <p>
          Where hands-on testing data exists we highlight it. Most rankings are built from transparent, 
          publicly verifiable data sources and editorial benchmarks developed over years of category research.
        </p>
        <p>
          Our goal is to cut through marketing noise and give athletes clear, evidence-based guidance so they 
          can buy the right equipment the first time.
        </p>
        <p>
          As an Amazon Associate we earn from qualifying purchases. Some outbound links on this site are affiliate links. 
          If you click one and buy something, we may earn a commission at no extra cost to you. This never affects our rankings.
        </p>
        <p>
          You can read the full <a href="/methodology" className="text-emerald-400 underline underline-offset-4">testing methodology</a> for complete transparency.
        </p>
      </div>
      <div className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6 text-sm leading-6 text-neutral-300">
        Questions about our process? <a href="/contact" className="text-emerald-400 underline underline-offset-4">Get in touch</a>.
      </div>
    </article>
  );
}
