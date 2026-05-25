import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { regionalizeAmazonUrl, isSafeAmazonUrl } from '@/lib/affiliate';
import { getProductById, recordClick } from '@/lib/db';
import { FORCE_AMAZON_ONLY } from '@/lib/config';

const AMAZON_FALLBACKS: Record<string, string> = {
  'rogue-adjustable-bench-3': 'https://www.amazon.com/dp/B099JZT1WR', // Flybird Adjustable Bench
  'rogue-monster-bands': 'https://www.amazon.com/dp/B007PE7ANY', // TheraBand Premium Resistance Bands
  'wahoo-kickr-run-treadmill': 'https://www.amazon.com/dp/B07G4TFL52', // XTERRA Fitness Treadmill
  'gnc-energy-recovery-stack': 'https://www.amazon.com/dp/B001ARYU58', // Optimum Nutrition Micronized Creatine
  'clickbank-12wk-strength-program': 'https://www.amazon.com/s?k=progressive+strength+training+manual', // Strength book search
};

function hashIp(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/**
 * Allowlisted direct partner domains (non-Amazon) for the hybrid affiliate model.
 * These bypass Amazon regionalization and redirect directly to the partner site.
 */
const SAFE_PARTNER_HOSTS = [
  'roguefitness.com',
  'wahoofitness.com',
  'gnc.com',
  'clickbank.net',
  'clickbank.com',
  'lifefitness.com',
];

function isSafePartnerUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const h = parsed.hostname.toLowerCase().replace(/^www\./, '');
    return SAFE_PARTNER_HOSTS.some((domain) => h === domain || h.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/**
 * FIX (Audit #05-12): strict URL validation prevents open-redirect abuse.
 * FIX (Audit #03-D): geo-aware Amazon link regionalization via Vercel header.
 * FIX (Audit #01 #3): this now correctly stores clicks in Supabase (not SQLite).
 * HYBRID MODEL: also supports direct partner URLs (Rogue, Wahoo, GNC, ClickBank).
 *
 * Usage:
 *   /api/track?productId=B001ARYU58&articleSlug=best-home-gym&rank=1
 *   /api/track?productId=rogue-adjustable-bench-3&articleSlug=product-review-B099JZT1WR&rank=1
 *   /api/track?url=https://www.amazon.com/dp/B001ARYU58&articleSlug=homepage&rank=1
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const articleSlug = searchParams.get('articleSlug');
  const rank = searchParams.get('rank');
  const rawUrl = searchParams.get('url');

  // Geo headers from Vercel Edge network
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const referrer = request.headers.get('referer') || null;
  const userAgent = request.headers.get('user-agent') || null;

  let destination: string | null = null;

  if (productId) {
    const product = await getProductById(productId);
    if (product) {
      const url = product.affiliate_url;
      if (isSafeAmazonUrl(url)) {
        // Amazon product — apply geo-regionalization
        destination = regionalizeAmazonUrl(url, country);
      } else if (isSafePartnerUrl(url)) {
        if (FORCE_AMAZON_ONLY) {
          // Redirect partner product to Amazon equivalent for immediate earning
          const fallbackUrl = AMAZON_FALLBACKS[productId] || `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}`;
          destination = regionalizeAmazonUrl(fallbackUrl, country);
        } else {
          // Direct partner product — pass through as-is
          destination = url;
        }
      }
    }
  }

  // FIX (Audit #05-12): only allow safe Amazon URLs via the ?url= param
  if (!destination && rawUrl && isSafeAmazonUrl(rawUrl)) {
    destination = regionalizeAmazonUrl(rawUrl, country);
  }

  if (!destination) {
    return NextResponse.json({ error: 'Invalid or missing destination URL.' }, { status: 400 });
  }

  // Fire-and-forget click record — don't block the redirect
  recordClick({
    productId,
    articleSlug,
    rank: rank ? Number(rank) : null,
    country,
    referrer,
    userAgent,
    ipHash: hashIp(ip),
  }).catch((err) => console.error('[track] recordClick failed:', err));

  return NextResponse.redirect(destination, { status: 302 });
}

