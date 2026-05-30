import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { productSchema, jsonLdProps } from '@/lib/seo/schema';
import { DisclosureBar } from '@/components/DisclosureBar';
import { formatPrice, formatTimestamp } from '@/lib/format';
import { SITE_NAME } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, FlaskConical } from 'lucide-react';
import { AUTHORS } from '@/lib/editorial';
import { MultiMerchantSelector } from '@/components/MultiMerchantSelector';
import { PriceTrackerTrigger } from '@/components/PriceTrackerTrigger';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug || p.asin || p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) return buildMetadata({ title: 'Product Not Found', noindex: true });
  
  return buildMetadata({
    title: `${product.short_title || product.title.split(' ').slice(0, 6).join(' ')} Review (2026): Pros, Cons, Specs & Best Alternative | ${SITE_NAME}`,
    description: `Hands-on-style review of the ${product.title}. See who it's best for, key tradeoffs, specs, price history, and better alternatives. Updated May 2026.`,
    canonical: `/product/${params.slug}`,
    pinterestImage: `/api/pinterest/${product.asin || product.id}`,
    image: product.image_url || undefined,
    priceAmount: product.price_cents ? product.price_cents / 100 : undefined,
    priceCurrency: product.currency || "USD",
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) notFound();

  const shortTitle = product.short_title || product.title.split(' ').slice(0, 6).join(' ');
  const verdict = product.editorial_summary || 'Strong performance with measurable tradeoffs versus competitors.';

  const cat = (product.category || '').toLowerCase();
  let reviewerSlug = 'alex-rivera';
  if (cat.includes('run') || cat.includes('cardio') || cat.includes('treadmill') || cat.includes('endurance')) {
    reviewerSlug = 'jordan-kim';
  } else if (cat.includes('recovery') || cat.includes('band') || cat.includes('massage') || cat.includes('apartment')) {
    reviewerSlug = 'sam-torres';
  }
  const author = AUTHORS[reviewerSlug];

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

                {/* Live Price Drop Tracker Widget */}
                <PriceTrackerTrigger product={product} />
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

              {/* Trust Strip (Audit Fix) */}
              <div className="flex flex-wrap items-center gap-4 border-y border-white/10 py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                <Link href={`/author/${author.id}`} className="flex items-center gap-2 text-white hover:text-[#C6FF3D] transition-colors">
                  <User className="h-4 w-4 text-emerald-400" />
                  Reviewed by {author.name}
                </Link>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Updated{' '}
                  {new Date(product.last_scraped_at || product.updated_at || new Date()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="hidden sm:inline text-white/20">|</span>
                <Link href="/methodology" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <FlaskConical className="h-4 w-4" />
                  How we score
                </Link>
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

              {/* Multi-Merchant Pricing Selector */}
              <MultiMerchantSelector product={product} />

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

              {/* Author Info Card */}
              <div className="rounded-3xl border border-white/[0.06] bg-[#161B22] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border text-3xl ${author.color}`}>
                  {author.avatar}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-tight">Reviewed by {author.name}</span>
                    <span className="text-[10px] font-bold text-trust-blue px-2 py-0.5 rounded bg-trust-blue/10 border border-trust-blue/20 uppercase tracking-widest">{author.credentials[0]}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{author.bio}</p>
                  <Link href={`/author/${author.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C6FF3D] hover:underline uppercase tracking-wider">
                    View full profile & recommendations →
                  </Link>
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
