import { Gamepad2, Baby, Dog, Home, Banknote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HUBS = [
  {
    id: 'gamers',
    label: 'Focus for Gamers',
    icon: Gamepad2,
    desc: 'Posture hacks & under-desk cardio for 8hr+ sessions',
    href: '/lifestyle/gamers',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    id: 'moms',
    label: 'Built for Busy Moms',
    icon: Baby,
    desc: 'Silent gear for nap-time workouts & quick setups',
    href: '/lifestyle/moms',
    color: 'text-data-lime',
    bg: 'bg-data-lime/10 border-data-lime/20',
  },
  {
    id: 'pets',
    label: 'Pet-Owner Approved',
    icon: Dog,
    desc: 'Durable, chew-proof gear for homes with furry helpers',
    href: '/lifestyle/pets',
    color: 'text-cta-orange',
    bg: 'bg-cta-orange/10 border-cta-orange/20',
  },
  {
    id: 'apartment',
    label: 'Small Space Experts',
    icon: Home,
    desc: 'Professional-grade gyms for sub-30 sq ft living',
    href: '/lifestyle/apartment',
    color: 'text-trust-blue',
    bg: 'bg-trust-blue/10 border-trust-blue/20',
  },
  {
    id: 'budget',
    label: 'Max Value Builds',
    icon: Banknote,
    desc: 'Data-proven home gym setups under $500 total',
    href: '/lifestyle/budget',
    color: 'text-savings-green',
    bg: 'bg-savings-green/10 border-savings-green/20',
  },
];

export function LifestyleHubs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="section-eyebrow mb-1">Tailored Guides</div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-offwhite">
            Shop by Lifestyle
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {HUBS.map((hub) => (
          <Link
            key={hub.id}
            href={hub.href}
            className={`group relative flex flex-col p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${hub.bg}`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-black/20 ${hub.color}`}>
              <hub.icon className="h-5 w-5" />
            </div>
            <h3 className="font-black text-xs text-offwhite uppercase tracking-wider mb-1">
              {hub.label}
            </h3>
            <p className="text-[10px] leading-snug text-neutral-500 group-hover:text-neutral-300 transition-colors">
              {hub.desc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-neutral-600 group-hover:text-offwhite transition-colors">
              View Picks <ArrowRight className="h-2.5 w-2.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
