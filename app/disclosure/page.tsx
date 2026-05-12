import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Affiliate Disclosure',
  canonical: '/disclosure',
});

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Affiliate disclosure
      </h1>
      <p className="text-lg text-neutral-200">
        As an Amazon Associate we earn from qualifying purchases.
      </p>
      <p>
        Some outbound links on this site are affiliate links. If you click one and buy something, we
        may earn a commission at no extra cost to you.
      </p>
      <p>
        That commission supports the site and the cost of testing. It does not change how we rank
        products — we do not accept paid placements.
      </p>
      <p>
        We also participate in affiliate programs from other retailers. All affiliate relationships are
        disclosed on the relevant pages.
      </p>
    </article>
  );
}
