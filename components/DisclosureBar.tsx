import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

/**
 * FTC + Amazon Associates compliance:
 * "As an Amazon Associate I earn from qualifying purchases" is required language.
 * Must appear visibly above product listings.
 */
export function DisclosureBar() {
  return (
    <div className="border-b border-trust-blue/10 bg-trust-blue/[0.04]" role="note" aria-label="Affiliate disclosure">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-trust-blue flex-shrink-0" aria-hidden="true" />
          <p className="text-xs text-neutral-400 leading-tight">
            <span className="font-bold text-neutral-300">Affiliate disclosure: </span>
            As an Amazon Associate we earn from qualifying purchases — at no extra cost to you.
            Rankings are{' '}
            <span className="font-bold text-neutral-300">never</span>
            {' '}influenced by commission rates.
          </p>
        </div>
        <Link
          href="/disclosure"
          className="flex-shrink-0 text-2xs font-bold uppercase tracking-[0.15em] text-trust-blue hover:text-offwhite transition-colors whitespace-nowrap"
          aria-label="Read full affiliate disclosure"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
