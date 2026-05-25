import { NextRequest, NextResponse } from 'next/server';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * FIX (Audit #02-A #5): legacy ?slug= / ?category= / ?page= query-param routes
 * redirect to canonical SSR paths with 308 Permanent redirects, preventing
 * duplicate-content indexing.
 *
 * FIX: Only redirect ?category= when it's the SOLE meaningful param.
 * If other filter params exist (focus, brand, sort, tags, q, etc.),
 * the user is actively using the homepage filter panel — do NOT redirect
 * away from the homepage or all their filters will be lost.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Enforce WWW Host (Audit #2 Fix)
  if (url.hostname === 'athletica.page') {
    url.hostname = 'www.athletica.page';
    return NextResponse.redirect(url, 308);
  }

  const slug = url.searchParams.get('slug');
  const page = url.searchParams.get('page');
  const category = url.searchParams.get('category');
  const highlightId = url.searchParams.get('highlightId');

  // Redirect ?slug=X → /best/X
  if (url.pathname === '/' && slug) {
    url.pathname = `/best/${slug}`;
    url.search = '';
    if (highlightId) url.searchParams.set('highlightId', highlightId);
    return NextResponse.redirect(url, 308);
  }

  // Redirect ?page=about|contact|... → /about|/contact|...
  if (
    url.pathname === '/' &&
    page &&
    ['about', 'contact', 'privacy', 'terms', 'disclosure'].includes(page)
  ) {
    url.pathname = `/${page}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  // FIX: Only redirect ?category=X → /category/X when category is the ONLY
  // meaningful param. If the user has active homepage filters (focus, brand,
  // sort, tags, q, minPrice, maxPrice, minRating, pageSize, page), they are
  // using the filter panel and must stay on the homepage.
  if (url.pathname === '/' && category) {
    const otherFilterParams = [
      'focus', 'brand', 'sort', 'tags', 'tag', 'q',
      'minPrice', 'maxPrice', 'minRating', 'pageSize', 'page',
    ];
    const hasOtherFilters = otherFilterParams.some(
      (param) => url.searchParams.has(param)
    );

    if (!hasOtherFilters) {
      // Solo category param → redirect to dedicated category page
      url.pathname = `/category/${slugify(category)}`;
      url.search = '';
      return NextResponse.redirect(url, 308);
    }
    // Otherwise: stay on homepage with category as an in-page filter
  }

  if (url.pathname === '/categories' && category) {
    url.pathname = `/category/${slugify(category)}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  // Strip ?refresh= params (prevent indexing of cache-busting URLs)
  if (url.searchParams.has('refresh')) {
    url.searchParams.delete('refresh');
    return NextResponse.redirect(url, 308);
  }

  // Redirect /best/*-2026 → /best/* (Audit #02-F)
  if (url.pathname.startsWith('/best/') && url.pathname.endsWith('-2026')) {
    url.pathname = url.pathname.replace(/-2026$/, '');
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.svg|manifest.json).*)'],
};
