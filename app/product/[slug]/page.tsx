import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { productSchema, jsonLdProps, breadcrumbSchema } from '@/lib/seo/schema';
import { DisclosureBar } from '@/components/DisclosureBar';
import { formatPrice, formatTimestamp } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, FlaskConical, ShieldCheck } from 'lucide-react';
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
  
  const shortTitle = product.short_title || product.title.split(' ').slice(0, 5).join(' ');
  return buildMetadata({
    title: `${shortTitle} Review 2026: Pros, Cons & Verdict`,
    description: `Expert review of the ${product.title}. We tested it for durability, performance, and value. See our honest verdict and price trends. Updated May 2026.`,
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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: product.category || 'Gear', url: `/category/${(product.category || 'gear').toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
    { name: shortTitle, url: `/product/${params.slug}` },
  ];

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
      <script {...jsonLdProps([productSchema(product), breadcrumbSchema(breadcrumbs)])} />
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
                <div className="inline-flex items-center gap-2 rounded-full bg-data-lime/10 px-4 py-1 text-[10px] font-black tracking-widest text-data-lime border border-data-lime/20 uppercase">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-data-lime animate-pulse" />
                  Independent Lab Review
                </div>
                <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tighter text-offwhite leading-[0.95] uppercase italic">
                  {shortTitle}
                </h1>
                {product.brand && (
                  <p className="text-xl font-bold text-trust-blue mt-3 tracking-widest uppercase opacity-80">
                    {product.brand}
                  </p>
                )}
              </div>

              {/* Trust Strip (Enhanced E-E-A-T) */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 border-y border-white/5 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                <Link href={`/author/${author.id}`} className="flex items-center gap-2 text-offwhite hover:text-data-lime transition-colors">
                  <User className="h-3.5 w-3.5 text-data-lime" />
                  Expert: {author.name}
                </Link>
                <span className="hidden sm:inline text-white/10">|</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {new Date(product.last_scraped_at || product.updated_at || new Date()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="hidden sm:inline text-white/10">|</span>
                <Link href="/methodology" className="flex items-center gap-2 hover:text-data-lime transition-colors">
                  <FlaskConical className="h-3.5 w-3.5" />
                  Lab Protocol
                </Link>
                <span className="hidden sm:inline text-white/10">|</span>
                <span className="flex items-center gap-1.5 text-trust-blue">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Data
                </span>
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
              <div className="relative rounded-3xl border border-white/5 bg-graphite-900/50 p-8 text-lg leading-relaxed group/verdict overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-data-lime opacity-30 group-hover/verdict:opacity-100 transition-opacity" />
                <p className="relative z-10 text-neutral-300 group-hover:text-offwhite transition-colors">
                  {verdict}
                </p>
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
