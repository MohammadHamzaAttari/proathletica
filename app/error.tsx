'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tight text-white">
        Something went wrong
      </h1>
      <p className="mb-8 text-neutral-400">
        A server or rendering error occurred. Try again or return to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-black"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-wider text-white"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
