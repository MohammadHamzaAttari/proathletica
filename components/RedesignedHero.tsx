'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RedesignedHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    params.delete('page'); // Reset pagination on new search

    router.push(`/?${params.toString()}#top-picks`, { scroll: true });
  };

  return (
    <section className="relative min-h-[500px] flex items-center pt-16 pb-12 overflow-hidden bg-[#05070a]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-data-lime/20 blur-[120px] rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-trust-blue/20 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-morphism border-white/10 text-offwhite/80 text-[10px] font-bold tracking-widest uppercase mb-4">
                <span className="flex h-1.5 w-1.5 rounded-full bg-data-lime animate-pulse" />
                Independent Data Labs
              </div>

              <div className="text-4xl md:text-6xl lg:text-7xl font-black text-offwhite leading-[0.95] tracking-tight">
                BEST HOME <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-data-lime to-emerald-400 uppercase">FITNESS GEAR 2026.</span>
              </div>

              <p className="mt-4 text-base md:text-lg text-neutral-400 max-w-xl leading-relaxed">
                We&apos;ve decoded 47,000+ data points to rank the gear that actually transforms your home gym. No fluff, just science-backed rankings.
              </p>
            </div>

            {/* Amazon-style Functional Search */}
            <div className="relative max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-data-lime/20 to-trust-blue/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-graphite-900 border border-white/10 rounded-2xl p-1.5 focus-within:border-data-lime/50 transition-all"
              >
                <Search className="w-5 h-5 text-neutral-500 ml-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you training for?"
                  aria-label="Search training goal"
                  className="w-full bg-transparent border-none focus:ring-0 text-offwhite px-3 py-2 text-base placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="bg-data-lime text-black font-black px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter text-sm"
                >
                  Search
                </button>
              </form>
              <div className="mt-3 flex gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-2">
                <span>Trending:</span>
                <Link href="/?q=dumbbells#top-picks" className="hover:text-data-lime transition-colors">Dumbbells</Link>
                <Link href="/?q=benches#top-picks" className="hover:text-data-lime transition-colors">Benches</Link>
                <Link href="/?q=racks#top-picks" className="hover:text-data-lime transition-colors">Power Racks</Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <Link href="#top-picks" className="cta-primary h-12 px-8 rounded-xl text-sm">
                Explore Rankings
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/methodology" className="flex items-center gap-2.5 text-offwhite hover:text-data-lime transition-colors font-bold group text-sm">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-data-lime/50 transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                See How We Test
              </Link>
            </div>
          </div>

          {/* Right Content - Visual Showcase */}
          <div className="lg:col-span-5 relative hidden lg:block">
             <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative aspect-square w-full"
             >
                {/* Floating "Card" UI elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 left-0 z-20 glass-morphism p-6 rounded-3xl border-white/10 w-64 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-data-lime/20 flex items-center justify-center text-data-lime font-black">#1</div>
                    <div>
                      <div className="text-xs text-neutral-500 font-bold uppercase">Best Rated</div>
                      <div className="text-sm text-offwhite font-black">PowerBlock Elite</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-data-lime shadow-[0_0_10px_rgba(198,255,61,0.5)]"
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-data-lime font-black text-right">98% SCORE</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-10 right-0 z-20 glass-morphism p-6 rounded-3xl border-white/10 w-64 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-trust-blue w-5 h-5" />
                    <div className="text-sm text-offwhite font-black uppercase">Verified Data</div>
                  </div>
                  <p className="text-xs text-neutral-400 font-medium">Verified from 4.2k user testing hours and real-world durability tests.</p>
                </motion.div>

                {/* Main Hero Image */}
                <div className="relative h-full w-full rounded-full border border-white/5 p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-data-lime/10 to-transparent" />
                  <Image
                    src="/images/hero-bg.webp"
                    alt="Hero Showcase"
                    fill
                    priority
                    quality={75}
                    sizes="(max-width: 1024px) 1px, 600px"
                    className="object-cover rounded-full opacity-60 mix-blend-screen"
                  />
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
