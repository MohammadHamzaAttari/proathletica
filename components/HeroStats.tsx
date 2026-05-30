'use client';

import { ShieldCheck, Star, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function StatValue({ value, compact = false }: { value: number; compact?: boolean }) {
  const label = compact ? formatCompact(value) : value.toLocaleString('en-US');

  return (
    <span className="tabular-nums">
      {label}
    </span>
  );
}

export function HeroStats({
  stats,
}: {
  stats: { testedProducts: number; reviews: number; clicks: number };
}) {
  const statCards = [
    {
      label: 'Products ranked',
      sublabel: 'across 8 fitness categories',
      value: stats.testedProducts,
      compact: false,
      icon: TrendingUp,
      iconColor: 'text-data-lime',
      iconBg: 'bg-data-lime/10 border-data-lime/20',
      suffix: '',
    },
    {
      label: 'Reviews analyzed',
      sublabel: 'real verified customer data',
      value: stats.reviews,
      compact: true,
      icon: Star,
      iconColor: 'text-star-gold',
      iconBg: 'bg-star-gold/10 border-star-gold/20',
      suffix: '+',
    },
    {
      label: 'Price checks run',
      sublabel: 'affiliate clicks tracked',
      value: stats.clicks,
      compact: true,
      icon: Zap,
      iconColor: 'text-cta-orange',
      iconBg: 'bg-cta-orange/10 border-cta-orange/20',
      suffix: '+',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:grid-cols-1">
        {statCards.map(({ label, sublabel, value, compact, icon: Icon, iconColor, iconBg, suffix }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-graphite-900 p-4 text-left transition-all duration-300 hover:border-white/10 hover:bg-graphite-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${iconBg}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {label}
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tighter text-offwhite">
                <StatValue value={value} compact={compact} />
              </span>
              {suffix && <span className="text-lg font-black text-neutral-600">{suffix}</span>}
            </div>
            <div className="mt-1 text-[10px] text-neutral-500 font-medium">{sublabel}</div>
          </div>
        ))}
      </div>

      {/* Methodology trust note */}
      <div className="flex items-center gap-2 px-1">
        <ShieldCheck className="w-3 h-3 text-trust-blue flex-shrink-0" aria-hidden="true" />
        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600 leading-tight">
          Human-edited rankings.<br />
          <Link href="/methodology" className="text-trust-blue hover:text-offwhite transition-colors underline underline-offset-2">
            See methodology
          </Link>
        </p>
      </div>
    </div>
  );
}