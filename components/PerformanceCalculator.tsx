'use client';

import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

export default function CalorieCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<string>('1.2');
  const [result, setResult] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    setResult(Math.round(bmr * act));
  };

  return (
    <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-data-lime/10 text-data-lime">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Daily Calorie Needs</h2>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Mifflin-St Jeor Equation</p>
        </div>
      </div>

      <form onSubmit={calculate} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Gender</label>
            <div className="flex p-1 rounded-lg bg-graphite-900 border border-white/5">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${gender === 'male' ? 'bg-data-lime text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${gender === 'female' ? 'bg-data-lime text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                Female
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
              className="w-full h-11 bg-graphite-900 border border-white/5 rounded-lg px-4 text-sm text-white focus:border-data-lime/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="kg"
              className="w-full h-11 bg-graphite-900 border border-white/5 rounded-lg px-4 text-sm text-white focus:border-data-lime/50 focus:outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="cm"
              className="w-full h-11 bg-graphite-900 border border-white/5 rounded-lg px-4 text-sm text-white focus:border-data-lime/50 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full h-11 bg-graphite-900 border border-white/5 rounded-lg px-4 text-sm text-white focus:border-data-lime/50 focus:outline-none appearance-none"
          >
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
            <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
            <option value="1.9">Extra active (very hard exercise & physical job)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-data-lime text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-glow-lime hover:scale-[1.02] active:scale-95 transition-all"
        >
          Calculate Maintenance Calories
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 rounded-2xl bg-data-lime/10 border border-data-lime/20 text-center animate-in fade-in zoom-in duration-300">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-data-lime mb-2">Your Maintenance Calories</div>
          <div className="text-5xl font-black text-white mb-2">{result}</div>
          <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Calories / Day</div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
        <div className="flex gap-3">
          <Info className="w-4 h-4 text-trust-blue shrink-0" />
          <p className="text-[10px] leading-relaxed text-neutral-500 uppercase font-bold tracking-tight">
            This calculator uses the Mifflin-St Jeor equation, considered the most accurate for estimating BMR in healthy adults. Results are estimates only.
          </p>
        </div>
      </div>
    </div>
  );
}
