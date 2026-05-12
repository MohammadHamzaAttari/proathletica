import { faqSchema, jsonLdProps } from '@/lib/seo/schema';

const FAQS = [
  {
    q: 'How do you test these products?',
    a: 'We review construction quality, long-term reliability, price-to-performance, and whether the product actually solves the training problem it claims to solve. Every top pick is used for a minimum of 30 days.',
  },
  {
    q: 'Are your reviews sponsored?',
    a: 'No. We do not accept paid placements in our rankings. Some links are affiliate links, which help fund the site at no extra cost to readers.',
  },
  {
    q: 'Why do prices change?',
    a: 'Retail prices change frequently. We recommend clicking through to Amazon to confirm the current live price before purchase.',
  },
  {
    q: 'Do you review only Amazon products?',
    a: 'No. Amazon is our primary link destination right now, but our editorial process is independent of retailer and commission rate.',
  },
  {
    q: 'How do I request data deletion?',
    a: 'Email us from the address you used to subscribe. We will process all valid requests within 30 days. You can also use our dedicated data deletion request page.',
  },
];

export function FAQ() {
  return (
    <div className="space-y-6">
      {/* FIX: FAQPage schema rendered server-side for rich result eligibility */}
      <script {...jsonLdProps(faqSchema(FAQS))} />

      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
          Frequently asked questions
        </h2>
        <p className="text-sm text-neutral-400">Short answers to the most common reader questions.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => (
          <details key={faq.q} className="rounded-2xl border border-white/5 bg-neutral-900/30 p-5">
            <summary className="cursor-pointer list-none font-black text-white">{faq.q}</summary>
            <p className="mt-3 text-sm leading-6 text-neutral-400">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
