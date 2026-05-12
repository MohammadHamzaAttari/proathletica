import { unstable_cache, revalidateTag } from 'next/cache';
import { normalizeCategory } from '@/lib/editorial';
import { createReadClient, createServiceClient } from '@/lib/supabase/server';
import type { Article, ArticleWithProducts, Product } from '@/lib/types';

const CACHE_REVALIDATE = 300; // 5 min

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createReadClient();
  if (!supabase) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('rank', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(500);
  if (error) {
    console.error('[db] getAllProducts:', error.message);
    return [];
  }
  return (data || []) as Product[];
}

export const getProductById = unstable_cache(
  async (id: string): Promise<Product | null> => {
    const supabase = createReadClient();
    if (!supabase) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const byId = await sb.from('products').select('*').eq('id', id).maybeSingle();
    if (byId.data) return byId.data as Product;
    const byAsin = await sb.from('products').select('*').eq('asin', id).maybeSingle();
    if (byAsin.data) return byAsin.data as Product;
    return null;
  },
  ['product-by-id'],
  { revalidate: CACHE_REVALIDATE, tags: ['products'] }
);

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  const targetSlug = categorySlug.toLowerCase().replace(/^best-/, '').replace(/-gear$/, '');
  const filtered = products.filter((p) => {
    const normalized = normalizeCategory(p.category).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return normalized.includes(targetSlug) || targetSlug.includes(normalized);
  });
  return filtered.length > 0 ? filtered : products;
}

export async function getCategoryList(): Promise<Array<{ name: string; slug: string; count: number }>> {
  const products = await getAllProducts();
  const map = new Map<string, number>();
  for (const product of products) {
    const category = normalizeCategory(product.category);
    map.set(category, (map.get(category) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// ─── Articles ────────────────────────────────────────────────────────────────

export const getPublishedArticles = unstable_cache(
  async (): Promise<Article[]> => {
    const supabase = createReadClient();
    if (!supabase) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('articles')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(200);
    if (error) { console.error('[db] getPublishedArticles:', error.message); return []; }
    return (data || []) as Article[];
  },
  ['published-articles'],
  { revalidate: CACHE_REVALIDATE, tags: ['articles'] }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<ArticleWithProducts | null> => {
    const supabase = createReadClient();
    if (!supabase) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data: article, error: articleError } = await sb
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .maybeSingle();
    if (articleError || !article) return null;

    const { data: links, error: linksError } = await sb
      .from('article_products')
      .select('position, custom_blurb, products(*)')
      .eq('article_id', article.id)
      .order('position', { ascending: true });
    if (linksError) console.error('[db] getArticleBySlug links:', linksError.message);

    const products = ((links || []) as Array<{ products: Product; position: number; custom_blurb: string | null }>)
      .filter((link) => link.products)
      .map((link) => ({ ...link.products, position: link.position, custom_blurb: link.custom_blurb }));

    return { ...(article as Article), products: products as ArticleWithProducts['products'] };
  },
  ['article-by-slug'],
  { revalidate: CACHE_REVALIDATE, tags: ['articles'] }
);

// ─── Writes ──────────────────────────────────────────────────────────────────

export async function recordClick(input: {
  productId?: string | null;
  articleSlug?: string | null;
  rank?: number | null;
  country?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ipHash?: string | null;
}): Promise<void> {
  const supabase = createServiceClient();
  if (!supabase) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('click_events').insert({
    product_id: input.productId || null,
    article_slug: input.articleSlug || null,
    rank: input.rank || null,
    country: input.country || null,
    referrer: input.referrer || null,
    user_agent: input.userAgent || null,
    ip_hash: input.ipHash || null,
  });
  if (error) console.error('[db] recordClick:', error.message);
}

export async function recordSubscriber(email: string, source = 'inline') {
  const supabase = createServiceClient();
  if (!supabase) return { ok: true, reason: 'supabase_not_configured' };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('subscribers').insert({ email, source });
  if (error) {
    if (error.code === '23505') return { ok: true, reason: 'already_subscribed' };
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}

// ─── Cache busting ───────────────────────────────────────────────────────────

export function bustProductsCache() { revalidateTag('products'); }
export function bustArticlesCache() { revalidateTag('articles'); }
