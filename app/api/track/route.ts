import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { regionalizeAmazonUrl, isSafeAmazonUrl } from '@/lib/affiliate';
import { getProductById, recordClick } from '@/lib/db';

function hashIp(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/**
 * FIX (Audit #05-12): strict URL validation prevents open-redirect abuse.
 * FIX (Audit #03-D): geo-aware Amazon link regionalization via Vercel header.
 * FIX (Audit #01 #3): this now correctly stores clicks in Supabase (not SQLite).
 *
 * Usage:
 *   /api/track?productId=B001ARYU58&articleSlug=best-home-gym&rank=1
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
      // Verify product URL is safe (Amazon-only)
      if (!isSafeAmazonUrl(product.affiliate_url)) {
        console.error(`[SECURITY] Product ${productId} has invalid affiliate URL: ${product.affiliate_url}`);
        return NextResponse.json({ error: 'Invalid affiliate URL for product.' }, { status: 400 });
      }
      destination = regionalizeAmazonUrl(product.affiliate_url, country);
    }
  }

  // FIX (Audit #05-12): ONLY allow safe Amazon URLs via the ?url= param
  // Non-Amazon platforms are completely rejected
  if (!destination && rawUrl) {
    if (!isSafeAmazonUrl(rawUrl)) {
      console.error(`[SECURITY] Non-Amazon URL rejected in track: ${rawUrl}`);
      return NextResponse.json({ error: 'Non-Amazon URLs are not supported.' }, { status: 400 });
    }
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
