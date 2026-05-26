import { notFound } from 'next/navigation';
import { AUTHORS } from '@/lib/editorial';
import { buildMetadata } from '@/lib/seo/metadata';
import { personSchema, jsonLdProps } from '@/lib/seo/schema';
import { SITE_URL, SITE_NAME } from '@/lib/config';
import { ShieldCheck, Award, Microscope, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const author = AUTHORS[params.slug];
  if (!author) return buildMetadata({ title: 'Author Not Found', noindex: true });

  return buildMetadata({
    title: `${author.name}, ${author.role} at ${SITE_NAME}`,
    description: `Learn about ${author.name}'s professional training background, credentials, and their data-backed gear testing methodology.`,
    canonical: `/author/${params.slug}`,
  });
}

export default async function AuthorBioPage({ params }: { params: { slug: string } }) {
  const author = AUTHORS[params.slug];
  if (!author) notFound();

  // Find products edited or matching category of this author's focus
  const allProducts = await getAllProducts();
  const focusedProducts = allProducts.filter((product) => {
    const cat = (product.category || '').toLowerCase();
    if (author.id === 'alex-rivera') {
      return cat.includes('gym') || cat.includes('strength') || cat.includes('powerlifting') || cat.includes('bench');
    } else if (author.id === 'jordan-kim') {
      return cat.includes('run') || cat.includes('cardio') || cat.includes('treadmill') || cat.includes('endurance');
    } else {
      return cat.includes('recovery') || cat.includes('band') || cat.includes('massage') || cat.includes('apartment');
    }
  }).slice(0, 3);

  const schema = personSchema({
    name: author.name,
    jobTitle: author.role,
    description: author.longBio,
    credentials: author.credentials,
    url: `${SITE_URL}/author/${author.id}`
  });

  return (
    <article className="mx-auto max-w-5xl px-6 py-12 md:py-20 space-y-16">
      <script {...jsonLdProps(schema)} />

      {/* Back button */}
      <div className="flex">
        <Link href="/about" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Editorial Board
        </Link>
      </div>

      {/* Hero section with glassmorphism profile */}
      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 md:p-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-trust-blue/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start relative z-10">
          <div className={`flex h-28 w-28 md:h-36 md:w-36 flex-shrink-0 items-center justify-center rounded-3xl border border-white/[0.08] text-5xl md:text-6xl ${author.color} shadow-lg shadow-black/30`}>
            {author.avatar}
          </div>

          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-trust-blue/20 bg-trust-blue/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-trust-blue">
              <ShieldCheck className="w-3 h-3" />
              Verified Board Expert
            </div>

            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {author.name}
            </h1>

            <p className="text-sm font-bold uppercase tracking-widest text-data-lime">
              {author.role}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {author.credentials.map((cred) => (
                <span key={cred} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-trust-blue" />
                  {cred}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Biography & Testing Methodology */}
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white border-b border-white/[0.06] pb-3">
            Professional Biography
          </h2>
          <p className="text-neutral-300 leading-relaxed text-base">
            {author.longBio}
          </p>
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.04] space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-trust-blue flex items-center gap-1.5">
              <Microscope className="w-4 h-4" />
              Testing Standard & Ethics
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400">
              As a reviewer for {SITE_NAME}, {author.name} adheres strictly to our data-first testing protocol. We do not accept paid placements. Recommended products are selected based on strict structural criteria, user feedback trends, and long-term durability signals.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white border-b border-white/[0.06] pb-3">
            Contact & Profiles
          </h2>
          <ul className="space-y-4">
            {author.linkedin && (
              <li>
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-trust-blue transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <span>LinkedIn Profile</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:hello@athletica.page`} className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-trust-blue transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>Editorial Board Email</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Editor's Featured Recommendations */}
      {focusedProducts.length > 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
              Reviewed by {author.name.split(' ')[0]}
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Highly ranked equipment evaluated under the {author.name.split(' ')[0]}&apos;s lab standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {focusedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                rank={index + 1}
                articleSlug={`author-${author.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
