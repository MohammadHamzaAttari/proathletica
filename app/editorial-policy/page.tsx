import { ShieldCheck, FileText, Users, RefreshCw, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Editorial Policy',
  description: 'How ProAthletica maintains editorial independence, selects products, handles corrections, and ensures data integrity in all rankings.',
  canonical: '/editorial-policy',
});

const POLICIES = [
  {
    icon: ShieldCheck,
    title: 'Editorial Independence',
    body: 'ProAthletica maintains strict editorial independence. No brand, manufacturer, or retailer can influence our rankings through financial relationships. Our affiliate partnerships (including Amazon Associates) do not affect which products rank #1. We disclose all affiliate relationships per FTC guidelines.',
  },
  {
    icon: Eye,
    title: 'Product Selection Process',
    body: 'Products are selected for review based on market relevance, consumer interest, and category representation. We prioritize products that our readers are actively searching for. We do not accept payment for inclusion in our rankings. Products may be removed if they are discontinued or replaced by newer models.',
  },
  {
    icon: Users,
    title: 'Review Methodology',
    body: 'Our rankings combine three data streams: verified customer review aggregation (47,000+ data points), technical specification verification against manufacturer documents, and editorial assessment by certified coaches and athletes. Each product receives an Athletica Score based on weighted criteria including durability, value, and performance.',
  },
  {
    icon: RefreshCw,
    title: 'Corrections & Updates',
    body: 'If we discover an error in our data, pricing, or specifications, we correct it immediately and note the correction at the bottom of the page. Readers can report errors by emailing our editorial team. Rankings are refreshed as new products enter the market and as additional review data becomes available.',
  },
  {
    icon: AlertTriangle,
    title: 'Conflict of Interest',
    body: 'Editorial board members must disclose any personal or financial relationships with fitness equipment brands. No editor may review products from a brand they have a financial relationship with. Violations are grounds for removal from the editorial board.',
  },
  {
    icon: FileText,
    title: 'AI & Content Policy',
    body: 'AI tools assist with data aggregation and content structuring only. All final editorial decisions, rankings, and review verdicts are made by human editors with relevant certifications and experience. AI does not produce or modify ranking determinations.',
  },
];

export default function EditorialPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-16 px-4 py-20 sm:px-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-trust-blue/20 bg-trust-blue/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-trust-blue">
          <ShieldCheck className="w-3.5 h-3.5" />
          Editorial Standards
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight text-white leading-none">
          Editorial Policy
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400">
          Our commitment to independence, accuracy, and transparency in every product ranking we publish.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {POLICIES.map((p) => (
          <div key={p.title} className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-trust-blue/20 bg-trust-blue/5 text-trust-blue">
              <p.icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-offwhite">{p.title}</h2>
            <p className="text-sm leading-relaxed text-neutral-400">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-white/[0.06] bg-neutral-900/40 p-10 space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-offwhite text-center">Reporting an Error</h2>
        <p className="text-sm text-neutral-400 text-center max-w-lg mx-auto">
          If you spot an inaccuracy in our data, pricing, or product specifications, email our editorial team and we will investigate and correct within 5 business days.
        </p>
        <div className="flex justify-center">
          <Link href="/contact" className="cta-primary w-auto px-8">
            Contact Editorial Team
          </Link>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-12 text-center">
        <p className="text-xs text-neutral-600">
          Last updated June 2026. This policy is reviewed annually.
        </p>
      </div>
    </article>
  );
}
