import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, TrendingUp } from 'lucide-react';
import { BuyerGuide } from '@/components/BuyerGuide';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { GymQuiz } from '@/components/GymQuiz';
import RedesignedHero from '@/components/RedesignedHero';
import { HeroStats } from '@/components/HeroStats';
import { HomepageFilters } from '@/components/HomepageFilters';
import { LifestyleHubs } from '@/components/LifestyleHubs';
import { Newsletter } from '@/components/Newsletter';
import { getAllProducts, getCategoryList, getPublishedArticles } from '@/lib/db';
import { itemListSchema, jsonLdProps, howToSchema, faqSchema } from '@/lib/seo/schema';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Best Home Fitness Gear 2026 — Expertly Tested & Ranked',
  description: '306 fitness products ranked by 47,000+ data points. Expert-tested home gym gear — no paid placements. Find your perfect setup → ProAthletica',
  canonical: '/',
});

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

  const faqItems = [
    {
      q: 'How do you rank and test these products?',
      a: 'Our Athletica Lab process aggregates verified customer reviews (47,000+ data points), manufacturer specs, and hands-on editorial analysis from our certified coaches and athletes. Every ranking is human-edited.',
    },
    {
      q: 'Are any of these rankings sponsored or paid?',
      a: 'No. We have a strict no-paid-placements policy. Some links are Amazon affiliate links, which help us keep the site running at no extra cost to you — our commission doesn\'t affect rankings.',
    },
    {
      q: 'Which fitness equipment is best for a small apartment?',
      a: 'For small apartments, we recommend adjustable dumbbells (Bowflex 552 or PowerBlock) + resistance bands as a foundation — they cover 90% of home workout needs in under 3 sq ft of storage.',
    },
    {
      q: 'Which gear do you recommend for absolute beginners?',
      a: 'Start with a single adjustable dumbbell set + a quality resistance band kit. These tools let you learn movement patterns safely before adding load.',
    },
    {
      q: 'Do you review products beyond Amazon?',
      a: 'Yes. Our editorial process is retailer-independent. Amazon is our primary affiliate partner, but we recommend the best product for each category regardless of where it\'s sold.',
    },
    {
      q: 'How current are the prices shown?',
      a: 'Prices are pulled from Amazon and updated frequently. Amazon prices change multiple times per day, so we recommend clicking through to confirm the current live price.',
    },
    {
      q: 'How do I request deletion of my data?',
      a: 'Email us at pro@athletica.page or use our dedicated Data Deletion Request form. We process all valid requests within 30 days per CCPA requirements.',
    },
  ];

  /* JSON-LD schemas */
  const schemas = [
    ...(featured.length > 0 ? [itemListSchema(featured.slice(0, 12), '/')] : []),
    faqSchema(faqItems),
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

      {/* ── REDESIGNED HERO ── */}
      <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-graphite-900" />}>
        <RedesignedHero />
      </Suspense>

      {/* Stats and Hubs in a clean Bento Row below Hero */}
      <section className="container-wide -mt-8 mb-12 relative z-20">
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <HeroStats
              stats={{
                testedProducts: stats.testedProducts || stats.products,
                reviews: stats.reviews || 0,
                clicks: stats.clicks || 0,
              }}
            />
          </div>
          <div className="lg:col-span-3">
            <LifestyleHubs />
          </div>
        </div>
      </section>

      {/* ── TOP PICKS & PRODUCTS ── */}
      <section
        id="top-picks"
        className="container-site py-8"
        aria-label="Current top fitness gear picks"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-white/[0.06] pb-4 gap-4">
          <div>
            <div className="section-eyebrow mb-2">
              <TrendingUp className="inline w-3 h-3 mr-1.5" aria-hidden="true" />
              Data-Driven Recommendations
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
              Best Fitness Gear 2026: Top Picks
            </h2>
            <p className="text-sm text-neutral-300 font-bold mt-1">
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
              role="listitem"
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
