import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/config';

interface PageMetaInput {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  priceAmount?: number;
  priceCurrency?: string;
  pinterestImage?: string;
  noindex?: boolean;
}

/**
 * FIX (Audit #02-A): every page now gets a unique title, description,
 * canonical tag, and Open Graph block — rendered server-side so Pinterest,
 * Facebook, and AI crawlers all see it.
 */
export function buildMetadata(input: PageMetaInput = {}): Metadata {
  const pageTitle = input.title || '';
  const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
  const description = input.description || SITE_DESCRIPTION;
  const canonical = input.canonical
    ? input.canonical.startsWith('http')
      ? input.canonical
      : `${SITE_URL}${input.canonical.startsWith('/') ? '' : '/'}${input.canonical}`
    : SITE_URL;
  const image = input.image || `${SITE_URL}/opengraph-image`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    // FIX: canonical is now server-rendered HTML, not a client useEffect
    alternates: { canonical },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: input.type || 'website',
      images: [{ url: image, width: 1200, height: 630, alt: input.title || SITE_NAME }],
      locale: 'en_US',
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.priceAmount ? { 'product:price:amount': input.priceAmount } : {}),
      ...(input.priceCurrency ? { 'product:price:currency': input.priceCurrency } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    other: {
      'msapplication-TileColor': '#10b981',
      ...(input.pinterestImage ? { 'pinterest:image': input.pinterestImage } : {}),
    },
  };
}
