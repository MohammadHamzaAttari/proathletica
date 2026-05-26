'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { PriceDropModal } from './PriceDropModal';
import type { Product } from '@/lib/types';

interface PriceTrackerTriggerProps {
  product: Product;
}

export function PriceTrackerTrigger({ product }: PriceTrackerTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01] hover:bg-white/[0.03] py-3 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all duration-200"
      >
        <Bell className="w-4 h-4 text-[#C6FF3D]" />
        Track Price Drop
      </button>

      <PriceDropModal
        product={product}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
