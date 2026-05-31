import { SITE_NAME, SITE_URL } from '@/lib/config';
import type { Article, Product } from '@/lib/types';

/* ─────────────────────────────────────────────
   ORGANIZATION
───────────────────────────────────────────── */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.svg`,
      width: 60,
      height: 60,
    },
    description: 'Independent fitness gear rankings built on verified customer data, specs analysis, and honest editorial tradeoffs.',
    foundingDate: '2024',
    sameAs: [
      'https://pinterest.com/proathletica',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      url: `${SITE_URL}/contact`,
    },
  };
}

/* ─────────────────────────────────────────────
   WEBSITE
───────────────────────────────────────────── */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Data-driven fitness gear rankings for home gym builders, apartment dwellers, and beginners.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/* ─────────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────────── */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/* ─────────────────────────────────────────────
   PRODUCT + AggregateRating + Review
───────────────────────────────────────────── */
export function productSchema(product: Product) {
  const priceStr = product.price_cents ? (product.price_cents / 100).toFixed(2) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image_url ? [product.image_url] : undefined,
    description: product.description || product.editorial_summary || product.keyword || product.title,
    sku: product.asin,
    mpn: product.asin,
    brand: {
      '@type': 'Brand',
      name: product.brand || product.title.split(' ')[0] || SITE_NAME,
    },
    ...(priceStr
      ? {
          offers: {
            '@type': 'Offer',
            url: product.affiliate_url,
            priceCurrency: product.currency || 'USD',
            price: priceStr,
            priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 day
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'Amazon',
            },
          },
        }
      : {}),
    ...(product.rating && product.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating).toFixed(1),
            bestRating: '5',
            worstRating: '1',
            reviewCount: String(Math.max(product.review_count || 1, 1)),
          },
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: Number(product.rating).toFixed(1),
              bestRating: '5',
            },
            author: {
              '@type': 'Organization',
              name: SITE_NAME,
            },
            reviewBody: product.editorial_summary || `Editorial evaluation of the ${product.title} based on technical specs and user data.`,
          },
        }
      : {}),
  };
}

/* ─────────────────────────────────────────────
   ARTICLE (E-E-A-T enhanced)
───────────────────────────────────────────── */
export function articleSchema(article: Partial<Article> & { title: string; updated_at: string }, url: string) {
  const canonicalUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.hero_image ? [article.hero_image] : undefined,
    author: {
      '@type': 'Person',
      name: article.author || 'ProAthletica Editorial Team',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    // E-E-A-T signals
    about: {
      '@type': 'Thing',
      name: article.category || 'Fitness Equipment',
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}

/* ─────────────────────────────────────────────
   ITEM LIST (ranked product lists)
───────────────────────────────────────────── */
export function itemListSchema(products: Product[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Fitness Gear Rankings',
    url: pageUrl.startsWith('http') ? pageUrl : `${SITE_URL}${pageUrl}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/product/${product.slug || product.asin}`,
      item: productSchema(product),
    })),
  };
}

/* ─────────────────────────────────────────────
   FAQ PAGE
───────────────────────────────────────────── */
export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/* ─────────────────────────────────────────────
   PERSON schema — author E-E-A-T
───────────────────────────────────────────── */
export function personSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  credentials: string[];
  url?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    hasCredential: person.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: c,
    })),
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(person.url ? { url: person.url } : {}),
    ...(person.image ? { image: person.image } : {}),
  };
}

/* ─────────────────────────────────────────────
   HOW-TO (buyer guide pages)
───────────────────────────────────────────── */
export function howToSchema(params: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    step: params.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/* ─────────────────────────────────────────────
   JSON-LD PROPS helper
───────────────────────────────────────────── */
export function jsonLdProps(data: object | object[]) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
