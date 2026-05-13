import { ShieldCheck, Target, Trophy, Zap, Users, Star } from 'lucide-react';
import Link from 'next/link';

const BUYING_STEPS = [
  {
    icon: Target,
    color: 'text-cta-orange',
    bg: 'bg-cta-orange/10 border-cta-orange/20',
    heading: '1. Match your goal first',
    body: 'Define the training problem before the product. Heavy lifting needs a different answer than small-space cardio or recovery. Mismatched gear gets abandoned within weeks.',
  },
  {
    icon: ShieldCheck,
    color: 'text-trust-blue',
    bg: 'bg-trust-blue/10 border-trust-blue/20',
    heading: '2. Verify durability claims',
    body: 'Favor steel frames, warranty coverage of 2+ years, and construction details that hold up after 3–5 years of use. A $60 dumbbell that fails in 8 months costs more than a $120 one.',
  },
  {
    icon: Trophy,
    color: 'text-data-lime',
    bg: 'bg-data-lime/10 border-data-lime/20',
    heading: '3. Compare total cost of ownership',
    body: 'Include footprint, adjustability range, and accessories you\'ll need. The best overall pick is rarely the cheapest or most expensive — it\'s the one that solves the most friction.',
  },
];

const AUDIENCE_GUIDES = [
  {
    label: 'Busy Moms',
    icon: '🤸‍♀️',
    desc: 'Space-saving, quick-setup gear under $300',
    href: '/category/home-gym',
  },
  {
    label: 'Beginners',
    icon: '💪',
    desc: 'Start strong with zero overwhelm',
    href: '/category/resistance-training',
  },
  {
    label: 'Apartment Dwellers',
    icon: '🏠',
    desc: 'Sub-30 sq ft footprint setups',
    href: '/category/home-gym',
  },
  {
    label: 'Heavy Lifters',
    icon: '🏋️',
    desc: 'High-load, garage-proof equipment',
    href: '/category/powerlifting',
  },
  {
    label: 'Recovery Focus',
    icon: '🔋',
    desc: 'Massage guns, bands, mobility tools',
    href: '/category/recovery',
  },
  {
    label: 'Budget Builds',
    icon: '💰',
    desc: 'Full home gym under $500',
    href: '/category/home-gym',
  },
];

export function BuyerGuide({ category = 'fitness gear' }: { category?: string }) {
  return (
    <div className="space-y-10">

      {/* How to choose section */}
      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="section-eyebrow mb-2">Buying Intelligence</div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-offwhite">
              How to choose the best {category}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-widest text-neutral-500">
            <Star className="w-3.5 h-3.5 text-star-gold fill-star-gold" />
            Validated by Athletica Lab
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {BUYING_STEPS.map(({ icon: Icon, color, bg, heading, body }) => (
            <div key={heading} className={`rounded-inner border p-5 ${bg}`}>
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-black text-offwhite leading-tight">{heading}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-inner border border-data-lime/15 bg-data-lime/5 p-5">
          <div className="flex items-start gap-4">
            <Zap className="w-5 h-5 text-data-lime flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-offwhite mb-1">The ProAthletica Rule of Thumb</p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                The right pick removes the most friction from your training, not the one with the best marketing. If you find yourself avoiding equipment because setup is annoying, you bought the wrong thing. Use our comparison tool to find what actually fits your life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "Who is this for?" audience grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="section-eyebrow mb-1">Find Your Fit</div>
            <h2 className="text-2xl font-black tracking-tight text-offwhite">
              Guides by training style
            </h2>
          </div>
          <Link href="/categories" className="text-sm font-bold text-trust-blue hover:text-offwhite transition-colors">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AUDIENCE_GUIDES.map(({ label, icon, desc, href }) => (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden rounded-inner border border-white/[0.06] bg-graphite-800 p-4 hover:border-data-lime/25 hover:bg-data-lime/[0.03] transition-all duration-200"
            >
              <div className="text-2xl mb-2" aria-hidden="true">{icon}</div>
              <div className="font-black text-sm text-offwhite group-hover:text-data-lime transition-colors">{label}</div>
              <div className="text-xs text-neutral-500 mt-0.5 leading-snug">{desc}</div>
              <div className="absolute bottom-3 right-3 text-data-lime/30 text-xs font-black group-hover:text-data-lime/60 transition-colors">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community trust strip */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Users className="w-4 h-4 text-trust-blue" />
          <span>Trusted by <strong className="text-offwhite">4,200+</strong> home gym builders</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-savings-green" />
          <span><strong className="text-offwhite">100%</strong> independent — no paid placements</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Star className="w-4 h-4 text-star-gold fill-star-gold" />
          <span><strong className="text-offwhite">47,800+</strong> verified reviews analyzed</span>
        </div>
      </div>
    </div>
  );
}
