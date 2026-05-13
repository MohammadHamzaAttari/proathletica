import { NextRequest, NextResponse } from 'next/server';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * FIX (Audit #02-A #5): legacy ?slug= / ?category= / ?page= query-param routes
 * redirect to canonical SSR paths with 308 Permanent redirects, preventing
 * duplicate-content indexing.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
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

  // Redirect ?category=X → /category/slug
  if (url.pathname === '/' && category) {
    url.pathname = `/category/${slugify(category)}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
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
