'use client';

import React, { useState } from 'react';
import { Bell, X, CheckCircle, ShieldCheck } from 'lucide-react';
import type { Product } from '@/lib/types';

interface PriceDropModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceDropModal({ product, isOpen, onClose }: PriceDropModalProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `price-alert:${product.asin || product.id}`,
        }),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#161B22] p-8 shadow-2xl shadow-black/80 animate-cardIn text-center space-y-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="space-y-6 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
                Alert Active!
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto">
                We&apos;ve registered your tracker for <strong className="text-white">{product.short_title || product.title.split(' ').slice(0, 4).join(' ')}</strong>. You will receive an immediate notification if the price drops!
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/20">
              <Bell className="w-8 h-8 text-[#C6FF3D]" />
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6FF3D]">Price Tracker</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
                Track Price Drops
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                Enter your email below. We check prices daily and will alert you the second a discount or deal is detected for this item.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] px-4 text-sm text-white placeholder-neutral-500 focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#C6FF3D] text-black font-black uppercase tracking-widest text-xs hover:bg-[#b0ec2e] disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Setting Alert...' : 'Activate Tracker'}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-black text-neutral-500 uppercase tracking-widest border-t border-white/[0.04] pt-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Spam · Unsubscribe Anytime
            </div>
          </>
        )}
      </div>
    </div>
  );
}
