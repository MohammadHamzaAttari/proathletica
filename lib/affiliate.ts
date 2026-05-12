import { AMAZON_DOMAIN_BY_COUNTRY, AMAZON_TAGS } from '@/lib/config';

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
