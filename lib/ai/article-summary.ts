import { generateOpenRouterText, OPENROUTER_FREE_MODEL } from '@/lib/ai/openrouter';

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

function fallbackSummary(input: ArticleSummaryInput) {
  const seed = input.excerpt || stripHtml(input.content_html || '').slice(0, 260);
  if (!seed) return null;
  const text = seed.replace(/\s+/g, ' ').trim();
  return text.endsWith('.') ? text : `${text}.`;
}

function sanitizeSummary(value: string) {
  const cleaned = value
    .replace(/^['"“”]+|['"“”]+$/g, '')
    .replace(/\b(amazon|affiliate|commission|sponsored)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!cleaned) return '';

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2);
  const clipped = sentences.join(' ').slice(0, 320).trim();
  return clipped.endsWith('.') ? clipped : `${clipped}.`;
}

export async function generateArticleSummary(input: ArticleSummaryInput): Promise<string | null> {
  const fallback = fallbackSummary(input);
  if (!process.env.OPENROUTER_API_KEY) return fallback;

  const content = stripHtml(input.content_html || '').slice(0, 4000);
  if (!content && !input.excerpt) return fallback;

  try {
    const completion = await generateOpenRouterText({
      system:
        'You write concise editorial summaries for a fitness gear review site. Be specific, grounded, and avoid hype.',
      user: [
        `Article title: ${input.title}`,
        input.excerpt ? `Existing excerpt: ${input.excerpt}` : null,
        content ? `Article content: ${content}` : null,
        'Write a 1-2 sentence quick take for the top of the article. It should explain the article focus, who the gear is for, and the key tradeoff. Do not mention Amazon, affiliate links, or commissions.',
      ]
        .filter(Boolean)
        .join('\n'),
      temperature: 0.25,
      maxTokens: 90,
    });

    const summary = sanitizeSummary(completion);
    return summary || fallback;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('(429)') || message.includes('rate-limited') || message.includes('temporarily rate-limited')) {
      return fallback;
    }
    console.error('[ai] generateArticleSummary failed:', error);
    return fallback;
  }
}

export { OPENROUTER_FREE_MODEL };