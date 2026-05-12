/** @type {import('next').NextConfig} */

/**
 * FIX (Audit #01-C + #05): strict Content Security Policy.
 * FIX (Audit #01-C): static asset immutable caching via headers().
 * FIX (Audit #01-C): compress: true enables gzip/brotli (fixes 603KB uncompressed JS issue).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://s.pinimg.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://m.media-amazon.com https://images-na.ssl-images-amazon.com https://images.unsplash.com https://*.pinimg.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://api.convertkit.com https://api.resend.com https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // FIX (Audit #01-C): enable gzip/brotli compression — fixes uncompressed 603KB JS
  compress: true,

  images: {
    // FIX (Audit #01-C): AVIF + WebP for 80% bandwidth saving on product images
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 86400, // 24h image cache
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Robots-Tag', value: 'all' },
        ],
      },
      {
        // FIX (Audit #01-C): immutable cache for hashed static assets
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // API routes: never indexed, no cache
        source: '/api/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
