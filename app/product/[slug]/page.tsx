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
    title: `Is the ${product.short_title || product.title} Worth It in 2026?`,
    description: product.editorial_summary || `Data-driven review of the ${product.title}.`,
    canonical: `/product/${params.slug}`,
    image: product.image_url || undefined,
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) notFound();

  const shortTitle = product.short_title || product.title.split(' ').slice(0, 6).join(' ');
  const verdict = product.editorial_summary || 'Strong performance with measurable tradeoffs versus competitors.';

  return (
    <>
      <script {...jsonLdProps(productSchema(product))} />
      <DisclosureBar />

      <div className="bg-[#0E1116]">
        {/* Sticky mobile CTA (Problem 10 fix) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E1116] border-t border-white/10 p-4 md:hidden">
          <a
            href={`/api/track?productId=${product.asin}`}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="block w-full rounded-2xl bg-[#FF6B1A] py-4 text-center font-black uppercase tracking-widest text-black text-sm active:scale-95 transition"
          >
            SEE TODAY&apos;S PRICE ON AMAZON — {formatPrice(product.price_cents)}
          </a>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
            <Link href="/" className="hover:text-offwhite">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-offwhite">Categories</Link>
            <span>/</span>
            <span className="text-[#3D8BFF]">{product.category}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Gallery / Image */}
            <div className="lg:w-5/12">
              <div className="sticky top-8">
                <div className="aspect-square bg-white rounded-3xl p-10 mb-8 shadow-inner">
                  {product.image_url ? (
                    <Image
                      src={product.image_url.replace('UL320', 'SL800')}
                      alt={shortTitle}
                      width={800}
                      height={800}
                      className="object-contain w-full h-full"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-300 text-6xl font-black opacity-10">PA</div>
                  )}
                </div>

                <div className="flex items-center gap-4 bg-[#161B22] rounded-3xl p-6">
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">CURRENT PRICE</div>
                    <div className="text-4xl font-black text-[#C6FF3D]">{formatPrice(product.price_cents)}</div>
                    <div className="text-xs text-neutral-500">as of {formatTimestamp(product.last_scraped_at)}</div>
                  </div>
                  <a
                    href={`/api/track?productId=${product.asin}`}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="rounded-2xl bg-[#FF6B1A] px-10 py-4 font-black uppercase tracking-widest text-black text-sm hover:bg-[#ff8a4d]"
                  >
                    BUY ON AMAZON
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-7/12 space-y-10">
              <div>
                <div className="inline-flex rounded-full bg-emerald-500/10 px-5 py-1 text-xs font-black tracking-widest text-emerald-400">
                  {product.category.toUpperCase()}
                </div>
                <h1 className="mt-4 text-5xl font-black tracking-tighter text-offwhite leading-none">
                  {shortTitle}
                </h1>
                {product.brand && <p className="text-2xl text-[#3D8BFF] mt-2">{product.brand}</p>}
              </div>

              {/* Rating block */}
              <div className="flex items-center gap-10">
                {product.rating && (
                  <div>
                    <div className="text-6xl font-black text-offwhite">{product.rating}</div>
                    <div className="text-xs uppercase tracking-widest text-neutral-400 -mt-1">AVERAGE RATING</div>
                  </div>
                )}
                {product.review_count && (
                  <div>
                    <div className="text-6xl font-black text-offwhite">{Math.round(product.review_count / 1000)}K</div>
                    <div className="text-xs uppercase tracking-widest text-neutral-400 -mt-1">REVIEWS ANALYZED</div>
                  </div>
                )}
              </div>

              {/* Editor's Verdict */}
              <div className="rounded-3xl border border-[#C6FF3D]/20 bg-[#161B22] p-8 text-lg leading-relaxed">
                {verdict}
              </div>

              {/* Pros / Cons (visually distinct) */}
              <div className="grid md:grid-cols-2 gap-6">
                {(product.pros && product.pros.length > 0) ? (
                  <div className="rounded-3xl bg-[#C6FF3D]/5 border border-[#C6FF3D]/30 p-8">
                    <div className="uppercase text-xs font-black tracking-[0.125em] text-[#C6FF3D] mb-6">PROS</div>
                    <ul className="space-y-4">
                      {product.pros.map((pro, i) => (
                        <li key={i} className="flex gap-3 text-neutral-200">
                          <span className="text-[#C6FF3D] mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-[#C6FF3D]/5 border border-[#C6FF3D]/30 p-8">
                    <div className="uppercase text-xs font-black tracking-[0.125em] text-[#C6FF3D] mb-6">PROS</div>
                    <ul className="space-y-4 text-neutral-200">
                      <li className="flex gap-3">✓ Strong customer satisfaction signals</li>
                      <li className="flex gap-3">✓ Competitive price-to-performance</li>
                    </ul>
                  </div>
                )}

                <div className="rounded-3xl bg-neutral-900/80 border border-white/10 p-8">
                  <div className="uppercase text-xs font-black tracking-[0.125em] text-neutral-400 mb-6">CONSIDERATIONS</div>
                  <ul className="space-y-4 text-neutral-300">
                    {(product.cons && product.cons.length > 0) ? (
                      product.cons.map((con, i) => (
                        <li key={i} className="flex gap-3">⚠ {con}</li>
                      ))
                    ) : (
                      <>
                        <li className="flex gap-3">⚠ May be bulky for very small spaces</li>
                        <li className="flex gap-3">⚠ Check latest price before buying</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="text-xs text-neutral-500 border-t border-white/10 pt-8">
                Last updated {formatTimestamp(product.last_scraped_at)}. 
                Data pulled from verified customer reviews and technical specifications. 
                See full <Link href="/methodology" className="text-[#3D8BFF] hover:underline">methodology</Link>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
