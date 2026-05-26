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
import { getCategoryList, getProductsByCategory } from '@/lib/db';
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
    title: `Best ${name} 2026 — Reviewed & Tested`,
    description: `Independent rankings of the best ${name.toLowerCase()} for 2026. Tested, scored, and curated by competing athletes.`,
    canonical: `/category/${params.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug);
  if (!products.length) notFound();

  const name = slugToTitle(params.slug);
  const url = `/category/${params.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name, url },
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

        {/* Buying guide + trust content */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <BuyerGuide category={name.toLowerCase()} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <FAQ />
        </div>

        <div className="mt-12">
          <Newsletter source={`category:${params.slug}`} />
        </div>
      </div>
    </>
  );
}
