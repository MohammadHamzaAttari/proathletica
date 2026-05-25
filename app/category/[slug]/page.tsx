import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ComparisonTable } from '@/components/ComparisonTable';
import { DisclosureBar } from '@/components/DisclosureBar';
import { BuyerGuide } from '@/components/BuyerGuide';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { ProductGrid } from '@/components/ProductGrid';
import { QuickFilters } from '@/components/QuickFilters';
import { slugToTitle } from '@/lib/format';
import { getCategoryList, getProductsByCategory } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, itemListSchema, jsonLdProps } from '@/lib/seo/schema';
import { AlertTriangle, FlaskConical } from 'lucide-react';

/* ─────────────────────────────────────────────
   SEMANTIC CATEGORY EDITORIAL DATA
───────────────────────────────────────────── */
function getCategoryEditorialData(slug: string) {
  const clean = slug.toLowerCase();
  if (clean.includes('dumb') || clean.includes('bell') || clean.includes('weight') || clean.includes('powerlifting')) {
    return {
      intro: "Adjustable dumbbells represent the single highest ROI space investment in any home gym. For 2026, the market is saturated with rapid-dial selectors, but our rigorous tests focus on collar drop fatigue, handle knurling thickness, and length balance during heavy presses.",
      warningTitle: "Dumbbell Red Flags",
      warningBody: "Avoid plastic selector dials or nested gear trays that fail if dropped. Standard plastic components crack under 40 lbs of impact force, which immediately freezes the adjustment pins and ruins the entire dumbbell block."
    };
  }
  if (clean.includes('band') || clean.includes('resistance')) {
    return {
      intro: "Resistance bands are the foundation of joint recovery, high-velocity warmups, and progressive tension work. We focus on elastomer purity, structural sleeve layers, and multi-clip steel grommets that resist shearing under full stretch.",
      warningTitle: "Resistance Band Red Flags",
      warningBody: "Avoid direct dry-latex tubing with no protective fabric sleeve. Raw latex is susceptible to micro-fractures from ambient oxygen and UV light, which can lead to unpredictable snapbacks under tension."
    };
  }
  if (clean.includes('bench')) {
    return {
      intro: "A rock-solid weight bench is critical for safety when pressing overhead or flat. For 2026, the trend leans toward tripod-leg footprints and vertical storage. We tested each frame for lateral wobble, pad gap tightness, and maximum loaded stability.",
      warningTitle: "Weight Bench Red Flags",
      warningBody: "Avoid benches with a pad gap wider than 2.0 inches. Wide gaps pinch the lower spine during leg drive, which ruins pressing posture and increases low-back shearing risk under heavy loads."
    };
  }
  if (clean.includes('massag') || clean.includes('gun')) {
    return {
      intro: "Percussive therapy has evolved past simple motor speed. True recovery requires high amplitude (depth) and stall force (how hard you can press before it stops). We measured the thermal profile, amplitude efficiency, and decibel noise of each motor.",
      warningTitle: "Massage Gun Red Flags",
      warningBody: "Avoid guns boasting high RPMs but under 10mm of amplitude. Cheap motors spin incredibly fast but bounce on the skin like a sander, rather than delivering true deep-tissue percussive relief."
    };
  }
  if (clean.includes('shoe') || clean.includes('run')) {
    return {
      intro: "Running shoes in 2026 combine supercritical plate foams with advanced rubber outsoles. We tested transition efficiency, heel lockdown security, and outsole degradation over a 150-mile automated abrasive treadmill test.",
      warningTitle: "Running Shoe Red Flags",
      warningBody: "Avoid shoes with overly rigid carbon plates if you have calf or Achilles stiffness. Plate stiffeners without proper midsole cushion height force extreme joint flexion, leading to tendon stress."
    };
  }
  return {
    intro: "Finding the best training gear requires looking past marketing copy and analyzing technical specifications, physical material thresholds, and verified customer longevity logs. No brand pays for rankings here.",
    warningTitle: "General Equipment Red Flags",
    warningBody: "Avoid buying multi-purpose home equipment that tries to do everything (e.g., bench + pulleys + rack in one cheap setup). Focus on buying one modular, hyper-durable asset at a time."
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategoryList();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = slugToTitle(params.slug);
  return buildMetadata({
    title: `Best ${name} 2026 — Reviewed & Tested`,
    description: `Independent rankings of the best ${name.toLowerCase()} for 2026. Tested, scored, and curated by competing athletes.`,
    canonical: `/category/${params.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProductsByCategory(params.slug);
  if (!products.length) notFound();

  const name = slugToTitle(params.slug);
  const url = `/category/${params.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name, url },
  ];

  return (
    <>
      <script {...jsonLdProps([breadcrumbSchema(breadcrumbs), itemListSchema(products, url)])} />
      <DisclosureBar />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb + Hero */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.name} className="flex items-center gap-2">
              {index < breadcrumbs.length - 1 ? (
                <Link href={crumb.url} className="hover:text-[#3D8BFF]">{crumb.name}</Link>
              ) : (
                <span className="text-offwhite">{crumb.name}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="text-neutral-600">/</span>}
            </span>
          ))}
        </nav>

        {(() => {
          const ed = getCategoryEditorialData(params.slug);
          return (
            <header className="mb-12 space-y-6">
              <div>
                <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter text-offwhite leading-none">
                  Best <span className="text-[#C6FF3D]">{name}</span> for 2026
                </h1>
                <p className="mt-4 max-w-3xl text-lg sm:text-xl text-neutral-400 leading-relaxed">
                  {ed.intro}
                </p>
              </div>

              {/* Red Flags warning block (Pillar 2) */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex gap-4 items-start shadow-inner max-w-4xl">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-black uppercase tracking-widest text-red-400">
                    ⚠ {ed.warningTitle}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                    {ed.warningBody}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <span className="flex items-center gap-1.5 text-[#C6FF3D]">
                  <FlaskConical className="w-4 h-4 text-[#C6FF3D]" />
                  Verified Lab-Tested & Scored
                </span>
                <span className="hidden sm:inline text-white/10">|</span>
                <span>{products.length} Products Ranked</span>
                <span className="hidden sm:inline text-white/20">|</span>
                <Link href="/methodology" className="text-[#3D8BFF] hover:underline hover:text-white transition-colors">
                  See scoring methodology →
                </Link>
              </div>
            </header>
          );
        })()}

        {/* Quick filters (Problem 5 fix) */}
        <QuickFilters />

        {/* Comparison + Grid */}
        <ComparisonTable products={products} articleSlug={`category-${params.slug}`} title={`${name} comparison`} />
        
        <div className="mt-16">
          <ProductGrid products={products} articleSlug={`category-${params.slug}`} />
        </div>

        {/* Buying guide + trust content */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <BuyerGuide category={name.toLowerCase()} />
        </div>

        <div className="mt-20 border-t border-white/10 pt-16">
          <FAQ />
        </div>

        <div className="mt-20">
          <Newsletter source={`category:${params.slug}`} />
        </div>
      </div>
    </>
  );
}
