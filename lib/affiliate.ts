import { AMAZON_DOMAIN_BY_COUNTRY, AMAZON_TAGS, FORCE_AMAZON_ONLY } from '@/lib/config';

// Strict allowlist — only actual Amazon hostnames and amzn.to shortlinks
const ALLOWED_AMAZON_HOSTS = /(?:^|\.)amazon\.[a-z.]{2,6}$/i;
const ALLOWED_SHORT_HOSTS = /^amzn\.to$/i;

/**
 * FIX (Audit #05-12): validate URL against strict Amazon hostname allowlist
 * to prevent open-redirect abuse.
 */
export function isSafeAmazonUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const h = parsed.hostname.toLowerCase().replace(/^www\./, '');
    return ALLOWED_AMAZON_HOSTS.test(h) || ALLOWED_SHORT_HOSTS.test(h);
  } catch {
    return false;
  }
}

export function extractAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{8,})/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * FIX (Audit #03-D): geo-aware Amazon URL — swap domain + inject correct tag.
 * Called from /api/track which reads Vercel's x-vercel-ip-country header.
 */
export function regionalizeAmazonUrl(originalUrl: string, country?: string | null): string {
  if (!isSafeAmazonUrl(originalUrl)) return originalUrl;

  const asin = extractAsin(originalUrl);
  const cc = (country || 'US').toUpperCase();
  const domain = AMAZON_DOMAIN_BY_COUNTRY[cc] || 'amazon.com';
  const tag = (AMAZON_TAGS as Record<string, string>)[cc] || AMAZON_TAGS.US;

  if (asin) {
    return `https://www.${domain}/dp/${asin}?tag=${encodeURIComponent(tag)}&linkCode=ll1&language=en_US`;
  }

  try {
    const parsed = new URL(originalUrl);
    parsed.hostname = `www.${domain}`;
    parsed.searchParams.set('tag', tag);
    return parsed.toString();
  } catch {
    return originalUrl;
  }
}

// ─── Direct Partner Commission Registry (Hybrid Model) ──────────
export interface PartnerInfo {
  isPartner: boolean;
  commissionRate: string;
  transparencyNote: string;
  name: string;
}

const DIRECT_PARTNERS: Record<string, PartnerInfo> = {
  'rogue fitness': {
    isPartner: true,
    name: 'Rogue Fitness',
    commissionRate: '5%',
    transparencyNote: 'Official Rogue Fitness Direct Partner (5% Est. Commission)'
  },
  'wahoo fitness': {
    isPartner: true,
    name: 'Wahoo Fitness',
    commissionRate: '8%',
    transparencyNote: 'Official Wahoo Fitness Direct Partner (8% Est. Commission)'
  },
  'life fitness': {
    isPartner: true,
    name: 'Life Fitness',
    commissionRate: '8%',
    transparencyNote: 'Official Life Fitness Direct Partner (8% Est. Commission)'
  },
  'gnc': {
    isPartner: true,
    name: 'GNC',
    commissionRate: '15%',
    transparencyNote: 'Official GNC Supplements Partner (15% Est. Commission)'
  },
  'clickbank': {
    isPartner: true,
    name: 'ClickBank',
    commissionRate: '30-75%',
    transparencyNote: 'Direct Educational App Partner (30-75% Est. Commission)'
  },
  'clickbank academy': {
    isPartner: true,
    name: 'ClickBank',
    commissionRate: '30-75%',
    transparencyNote: 'Direct Educational App Partner (30-75% Est. Commission)'
  }
};

/**
 * Returns partner info if a brand matches one of our premium direct programs.
 */
export function getBrandPartnerInfo(brand: string | null | undefined): PartnerInfo {
  if (FORCE_AMAZON_ONLY) {
    return { isPartner: false, commissionRate: '3%', transparencyNote: 'Amazon Associate Affiliate (3% Commission)', name: 'Amazon' };
  }
  if (!brand) {
    return { isPartner: false, commissionRate: '3%', transparencyNote: 'Amazon Associate Affiliate (3% Commission)', name: 'Amazon' };
  }
  const cleanBrand = brand.toLowerCase().trim();
  
  // Exact or prefix match
  for (const [key, value] of Object.entries(DIRECT_PARTNERS)) {
    if (cleanBrand.includes(key) || key.includes(cleanBrand)) {
      return value;
    }
  }
  
  return {
    isPartner: false,
    commissionRate: '3%',
    transparencyNote: 'Amazon Associate Affiliate (3% Commission)',
    name: 'Amazon'
  };
}

