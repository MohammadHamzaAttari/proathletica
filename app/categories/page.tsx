import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCategoryList } from '@/lib/db';

export const metadata = buildMetadata({
  title: 'Categories',
  description: 'Browse all ProAthletica product categories and buyer-guide clusters.',
  canonical: '/categories',
});

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategoryList();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <div className="mb-10 space-y-3">
        <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">Categories</h1>
        <p className="max-w-2xl text-neutral-400">
          Browse product groups and ranking pages by training focus.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-2xl border border-white/5 bg-neutral-900/40 p-6 hover:border-emerald-500/30"
            >
              <div className="text-lg font-black uppercase italic tracking-tight text-white">
                {category.name}
              </div>
              <div className="mt-2 text-sm text-neutral-400">{category.count} ranked picks</div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-neutral-500">
          No categories yet — add products to Supabase to populate this page.
        </p>
      )}
    </div>
  );
}
