import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { DisclosureBar } from '@/components/DisclosureBar';
import { LifestyleStackCalculator } from '@/components/LifestyleStackCalculator';
import { getProductById, getAllProducts } from '@/lib/db';
import { getBrandPartnerInfo } from '@/lib/affiliate';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdProps } from '@/lib/seo/schema';
import type { Product } from '@/lib/types';

export const revalidate = 3600;

interface StackTemplateItem {
  id: string;
  asinFallback: string;
  name: string;
  brand: string;
  category: string;
  priceCentsFallback: number;
  imageFallback: string;
  description: string;
  reason: string;
}

interface LifestyleStackTemplate {
  title: string;
  subtitle: string;
  themeColor: string; // text color
  bgColor: string;
  borderColor: string;
  icon: string;
  items: StackTemplateItem[];
}

const STACKS: Record<string, LifestyleStackTemplate> = {
  gamers: {
    title: "The Gamer's Active Recovery & Ergonomic Stack",
    subtitle: "Counter Lumbar Compression & Support Active Recovery Without Dropping Framerates.",
    themeColor: "text-purple-400",
    bgColor: "bg-purple-500/[0.03]",
    borderColor: "border-purple-500/20",
    icon: "🎮",
    items: [
      {
        id: 'wahoo-kickr-run-treadmill',
        asinFallback: 'WAHOO-KICKR-RUN',
        name: 'Wahoo KICKR RUN Smart Incline Treadmill',
        brand: 'Wahoo Fitness',
        category: 'Cardio Machines',
        priceCentsFallback: 399900,
        imageFallback: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
        description: 'Elite professional smart treadmill featuring RunFree stride sensors and lateral tilt road camber simulation.',
        reason: 'Revolutionary hands-free automatic speed control allows quiet active walking between loading screens/streams.'
      },
      {
        id: 'B01AVDVHTI', // Fit Simplify Loop Bands (Amazon)
        asinFallback: 'B01AVDVHTI',
        name: 'Fit Simplify Resistance Loop Bands',
        brand: 'Fit Simplify',
        category: 'Resistance Training',
        priceCentsFallback: 1295,
        imageFallback: 'https://m.media-amazon.com/images/I/81N-kCHRqaL._AC_SX679_.jpg',
        description: 'Highly versatile multi-resistance loop bands for active posture stretching and joint warmups.',
        reason: 'Perfect for fast 2-minute posture correction and rotator cuff stretching breaks directly at your gaming desk.'
      },
      {
        id: 'gnc-energy-recovery-stack',
        asinFallback: 'GNC-ENERGY-STACK',
        name: 'GNC AMP Active Energy & Recovery Stack',
        brand: 'GNC Professional',
        category: 'Sports Nutrition',
        priceCentsFallback: 8500,
        imageFallback: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800',
        description: 'Elite recovery stack combining ultra-pure cold-processed whey isolate, micronized creatine, and magnesium glycinate.',
        reason: 'Magnesium glycinate resolves prolonged seated leg cramps, while pure creatine keeps neural drive and focus peak.'
      }
    ]
  },
  moms: {
    title: "The Parent's Silent Home Gym & Fast Recovery Stack",
    subtitle: "Nap-time Quiet Strength Gear, Hardwood Protection, and High-Efficiency Workout Programs.",
    themeColor: "text-emerald-400",
    bgColor: "bg-emerald-500/[0.03]",
    borderColor: "border-emerald-500/20",
    icon: "👶",
    items: [
      {
        id: 'B001ARYU58', // Bowflex Dumbbells (Amazon)
        asinFallback: 'B001ARYU58',
        name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
        brand: 'Bowflex',
        category: 'Home Gym',
        priceCentsFallback: 34900,
        imageFallback: 'https://m.media-amazon.com/images/I/81+X8zF1d4L._AC_SL1500_.jpg',
        description: 'Space-saving selectorized weights replacing a complete rack in under 2.5 square feet.',
        reason: 'Double-dampened polymer locking dials adjust with under 10 decibels of noise, keeping sleeping nurseries undisturbed.'
      },
      {
        id: 'rogue-monster-bands',
        asinFallback: 'ROGUE-MONSTER-BANDS',
        name: 'Rogue Monster Latex Pull-Up & Strength Bands',
        brand: 'Rogue Fitness',
        category: 'Resistance Training',
        priceCentsFallback: 4500,
        imageFallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
        description: 'Multi-layered snap-proof natural latex bands built for rehabilitation and dynamic full-body conditioning.',
        reason: 'Provides zero-noise high-efficiency muscular loading without clanking metal plates or risking floor drops.'
      },
      {
        id: 'gnc-energy-recovery-stack',
        asinFallback: 'GNC-ENERGY-STACK',
        name: 'GNC AMP Active Energy & Recovery Stack',
        brand: 'GNC Professional',
        category: 'Sports Nutrition',
        priceCentsFallback: 8500,
        imageFallback: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800',
        description: 'Elite recovery stack combining ultra-pure cold-processed whey isolate, micronized creatine, and magnesium glycinate.',
        reason: 'Whey isolate offers quick-mix protein recovery matching demanding schedules, bypassing time-consuming prep.'
      },
      {
        id: 'clickbank-12wk-strength-program',
        asinFallback: 'CLICKBANK-STRENGTH-12WK',
        name: 'Athletica Pro 12-Week Progressive Strength System',
        brand: 'ClickBank Academy',
        category: 'Digital Courses',
        priceCentsFallback: 3700,
        imageFallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
        description: 'Step-by-step digital strength programming, dynamic overload trackers, and nutrition blueprints.',
        reason: 'Offers elite-level coaching structures directly on mobile, optimizing compact 20-minute workout windows.'
      }
    ]
  },
  apartment: {
    title: "The Space-Saver Apartment Gym Blueprint Stack",
    subtitle: "High-Efficiency Space Multipliers That Store Completely Flat Under a Bed.",
    themeColor: "text-sky-400",
    bgColor: "bg-sky-500/[0.03]",
    borderColor: "border-sky-500/20",
    icon: "🏠",
    items: [
      {
        id: 'rogue-adjustable-bench-3',
        asinFallback: 'ROGUE-BENCH-3',
        name: 'Rogue Adjustable Bench 3.0 (Commercial Grade)',
        brand: 'Rogue Fitness',
        category: 'Home Gym',
        priceCentsFallback: 59500,
        imageFallback: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800',
        description: 'Premium US 11-gauge steel adjustable bench with dual-density zero-gap vinyl pad and vertical storage wheels.',
        reason: 'Rolls easily into room corners and stands completely vertical, utilizing less than 2.5 square feet of standing footprint.'
      },
      {
        id: 'B001ARYU58', // Bowflex SelectTech (Amazon)
        asinFallback: 'B001ARYU58',
        name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
        brand: 'Bowflex',
        category: 'Home Gym',
        priceCentsFallback: 34900,
        imageFallback: 'https://m.media-amazon.com/images/I/81+X8zF1d4L._AC_SL1500_.jpg',
        description: 'Vetted 5-in-1 space adjustable dumbbells replacing a full hex rack of weights.',
        reason: 'Consolidates 15 individual pairs of dumbbells into a single flat compact base, saving massive floor space.'
      },
      {
        id: 'clickbank-12wk-strength-program',
        asinFallback: 'CLICKBANK-STRENGTH-12WK',
        name: 'Athletica Pro 12-Week Progressive Strength System',
        brand: 'ClickBank Academy',
        category: 'Digital Courses',
        priceCentsFallback: 3700,
        imageFallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
        description: 'Digital progressive overload programming app optimized for home gym spaces.',
        reason: 'Direct home-gym coaching database bypasses bulky equipment, relying on active progress mapping.'
      }
    ]
  },
  pets: {
    title: "The Pet-Owner's Claw-Proof Indestructible Gym Stack",
    subtitle: "Gym-Grade Durability That Deflects Claws, Teeth, and Fur Hair Contamination.",
    themeColor: "text-amber-400",
    bgColor: "bg-amber-500/[0.03]",
    borderColor: "border-amber-500/20",
    icon: "🐶",
    items: [
      {
        id: 'rogue-adjustable-bench-3',
        asinFallback: 'ROGUE-BENCH-3',
        name: 'Rogue Adjustable Bench 3.0 (Commercial Grade)',
        brand: 'Rogue Fitness',
        category: 'Home Gym',
        priceCentsFallback: 59500,
        imageFallback: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800',
        description: 'Premium US 11-gauge steel adjustable bench with claw-resistant high-durometer vinyl pad.',
        reason: 'Tear-resistant vinyl fabric prevents claw scratches or teeth chew marks, maintaining pristine long-term aesthetics.'
      },
      {
        id: 'rogue-monster-bands',
        asinFallback: 'ROGUE-MONSTER-BANDS',
        name: 'Rogue Monster Latex Pull-Up & Strength Bands',
        brand: 'Rogue Fitness',
        category: 'Resistance Training',
        priceCentsFallback: 4500,
        imageFallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
        description: 'Thick, multi-layered natural latex bands resistant to abrasive tearing.',
        reason: 'Dense premium latex resists dust/dander accumulation and pet chewing compared with porous cheap neoprene.'
      }
    ]
  },
  budget: {
    title: "The $500 Elite Maximum Value Stack",
    subtitle: "High-Utility Compound Gear Outperforming Expensive Commercial Racks.",
    themeColor: "text-emerald-400",
    bgColor: "bg-emerald-500/[0.03]",
    borderColor: "border-emerald-500/20",
    icon: "💰",
    items: [
      {
        id: 'B099JZT1WR', // Yoleo bench
        asinFallback: 'B099JZT1WR',
        name: 'YOLEO Adjustable Weight Bench',
        brand: 'YOLEO',
        category: 'Home Gym',
        priceCentsFallback: 12999,
        imageFallback: 'https://m.media-amazon.com/images/I/81pu4FK5uSL._AC_UL320_.jpg',
        description: 'Folding incline-decline adjustable bench with 827 lbs maximum capacity.',
        reason: 'Elite price-to-performance ratio offering stable pressing and rowing support under $130.'
      },
      {
        id: 'B01AVDVHTI', // Fit Simplify Bands
        asinFallback: 'B01AVDVHTI',
        name: 'Fit Simplify Resistance Loop Bands',
        brand: 'Fit Simplify',
        category: 'Resistance Training',
        priceCentsFallback: 1295,
        imageFallback: 'https://m.media-amazon.com/images/I/81N-kCHRqaL._AC_SX679_.jpg',
        description: 'Set of loop bands with multi-resistance labels for accessory strength work.',
        reason: 'Best-in-class low-cost warmup addition, maximizing workout variety with zero bulk footprint.'
      },
      {
        id: 'B001ARYU58', // Bowflex Dumbbells
        asinFallback: 'B001ARYU58',
        name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
        brand: 'Bowflex',
        category: 'Home Gym',
        priceCentsFallback: 34900,
        imageFallback: 'https://m.media-amazon.com/images/I/81+X8zF1d4L._AC_SL1500_.jpg',
        description: 'Selectorized weights replacing a complete rack in a single compact pair.',
        reason: 'Replaces 15 pairs of traditional dumbbells, achieving maximum value-per-pound ratios.'
      }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(STACKS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const stack = STACKS[params.slug];
  if (!stack) return buildMetadata({ title: 'Stack Not Found', noindex: true });
  return buildMetadata({
    title: `The Ultimate ${stack.title.replace('The ', '')} (2026 Checklist)`,
    description: `Shop the perfect fitness stack tailored for ${params.slug}. Consolidate direct brand deals, premium alternatives, and recurring recover tools with a single click.`,
    canonical: `/lifestyle/${params.slug}/stack`,
  });
}

export default async function LifestyleStackPage({ params }: { params: { slug: string } }) {
  const template = STACKS[params.slug];
  if (!template) notFound();

  // Fetch live product details from Supabase if possible to keep prices and images fresh
  const items = await Promise.all(
    template.items.map(async (item) => {
      let liveProduct: Product | null = null;
      try {
        liveProduct = await getProductById(item.id);
      } catch (err) {
        console.warn(`[stack] failed to fetch live product "${item.id}":`, err);
      }

      const partner = getBrandPartnerInfo(liveProduct?.brand || item.brand);

      return {
        id: item.id,
        asin: liveProduct?.asin || item.asinFallback,
        slug: liveProduct?.slug || item.id,
        name: liveProduct?.title || item.name,
        brand: liveProduct?.brand || item.brand,
        category: liveProduct?.category || item.category,
        priceCents: liveProduct?.price_cents || item.priceCentsFallback,
        image: liveProduct?.image_url || item.imageFallback,
        description: item.description,
        reason: item.reason,
        affiliateUrl: liveProduct?.affiliate_url || `/api/track?productId=${item.asinFallback}`,
        isPartner: partner.isPartner,
        commissionRate: partner.commissionRate
      };
    })
  );

  const url = `/lifestyle/${params.slug}/stack`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lifestyle Guides', url: '/' },
    { name: template.title.replace("The ", ""), url: `/lifestyle/${params.slug}` },
    { name: 'Interactive Stack', url }
  ];

  return (
    <>
      <script {...jsonLdProps([breadcrumbSchema(breadcrumbs)])} />
      <DisclosureBar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Back Link */}
        <Link
          href={`/lifestyle/${params.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blueprint
        </Link>

        {/* Header Hero Section */}
        <header className={`relative overflow-hidden rounded-3xl border ${template.borderColor} ${template.bgColor} p-8 sm:p-12 mb-12 shadow-2xl`}>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cta-orange/[0.02] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          
          <div className="relative z-10 space-y-4">
            <span className={`inline-flex items-center gap-2 rounded-full border ${template.borderColor} bg-black/40 px-4 py-1.5 text-xs font-black uppercase tracking-wider ${template.themeColor}`}>
              <span className="text-sm">{template.icon}</span> INTERACTIVE ECOSYSTEM BUNDLE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-offwhite leading-none">
              {template.title}
            </h1>
            <p className="max-w-2xl text-base text-neutral-300 leading-relaxed font-semibold">
              {template.subtitle}
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-savings-green" /> Data-Verified & Lab-Tested Ecosystem Setup
            </div>
          </div>
        </header>

        {/* Dynamic Calculator & Checkout checklist */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="section-eyebrow">Checkout Optimizer</span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-offwhite">Interactive Ecosystem Builder</h2>
          </div>
          <LifestyleStackCalculator stack={{
            slug: params.slug,
            title: template.title,
            subtitle: template.subtitle,
            themeColor: template.themeColor,
            bgColor: template.bgColor,
            borderColor: template.borderColor,
            icon: template.icon,
            items
          }} />
        </section>
      </main>
    </>
  );
}
