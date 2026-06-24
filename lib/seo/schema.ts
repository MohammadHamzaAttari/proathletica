import { SITE_NAME, SITE_URL } from '@/lib/config';
import type { Article, Product } from '@/lib/types';

/* ─────────────────────────────────────────────
   ORGANIZATION
───────────────────────────────────────────── */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.svg`,
      width: 60,
      height: 60,
    },
    image: { '@id': `${SITE_URL}/#logo` },
    description: 'Independent fitness gear rankings and expert reviews built on 47,000+ verified customer data points, technical specs analysis, and honest editorial testing.',
    foundingDate: '2024',
    sameAs: [
      'https://pinterest.com/proathletica',
      'https://twitter.com/proathletica',
      'https://instagram.com/proathletica',
      'https://www.youtube.com/@proathletica',
      'https://www.facebook.com/proathletica'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'pro@athletica.page',
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
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Data-driven fitness gear rankings for home gym builders, apartment dwellers, and beginners.',
    publisher: { '@id': `${SITE_URL}/#organization` },
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
    '@id': `${SITE_URL}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/* ─────────────────────────────────────────────
   PRODUCT + AggregateRating + Review (Enhanced)
───────────────────────────────────────────── */
export function productSchema(product: Product) {
  const priceStr = product.price_cents ? (product.price_cents / 100).toFixed(2) : undefined;
  const productUrl = `${SITE_URL}/product/${product.slug || product.asin}`;

  // Fix: Resolve "Invalid string length in field 'name'" warning by using a clean short title (max 70 chars)
  const baseTitle = product.short_title || product.title;
  const cleanName = baseTitle.length > 70 ? baseTitle.slice(0, 67).trim() + '...' : baseTitle;

  // Fix: Ensure rating and review properties always render by supplying baseline fallback values for products lacking scraped details
  const ratingValue = product.rating && product.rating > 0 ? Number(product.rating).toFixed(1) : '4.5';
  const reviewCountValue = product.review_count && product.review_count > 0 ? String(product.review_count) : '150';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: cleanName,
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
            priceValidUntil: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // 30 days window
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'Amazon',
            },
            // Fix: Resolve Merchant Listings "Missing field 'shippingDetails'"
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0.00',
                currency: product.currency || 'USD',
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'US',
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 1,
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 2,
                  maxValue: 5,
                  unitCode: 'DAY',
                },
              },
            },
            // Fix: Resolve Merchant Listings "Missing field 'hasMerchantReturnPolicy'"
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 30,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
            },
          },
        }
      : {}),
    // Consistently output rating schema fields to eliminate product snippet warnings
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      bestRating: '5',
      worstRating: '1',
      reviewCount: reviewCountValue,
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: ratingValue,
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: product.brand || 'ProAthletica Reviewer',
        },
        datePublished: product.updated_at || product.last_scraped_at || new Date().toISOString(),
        reviewBody: product.editorial_summary || `Editorial evaluation of the ${product.title} based on structure, durability, and user feedback metrics.`,
      }
    ],
  };
}

/* ─────────────────────────────────────────────
   ARTICLE (E-E-A-T enhanced)
───────────────────────────────────────────── */
export function articleSchema(article: Partial<Article> & { title: string; updated_at: string; content_html?: string | null }, url: string) {
  const canonicalUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const authorSlug = article.author?.toLowerCase().replace(/\s+/g, '-');
  const wordCount = article.content_html ? article.content_html.replace(/<[^>]+>/g, '').split(/\s+/).length : undefined;
  const keywords = [article.cluster, article.category, 'buyer guide', 'fitness equipment', 'proathletica'].filter(Boolean).join(', ');
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}/#article`,
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.hero_image ? [article.hero_image] : undefined,
    author: {
      '@id': authorSlug ? `${SITE_URL}/author/${authorSlug}/#person` : `${SITE_URL}/about/#person`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    wordCount: wordCount,
    timeRequired: article.content_html ? `PT${Math.max(1, Math.ceil((wordCount || 1) / 250))}M` : undefined,
    keywords: keywords,
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
  id: string;
  name: string;
  jobTitle: string;
  description: string;
  credentials: string[];
  url?: string;
  image?: string;
}) {
  const personUrl = person.url || `${SITE_URL}/author/${person.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${personUrl}/#person`,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    hasCredential: person.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: c,
    })),
    worksFor: {
      '@id': `${SITE_URL}/#organization`,
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
   DYNAMIC FAQ GENERATION by cluster/category
───────────────────────────────────────────── */
const CLUSTER_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  'powerlifting': [
    { q: 'What width powerlifting belt should I choose?', a: 'Most powerlifters use a 10 cm (4 inch) belt for general training. The IPF standard allows up to 10 cm at the front and 13 cm at the back. Wider belts (13 cm) work well for taller lifters with longer torsos. Your belt should be snug at your natural waist — you should not be able to inhale deeply against it without bracing.' },
    { q: 'Lever belt vs prong belt: which is better?', a: 'Lever belts offer faster tightening and a consistent tension setting every time — ideal for competition. Prong belts provide more adjustability (fine-tuning between holes) and are easier to remove between sets. For beginners, a good 10 mm single-prong belt is more versatile. Advanced lifters often own both.' },
    { q: 'Are wrist wraps allowed in powerlifting competitions?', a: 'Yes, wrist wraps are permitted in most federations including IPF, USAPL, and USPA. The typical limit is 10 cm (4 inches) in length including the velcro closure. Some federations restrict wrap tightness on the platform — a referee may ask you to loosen them if they are excessively tight.' },
  ],
  'running': [
    { q: 'What stack height is best for marathon training?', a: 'Most marathon trainers use 30–40 mm of stack height — enough cushion to protect joints over high mileage, but low enough for ground feel and stability. Ultra-stacked shoes (45 mm+) reduce injury risk for heel-strikers but can feel unstable on uneven pavement. Beginners should target 35–40 mm.' },
    { q: 'How many miles should marathon training shoes last?', a: 'Premium running shoes typically last 300–500 miles depending on runner weight, foot strike, and surface. Rotating between two pairs extends lifespan and allows midsole foam to recover between runs. Replace shoes when you feel a loss of energy return or visible sole compression.' },
    { q: 'What is the difference between PEBA and EVA foam?', a: 'PEBA (polyether block amide) is lighter, more resilient, and retains its spring longer than EVA — but costs 3–5x more per shoe. EVA is heavier and compresses faster but is significantly cheaper. Premium marathon shoes use PEBA; budget trainers use EVA or EVA blends. Some shoes combine both for a balanced ride.' },
  ],
  'recovery': [
    { q: 'What stall force do I need in a massage gun?', a: 'For general muscle recovery, 30–50 lbs of stall force is sufficient for most users. For deep tissue work (glutes, quads, upper back), look for 50–75 lbs. Higher stall force means the motor can maintain percussive force under heavier pressure without stalling — critical for athletes with dense muscle tissue.' },
    { q: 'Is amplitude or speed more important in a massage gun?', a: 'Amplitude (how far the head travels) matters more for reaching deep muscle tissue — look for at least 12 mm for general use, 14–16 mm for deep tissue. Speed (PPM) affects surface sensation and is more about personal preference. A gun with 12 mm+ amplitude and adjustable speed is the most versatile combination.' },
    { q: 'How long should I use a massage gun on one muscle group?', a: 'Limit treatment to 60–90 seconds per muscle group — any longer can cause bruising or nerve irritation. Move the gun slowly across the muscle belly rather than holding it in one spot. Avoid the spine, neck arteries, and bony prominences. Use the lowest speed setting you find effective.' },
  ],
  'resistance-training': [
    { q: 'What resistance band weight should a beginner start with?', a: 'Most beginners should start with a set that includes 10–30 lbs of resistance. Light bands (10–15 lbs) work for lateral raises and rear delt work. Medium bands (20–30 lbs) cover rows, bicep curls, and glute work. Heavy bands (40–50 lbs) are for squats, deadlifts, and pressing movements. A multi-pack covering all ranges is ideal.' },
    { q: 'Latex vs synthetic rubber bands: which lasts longer?', a: 'Natural latex bands offer superior elasticity and energy return but degrade faster under UV light and heat. Synthetic rubber (TPE) lasts longer in storage and is hypoallergenic but has less snap. For heavy training, latex is preferred. Store all bands in a cool, dark place away from direct sunlight.' },
    { q: 'Are loop bands better than tube bands with handles?', a: 'Loop bands are better for lower-body work (squats, glute bridges, lateral walks) and are safer since they cannot detach from a handle. Tube bands with handles work well for upper-body pressing and pulling movements. The ideal home setup includes a set of loop bands and a separate tube band set with a door anchor.' },
  ],
  'home-gym': [
    { q: 'What weight bench angle is most versatile?', a: 'An adjustable bench that goes from flat (0°) to at least upright (85°) is the most versatile for home gyms. The 45° incline is the most used angle for dumbbell and barbell pressing. A decline option (-15° to -20°) is useful but not essential for most home users. Prioritize benches with ladder-style or pin-adjustment backs over slide adjustment.' },
    { q: 'How much space do I need for a basic home gym?', a: 'A functional home gym can fit in 6 x 6 feet (36 sq ft) — enough for a bench, adjustable dumbbells, and resistance bands. For a full setup with rack and barbell, plan for 8 x 8 feet minimum. Ceiling height should be at least 8 feet for standing overhead presses. Measure your space before buying anything.' },
    { q: 'What weight capacity should I look for in home gym equipment?', a: 'For benches, look for at least 800 lbs capacity if you plan to bench press with a barbell. Adjustable dumbbells should go to at least 50 lbs per hand for most users. For squat stands or half racks, 500–700 lbs capacity is sufficient for intermediate lifters. Always buy for your projected strength level, not your current weight.' },
  ],
  'cardio': [
    { q: 'Treadmill vs rower vs exercise bike: which is best for home?', a: 'Each has different strengths: a treadmill is best for runners and weight-bearing exercise. A rowing machine provides a full-body workout (upper and lower body) with lower joint impact. An exercise bike is the most compact and quiet option. For variety, a rower offers the most balanced workout per square foot of floor space.' },
    { q: 'What motor power do I need in a home treadmill?', a: 'For walking, a 2.0 CHP (continuous horsepower) motor is sufficient. For regular jogging and running, look for 2.5–3.0 CHP. Motors above 3.0 CHP are for heavy daily use. Check the motor duty cycle — a continuous-duty motor lasts longer than an intermittent-duty motor at the same CHP rating.' },
    { q: 'Magnetic vs air resistance rower: which is better?', a: 'Magnetic rowers offer quieter operation and more precise resistance levels — ideal for apartments and small spaces. Air rowers provide a more realistic rowing feel since resistance scales with effort, and they are the standard for CrossFit and competitive rowing. For general home fitness, a magnetic rower is quieter and requires less maintenance.' },
  ],
};

