import Link from 'next/link';
import { ArrowRight, ShieldCheck, Trophy, Zap } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { BuyerGuide } from '@/components/BuyerGuide';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { getAllProducts, getCategoryList, getPublishedArticles } from '@/lib/db';
import { itemListSchema, jsonLdProps } from '@/lib/seo/schema';

export const revalidate = 3600;

export default async function HomePage() {
  const [products, categories, articles] = await Promise.all([
    getAllProducts(),
    getCategoryList(),
    getPublishedArticles(),
  ]);

  const featured = products.slice(0, 12);

  return (
    <>
      {featured.length > 0 && (
        <script {...jsonLdProps(itemListSchema(featured, '/'))} />
      )}

      {/* FIX (Audit #03-A): FTC disclosure visible above product grid */}
      <DisclosureBar />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-20 pt-14 text-center sm:px-8">
        <div className="absolute inset-0 -z-10 rounded-full bg-emerald-500/10 blur-[120px]" />
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          2026 professional benchmark report
        </span>
        <h1 className="mb-8 text-4xl font-black uppercase italic leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl">
          The best <span className="text-emerald-500">fitness gear</span>
          <br />
          tested by real athletes
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400">
          Independent reviews of powerlifting belts, running shoes, home gym equipment, and recovery gear.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={articles[0] ? `/best/${articles[0].slug}` : '#shop'}
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-black hover:bg-emerald-400"
          >
            Read our top pick <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="#shop"
            className="rounded-2xl border border-white/20 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-white/5"
          >
            Browse all gear
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/5 bg-neutral-950/50 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-8">
          {[
            { icon: ShieldCheck, label: 'Independent', sub: '0 paid placements' },
            { icon: Trophy, label: 'Lab tested', sub: '30-day minimum' },
            { icon: Zap, label: 'Live pricing', sub: 'Updated daily' },
            { icon: Trophy, label: 'Athlete-led', sub: 'Real testers' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-tight text-white">{item.label}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <h2 className="mb-10 text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-2xl border border-white/5 bg-neutral-900/50 p-6 transition-all hover:border-emerald-500/30 hover:bg-neutral-900"
              >
                <div className="text-base font-black uppercase italic tracking-tight text-white">
                  {category.name}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {category.count} picks →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      <section id="shop" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
              This week&apos;s top picks
            </h2>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Independently reviewed gear from our test lab.
            </p>
          </div>
          <Link href="/methodology" className="text-sm font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
            Read methodology
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mb-10">
            <ComparisonTable products={featured} articleSlug="homepage" title="Homepage snapshot" />
          </div>
        ) : null}
        {featured.length > 0 ? (
          <ProductGrid products={featured} articleSlug="homepage" />
        ) : (
          <p className="py-20 text-center text-neutral-500">
            Products are loading. If this persists, check your Supabase configuration.
          </p>
        )}
      </section>

      {/* Articles */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-white/5 px-4 py-16 sm:px-8">
          <h2 className="mb-10 text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            Latest buyer&apos;s guides
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/best/${article.slug}`}
                className="overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 transition-all hover:border-emerald-500/30"
              >
                {article.hero_image ? (
                  <img src={article.hero_image} alt={article.title} className="h-44 w-full object-cover" />
                ) : null}
                <div className="space-y-3 p-6">
                  {article.cluster ? (
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      {article.cluster}
                    </div>
                  ) : null}
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
                    {article.title}
                  </h3>
                  {article.excerpt ? (
                    <p className="line-clamp-3 text-sm text-neutral-400">{article.excerpt}</p>
                  ) : null}
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    {article.read_minutes} min read · {article.author}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <BuyerGuide />
      </section>

      <section className="mx-auto max-w-4xl border-t border-white/5 px-4 py-16 sm:px-8">
        <FAQ />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <Newsletter />
      </section>
    </>
  );
}
