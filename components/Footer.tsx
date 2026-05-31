'use client';

import Link from 'next/link';
import { Dumbbell, ExternalLink, Twitter, Instagram } from 'lucide-react';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/config';

const CATEGORY_LINKS = [
  { href: '/category/home-gym', label: 'Home Gym Equipment' },
  { href: '/category/resistance-training', label: 'Resistance Training' },
  { href: '/category/powerlifting', label: 'Powerlifting' },
  { href: '/category/recovery', label: 'Recovery Tools' },
  { href: '/category/running', label: 'Running Shoes' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Our Methodology' },
  { href: '/best/best-home-gym-equipment-2026', label: 'Best of 2026' },
  { href: '/compare', label: 'Compare Products' },
  { href: '/contact', label: 'Contact' },
  { href: '/disclosure', label: 'Affiliate Disclosure' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/data-deletion-request', label: 'Data Deletion' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#0A0D12]" role="contentinfo">
      {/* Trust strip above footer */}
      <div className="border-b border-white/[0.04] py-5">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
            <span className="flex items-center gap-2">
              <span className="text-savings-green">✓</span>
              Independent rankings
            </span>
            <span className="flex items-center gap-2">
              <span className="text-savings-green">✓</span>
              No paid placements
            </span>
            <span className="flex items-center gap-2">
              <span className="text-savings-green">✓</span>
              Prices updated daily
            </span>
            <span className="flex items-center gap-2">
              <span className="text-savings-green">✓</span>
              Amazon Associate disclosed
            </span>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-site py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="ProAthletica homepage">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-data-lime to-[#A8E600] text-black shadow-glow-lime">
                <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-black uppercase italic tracking-tight text-offwhite">
                Pro<span className="text-gradient-lime not-italic">Athletica</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Independent fitness gear rankings built on real customer data, verified specs, and honest tradeoffs — not paid placements.
            </p>
            {/* E-E-A-T signal */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-trust-blue/20 bg-trust-blue/5 px-3 py-2">
              <span className="text-trust-blue text-xs">🔬</span>
              <span className="text-2xs font-bold uppercase tracking-wider text-trust-blue">Data-Verified by Athletica Lab</span>
            </div>
            {/* Amazon disclosure — FTC required */}
            <p className="text-2xs text-neutral-700 leading-relaxed">
              As an Amazon Associate we earn from qualifying purchases at no extra cost to you.
            </p>
            {/* Social profiles (Audit #04-N) */}
            <div className="flex items-center gap-4 pt-2">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-offwhite transition-colors">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-offwhite transition-colors">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-offwhite transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.398 2.967 7.398 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                <span className="sr-only">Pinterest</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-offwhite">Categories</h3>
            <nav aria-label="Footer category navigation">
              <ul className="space-y-2.5">
                {CATEGORY_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-data-lime transition-colors duration-150"
                    >
                      <span className="text-data-lime/50 text-xs">→</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-offwhite">Company</h3>
            <nav aria-label="Footer company navigation">
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-neutral-500 hover:text-offwhite transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact + Quick Search */}
          <div className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-offwhite">Get in Touch</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-trust-blue hover:text-offwhite transition-colors duration-150"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                className="block text-left text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-150 underline underline-offset-4"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
              >
                Cookie preferences
              </button>
            </div>

            {/* Quick search CTA */}
            <div className="rounded-inner border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-2xs font-bold uppercase tracking-widest text-neutral-600 mb-3">Looking for something specific?</p>
              <Link
                href="/search"
                className="cta-secondary text-xs min-h-[2.5rem]"
              >
                Search All Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] py-5">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-2xs text-neutral-700">
            © {new Date().getFullYear()} ProAthletica. All rights reserved.
          </p>
          <nav aria-label="Legal navigation">
            <ul className="flex items-center gap-4">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-2xs text-neutral-700 hover:text-neutral-400 transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
