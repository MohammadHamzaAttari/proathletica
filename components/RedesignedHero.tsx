'use client';

import { motion } from 'framer-motion';
import { Search, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RedesignedHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden bg-[#05070a]">
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
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border-white/10 text-offwhite/80 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="flex h-2 w-2 rounded-full bg-data-lime animate-pulse" />
                Independent Data Labs
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-offwhite leading-[0.95] tracking-tight">
                THE FUTURE OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-data-lime to-emerald-400">HOME FITNESS.</span>
              </h1>

              <p className="mt-8 text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
                We&apos;ve decoded 47,000+ data points to rank the gear that actually transforms your home gym. No fluff, just science-backed rankings.
              </p>
            </motion.div>

            {/* Amazon-style Functional Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-2xl group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-data-lime/20 to-trust-blue/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative flex items-center bg-graphite-900 border border-white/10 rounded-2xl p-2 focus-within:border-data-lime/50 transition-all">
                <Search className="w-6 h-6 text-neutral-500 ml-4" />
                <input
                  type="text"
                  placeholder="What are you training for? (e.g. Strength, Fat Loss, Recovery)"
                  className="w-full bg-transparent border-none focus:ring-0 text-offwhite px-4 py-3 text-lg placeholder:text-neutral-600"
                />
                <button className="bg-data-lime text-black font-black px-8 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter">
                  Search
                </button>
              </div>
              <div className="mt-4 flex gap-4 text-xs font-bold text-neutral-500 uppercase tracking-widest ml-2">
                <span>Trending:</span>
                <Link href="/category/dumbbells" className="hover:text-data-lime transition-colors">Dumbbells</Link>
                <Link href="/category/benches" className="hover:text-data-lime transition-colors">Benches</Link>
                <Link href="/category/racks" className="hover:text-data-lime transition-colors">Power Racks</Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <Link href="#top-picks" className="cta-primary h-14 px-10 rounded-2xl">
                Explore Rankings
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/methodology" className="flex items-center gap-3 text-offwhite hover:text-data-lime transition-colors font-bold group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-data-lime/50 transition-all">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </div>
                See How We Test
              </Link>
            </motion.div>
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
                    src="/images/hero-bg.png"
                    alt="Hero Showcase"
                    fill
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
