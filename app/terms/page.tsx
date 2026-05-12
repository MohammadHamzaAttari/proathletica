import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({ title: 'Terms of Service', canonical: '/terms' });

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Terms of service
      </h1>
      <p>By using this site, you accept that our content is informational and editorial in nature.</p>
      <p>
        Strength training and athletic activity carry inherent risk. Use products responsibly and seek
        qualified advice when needed.
      </p>
      <p>
        We are not responsible for third-party retailer pages, pricing changes, or product
        availability.
      </p>
    </article>
  );
}
