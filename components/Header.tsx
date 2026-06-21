import Link from 'next/link';
import { Dumbbell, Search } from 'lucide-react';

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0D12]/90 backdrop-blur-xl"
      role="banner"
    >
      <div className="container-site flex items-center justify-between py-3.5">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-ring rounded-xl"
          aria-label="ProAthletica — go to homepage"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#C6FF3D] to-[#A8E600] text-black shadow-[0_0_16px_rgba(198,255,61,0.35)]">
            <Dumbbell className="h-4.5 w-4.5" aria-hidden="true" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black uppercase italic tracking-tight text-offwhite">
            Pro<span className="text-gradient-lime not-italic">Athletica</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          role="navigation"
          aria-label="Main navigation"
        >
          {[
            { href: '/', label: 'Home' },
            { href: '/categories', label: 'Categories' },
            { href: '/#gear-finder', label: 'Gear Finder' },
            { href: '/methodology', label: 'Methodology' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-sm font-semibold tracking-wide text-neutral-400 hover:text-offwhite hover:bg-white/5 transition-all duration-150 focus-ring"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Bar (Audit #08-B) */}
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search gear..."
              aria-label="Search gear"
              className="h-9 w-48 rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-4 text-xs font-semibold text-offwhite placeholder:text-neutral-600 focus:border-trust-blue/50 focus:bg-white/[0.08] focus:outline-none transition-all"
            />
          </div>

          {/* Mobile/Tablet Search Icon */}
          <Link
            href="/search"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:text-offwhite focus-ring"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* Disclosure link — subtle trust signal */}
          <Link
            href="/disclosure"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all duration-150 focus-ring"
            aria-label="Affiliate disclosure"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 5.5V8.5M6 3.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Disclosure
          </Link>
        </div>
      </div>

      {/* Mobile nav drawer — scrollable horizontal */}
      <nav
        className="flex md:hidden overflow-x-auto gap-1 px-4 pb-2.5 no-scrollbar max-w-full"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {[
          { href: '/', label: '⚡ Home' },
          { href: '/categories', label: '📂 Categories' },
          { href: '/#gear-finder', label: '🎯 Gear Finder' },
          { href: '/methodology', label: '🔬 Methodology' },
          { href: '/about', label: '👋 About' },
          { href: '/disclosure', label: '⚖️ Disclosure' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-neutral-400 hover:text-offwhite hover:border-white/20 transition-all duration-150 whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
