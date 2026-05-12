# ProAthletica — Next.js 14 + Supabase

Production-grade affiliate fitness review platform. Fully SSR, SEO-first, Amazon Associates compliant.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router (SSR/ISR) |
| Database | Supabase (Postgres) |
| Hosting | Vercel |
| Email | Resend (transactional) + ConvertKit (newsletter, optional) |
| Images | Next.js `<Image>` → AVIF/WebP auto-optimization |
| Affiliate | Amazon Associates (geo-aware via Vercel edge headers) |
| Analytics | GA4 (consent-gated) + Pinterest Tag (optional) |
| Automation | n8n + custom Amazon scraper |

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — the minimum required vars:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste + run `supabase/migrations/0001_init.sql`
3. Copy your project URL, anon key, and service role key into `.env.local`

### 4. Start dev server

```bash
npm run dev
```

The site boots with **no Supabase keys** (shows empty content + warnings). Add keys to get real data.

---

## What's included

| Feature | Status |
|---|---|
| SSR per-page metadata (title, OG, canonical) | ✅ |
| Dynamic sitemap.xml | ✅ |
| robots.txt with AI crawler allowlist | ✅ |
| FTC-compliant affiliate disclosure | ✅ |
| Geo-aware Amazon link regionalization | ✅ |
| Click tracking → Supabase | ✅ |
| Honeypot email spam protection | ✅ |
| Welcome email via Resend | ✅ |
| ConvertKit newsletter sync | ✅ optional |
| Google Analytics 4 (consent-gated) | ✅ |
| Pinterest domain verification | ✅ (set env var) |
| Pinterest retargeting tag | ✅ optional |
| Schema.org: Organization, WebSite, Article, Product, FAQ, Breadcrumb, ItemList | ✅ |
| Next.js `<Image>` AVIF/WebP product photos | ✅ |
| Immutable static asset caching | ✅ |
| Strict CSP headers | ✅ |
| Cookie consent (GDPR) | ✅ |
| Data deletion request page (CCPA) | ✅ |
| n8n scraping workflow with validation + error alerts | ✅ |

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | From Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Never expose client-side |
| `REVALIDATE_SECRET` | ✅ | Long random string, same in vercel.json crons |
| `RESEND_API_KEY` | Recommended | Free 3k emails/mo at resend.com |
| `NEWSLETTER_FROM_EMAIL` | Recommended | Must match verified Resend domain |
| `PINTEREST_DOMAIN_VERIFY` | Pinterest | From Pinterest Business → Settings → Claim |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | GA4 measurement ID |
| `AMAZON_AFFILIATE_TAG_US` | Affiliate | Default: `proathletica-20` |
| `CONVERTKIT_API_KEY` + `CONVERTKIT_FORM_ID` | Optional | Newsletter list sync |

---

## Deployment

### Vercel (recommended)

```bash
vercel deploy
```

Set all env vars in **Vercel Dashboard → Project → Settings → Environment Variables**.

Update `vercel.json` cron paths to include your real `REVALIDATE_SECRET`.

### After deploy

1. Submit `https://yourdomain.com/sitemap.xml` to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Set `PINTEREST_DOMAIN_VERIFY` env var with your real Pinterest verification code
4. Enable Rich Pins in Pinterest Business settings

---

## n8n automation

Import `n8n/amazon-scraping-workflow.json` into your n8n instance.

Required n8n env vars:
- `SCRAPER_BASE_URL` — your Amazon scraper service URL
- `NEXT_PUBLIC_SUPABASE_URL` — same as site
- `SUPABASE_SERVICE_ROLE_KEY` — same as site
- `NEXT_PUBLIC_SITE_URL` — your production domain
- `REVALIDATE_SECRET` — same as site
- `DISCORD_WEBHOOK_URL` — optional, for error alerts

The workflow:
1. Runs weekly (Sunday 3am)
2. Scrapes each niche keyword
3. Validates: drops products without price, image, or ASIN
4. Upserts to Supabase (merge on conflict)
5. Busts the Next.js products cache via `/api/revalidate`
6. Alerts Discord on scrape failure

---

## Amazon Associates compliance checklist

- [x] FTC disclosure above every product grid
- [x] "As an Amazon Associate we earn from qualifying purchases" language present
- [x] No specific prices in editorial copy (prices pulled live from DB)
- [x] Affiliate micro-disclosure on every product CTA
- [x] No affiliate links in email (welcome email links to site only)
- [x] `rel="sponsored nofollow noopener noreferrer"` on all affiliate links
- [x] Click tracking without revealing commission rates
- [ ] Apply for 3+ qualifying sales within 180 days of account creation

---

## Key audit fixes shipped in v3.1

| Audit Item | Fix |
|---|---|
| `/api/products` / `/api/track` / `/api/health` 500 errors | Replaced Express+SQLite with Supabase Next.js route handlers |
| `/sitemap.xml` 500 | Dynamic `app/sitemap.ts` reads Supabase directly |
| All URLs serving identical HTML | Full SSR via Next.js App Router with `generateMetadata()` per page |
| No canonical tag | Next.js `alternates.canonical` on every page |
| No per-page OG tags | Server-rendered OG via `buildMetadata()` — Pinterest/Facebook now see real tags |
| JS bundle uncompressed | `compress: true` in `next.config.mjs` |
| Static assets not cached | `/_next/static/*` gets `immutable` Cache-Control |
| Pinterest verification placeholder | `PINTEREST_DOMAIN_VERIFY` env var in layout metadata |
| Mock SMTP welcome emails | Resend integration in `/api/subscribe` |
| No AI crawler allowlist | `robots.ts` explicitly allows GPTBot, ClaudeBot, PerplexityBot, etc. |
| Open redirect in `/api/track` | Strict Amazon hostname allowlist in `isSafeAmazonUrl()` |
| No honeypot on subscribe form | `hp` field in Newsletter.tsx + server-side check |
| FTC disclosure missing from pages | `<DisclosureBar>` above every product grid |
| No geo-aware affiliate links | `regionalizeAmazonUrl()` reads `x-vercel-ip-country` header |
| `manifest.json` typo (manifect.json) | Correct path in `public/manifest.json` |
| Product images wrong size | Next.js `<Image>` with `sizes` prop |
| No GDPR-persistent cookie prefs link | "Manage cookie preferences" in Footer |
| No CCPA data deletion page | `/data-deletion-request` page linked from footer |
| n8n: no validation before save | Validate filter in workflow rejects missing price/image |
| n8n: no error notification | Discord webhook alert node on scrape failure |
| n8n: no cache bust after scrape | Calls `/api/revalidate?tag=products` after upsert |
