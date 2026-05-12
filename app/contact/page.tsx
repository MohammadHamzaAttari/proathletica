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
      <p className="text-neutral-400">
        Questions, corrections, or product testing requests? Email us directly.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="inline-flex rounded-2xl bg-emerald-500 px-6 py-4 font-black uppercase tracking-wider text-black"
      >
        {CONTACT_EMAIL}
      </a>
    </article>
  );
}
