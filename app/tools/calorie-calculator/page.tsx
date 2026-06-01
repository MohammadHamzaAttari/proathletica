import { buildMetadata } from '@/lib/seo/metadata';
import PerformanceCalculator from '@/components/PerformanceCalculator';
import { Calculator, Zap, ShieldCheck } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Daily Calorie & Performance Calculator — ProAthletica',
  description: 'Calculate your daily maintenance calories (TDEE) and basal metabolic rate (BMR) using the data-verified Mifflin-St Jeor equation. Free athletic performance tools.',
  canonical: '/tools/calorie-calculator',
});

export default function CalorieCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-8">
      {/* Header */}
      <div className="mb-16 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-trust-blue/20 bg-trust-blue/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-trust-blue">
          <Zap className="w-3.5 h-3.5" />
          Athletic Performance Tools
        </div>
        <h1 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
          Performance <br /><span className="text-data-lime">Calculator.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-neutral-400">
          Optimize your nutrition and training with high-precision athletic tools. Our calculators use peer-reviewed formulas to help you reach your goals faster.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Main Calculator */}
        <div className="lg:col-span-3">
          <PerformanceCalculator />
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-trust-blue/10 text-trust-blue">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">Why it matters</h3>
            <p className="text-sm leading-relaxed text-neutral-500">
              Understanding your Total Daily Energy Expenditure (TDEE) is the baseline for any physique or performance goal. Whether you are cutting for speed or bulking for strength, data-first nutrition starts here.
            </p>
          </div>

          <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-data-lime/10 text-data-lime">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">The Standard</h3>
            <p className="text-sm leading-relaxed text-neutral-500">
              Unlike generic calculators, we utilize the Mifflin-St Jeor equation—verified through clinical comparison to be the most accurate predictor of resting metabolic rate in the 21st century.
            </p>
          </div>

          <div className="p-6 border border-white/[0.06] rounded-card bg-neutral-900/40">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Coming Soon</h4>
            <ul className="space-y-3">
              {['1RM Strength Tracker', 'Macro Distribution Tool', 'Wilks Score Calculator'].map(tool => (
                <li key={tool} className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <div className="w-1 h-1 rounded-full bg-neutral-700" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
