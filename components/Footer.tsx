'use client';

import Link from 'next/link';
import { Dumbbell, ExternalLink, ArrowRight } from 'lucide-react';
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
      <div className="border-b border-white/[0.04] py-8 bg-white/[0.01]">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
            <span className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-data-lime/10 text-data-lime text-[8px]">✓</div>
              Independent rankings
            </span>
            <span className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-data-lime/10 text-data-lime text-[8px]">✓</div>
              No paid placements
            </span>
            <span className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-data-lime/10 text-data-lime text-[8px]">✓</div>
              Prices updated daily
            </span>
            <span className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-data-lime/10 text-data-lime text-[8px]">✓</div>
              Amazon Associate disclosed
            </span>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-site py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="ProAthletica homepage">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-data-lime to-[#A8E600] text-black shadow-[0_0_20px_rgba(198,255,61,0.3)]">
                <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-black uppercase italic tracking-tight text-offwhite">
                Pro<span className="text-gradient-lime not-italic">Athletica</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Independent fitness gear rankings built on real customer data, verified specs, and honest tradeoffs — not paid placements.
            </p>

            {/* Social profiles */}
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-data-lime transition-colors" aria-label="Follow ProAthletica on Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-data-lime transition-colors" aria-label="Follow ProAthletica on Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://pinterest.com/proathletica" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-data-lime transition-colors" aria-label="Follow ProAthletica on Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 7c2.2 0 4 1.8 4 4 0 1.1-.4 2.1-1.1 2.8-.7.7-1.7 1.2-2.9 1.2s-2.2-.5-2.9-1.2c-.7-.7-1.1-1.7-1.1-2.8 0-2.2 1.8-4 4-4z"/><path d="M12 17v-4"/></svg>
              </a>
            </div>

            {/* E-E-A-T signal */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm">
              <span className="text-data-lime text-sm">🔬</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Data-Verified by Athletica Lab</span>
            </div>
            {/* Amazon disclosure — FTC required */}
            <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
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
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-offwhite">Get in Touch</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-trust-blue transition-colors duration-150"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover:bg-trust-blue/10 transition-colors">
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </div>
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                className="block text-left text-[11px] font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors duration-150"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
              >
                Cookie preferences
              </button>
            </div>

            {/* Quick search CTA */}
            <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-data-lime/20 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Looking for gear?</p>
              <Link
                href="/search"
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 text-xs font-black uppercase tracking-tighter text-offwhite group-hover:bg-data-lime group-hover:text-black transition-all"
              >
                Search All
                <ArrowRight className="w-4 h-4" />
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
