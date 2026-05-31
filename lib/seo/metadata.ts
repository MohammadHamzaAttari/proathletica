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
  // Ensure we have a trailing-slash-free base URL and correct paths.
  const baseUrl = SITE_URL.replace(/\/$/, '');
  const canonicalPath = input.canonical || '';
  const canonical = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${baseUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`.replace(/\/$/, '');

  const image = input.image || `${baseUrl}/opengraph-image`;

  return {
    metadataBase: new URL(baseUrl),
    title: input.title, // If undefined, layout template uses 'default'
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
