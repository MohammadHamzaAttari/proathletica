'use client';

import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/config';

/**
 * FIX (Audit #05 — Privacy/GDPR): "Manage cookie preferences" link now visible
 * in footer, meeting GDPR requirement for persistent preference access.
 * FIX (Audit #02-A): /data-deletion-request linked from footer for CCPA.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-8">
        <div className="space-y-3">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
            ProAthletica
          </h3>
          <p className="text-sm text-neutral-400">
            Independent fitness gear reviews for athletes who care about real testing, not recycled
            listicles.
          </p>
          <p className="text-xs text-neutral-600">
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>

        <div className="space-y-3 text-sm text-neutral-400">
          <h4 className="font-black uppercase tracking-wider text-white">Company</h4>
          <div className="grid gap-2">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/disclosure" className="hover:text-white">Affiliate Disclosure</Link>
            <Link href="/data-deletion-request" className="hover:text-white">Data deletion</Link>
          </div>
        </div>

        <div className="space-y-3 text-sm text-neutral-400">
          <h4 className="font-black uppercase tracking-wider text-white">Contact</h4>
          <a href={`mailto:${CONTACT_EMAIL}`} className="block text-emerald-400 underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          {/* FIX (Audit #05 — GDPR): persistent cookie preference link */}
          <button
            type="button"
            className="block text-left text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
            onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
          >
            Manage cookie preferences
          </button>
          <Link href="/search" className="block hover:text-white">Search</Link>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} ProAthletica. All rights reserved.
      </div>
    </footer>
  );
}
