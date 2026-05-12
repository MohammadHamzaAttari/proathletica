import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, User } from 'lucide-react';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { ShareButtons } from '@/components/ShareButtons';
import { SITE_URL } from '@/lib/config';
import { getArticleBySlug, getPublishedArticles } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema, itemListSchema, jsonLdProps } from '@/lib/seo/schema';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
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
    canonical: `/best/${article.slug}`,
    image: article.hero_image || undefined,
    type: 'article',
    publishedTime: article.published_at || undefined,
    modifiedTime: article.updated_at,
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
          <div className="flex flex-wrap items-center gap-6 border-t border-white/5 pt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <span className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Updated{' '}
              {new Date(article.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {article.read_minutes} min read
            </span>
          </div>
          <ShareButtons title={article.title} url={`${SITE_URL}${url}`} />
        </header>

        {article.hero_image ? (
          <img
            src={article.hero_image}
            alt={article.title}
            className="mb-10 max-h-[500px] w-full rounded-2xl object-cover"
          />
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
          </section>
        ) : null}

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
