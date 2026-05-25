'use client';

import { Pin, Share2, Award, Zap, Dumbbell } from 'lucide-react';

interface PinterestFlywheelProps {
  categoryName?: string;
}

export function PinterestFlywheel({ categoryName = 'Adjustable Dumbbells' }: PinterestFlywheelProps) {
  const handleMockSave = () => {
    alert('📌 Pinterest Save Action: Infographic metadata generated for pinning to board! Mock URL: https://pinterest.com/pin/create/button/');
  };

  return (
    <section className="border border-red-500/20 bg-gradient-to-b from-[#180A0E] to-[#0A0D12] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden my-12">
      {/* Red accent line for Pinterest theme */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-pink-600 to-red-500" />
      
      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        
        {/* Infographic Mockup (The Cheat Sheet) */}
        <div className="bg-black/50 border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[380px]">
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b border-white/[0.04]">
            <span className="text-[8px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              Athletica Lab Cheat Sheet
            </span>
            <h4 className="text-lg font-black uppercase tracking-tighter text-white">
              The $500 Ultimate Home Gym
            </h4>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Minimalist footprint • Vetted Durability</p>
          </div>

          {/* Comparison list */}
          <div className="space-y-3.5 py-5 flex-1">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4 text-[#C6FF3D]" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white uppercase">1. Adjustable Dumbbells</p>
                  <p className="text-[9px] text-neutral-500">Replaces 15 traditional dumbbell pairs</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C6FF3D]">$350.00</span>
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white uppercase">2. Complete Band Set</p>
                  <p className="text-[9px] text-neutral-500">For targeted recovery & stabilizer training</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">$45.00</span>
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-trust-blue" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white uppercase">3. Multi-Angle Bench</p>
                  <p className="text-[9px] text-neutral-500">Supports flat, incline, and decline angles</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-trust-blue">$105.00</span>
            </div>
          </div>

          {/* Footer Total */}
          <div className="flex justify-between items-center pt-3 border-t border-white/[0.04] text-xs font-black uppercase tracking-wider">
            <span className="text-neutral-400">Total Setup Budget</span>
            <span className="text-base font-mono font-black text-red-500 animate-pulse">$500.00</span>
          </div>
        </div>

        {/* Informative Side Card / Save Triggers */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
              <Pin className="w-3.5 h-3.5 fill-red-500 stroke-none" /> PINTEREST-CORE UTILITY FLYWHEEL
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
              Adjustable vs Fixed Racks: The Visual Trade-Off
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              Ditching fixed iron dumbbells saves over **200 lbs of dead floor weight** and fits under any standard bed frame. Save this quick budget cheat sheet directly to your gym board for offline reference.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-black/20 border border-white/[0.04] p-3 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#C6FF3D]">✓ Adjustable</p>
              <p className="text-[11px] text-neutral-400 mt-1">Under 2 sq ft footprint. Rapid adjustments in under 3 seconds.</p>
            </div>
            <div className="bg-black/20 border border-white/[0.04] p-3 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">✗ Fixed Rack</p>
              <p className="text-[11px] text-neutral-400 mt-1">Requires 10 sq ft. Costs over $900 with rack welding fees.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleMockSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-600/10"
            >
              <Pin className="w-4 h-4 fill-white stroke-none" /> SAVE TO PINTEREST
            </button>
            <button
              onClick={handleMockSave}
              className="border border-white/10 hover:border-white/20 text-neutral-300 text-xs font-black uppercase tracking-widest px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" /> SHARE IMAGE
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
}
