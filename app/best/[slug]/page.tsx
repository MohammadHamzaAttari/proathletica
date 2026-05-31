import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Calendar, Clock, User, FlaskConical, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { formatTimestamp } from '@/lib/format';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { ShareButtons } from '@/components/ShareButtons';
import { SITE_URL } from '@/lib/config';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { generateArticleSummary } from '@/lib/ai/article-summary';
import { getArticleBySlug, getPublishedArticles } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema, itemListSchema, jsonLdProps } from '@/lib/seo/schema';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug.replace(/-2026$/, '') }));
}

/**
 * FIX (Audit #02-A): every article now gets unique SSR metadata —
 * title, description, canonical, OG image, and published/modified dates.
 * Pinterest and other crawlers see the real per-article tags.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return buildMetadata({ title: 'Not Found', noindex: true });
  return buildMetadata({
    title: article.title,
    description: article.excerpt || undefined,
    canonical: `/best/${article.slug.replace(/-2026$/, '')}`,
    image: article.hero_image || undefined,
    type: 'article',
    publishedTime: article.published_at || undefined,
    modifiedTime: article.updated_at,
    keywords: [
      article.title.toLowerCase(),
      `${article.category || ''} reviews`.trim(),
      `${article.cluster || ''} rankings`.trim(),
      'best fitness gear 2026',
      'athletica lab tested',
    ].filter(Boolean),
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(params.slug),
    getPublishedArticles(),
  ]);

  if (!article) notFound();

  const relatedArticles = allArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .filter(
      (candidate) =>
        candidate.cluster === article.cluster || candidate.category === article.category
    )
    .slice(0, 3);

  const quickTake = await generateArticleSummary({
    title: article.title,
    excerpt: article.excerpt,
    content_html: article.content_html,
  });

  const url = `/best/${article.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Buyer Guides', url: '/' },
    { name: article.title, url },
  ];

  return (
    <>
      <script
        {...jsonLdProps([
          articleSchema(article, url),
          breadcrumbSchema(breadcrumbs),
          ...(article.products.length > 0 ? [itemListSchema(article.products, url)] : []),
        ])}
      />

      {/* FIX (Audit #03-A): FTC disclosure above every product page */}
      <DisclosureBar />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-8 relative">
        {article.products && article.products.length > 0 && (
          <StickyMobileCTA product={article.products[0]} articleSlug={article.slug} />
        )}
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

        <header className="mb-10 space-y-6">
          {article.cluster ? (
            <span className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              {article.cluster}
            </span>
          ) : null}
          <h1 className="text-3xl font-black uppercase italic leading-[1.05] tracking-tighter sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="text-lg font-medium leading-relaxed text-neutral-400">{article.excerpt}</p>
          ) : null}
          {/* Trust Strip (Audit Fix) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border-y border-white/10 py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            <Link
              href={`/author/${article.author?.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
            >
              <User className="h-4 w-4 text-emerald-400" />
              Reviewed by {article.author}
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Updated{' '}
              {new Date(article.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.read_minutes} min read
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <Link href="/methodology" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <FlaskConical className="h-4 w-4" />
              How we score
            </Link>
          </div>
          <ShareButtons title={article.title} url={`${SITE_URL}${url}`} />
        </header>

        {article.hero_image ? (
          <div className="relative mb-10 h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-2xl border border-white/5">
            <Image
              src={article.hero_image}
              alt={article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12]/60 to-transparent" />
          </div>
        ) : null}

        {article.products && article.products.length > 0 ? (
          <div className="mb-10 rounded-3xl border border-data-lime/30 bg-graphite-900/40 p-8 flex flex-col sm:flex-row gap-8 items-center shadow-2xl relative overflow-hidden group/pick">
            {/* Animated accent border */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-data-lime" />
            <div className="absolute inset-0 bg-gradient-to-r from-data-lime/5 to-transparent opacity-0 group-hover/pick:opacity-100 transition-opacity duration-500" />

            <div className="flex-1 space-y-4 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-data-lime">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-data-lime text-black">
                  <Star className="w-3 h-3 fill-current" />
                </div>
                The Athletica Lab Choice
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-offwhite leading-tight tracking-tight">
                {article.products[0].short_title || article.products[0].title}
              </h2>
              <p className="text-neutral-400 font-medium text-lg leading-relaxed max-w-2xl">
                {article.products[0].custom_blurb || article.products[0].editorial_summary || 'The best overall choice for most people based on our lab testing and owner reviews.'}
              </p>
              <div className="flex items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-trust-blue" />
                  Verified Tech Specs
                </span>
                <span>•</span>
                <span>Updated {formatTimestamp(article.products[0].last_scraped_at)}</span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col gap-4 relative z-10">
               <a
                href={`/api/track?productId=${article.products[0].asin}&articleSlug=${article.slug}&rank=1`}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="group/cta flex items-center justify-center gap-3 rounded-2xl bg-data-lime px-10 py-5 text-center font-black uppercase tracking-widest text-black text-base hover:scale-[1.02] hover:shadow-glow-lime transition-all whitespace-nowrap active:scale-95"
              >
                Check Price
                <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform" />
              </a>
              {article.products.length > 1 && (
                <div className="text-[10px] font-bold text-center text-neutral-500 tracking-widest uppercase">
                  Runner up: <span className="text-offwhite">{article.products[1].short_title || article.products[1].title.split(' ').slice(0, 3).join(' ')}</span>
                </div>
              )}
            </div>
          </div>
        ) : quickTake ? (
          <div className="mb-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              Quick take
            </div>
            <p className="mt-3 text-lg leading-8 text-neutral-200">{quickTake}</p>
          </div>
        ) : null}

        {article.content_html ? (
          <div
            className="prose prose-invert mb-12 max-w-none text-neutral-300 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-white prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-xl prose-p:mb-6 prose-a:text-emerald-400 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />
        ) : null}

        {article.products.length > 0 ? (
          <section className="space-y-12 border-t border-white/5 pt-16">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
                Our top picks
              </h2>
              <p className="text-sm font-medium text-neutral-500">Independently vetted by the lab.</p>
            </div>
            <ProductGrid products={article.products} articleSlug={article.slug} />
            <ComparisonTable products={article.products} articleSlug={article.slug} title="Comparison at a glance" />
          </section>
        ) : null}

        <section className="mt-16 border-t border-white/5 pt-12">
          <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-trust-blue/10 text-trust-blue">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Editorial Methodology</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              ProAthletica rankings are independently vetted by our editorial board. We analyze thousands of data points — including real customer reviews and technical specs — to give you an honest score. No brand pays for a higher ranking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/methodology" className="text-sm font-bold text-trust-blue hover:text-white transition-colors underline underline-offset-4">
                Read our full scoring protocol →
              </Link>
              <Link href="/disclosure" className="text-sm font-bold text-neutral-500 hover:text-white transition-colors underline underline-offset-4">
                Affiliate Disclosure →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/5 pt-12">
          <FAQ />
        </section>

        {relatedArticles.length > 0 ? (
          <section className="mt-16 border-t border-white/5 pt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                Related guides
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                Continue exploring the same training cluster.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/best/${candidate.slug}`}
                  className="rounded-2xl border border-white/5 bg-neutral-900/30 p-5 hover:border-emerald-500/30"
                >
                  <div className="text-sm font-black uppercase tracking-wide text-emerald-400">
                    {candidate.cluster || candidate.category || 'Guide'}
                  </div>
                  <div className="mt-2 text-base font-black text-white">{candidate.title}</div>
                  {candidate.excerpt ? (
                    <p className="mt-2 text-sm text-neutral-400">{candidate.excerpt}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16 border-t border-white/5 pt-12">
          <Newsletter source={`article:${article.slug}`} />
        </section>
      </article>
    </>
  );
}
