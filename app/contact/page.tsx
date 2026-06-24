import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { CONTACT_EMAIL } from '@/lib/config';

export const metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with ProAthletica for editorial feedback or product testing requests.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">Contact us</h1>
      <p className="text-neutral-400 leading-relaxed">
        We welcome editorial feedback, correction requests, product testing proposals, and partnership inquiries. Our editorial team typically responds within 24 hours.
      </p>

      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-offwhite">Editorial Inquiries</h2>
          <p className="text-sm text-neutral-400">Corrections, methodology questions, or feedback about our rankings.</p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Editorial%20Inquiry`}
          className="inline-flex rounded-2xl bg-emerald-500 px-6 py-4 font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-offwhite">Product Testing</h2>
          <p className="text-sm text-neutral-400">Brands and manufacturers can submit products for editorial review consideration. Submission does not guarantee coverage or a positive ranking.</p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Product%20Testing%20Request`}
          className="inline-flex rounded-2xl bg-trust-blue px-6 py-4 font-black uppercase tracking-wider text-black hover:bg-trust-blue/80 transition-colors"
        >
          Submit for Review
        </a>
      </div>

      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-offwhite">Data Deletion</h2>
          <p className="text-sm text-neutral-400">Request removal of your personal data per CCPA or GDPR regulations.</p>
        </div>
        <Link
          href="/data-deletion-request"
          className="inline-flex rounded-2xl border border-white/20 px-6 py-4 font-black uppercase tracking-wider text-neutral-300 hover:border-white/40 transition-colors"
        >
          Data Deletion Form
        </Link>
      </div>

      <p className="text-xs text-neutral-600 text-center">
        We respond to all inquiries within 24 hours on business days. For urgent matters, include &quot;Urgent&quot; in your subject line.
      </p>
    </article>
  );
}
