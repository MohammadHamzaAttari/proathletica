type EditorialProduct = {
  id?: string;
  asin?: string;
  title?: string;
  name?: string;
  category?: string;
  keyword?: string;
  raw_description?: string | null;
  description?: string;
  slug?: string | null;
  affiliate_url?: string;
  affiliateLink?: string;
  affiliateUrl?: string;
  badge?: string | null;
  rating?: number | null;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const normalizeAsin = (value?: string) => (value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

const TITLE_NOISE = new Set([
  'the', 'a', 'an', 'for', 'with', 'and', 'of', 'in', 'on', 'mens', 'womens', 'unisex', 'new',
  'best', 'pro', 'premium', 'official', 'genuine', 'pack', 'set', 'edition', '2024', '2025', '2026',
]);

const titleFingerprint = (value: string) =>
  normalize(value)
    .split(' ')
    .filter((word) => word && !TITLE_NOISE.has(word))
    .slice(0, 8)
    .join(' ');

const productKeys = (product: EditorialProduct): string[] => {
  const keys: string[] = [];

  const asin = normalizeAsin(product.asin || product.id);
  if (asin && asin.length >= 8) keys.push(`asin:${asin}`);

  const link = product.affiliate_url || product.affiliateLink || product.affiliateUrl || '';
  const linkMatch = link.match(/\/dp\/([A-Z0-9]{8,})/i);
  if (linkMatch) keys.push(`asin:${linkMatch[1].toUpperCase()}`);

  const title = product.title || product.name || '';
  const fp = titleFingerprint(title);
  if (fp && fp.split(' ').length >= 2) keys.push(`title:${fp}`);

  return keys;
};

export function dedupeProducts<T extends EditorialProduct>(products: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const product of products) {
    const keys = productKeys(product);
    if (keys.length === 0) { out.push(product); continue; }
    if (keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    out.push(product);
  }
  return out;
}

export function normalizeCategory(category?: string | null): string {
  if (!category) return 'General';
  return category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function categoryToSlug(category: string): string {
  return normalizeCategory(category).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function slugify(text: string): string {
  const s = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (s.length <= 60) return s;
  return s.slice(0, 60).replace(/-$/, '');
}

function normalizeSentence(value: string) {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function splitSummary(value: string) {
  const sentences = value.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) return sentences.slice(0, 2).map(normalizeSentence);
  const trimmed = value.trim();
  if (!trimmed) return [];
  return [normalizeSentence(trimmed.length <= 120 ? trimmed : trimmed.slice(0, 120))];
}

function detailFragment(product: { raw_description?: string | null; badge?: string | null; rating?: number | null }) {
  const summary = splitSummary(product.raw_description || '');
  if (summary.length > 0) return summary[0].replace(/\.$/, '');
  if (product.badge) return product.badge;
  if (product.rating) return `${Number(product.rating).toFixed(1)} rating`;
  return 'clear spec fit';
}

export function buildEditorialBenchmark(
  product: { title?: string; category?: string; raw_description?: string | null; badge?: string | null; rating?: number | null },
  rank: number
): string {
  const title = product.title || 'This product';
  const category = (product.category || 'training').toLowerCase();
  const summary = splitSummary(product.raw_description || category);
  const badge = product.badge || '';
  const rating = product.rating ? Number(product.rating).toFixed(1) : '';

  if (rank === 0) {
    return normalizeSentence(
      `${title} is the strongest all-around pick in this ${category} group because it combines the most useful features with the fewest compromises. ${detailFragment(product)}.`
    );
  }

  if (rank === 1) {
    return normalizeSentence(
      `${title} is the best value angle if you want a lower-friction ${category} buy. ${detailFragment(product)}.`
    );
  }

  if (rank === 2) {
    return normalizeSentence(
      `${title} is the practical budget or space-saving option in the group. ${detailFragment(product)}.`
    );
  }

  if (summary.length >= 2) return summary.join(' ');

  return normalizeSentence(
    `${title} is a solid ${category} alternative${badge ? ` with ${badge.toLowerCase()}` : ''}${rating ? ` and a ${rating} rating` : ''}; ${detailFragment(product)}.`
  );
}
