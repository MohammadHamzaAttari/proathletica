'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CompareItem {
  id: string;
  short_title?: string | null;
  title: string;
  image_url?: string | null;
  price_cents?: number | null;
}

export function StickyCompareBar({
  selectedProducts,
  onRemove,
  onClear,
}: {
  selectedProducts: CompareItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedProducts.length >= 2);
  }, [selectedProducts.length]);

  if (!isVisible || selectedProducts.length === 0) return null;

  const handleCompare = () => {
    // Open modal or navigate to compare view in future implementation
    alert(`Comparing ${selectedProducts.length} products: ${selectedProducts.map(p => p.short_title || p.title).join(', ')}\n\n(Full side-by-side modal coming in next iteration)`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#C6FF3D]/30 bg-[#0E1116] p-4 shadow-2xl">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[#C6FF3D]/10 px-5 py-2 text-sm font-black tracking-widest text-[#C6FF3D]">
            COMPARE
          </div>
          <div className="text-sm text-neutral-400">
            {selectedProducts.length}/4 selected
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-[10px] font-black text-neutral-400">P</div>
              )}
              <button
                onClick={() => onRemove(product.id)}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {selectedProducts.length < 4 && (
            <div className="h-11 w-11 rounded-2xl border border-dashed border-white/30 flex items-center justify-center text-xs text-neutral-500">
              +
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-neutral-400 hover:text-white transition"
          >
            Clear
          </button>
          <button
            onClick={handleCompare}
            className="rounded-2xl bg-[#FF6B1A] px-8 py-3 font-black uppercase tracking-widest text-black text-sm hover:bg-[#ff8a4d] transition"
          >
            Compare ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
}
