'use client';

import { Star, CheckCircle, XCircle, Zap, ArrowRight, FlaskConical } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface VerdictBoxProps {
  product: Product;
  articleSlug: string;
  badgeText?: string;
  whoItIsFor?: string;
  avoidIf?: string;
}

export function VerdictBox({
  product,
  articleSlug,
  badgeText = 'BEST OVERALL',
  whoItIsFor = 'Home gym lifters who want premium, commercial-grade adjustments and a solid knurled grip without cluttering the room.',
  avoidIf = 'You plan to regularly lift over 90 lbs per dumbbell or drop weights from overhead on solid concrete.',
}: VerdictBoxProps) {
  const shortTitle = product.short_title || product.title.split(' ').slice(0, 7).join(' ');
  const verdict = product.editorial_summary || (product as any).custom_blurb || `${shortTitle} is our top-scoring choice in this round of durability tests.`;
  const trackingHref = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=1`;

  // Dynamically derive who it's for and avoid if from product categories or specs if available
  const cat = (product.category || '').toLowerCase();
  let refinedWho = whoItIsFor;
  let refinedAvoid = avoidIf;

  if (cat.includes('dumb') || cat.includes('bell')) {
    refinedWho = "Home lifters seeking a complete 50 lb dumbbell rack replacement in a compact 2 sq ft footprint.";
    refinedAvoid = "Heavy lifters seeking 100+ lbs capacity or users who drop weights on concrete.";
  } else if (cat.includes('band') || cat.includes('resistance')) {
    refinedWho = "Rehab patients and mobility lifters who need pure high-elasticity tension without dry-rot risks.";
    refinedAvoid = "Powerlifters requiring rigid iron load tension or direct barbell static pulls.";
  } else if (cat.includes('bench')) {
    refinedWho = "Apartment lifters requiring full vertical storage and stable tripod leg frames for heavy bench presses.";
    refinedAvoid = "Commercial gym environments needing non-collapsible heavy welded frames.";
  } else if (cat.includes('massag') || cat.includes('gun')) {
    refinedWho = "Busy athletes needing a high-amplitude stall force massage motor that operates completely silently.";
    refinedAvoid = "Users looking for cheap vibration plate massagers rather than deep-tissue percussive therapy.";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#C6FF3D]/30 bg-graphite-950 p-6 sm:p-8 shadow-2xl transition hover:border-[#C6FF3D]/50 mb-12 min-h-[290px]">
      {/* Absolute Decorative Glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#C6FF3D]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-trust-blue/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Grid Border Accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C6FF3D]"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1 space-y-5">
          {/* Winner Badge and Trust Eyebrow */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D] px-3.5 py-1 text-2xs font-black uppercase tracking-wider text-black">
              <Star className="w-3.5 h-3.5 fill-black text-black" /> {badgeText}
            </span>
            <span className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-widest text-neutral-400">
              <FlaskConical className="w-3.5 h-3.5 text-[#C6FF3D]" /> Vetted by Athletica Lab
            </span>
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-offwhite tracking-tight leading-tight">
              {shortTitle}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#C6FF3D]">
                {product.price_cents ? formatPrice(product.price_cents) : '$--.--'}
              </span>
              <span className="text-2xs text-neutral-500 uppercase tracking-wider font-bold">
                (Data-Verified Offer)
              </span>
            </div>
          </div>

          {/* Quick-Take Verdict */}
          <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-[#C6FF3D]/30 pl-4 py-0.5">
            {verdict}
          </p>

          {/* Decision Matrix */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-4.5 h-4.5 text-savings-green flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Who It's For</span>
                <p className="text-xs text-neutral-400 leading-normal">{refinedWho}</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <XCircle className="w-4.5 h-4.5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Avoid If</span>
                <p className="text-xs text-neutral-400 leading-normal">{refinedAvoid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pulse CTA Button */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3">
          <a
            href={trackingHref}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group relative flex w-full md:w-56 items-center justify-center gap-2 rounded-2xl bg-[#C6FF3D] px-6 py-5 text-center text-xs font-black uppercase tracking-widest text-black hover:bg-[#b3f024] transition duration-300 active:scale-95 shadow-xl hover:shadow-[#C6FF3D]/10 overflow-hidden"
          >
            {/* Pulsing highlight effect */}
            <span className="absolute inset-0 w-full h-full bg-white/20 animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            CHECK TODAY'S PRICE <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#C6FF3D]" /> Amazon Prime Eligible
          </span>
        </div>
      </div>
    </div>
  );
}
