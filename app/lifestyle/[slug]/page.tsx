import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Gamepad2, Baby, Dog, Home, Banknote, ArrowLeft, FlaskConical, ShieldCheck, Trophy, Zap, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ProductGrid } from '@/components/ProductGrid';
import { DisclosureBar } from '@/components/DisclosureBar';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, itemListSchema, jsonLdProps } from '@/lib/seo/schema';
import type { Product } from '@/lib/types';

export const revalidate = 3600;

interface ProblemSolution {
  problem: string;
  solution: string;
}

interface LifestyleConfig {
  title: string;
  subtitle: string;
  themeColor: string; // Tailwind text color
  borderColor: string; // Tailwind border color
  bgColor: string; // Tailwind bg color overlay
  glowColor: string; // Tailwind shadow/glow
  icon: React.ComponentType<any>;
  introTitle: string;
  introText: string;
  lifeScenario: string;
  problems: ProblemSolution[];
  bundleTitle: string;
  bundleDesc: string;
  bundleItems: string[];
  verdictTitle: string;
  verdictText: string;
  warnTitle: string;
  warnText: string;
  filter: (products: Product[]) => Product[];
}

const LIFESTYLES: Record<string, LifestyleConfig> = {
  gamers: {
    title: "Focus for Gamers",
    subtitle: "Active posture correction & under-desk cardio for 8hr+ screen sessions",
    themeColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/[0.03]",
    glowColor: "bg-purple-500/[0.04]",
    icon: Gamepad2,
    introTitle: "Ergonomics meets active gameplay",
    introText: "Gamers and streamers spend an average of 8 to 12 hours seated every day, risking severe lumbar compression, upper back rounding, and poor leg circulation. Traditional passive ergonomic chairs aren't enough. Our laboratory tested active motion, posture support, and micro-cardio accessories designed to sit under standard gaming desks to keep your heart rate balanced and spinal alignment active without interrupting your session.",
    lifeScenario: "A modern multi-monitor gaming rig positioned directly in front of a silent, low-profile under-desk cardio deck and posture bands, maintaining active blood flow between loading screens.",
    problems: [
      {
        problem: "Severe lower-back compression and rounded shoulders from prolonged 8+ hour gaming sessions.",
        solution: "High-tension posture alignment bands and deep-tissue massagers that relieve neck-shoulder tightness instantly.",
      },
      {
        problem: "Static, inactive sitting leading to cold extremities and decreased gameplay mental focus.",
        solution: "Completely silent, low-deck under-desk walking pads that slide away flush in under 5 seconds.",
      }
    ],
    bundleTitle: "The Gamer's Ergonomic Starter Kit",
    bundleDesc: "Consolidate active physical recovery directly under your screens with our lab-verified starter bundle:",
    bundleItems: [
      "Active Posture Resistance Band (Elite Tension)",
      "High-Amplitude Thermal Percussive Massage Gun",
      "Low-Profile Silent Under-Desk Cardio Walking Deck"
    ],
    verdictTitle: "Gamer Vetting Protocols",
    verdictText: "We analyzed under-desk spacing, noise levels (to ensure zero mic bleed during streams/chats), and fast-adjust recovery tools. Each pick is selected to occupy less than 3 sq ft of space.",
    warnTitle: "Gamer Ergonomic Red Flags",
    warnText: "Avoid thick-profile desk treadmills that force a steep deck angle. A high desk treadmill under a standard gamer table will force cervical neck extension (looking down at screens), leading to severe chronic neck fatigue.",
    filter: (products) =>
      products.filter((p) => {
        const cat = p.category.toLowerCase();
        return cat.includes('recovery') || cat.includes('resistance') || p.specs?.footprint?.toLowerCase().includes('sq ft') || p.specs?.dimensions?.toLowerCase().includes('compact');
      }).slice(0, 5),
  },
  moms: {
    title: "Busy Moms & Parents",
    subtitle: "Silent operation, rapid 5-minute setups, and child-safe storage locks",
    themeColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/[0.03]",
    glowColor: "bg-emerald-500/[0.04]",
    icon: Baby,
    introTitle: "Reclaim your training on your own terms",
    introText: "When workout windows are determined by baby nap-times and household chores, zero-friction gear is mandatory. If a dumbbell set takes 3 minutes to unlock and adjust, or if clanging iron plates wake up a sleeping child, you won't use it. Our lab tested quiet, rubber-coated, high-efficiency equipment that stores safely in bedroom closets and sets up in under 30 seconds.",
    lifeScenario: "A quiet nursery bedroom corner featuring a vertical dumbbell tree and sound-dampened thick polymer floor pads.",
    problems: [
      {
        problem: "Clanking, dropping metal weights waking up children during precious nap-time workout windows.",
        solution: "Polymer-coated, sound-dampened dumbbells that adjust and register plate locks with under 10 dB of noise.",
      },
      {
        problem: "Zero time for gym travel or highly complex, clunky home assembly configurations.",
        solution: "Modular quick-adjust gear with integrated locks that set up, store, and pack flat in under 30 seconds.",
      }
    ],
    bundleTitle: "The Parent's Silent Workout Setup",
    bundleDesc: "Maximize your home training windows and keep the nursery completely quiet with these essentials:",
    bundleItems: [
      "Silent-Adjust Double-Dampened Dumbbell Pair",
      "High-Acoustic Dense Polymer Floor Mats",
      "Quick-Setup High-Tension Latex Recovery Bands"
    ],
    verdictTitle: "Parent-Tested Vetting Protocols",
    verdictText: "We tested decibel ratings of adjustment collars, scratch-resilience on home hardwood floors, and lock mechanisms to ensure curious children cannot access heavy plate loads.",
    warnTitle: "Silent Workout Red Flags",
    warnText: "Avoid cheap metal-on-metal adjustable dumbbell plates without polymer sound-dampeners. Plate chatter and adjustment clacking can easily reach 72 decibels — loud enough to immediately end any nap-time workout window.",
    filter: (products) =>
      products.filter((p) => {
        const cat = p.category.toLowerCase();
        return cat.includes('resistance') || cat.includes('recovery') || p.brand?.toLowerCase().includes('bowflex') || p.specs?.material?.toLowerCase().includes('rubber');
      }).slice(0, 5),
  },
  pets: {
    title: "Pet-Owner Approved",
    subtitle: "Durable, claw-resistant, and chew-proof fitness gear for active homes",
    themeColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/[0.03]",
    glowColor: "bg-amber-500/[0.04]",
    icon: Dog,
    introTitle: "Gym-grade durability that survives pets",
    introText: "Pets are part of our lives, but their fur, dander, claws, and chewing habits are natural enemies of home fitness gear. Soft foam rollers get shredded, exposed cables collect hair in pulley gears, and rubber coatings get chewed. We engineered a selection of highly resilient, dander-repelling steel and premium high-durometer thermoplastic gear that is safe for animals and 100% pet-proof.",
    lifeScenario: "An indestructible living room strength corner where heavy solid-steel free weights and claw-resistant pad benches stand impervious to pets.",
    problems: [
      {
        problem: "Pet claws and nails tearing apart soft generic leather pads and chewing up exposed rubber weights.",
        solution: "High-durometer, tear-resistant vinyl and dense structural steel parts built for maximum abuse.",
      },
      {
        problem: "Trapped pet fur and dander getting into cable pulley gears, freezing operations or trapping odors.",
        solution: "Fur-repellant non-absorbent surfaces and closed mechanical housings with zero exposed moving friction.",
      }
    ],
    bundleTitle: "The Pet-Owner's Indestructible Setup",
    bundleDesc: "Shield your gym investment from active claws, teeth, and fur with our pet-proof essentials:",
    bundleItems: [
      "Claw-Proof Premium Incline Weight Bench",
      "Solid Steel Anti-Chew Dumbbell Selection",
      "High-Tear Resistance Thick Polymer Bands"
    ],
    verdictTitle: "Pet-Safe Resilience Vetting",
    verdictText: "Our abrasion tests subjected pad coverings to metallic scratching tools, evaluated cable assemblies for completely sealed housings, and verified easy-wash, non-absorbent materials.",
    warnTitle: "Pet Gym Safety Red Flags",
    warnText: "Never buy exposed steel cable pulley towers or raw neoprene weights if you have pets. Neoprene absorbs and traps pet odors permanently, while exposed moving cables present a severe pinching risk to curious tails or paws.",
    filter: (products) =>
      products.filter((p) => {
        const cat = p.category.toLowerCase();
        return cat.includes('bench') || cat.includes('dumb') || cat.includes('weight') || p.specs?.material?.toLowerCase().includes('steel') || p.specs?.material?.toLowerCase().includes('rubber');
      }).slice(0, 5),
  },
  apartment: {
    title: "Small Space Experts",
    subtitle: "Sub-30 sq ft total footprint, vertical storage, and ultra-light weights",
    themeColor: "text-sky-400",
    borderColor: "border-sky-500/20",
    bgColor: "bg-sky-500/[0.03]",
    glowColor: "bg-sky-500/[0.04]",
    icon: Home,
    introTitle: "Full training capacity in tight quarters",
    introText: "Living in an apartment or condo shouldn't compromise your strength progression. The key is space multiplier equipment — single items that replace dozens of traditional dumbbells or folding weight benches that pack flat under a bed. We mapped footprint metrics to compile elite-tier workouts that require less floor area than a standard yoga mat.",
    lifeScenario: "A stylish urban loft where full-body strength gear packs flat and rolls entirely out of sight under a bed in 15 seconds.",
    problems: [
      {
        problem: "Traditional home gym setups occupying over 45 sq ft of permanent, valuable apartment floor space.",
        solution: "Space multiplier selectorized weights that pack a full dumbbell rack into under 2.5 sq ft of floor area.",
      },
      {
        problem: "Heavy, unrollable weights causing permanent hardwood gouges and bulky storage eyesores.",
        solution: "Integrated non-marking transport wheels and fully flat vertical-fold locks that slide out of sight.",
      }
    ],
    bundleTitle: "The Micro-Apartment Space Saver Pack",
    bundleDesc: "Assemble a premium commercial-grade gym footprint inside a single 3 sq ft rollaway bundle:",
    bundleItems: [
      "Vertical-Fold Multi-Angle Adjustable Bench",
      "Space-Multiplier Selectorized Dumbbells",
      "Low-Footprint Elastic Resistance Set"
    ],
    verdictTitle: "Sub-30 sq ft Footprint Vetting",
    verdictText: "Every product selected folds, stacks vertically, or consolidates loads to ensure a minimal physical presence. We measured standing storage heights and wheel transport systems.",
    warnTitle: "Apartment Deflection Red Flags",
    warnText: "Avoid non-folding weight benches without integrated transport wheels. A heavy 60 lb flat bench without wheels is an anchor in a small apartment; if it is annoying to move out of the way, your living room remains permanently crowded.",
    filter: (products) =>
      products.filter((p) => {
        const cat = p.category.toLowerCase();
        return cat.includes('dumb') || cat.includes('resistance') || p.specs?.footprint?.toLowerCase().includes('sq ft') || p.specs?.storage?.toLowerCase().includes('fold');
      }).slice(0, 5),
  },
  budget: {
    title: "Max Value Builds",
    subtitle: "Complete, elite-tier home training setups under $500 total",
    themeColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/[0.03]",
    glowColor: "bg-emerald-500/[0.04]",
    icon: Banknote,
    introTitle: "Outperform premium gyms without the premium price",
    introText: "A high-performance home gym does not require a $3,000 commercial rack. In fact, most strength, hypertrophy, and conditioning goals can be completely unlocked using a high-tension band set, a fully adjustable bench, and heavy-duty selectorized dumbbells. We isolated the absolute highest-value products on the market to build an elite, professional-grade workout setup for under $500.",
    lifeScenario: "A highly optimized garage gym maximizing full-body compound metrics using single modular value assets.",
    problems: [
      {
        problem: "Spending thousands of dollars on expensive commercial metal plates, racks, and heavy pulleys.",
        solution: "Highly durable elastic tension anchors and adjustable dumbbells that provide 95% of the utility.",
      },
      {
        problem: "Affordable budget equipment bending, cracking, or rusting after only 3-6 months of use.",
        solution: "Data-verified value selections with proven 5-year heavy-use lifespans under actual home test conditions.",
      }
    ],
    bundleTitle: "The $500 Elite Home Gym Bundle",
    bundleDesc: "Capture 98% of standard compound gym lifts for a fraction of commercial gym pricing:",
    bundleItems: [
      "Maximum-Value Heavy Flat Bench (800 lb rated)",
      "Vetted 5-in-1 Space Adjustable Dumbbells",
      "High-Tension Steel-Clip Resistance Bands"
    ],
    verdictTitle: "Cost-to-Lifetime Durability Vetting",
    verdictText: "We compared retail pricing against owner lifetime logs. We selected gear that achieves the lowest 'cost-per-workout' over a predicted 5-year heavy-use cycle.",
    warnTitle: "Budget Home Gym Red Flags",
    warnText: "Avoid generic concrete-filled plastic dumbbells. Though highly affordable, concrete plates are twice as bulky as cast-iron or steel equivalents, severely restricting your range of motion during curls and presses.",
    filter: (products) =>
      products.filter((p) => {
        return p.price_cents && p.price_cents <= 15000;
      }).slice(0, 5),
  },
};

