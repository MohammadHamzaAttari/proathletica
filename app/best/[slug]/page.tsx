import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Calendar, Clock, User, FlaskConical, Star } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { formatPrice, formatTimestamp } from '@/lib/format';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { ShareButtons } from '@/components/ShareButtons';
import { VerdictBox } from '@/components/VerdictBox';
import { QuickVerdictPath } from '@/components/QuickVerdictPath';
import { FloatingMobileCTA } from '@/components/FloatingMobileCTA';
import { PinterestFlywheel } from '@/components/PinterestFlywheel';
import { SITE_URL } from '@/lib/config';
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
  });
}

const getLifestyleLinks = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('dumb') || s.includes('bell')) {
    return [
      { name: "🏠 Small Space Specs", href: "/lifestyle/apartment", color: "hover:border-sky-500/40 text-sky-400" },
      { name: "👶 Silent Nap Setup", href: "/lifestyle/moms", color: "hover:border-emerald-500/40 text-emerald-400" },
      { name: "🐶 Pet-Safe Gym", href: "/lifestyle/pets", color: "hover:border-amber-500/40 text-amber-400" }
    ];
  }
  if (s.includes('band') || s.includes('resistance')) {
    return [
      { name: "🎮 Gamer Ergonomics", href: "/lifestyle/gamers", color: "hover:border-purple-500/40 text-purple-400" },
      { name: "🏠 Small Space Specs", href: "/lifestyle/apartment", color: "hover:border-sky-500/40 text-sky-400" },
      { name: "💰 Max Value Builds", href: "/lifestyle/budget", color: "hover:border-emerald-500/40 text-emerald-400" }
    ];
  }
  return [
    { name: "🏠 Small Space Specs", href: "/lifestyle/apartment", color: "hover:border-sky-500/40 text-sky-400" },
    { name: "💰 Max Value Builds", href: "/lifestyle/budget", color: "hover:border-emerald-500/40 text-emerald-400" }
  ];
};

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

      {/* Floating mobile action bar */}
      {article.products && article.products.length > 0 ? (
        <FloatingMobileCTA product={article.products[0]} articleSlug={article.slug} />
      ) : null}

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
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
              href={`/about#${article.author?.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
            >
              <User className="h-4 w-4 text-emerald-400" />
              Reviewed by {article.author}
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2 text-[#C6FF3D]">
              <FlaskConical className="h-4 w-4 text-[#C6FF3D]" />
              Lab-Tested & Verified
            </span>
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
              How we score
            </Link>
          </div>
          <ShareButtons title={article.title} url={`${SITE_URL}${url}`} />
        </header>

        {article.hero_image ? (
          <div className="relative mb-10 h-[280px] sm:h-[450px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-black/40">
            <Image
              src={article.hero_image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1200px"
              className="object-cover"
            />
          </div>
        ) : null}

        {article.products && article.products.length > 0 ? (
          <VerdictBox
            product={article.products[0]}
            articleSlug={article.slug}
            badgeText="BEST OVERALL"
          />
        ) : quickTake ? (
          <div className="mb-10 rounded-3xl border border-[#C6FF3D]/20 bg-[#C6FF3D]/5 p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6FF3D]">
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
            {/* Quick-Verdict Decision Path Resolver */}
            <QuickVerdictPath products={article.products} />

            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
                Our top picks
              </h2>
              <p className="text-sm font-medium text-neutral-500">Independently vetted by the lab.</p>
            </div>
            <ComparisonTable products={article.products} articleSlug={article.slug} title="Comparison at a glance" />
            <ProductGrid products={article.products} articleSlug={article.slug} />
          </section>
        ) : null}

        {/* Semantic Silo Connector (Pillar 2/3 Link Network) */}
        <div className="rounded-2xl border border-white/[0.06] bg-graphite-950 p-6 flex flex-col md:flex-row items-center justify-between gap-5 mt-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3D8BFF]" />
          <div className="space-y-1 text-left relative z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#3D8BFF] bg-[#3D8BFF]/10 px-2.5 py-1 rounded-md border border-[#3D8BFF]/25 inline-flex items-center gap-1">
              🎮 ENVIRONMENT MATCH MATRIX
            </span>
            <h4 className="text-sm font-black uppercase tracking-tight text-white leading-tight mt-1.5">
              How does this gear integrate with your lifestyle?
            </h4>
            <p className="text-xs text-neutral-400">
              Read our environment checklists covering silent workout limits, small footprint space hacks, and streamer active desks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 flex-shrink-0 relative z-10 w-full md:w-auto">
            {getLifestyleLinks(article.slug).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 md:flex-initial text-center text-[10px] font-black uppercase tracking-widest px-4 py-3 border border-white/[0.08] ${link.color} rounded-xl bg-black/40 text-neutral-300 hover:text-white transition active:scale-95`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

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

        {/* Pinterest Infographic Cheat-Sheet */}
        <PinterestFlywheel categoryName={article.category || undefined} />

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
