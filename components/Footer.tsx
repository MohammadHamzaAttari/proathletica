'use client';

import Link from 'next/link';
import { Dumbbell, ExternalLink } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/config';

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
  { href: '/categories', label: 'Best of 2026' },
  { href: '/compare', label: 'Compare Products' },
  { href: '/contact', label: 'Contact' },
  { href: '/disclosure', label: 'Affiliate Disclosure' },
];

const TOOL_LINKS = [
  { href: '/tools/calorie-calculator', label: 'Calorie Calculator' },
  { href: '/search', label: 'Search Gear' },
  { href: '/sitemap.xml', label: 'XML Sitemap' },
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
            {/* Social profiles (Audit v2 Med #6) */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Follow ProAthletica on Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Follow ProAthletica on Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://pinterest.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Follow ProAthletica on Pinterest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 7c2.2 0 4 1.8 4 4 0 1.1-.4 2.1-1.1 2.8-.7.7-1.7 1.2-2.9 1.2s-2.2-.5-2.9-1.2c-.7-.7-1.1-1.7-1.1-2.8 0-2.2 1.8-4 4-4z"/><path d="M12 17v-4"/></svg>
              </a>
            </div>
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

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-offwhite">Tools</h3>
            <nav aria-label="Footer tools navigation">
              <ul className="space-y-2.5">
                {TOOL_LINKS.map(({ href, label }) => (
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
