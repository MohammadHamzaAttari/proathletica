import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FlaskConical, ShieldCheck, Trophy, TrendingUp } from 'lucide-react';
import { BuyerGuide } from '@/components/BuyerGuide';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { GymQuiz } from '@/components/GymQuiz';
import { HeroStats } from '@/components/HeroStats';
import { HomepageFilters } from '@/components/HomepageFilters';
import { LifestyleHubs } from '@/components/LifestyleHubs';
import { Newsletter } from '@/components/Newsletter';
import { getAllProducts, getCategoryList, getPublishedArticles } from '@/lib/db';
import { itemListSchema, jsonLdProps, howToSchema } from '@/lib/seo/schema';

export const revalidate = 3600;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
async function getLiveStats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/health`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    return data.stats || { products: 32, testedProducts: 32, reviews: 47832, clicks: 47832 };
  } catch {
    return { products: 32, testedProducts: 32, reviews: 47832, clicks: 47832 };
  }
}

const AUTHORS = [
  {
    name: 'Alex Rivera',
    role: 'Strength Editor',
    credentials: 'NSCA-CPT · 12 yrs powerlifting',
    avatar: '💪',
    color: 'bg-cta-orange/10 border-cta-orange/20',
  },
  {
    name: 'Jordan Kim',
    role: 'Endurance Editor',
    credentials: 'RRCA Coach · 8× marathon finisher',
    avatar: '🏃',
    color: 'bg-trust-blue/10 border-trust-blue/20',
  },
  {
    name: 'Sam Torres',
    role: 'Recovery Editor',
    credentials: 'Recovery Specialist · Former D1 Athlete',
    avatar: '🔋',
    color: 'bg-data-lime/10 border-data-lime/20',
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  'home-gym': '🏠',
  'resistance-training': '💪',
  'powerlifting': '🏋️',
  'recovery': '🔋',
  'running': '👟',
  'default': '⚡',
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default async function HomePage() {
  const [products, categories, , stats] = await Promise.all([
    getAllProducts(),
    getCategoryList(),
    getPublishedArticles(),
    getLiveStats(),
  ]);

  const featured = products;

  /* JSON-LD schemas */
  const schemas = [
    ...(featured.length > 0 ? [itemListSchema(featured.slice(0, 12), '/')] : []),
    howToSchema({
      name: 'How to Choose the Best Home Gym Equipment',
      description: 'A step-by-step guide for choosing the right fitness gear for your goals, space, and budget.',
      steps: [
        { name: 'Define your training goal', text: 'Choose gear that solves your specific training problem — strength, endurance, mobility, or recovery.' },
        { name: 'Measure your available space', text: 'Calculate your floor footprint budget before buying. Adjustable dumbbells and resistance bands cover 90% of goals in under 3 sq ft.' },
        { name: 'Set a realistic budget', text: 'Most effective home gyms are built for $300–$800. Spend on one quality item rather than multiple cheap ones.' },
        { name: 'Compare durability signals', text: 'Look for steel frames, 2+ year warranties, and verified customer review volume above 500 reviews.' },
        { name: 'Read data-verified rankings', text: 'Use ProAthletica rankings to compare the top picks in each category with verified aggregate data.' },
      ],
    }),
  ];

  return (
    <>
      {/* Structured data */}
      <script {...jsonLdProps(schemas)} />

      {/* FTC/Amazon compliance disclosure */}
      <DisclosureBar />

      {/* ── HERO ── */}
      <section
        className="relative bg-graphite-900 pt-12 pb-16 overflow-hidden border-b border-white/[0.04]"
        aria-label="ProAthletica — data-driven fitness gear rankings"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg.png" 
            alt="ProAthletica modern home gym setup" 
            fill 
            className="object-cover opacity-20 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12]/95 via-[#0A0D12]/80 to-[#0A0D12]" />
        </div>

        <div className="relative container-site z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              {/* Trust eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-pill border border-trust-blue/25 bg-trust-blue/[0.06] px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-trust-blue mb-6 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                INDEPENDENT · DATA-DRIVEN · NO PAID PLACEMENTS
              </div>

              {/* H1 — primary keyword target */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] text-offwhite text-balance mb-6">
                Best Home Gym Gear. <br />
                <span className="text-data-lime">Expert-Ranked.</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-neutral-400 leading-relaxed mb-8">
                We analyze <strong className="text-offwhite font-semibold">47,000+ verified reviews</strong> across adjustable dumbbells, benches, and more — then rank what actually works for home gyms.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#top-picks"
                  className="cta-primary w-auto px-8 h-12 text-sm"
                  aria-label="See our current top fitness gear picks"
                >
                  See Top Picks
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/methodology"
                  className="cta-secondary w-auto px-8 h-12 text-xs"
                  aria-label="Read our testing and ranking methodology"
                >
                  <FlaskConical className="w-4 h-4" aria-hidden="true" />
                  Methodology
                </Link>
              </div>
            </div>

            <div className="hidden lg:block space-y-8">
              <HeroStats
                stats={{
                  testedProducts: stats.testedProducts || stats.products,
                  reviews: stats.reviews || 0,
                  clicks: stats.clicks || 0,
                }}
              />
              <LifestyleHubs />
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP PICKS & PRODUCTS ── */}
      <section
        id="top-picks"
        className="container-site py-12"
        aria-label="Current top fitness gear picks"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/[0.06] pb-6 gap-4">
          <div>
            <div className="section-eyebrow mb-2">
              <TrendingUp className="inline w-3 h-3 mr-1.5" aria-hidden="true" />
              Data-Driven Recommendations
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
              Current Top Picks
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {featured.length} products ranked
            </p>
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-trust-blue hover:text-offwhite transition-colors">
            All categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featured.length > 0 && (
          <Suspense fallback={<div className="h-96 animate-pulse bg-white/[0.03] rounded-card" />}>
            <HomepageFilters products={featured} articleSlug="homepage" initialFilter="all" />
          </Suspense>
        )}
      </section>

      {/* ── AUTHOR / E-E-A-T STRIP ── */}
      <div className="border-y border-white/[0.05] bg-graphite-800">
        <div className="container-site py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {AUTHORS.map(({ name, role, credentials, avatar, color }) => (
              <Link
                key={name}
                href={`/author/${name.toLowerCase().replace(' ', '-')}`}
                className="flex items-center gap-3 group"
                aria-label={`${name}, ${role} at ProAthletica`}
              >
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-xl ${color}`} aria-hidden="true">
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-offwhite group-hover:text-data-lime transition-colors">{name}</div>
                  <div className="text-xs font-medium text-trust-blue">{role}</div>
                  <div className="text-2xs text-neutral-500">{credentials}</div>
                </div>
              </Link>
            ))}

            {/* Divider + editorial note */}
            <div className="hidden lg:flex items-center gap-3 pl-8 border-l border-white/[0.06]">
              <Trophy className="w-4 h-4 text-data-lime flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-neutral-500 max-w-[200px] leading-relaxed">
                All rankings are human-edited.<br />AI assists with data aggregation only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="container-site py-12" aria-label="Browse by training category">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="section-eyebrow mb-1">Browse by Category</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-offwhite">
                Shop by Training Focus
              </h2>
            </div>
            <Link href="/categories" className="text-sm font-bold text-trust-blue hover:text-offwhite transition-colors inline-flex items-center gap-1.5 shrink-0">
              All <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
            role="list"
          >
            {categories.slice(0, 10).map((category) => {
              const icon = CATEGORY_ICONS[category.slug] ?? CATEGORY_ICONS['default'];
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  role="listitem"
                  className="group relative overflow-hidden rounded-lg border border-white/[0.06] bg-graphite-800 p-3 sm:p-4 transition-all hover:border-data-lime/30 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="text-lg mb-1.5" aria-hidden="true">{icon}</div>
                  <div className="text-xs font-black uppercase tracking-tight text-offwhite group-hover:text-data-lime transition-colors leading-tight">
                    {category.name}
                  </div>
                  <div className="mt-0.5 text-[10px] text-neutral-500 font-medium">
                    {category.count} picks
                  </div>
                </Link>
              );
            })}

            {/* "View all" tile */}
            <Link
              href="/categories"
              className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.10] bg-graphite-800/40 p-3 sm:p-4 transition-all hover:border-trust-blue/40 hover:bg-trust-blue/[0.04]"
            >
              <ArrowRight className="w-4 h-4 text-trust-blue mb-1 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-trust-blue transition-colors text-center">
                All {categories.length} categories
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── HOME GYM MATCHER (Audit #03-E) ── */}
      <section id="gear-finder" className="container-site py-12" aria-label="Home gym setup quiz">
        <GymQuiz />
      </section>

      {/* ── INLINE NEWSLETTER (after scrolling through first cards) ── */}
      <div className="container-site pb-12">
        <Newsletter source="homepage-inline" />
      </div>

      {/* ── BUYER GUIDE (E-E-A-T + internal linking hub) ── */}
      <section className="container-site pb-12" aria-label="Buying guide for fitness equipment">
        <div className="container-reading">
          <BuyerGuide />
        </div>
      </section>

      {/* ── FAQ (schema-rich, buyer-intent) ── */}
      <section
        className="container-site border-t border-white/[0.05] py-12"
        aria-label="Frequently asked questions about fitness gear"
      >
        <div className="container-reading">
          <FAQ />
        </div>
      </section>

      {/* ── BOTTOM NEWSLETTER (Audit #04-D) ── */}
      <div className="container-site pb-16">
        <Newsletter source="homepage-bottom" />
      </div>
    </>
  );
}
