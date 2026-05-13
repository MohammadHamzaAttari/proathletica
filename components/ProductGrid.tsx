'use client';

import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { useState } from 'react';
import { StickyCompareBar } from './StickyCompareBar';

type EnhancedProduct = Product & { 
  short_title?: string | null; 
  editorial_summary?: string | null;
  position?: number; 
  custom_blurb?: string | null;
};

export function ProductGrid({
  products,
  articleSlug,
}: {
  products: EnhancedProduct[];
  articleSlug: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedProducts = products.filter(p => selectedIds.has(p.id));

  const toggleCompare = (productId: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(productId);
        if (newSet.size > 4) {
          // Keep only the last 4
          const first = Array.from(newSet)[0];
          newSet.delete(first);
        }
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const clearCompare = () => setSelectedIds(new Set());

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            rank={index} 
            articleSlug={articleSlug}
            onCompareToggle={toggleCompare}
            isSelected={selectedIds.has(product.id)}
          />
        ))}
      </div>

      <StickyCompareBar
        selectedProducts={selectedProducts}
        onRemove={(id) => toggleCompare(id, false)}
        onClear={clearCompare}
      />
    </>
  );
}
