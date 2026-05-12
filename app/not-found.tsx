import Link from 'next/link';
import { Home } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({ title: 'Page Not Found', noindex: true });

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-7xl font-black uppercase italic text-emerald-500">404</div>
      <h1 className="mb-4 text-3xl font-black uppercase italic tracking-tight">Page Not Found</h1>
      <p className="mb-8 max-w-md text-neutral-400">
        We couldn&apos;t find that page. It may have moved or no longer exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black uppercase tracking-widest text-black hover:bg-emerald-400"
      >
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
