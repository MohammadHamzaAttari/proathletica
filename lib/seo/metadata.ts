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
  // FIX (Audit v2 Bug #1): Do not append brand name here, let layout.tsx template handle it
  // or use it as a standalone title if no template is used.
  // Actually, since buildMetadata is used in pages that might not use the template correctly
  // or where we want full control, we should keep it flexible.
  // BUT the layout.tsx template IS being used.
  let fullTitle = pageTitle || SITE_NAME;

  // Truncate to safe SERP length (~60 chars)
  if (fullTitle.length > 60) {
    fullTitle = fullTitle.slice(0, 57).trim() + '...';
  }

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
      images: [
        { url: image, width: 1200, height: 630, alt: input.title || SITE_NAME },
        ...(input.pinterestImage ? [{ url: input.pinterestImage, width: 1000, height: 1500, alt: input.title || SITE_NAME }] : []),
      ],
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
