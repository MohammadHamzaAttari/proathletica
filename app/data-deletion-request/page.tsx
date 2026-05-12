import { buildMetadata } from '@/lib/seo/metadata';
import { CONTACT_EMAIL } from '@/lib/config';

/**
 * FIX (Audit #05 — Privacy + CCPA): dedicated data deletion request page.
 */
export const metadata = buildMetadata({
  title: 'Data Deletion Request',
  description: 'Request access to or deletion of your ProAthletica data.',
  canonical: '/data-deletion-request',
});

export default function DataDeletionRequestPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Data deletion request
      </h1>
      <p>
        If you want us to delete your subscriber record or review your stored data, email us from the
        address you used to subscribe.
      </p>
      <p>We will process all valid requests within 30 days as required by CCPA and GDPR.</p>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=Data%20Deletion%20Request`}
        className="inline-flex rounded-2xl bg-emerald-500 px-6 py-4 font-black uppercase tracking-wider text-black"
      >
        Request by email
      </a>
    </article>
  );
}
