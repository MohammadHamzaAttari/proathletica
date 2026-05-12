'use client';

import { useEffect, useState } from 'react';
import { initializeAnalytics } from '@/lib/analytics';

const STORAGE_KEY = 'pa-cookie-consent';

/**
 * FIX (Audit #05 — GDPR):
 * - Banner appears immediately (not after 1.5s delay) before any tracking loads
 * - Decline is equally prominent as Accept
 * - Accepts event from footer "Manage cookie preferences"
 * - Analytics initializes ONLY after explicit accept
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) setVisible(true);
    if (value === 'accepted') initializeAnalytics();

    const openPrefs = () => setVisible(true);
    window.addEventListener('open-cookie-preferences', openPrefs);
    return () => window.removeEventListener('open-cookie-preferences', openPrefs);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    initializeAnalytics();
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:max-w-xl">
      <p className="mb-1 text-sm font-black uppercase tracking-wider text-white">
        Cookie preferences
      </p>
      <p className="mb-4 text-sm text-neutral-300">
        We use analytics cookies only after consent. Declining keeps the site fully functional
        without any tracking.
      </p>
      <div className="flex gap-3">
        <button
          onClick={decline}
          className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/5"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-black hover:bg-emerald-400"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
