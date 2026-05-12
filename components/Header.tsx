import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-black">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-xl font-black uppercase italic tracking-tight text-white">
            ProAthletica
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wider text-neutral-300 md:flex">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/categories" className="hover:text-white">Categories</Link>
          <Link href="/methodology" className="hover:text-white">Methodology</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/disclosure" className="hover:text-white">Disclosure</Link>
        </nav>

        {/* Mobile search link */}
        <Link
          href="/search"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/5 md:hidden"
        >
          Search
        </Link>
      </div>
    </header>
  );
}
