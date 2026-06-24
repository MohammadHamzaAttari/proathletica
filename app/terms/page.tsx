import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Terms governing your use of ProAthletica. Our content is editorial and informational. Use equipment responsibly.',
  canonical: '/terms',
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-neutral-400 sm:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
        Terms of service
      </h1>
      <p className="text-lg font-medium text-neutral-200 leading-relaxed">
        By accessing or using ProAthletica, you agree to these terms. If you do not agree, do not use this site.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Content & Accuracy</h2>
        <p className="text-sm leading-relaxed">
          All content on ProAthletica is provided for informational and editorial purposes only. We strive for accuracy but make no guarantees about completeness, reliability, or currentness of information. Product specifications, pricing, and availability are subject to change without notice.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">No Professional Advice</h2>
        <p className="text-sm leading-relaxed">
          Our content does not constitute professional medical, training, or nutritional advice. Strength training and athletic activity carry inherent risk of injury. Consult qualified professionals before starting any exercise program. Use equipment responsibly and follow all manufacturer safety guidelines.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Third-Party Links</h2>
        <p className="text-sm leading-relaxed">
          We are not responsible for the content, practices, or availability of third-party websites linked from our pages, including Amazon and other retailers. Pricing and product availability are controlled by the third-party merchant.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Intellectual Property</h2>
        <p className="text-sm leading-relaxed">
          All content, rankings, logos, and editorial material on ProAthletica are owned by ProAthletica unless otherwise attributed. You may not reproduce, distribute, or modify our content without written permission.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Changes to Terms</h2>
        <p className="text-sm leading-relaxed">
          We reserve the right to update these terms at any time. Changes take effect immediately upon posting. Continued use of the site after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <p className="text-xs text-neutral-600 pt-6 border-t border-white/[0.06]">
        Last updated June 2026.
      </p>
    </article>
  );
}
