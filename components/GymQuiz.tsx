'use client';

import { useState } from 'react';
import { ChevronRight, Home, Target, TrendingUp, Zap, Trophy, Undo2, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    id: 'goal',
    question: 'What is your primary training goal?',
    options: [
      { id: 'strength', label: 'Build Muscle & Strength', icon: TrendingUp, next: 'space' },
      { id: 'endurance', label: 'Fat Loss & Cardio', icon: Zap, next: 'space' },
      { id: 'mobility', label: 'Flexibility & Recovery', icon: Trophy, next: 'space' },
    ],
  },
  {
    id: 'space',
    question: 'How much space do you have for gear?',
    options: [
      { id: 'apartment', label: 'Apartment (Under 30 sq ft)', icon: Home, next: 'budget' },
      { id: 'garage', label: 'Garage / Dedicated Room', icon: Target, next: 'budget' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your starting budget?',
    options: [
      { id: 'budget', label: 'Under $300', next: 'result' },
      { id: 'mid', label: '$300 - $1,000', next: 'result' },
      { id: 'pro', label: '$1,000+', next: 'result' },
    ],
  },
];

const RESULTS: Record<string, { title: string; desc: string; category: string; slug: string }> = {
  'strength-apartment-budget': {
    title: 'The Compact Strength Kit',
    desc: 'Focus on adjustable dumbbells and a folding bench. You can build 90% of your muscle in a corner.',
    category: 'Home Gym Equipment',
    slug: 'home-gym',
  },
  'strength-garage-pro': {
    title: 'The Elite Powerlifting Rack',
    desc: 'You have the space. Go for a full power rack, Olympic bar, and iron plates.',
    category: 'Powerlifting',
    slug: 'powerlifting',
  },
  'endurance-apartment-budget': {
    title: 'The Stealth Cardio Setup',
    desc: 'Focus on high-quality resistance bands and a jump rope. Zero footprint, maximum intensity.',
    category: 'Resistance Training',
    slug: 'resistance-training',
  },
  'mobility-apartment-budget': {
    title: 'The Recovery Station',
    desc: 'A premium massage gun and mobility bands are your best investments.',
    category: 'Recovery Tools',
    slug: 'recovery',
  },
};

export function GymQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isGated, setIsGated] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentStep = STEPS[stepIndex];

  const handleSelect = (optionId: string, next: string) => {
    const newSelections = { ...selections, [currentStep.id]: optionId };
    setSelections(newSelections);

    if (next === 'result') {
      setIsGated(true);
    } else {
      setStepIndex(STEPS.findIndex((s) => s.id === next));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'gear-finder' }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
    setIsGated(false);
    setShowResult(true);
  };

  const reset = () => {
    setStepIndex(0);
    setSelections({});
    setShowResult(false);
    setIsGated(false);
    setEmail('');
  };

  const getResultKey = () => {
    const key = `${selections.goal}-${selections.space}-${selections.budget}`;
    return RESULTS[key] || RESULTS['strength-apartment-budget']; // Default fallback
  };

  if (isGated) {
    return (
      <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 text-center animate-cardIn max-w-xl mx-auto space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-trust-blue/10 border border-trust-blue/20">
          <Mail className="w-8 h-8 text-trust-blue" />
        </div>
        <div className="space-y-2">
          <div className="section-eyebrow">Save Your Match</div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
            Unlock Your Custom Setup
          </h3>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Enter your email to save your personalized home gym blueprint and get exclusive, high-value gear alerts directly in your inbox.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-sm mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] px-4 text-sm text-white placeholder-neutral-500 focus:border-[#C6FF3D] focus:outline-none transition-colors text-center"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#C6FF3D] text-black font-black uppercase tracking-widest text-xs hover:bg-[#b0ec2e] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Unlocking...' : 'Get Recommendations'}
          </button>
        </form>

        <div className="pt-2">
          <button
            onClick={() => {
              setIsGated(false);
              setShowResult(true);
            }}
            className="text-xs font-bold text-neutral-500 hover:text-white uppercase tracking-wider transition-colors hover:underline"
          >
            Skip and view results directly →
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = getResultKey();
    return (
      <div className="rounded-card border border-data-lime/20 bg-graphite-800 p-8 text-center animate-cardIn">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-data-lime/10 border border-data-lime/20">
          <CheckCircle2 className="w-8 h-8 text-data-lime" />
        </div>
        <div className="section-eyebrow mb-2">Your Perfect Match</div>
        <h3 className="text-3xl font-black uppercase tracking-tight text-offwhite mb-4">{result.title}</h3>
        <p className="mx-auto max-w-md text-neutral-400 mb-8 leading-relaxed">
          {result.desc} We&apos;ve ranked the top 10 picks for this exact setup in our {result.category} guide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/category/${result.slug}`} className="cta-primary w-auto px-8">
            See {result.category} Picks
          </Link>
          <button onClick={reset} className="flex items-center justify-center gap-2 text-sm font-bold text-neutral-500 hover:text-white transition-colors">
            <Undo2 className="w-4 h-4" /> Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-white/[0.06] bg-graphite-800 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="section-eyebrow mb-1">Gear Finder</div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-offwhite">
            Find your perfect setup
          </h3>
        </div>
        <div className="text-xs font-black text-neutral-600">
          STEP {stepIndex + 1} OF {STEPS.length}
        </div>
      </div>

      <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.03]">
        <div
          className="h-full bg-data-lime transition-all duration-500"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-bold text-offwhite">{currentStep.question}</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currentStep.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id, option.next)}
              className="group flex flex-col items-center justify-center gap-4 rounded-inner border border-white/[0.06] bg-white/[0.02] p-6 text-center transition-all hover:border-data-lime/30 hover:bg-data-lime/[0.03]"
            >
              {'icon' in option && option.icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] group-hover:bg-data-lime/10 group-hover:text-data-lime transition-colors">
                  <option.icon className="h-6 w-6" />
                </div>
              )}
              <span className="font-bold text-offwhite group-hover:text-data-lime transition-colors">{option.label}</span>
              <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-data-lime group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {stepIndex > 0 && (
        <button
          onClick={() => setStepIndex(stepIndex - 1)}
          className="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
