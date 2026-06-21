export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'ProAthletica';

// Safe-guard to ensure SITE_URL aligns with middleware.ts subdomain redirects
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.athletica.page';
export const SITE_URL = (
  rawSiteUrl.includes('//athletica.page')
    ? rawSiteUrl.replace('//athletica.page', '//www.athletica.page')
    : rawSiteUrl
).replace(/\/$/, '');
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Independent reviews of the best fitness equipment, powerlifting gear, running shoes, and supplements — hand-picked by competing athletes.';

export const CONTACT_EMAIL = process.env.NEWSLETTER_FROM_EMAIL || 'hello@athletica.page';
export const NEWSLETTER_FROM_NAME = process.env.NEWSLETTER_FROM_NAME || SITE_NAME;
export const PINTEREST_DOMAIN_VERIFY = (process.env.PINTEREST_DOMAIN_VERIFY?.startsWith('YOUR_REAL_') ? '' : process.env.PINTEREST_DOMAIN_VERIFY) || '';

export const DEFAULT_AUTHOR = 'Athletica Lab';

export const AMAZON_TAGS = {
  US: process.env.AMAZON_AFFILIATE_TAG_US || 'proathletica-20',
  UK: process.env.AMAZON_AFFILIATE_TAG_UK || 'proathletica-21',
  CA: process.env.AMAZON_AFFILIATE_TAG_CA || 'proathletica-20',
  DE: process.env.AMAZON_AFFILIATE_TAG_DE || 'proathletica-21',
  AU: process.env.AMAZON_AFFILIATE_TAG_AU || 'proathletica-21',
} as const;

export const AMAZON_DOMAIN_BY_COUNTRY: Record<string, string> = {
  US: 'amazon.com',
  UK: 'amazon.co.uk',
  GB: 'amazon.co.uk',
  CA: 'amazon.ca',
  DE: 'amazon.de',
  AU: 'amazon.com.au',
  FR: 'amazon.fr',
  IT: 'amazon.it',
  ES: 'amazon.es',
  IN: 'amazon.in',
  JP: 'amazon.co.jp',
};

export const CACHE_TTL_PRODUCTS = 300;
export const CACHE_TTL_PAGES = 3600;
