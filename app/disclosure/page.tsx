import Link from 'next/link';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Affiliate Disclosure',
  description: 'ProAthletica transparency report: How we use affiliate links and maintain editorial independence.',
  canonical: '/disclosure',
});

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl space-y-12 px-4 py-20 sm:px-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-trust-blue">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          Transparency Report
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-none">
          Affiliate disclosure
        </h1>
        <p className="text-xl leading-relaxed text-neutral-300">
          Trust is our only asset. To maintain it, we are 100% transparent about how this site makes money and how we protect our editorial integrity.
        </p>
      </div>

      {/* Main content */}
      <div className="space-y-8 text-neutral-400 leading-relaxed border-t border-white/[0.06] pt-12">
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Amazon Associates Program</h2>
          <p className="text-lg text-neutral-200 font-medium">
            As an Amazon Associate we earn from qualifying purchases.
          </p>
          <p>
            ProAthletica is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">How it works</h2>
          <p>
            Some outbound links on this site are affiliate links. If you click one and make a purchase, we may earn a small commission at <strong className="text-white">no extra cost to you</strong>. These commissions help us fund the massive amount of data analysis and research required to build our rankings.
          </p>
          <div className="rounded-xl border border-trust-blue/20 bg-trust-blue/5 p-5 flex items-start gap-4">
            <Info className="w-5 h-5 text-trust-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-neutral-300">
              We also participate in affiliate programs from other fitness retailers (like Rogue, REP, and direct brands). All such relationships are disclosed on the relevant pages where products are listed.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Editorial Independence</h2>
          <p>
            Commission rates <strong className="text-white">never</strong> influence our rankings. Our Athletica Lab protocol aggregates data and editorial fit first. Many products we rank #1 have lower commission rates than lower-ranked alternatives. We do not accept paid placements, sponsored reviews, or &quot;pay-to-play&quot; rankings.
          </p>
          <p>
            For more detail on our scoring process, please read our{' '}
            <Link href="/methodology" className="text-data-lime font-bold underline underline-offset-4 hover:text-white transition-colors">
              testing methodology
            </Link>.
          </p>
        </section>
      </div>

      {/* Footer link */}
      <div className="border-t border-white/[0.06] pt-12 text-center">
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-white transition-colors">
          Questions? Contact us <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
