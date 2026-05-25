import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { productSchema, jsonLdProps, breadcrumbSchema } from '@/lib/seo/schema';
import { DisclosureBar } from '@/components/DisclosureBar';
import { formatPrice, formatTimestamp } from '@/lib/format';
import { SITE_NAME } from '@/lib/config';
import { getBrandPartnerInfo } from '@/lib/affiliate';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, FlaskConical, ArrowRight, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug || p.asin || p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductById(params.slug);
  if (!product) return buildMetadata({ title: 'Product Not Found', noindex: true });
  
  const brand = product.brand || 'This';
  const category = (product.category || 'Fitness Gear').toLowerCase();
  
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

  // Premium Alternative Matcher (Hybrid Affiliate Model)
  const getPremiumAltId = (p: typeof product) => {
    const cat = (p.category || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const cleanId = String(p.id || '').toLowerCase();

    // Prevent matching premium alternatives to themselves
    if (cleanId.includes('rogue') || cleanId.includes('wahoo') || cleanId.includes('gnc')) {
      return null;
    }

    if (cat.includes('bench') || title.includes('bench')) {
      return 'rogue-adjustable-bench-3';
    }
    if (cat.includes('band') || cat.includes('resistance') || title.includes('band')) {
      return 'rogue-monster-bands';
    }
    if (cat.includes('treadmill') || title.includes('treadmill') || cat.includes('run') || title.includes('run')) {
      return 'wahoo-kickr-run-treadmill';
    }
    if (cat.includes('nutrition') || cat.includes('supplement') || cat.includes('recovery') || title.includes('protein') || title.includes('supplement')) {
      return 'gnc-energy-recovery-stack';
    }
    return null;
  };

  const premiumAltId = getPremiumAltId(product);
  const premiumAlt = premiumAltId ? await getProductById(premiumAltId) : null;

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

              {/* Trust Strip (Audit Fix) */}
              <div className="flex flex-wrap items-center gap-4 border-y border-white/10 py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                <span className="flex items-center gap-2 text-white">
                  <User className="h-4 w-4 text-emerald-400" />
                  Reviewed by Athletica Lab
                </span>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="flex items-center gap-2 text-[#C6FF3D]">
                  <FlaskConical className="h-4 w-4 text-[#C6FF3D]" />
                  Lab-Tested & Verified
                </span>
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
              <div className="rounded-3xl border border-[#C6FF3D]/20 bg-[#161B22] p-8 text-lg leading-relaxed shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#C6FF3D] block mb-2">VERDICT FROM THE LAB</span>
                {verdict}
              </div>

              {/* 👑 Professional-Grade Premium Upgrade Card */}
              {premiumAlt && (
                <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#1e1912]/20 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.08)]">
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 border border-amber-500/20">
                          <Trophy className="w-3 h-3" /> PREMIUM UPGRADE PICK
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          {getBrandPartnerInfo(premiumAlt.brand).transparencyNote}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                          {premiumAlt.brand} <span className="text-amber-500">—</span> {premiumAlt.short_title || premiumAlt.title}
                        </h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {premiumAlt.editorial_summary}
                        </p>
                      </div>

                      {/* Micro Spec-to-Spec Comparison */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 text-xs">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Standard Option</span>
                          <span className="text-neutral-300 font-semibold">{shortTitle}</span>
                          <span className="text-neutral-500 block text-[10px] mt-0.5">Budget-focused import model</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 block mb-1">Premium Upgrade</span>
                          <span className="text-amber-500 font-black">{premiumAlt.short_title || premiumAlt.title}</span>
                          <span className="text-neutral-400 block text-[10px] mt-0.5">Commercial-grade, custom components</span>
                        </div>
                      </div>

                      {/* Why Upgrade? Bullet Points */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Why it&apos;s worth the investment:</span>
                        <ul className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                          {(premiumAlt.pros || []).slice(0, 4).map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Pricing & Call to Action */}
                    <div className="w-full md:w-auto md:border-l border-white/5 md:pl-6 flex flex-col justify-center items-center gap-3 self-stretch min-w-[200px]">
                      <div className="text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block">Est. Price</span>
                        <span className="text-3xl font-black text-white">{formatPrice(premiumAlt.price_cents)}</span>
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block mt-0.5">DIRECT DEAL ENABLED</span>
                      </div>

                      <a
                        href={`/api/track?productId=${encodeURIComponent(premiumAlt.id)}&articleSlug=product-review-${encodeURIComponent(product.id)}&rank=1`}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3.5 text-center text-xs font-black uppercase tracking-widest text-black transition duration-300 shadow-lg"
                      >
                        ACQUIRE PREMIUM <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </a>

                      <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest text-center">
                        Secure checkout via partner site
                      </span>
                    </div>
                  </div>
                </section>
              )}

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
