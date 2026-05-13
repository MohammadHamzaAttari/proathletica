import { faqSchema, jsonLdProps } from '@/lib/seo/schema';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'How do you rank and test these products?',
    a: 'Our Athletica Lab process aggregates verified customer reviews (47,000+ data points), manufacturer specs, and hands-on editorial analysis from our certified coaches and athletes. Every ranking is human-edited. We never accept paid placements. See our full methodology for the complete scoring breakdown.',
  },
  {
    q: 'Are any of these rankings sponsored or paid?',
    a: 'No. We have a strict no-paid-placements policy. Some links are Amazon affiliate links, which help us keep the site running at no extra cost to you — our commission doesn\'t affect rankings. Products ranked #1 often have lower commission rates than lower-ranked alternatives.',
  },
  {
    q: 'How current are the prices shown?',
    a: 'Prices are pulled from Amazon and updated frequently. However, Amazon prices change multiple times per day, so we always recommend clicking through to confirm the current live price. We display a timestamp to show when each price was last checked.',
  },
  {
    q: 'Which fitness equipment is best for a small apartment?',
    a: 'For small apartments, we recommend adjustable dumbbells (Bowflex 552 or PowerBlock) + resistance bands as a foundation — they cover 90% of home workout needs in under 3 sq ft of storage. Check our Small Apartments filter on the homepage for our full compact gear rankings.',
  },
  {
    q: 'Which gear do you recommend for absolute beginners?',
    a: 'Start with a single adjustable dumbbell set + a quality resistance band kit. These tools let you learn movement patterns safely before adding load. Avoid buying a full home gym before you have 3–4 months of consistent training habits — the gear will collect dust otherwise.',
  },
  {
    q: 'Do you review products beyond Amazon?',
    a: 'Yes. Our editorial process is retailer-independent. Amazon is our primary affiliate partner because of their return policy and buyer trust, but we recommend the best product for each category regardless of where it\'s sold. We\'re actively expanding to Rogue Fitness, REP Fitness, and direct brand affiliate programs.',
  },
  {
    q: 'How do I request deletion of my data?',
    a: 'Email us at the address on our Contact page, or use our dedicated Data Deletion Request form. We process all valid requests within 30 days per CCPA requirements.',
  },
];

export function FAQ() {
  return (
    <div className="space-y-8">
      {/* FAQPage schema — server-rendered for rich result eligibility */}
      <script {...jsonLdProps(faqSchema(FAQS))} />

      <div className="space-y-2">
        <div className="section-eyebrow text-center">Got Questions?</div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite text-center">
          Frequently asked questions
        </h2>
        <p className="text-sm text-neutral-500 text-center max-w-lg mx-auto leading-relaxed">
          Real answers to the questions our readers ask most. No padding, no corporate speak.
        </p>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <details
            key={faq.q}
            className="group rounded-inner border border-white/[0.06] bg-graphite-800 overflow-hidden transition-all"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <h3 className="font-bold text-offwhite group-open:text-data-lime transition-colors text-sm sm:text-base">
                {faq.q}
              </h3>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 text-neutral-500 group-open:rotate-180 group-open:text-data-lime transition-all duration-200"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-5">
              <p className="text-sm leading-relaxed text-neutral-400 border-t border-white/[0.04] pt-4">
                {faq.a}
              </p>
              {i === 0 && (
                <Link
                  href="/methodology"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-trust-blue hover:text-offwhite transition-colors"
                >
                  Read our full methodology →
                </Link>
              )}
              {i === 3 && (
                <Link
                  href="/?focus=small-apartments"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-trust-blue hover:text-offwhite transition-colors"
                >
                  See compact gear rankings →
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>

      {/* E-E-A-T footer note */}
      <div className="rounded-inner border border-white/[0.04] bg-white/[0.02] px-5 py-4 text-center">
        <p className="text-xs text-neutral-600 leading-relaxed">
          Still have a question?{' '}
          <Link href="/contact" className="text-trust-blue hover:text-offwhite underline underline-offset-2 transition-colors">
            Contact our team
          </Link>
          {' '}— we typically respond within 24 hours.
        </p>
      </div>
    </div>
  );
}
