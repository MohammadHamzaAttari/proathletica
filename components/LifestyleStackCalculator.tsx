'use client';

import { useState, FormEvent } from 'react';
import { Check, ArrowRight, ShieldCheck, Trophy, Sparkles, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface StackItem {
  id: string;
  asin: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceCents: number;
  image: string;
  description: string;
  reason: string;
  affiliateUrl: string;
  isPartner: boolean;
  commissionRate: string;
}

interface LifestyleStackProps {
  slug: string;
  title: string;
  subtitle: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  items: StackItem[];
}

export function LifestyleStackCalculator({ stack }: { stack: LifestyleStackProps }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(stack.items.map(item => item.id));
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      // Keep at least one item selected
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const totalCents = stack.items
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.priceCents, 0);

  const selectedItemsCount = selectedIds.length;

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribeStatus('loading');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get('hp') || '');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `stack:${stack.slug}`,
          hp: honeypot
        }),
      });
      if (!response.ok) throw new Error('Failed');
      setSubscribeStatus('success');
      setEmail('');
      form.reset();
    } catch {
      setSubscribeStatus('error');
    }
  }

  // Handle mass redirect to select checkout links
  const handleCheckout = () => {
    // Open first link in current tab, others in new tabs
    const selected = stack.items.filter(item => selectedIds.includes(item.id));
    if (selected.length === 0) return;

    selected.forEach((item, index) => {
      const trackUrl = `/api/track?productId=${encodeURIComponent(item.asin)}&articleSlug=stack-${stack.slug}&rank=${index + 1}`;
      if (index === 0) {
        window.open(trackUrl, '_blank');
      } else {
        setTimeout(() => {
          window.open(trackUrl, '_blank');
        }, index * 400); // Stagger popup blockers
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* ── STACK LIST (2 cols) ── */}
      <div className="lg:col-span-2 space-y-4" role="list">
        {stack.items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              role="listitem"
              className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? `bg-graphite-800 border-[#C6FF3D]/40 shadow-[0_0_20px_rgba(198,255,61,0.03)]`
                  : 'bg-graphite-900 border-white/[0.04] opacity-70 hover:opacity-90 hover:border-white/10'
              }`}
            >
              {/* Checkbox Trigger */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#C6FF3D] border-[#C6FF3D] text-black'
                    : 'border-white/20 bg-black/40'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                </div>
              </div>

              <div className="flex gap-4 items-start pr-8">
                {/* Product mini icon/image placeholder */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <span className="text-sm font-black text-neutral-600">PA</span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[10px] font-bold text-trust-blue uppercase tracking-widest">{item.brand}</span>
                    <span className="text-2xs text-neutral-500">•</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.category}</span>
                    {item.isPartner && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-500 border border-amber-500/20">
                        ⭐ DIRECT PARTNER
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-bold text-offwhite pr-4 leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-white/[0.04] mt-2 text-[11px] leading-relaxed text-[#C6FF3D] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C6FF3D]" />
                    <span><strong>LAB RATIONALE:</strong> {item.reason}</span>
                  </div>
                </div>
              </div>

              {/* Price row */}
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-between items-center text-xs">
                <span className="text-neutral-500 uppercase tracking-widest font-bold">Est. Price</span>
                <span className={`font-black text-sm ${isSelected ? 'text-[#C6FF3D]' : 'text-neutral-400'}`}>
                  {formatPrice(item.priceCents)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CALCULATOR & LEAD MAGNET (1 col) ── */}
      <div className="space-y-6">
        {/* Total Checkout Card */}
        <div className="rounded-3xl border border-white/[0.06] bg-graphite-800 p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C6FF3D]" />
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#C6FF3D]/[0.01] rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C6FF3D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#C6FF3D] border border-[#C6FF3D]/25">
              <Trophy className="w-3 h-3" /> HYBRID LIFESTYLE BUNDLE
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
              Consolidated Checkout
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Consolidate checkout across budget Amazon links and direct specialty brand programs with a single click.
            </p>
          </div>

          <div className="space-y-3 py-4 border-y border-white/5">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Items Selected:</span>
              <span className="font-bold text-white tabular-nums">{selectedItemsCount} of {stack.items.length}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Stack Total:</span>
              <span className="text-3xl font-black text-[#C6FF3D] tabular-nums">
                {formatPrice(totalCents)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6FF3D] hover:bg-[#b3f024] py-4 text-center text-xs font-black uppercase tracking-widest text-black transition duration-300 shadow-xl"
          >
            ORDER SELECTED ITEMS <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="flex flex-col gap-1.5 pl-1">
            <span className="text-[9px] text-[#C6FF3D] font-bold uppercase tracking-widest flex items-center gap-1">
              ⚡ SAVINGS ADVANTAGE: Direct rates bypass intermediate retail markups
            </span>
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
              ✓ INDEPENDENT: Vetted by Athletica Labs — no sponsored bias
            </span>
          </div>
        </div>

        {/* Dynamic Lead Magnet (Lead Gen / Newsletter) */}
        <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-graphite-800 to-graphite-900 p-6 space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cta-orange/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cta-orange/10 border border-cta-orange/20 mb-1">
              <Mail className="w-4 h-4 text-cta-orange" />
            </div>
            <h4 className="text-base font-black uppercase tracking-tight text-white">
              Email Me My Stack
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              Get this customized shopping list sent straight to your email along with **private price-drop deal alerts** for these models.
            </p>
          </div>

          {subscribeStatus === 'success' ? (
            <div className="rounded-2xl bg-savings-green/5 border border-savings-green/20 p-4 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-savings-green mx-auto" />
              <h5 className="text-sm font-bold text-white">Stack List Sent!</h5>
              <p className="text-2xs text-neutral-400 leading-relaxed">
                Check your inbox within 5 minutes. We also sent your temporary Deal Alert activation link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-2.5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-3 text-xs text-offwhite placeholder:text-neutral-600 focus:border-cta-orange/50 focus:outline-none transition"
                  aria-label="Email address"
                />
              </div>
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] top-auto h-px w-px opacity-0" aria-hidden="true" />
              
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="w-full py-3 rounded-xl bg-graphite-950 hover:bg-black border border-white/5 hover:border-white/10 text-xs font-black uppercase tracking-wider text-neutral-300 hover:text-white transition disabled:opacity-60"
              >
                {subscribeStatus === 'loading' ? 'Sending Stack...' : 'SEND MY STACK'}
              </button>
            </form>
          )}

          {subscribeStatus === 'error' && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Submission failed. Try again.
            </p>
          )}

          <p className="text-[8px] text-neutral-600 uppercase tracking-widest text-center">
            As an Amazon Associate we earn from qualifying purchases · No affiliate links in emails
          </p>
        </div>
      </div>
    </div>
  );
}
