import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

/**
 * FIX (Audit #02-G): allow all major AI crawlers so ProAthletica content
 * appears in AI Overviews, Perplexity, SearchGPT, and Gemini answers.
 * FIX (Audit #02-A): sitemap URL points to dynamic /sitemap.xml that now works.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all, block internal API and admin
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*?q=*',
          '/*?focus=*',
          '/*?category=*',
          '/*?brand=*',
          '/*?sort=*',
          '/*?tags=*',
          '/*?page=*',
          '/*?minPrice=*',
          '/*?maxPrice=*',
          '/*?ids=*',
        ],
      },

      // FIX: explicitly allow AI crawlers (they respect robots.txt)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'GoogleOther', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },

      // Polite crawl rate for heavy scrapers
      { userAgent: 'AhrefsBot', crawlDelay: 10 },
      { userAgent: 'SemrushBot', crawlDelay: 10 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
