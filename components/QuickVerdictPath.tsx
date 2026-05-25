'use client';

import type { Product } from '@/lib/types';
import { HelpCircle, Zap, Banknote, Home, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface QuickVerdictPathProps {
  products: Product[];
}

export function QuickVerdictPath({ products }: QuickVerdictPathProps) {
  if (!products || products.length < 2) return null;

  // Derive target items programmatically
  const bestPick = products[0];
  
  // Find a value/budget candidate (typically position 1 or lowest price)
  const budgetPick = products.find(
    (p, idx) => idx > 0 && typeof p.price_cents === 'number' && p.price_cents <= 15000
  ) || products[1] || products[0];

  // Find a space-saving candidate (based on footprint specs, category, or third position)
  const spaceSaverPick = products.find(
    (p, idx) =>
      idx > 0 &&
      ((p.specs?.footprint || '').toLowerCase().includes('sq ft') ||
        (p.specs?.storage || '').toLowerCase().includes('fold') ||
        p.category.toLowerCase().includes('resistance') ||
        p.category.toLowerCase().includes('bench'))
  ) || products[2] || products[1] || products[0];

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="border border-white/[0.06] bg-graphite-950 p-6 rounded-3xl shadow-xl relative overflow-hidden mb-12">
      {/* Background glow strip */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-trust-blue via-[#C6FF3D] to-[#A8E600]" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative z-10">
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#C6FF3D] bg-[#C6FF3D]/10 px-2.5 py-1 rounded-md border border-[#C6FF3D]/20 inline-flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#C6FF3D]" /> BUYER&apos;S PARADOX RESOLVER
          </span>
          <h3 className="text-xl font-black uppercase tracking-tight text-offwhite">
            Which setup matches your goal?
          </h3>
          <p className="text-xs text-neutral-400">
            Skip the 3,000-word analysis. Choose a target criteria to jump directly to your lab-vetted match.
          </p>
        </div>

        {/* Action Decision Buttons */}
        <div className="grid sm:grid-cols-3 gap-3.5 w-full lg:w-auto">
          {/* Best Overall */}
          <button
            onClick={() => handleScroll('product-pick-0')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-[#C6FF3D]/40 text-center transition group active:scale-95"
          >
            <Zap className="w-5 h-5 text-[#C6FF3D] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C6FF3D]">⚡ ABSOLUTE BEST</span>
            <span className="text-xs font-bold text-neutral-300 mt-1 line-clamp-1 max-w-[140px]">
              {bestPick.short_title || bestPick.title.split(' ')[0]}
            </span>
          </button>

          {/* Budget */}
          <button
            onClick={() => handleScroll(`product-pick-${products.indexOf(budgetPick) >= 0 ? products.indexOf(budgetPick) : 1}`)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-emerald-500/40 text-center transition group active:scale-95"
          >
            <Banknote className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">💰 BEST BUDGET</span>
            <span className="text-xs font-bold text-neutral-300 mt-1 line-clamp-1 max-w-[140px]">
              {budgetPick.price_cents ? formatPrice(budgetPick.price_cents) : 'Max Value'}
            </span>
          </button>

          {/* Space Saver */}
          <button
            onClick={() => handleScroll(`product-pick-${products.indexOf(spaceSaverPick) >= 0 ? products.indexOf(spaceSaverPick) : 2}`)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-trust-blue/40 text-center transition group active:scale-95"
          >
            <Home className="w-5 h-5 text-trust-blue mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-trust-blue">🏠 SPACE-SAVER</span>
            <span className="text-xs font-bold text-neutral-300 mt-1 line-clamp-1 max-w-[140px]">
              {spaceSaverPick.specs?.footprint || 'Compact footprint'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
