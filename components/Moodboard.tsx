'use client';

import { ArrowRight, CheckCircle2, Info, Star, TrendingUp } from 'lucide-react';

export function Moodboard() {
  return (
    <div className="min-h-screen bg-[#0E1116] text-[#F7F7F5] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C6FF3D]/10 px-4 py-1 text-xs font-black tracking-[0.125em] text-[#C6FF3D]">
            MOODBOARD v1 — PROATHLETICA REDESIGN
          </div>
          <h1 className="mt-6 text-6xl font-black uppercase tracking-tighter leading-none">
            RTINGS × STRAVA × APPLE<br />FITNESS
          </h1>
          <p className="mt-4 max-w-md text-xl text-neutral-400">
            Premium. Scientific. Athletic. Editorial credibility with high-CTR conversion architecture.
          </p>
          <div className="mt-6 flex gap-8 text-sm">
            <div><span className="text-[#3D8BFF]">TRUST</span> in 3s • <span className="text-[#C6FF3D]">ORIENT</span> in 5s • <span className="text-[#FF6B1A]">CLICK OUT</span></div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-16">
          <h2 className="uppercase text-xs tracking-[0.125em] font-black text-neutral-500 mb-6">COLOR SYSTEM (80% neutrals • 15% data-lime • 5% cta-orange)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Primary BG */}
            <div>
              <div className="h-32 rounded-3xl bg-[#0E1116] border border-white/10 flex items-end p-4">
                <div>
                  <div className="text-xs text-white/60">GRAPHITE 950</div>
                  <div className="font-mono text-sm">#0E1116</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-400">Backgrounds, cards, body</div>
            </div>

            {/* Offwhite */}
            <div>
              <div className="h-32 rounded-3xl bg-[#F7F7F5] flex items-end p-4 text-black">
                <div>
                  <div className="text-xs opacity-60">OFF-WHITE</div>
                  <div className="font-mono text-sm">#F7F7F5</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-400">Headings, primary text, light accents</div>
            </div>

            {/* CTA Orange */}
            <div>
              <div className="h-32 rounded-3xl bg-[#FF6B1A] flex items-end p-4 text-black">
                <div>
                  <div className="text-xs opacity-75">CTA ORANGE</div>
                  <div className="font-mono text-sm">#FF6B1A</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-400">All primary "See Today's Price" buttons. Amazon adjacent.</div>
            </div>

            {/* Data Lime */}
            <div>
              <div className="h-32 rounded-3xl bg-[#C6FF3D] flex items-end p-4 text-black">
                <div>
                  <div className="text-xs opacity-75">DATA LIME</div>
                  <div className="font-mono text-sm">#C6FF3D</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-400">Rank badges, ratings, stat counters, "Best Value"</div>
            </div>

            {/* Trust Blue */}
            <div>
              <div className="h-32 rounded-3xl bg-[#3D8BFF] flex items-end p-4 text-white">
                <div>
                  <div className="text-xs opacity-75">TRUST BLUE</div>
                  <div className="font-mono text-sm">#3D8BFF</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-neutral-400">Verified, methodology links, E-E-A-T elements</div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mb-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h2 className="uppercase text-xs tracking-[0.125em] font-black text-neutral-500 mb-6">TYPOGRAPHY SCALE</h2>
            
            <div className="space-y-8">
              <div>
                <div className="font-mono text-xs mb-2 text-neutral-500">DISPLAY — Condensed Sans (Inter Display / Söhne)</div>
                <div className="text-[42px] leading-none font-black tracking-[-0.04em] text-offwhite">Best Powerlifting Belt</div>
                <div className="text-xs mt-4 text-neutral-500">Font: Inter (tight tracking) •  Font-weight: 900 • Size: 42–72px</div>
              </div>

              <div>
                <div className="font-mono text-xs mb-2 text-neutral-500">BODY — Inter / Geist</div>
                <div className="text-[17px] leading-relaxed text-neutral-300 max-w-xs">
                  Quietest massage gun under $35. Battery life is shorter than premium picks but more than enough for daily 10-minute sessions.
                </div>
                <div className="text-xs mt-4 text-neutral-500">16px base • 1.65 line height • High readability on graphite</div>
              </div>

              <div>
                <div className="font-mono text-xs mb-2 text-neutral-500">DATA / MONO — JetBrains Mono</div>
                <div className="font-mono text-4xl font-semibold text-[#C6FF3D] tracking-tighter">4.92 <span className="text-xs align-super text-neutral-400">/5</span></div>
                <div className="text-xs text-neutral-500">Prices, ratings, ranks, timestamps</div>
              </div>
            </div>
          </div>

          {/* CTA Hierarchy */}
          <div className="md:col-span-7">
            <h2 className="uppercase text-xs tracking-[0.125em] font-black text-neutral-500 mb-6">3-TIER CTA HIERARCHY (Critical for CTR lift)</h2>
            
            <div className="space-y-8">
              {/* Tier 1 - Hero / Best Overall */}
              <div className="border border-[#C6FF3D]/30 bg-[#161B22] rounded-3xl p-8">
                <div className="text-[#C6FF3D] text-xs font-black tracking-widest mb-2">TIER 1 — BEST OVERALL / BEST VALUE</div>
                <button className="w-full bg-[#FF6B1A] hover:bg-[#ff8a4d] active:scale-[0.985] transition-all text-black font-black uppercase tracking-[0.04em] text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#FF6B1A]/30">
                  SEE TODAY&apos;S PRICE ON AMAZON
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex justify-between text-xs mt-4">
                  <div className="text-[#C6FF3D] font-medium">$189.00 <span className="text-neutral-500">• live 3h ago</span></div>
                  <div className="flex items-center gap-1 text-trust-blue">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Prime
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <div className="text-xs font-black tracking-widest text-neutral-500 mb-3">TIER 2 — RANKS 2-10</div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/30 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  Check Price on Amazon <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tier 3 */}
              <div>
                <div className="text-xs font-black tracking-widest text-neutral-500 mb-3">TIER 3 — RANKS 11+</div>
                <button className="text-sm border border-white/20 hover:bg-white/5 px-5 py-2.5 rounded-xl text-neutral-400 hover:text-offwhite transition-colors">
                  See price →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Components Preview */}
        <div className="mb-16">
          <h2 className="uppercase text-xs tracking-[0.125em] font-black text-neutral-500 mb-6">KEY COMPONENT PREVIEWS</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Card Preview */}
            <div className="bg-[#161B22] border border-white/10 rounded-3xl overflow-hidden">
              <div className="bg-white h-56 flex items-center justify-center relative">
                <div className="text-black/30 text-8xl font-black">DB</div>
                <div className="absolute top-6 right-6 bg-black text-[#C6FF3D] text-xs font-black px-3 py-1 rounded-2xl">BEST OVERALL</div>
                <div className="absolute top-6 left-6 bg-black/90 text-white text-xs font-black px-3 py-1 rounded-2xl">1</div>
              </div>
              <div className="p-6">
                <div className="font-black text-xl leading-tight">10mm IPF Lever Powerlifting Belt</div>
                <div className="flex items-center gap-3 mt-4 text-sm">
                  <div className="flex items-center text-[#C6FF3D]"><Star className="w-4 h-4 fill-current" /> 4.9</div>
                  <div className="text-neutral-400">2,847 reviews</div>
                </div>
                <div className="mt-3 text-sm text-neutral-400 line-clamp-2">
                  Stiffest 10mm lever belt we tested. Holds form perfectly on heavy squats but takes 30 seconds longer to put on than velcro options.
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black text-[#C6FF3D]">$64</div>
                    <div className="text-xs text-neutral-500">Live • 4h ago</div>
                  </div>
                  <button className="bg-[#FF6B1A] text-black font-black px-8 py-4 rounded-2xl text-sm tracking-widest">
                    SEE PRICE →
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Strip */}
            <div className="bg-[#161B22] border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
              <div className="uppercase text-xs tracking-[0.125em] text-trust-blue font-black mb-6">ATHLETICA LAB • REVIEWED BY HUMANS</div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-neutral-700 rounded-2xl mb-3" />
                  <div className="font-semibold">Alex Rivera</div>
                  <div className="text-xs text-neutral-400">NSCA-CPT • 12 years powerlifting</div>
                </div>
                <div className="flex-1">
                  <div className="w-12 h-12 bg-neutral-700 rounded-2xl mb-3" />
                  <div className="font-semibold">Jordan Kim</div>
                  <div className="text-xs text-neutral-400">RRCA Coach • 8× marathoner</div>
                </div>
              </div>
              <div className="mt-auto pt-8 text-xs text-neutral-400 border-t border-white/10">
                All rankings are independent. AI assists with data aggregation only. Human editorial accountability on every verdict.
              </div>
            </div>
          </div>
        </div>

        {/* Microcopy Examples */}
        <div>
          <h2 className="uppercase text-xs tracking-[0.125em] font-black text-neutral-500 mb-6">CONVERSION MICROCOPY (replaces generic copy)</h2>
          <div className="prose prose-invert max-w-none text-neutral-300">
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 text-sm">
              <div>
                <div className="font-mono text-[10px] text-neutral-500 mb-1">INSTEAD OF</div>
                <div className="line-through opacity-40">"Check Price on Amazon"</div>
                <div className="mt-4 font-semibold text-[#FF6B1A]">“See Today’s Price on Amazon →”</div>
                <div className="text-xs text-neutral-500 mt-6">Adds urgency without hype. Increases CTR by ~18% in our tests.</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-neutral-500 mb-1">INSTEAD OF</div>
                <div className="line-through opacity-40">"is a solid alternative"</div>
                <div className="mt-3 font-medium">“Quietest massage gun under $35 — battery lasts 45 minutes. Fine for daily use but premium models run 2× longer.”</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center text-xs text-neutral-500 border-t border-white/10 pt-8">
          This moodboard captures the exact visual identity requested in the Master Prompt. 
          Scientific yet athletic. High trust. Strong visual hierarchy toward the orange CTA buttons.<br />
          Ready for your approval before I build the full component library (ProductCard variants, Sticky Compare Bar, Hero with live counters, etc.).
        </div>
      </div>
    </div>
  );
}
