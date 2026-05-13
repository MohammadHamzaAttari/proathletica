import Link from 'next/link';
import { FlaskConical, ShieldCheck, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleSchema, howToSchema, jsonLdProps } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/config';

export const metadata = buildMetadata({
  title: 'Our Methodology',
  description: 'How ProAthletica ranks fitness gear using the Athletica Lab protocol: data aggregation, spec verification, and editorial oversight.',
  canonical: '/methodology',
});

const PILLARS = [
  {
    icon: Target,
    title: 'Category Fit',
    desc: 'We define the specific training problem (e.g., small-space cardio) before looking at gear. If a product doesn\'t solve a clear problem, it doesn\'t get ranked.',
  },
  {
    icon: FlaskConical,
    title: 'Spec Verification',
    desc: 'We verify materials (steel gauges, fabric tech), warranty terms, and dimensions against manufacturer data. No marketing fluff allowed.',
  },
  {
    icon: Users,
    title: 'Sentiment Analysis',
    desc: 'We aggregate 47,000+ data points from verified customer reviews to identify long-term durability patterns that a 1-week test might miss.',
  },
  {
    icon: TrendingUp,
    title: 'Price/Performance',
    desc: 'The best overall pick isn\'t the cheapest or most expensive—it\'s the one with the highest utility per dollar spent over a 3-5 year lifespan.',
  },
];

export default function MethodologyPage() {
  const schema = articleSchema({
    title: 'The Athletica Lab Protocol: How We Rank Fitness Gear',
    excerpt: 'Rankings should be explainable, repeatable, and honest. We combine large-scale review data with technical specs and editorial oversight to cut through the noise.',
    slug: 'methodology',
    author: 'ProAthletica Editorial Board',
    published_at: '2026-05-13T00:00:00Z',
    updated_at: new Date().toISOString(),
  } as any, '/methodology');

  const howTo = howToSchema({
    name: 'How We Rank Fitness Equipment',
    description: 'Our proprietary Athletica Lab scoring system uses a 4-step data aggregation and verification process.',
    steps: [
      { name: 'Category Definition', text: 'Define the training problem and target athlete persona (e.g., beginner, small-space, heavy-lifter).' },
      { name: 'Spec Verification', text: 'Cross-reference manufacturer technical data, material gauges, and warranty coverage.' },
      { name: 'Sentiment Analysis', text: 'Aggregate 47,000+ data points from verified customer reviews for long-term durability insights.' },
      { name: 'Editorial Oversight', text: 'Human experts assign final rankings based on utility-per-dollar and real-world performance.' },
    ],
  });

  return (
    <article className="mx-auto max-w-4xl space-y-16 px-4 py-20 sm:px-8">
      <script {...jsonLdProps([schema, howTo])} />
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-pill border border-data-lime/25 bg-data-lime/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-data-lime">
          <FlaskConical className="w-3 h-3" aria-hidden="true" />
          The Athletica Lab Protocol
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight text-white leading-none">
          How we rank gear
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-neutral-400">
          Rankings should be explainable, repeatable, and honest. We combine large-scale review data with technical specs and editorial oversight to cut through the noise.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-card border border-white/[0.06] bg-graphite-800 p-6 sm:p-8 space-y-4 hover:border-data-lime/20 transition-colors">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-trust-blue/20 bg-trust-blue/5 text-trust-blue">
              <p.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-offwhite">{p.title}</h2>
            <p className="text-sm leading-relaxed text-neutral-400">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Detailed Process */}
      <div className="space-y-8 border-t border-white/[0.06] pt-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">The Independent Standard</h2>
          <div className="space-y-6 text-base leading-relaxed text-neutral-400">
            <p>
              We begin with a category brief: the core training problem the product solves, the target athlete (Beginner, Apartment Dweller, Powerlifter), and a realistic price band.
            </p>
            <p>
              Our internal engine pulls and verifies public data including current pricing, material compositions, footprint dimensions, and warranty coverage. We emphasize <strong className="text-white">Total Cost of Ownership</strong>—how much a product actually costs when you factor in durability and necessary accessories.
            </p>
            <p>
              When independent testing data or hands-on experience is available from our editorial team, we highlight it with the <span className="text-trust-blue font-bold">"Verified"</span> chip. When it is not, we rely on transparent, reproducible spec comparisons and aggregated customer feedback.
            </p>
          </div>
        </div>

        {/* Integrity Note */}
        <div className="rounded-card border border-cta-orange/20 bg-cta-orange/5 p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-cta-orange flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="space-y-2">
              <h3 className="font-black uppercase tracking-wider text-cta-orange">Editorial Integrity</h3>
              <p className="text-sm leading-relaxed text-neutral-300">
                Affiliate relationships <strong className="text-white">never</strong> influence rankings. A product that underperforms or is overpriced will be flagged, regardless of commission rates. Our goal is to save you money by helping you buy the right equipment the first time.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-10 border-t border-white/[0.06]">
          <Link href="/" className="cta-primary w-auto px-8">
            See Top Picks
          </Link>
          <Link href="/about" className="text-sm font-bold text-neutral-500 hover:text-white transition-colors">
            Meet the editorial team →
          </Link>
        </div>
      </div>
    </article>
  );
}
