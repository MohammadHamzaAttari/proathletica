'use client';

import { FormEvent, useState } from 'react';

/**
 * FIX (Audit #05-10): honeypot field included and sent to /api/subscribe.
 * FIX (Audit #03-A Amazon): welcome email sent by /api/subscribe contains
 * NO affiliate links (Amazon TOS prohibits affiliate links in email).
 */
export function Newsletter({ source = 'inline' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  return (
    <section className="rounded-[2rem] border border-white/5 bg-gradient-to-br from-neutral-900 to-black p-8 text-center">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Insider emails
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white">
          Get the lab reports
        </h2>
        <p className="text-neutral-400">
          Join the list for weekly buyer guides, lab notes, and new deal alerts.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-neutral-600 focus:border-emerald-500"
          />
          {/* FIX (Audit #05-10): honeypot — bots fill this, humans don't */}
          <input
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
            aria-hidden="true"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black uppercase tracking-wider text-black hover:bg-emerald-400 disabled:opacity-60"
          >
            {status === 'loading' ? 'Submitting...' : 'Join now'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-sm text-emerald-400">You&apos;re subscribed. Check your inbox.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
