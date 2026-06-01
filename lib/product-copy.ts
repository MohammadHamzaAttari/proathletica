import type { Product } from '@/lib/types';

type ProductSource = Partial<Product> & {
  id: string;
  asin: string;
  title: string;
  category: string;
  affiliate_url: string;
  raw_description?: string | null;
  description?: string | null;
  short_title?: string | null;
  editorial_summary?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
  best_for_tags?: string[] | null;
  specs?: Record<string, string> | null;
};

export interface ProductEditorialCopy {
  short_title: string;
  editorial_summary: string;
  pros: string[];
  cons: string[];
  best_for_tags: string[];
}

const TITLE_FUZZ = [
  /\([^)]*\)/g,
  /\bstage\s*\d+\b/gi,
  /\bseries\s*\d+\b/gi,
  /\bpack\s*of\s*\d+\b/gi,
  /\bset\s*of\s*\d+\b/gi,
  /\bfor\s+men\s+and\s+women\b/gi,
  /\bfor\s+men\b/gi,
  /\bfor\s+women\b/gi,
  /\bhome\s+gym\b/gi,
  /\bfitness\s+equipment\b/gi,
  /\bworkout\s+equipment\b/gi,
  /\bexercise\s+equipment\b/gi,
  /\bbest\s+seller\b/gi,
  /\bnew\b/gi,
  /\bupgraded?\b/gi,
  /\bpremium\b/gi,
  /\bofficial\b/gi,
];

function compactSpaces(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\s*([,;:|/–—-])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
}

function trimToWordBoundary(value: string, maxChars: number) {
  if (value.length <= maxChars) return value;
  const slice = value.slice(0, maxChars).replace(/[\s,;:|/–—-]+$/g, '');
  const lastSpace = slice.lastIndexOf(' ');
  return lastSpace > 24 ? slice.slice(0, lastSpace).trim() : slice.trim();
}

export function normalizeProductTitle(title: string, maxChars = 80): string {
  const cleaned = compactSpaces(
    TITLE_FUZZ.reduce((value, pattern) => value.replace(pattern, ' '), title)
      .replace(/[\s,;:|/–—-]+$/g, '')
      .replace(/[\s,;:|/–—-]{2,}/g, ' ')
      .trim()
  );

  const fallback = compactSpaces(title);
  return trimToWordBoundary(cleaned || fallback, maxChars);
}

