export function formatPrice(cents: number | null | undefined, currency = 'USD'): string {
  if (cents == null || cents <= 0) return 'Check Price';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatReviewCount(n: number | null | undefined): string {
  if (!n || n <= 0) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString('en-US');
}

export function upgradeAmazonImage(url: string | null | undefined): string {
  if (!url) return '';
  // Ensure we request high quality image from Amazon
  return url.replace(/\.jpg.*$/, '.jpg').replace('._AC_UL320_.jpg', '._AC_SL1000_.jpg');
}

export function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatTimestamp(dateStr: string | null | undefined): string {
  if (!dateStr) return 'recently';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
