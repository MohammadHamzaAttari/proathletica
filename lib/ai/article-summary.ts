type ArticleSummaryInput = {
  title: string;
  excerpt?: string | null;
  content_html?: string | null;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateArticleSummary(input: ArticleSummaryInput): string | null {
  const seed = input.excerpt || stripHtml(input.content_html || '').slice(0, 320);
  if (!seed) return null;
  const text = seed.replace(/\s+/g, ' ').trim();
  const cleaned = text
    .replace(/\b(amazon|affiliate|commission|sponsored)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!cleaned) return null;
  const clipped = cleaned.slice(0, 320).trim();
  return clipped.endsWith('.') ? clipped : `${clipped}.`;
}