import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { getAllProducts, getCategoryList, getPublishedArticles } from '@/lib/db';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, products] = await Promise.all([
    getPublishedArticles().catch(() => []),
    getCategoryList().catch(() => []),
    getAllProducts().catch(() => []),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/disclosure`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${SITE_URL}/data-deletion-request`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/methodology`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/best/${article.slug.replace(/-2026$/, '')}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // NEW: Individual product pages (addresses Audit Part 2 orphan pages / long-tail SEO)
  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    const slug = product.slug || product.asin?.toLowerCase() || product.id;
    return {
      url: `${SITE_URL}/product/${slug}`,
      lastModified: new Date(product.updated_at || product.last_scraped_at || now),
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    };
  });

  // NEW: Lifestyle environmental target silos
  const lifestylePages: MetadataRoute.Sitemap = ['gamers', 'moms', 'pets', 'apartment', 'budget'].map((slug) => ({
    url: `${SITE_URL}/lifestyle/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...productPages, ...lifestylePages];
}
