/**
 * FIX (Audit #03-A + Amazon Associates compliance):
 * This disclosure MUST appear above every product grid.
 * "As an Amazon Associate I earn from qualifying purchases" is required language.
 * "Independent Lab Protocol" alone is NOT an FTC disclosure — fixed here.
 */
export function DisclosureBar() {
  return (
    <div className="border-y border-emerald-500/15 bg-emerald-500/5">
      <div className="mx-auto max-w-6xl px-4 py-3 text-center text-[11px] font-medium text-emerald-100 sm:px-8">
        <strong className="font-black uppercase tracking-wider text-emerald-300">
          Affiliate disclosure:
        </strong>{' '}
        As an Amazon Associate we earn from qualifying purchases. Some links on this page are
        affiliate links — at no extra cost to you, we may earn a small commission if you click
        through and buy.
      </div>
    </div>
  );
}
