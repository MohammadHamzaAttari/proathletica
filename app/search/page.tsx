import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { getAllProducts, getPublishedArticles } from '@/lib/db';
import { formatPrice } from '@/lib/format';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim();
  return buildMetadata({
    title: q ? `Search results for "${q}"` : 'Search',
    description: q
      ? `Search results for "${q}" on ProAthletica.`
      : 'Search ProAthletica buyer guides and products.',
    canonical: q ? `/search?q=${encodeURIComponent(q)}` : '/search',
    noindex: true, // FIX: search pages must not be indexed (duplicate content risk)
  });
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q || '').trim().toLowerCase();

  const [products, articles] = await Promise.all([getAllProducts(), getPublishedArticles()]);

  const filteredProducts = query
    ? products.filter((product) =>
        [product.title, product.category, product.description || '', product.keyword || '']
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    : [];

  const filteredArticles = query
    ? articles.filter((article) =>
        [article.title, article.excerpt || '', article.cluster || '', article.category || '']
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
      <h1 className="mb-3 text-4xl font-black uppercase italic tracking-tight text-white">Search</h1>
      <p className="mb-10 text-neutral-400">
        {query
          ? `Results for "${query}"`
          : 'Use the search bar or add ?q= to the URL to search products and buyer guides.'}
      </p>

      {query ? (
        <div className="grid gap-10 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Products</h2>
            {filteredProducts.length ? (
              filteredProducts.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-white/5 bg-neutral-900/40 p-5"
                >
                  <div className="text-sm font-black text-white">{product.title}</div>
                  <div className="mt-1 text-sm text-neutral-400">{product.category}</div>
                  <div className="mt-2 text-emerald-400">
                    {formatPrice(product.price_cents, product.currency)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500">No matching products found.</p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Articles</h2>
            {filteredArticles.length ? (
              filteredArticles.slice(0, 12).map((article) => (
                <Link
                  key={article.id}
                  href={`/best/${article.slug.replace(/-2026$/, '')}`}
                  className="block rounded-2xl border border-white/5 bg-neutral-900/40 p-5 hover:border-emerald-500/30"
                >
                  <div className="text-sm font-black text-white">{article.title}</div>
                  <div className="mt-2 text-sm text-neutral-400">{article.excerpt}</div>
                </Link>
              ))
            ) : (
              <p className="text-neutral-500">No matching articles found.</p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
