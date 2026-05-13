'use client';

import { FormEvent, useState } from 'react';
import { Mail, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

const LEAD_MAGNETS: Record<string, { headline: string; subline: string; benefit: string; cta: string }> = {
  'homepage-inline': {
    headline: 'Free Home Gym Planner',
    subline: 'Get our 1-page cheat sheet — gear combos under $300, $600, and $1,000 for any apartment size.',
    benefit: '🏋️ Trusted by 4,200+ home gym builders',
    cta: 'Send Me the Planner',
  },
  'homepage-bottom': {
    headline: 'Weekly Deal Alerts',
    subline: 'Price drops, new rankings, and gear we\'re actually testing — straight to your inbox. No spam.',
    benefit: '📬 Unsubscribe anytime, takes 5 seconds',
    cta: 'Get Deal Alerts',
  },
  'exit-intent': {
    headline: 'Wait! Don\'t Buy the Wrong Gear.',
    subline: 'Download our "5 Gear Mistakes" PDF and the $250 Apartment Gym Blueprint before you spend a dime.',
    benefit: '🔥 Used by 4,200+ athletes to save $500+',
    cta: 'Send Me the Blueprint',
  },
  'default': {
    headline: 'Free Home Gym Planner',
    subline: 'The exact gear combos our lab recommends for every budget. Used by 4,200+ readers.',
    benefit: '🔒 We never share your email. Ever.',
    cta: 'Get Free Planner',
  },
};

/**
 * Newsletter + Lead Magnet component.
 * NOTE: No affiliate links in emails — Amazon TOS compliance.
 */
export function Newsletter({ source = 'inline' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const copy = LEAD_MAGNETS[source] ?? LEAD_MAGNETS['default'];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get('hp') || '');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, hp: honeypot }),
      });
      if (!response.ok) throw new Error('Failed');
      setStatus('success');
      setEmail('');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <section className="rounded-card border border-savings-green/20 bg-savings-green/5 p-8 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-savings-green" />
          </div>
          <h2 className="text-2xl font-black text-offwhite">You&apos;re in!</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Check your inbox — your free planner is on its way. If it doesn&apos;t arrive in 5 minutes, check spam.
          </p>
          <p className="text-2xs text-neutral-600 uppercase tracking-widest font-bold">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-card border border-white/[0.06] bg-gradient-to-br from-graphite-800 to-graphite-900 p-8">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cta-orange/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-data-lime/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl space-y-6 text-center">
        {/* Icon + eyebrow */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cta-orange/10 border border-cta-orange/20">
            <Gift className="w-5 h-5 text-cta-orange" aria-hidden="true" />
          </div>
          <div className="editorial-badge editorial-badge--bestseller">
            Free Resource
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-offwhite leading-tight">
            {copy.headline}
          </h2>
          <p className="mt-3 text-neutral-400 leading-relaxed max-w-lg mx-auto">
            {copy.subline}
          </p>
        </div>

        {/* Social proof */}
        <p className="text-sm font-semibold text-data-lime">{copy.benefit}</p>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" aria-hidden="true" />
            <input
              type="email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-btn border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm text-offwhite placeholder:text-neutral-600 focus:border-cta-orange/50 focus:outline-none focus:ring-1 focus:ring-cta-orange/30 transition"
              aria-label="Your email address"
            />
          </div>
          {/* Honeypot — bots fill this, humans don't */}
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] top-auto h-px w-px opacity-0" aria-hidden="true" />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="cta-primary w-auto min-h-[3rem] px-6 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending...
              </span>
            ) : copy.cta}
          </button>
        </form>

        {status === 'error' && (
          <p className="flex items-center justify-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-2xs text-neutral-600 uppercase tracking-[0.15em] font-bold">
          As an Amazon Associate we earn from qualifying purchases · No affiliate links in emails
        </p>
      </div>
    </section>
  );
}
