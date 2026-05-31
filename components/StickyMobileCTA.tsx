'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/lib/types';

export function StickyMobileCTA({ product, articleSlug }: { product: Product; articleSlug: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 800px (typically past the hero and first pick box)
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackHref = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=1`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden"
        >
          <div className="glass shadow-[0_-8px_30px_rgba(0,0,0,0.5)] rounded-2xl border-white/10 p-3 flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-white p-1 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url.replace(/\._AC_UL\d+_\.jpg/, '._AC_SL200_.jpg')}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-graphite-900 text-[10px] font-bold">PA</div>
              )}
              <div className="absolute -top-1 -left-1 bg-data-lime rounded-full p-0.5 shadow-sm">
                <Star className="w-2.5 h-2.5 fill-black text-black" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-data-lime uppercase tracking-widest leading-none mb-1">Top Pick</div>
              <div className="text-xs font-bold text-offwhite truncate leading-tight">
                {product.short_title || product.title}
              </div>
            </div>

            <a
              href={trackHref}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="bg-data-lime text-black px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-glow-lime active:scale-95 transition-all"
            >
              Check Price
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