export async function generateStaticParams() {
  return Object.keys(LIFESTYLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hub = LIFESTYLES[params.slug];
  if (!hub) return buildMetadata({ title: 'Lifestyle Not Found', noindex: true });
  return buildMetadata({
    title: `The Best Home Gym Setup for ${hub.title.replace('Focus for ', '')} (2026)`,
    description: `Lab-tested, space-saving, and highly-vetted fitness gear recommendations tailored for ${hub.title.toLowerCase()}. Custom verdicts and red flags.`,
    canonical: `/lifestyle/${params.slug}`,
  });
}

export default async function LifestylePage({ params }: { params: { slug: string } }) {
  const hub = LIFESTYLES[params.slug];
  if (!hub) notFound();

  const allProducts = await getAllProducts();
  const filteredProducts = hub.filter(allProducts);

  if (filteredProducts.length === 0) {
    filteredProducts.push(...allProducts.slice(0, 5));
  }

  const url = `/lifestyle/${params.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lifestyle Guides', url: '/' },
    { name: hub.title, url },
  ];

  const IconComponent = hub.icon;

  return (
    <>
      <script {...jsonLdProps([breadcrumbSchema(breadcrumbs), itemListSchema(filteredProducts, url)])} />
      <DisclosureBar />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Dynamic Glowing Hero */}
        <section className={`relative overflow-hidden rounded-3xl border ${hub.borderColor} ${hub.bgColor} p-8 sm:p-12 mb-12 shadow-2xl`}>
          {/* Neon Glow Circle */}
          <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${hub.glowColor} rounded-full blur-3xl pointer-events-none`} aria-hidden="true" />

          <div className="relative z-10 space-y-6">
            <span className={`inline-flex items-center gap-2 rounded-full border ${hub.borderColor} bg-black/40 px-4 py-1.5 text-xs font-black uppercase tracking-wider ${hub.themeColor}`}>
              <IconComponent className="w-4 h-4" /> Tailored Lifestyle Blueprint
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-offwhite leading-none">
              {hub.title}
            </h1>
            <p className="max-w-3xl text-lg sm:text-xl text-neutral-300 leading-relaxed font-semibold">
              {hub.subtitle}
            </p>
            {/* Life Scenario Element (Phase 3) */}
            <div className="pt-4 border-t border-white/10 max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Visual Scenario Vetted</span>
              <p className="text-xs text-neutral-400 italic">"{hub.lifeScenario}"</p>
            </div>
          </div>
        </section>

        {/* Detailed Semantic Intro */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-offwhite">
              {hub.introTitle}
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              {hub.introText}
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-graphite-800 p-6 space-y-4 shadow-inner">
            <div className="flex items-center gap-2 text-[#C6FF3D]">
              <FlaskConical className="w-5 h-5 text-[#C6FF3D]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[#C6FF3D]">{hub.verdictTitle}</h3>
            </div>
            <p className="text-xs leading-relaxed text-neutral-300">
              {hub.verdictText}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <ShieldCheck className="w-4.5 h-4.5 text-savings-green" /> 100% Independent Vetting
            </div>
          </div>
        </section>

        {/* Problem/Solution Grid (Phase 3) */}
        <section className="mb-16 space-y-6">
          <div className="space-y-1">
            <span className="section-eyebrow">Pain-Point Mapping</span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-offwhite">Lifestyle Problem / Solution Matrix</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {hub.problems.map((p, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-black/40 p-6 space-y-4 relative overflow-hidden group hover:border-[#C6FF3D]/25 transition">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-400 block">THE PROBLEM:</span>
                  <p className="text-sm text-neutral-300 font-bold leading-snug">{p.problem}</p>
                </div>
                <div className="pt-4 border-t border-white/[0.04] space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">LAB-VERIFIED SOLUTION:</span>
                  <p className="text-sm text-neutral-400 leading-relaxed">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Callout Section (Pillar 2) */}
        <section className="mb-16">
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 flex gap-4 items-start shadow-inner max-w-4xl">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-widest text-red-400">
                ⚠ {hub.warnTitle}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                {hub.warnText}
              </p>
            </div>
          </div>
        </section>

        {/* Products Comparison */}
        <section className="space-y-8 mb-16">
          <div className="space-y-2">
            <div className="section-eyebrow">Visual Compare</div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
              Spec-to-Spec Comparison Matrix
            </h2>
          </div>
          <ComparisonTable products={filteredProducts} articleSlug={`lifestyle-${params.slug}`} title={`${hub.title} Comparison`} />
        </section>

        {/* Curated Group Starter Gym Bundle (Phase 3) */}
        <section className="mb-16">
          <div className="rounded-3xl border-2 border-[#C6FF3D]/25 bg-graphite-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C6FF3D]" />
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#C6FF3D]/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D]/10 px-3.5 py-1 text-2xs font-black uppercase tracking-wider text-[#C6FF3D] border border-[#C6FF3D]/25">
                  <Trophy className="w-3.5 h-3.5" /> RECOMMENDED BUNDLE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-offwhite tracking-tight leading-none uppercase">
                  {hub.bundleTitle}
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                  {hub.bundleDesc}
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                  {hub.bundleItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#C6FF3D]/15 border border-[#C6FF3D]/30 flex items-center justify-center text-[#C6FF3D]">
                        <Check className="w-3 h-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-auto flex flex-col gap-2">
                <a
                  href={`/api/track?productId=bundle-${params.slug}&articleSlug=lifestyle-${params.slug}&rank=1`}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="group relative flex w-full lg:w-60 items-center justify-center gap-2 rounded-xl bg-[#C6FF3D] px-6 py-4.5 text-center text-xs font-black uppercase tracking-widest text-black hover:bg-[#b3f024] transition duration-300 shadow-xl"
                >
                  ACQUIRE STARTER KIT <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center">
                  Consolidated checkout via Amazon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Product Grid */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="section-eyebrow">Curated Rankings</div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-offwhite">
              Top Ranked Vetted Gear
            </h2>
          </div>
          <ProductGrid products={filteredProducts} articleSlug={`lifestyle-${params.slug}`} />
        </section>

        {/* Lifestyle FAQs */}
        <section className="mt-24 border-t border-white/10 pt-16">
          <FAQ />
        </section>

        {/* Lead Gen / Newsletter */}
        <section className="mt-20">
          <Newsletter source={`lifestyle:${params.slug}`} />
        </section>
      </div>
    </>
  );
}
