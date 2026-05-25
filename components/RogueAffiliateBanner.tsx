'use client';

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Trophy, Truck, Percent, Info } from 'lucide-react';
import { FORCE_AMAZON_ONLY } from '@/lib/config';

interface RogueProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  ctaUrl: string;
  badge: string;
  tagline: string;
}

const ROGUE_PRODUCTS: RogueProduct[] = [
  {
    id: 'rogue-adjustable-bench-3',
    name: 'Rogue Adjustable Bench 3.0',
    price: 595,
    tagline: 'The Undisputed Commercial-Grade Bench',
    description: 'Engineered with a rock-solid 3x3" 11-gauge steel frame, this bench features 10 back pad positions and 3 seat positions with virtually zero gap. Perfect for powerlifting, dumbbell work, and heavy home training.',
    features: [
      '3x3" 11-Gauge USA Steel Frame',
      '10 Back Pad & 3 Seat Positions',
      'Premium Textured Non-Slip Pad',
      'Adjustment-Gap Virtually Removed'
    ],
    ctaUrl: '/api/track?productId=rogue-adjustable-bench-3&articleSlug=homepage-banner&rank=1',
    badge: '👑 editor\'s elite pick'
  },
  {
    id: 'rogue-monster-bands',
    name: 'Rogue Monster Bands',
    price: 45,
    tagline: 'Commercial Latex Strength & Mobility Bands',
    description: 'Heavy-duty natural latex bands designed for resistance training, pull-up assistance, and dynamic mobility work. Engineered to withstand massive stretching without losing tension or cracking.',
    features: [
      '100% Pure Natural Latex',
      'Color-Coded Resistance levels',
      'Superior Tear & Snap Resistance',
      'Dynamic Mobility & Powerlifting'
    ],
    ctaUrl: '/api/track?productId=rogue-monster-bands&articleSlug=homepage-banner&rank=2',
    badge: '🔥 best seller'
  }
];

export function RogueAffiliateBanner() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showDisclosure, setShowDisclosure] = useState<boolean>(false);

  const activeProduct = ROGUE_PRODUCTS[activeTab];

  return (
    <section 
      className="relative overflow-hidden rounded-card border border-red-500/10 bg-gradient-to-b from-[#130607] to-[#1A0B0C] p-6 sm:p-10 transition-all duration-500 hover:border-red-500/20 hover:shadow-[0_0_50px_rgba(210,31,60,0.08)]"
      style={{
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Decorative Brand Background Glow */}
      <div 
        className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#D21F3C]/[0.03] rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Banner Copy / Left Side */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Rogue Red Brand Tag */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill border border-[#D21F3C]/20 bg-[#D21F3C]/[0.08] text-xs font-black tracking-widest text-[#FF4D66] uppercase animate-pulse">
              <Trophy className="w-3 h-3 text-[#FF4D66]" />
              {FORCE_AMAZON_ONLY ? 'Top Recommended Alternative' : 'Official Brand Partner'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill border border-white/5 bg-white/[0.03] text-2xs font-semibold text-neutral-400 uppercase">
              {FORCE_AMAZON_ONLY ? 'Amazon Associates Pick' : 'Rogue Fitness Direct'}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-offwhite leading-none">
              ROGUE FITNESS <br />
              <span className="text-[#FF4D66]">LEGENDARY STRENGTH GEAR</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              We test home gym gear for a living, and Rogue represents the gold standard of durability. Buy once, train forever. Clicks support our independent lab via safe direct affiliate cookies.
            </p>
          </div>

          {/* Interactive Toggle Tabs */}
          <div className="flex flex-wrap gap-2.5 p-1 bg-black/40 rounded-card border border-white/5 max-w-md">
            {ROGUE_PRODUCTS.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 min-w-[140px] py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab === idx
                    ? 'bg-[#D21F3C] text-white shadow-[0_4px_12px_rgba(210,31,60,0.3)]'
                    : 'text-neutral-400 hover:text-offwhite hover:bg-white/[0.03]'
                }`}
              >
                {prod.name.replace('Rogue ', '')}
              </button>
            ))}
          </div>

          {/* Partner Payout & Transparency Highlights */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-6 max-w-lg">
            <div className="flex gap-2.5 items-start">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                <Truck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-offwhite uppercase">Safe Referral</h4>
                <p className="text-2xs text-neutral-500">Secure cookie logs tracking for up to 30 days.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FF4D66]/10 border border-[#FF4D66]/25">
                <Percent className="w-4 h-4 text-[#FF4D66]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-offwhite uppercase">Verified Alternate</h4>
                <p className="text-2xs text-neutral-500">
                  {FORCE_AMAZON_ONLY ? 'Redirected to Amazon top choice' : 'Direct partnership pays 5% commission'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Showcase Card / Right Side */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="relative group/card overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1F0E0F] p-6 transition-all duration-500 hover:border-[#D21F3C]/40 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D21F3C]/[0.08] rounded-full blur-2xl pointer-events-none" />
            
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-2.5 py-0.5 rounded-lg border border-red-500/20 bg-red-500/10 text-[10px] font-black uppercase tracking-wider text-[#FF4D66]">
                {activeProduct.badge}
              </span>
              <div className="text-lg font-black text-offwhite bg-[#D21F3C] px-2.5 py-0.5 rounded-md shadow-sm">
                ${activeProduct.price}
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-black text-offwhite uppercase tracking-tight">
                {activeProduct.name}
              </h3>
              <p className="text-xs font-semibold text-red-400 uppercase">
                {activeProduct.tagline}
              </p>
            </div>

            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              {activeProduct.description}
            </p>

            {/* Bullet points */}
            <ul className="space-y-2 mb-6" role="list">
              {activeProduct.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-2xs text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Affiliate CTA Action */}
            <div className="space-y-3">
              <a
                href={activeProduct.ctaUrl}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-[#D21F3C] hover:text-white transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_20px_rgba(210,31,60,0.3)]"
              >
                <span>{FORCE_AMAZON_ONLY ? 'Check Price on Amazon' : 'Order from Rogue Fitness'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Disclosure Toggle */}
              <button 
                onClick={() => setShowDisclosure(!showDisclosure)}
                className="flex items-center justify-center gap-1 mx-auto text-2xs font-semibold text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-wider"
              >
                <Info className="w-3 h-3" />
                <span>Affiliate details &amp; rules</span>
              </button>
            </div>

            {/* Rules and Requirements drawer inside the card */}
            {showDisclosure && (
              <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/5 text-[10px] text-neutral-400 leading-relaxed space-y-2 animate-fadeIn">
                <p className="font-bold text-offwhite uppercase tracking-wider text-2xs text-red-400">
                  Amazon &amp; Partner Program Disclosure
                </p>
                <p>
                  <strong>How does it work?</strong> Clicking redirects you to the Amazon equivalent or the partner page. Secure cookies log referrals for up to 30 days to support our independent lab tests.
                </p>
                <p>
                  <strong>100% Secure Checkout:</strong> Direct checkout on Amazon guarantees rapid, secure delivery, standard return policies, and maximum customer buyer safety.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
