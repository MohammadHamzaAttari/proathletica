import Link from 'next/link';
import { Dumbbell, Search } from 'lucide-react';

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0D12]/90 backdrop-blur-xl"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">

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
        <div className="flex items-center gap-2">
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

          {/* Search — mobile + desktop */}
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-neutral-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-offwhite transition-all duration-150 focus-ring"
            aria-label="Search products"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline text-xs tracking-wide">Search</span>
          </Link>
        </div>
      </div>

      {/* Mobile nav drawer — scrollable horizontal */}
      <nav
        className="flex md:hidden overflow-x-auto gap-1 px-4 pb-2.5 no-scrollbar"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {[
          { href: '/', label: '⚡ Home' },
          { href: '/categories', label: '📂 Categories' },
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
