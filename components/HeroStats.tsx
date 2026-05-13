'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Star, TrendingUp, Zap } from 'lucide-react';

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
    <div className="mt-12 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, sublabel, value, compact, icon: Icon, iconColor, iconBg, suffix }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-card border border-white/[0.07] bg-graphite-800 p-5 text-left shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Subtle background glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl pointer-events-none" aria-hidden="true" />

            <div className={`mb-4 inline-flex items-center justify-center w-9 h-9 rounded-inner border ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
            </div>

            <div className="text-2xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">
              {label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-offwhite">
                <StatValue value={value} compact={compact} />
              </span>
              {suffix && <span className="text-2xl font-black text-neutral-500">{suffix}</span>}
            </div>
            <div className="mt-1 text-xs text-neutral-600">{sublabel}</div>
          </div>
        ))}
      </div>

      {/* Methodology trust note */}
      <div className="flex items-center justify-center gap-2 py-2">
        <ShieldCheck className="w-3.5 h-3.5 text-trust-blue flex-shrink-0" aria-hidden="true" />
        <p className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
          Human-edited rankings · AI-assisted data aggregation only ·{' '}
          <a href="/methodology" className="text-trust-blue hover:text-offwhite transition-colors underline underline-offset-2">
            See full methodology
          </a>
        </p>
      </div>
    </div>
  );
}