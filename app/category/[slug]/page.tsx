import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ComparisonTable } from '@/components/ComparisonTable';
import { DisclosureBar } from '@/components/DisclosureBar';
import { BuyerGuide } from '@/components/BuyerGuide';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { QuickFilters } from '@/components/QuickFilters';
import { slugToTitle } from '@/lib/format';
import { getCategoryList, getProductsByCategory, getPublishedArticles } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, itemListSchema, jsonLdProps } from '@/lib/seo/schema';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategoryList();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = slugToTitle(params.slug);
  return buildMetadata({
    title: `Best ${name} 2026 — Top 10 Ranked & Tested`,
    description: `Expert reviews of the best ${name.toLowerCase()} for 2026. We rank the top picks based on durability, specs, and verified owner data.`,
    canonical: `/category/${params.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, allArticles] = await Promise.all([
    getProductsByCategory(params.slug),
    getPublishedArticles().catch(() => []),
  ]);
  if (!products.length) notFound();

  const name = slugToTitle(params.slug);
  const url = `/category/${params.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name, url },
  ];

  const categoryName = name.toLowerCase();
  const customFaqs = [
    { q: `How do you rank the best ${categoryName}?`, a: `Our ranking for ${categoryName} is based on a weighted algorithm that considers build materials, warranty length, and thousands of verified owner reviews. Every ranking is human-edited by our certified coaches.` },
    { q: `Is the "Best Overall" ${categoryName} right for everyone?`, a: `The #1 pick is chosen for its balance of features and value. However, we also provide specialized picks for small spaces and budget-conscious buyers.` },
    { q: `What should I look for when buying ${categoryName}?`, a: `Focus on build quality (steel gauge, weld durability), warranty length (2+ years is a good signal), and verified review volume. ${products.length > 0 ? `We analyzed ${products.length} options to help you compare.` : ''}` },
    { q: `How often are the ${categoryName} rankings updated?`, a: `Our data is refreshed weekly from verified customer reviews and manufacturer specs. Prices are updated in real-time from Amazon.` },
    { q: `Do you accept paid placements in the ${categoryName} rankings?`, a: `No. ProAthletica has a strict no-paid-placements policy. Our rankings are data-driven and independent. Some links are affiliate links, which help us keep the site running at no extra cost to you.` },
  ];

  return (
    <>
      <script {...jsonLdProps([breadcrumbSchema(breadcrumbs), itemListSchema(products, url)])} />
      <DisclosureBar />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb + Hero */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.name} className="flex items-center gap-2">
              {index < breadcrumbs.length - 1 ? (
                <Link href={crumb.url} className="hover:text-[#3D8BFF]">{crumb.name}</Link>
              ) : (
                <span className="text-offwhite">{crumb.name}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="text-neutral-600">/</span>}
            </span>
          ))}
        </nav>

        <header className="mb-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-offwhite">
            Best <span className="text-[#C6FF3D]">{name}</span> for 2026
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-neutral-400">
            We analyzed {products.length} options using real review data, specs, and performance benchmarks. No paid placements.
          </p>
          <Link href="/methodology" className="mt-6 inline-flex text-sm font-black uppercase tracking-widest text-[#3D8BFF] hover:underline">
            See full methodology →
          </Link>
        </header>

        {/* Quick filters (Problem 5 fix) */}
        <QuickFilters />

        {/* Comparison + Grid */}
        <ComparisonTable products={products} articleSlug={`category-${params.slug}`} title={`${name} comparison`} />
        
        <div className="mt-8">
          <ProductGrid products={products} articleSlug={`category-${params.slug}`} />
        </div>

        {/* Related buyer guides */}
        {(() => {
          const slugLower = params.slug.toLowerCase();
          const related = allArticles.filter((a) =>
            a.category?.toLowerCase() === slugLower ||
            a.cluster?.toLowerCase() === slugLower ||
            slugLower.includes(a.cluster?.toLowerCase() || '') ||
            a.cluster?.toLowerCase().includes(slugLower)
          ).slice(0, 3);
          return related.length > 0 ? (
            <div className="mt-12 border-t border-white/10 pt-10">
              <div className="uppercase text-xs font-black tracking-[0.125em] text-data-lime mb-4 flex items-center gap-2">
                BUYER GUIDES
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map((a) => (
                  <Link
                    key={a.id}
                    href={`/best/${a.slug.replace(/-2026$/, '')}`}
                    className="block rounded-2xl border border-white/5 bg-neutral-900/30 p-5 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                      {a.cluster || a.category || 'Guide'}
                    </div>
                    <div className="text-sm font-black text-white leading-tight">{a.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Buying guide + trust content */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <BuyerGuide category={name.toLowerCase()} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <FAQ customFaqs={customFaqs} />
        </div>

        <div className="mt-12">
          <Newsletter source={`category:${params.slug}`} />
        </div>
      </div>
    </>
  );
}
