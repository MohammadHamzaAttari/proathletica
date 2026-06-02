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
  const description = input.description || SITE_DESCRIPTION;

  // FIX (Audit v3): Robust canonical handling.
  const baseUrl = SITE_URL.replace(/\/$/, '');
  const canonicalPath = input.canonical || '';
  const canonical = (
    canonicalPath.startsWith('http')
      ? canonicalPath
      : `${baseUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`
  )
    .split('?')[0]
    .split('#')[0]
    .replace(/\/$/, '');

  const image = input.image || `${baseUrl}/opengraph-image`;

  // FIX (Audit v5): Use template correctly. Layout appends | SITE_NAME
  // If we want absolute control, we use { absolute: ... }
  // But to avoid duplication, we provide just the title and let template handle it,
  // OR we provide absolute title and ensure layout doesn't double-dip.
  const pageTitle = input.title;

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle ? { absolute: `${pageTitle} | ${SITE_NAME}` } : undefined,
    description: description.length > 160 ? description.slice(0, 157) + '...' : description,
    alternates: { canonical },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      title: input.title || SITE_NAME,
      description: description.length > 160 ? description.slice(0, 157) + '...' : description,
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
      title: input.title || SITE_NAME,
      description: description.length > 160 ? description.slice(0, 157) + '...' : description,
      images: [image],
    },
    other: {
      'msapplication-TileColor': '#10b981',
      ...(input.pinterestImage ? { 'pinterest:image': input.pinterestImage } : {}),
    },
  };
}
