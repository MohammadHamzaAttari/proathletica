import { buildMetadata } from '@/lib/seo/metadata';
import { CONTACT_EMAIL } from '@/lib/config';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How ProAthletica collects, stores, and protects your data. We never sell your information. CCPA and GDPR compliant.',
  canonical: '/privacy',
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Privacy policy
      </h1>
      <p className="text-lg font-medium text-neutral-200 leading-relaxed">
        ProAthletica respects your privacy. We collect only the minimum data needed to operate and improve our service. We never sell your personal information.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">What We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
          <li><strong className="text-white">Analytics data</strong> — Anonymous page views and navigation patterns via Google Analytics 4 (consent-gated; only activates after you accept)</li>
          <li><strong className="text-white">Click events</strong> — Anonymous affiliate link clicks for attribution, stored temporarily in our database</li>
          <li><strong className="text-white">Email addresses</strong> — Collected only when you voluntarily subscribe to our newsletter via ConvertKit or Resend</li>
          <li><strong className="text-white">Contact form data</strong> — Information you provide when emailing us for inquiries or data requests</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Third-Party Services</h2>
        <p className="text-sm leading-relaxed">
          The following services process data on our behalf:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Amazon Associates (affiliate program)</li>
          <li>Vercel Inc. (hosting and edge network)</li>
          <li>Supabase (database and authentication)</li>
          <li>Google Analytics GA4 (analytics, consent-gated)</li>
          <li>Resend (transactional email delivery)</li>
          <li>ConvertKit (newsletter, if configured)</li>
          <li>Pinterest (analytics tag, if configured)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Your Rights</h2>
        <p className="text-sm leading-relaxed">
          Under the CCPA and GDPR, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Request access to the personal data we hold about you</li>
          <li>Request deletion of your personal data</li>
          <li>Opt out of any data collection (use our cookie banner)</li>
          <li>Request correction of inaccurate data</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Data Retention</h2>
        <p className="text-sm leading-relaxed">
          Analytics data is retained for 14 months. Email subscriber data is retained until you unsubscribe or request deletion. Click event logs are anonymized after 30 days.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Contact & Deletion Requests</h2>
        <p className="text-sm leading-relaxed">
          For data access, correction, or deletion requests, email us from the address you used to subscribe. We process all valid requests within 30 days as required by CCPA and GDPR.
        </p>
        <a className="inline-flex items-center gap-2 text-emerald-400 underline font-bold hover:text-white transition-colors" href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`}>
          {CONTACT_EMAIL}
        </a>
      </section>

      <p className="text-xs text-neutral-600 pt-6 border-t border-white/[0.06]">
        Last updated June 2026.
      </p>
    </article>
  );
}
