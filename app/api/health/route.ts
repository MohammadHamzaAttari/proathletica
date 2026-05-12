import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * FIX (Audit #01 #1-4): /api/health now returns real counts from Supabase.
 * Gracefully returns zeroes when Supabase is not configured (dev mode).
 */
export async function GET() {
  try {
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        stats: { products: 0, articles: 0, clicks: 0 },
        supabaseConfigured: false,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [products, articles, clicks] = await Promise.all([
      sb.from('products').select('*', { count: 'exact', head: true }),
      sb.from('articles').select('*', { count: 'exact', head: true }).not('published_at', 'is', null),
      sb.from('click_events').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        products: products.count || 0,
        articles: articles.count || 0,
        clicks: clicks.count || 0,
      },
    });
  } catch (error) {
    console.error('[health]', error);
    return NextResponse.json({ ok: false, error: 'Health check failed.' }, { status: 500 });
  }
}
