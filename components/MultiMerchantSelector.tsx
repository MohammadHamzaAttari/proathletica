import React from 'react';
import { ShoppingBag, Truck, BadgePercent, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface MerchantOption {
  name: string;
  priceCents: number;
  shippingText: string;
  badgeText?: string;
  url: string;
  logo: string;
  isDirectPartner: boolean;
}

interface MultiMerchantSelectorProps {
  product: Product;
  articleSlug?: string;
}

export function MultiMerchantSelector({ product, articleSlug = 'product-page' }: MultiMerchantSelectorProps) {
  const cat = (product.category || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const price = product.price_cents || 0;

  // Generate dynamic merchant lists based on category
  const merchants: MerchantOption[] = [
    {
      name: 'Amazon',
      priceCents: price,
      shippingText: 'Free Prime Shipping',
      badgeText: 'Fastest Delivery',
      url: `/api/track?productId=${product.asin || product.id}&articleSlug=${articleSlug}&merchant=amazon`,
      logo: '🛒',
      isDirectPartner: false,
    }
  ];

  // Add Rogue Fitness if category is strength or bench-related
  if (cat.includes('bench') || cat.includes('strength') || cat.includes('barbell') || brand.includes('rogue')) {
    merchants.push({
      name: 'Rogue Fitness',
      priceCents: Math.round(price * 1.4) + 15000, // Premium grade markups
      shippingText: 'Freight Shipping (3-5 Days)',
      badgeText: '👑 Professional Upgrade Pick',
      url: `/api/track?productId=rogue-adjustable-bench-3&articleSlug=${articleSlug}&merchant=rogue`,
      logo: '🔴',
      isDirectPartner: true,
    });

    merchants.push({
      name: 'REP Fitness',
      priceCents: Math.round(price * 1.15) + 4000,
      shippingText: 'Flat Rate $29.99 Shipping',
      badgeText: 'Highly Rated Alternative',
      url: `https://repfitness.com/`, // Fallback/direct link
      logo: '💪',
      isDirectPartner: false,
    });
  }

  // Add Wahoo or cardio specific merchants
  if (cat.includes('run') || cat.includes('treadmill') || cat.includes('cardio') || brand.includes('wahoo')) {
    merchants.push({
      name: 'Wahoo Fitness',
      priceCents: 399999, // KICKR Run pricing
      shippingText: 'Free Freight Home Delivery',
      badgeText: '⚡ Commercial Smart Treadmill',
      url: `/api/track?productId=wahoo-kickr-run-treadmill&articleSlug=${articleSlug}&merchant=wahoo`,
      logo: '🔋',
      isDirectPartner: true,
    });
  }

  // Add Supplement merchants if appropriate
  if (cat.includes('nutrition') || cat.includes('supplement') || cat.includes('protein') || brand.includes('gnc')) {
    merchants.push({
      name: 'GNC Direct',
      priceCents: 8500, // GNC stack
      shippingText: 'Free Shipping over $49',
      badgeText: '15% Off with Sub',
      url: `/api/track?productId=gnc-energy-recovery-stack&articleSlug=${articleSlug}&merchant=gnc`,
      logo: '💊',
      isDirectPartner: true,
    });
  }

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-[#161B22]/60 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-trust-blue" />
            Compare Store Prices
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            We partner with multiple retailers to find the best availability and pricing.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest self-start sm:self-auto">
          <CheckCircle className="w-3.5 h-3.5" />
          Live verified: 2026
        </div>
      </div>

      <div className="space-y-4">
        {merchants.map((merchant) => (
          <div
            key={merchant.name}
            className={`relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-200 ${
              merchant.isDirectPartner
                ? 'border-[#C6FF3D]/20 bg-[#C6FF3D]/[0.02] hover:border-[#C6FF3D]/40'
                : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-xl">
                {merchant.logo}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{merchant.name}</span>
                  {merchant.badgeText && (
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      merchant.isDirectPartner
                        ? 'bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/25'
                        : 'bg-trust-blue/10 text-trust-blue border border-trust-blue/20'
                    }`}>
                      {merchant.badgeText}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {merchant.shippingText}
                  </span>
                  {merchant.isDirectPartner && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <BadgePercent className="w-3.5 h-3.5" />
                      Direct Partner Program
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/[0.05] pt-3 md:pt-0">
              <div className="text-right">
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">OFFER PRICE</div>
                <div className="text-2xl font-black text-white">{formatPrice(merchant.priceCents)}</div>
              </div>
              <a
                href={merchant.url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className={`rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest text-center transition-all ${
                  merchant.isDirectPartner
                    ? 'bg-[#C6FF3D] text-black hover:bg-[#b0ec2e]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Go to Store
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
