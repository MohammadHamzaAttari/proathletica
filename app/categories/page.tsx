import Link from 'next/link';
import { Dumbbell, Zap, Target, Home, ShieldCheck, ArrowRight, Activity, TrendingUp, Trophy, type LucideIcon } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCategoryList } from '@/lib/db';

export const metadata = buildMetadata({
  title: 'Best Fitness Gear Categories 2026 — ProAthletica',
  description: 'Explore our data-backed fitness gear rankings by category. From adjustable dumbbells to power racks, we rank the best equipment for your home gym.',
  canonical: '/categories',
});

export const revalidate = 3600;

const ICON_MAP: Record<string, LucideIcon> = {
  'home-gym': Home,
  'resistance-training': Zap,
  'powerlifting': Target,
  'cardio': Activity,
  'recovery': ShieldCheck,
  'strength': Dumbbell,
  'weightlifting': TrendingUp,
  'default': Trophy
};

export default async function CategoriesPage() {
  const categories = await getCategoryList();

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      {/* Header */}
      <div className="mb-16 space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-trust-blue">
          <Activity className="w-4 h-4" aria-hidden="true" />
          The Training Index
        </div>
        <h1 className="text-5xl sm:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
          Browse gear clusters
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed">
          Select a category to see our data-driven rankings, spec comparisons, and testing methodology for 2026.
        </p>
      </div>

      {/* Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = ICON_MAP[category.slug] || ICON_MAP.default;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-card border border-white/[0.06] bg-graphite-800 p-8 transition-all duration-300 hover:border-data-lime/30 hover:bg-data-lime/[0.03] hover:-translate-y-1 shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-neutral-400 group-hover:bg-data-lime/10 group-hover:text-data-lime transition-colors">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-data-lime transition-colors">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500 font-medium">
                      {category.count} data-verified recommendations
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-600 group-hover:text-white transition-colors">
                    View Rankings
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-data-lime transition-all group-hover:translate-x-1" />
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-data-lime/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-card border border-white/[0.06] bg-white/[0.02] py-32 text-center">
          <p className="text-neutral-500 font-black uppercase tracking-widest">
            Training catalog is loading...
          </p>
          <p className="mt-2 text-sm text-neutral-600">Please check back shortly as we sync current data.</p>
        </div>
      )}

      {/* Trust Footer */}
      <div className="mt-24 rounded-card border border-white/[0.06] bg-neutral-900/40 p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-offwhite">The Independent Standard</h3>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
              We analyzed over 47,000 data points across these categories to ensure our rankings are free from brand bias. Every product is scored on durability, specs, and price-to-performance.
            </p>
          </div>
          <Link href="/methodology" className="cta-primary w-full md:w-auto px-8 whitespace-nowrap">
            Our Protocol
          </Link>
        </div>
      </div>
    </div>
  );
}
