'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { StickyCompareBar } from '@/components/StickyCompareBar';

interface CompareItem {
  id: string;
  short_title?: string | null;
  title: string;
  image_url?: string | null;
  price_cents?: number | null;
  rating?: number | null;
  editorial_summary?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
  best_for_tags?: string[] | null;
  specs?: Record<string, string> | null;
}

interface CompareContextValue {
  selectedProducts: CompareItem[];
  addProduct: (product: CompareItem) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  isSelected: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue>({
  selectedProducts: [],
  addProduct: () => {},
  removeProduct: () => {},
  clearProducts: () => {},
  isSelected: () => false,
});

export function useCompare() {
  return useContext(CompareContext);
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<CompareItem[]>([]);

  const addProduct = useCallback((product: CompareItem) => {
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearProducts = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedProducts.some((p) => p.id === id),
    [selectedProducts]
  );

  return (
    <CompareContext.Provider value={{ selectedProducts, addProduct, removeProduct, clearProducts, isSelected }}>
      {children}
      <StickyCompareBar
        selectedProducts={selectedProducts}
        onRemove={removeProduct}
        onClear={clearProducts}
      />
    </CompareContext.Provider>
  );
}
