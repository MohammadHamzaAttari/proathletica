import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export function ProductGrid({
  products,
  articleSlug,
}: {
  products: Array<Product & { position?: number; custom_blurb?: string | null }>;
  articleSlug: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} rank={index} articleSlug={articleSlug} />
      ))}
    </div>
  );
}
