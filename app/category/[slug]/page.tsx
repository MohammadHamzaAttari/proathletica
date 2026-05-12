import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DisclosureBar } from '@/components/DisclosureBar';
import { BuyerGuide } from '@/components/BuyerGuide';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
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

      {/* FIX (Audit #03-A): FTC disclosure above every category product list */}
      <DisclosureBar />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.name} className="flex items-center gap-2">
              {index < breadcrumbs.length - 1 ? (
                <Link href={crumb.url} className="hover:text-emerald-400">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-neutral-300">{crumb.name}</span>
              )}
              {index < breadcrumbs.length - 1 ? <span>/</span> : null}
            </span>
          ))}
        </nav>

        <header className="mb-12 space-y-4">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl lg:text-6xl">
            Best <span className="text-emerald-500">{name}</span> for 2026
          </h1>
          <p className="max-w-3xl text-lg font-medium text-neutral-400">
            We tested {products.length} options and ranked the top picks for serious athletes.
          </p>
        </header>

        <ProductGrid products={products} articleSlug={`category-${params.slug}`} />

        <section className="mt-20 border-t border-white/5 pt-16">
          <BuyerGuide category={name.toLowerCase()} />
        </section>

        <section className="mt-20 border-t border-white/5 pt-16">
          <FAQ />
        </section>

        <section className="mt-20 border-t border-white/5 pt-16">
          <Newsletter source={`category:${params.slug}`} />
        </section>
      </div>
    </>
  );
}
