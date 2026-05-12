import { buildMetadata } from '@/lib/seo/metadata';
import { CONTACT_EMAIL } from '@/lib/config';

export const metadata = buildMetadata({ title: 'Privacy Policy', canonical: '/privacy' });

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Privacy policy
      </h1>
      {/* FIX (Audit #05 — Privacy): list real third-party services */}
      <p>
        We collect limited analytics data (only after consent), anonymous click events for affiliate
        attribution, and email addresses when users subscribe.
      </p>
      <p>
        <strong className="text-white">Third-party services we use:</strong> Amazon Associates,
        Vercel (hosting), Supabase (database), Google Analytics (GA4, consent-gated), Resend
        (transactional email), ConvertKit (newsletter, if configured), and Pinterest (analytics tag,
        if configured).
      </p>
      <p>
        We do not sell your data. We do not track users across sites. Analytics only activates after
        explicit consent via the cookie banner.
      </p>
      <p>
        For data access or deletion requests, email{' '}
        <a className="text-emerald-400 underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </article>
  );
}
