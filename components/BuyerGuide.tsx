import { ShieldCheck, Target, Trophy } from 'lucide-react';

export function BuyerGuide({ category = 'fitness gear' }: { category?: string }) {
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="rounded-3xl border border-white/5 bg-neutral-900/40 p-8">
      <h2 className="mb-6 text-3xl font-black uppercase italic tracking-tight text-white">
        How to choose the best {title}
      </h2>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-neutral-400">
        Use the category page as a starting point, then compare price, footprint, durability, and the
        exact use case you want to solve. The right pick is usually the one that removes the most
        friction from training, not the one with the loudest marketing.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
          <Target className="mb-3 h-5 w-5 text-emerald-400" />
          <h3 className="mb-2 font-black uppercase tracking-wide text-white">Match your goal</h3>
          <p className="text-sm text-neutral-400">
            Buy for your actual training use case: heavy lifting, endurance work, recovery, mobility,
            or small-space convenience.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
          <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />
          <h3 className="mb-2 font-black uppercase tracking-wide text-white">Check durability</h3>
          <p className="text-sm text-neutral-400">
            Favor materials, warranty coverage, and construction details that hold up after repeated
            use. A cheaper product is not a better deal if it fails early.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
          <Trophy className="mb-3 h-5 w-5 text-emerald-400" />
          <h3 className="mb-2 font-black uppercase tracking-wide text-white">Compare tradeoffs</h3>
          <p className="text-sm text-neutral-400">
            Compare footprint, adjustability, comfort, and price together. The best overall pick is not
            always the best budget or premium pick.
          </p>
        </div>
      </div>
    </div>
  );
}
