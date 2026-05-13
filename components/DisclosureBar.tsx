/**
 * FIX (Audit #03-A + Amazon Associates compliance):
 * This disclosure MUST appear above every product grid.
 * "As an Amazon Associate I earn from qualifying purchases" is required language.
 * "Independent Lab Protocol" alone is NOT an FTC disclosure — fixed here.
 */
export function DisclosureBar() {
  return (
    <details className="border-y border-emerald-500/15 bg-emerald-500/5 group">
      <summary className="mx-auto flex max-w-6xl cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[11px] font-medium text-emerald-100 sm:px-8 [&::-webkit-details-marker]:hidden">
        <span>
          <strong className="font-black uppercase tracking-wider text-emerald-300">Affiliate disclosure:</strong>{' '}
          As an Amazon Associate we earn from qualifying purchases.
        </span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          Expand
        </span>
      </summary>
      <div className="mx-auto max-w-6xl px-4 pb-4 text-[11px] leading-6 text-emerald-100/80 sm:px-8">
        Some links on this page are affiliate links — at no extra cost to you, we may earn a small commission if you click through and buy.
      </div>
    </details>
  );
}