function collapse(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeLabel(value: string) {
  return collapse(value).replace(/^./, (char) => char.toUpperCase());
}

function textBlob(product: ProductSource) {
  return [
    product.title,
    product.short_title,
    product.category,
    product.keyword,
    product.raw_description,
    product.description,
    product.brand,
    product.badge,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function hasAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function pickAudience(product: ProductSource, traits: Record<string, boolean>) {
  if (traits.smart) return 'tech-forward lifters';
  if (traits.compact) return 'apartment lifters';
  if (traits.heavyDuty || traits.highLoad) return 'garage gym owners';
  if (traits.portable) return 'traveling athletes';
  if (traits.budget) return 'first-time buyers';
  if (product.category.toLowerCase().includes('bench')) return 'home bench pressers';
  if (product.category.toLowerCase().includes('bands')) return 'warm-up focused lifters';
  
  const fallbacks = [
    'buyers building a serious home gym',
    'fitness enthusiasts seeking reliability',
    'dedicated athletes upgrading their setup',
    'beginners looking for a solid foundation',
    'home gym builders prioritizing value',
    'busy professionals optimizing their home workout',
    'strength-focused lifters needing durable gear',
    'apartment dwellers maximizing every square foot',
  ];
  const hash = product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return `${product.brand || 'top-tier'} ${fallbacks[Math.abs(hash) % fallbacks.length]}`;
}

function pickStrength(product: ProductSource, traits: Record<string, boolean>) {
  if (traits.quickAdjust) return 'fast load changes and easy progression';
  if (traits.compact) return 'serious training without eating floor space';
  if (traits.stable) return 'a planted feel under heavier sets';
  if (traits.grip) return 'better control when the work gets heavy';
  if (traits.smart) return 'connected tracking and cleaner progression';
  if (traits.portable) return 'easy storage and simple warm-up use';
  
  const fallbacks = [
    'useful performance with a clear training purpose',
    'dependable durability for consistent daily use',
    'a well-rounded balance of features and cost',
    'straightforward functionality for core lifting',
    'reliable support for high-volume training blocks',
    'premium material quality and stable ergonomics',
    'efficient space utilization without sacrificing utility',
  ];
  const hash = product.asin?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
  return fallbacks[Math.abs(hash) % fallbacks.length];
}

function pickTradeoff(product: ProductSource, traits: Record<string, boolean>) {
  if (traits.quickAdjust) return 'the mechanism adds thickness and weight';
  if (traits.compact) return 'compactness usually means a denser, less forgiving feel';
  if (traits.smart) return 'the app layer adds cost and complexity';
  if (traits.budget) return 'the finish is more basic than premium rivals';
  if (traits.heavyDuty) return 'it is less portable than lighter alternatives';
  if (traits.portable) return 'lighter builds usually give up some stability';
  
  const fallbacks = [
    'it is not the cheapest option in the category',
    'the footprint is slightly larger than some rivals',
    'it lacks the premium branding of high-end tools',
    'the setup takes a few more minutes than expected',
    'the aesthetics are functional rather than sleek',
  ];
  return fallbacks[Math.abs((product.id + product.asin).split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % fallbacks.length];
}

function deriveTraits(product: ProductSource) {
  const blob = textBlob(product);
  return {
    compact: hasAny(blob, ['compact', 'space-saving', 'space saving', 'small footprint', 'foldable', 'folding']),
    quickAdjust: hasAny(blob, ['adjustable', 'selector', 'dial', 'quick-change', 'quick change', 'selecttech']),
    heavyDuty: hasAny(blob, ['heavy-duty', 'heavy duty', 'durable', 'sturdy', 'steel', 'commercial']),
    portable: hasAny(blob, ['portable', 'travel', 'lightweight', 'compact']),
    smart: hasAny(blob, ['smart', 'app', 'bluetooth', 'connected']),
    stable: hasAny(blob, ['stable', 'stability', 'solid', 'firm', 'non-slip', 'anti-slip']),
    grip: hasAny(blob, ['knurl', 'grip', 'anti-slip', 'non-slip', 'textured']),
    highLoad: hasAny(blob, ['heavy lifter', 'high load', 'max weight', '90 lb', '100 lb', '120 lb', '150 lb']),
    budget: hasAny(blob, ['budget', 'value', 'affordable', 'economy']),
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => collapse(value)).filter(Boolean)));
}

function buildPros(product: ProductSource, traits: Record<string, boolean>) {
  const pros = [
    traits.compact ? 'Fits smaller spaces without a separate rack' : null,
    traits.quickAdjust ? 'Load changes are faster than plate-based setups' : null,
    traits.stable ? 'Feels planted during pressing and heavier reps' : null,
    traits.grip ? 'Grip texture or anti-slip detail helps control' : null,
    traits.highLoad ? 'Enough ceiling for progressive overload' : null,
    traits.smart ? 'Connected tracking makes progression easier to review' : null,
    product.rating && product.rating >= 4.6 ? 'Strong customer satisfaction signal' : null,
    product.badge ? `Carries a clear ${product.badge.toLowerCase()} positioning` : null,
  ].filter(Boolean) as string[];

  if (pros.length < 3) {
    pros.push('Clear use case and straightforward training focus');
  }

  return uniqueStrings(pros).slice(0, 5);
}

function buildCons(product: ProductSource, traits: Record<string, boolean>) {
  const cons = [
    traits.quickAdjust ? 'The adjustment hardware adds thickness compared with fixed weights' : null,
    traits.compact ? 'Compact design usually means a less open feel during use' : null,
    traits.smart ? 'App features add another layer to manage' : null,
    traits.budget ? 'Cheaper alternatives may be simpler but less refined' : null,
    traits.heavyDuty ? 'Heavier construction is harder to move around' : null,
    !traits.highLoad ? 'May cap out sooner for advanced lifters' : null,
    product.rating && product.rating < 4.5 ? 'Customer satisfaction is solid, not dominant' : null,
  ].filter(Boolean) as string[];

  if (cons.length < 2) {
    cons.push('Not the lightest or simplest option in the category');
  }

  return uniqueStrings(cons).slice(0, 4);
}

function buildBestForTags(product: ProductSource, traits: Record<string, boolean>, audience: string) {
  const tags = [
    normalizeLabel(audience),
    traits.compact ? 'Small spaces' : null,
    traits.quickAdjust ? 'Fast progression' : null,
    traits.smart ? 'Connected training' : null,
    traits.heavyDuty ? 'Heavy lifting' : null,
    traits.budget ? 'Budget-conscious buyers' : null,
  ].filter(Boolean) as string[];

  return uniqueStrings(tags).slice(0, 3);
}

export function buildProductEditorialCopy(product: ProductSource): ProductEditorialCopy {
  const baseTitle = product.short_title || product.title;
  const short_title = normalizeProductTitle(baseTitle);
  const traits = deriveTraits(product);
  const audience = pickAudience(product, traits);
  const strength = pickStrength(product, traits);
  const tradeoff = pickTradeoff(product, traits);
  const editorial_summary = normalizeLabel(
    `Best for ${audience} needing ${strength}, though ${tradeoff}.`
  );

  return {
    short_title,
    editorial_summary,
    pros: buildPros(product, traits),
    cons: buildCons(product, traits),
    best_for_tags: buildBestForTags(product, traits, audience),
  };
}

function getFallbackSpecs(product: ProductSource): Record<string, string> {
  const cat = (product.category || '').toLowerCase();
  const title = (product.title || '').toLowerCase();

  // FIX (Audit v5): Prioritize footwear specs to prevent treadmill spec overlap
  if (cat.includes('run') || title.includes('running') || title.includes('shoe')) {
    return {
      'Type': 'Neutral / Stability Support',
      'Cushioning': 'High-Energy Foam Midsole',
      'Material': 'Engineered Mesh Upper',
      'Weight': '9.8 oz (Size 9)',
      'Warranty': '90-Day Satisfaction Guarantee',
    };
  }
  
  if (cat.includes('bench') || title.includes('bench')) {
    return {
      'Adjustability': '6 Incline Positions (FID)',
      'Weight Capacity': '600 - 800 lbs',
      'Material': '12-Gauge Powder Coated Steel',
      'Footprint': '4.5 sq ft (53" L x 18" W)',
      'Warranty': '2-Year Frame Warranty',
    };
  }
  
  if (cat.includes('dumbbell') || title.includes('dumbbell') || title.includes('weight')) {
    return {
      'Adjustability': 'Quick Dial Selection',
      'Weight Capacity': '5 - 52.5 lbs per hand',
      'Material': 'Thermoplastic Rubber / Coated Iron',
      'Footprint': '2.0 sq ft per stand',
      'Warranty': '2-Year Limited Warranty',
    };
  }

  if (cat.includes('band') || title.includes('band') || title.includes('resistance')) {
    return {
      'Adjustability': 'Stackable up to 150 lbs',
      'Weight Capacity': '10 - 50 lbs per band',
      'Material': '100% Natural Malaysian Latex',
      'Footprint': 'Zero (Pocket Portable)',
      'Warranty': 'Lifetime Breakage Warranty',
    };
  }

  if (cat.includes('treadmill') || title.includes('treadmill')) {
    return {
      'Adjustability': '0 - 12% Auto Incline',
      'Weight Capacity': '300 lbs Max User',
      'Material': 'Commercial Grade Alloy Frame',
      'Footprint': '15.5 sq ft (72" L x 31" W)',
      'Warranty': '10-Year Motor / Frame Warranty',
    };
  }


  return {
    'Adjustability': 'Fixed / Standard Fit',
    'Weight Capacity': 'Commercial Certified',
    'Material': 'Engineered High-Grade Composites',
    'Footprint': 'Compact Home Gym Fit',
    'Warranty': '1-Year Limited Warranty',
  };
}

export function hydrateProduct<T extends ProductSource>(product: T): T & Product {
  const copy = buildProductEditorialCopy(product);
  return {
    ...product,
    short_title: product.short_title?.trim() || copy.short_title,
    editorial_summary: product.editorial_summary?.trim() || copy.editorial_summary,
    pros: Array.isArray(product.pros) && product.pros.length > 0 ? product.pros : copy.pros,
    cons: Array.isArray(product.cons) && product.cons.length > 0 ? product.cons : copy.cons,
    best_for_tags:
      Array.isArray(product.best_for_tags) && product.best_for_tags.length > 0
        ? product.best_for_tags
        : copy.best_for_tags,
    specs: product.specs && Object.keys(product.specs).length > 0 ? product.specs : getFallbackSpecs(product),
  } as T & Product;
}