import type { Metadata } from 'next';
import { CompareWorkspace } from '@/components/CompareWorkspace';
import { getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Compare products',
    description: 'Side-by-side comparison of selected fitness gear with shared URL state.',
    canonical: '/compare',
    noindex: true,
  });
}

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string; sort?: string } }) {
  const products = await getAllProducts();
  const ids = searchParams.ids?.split(',').map((id) => id.trim()).filter(Boolean) || [];
  const selected = ids.length > 0 ? products.filter((product) => ids.includes(product.id) || ids.includes(product.asin)) : [];

  return <CompareWorkspace products={selected} />;
}