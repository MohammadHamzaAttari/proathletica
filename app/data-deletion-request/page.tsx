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
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Data deletion request
      </h1>
      <p className="text-lg font-medium text-neutral-200 leading-relaxed">
        ProAthletica respects your right to access, modify, and delete your personal data under CCPA and GDPR.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">What Gets Deleted</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
          <li>Newsletter subscriber records (email, name if provided)</li>
          <li>Any personal data collected via contact forms</li>
          <li>Cookie and analytics identifiers (note: analytics data is already anonymized)</li>
        </ul>
      </section>

      <section className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-4">
        <h2 className="text-lg font-black uppercase tracking-tight text-offwhite">Submit a Request</h2>
        <p className="text-sm leading-relaxed">
          To request deletion, email us from the address you used to subscribe. Include &quot;Data Deletion Request&quot; in the subject line. We will confirm receipt within 48 hours and process the deletion within 30 days.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Data%20Deletion%20Request`}
          className="inline-flex rounded-2xl bg-emerald-500 px-6 py-4 font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition-colors"
        >
          Submit Deletion Request
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Alternative Contact</h2>
        <p className="text-sm leading-relaxed">
          If you cannot use email, you may send a request via our contact page. We verify your identity before processing any request.
        </p>
      </section>

      <p className="text-xs text-neutral-600 pt-6 border-t border-white/[0.06]">
        Last updated June 2026.
      </p>
    </article>
  );
}
