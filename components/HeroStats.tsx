'use client';

import { useEffect, useMemo, useState } from 'react';

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function CountUp({ value, compact = false }: { value: number; compact?: boolean }) {
  const [current, setCurrent] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCurrent(value);
      return;
    }

    let frame = 0;
    let startTime = 0;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    setCurrent(0);
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, value]);

  const label = useMemo(() => {
    const resolved = current ?? value;
    return compact ? formatCompact(resolved) : resolved.toLocaleString('en-US');
  }, [compact, current, value]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {label}
    </span>
  );
}

export function HeroStats({
  stats,
}: {
  stats: { testedProducts: number; reviews: number; clicks: number };
}) {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-3">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">Tested products</div>
        <div className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#C6FF3D] sm:text-6xl">
          <CountUp value={stats.testedProducts} />
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">Reviews analyzed</div>
        <div className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#C6FF3D] sm:text-6xl">
          <CountUp value={stats.reviews} compact />
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">Clicks tracked</div>
        <div className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#C6FF3D] sm:text-6xl">
          <CountUp value={stats.clicks} compact />
        </div>
      </div>
    </div>
  );
}