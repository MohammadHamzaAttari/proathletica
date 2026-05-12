import { SITE_NAME, SITE_URL } from '@/lib/config';

export const OPENROUTER_FREE_MODEL = 'openrouter/free';

function getForcedFreeModel() {
  const configured = (process.env.OPENROUTER_MODEL || '').trim();
  if (configured && configured !== OPENROUTER_FREE_MODEL) {
    console.warn(
      `[ProAthletica] OPENROUTER_MODEL="${configured}" is ignored. Forcing ${OPENROUTER_FREE_MODEL}.`
    );
  }
  return OPENROUTER_FREE_MODEL;
}

export function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for AI generation.');
  }

  return {
    apiKey,
    model: getForcedFreeModel(),
  };
}

export async function generateOpenRouterText(input: {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const { apiKey, model } = getOpenRouterConfig();
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify({
      model,
      temperature: input.temperature ?? 0.4,
      max_tokens: input.maxTokens ?? 180,
      messages: [
        { role: 'system', content: input.system },
        { role: 'user', content: input.user },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OpenRouter request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('OpenRouter returned an empty completion.');
  }

  return text;
}