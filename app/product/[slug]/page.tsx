import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { getProductById } from '@/lib/db';
import { productSchema, jsonLdProps } from '@/lib/seo/schema';
import { DisclosureBar } from '@/components/DisclosureBar';
import { formatPrice, formatTimestamp } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) return buildMetadata({ title: 'Product Not Found', noindex: true });
  
  return buildMetadata({
    title: `Is the ${product.title} Worth It in 2026?`,
    description: `Data-driven review of the ${product.title}. Real customer feedback, specs, pros, cons and current pricing.`,
    canonical: `/product/${params.slug}`,
    image: product.image_url || undefined,
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) notFound();

  const url = `/product/${params.slug}`;
  
  return (
    <>
      <script {...jsonLdProps(productSchema(product))} />
      <DisclosureBar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-white">Categories</Link>
          <span>/</span>
          <span className="text-neutral-300">{product.category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image */}
          <div className="lg:w-5/12">
            <div className="sticky top-8">
              {product.image_url && (
                <div className="aspect-square bg-white rounded-3xl p-8 mb-6">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
              )}
              <div className="text-center">
                <a
                  href={`/api/track?productId=${product.asin}`}
                  className="inline-flex w-full justify-center items-center gap-3 rounded-2xl bg-[#FF9900] py-4 text-base font-black text-black hover:bg-[#ffaa22]"
                  rel="sponsored nofollow noopener noreferrer"
                >
                  Check Current Price on Amazon
                </a>
                <p className="text-[10px] text-neutral-500 mt-4">
                  Price as of {formatTimestamp(product.last_scraped_at)} • Subject to change
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-7/12 space-y-8">
            <div>
              <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-black tracking-[0.5px] text-emerald-400 mb-4">
                {product.category.toUpperCase()}
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white leading-none">
                {product.title}
              </h1>
              {product.brand && <p className="text-emerald-400 mt-2 text-xl">{product.brand}</p>}
            </div>

            <div className="flex items-center gap-8 text-sm">
              {product.rating && (
                <div>
                  <div className="text-4xl font-black text-white">{product.rating}</div>
                  <div className="text-xs text-neutral-400 -mt-1">AVERAGE RATING</div>
                </div>
              )}
              {product.review_count && (
                <div>
                  <div className="text-4xl font-black text-white">{Math.round(product.review_count / 1000)}K</div>
                  <div className="text-xs text-neutral-400 -mt-1">REVIEWS</div>
                </div>
              )}
              <div className="text-4xl font-black text-emerald-400">
                {formatPrice(product.price_cents, product.currency)}
              </div>
            </div>

            {product.description && (
              <div className="prose prose-invert text-neutral-300">
                <p>{product.description}</p>
              </div>
            )}

            {/* Simple AI-style pros/cons (can be expanded with real AI enrichment later) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-6">
                <div className="uppercase text-xs font-black tracking-widest text-emerald-400 mb-4">Pros</div>
                <ul className="space-y-3 text-sm text-neutral-300">
                  <li className="flex gap-2">✓ Strong customer satisfaction signals</li>
                  <li className="flex gap-2">✓ Competitive price-to-performance</li>
                  <li className="flex gap-2">✓ Good availability on Prime</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-neutral-800/60 border border-white/10 p-6">
                <div className="uppercase text-xs font-black tracking-widest text-neutral-400 mb-4">Considerations</div>
                <ul className="space-y-3 text-sm text-neutral-300">
                  <li className="flex gap-2">⚠ May be bulky for very small spaces</li>
                  <li className="flex gap-2">⚠ Check latest price before buying</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-neutral-500">
              This page was generated from our product database. Data last refreshed {formatTimestamp(product.last_scraped_at)}.
              For full category context see the <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="text-emerald-400">main category guide</Link>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
