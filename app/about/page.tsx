import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'About Us',
  description: 'Meet ProAthletica and learn how we evaluate fitness gear, compare products, and label recommendations.',
  canonical: '/about',
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        About ProAthletica
      </h1>
      <p className="text-lg leading-8 text-neutral-300">
        ProAthletica is an independent review site built for athletes who want grounded
        recommendations, not generic roundup spam.
      </p>
      <div className="space-y-5 text-neutral-400">
        <p>
          We focus on real-world performance, build quality, durability, and value across powerlifting
          gear, home gym equipment, running shoes, and recovery tools.
        </p>
        <p>
          We do not sell rankings. We may earn a commission when readers buy through links, but
          commissions never decide what gets recommended.
        </p>
        <p>
          Our editorial process combines product research, hands-on use when available, and structured
          comparison against alternatives in the same price band. When we have not personally tested
          something, we say so and rely on transparent spec comparison instead of pretending otherwise.
        </p>
        <p>
          As an Amazon Associate we earn from qualifying purchases. Some outbound links on this site
          are affiliate links. If you click one and buy something, we may earn a commission at no extra
          cost to you.
        </p>
        <p>
          You can read the full <a href="/methodology" className="text-emerald-400 underline underline-offset-4">testing methodology</a> for the exact criteria we use.
        </p>
      </div>
    </article>
  );
}