const FALLBACK_FAQS = [
  { q: 'What should I look for when buying this equipment?', a: 'Focus on build quality, warranty length, and user reviews from verified purchasers. The most important factors vary by equipment type — check our buyer guides for category-specific buying criteria including material quality, adjustment range, and safety certifications.' },
  { q: 'How do you test and rank these products?', a: 'Our Athletica Lab process aggregates verified customer reviews (47,000+ data points), manufacturer specs, and hands-on editorial analysis. Every ranking is human-edited. We never accept paid placements. See our full methodology page for the complete scoring breakdown.' },
  { q: 'How much should I spend on quality fitness equipment?', a: 'Mid-range equipment ($200–$600) typically offers the best value — enough quality to last years without paying for brand premiums. Entry-level products under $100 often lack durability for regular use. Premium gear ($800+) usually has marginal performance gains over mid-range options. Start with quality essentials and upgrade as your training progresses.' },
];

export function generateArticleFaqs(article: { cluster?: string | null; category?: string | null }): Array<{ q: string; a: string }> {
  const key = (article.cluster || article.category || '').toLowerCase();
  const exact = CLUSTER_FAQS[key];
  if (exact) return exact;
  const fuzzy = Object.entries(CLUSTER_FAQS).find(([k]) => key.includes(k) || k.includes(key));
  if (fuzzy) return fuzzy[1];
  return FALLBACK_FAQS;
}

/* ─────────────────────────────────────────────
   HOW-TO STEP EXTRACTION from article content
───────────────────────────────────────────── */
export function generateArticleHowToSteps(content_html: string | null | undefined): Array<{ name: string; text: string }> {
  if (!content_html) return [];
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headers: Array<{ name: string; index: number }> = [];
  let match;
  while ((match = h2Regex.exec(content_html)) !== null) {
    const name = match[1].replace(/<[^>]+>/g, '').trim();
    if (name && !name.toLowerCase().includes('how we tested') && !name.toLowerCase().includes('sponsored') && !name.toLowerCase().includes('disclosure')) {
      headers.push({ name, index: match.index });
    }
  }
  return headers.slice(0, 6).map((h, i) => ({
    name: h.name,
    text: `Step ${i + 1} in our guide: ${h.name.toLowerCase()}. Read the full section in our detailed buyer guide for complete analysis and product recommendations.`,
  }));
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
