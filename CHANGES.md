# Audit Fix Log — v3.1.0

Every fix is cross-referenced to the audit section that identified it.

## 🚨 CRITICAL (were causing 100% of 500 errors)

### All 4 broken API routes
- **Root cause**: original repo mixed Express + SQLite (container architecture) with Vercel serverless
- **Fix**: Every route is now a standalone Next.js App Router route handler with zero Node.js-incompatible imports
- `/api/health` → reads Supabase; returns JSON counts or graceful zeros when unconfigured
- `/api/track` → reads product from Supabase, geo-regionalizes URL, records click, redirects
- `/api/subscribe` → validates email, honeypot check, Supabase insert, Resend welcome email
- `/api/revalidate` → supports both `?path=` and `?tag=` with secret auth

### `/sitemap.xml` was 500
- **Fix**: `app/sitemap.ts` calls Supabase via `getPublishedArticles()` + `getCategoryList()` — no Express dependency
- Gracefully returns static-only sitemap when DB unavailable

## ⚡ SEO (were causing 0 indexed pages)

### Every URL returned identical HTML
- **Fix**: Next.js App Router SSR — every page is rendered server-side with real content
- Pinterest, Facebook, Bing, and AI crawlers now see unique per-page content

### No canonical tags
- **Fix**: `buildMetadata()` sets `alternates.canonical` on every page — server-rendered in `<head>`
- Middleware 308-redirects `?slug=`, `?category=`, `?refresh=` to canonical paths

### No per-page OG tags
- **Fix**: `generateMetadata()` on article/category pages sets unique title, description, OG image, and OG type
- Pinterest Rich Pins will now show the correct image and title per article/category

### Pinterest verification placeholder
- **Fix**: `PINTEREST_DOMAIN_VERIFY` env var wired into `layout.tsx` metadata `other` field — renders in `<head>` server-side

### No AI crawler allowlist
- **Fix**: `robots.ts` explicitly allows GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, anthropic-ai, GoogleOther, Google-Extended

## 🔐 Security

### Open redirect in `/api/track`
- **Fix**: `isSafeAmazonUrl()` validates against strict Amazon hostname regex — rejects anything non-Amazon

### No honeypot on subscribe form
- **Fix**: hidden `hp` field in `Newsletter.tsx`; `/api/subscribe` silently returns 200 if filled (bots never see an error)

### Mock SMTP → no emails delivered
- **Fix**: Resend API integration in `/api/subscribe` — real transactional email delivery
- Welcome email intentionally contains no affiliate links (Amazon Associates TOS compliance)

### CSP disabled
- **Fix**: strict CSP in `next.config.mjs` `headers()` — allowlists only known domains

### No immutable cache on static assets
- **Fix**: `/_next/static/*` gets `Cache-Control: public, max-age=31536000, immutable`

### .gitignore missing service account keys
- **Fix**: `gsc-service-account.json`, `*-service-account.json`, `scripts/*.json` added to `.gitignore`

## 📋 Amazon Associates Compliance

### "Independent Lab Protocol" was not an FTC disclosure
- **Fix**: `DisclosureBar` now uses required language: *"As an Amazon Associate we earn from qualifying purchases. Some links on this page are affiliate links — at no extra cost to you..."*
- Renders above every product grid on homepage, category pages, and article pages

### Affiliate micro-disclosure per product
- **Fix**: "Affiliate link — we may earn a commission" below every CTA price in `ProductCard.tsx`

### `rel` attribute on affiliate links
- Confirmed: `rel="sponsored nofollow noopener noreferrer"` on all affiliate `<a>` elements

### No affiliate links in email
- **Fix**: Resend welcome email contains only site links, zero `amazon.com` URLs

## 🖼 Performance

### Product images: `<img>` → `<Image>`
- **Fix**: Next.js `<Image>` with `sizes` prop — generates AVIF/WebP srcset, ~80% smaller payload

### JS bundle not compressed
- **Fix**: `compress: true` in `next.config.mjs` enables gzip/brotli on all responses

### Google Fonts render-blocking
- **Fix**: removed Google Fonts CDN reference; system font stack used (Inter → system-ui fallback)

### `viewport-fit=cover` missing
- **Fix**: added to `viewport` export in `layout.tsx`

## 🔒 GDPR / CCPA

### No persistent cookie preference link
- **Fix**: "Manage cookie preferences" button in `Footer.tsx` dispatches `open-cookie-preferences` event

### No CCPA data deletion page
- **Fix**: `/data-deletion-request` page exists, linked from footer, commits to 30-day processing

### Privacy page missing third-party list
- **Fix**: `app/privacy/page.tsx` lists: Amazon, Vercel, Supabase, GA4, Resend, ConvertKit, Pinterest

## 🤖 n8n Workflow

### No validation before Supabase write
- **Fix**: filter node drops products missing price, image, ASIN, or title

### No error notification
- **Fix**: Discord webhook alert when scraper returns 0 products

### No cache bust after scrape
- **Fix**: workflow calls `/api/revalidate?tag=products` after every successful batch upsert

### Single niche list hardcoded in workflow
- **Fix**: expanded to 5 niches; easy to add more by editing "Seed Niches" node

## ♻️ Supabase key name compatibility

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` vs `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Fix**: `lib/supabase/server.ts` and `client.ts` check both env var names for backward compatibility
