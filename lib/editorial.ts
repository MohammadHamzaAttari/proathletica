type EditorialProduct = {
  id?: string;
  asin?: string;
  title?: string;
  name?: string;
  category?: string;
  keyword?: string;
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
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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

export function buildEditorialBenchmark(
  product: { title?: string; category?: string; description?: string | null; badge?: string | null; rating?: number | null },
  rank: number
): string {
  const title = product.title || 'This product';
  const category = (product.category || 'training').toLowerCase();
  const body = product.description || category;
  const summary = splitSummary(body);
  const badge = product.badge || '';
  const rating = product.rating ? Number(product.rating).toFixed(1) : '';

  if (rank === 0) {
    const first = normalizeSentence(
      `${title} is the most complete option in this ${category} group, with construction details that support hard training without feeling fragile`
    );
    const second =
      summary[0] && summary[0].split(/\s+/).length >= 5
        ? normalizeSentence(`${summary[0].replace(/\.$/, '')} That profile is why it sits first when durability and day-to-day performance matter most`)
        : normalizeSentence(`${badge || 'Its balance of build quality and performance'} makes it the strongest all-around buy for serious athletes`);
    return `${first} ${second}`;
  }

  if (summary.length >= 2) return summary.join(' ');

  return normalizeSentence(
    `${title} keeps the focus on ${category} performance${badge ? `, with ${badge.toLowerCase()}` : ''}${rating ? ` and a ${rating} rating` : ''} that make it easy to recommend`
  );
}
