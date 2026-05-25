'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { ArrowRight, Trophy } from 'lucide-react';

interface FloatingMobileCTAProps {
  product: Product;
  articleSlug: string;
}

export function FloatingMobileCTA({ product, articleSlug }: FloatingMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px (roughly past hero/verdict box area)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shortTitle = product.short_title || product.title.split(' ').slice(0, 5).join(' ');
  const trackHref = `/api/track?productId=${encodeURIComponent(product.asin || product.id)}&articleSlug=${encodeURIComponent(articleSlug)}&rank=1`;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-3.5 bg-[#090C10]/95 border-t border-white/[0.08] backdrop-blur-xl transition-all duration-300 transform md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.5)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      role="complementary"
      aria-label="Sticky recovery CTA"
    >
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {product.image_url && (
            <div className="relative w-10 h-10 rounded-lg bg-black/40 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
              <Image
                src={product.image_url.replace(/\._AC_UL\d+_\.jpg/, '._AC_SL150_.jpg')}
                alt={shortTitle}
                fill
                className="object-contain p-0.5"
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-black text-offwhite truncate leading-tight">
              {shortTitle}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-widest text-[#C6FF3D]">
                <Trophy className="w-2.5 h-2.5" /> #1 PICK
              </span>
              {product.price_cents && (
                <span className="text-[10px] font-mono text-neutral-400">
                  • {formatPrice(product.price_cents)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pulsing CTA Action */}
        <a
          href={trackHref}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center justify-center gap-1 bg-[#C6FF3D] hover:bg-[#b3f024] text-black text-[10px] font-black uppercase tracking-widest px-4.5 py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/10"
        >
          SEE PRICE <ArrowRight className="w-3 h-3 text-black" />
        </a>
      </div>
    </div>
  );
}
